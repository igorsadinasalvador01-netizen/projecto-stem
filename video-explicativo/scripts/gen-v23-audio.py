#!/usr/bin/env python3
"""Vídeo 23 ("Dois centímetros"): mistura final — a dinâmica sonora do vídeo 22 elevada.

Uso: gen-v23-audio.py <narracao_cortada.wav> <cuts23.json> <timeline23.json> <words23.json> <saida.wav> <duracao_total_s>

- Partitura por secções (Lá menor, 88 BPM), sempre baixa e nivelada (~23 dB abaixo da voz):
  abertura com piano em notas soltas e um tique de "medição"; a situação com pad, arpejo e pulso
  leve; P&B (incompatibilidade / retrabalho) só com drone grave e pulsação tipo coração; a causa a
  crescer; a lição mais luminosa (F–C–G–Am) com piano, pluck e bateria suave; fecho resolvido.
- Foley do tema: fita métrica a puxar ("2 cm"), um toque cerâmico por cada azulejo colocado (no
  mesmo instante em que cada um aparece), lápis a desenhar as cotas, rachar de cerâmica na
  incompatibilidade, corte, roquete, carimbo do X, visto positivo.
- Entradas e transições em destaque (vidro, pops, impacto nos zooms, sopros com estéreo nas mudanças
  do quadrado, mergulho/brilho no P&B), cada uma colocada no estéreo onde o elemento aparece.
- Teclado nas legendas com a mesma regra de tempo do vídeo (typeDur) + barra de espaço suave entre
  palavras e "enter" no fim das frases. Nada começa antes do início real da palavra; nenhum som sobe
  de tom (sem sirenes).
"""
import importlib.util
import json
import math
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, "scripts", f"{name}.py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


a19 = load("gen-v19-audio")
a20 = load("gen-v20-audio")
SR = 48000
narr_path, cuts_path, tl_path, words_path, out, total = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], float(sys.argv[6])
N = int(total * SR)
C = json.load(open(cuts_path))
TL = json.load(open(tl_path))
WORDS = json.load(open(words_path))
SEGS, o = [], 0.0
for a, b in C["keep"]:
    SEGS.append((a / C["fps"], b / C["fps"], o))
    o += (b - a) / C["fps"]


def M(x):
    for s, e, oo in SEGS:
        if x < s:
            return oo
        if x <= e:
            return oo + (x - s)
    s, e, oo = SEGS[-1]
    return oo + (e - s) + (x - e)


rng = np.random.default_rng(232)


class Bus:
    def __init__(self):
        self.x = np.zeros((N, 2))

    def add(self, t0, sig, gain=1.0, pan=0.5):
        i = int(round(t0 * SR))
        if sig.ndim == 1:
            g = np.array([np.cos(pan * np.pi / 2), np.sin(pan * np.pi / 2)]) * 1.414
            sig = sig[:, None] * g[None, :]
        else:
            g = np.array([np.cos(pan * np.pi / 2), np.sin(pan * np.pi / 2)]) * 1.414
            sig = sig * g[None, :]
        if i < 0:
            sig, i = sig[-i:], 0
        if i >= N:
            return
        j = min(N, i + len(sig))
        self.x[i:j] += sig[: j - i] * gain


def tv(d):
    return np.arange(int(d * SR)) / SR


# ——————————————— sons de entrada / transição ———————————————
def air(d=0.36, lo=500, top=3600, bottom=1200, direction=0.0, seed=None):
    """sopro de ar sem tom: ruído filtrado com o centro a descer; o estéreo acompanha o movimento"""
    r = np.random.default_rng(seed) if seed is not None else rng
    t = tv(d)
    u = t / d
    env = np.sin(np.pi * np.clip(u * 1.15, 0, 1)) ** 1.4 * np.minimum(1, t / 0.006)
    outc = []
    for ch in range(2):
        y = a19.lp_sweep(a19.hp(r.standard_normal(len(t)), lo), lambda s: top - (top - bottom) * (s / d), block=240)
        y = a19.lp(y, 7000) * env
        pan = 0.5 + direction * (u - 0.5)
        outc.append(y * (np.cos(pan * np.pi / 2) if ch == 0 else np.sin(pan * np.pi / 2)) * 1.414)
    return np.stack(outc, 1)


