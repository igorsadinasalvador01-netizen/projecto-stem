#!/usr/bin/env python3
"""Vídeo 21 v2 (estilo claro): mistura final — voz tratada + música leve + sons de transição novos.

Uso: gen-v21b-audio.py <narracao_cortada.wav> <cuts21.json> <saida.wav> <duracao_total_s>

Paleta de transição (a partir da referência do autor): "pops" afinados e limpos na entrada de cada
cartão/linha/pill (no início EXATO da palavra), "swish" de ar suave em cada deslocação do cartão
(com o movimento no estéreo), chime com grave quando entra um texto grande por trás da pessoa,
batida abafada em "comum" e risco seco quando algo é riscado. Nada áspero e nada tipo sirene.
Música leve e positiva (Lá menor/Dó maior, 100 BPM), sempre ~21 dB abaixo da voz.
"""
import importlib.util
import json
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
narr_path, cuts_path, out, total = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
N = int(total * SR)
C = json.load(open(cuts_path))
SEGS, o = [], 0.0
for a, b in C["keep"]:
    SEGS.append((a / C["fps"], b / C["fps"], o))
    o += (b - a) / C["fps"]
OUT_LEN = o


def M(x):
    for s, e, oo in SEGS:
        if x < s:
            return oo
        if x <= e:
            return oo + (x - s)
    s, e, oo = SEGS[-1]
    return oo + (e - s) + (x - e)


rng = np.random.default_rng(212)


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


# ——————————————— sons de transição ———————————————
def pop(f=760.0, level=1.0):
    t = tv(0.16)
    f_t = f * (1 + 0.5 * np.exp(-t / 0.012))
    ph = 2 * np.pi * np.cumsum(f_t) / SR
    body = (np.sin(ph) + 0.18 * np.sin(2 * ph)) * np.exp(-t / 0.045)
    click = a19.hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.0015) * 0.12
    x = (body + click) * np.minimum(1, t / 0.0015)
    return a19.lp(x, 6000) * level


def swish(d=0.3, direction=0.0):
    """ar suave que passa: ruído filtrado com o centro a descer e o estéreo a acompanhar o movimento"""
    t = tv(d)
    u = t / d
    env = np.sin(np.pi * u) ** 1.6
    out = []
    for ch in range(2):
        nz = rng.standard_normal(len(t))
        y = a19.lp_sweep(a19.hp(nz, 400), lambda s: 3200 - 2100 * (s / d), block=240)
        y = a19.lp(y, 6500) * env
        pan = 0.5 + direction * (u - 0.5)
        g = np.cos(pan * np.pi / 2) if ch == 0 else np.sin(pan * np.pi / 2)
        out.append(y * g * 1.414)
    return np.stack(out, 1)


def chime(level=1.0, big=False):
    t = tv(1.4 if big else 1.0)
    x = np.zeros(len(t))
    for f, a, d in ([(1046.5, 1.0, 0.9), (1568.0, 0.55, 0.6), (2093.0, 0.25, 0.35)] + ([(523.25, 0.5, 1.1)] if big else [])):
        x += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / d)
    x *= np.minimum(1, t / 0.004)
    thump = np.sin(2 * np.pi * np.cumsum(46 + 40 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.18) * (1.1 if big else 0.8)
    return (a19.lp(x, 7000) * 0.5 + thump) * level


def thud(level=1.0):
    t = tv(0.5)
    x = np.sin(2 * np.pi * np.cumsum(70 + 50 * np.exp(-t / 0.03)) / SR) * np.exp(-t / 0.12) + a19.lp(rng.standard_normal(len(t)), 500) * np.exp(-t / 0.04) * 0.5
    return x * level


def strike(level=1.0):
    t = tv(0.16)
    return a19.lp_sweep(a19.hp(rng.standard_normal(len(t)), 900), lambda s: 5000 - 3000 * s / 0.16, block=240) * np.sin(np.pi * t / 0.16) ** 2 * level


def tick(level=1.0):
    t = tv(0.04)
    return a19.bp(rng.standard_normal(len(t)), 2200, 6000) * np.exp(-t / 0.005) * level


# ——————————————— música leve ———————————————
def pluck(f, dur=0.6):
    t = tv(dur)
    x = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.05) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t / 0.22)
    return a19.lp(x * np.minimum(1, t / 0.003), 2600)


