#!/usr/bin/env python3
"""Vídeo 22 ("glass noir"): mistura final — voz tratada + música baixa e controlada + sons de
entrada/transição em destaque + teclado nas legendas.

Uso: gen-v22-audio.py <narracao_cortada.wav> <cuts21.json> <timeline22.json> <words21.json> <saida.wav> <duracao_total_s>

- Música (Ré menor, 92 BPM: Dm–B♭–F–C): pad + pulsação de pluck abafado + sub-bombo discreto.
  Nas falas trágicas (P&B) fica só um drone grave filtrado; quando a cor volta, a música volta.
  Nível nivelado (sem subidas) e ~23 dB abaixo da voz, com ducking quando ele fala.
- Entradas e transições DESTACADAS (pico ~8 dB abaixo da voz): vidro a entrar (ar + toque de vidro),
  pops nos chips, impacto + "puxada" nos zooms, sopros com estéreo nas mudanças de posição do
  quadrado, mergulho grave ao entrar no P&B e brilho de ar quando a cor volta. Nada tipo sirene:
  todos os sopros são ruído sem tom.
- Teclado: cada palavra da legenda é escrita com 1–4 teclas (a MESMA regra de duração do vídeo:
  typeDur em src/v22/Video22.tsx) e um "enter" suave no fim de cada frase; a pergunta do vendedor 2
  é escrita tecla a tecla. Nenhum gatilho começa antes do início real da palavra.
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


rng = np.random.default_rng(222)


class Bus:
    def __init__(self):
        self.x = np.zeros((N, 2))

    def add(self, t0, sig, gain=1.0, pan=0.5):
        i = int(round(t0 * SR))
        if sig.ndim == 1:
            g = np.array([np.cos(pan * np.pi / 2), np.sin(pan * np.pi / 2)]) * 1.414
            sig = sig[:, None] * g[None, :]
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

MIDI = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def midi(n):
    return MIDI[n[:-1]] + 12 * (int(n[-1]) + 1)


def hz(n):
    return 440 * 2 ** ((midi(n) - 69) / 12)


def pluck(f, dur=0.5):
    t = tv(dur)
    x = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.06)) * np.exp(-t / 0.16)
    return a19.lp(x * np.minimum(1, t / 0.003), 1500)


BEAT = 60 / 92
BAR = 4 * BEAT
PROG = [(["D3", "F3", "A3"], ["D4", "A4", "F4", "A4"], "D2"), (["Bb2", "D3", "F3"], ["D4", "Bb4", "F4", "Bb4"], "Bb1"), (["F2", "A2", "C3"], ["C4", "A4", "F4", "A4"], "F2"), (["C3", "E3", "G3"], ["C4", "G4", "E4", "G4"], "C2")]


def main():
    v, sr = sf.read(narr_path)
    if v.ndim > 1:
        v = v.mean(1)
    voice = np.zeros(N)
    voice[: min(N, len(v))] = v[:N]
    bw = [(M(a), M(b)) for a, b in TL["bw"]]
    end = M(67.95)

    def in_bw(t):
        return any(a <= t < b for a, b in bw)

    def level(t):
        if t >= end:
            return dict(pad=0.55, pl=0.2, kick=0, drone=0)
        if in_bw(t):
            return dict(pad=0.0, pl=0.0, kick=0, drone=1.0)
        if t < M(3.28):
            return dict(pad=0.5, pl=0.3, kick=0.0, drone=0)
        if t < M(30.41):
            return dict(pad=0.5, pl=0.34, kick=0.35, drone=0)
        if t < M(53.68):
            return dict(pad=0.55, pl=0.38, kick=0.45, drone=0)
        return dict(pad=0.6, pl=0.4, kick=0.5, drone=0)

    pad_b, pl_b, dr_b, dn_b, pn_b, fx, keys = Bus(), Bus(), Bus(), Bus(), Bus(), Bus(), Bus()
    for b in range(int(np.ceil(total / BAR))):
        t0 = b * BAR
        chord, arp, root = PROG[b % 4]
        lv = level(t0 + 0.01)
        if lv["pad"] > 0:
            pad_b.add(t0, a20.pad([midi(n) for n in chord], 0, BAR + 0.3, lv["pad"], att=0.9, rel=1.2))
        for kk in range(8):
            tk = t0 + kk * BEAT / 2
            lk = level(tk + 0.01)
            if lk["pl"] > 0:
                pl_b.add(tk, pluck(hz(arp[kk % 4])), lk["pl"] * (1.0 if kk % 2 == 0 else 0.6), 0.38 + 0.24 * (kk % 2))
                if kk % 2 == 0:
                    pl_b.add(tk, pluck(hz(root), 0.4), lk["pl"] * 0.7, 0.5)
            if lk["kick"] > 0 and kk in (0, 4):
                dr_b.add(tk, a19.kick(), lk["kick"] * 0.45)
            if lk["kick"] > 0 and kk % 2 == 1:
                dr_b.add(tk, a19.hat(False, 1.0), lk["kick"] * 0.16, 0.62)
    # drone grave nas falas trágicas (Ré + Lá, trémulo lento, entra e sai com o P&B)
    for a, b in bw:
        t = tv(b - a + 0.8)
        trem = 0.75 + 0.25 * np.sin(2 * np.pi * 0.7 * t)
        x = (np.sin(2 * np.pi * hz("D2") * t) + 0.5 * np.sin(2 * np.pi * hz("A2") * t) + 0.25 * np.sin(2 * np.pi * hz("D3") * t + 1.0)) * trem
        x *= np.minimum(1, t / 0.25) * np.clip((t[-1] - t) / 0.6, 0, 1)
        dn_b.add(a, a19.lp(x, 500), 0.55)
    for i, n in enumerate(["D3", "A3", "D4", "F4", "A4", "E5"]):
        pn_b.add(end + 0.2 + i * 0.05, a20.piano(midi(n), 0.24, 4.0), 1.0, 0.5)

    # ——— entradas e transições (no início exato das palavras) ———
    KIND = {"enter": 0, "pop": 0, "slam": 0, "win": 0, "tick": 0, "draw": 0, "strike": 0, "calm": 0}
    for i, (at, kind) in enumerate(TL["fx"]):
        t = M(at)
        KIND[kind] += 1
        pan = 0.4 + 0.2 * (i % 2)
        if kind == "enter":
            fx.add(t, enter((i % 3 - 1) * 0.4), 0.85)
        elif kind == "pop":
            fx.add(t, pop([760, 850, 700, 900, 800][i % 5]), 0.62, pan)
        elif kind == "slam":
            fx.add(t, slam(), 0.9)
        elif kind == "win":
            fx.add(t, pop(990), 0.55, 0.6)
            fx.add(t, chime(0.75), 0.5, 0.6)
        elif kind == "tick":
            for j in range(3):
                fx.add(t + j * 0.11, tick(), 0.35, 0.6)
        elif kind == "draw":
            fx.add(t, shimmer(1.2), 0.22, 0.55)
        elif kind == "strike":
            fx.add(t, strike(), 0.5)
        elif kind == "calm":
            fx.add(t, air(1.1, 300, 1800, 700, 0.0), 0.3)
    # mudanças de posição do quadrado (sopro com estéreo na direção do movimento)
    pos = {"hero": 0.0, "left": -1.0, "right": 1.0, "tl": -1.0, "tr": 1.0, "end": 0.0}
    pk = TL["pkeys"]
    for (a0, m0), (a1, m1) in zip(pk, pk[1:]):
        if m0 == m1:
            continue
        dirn = max(-1.0, min(1.0, pos[m1] - pos[m0]))
        fx.add(M(a1), air(0.46, 400, 3800, 900, 0.5 * dirn), 1.0)
    # P&B: mergulho ao entrar, brilho quando a cor volta
    for a, b in bw:
        fx.add(a, drop(), 0.85)
        fx.add(b, bloom(), 0.7)
    # fecho: toque em "Seguir"
    fx.add(end + 2.0, pop(900), 0.55, 0.62)
    fx.add(end + 2.05, chime(0.7), 0.4, 0.62)

    # ——— teclado nas legendas ———
    hidden = lambda st: any(a <= st < b for a, b in TL["hideCaps"])
    nk = 0
    for w in WORDS:
        if hidden(w["start"]):
            continue
        n = len(w["text"])
        a, b = M(w["start"]), M(w["end"])
        td = min(0.24, max(0.09, 0.035 * n), max(0.06, (b - a) * 0.85))
        presses = max(1, min(4, math.ceil(n / 3)))
        for j in range(presses):
            keys.add(a + j * td / presses, KEYS[rng.integers(len(KEYS))], rng.uniform(0.8, 1.05), rng.uniform(0.42, 0.58))
            nk += 1
        if w["text"][-1] in ".?!":
            keys.add(a + td + 0.06, ENTER[rng.integers(len(ENTER))], 0.95, 0.5)
            nk += 1
    # a pergunta do vendedor 2 (escrita no painel, tecla a tecla — mesma regra do componente Typed)
    rows = [(26.88, 27.04, "O"), (27.04, 27.13, "que"), (27.13, 28.2, "atualmente"), (28.24, 28.56, "mais"), (28.56, 28.72, "te"), (28.72, 29.5, "incomoda"), (29.52, 29.92, "neste"), (29.92, 30.4, "espaço?")]
    for a0, b0, wd in rows:
        a, b = M(a0), M(b0)
        n = len(wd)
        dur = min(0.28, max(0.1, (b - a) * 0.8))
        for j in range(0, n, 2):
            keys.add(a + j / n * dur, KEYS[rng.integers(len(KEYS))], rng.uniform(0.85, 1.1), rng.uniform(0.4, 0.6))
            nk += 1
    keys.add(M(30.4) + 0.05, ENTER[0], 1.0, 0.5)
    print("efeitos por tipo:", KIND, "· teclas:", nk)

    # ——— mistura ———
    irs = a20.hall_ir()
    music = pad_b.x * 0.55 + pl_b.x * 0.6 + dr_b.x * 0.6 + dn_b.x * 0.8 + pn_b.x * 0.7
    wet = np.stack([fftconvolve((pad_b.x * 0.3 + pl_b.x * 0.45 + pn_b.x * 0.8 + fx.x * 0.12)[:, c], irs[c])[:N] for c in range(2)], 1) * 0.26
    music = music + wet
    # nivelador lento: a música não tem subidas (controlada)
    hop = int(0.05 * SR)
    kk = N // hop
    wr = lambda x: np.sqrt((x[: kk * hop].reshape(kk, hop) ** 2).mean(1)) + 1e-9
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
    fw = wr(fx.x.mean(1))
    on = fw > fw.max() * 0.05
    fxm = fx.x * 10 ** ((20 * np.log10(vmed) - 8 - 20 * np.log10(np.percentile(fw[on], 95))) / 20)
    kw = wr(keys.x.mean(1))
    on = kw > kw.max() * 0.05
    keym = keys.x * 10 ** ((20 * np.log10(vmed) - 15 - 20 * np.log10(np.percentile(kw[on], 95))) / 20)
    mix = np.stack([voice, voice], 1) + music + fxm + keym
    marg_m = 20 * np.log10(vw[sp]) - 20 * np.log10(wr(music.mean(1))[sp])
    marg = 20 * np.log10(vw[sp]) - 20 * np.log10(wr((music + fxm + keym).mean(1))[sp])
    print(f"voz acima da música: mediana {np.median(marg_m):.1f} dB · acima de música+efeitos+teclado: mediana {np.median(marg):.1f} dB, p10 {np.percentile(marg, 10):.1f} dB")
    mix = np.stack([a19.hp(mix[:, c], 30, order=2) for c in range(2)], 1)
    for _ in range(2):
        mix = mix * 10 ** ((-16.0 - a20.lufs(mix)) / 20)
    mix = a20.soft_limit(mix, ceiling=0.84)
    sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
    print(f"ok {out} {total:.2f}s LUFS {a20.lufs(mix):.1f} pico {20 * np.log10(np.abs(mix).max()):.1f} dB")


if __name__ == "__main__":
    main()