def glass_tap(level=1.0):
    """toque de vidro: parciais inarmónicas curtas (não sustenta, não sobe)"""
    t = tv(0.32)
    x = np.zeros(len(t))
    base = rng.uniform(2300, 2700)
    for ratio, a, d in [(1.0, 1.0, 0.07), (1.47, 0.6, 0.05), (2.09, 0.4, 0.035), (2.76, 0.25, 0.025)]:
        x += a * np.sin(2 * np.pi * base * ratio * t + rng.uniform(0, 6.28)) * np.exp(-t / d)
    click = a19.hp(rng.standard_normal(len(t)), 4000) * np.exp(-t / 0.0012) * 0.5
    return (x * 0.5 + click) * np.minimum(1, t / 0.0008) * level


def enter(direction=0.0):
    """painel de vidro a entrar: ar curto + toque de vidro + corpo grave"""
    d = 0.30
    a = air(d, 600, 4200, 1500, direction)
    t = tv(d)
    body = np.sin(2 * np.pi * np.cumsum(120 + 80 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.07) * 0.45
    x = a * 0.9
    x[:, 0] += body
    x[:, 1] += body
    tap = glass_tap(0.55)
    n = min(len(tap), len(x))
    x[:n] += tap[:n, None] * np.array([1.0, 1.0])
    return x


def pop(f=760.0, level=1.0):
    t = tv(0.16)
    f_t = f * (1 + 0.5 * np.exp(-t / 0.012))
    ph = 2 * np.pi * np.cumsum(f_t) / SR
    body = (np.sin(ph) + 0.18 * np.sin(2 * ph)) * np.exp(-t / 0.045)
    click = a19.hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.0015) * 0.14
    return a19.lp((body + click) * np.minimum(1, t / 0.0015), 6500) * level


def slam(level=1.0):
    """puxada de zoom: impacto grave + estalo + sopro curto que nasce no próprio impacto"""
    t = tv(0.9)
    boom = np.sin(2 * np.pi * np.cumsum(42 + 70 * np.exp(-t / 0.045)) / SR) * np.exp(-t / 0.28)
    crack = a19.bp(rng.standard_normal(len(t)), 900, 5000) * np.exp(-t / 0.008) * 0.55
    thump = a19.lp(rng.standard_normal(len(t)), 260, order=4) * np.exp(-t / 0.06) * 1.6
    x = np.tanh(1.5 * (boom + crack + thump)) / np.tanh(1.5)
    st = np.stack([x, x], 1) * level
    a = air(0.24, 800, 5200, 1800)
    st[: len(a)] += a * 0.55 * level
    return st