def midi(n):
    names = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
    return names[n[:-1]] + 12 * (int(n[-1]) + 1)


def hz(n):
    return 440 * 2 ** ((midi(n) - 69) / 12)


BEAT = 60 / 100
BAR = 4 * BEAT
PROG = [(["A2", "C3", "E3"], ["A4", "C5", "E5", "C5"]), (["F2", "A2", "C3"], ["F4", "A4", "C5", "A4"]), (["C3", "E3", "G3"], ["G4", "C5", "E5", "C5"]), (["G2", "B2", "D3"], ["G4", "B4", "D5", "B4"])]


def main():
    v, sr = sf.read(narr_path)
    if v.ndim > 1:
        v = v.mean(1)
    voice = np.zeros(N)
    voice[: min(N, len(v))] = v[:N]
    S = {k: M(x) for k, x in dict(cut1=6.3, story=9.6, shaker=15.75, chat=30.5, diff=39.55, build=41.4, clim=53.45, key=57.75, end=61.95, outro=67.95).items()}

    def level(t):
        if t < S["cut1"]:
            return dict(pad=0.5, pl=0.32, kick=0, sh=0)
        if t < S["story"]:
            return dict(pad=0.6, pl=0.36, kick=0, sh=0)
        if t < S["shaker"]:
            return dict(pad=0.45, pl=0.28, kick=0, sh=0)
        if t < S["chat"]:
            return dict(pad=0.45, pl=0.28, kick=0, sh=0.1)
        if t < S["diff"]:
            return dict(pad=0.42, pl=0.0, kick=0, sh=0.08)
        if t < S["build"]:
            return dict(pad=0.5, pl=0.0, kick=0, sh=0)
        if t < S["clim"]:
            return dict(pad=0.5, pl=0.32, kick=0.4, sh=0.12)
        if t < S["key"]:
            return dict(pad=0.62, pl=0.4, kick=0.55, sh=0.16)
        if t < S["end"]:
            return dict(pad=0.42, pl=0.0, kick=0, sh=0)
        if t < S["outro"]:
            return dict(pad=0.48, pl=0.26, kick=0, sh=0)
        return dict(pad=0.5, pl=0.2, kick=0, sh=0)

    pad_b, pl_b, dr_b, pn_b, fx = Bus(), Bus(), Bus(), Bus(), Bus()
    for b in range(int(np.ceil(total / BAR))):
        t0 = b * BAR
        chord, arp = PROG[b % 4]
        lv = level(t0 + 0.01)
        if lv["pad"] > 0:
            pad_b.add(t0, a20.pad([midi(n) for n in chord], 0, BAR + 0.3, lv["pad"], att=0.8, rel=1.2))
        for k in range(8):
            tk = t0 + k * BEAT / 2
            lk = level(tk + 0.01)
            if lk["pl"] > 0 and k in (0, 2, 3, 5, 6):
                pl_b.add(tk, pluck(hz(arp[k % 4])), lk["pl"] * (1.0 if k % 2 == 0 else 0.75), 0.4 + 0.2 * (k % 2))
            if lk["sh"] > 0:
                dr_b.add(tk, a19.hat(False, 1.0), lk["sh"] * (1.0 if k % 2 else 0.55), 0.6)
            if lk["kick"] > 0 and k in (0, 4):
                dr_b.add(tk, a19.kick(), lk["kick"] * 0.5)
    # piano: frase-chave e acorde final
    for at, n, vel in [(M(57.92), "A3", 0.26), (M(61.36), "E5", 0.2)]:
        pn_b.add(at, a20.piano(midi(n), vel, 2.5), 1.0, 0.5)
    for i, n in enumerate(["C3", "G3", "C4", "E4", "G4", "D5"]):
        pn_b.add(S["outro"] + 0.2 + i * 0.05, a20.piano(midi(n), 0.24, 4.0), 1.0, 0.5)

    # ——— transições: entradas no início exato das palavras ———
    pops = [0.24, 0.56, 2.08, 4.4, 6.08, 11.53, 11.92, 13.2, 14.0, 16.16, 17.76, 19.52, 20.48, 21.28, 22.32, 23.38, 25.44, 26.0, 26.88, 30.88, 34.8, 36.8, 41.04, 43.31, 44.88, 48.51, 49.81, 50.95, 51.39, 57.92, 62.32]
    for i, at in enumerate(pops):
        f = [740, 830, 700, 880, 790][i % 5]
        fx.add(M(at), pop(f), 0.5, 0.42 + 0.16 * (i % 2))
    for at in (38.56, 53.68):  # capítulos
        fx.add(M(at), pop(1050, 0.8), 0.35, 0.3)
    fx.add(M(8.08), pop(990), 0.5, 0.65)
    fx.add(M(8.08), chime(0.6), 0.3, 0.65)
    for at, big in [(6.64, False), (40.08, False), (47.36, False), (56.96, True), (65.6, False)]:
        fx.add(M(at), chime(1.0, big), 0.55 if big else 0.45)
    fx.add(M(55.52), thud(), 0.55)
    for at in (50.27, 56.34):
        fx.add(M(at), strike(), 0.35)
    for i in range(4):
        fx.add(M(31.52) + i * 0.24, tick(), 0.25, 0.6)
    moves = [(6.3, 0), (9.6, 0), (11.4, 1), (15.75, -1), (23.05, 1), (26.6, 1), (30.5, -1), (39.55, 1), (41.4, 0), (46.9, 0), (48.4, 1), (53.45, -1), (57.75, 1), (61.95, -1), (65.15, 0), (67.95, 0)]
    for at, dirn in moves:
        d = 0.32
        fx.add(M(at) + 0.3 - d / 2, swish(d, 0.5 * dirn), 0.45)
    a_end = M(67.95)
    fx.add(a_end + 2.0, pop(900), 0.5, 0.62)
    fx.add(a_end + 2.05, chime(0.7), 0.3, 0.62)

    # ——— mistura ———
    irs = a20.hall_ir()
    music = pad_b.x * 0.55 + pl_b.x * 0.55 + dr_b.x * 0.6 + pn_b.x * 0.7
    wet = np.stack([fftconvolve((pad_b.x * 0.3 + pl_b.x * 0.5 + pn_b.x * 0.8 + fx.x * 0.18)[:, c], irs[c])[:N] for c in range(2)], 1) * 0.28
    music = music + wet
    io = int(min(N - 1, (total - 1.4) * SR))
    music[io:] *= np.linspace(1, 0, N - io)[:, None] ** 1.5
    env = np.sqrt(np.maximum(a19.lp(voice**2, 6), 0))
    env = env / (np.percentile(env[env > 1e-4], 95) + 1e-9)
    music *= (1 - 0.5 * np.clip(env, 0, 1))[:, None]
    fxm = fx.x * (1 - 0.25 * np.clip(env, 0, 1))[:, None]
    hop = int(0.05 * SR)
    kk = N // hop
    wr = lambda x: np.sqrt((x[: kk * hop].reshape(kk, hop) ** 2).mean(1)) + 1e-9
    vw = wr(voice)
    sp = vw > np.percentile(vw[vw > 1e-4], 40)
    music *= 10 ** ((np.median(20 * np.log10(vw[sp]) - 20 * np.log10(wr(music.mean(1))[sp])) - 21) / 20)
    fw = wr(fxm.mean(1))
    on = fw > fw.max() * 0.05
    fxm *= 10 ** ((20 * np.log10(np.median(vw[sp])) - 12 - 20 * np.log10(np.percentile(fw[on], 95))) / 20)
    mix = np.stack([voice, voice], 1) + music + fxm
    marg = 20 * np.log10(vw[sp]) - 20 * np.log10(wr((music + fxm).mean(1))[sp])
    print(f"voz acima de música+efeitos (janelas com fala): mediana {np.median(marg):.1f} dB, p10 {np.percentile(marg, 10):.1f} dB")
    mix = np.stack([a19.hp(mix[:, c], 30, order=2) for c in range(2)], 1)
    for _ in range(2):
        mix = mix * 10 ** ((-16.0 - a20.lufs(mix)) / 20)
    mix = a20.soft_limit(mix, ceiling=0.84)
    sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
    print(f"ok {out} {total:.2f}s LUFS {a20.lufs(mix):.1f} pico {20 * np.log10(np.abs(mix).max()):.1f} dB")


if __name__ == "__main__":
    main()