def chime(level=1.0, big=False):
    t = tv(1.4 if big else 1.0)
    x = np.zeros(len(t))
    for f, a, d in [(1174.7, 1.0, 0.8), (1760.0, 0.5, 0.55), (2349.3, 0.22, 0.3)] + ([(587.3, 0.5, 1.1)] if big else []):
        x += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / d)
    x *= np.minimum(1, t / 0.004)
    thump = np.sin(2 * np.pi * np.cumsum(48 + 40 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.18) * 0.9
    return (a19.lp(x, 7000) * 0.5 + thump) * level


def strike(level=1.0):
    t = tv(0.18)
    return a19.lp_sweep(a19.hp(rng.standard_normal(len(t)), 900), lambda s: 5200 - 3000 * s / 0.18, block=240) * np.sin(np.pi * t / 0.18) ** 2 * level


def tick(level=1.0):
    t = tv(0.04)
    return a19.bp(rng.standard_normal(len(t)), 2200, 6000) * np.exp(-t / 0.005) * level


def shimmer(d=1.2, level=1.0):
    """linha a desenhar-se: ar fino com micro-granulado (sem tom)"""
    t = tv(d)
    g = np.abs(np.sin(2 * np.pi * 23 * t + 3 * np.sin(2 * np.pi * 3 * t)))
    x = a19.bp(rng.standard_normal(len(t)), 3500, 9000) * (0.4 + 0.6 * g) * np.sin(np.pi * t / d) ** 1.2
    return x * level


def drop(level=1.0):
    """entrada no P&B: mergulho grave + ar a fechar para baixo (sem tom)"""
    t = tv(1.3)
    boom = np.sin(2 * np.pi * np.cumsum(55 * np.exp(-t / 0.9) + 26) / SR) * np.exp(-t / 0.55)
    nz = a19.lp_sweep(rng.standard_normal(len(t)), lambda s: 2600 * np.exp(-s / 0.25) + 120, block=240) * np.exp(-t / 0.4) * 0.7
    x = np.tanh(1.3 * (boom + nz)) * level
    return np.stack([x, x], 1)


def bloom(level=1.0):
    """a cor volta: brilho de ar a abrir + acorde curto de vidro"""
    d = 0.7
    t = tv(d)
    nz = a19.lp_sweep(a19.hp(rng.standard_normal(len(t)), 1500), lambda s: 2500 + 6000 * min(1, s / 0.25), block=240) * np.exp(-t / 0.22) * np.minimum(1, t / 0.01)
    x = np.stack([nz, nz], 1) * 0.8
    c = chime(0.7, False)
    n = min(len(c), len(x))
    x[:n] += c[:n, None] * 0.6
    return x * level


# ——————————————— teclado ———————————————
def key_variant(seed, heavy=False):
    r = np.random.default_rng(seed)
    t = tv(0.11)
    click = a19.bp(r.standard_normal(len(t)), 2500 * r.uniform(0.85, 1.2), 9000) * np.exp(-t / 0.0022) * r.uniform(0.8, 1.1)
    body = a19.bp(r.standard_normal(len(t)), 280 * r.uniform(0.85, 1.15), 900) * np.exp(-t / (0.016 if heavy else 0.010)) * (1.1 if heavy else 0.75)
    bottom = np.sin(2 * np.pi * r.uniform(170, 240) * t) * np.exp(-t / 0.012) * (0.6 if heavy else 0.35)
    x = click + body + bottom
    # tecla a voltar (mais fraca, 35–55 ms depois)
    k = int(r.uniform(0.035, 0.055) * SR)
    rel = a19.bp(r.standard_normal(len(t)), 3000, 9000) * np.exp(-t / 0.0015) * 0.35
    x[k:] += rel[: len(x) - k]
    return x * np.minimum(1, t / 0.0004)


KEYS = [key_variant(100 + i) for i in range(14)]
ENTER = [key_variant(300 + i, heavy=True) for i in range(3)]


# ——————————————— foley do tema (obra / medição) ———————————————
def tape(level=1.0):
    """fita métrica a sair: catraca a acelerar + fita a deslizar (sem tom)"""
    d = 0.7
    t = tv(d)
    x = a19.bp(rng.standard_normal(len(t)), 1800, 7000) * np.exp(-((t - 0.32) / 0.25) ** 2) * 0.35
    tt = 0.0
    gap = 0.07
    while tt < 0.55:
        i = int(tt * SR)
        n = int(0.012 * SR)
        x[i : i + n] += a19.bp(rng.standard_normal(n), 2500, 9000) * np.exp(-np.arange(n) / SR / 0.0018) * 1.1
        tt += gap
        gap = max(0.018, gap * 0.82)
    return x * level


def tile_tap(level=1.0):
    """azulejo assente: toque cerâmico curto (ressonância aleatória entre 1,7 e 2,8 kHz)"""
    t = tv(0.09)
    f = rng.uniform(1700, 2800)
    x = np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / 0.018) * 0.6
    x += a19.bp(rng.standard_normal(len(t)), 1500, 7000) * np.exp(-t / 0.004)
    x += np.sin(2 * np.pi * rng.uniform(160, 220) * t) * np.exp(-t / 0.02) * 0.5
    return x * np.minimum(1, t / 0.0004) * level


def pencil(d=0.9, level=1.0):
    """lápis a desenhar as cotas: grão de papel com traços"""
    t = tv(d)
    strokes = np.abs(np.sin(2 * np.pi * 2.6 * t)) ** 0.6
    grain = np.abs(a19.lp(rng.standard_normal(len(t)), 40)) * 6
    x = a19.bp(rng.standard_normal(len(t)), 2000, 8000) * strokes * np.clip(grain, 0, 1.5) * np.sin(np.pi * t / d) ** 0.8
    return x * level


def clash(level=1.0):
    """rachar de cerâmica: estalo seco + estilhaços curtos + grave"""
    t = tv(0.9)
    crack = a19.bp(rng.standard_normal(len(t)), 1200, 9000) * np.exp(-t / 0.012) * 1.2
    for _ in range(9):
        i = int(rng.uniform(0.01, 0.25) * SR)
        n = int(0.03 * SR)
        f = rng.uniform(2200, 4200)
        crack[i : i + n] += np.sin(2 * np.pi * f * np.arange(n) / SR) * np.exp(-np.arange(n) / SR / 0.008) * rng.uniform(0.2, 0.45)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.3)
    x = np.tanh(1.3 * (crack + boom))
    return np.stack([x, x], 1) * level


def cut_saw(level=1.0):
    """corte: rajada de ruído com modulação rápida (sem tom definido)"""
    t = tv(0.42)
    am = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 38 * t))
    x = a19.bp(rng.standard_normal(len(t)), 900, 6500) * am * np.sin(np.pi * t / 0.42) ** 0.7
    return a19.lp(x, 7000) * level


def ratchet(level=1.0):
    x = np.zeros(int(0.45 * SR))
    for j in range(4):
        i = int(j * 0.095 * SR)
        n = int(0.03 * SR)
        x[i : i + n] += (a19.bp(rng.standard_normal(n), 1500, 8000) * np.exp(-np.arange(n) / SR / 0.004) + np.sin(2 * np.pi * 1200 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR / 0.006) * 0.3)
    return x * level


def stamp(level=1.0):
    """X carimbado: batida seca grave + estalo de papel"""
    t = tv(0.4)
    body = np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.08)
    snap = a19.bp(rng.standard_normal(len(t)), 800, 6000) * np.exp(-t / 0.01) * 0.8
    return np.tanh(1.4 * (body + snap)) * level


def check(level=1.0):
    """visto positivo: duas notas curtas e limpas (quinta descendente, não sobe)"""
    x = np.zeros(int(0.9 * SR))
    for j, f in enumerate([1318.5, 987.8]):
        t = tv(0.7)
        y = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.05)) * np.exp(-t / 0.22) * np.minimum(1, t / 0.003)
        i = int(j * 0.09 * SR)
        x[i : i + len(y)] += y[: len(x) - i] * (1.0 if j == 0 else 0.8)
    return a19.lp(x, 8000) * level


def thud(level=1.0):
    t = tv(0.45)
    x = np.sin(2 * np.pi * np.cumsum(62 + 40 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.12) + a19.lp(rng.standard_normal(len(t)), 500) * np.exp(-t / 0.03) * 0.5
    return x * level


def heart(level=1.0):
    t = tv(0.5)
    def beat(d0):
        tt = np.clip(t - d0, 0, None)
        return np.sin(2 * np.pi * 48 * tt) * np.exp(-tt / 0.07) * (t >= d0)
    return a19.lp(beat(0) + 0.7 * beat(0.18), 200) * level

# ——————————————— música ———————————————
MIDI = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def midi(n):
    return MIDI[n[:-1]] + 12 * (int(n[-1]) + 1)


def hz(n):
    return 440 * 2 ** ((midi(n) - 69) / 12)


def pluck(f, dur=0.5, bright=1500):
    t = tv(dur)
    x = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.06)) * np.exp(-t / 0.16)
    return a19.lp(x * np.minimum(1, t / 0.003), bright)


BEAT = 60 / 88
BAR = 4 * BEAT
DARK = [(["A2", "C3", "E3"], ["A3", "E4", "C4", "E4"], "A1"), (["F2", "A2", "C3"], ["F3", "C4", "A3", "C4"], "F1"), (["C3", "E3", "G3"], ["G3", "E4", "C4", "E4"], "C2"), (["G2", "B2", "D3"], ["G3", "D4", "B3", "D4"], "G1")]
LIGHT = [(["F2", "A2", "C3"], ["F3", "C4", "A3", "C4"], "F1"), (["C3", "E3", "G3"], ["G3", "E4", "C4", "E4"], "C2"), (["G2", "B2", "D3"], ["G3", "D4", "B3", "D4"], "G1"), (["A2", "C3", "E3"], ["A3", "E4", "C4", "E4"], "A1")]
MOTIF = ["E4", "A4", "B4", "C5"]


def main():
    v, sr = sf.read(narr_path)
    if v.ndim > 1:
        v = v.mean(1)
    voice = np.zeros(N)
    voice[: min(N, len(v))] = v[:N]
    bw = [(M(a), M(b)) for a, b in TL["bw"]]
    end = M(64.3)
    S = {n: M(x) for n, x in dict(sit=6.86, cause=31.02, err=38.67, lesson=46.72, keep=56.79).items()}

    def in_bw(t):
        return any(a <= t < b for a, b in bw)

    def sec(t):
        if t >= end:
            return "out"
        if in_bw(t):
            return "bw"
        if t < S["sit"]:
            return "hook"
        if t < S["cause"]:
            return "sit"
        if t < S["err"]:
            return "cause"
        if t < S["lesson"]:
            return "err"
        if t < S["keep"]:
            return "lesson"
        return "keep"

    LV = {
        "hook": dict(pad=0.35, arp=0.0, kick=0.0, hat=0.0, tick=0.5, pno=0.0),
        "sit": dict(pad=0.5, arp=0.32, kick=0.3, hat=0.12, tick=0.0, pno=0.0),
        "bw": dict(pad=0.0, arp=0.0, kick=0.0, hat=0.0, tick=0.0, pno=0.0),
        "cause": dict(pad=0.5, arp=0.36, kick=0.0, hat=0.1, tick=0.25, pno=0.0),
        "err": dict(pad=0.52, arp=0.36, kick=0.38, hat=0.12, tick=0.0, pno=0.0),
        "lesson": dict(pad=0.58, arp=0.4, kick=0.45, hat=0.16, tick=0.0, pno=0.22),
        "keep": dict(pad=0.5, arp=0.0, kick=0.0, hat=0.0, tick=0.0, pno=0.26),
        "out": dict(pad=0.5, arp=0.0, kick=0.0, hat=0.0, tick=0.0, pno=0.0),
    }
    pad_b, arp_b, dr_b, dn_b, pn_b, fx, fol, keys = Bus(), Bus(), Bus(), Bus(), Bus(), Bus(), Bus(), Bus()
    for b in range(int(np.ceil(total / BAR))):
        t0 = b * BAR
        sc = sec(t0 + 0.01)
        prog = LIGHT if sc == "lesson" else DARK
        chord, arp, root = prog[b % 4]
        lv = LV[sc]
        if lv["pad"] > 0:
            pad_b.add(t0, a20.pad([midi(n) for n in chord], 0, BAR + 0.3, lv["pad"], att=0.9, rel=1.2))
        for kk in range(8):
            tk = t0 + kk * BEAT / 2
            l2 = LV[sec(tk + 0.01)]
            if l2["arp"] > 0:
                arp_b.add(tk, pluck(hz(arp[kk % 4]), bright=1800 if sc == "lesson" else 1400), l2["arp"] * (1.0 if kk % 2 == 0 else 0.6), 0.36 + 0.28 * (kk % 2))
                if kk % 4 == 0:
                    arp_b.add(tk, pluck(hz(root), 0.5, 600), l2["arp"] * 0.9, 0.5)
            if l2["kick"] > 0 and kk in (0, 4):
                dr_b.add(tk, a19.kick(), l2["kick"] * 0.45)
            if l2["hat"] > 0 and kk % 2 == 1:
                dr_b.add(tk, a19.hat(False, 1.0), l2["hat"], 0.64)
            if l2["tick"] > 0 and kk % 2 == 0:  # tique de "medição" (relógio de obra)
                dr_b.add(tk, tick(), l2["tick"] * 0.5, 0.58)
        # piano: motivo nas notas soltas (abertura, lição, guarda isto)
        if lv["pno"] > 0 or sc == "hook":
            for j, n in enumerate(MOTIF if sc != "lesson" else ["C5", "E5", "G4", "A4"]):
                if sc == "hook" and j % 2:
                    continue
                pn_b.add(t0 + j * BEAT, a20.piano(midi(n), 0.2 if sc == "hook" else lv["pno"], 1.6), 1.0, 0.45 + 0.1 * j)
    # P&B: drone grave + pulsação tipo coração (tensão), entra e sai com o filtro
    for a, b in bw:
        t = tv(b - a + 0.8)
        trem = 0.75 + 0.25 * np.sin(2 * np.pi * 0.6 * t)
        x = (np.sin(2 * np.pi * hz("A1") * t) + 0.5 * np.sin(2 * np.pi * hz("E2") * t) + 0.25 * np.sin(2 * np.pi * hz("A2") * t + 1.0)) * trem
        x *= np.minimum(1, t / 0.25) * np.clip((t[-1] - t) / 0.6, 0, 1)
        dn_b.add(a, a19.lp(x, 450), 0.6)
        tb = a + 0.3
        while tb < b - 0.2:
            dn_b.add(tb, heart(), 0.9)
            tb += 0.92
    for i, n in enumerate(["A2", "E3", "A3", "C4", "E4", "B4"]):
        pn_b.add(end + 0.2 + i * 0.05, a20.piano(midi(n), 0.24, 4.0), 1.0, 0.5)

    # ——— entradas, transições e foley (no início exato das palavras, no estéreo do elemento) ———
    KIND = {}
    for i, ev in enumerate(TL["fx"]):
        at, kind = ev[0], ev[1]
        pan = ev[2] if len(ev) > 2 else 0.5
        t = M(at)
        KIND[kind] = KIND.get(kind, 0) + 1
        if kind == "enter":
            fx.add(t, enter((pan - 0.5) * 1.2), 0.85, 0.5 + (pan - 0.5) * 0.6)
        elif kind == "pop":
            fx.add(t, pop([760, 850, 700, 900, 800][i % 5]), 0.62, pan)
        elif kind == "slam":
            fx.add(t, slam(), 0.9, 0.5 + (pan - 0.5) * 0.5)
        elif kind == "tape":
            fol.add(t, tape(), 1.0, pan)
        elif kind == "tiles":
            for j in range(42):
                c = j % 6
                fol.add(M(9.36 + j * 0.034), tile_tap(rng.uniform(0.7, 1.0)), 0.55, 0.3 + 0.08 * c)
        elif kind == "draw":
            fol.add(t, pencil(0.9), 0.8, pan)
        elif kind == "alert":
            fx.add(t, thud(), 0.5, pan)
            fx.add(t + 0.02, tick(), 0.3, pan)
        elif kind == "xmark":
            fx.add(t, stamp(), 0.85, pan)
        elif kind == "clash":
            fol.add(t, clash(), 1.0, 0.5 + (pan - 0.5) * 0.5)
        elif kind == "cut":
            fol.add(t, cut_saw(), 0.8, pan)
            fx.add(t, pop(820), 0.4, pan)
        elif kind == "ratchet":
            fol.add(t, ratchet(), 0.8, pan)
            fx.add(t, pop(760), 0.4, pan)
        elif kind == "check":
            fx.add(t, check(), 0.5, pan)
            fx.add(t, pop(990), 0.4, pan)
        elif kind == "strike":
            fx.add(t, strike(), 0.55, pan)
    # mudanças de posição do quadrado (sopro com estéreo na direção do movimento)
    pos = {"hero": 0.0, "left": -1.0, "right": 1.0, "tl": -1.0, "tr": 1.0, "end": 0.0}
    pk = TL["pkeys"]
    for (a0, m0), (a1, m1) in zip(pk, pk[1:]):
        if m0 == m1:
            continue
        dirn = max(-1.0, min(1.0, pos[m1] - pos[m0]))
        fx.add(M(a1), air(0.46, 400, 3800, 900, 0.5 * dirn), 1.0)
    for a, b in bw:
        fx.add(a, drop(), 0.85)
        fx.add(b, bloom(), 0.7)
    fx.add(end + 2.0, pop(900), 0.55, 0.62)
    fx.add(end + 2.05, chime(0.7), 0.4, 0.62)

    # ——— teclado nas legendas (mesma regra do vídeo) ———
    hidden = lambda st: any(a <= st < b for a, b in TL["hideCaps"])
    SPACE = [key_variant(500 + i, heavy=True) * 0.55 for i in range(3)]
    nk = 0
    for wi, w in enumerate(WORDS):
        if hidden(w["start"]):
            continue
        n = len(w["text"])
        a, b = M(w["start"]), M(w["end"])
        td = min(0.24, max(0.09, 0.035 * n), max(0.06, (b - a) * 0.85))
        presses = max(1, min(4, math.ceil(n / 3)))
        pan = 0.5
        for j in range(presses):
            keys.add(a + j * td / presses, KEYS[rng.integers(len(KEYS))], rng.uniform(0.8, 1.05), rng.uniform(0.42, 0.58))
            nk += 1
        if w["text"][-1] in ".?!":
            keys.add(a + td + 0.06, ENTER[rng.integers(len(ENTER))], 0.95, 0.5)
            nk += 1
        elif wi + 1 < len(WORDS) and M(WORDS[wi + 1]["start"]) - (a + td) > 0.06:
            keys.add(a + td + 0.03, SPACE[rng.integers(len(SPACE))], 0.7, 0.5)  # barra de espaço
            nk += 1
    print("efeitos por tipo:", KIND, "· teclas:", nk)

    # ——— mistura ———
    irs = a20.hall_ir()
    music = pad_b.x * 0.55 + arp_b.x * 0.6 + dr_b.x * 0.6 + dn_b.x * 0.8 + pn_b.x * 0.7
    wet = np.stack([fftconvolve((pad_b.x * 0.3 + arp_b.x * 0.45 + pn_b.x * 0.8 + fx.x * 0.10 + fol.x * 0.06)[:, c], irs[c])[:N] for c in range(2)], 1) * 0.26
    music = music + wet
    hop = int(0.05 * SR)
    kk = N // hop
    wr = lambda x: np.sqrt((x[: kk * hop].reshape(kk, hop) ** 2).mean(1)) + 1e-9
    # nivelador lento: a música não tem subidas (controlada)
    mw = wr(music.mean(1))
    ref = np.median(mw[mw > mw.max() * 0.02])
    g = np.clip(ref / mw, 0.5, 1.4) ** 0.6
    g = np.convolve(g, np.ones(30) / 30, mode="same")
    music *= np.repeat(np.concatenate([g, g[-1:].repeat(N // hop + 1 - kk)]), hop)[:N, None]
    io = int(min(N - 1, (total - 1.4) * SR))
    music[io:] *= np.linspace(1, 0, N - io)[:, None] ** 1.5
    env = np.sqrt(np.maximum(a19.lp(voice**2, 6), 0))
    env = env / (np.percentile(env[env > 1e-4], 95) + 1e-9)
    music *= (1 - 0.45 * np.clip(env, 0, 1))[:, None]
    vw = wr(voice)
    sp = vw > np.percentile(vw[vw > 1e-4], 40)
    vmed = np.median(vw[sp])
    music *= 10 ** ((np.median(20 * np.log10(vw[sp]) - 20 * np.log10(wr(music.mean(1))[sp])) - 23) / 20)

    def norm(bus, below):
        w_ = wr(bus.mean(1))
        on = w_ > w_.max() * 0.05
        return bus * 10 ** ((20 * np.log10(vmed) - below - 20 * np.log10(np.percentile(w_[on], 95))) / 20)

    fxm = norm(fx.x, 8)
    folm = norm(fol.x, 11)
    keym = norm(keys.x, 15)
    mix = np.stack([voice, voice], 1) + music + fxm + folm + keym
    marg_m = 20 * np.log10(vw[sp]) - 20 * np.log10(wr(music.mean(1))[sp])
    marg = 20 * np.log10(vw[sp]) - 20 * np.log10(wr((music + fxm + folm + keym).mean(1))[sp])
    print(f"voz acima da música: mediana {np.median(marg_m):.1f} dB · acima de tudo o resto: mediana {np.median(marg):.1f} dB, p10 {np.percentile(marg, 10):.1f} dB")
    mix = np.stack([a19.hp(mix[:, c], 30, order=2) for c in range(2)], 1)
    for _ in range(2):
        mix = mix * 10 ** ((-16.0 - a20.lufs(mix)) / 20)
    mix = a20.soft_limit(mix, ceiling=0.84)
    sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
    print(f"ok {out} {total:.2f}s LUFS {a20.lufs(mix):.1f} pico {20 * np.log10(np.abs(mix).max()):.1f} dB")


if __name__ == "__main__":
    main()
