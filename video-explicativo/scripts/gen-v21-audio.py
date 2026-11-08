#!/usr/bin/env python3
"""Vídeo 21 (documental 16:9): mistura final — voz tratada + música original + efeitos sonoros.

Uso: gen-v21-audio.py <narracao_cortada.wav> <cuts21.json> <saida.wav> <duracao_total_s> [--stems <pasta>]

- As marcas estão no tempo ORIGINAL da fala (as mesmas de src/v21) e passam pelos cortes M().
- Música (sintetizada aqui, sem samples de terceiros): Ré menor, 84 BPM, Dm–Bb–F–C. Pulso discreto
  e pad no gancho; quase nada na pergunta; tensão (pulso grave e relógio) na resposta; silêncio,
  riser de ruído e sub drop na revelação; construção no split; pico no clímax; recolhe na
  frase-chave; resolve com piano na conclusão; acorde final no fecho.
- Efeitos com intenção: whooshes de ar (sem tom) nas mudanças de enquadramento, cliques nas listas,
  impactos graves nos títulos, sub drops nas viragens, risers de ruído antes das revelações.
- A voz fica sempre em primeiro plano (~19 dB acima da música, com ducking pela própria voz).
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


a19 = load("gen-v19-audio")  # impactos, whooshes, risers, bateria
a20 = load("gen-v20-audio")  # piano de feltro, pad, reverberação, loudness
SR = 48000
narr_path, cuts_path, out, total = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
N = int(total * SR)
CUTS = json.load(open(cuts_path))
FPS = CUTS["fps"]
SEGS = []
o = 0.0
for a, b in CUTS["keep"]:
    SEGS.append((a / FPS, b / FPS, o))
    o += (b - a) / FPS


def M(x):
    for s, e, oo in SEGS:
        if x < s:
            return oo
        if x <= e:
            return oo + (x - s)
    s, e, oo = SEGS[-1]
    return oo + (e - s) + (x - e)


class Bus:
    def __init__(self):
        self.x = np.zeros((N, 2))

    def add(self, t0, sig, gain=1.0, pan=0.5):
        i = int(round(t0 * SR))
        if i >= N or i < -len(sig):
            return
        if sig.ndim == 1:
            g = np.array([np.cos(pan * np.pi / 2), np.sin(pan * np.pi / 2)]) * 1.414
            sig = sig[:, None] * g[None, :]
        if i < 0:
            sig, i = sig[-i:], 0
        j = min(N, i + len(sig))
        self.x[i:j] += sig[: j - i] * gain


def stereo(L, R=None):
    return np.stack([L, L if R is None else R], 1)


# ——————————————————— instrumentos próprios ———————————————————
def pluck(f, dur=0.5, bright=1800):
    t = np.arange(int(dur * SR)) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t + 0.3) + 0.12 * np.sin(6 * np.pi * f * t)) * np.exp(-t / 0.16)
    x *= np.minimum(1, t / 0.004)
    return a19.lp(x, bright)


def tick(level=1.0):
    t = np.arange(int(0.05 * SR)) / SR
    return a19.bp(np.random.default_rng(7).standard_normal(len(t)), 2500, 7000) * np.exp(-t / 0.006) * level


def click(level=1.0):
    t = np.arange(int(0.06 * SR)) / SR
    x = a19.bp(np.random.default_rng(3).standard_normal(len(t)), 1200, 5000) * np.exp(-t / 0.008) + np.sin(2 * np.pi * 1450 * t) * np.exp(-t / 0.012) * 0.4
    return x * level


def subdrop(level=1.0, d=1.6):
    t = np.arange(int(d * SR)) / SR
    f = 32 + 38 * np.exp(-t / 0.35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7) * np.minimum(1, t / 0.01) * level


def hz(n):
    names = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
    return 440 * 2 ** ((names[n[:-1]] + 12 * (int(n[-1]) + 1) - 69) / 12)


def midi(n):
    names = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
    return names[n[:-1]] + 12 * (int(n[-1]) + 1)


BPM = 84
BEAT = 60 / BPM
BAR = 4 * BEAT
PROG = [("Dm", ["D3", "F3", "A3"], "D2", ["D4", "F4", "A4", "D5"]), ("Bb", ["Bb2", "D3", "F3"], "Bb1", ["Bb3", "D4", "F4", "Bb4"]), ("F", ["F3", "A3", "C4"], "F2", ["F4", "A4", "C5", "F5"]), ("C", ["C3", "E3", "G3"], "C2", ["C4", "E4", "G4", "C5"])]


def main():
    voice, sr = sf.read(narr_path)
    if voice.ndim > 1:
        voice = voice.mean(1)
    if sr != SR:
        raise SystemExit("a narração tem de estar a 48 kHz")
    v = np.zeros(N)
    v[: min(N, len(voice))] = voice[:N]
    # secções (tempo da montagem)
    S = {k: M(x) for k, x in dict(story=9.75, drop=10.0, pip=11.4, calm=23.05, q=26.88, ans=31.4, rev=37.7, diff=40.08, split=40.72, kick=44.83, sol=50.95, clim=53.45, peak=56.96, key=57.85, prob=61.36, conc=61.95, outro=67.95).items()}
    end = total
    pad_b, pul_b, pno_b, drm_b, fx_b = Bus(), Bus(), Bus(), Bus(), Bus()

    def section_level(t):
        """intensidade da música em cada instante (0..1) e o que toca"""
        if t < S["story"]:
            return dict(pad=0.55, pulse=0.38, kick=0, hats=0)
        if t < S["pip"]:
            return dict(pad=0.42, pulse=0.0, kick=0, hats=0)
        if t < S["calm"]:
            return dict(pad=0.42, pulse=0.24, kick=0, hats=0.12)
        if t < S["ans"]:
            return dict(pad=0.34, pulse=0.0, kick=0, hats=0)
        if t < S["rev"]:
            return dict(pad=0.40, pulse=0.30, kick=0, hats=0)
        if t < S["split"]:
            return dict(pad=0.0, pulse=0.0, kick=0, hats=0)
        if t < S["kick"]:
            return dict(pad=0.48, pulse=0.32, kick=0, hats=0)
        if t < S["clim"]:
            return dict(pad=0.52, pulse=0.38, kick=0.45, hats=0.14)
        if t < S["key"]:
            return dict(pad=0.66, pulse=0.44, kick=0.6, hats=0.2)
        if t < S["conc"]:
            return dict(pad=0.36, pulse=0.0, kick=0, hats=0)
        if t < S["outro"]:
            return dict(pad=0.44, pulse=0.0, kick=0, hats=0)
        return dict(pad=0.5, pulse=0.0, kick=0, hats=0)

    nbars = int(np.ceil(end / BAR))
    for b in range(nbars):
        t0 = b * BAR
        lv = section_level(t0 + 0.01)
        name, chord, root, arp = PROG[b % 4]
        if lv["pad"] > 0:
            pad_b.x[int(t0 * SR) : int(t0 * SR) + 1] += 0  # (marca)
            st = a20.pad([midi(n) for n in chord], 0, BAR + 0.3, lv["pad"], att=0.9, rel=1.4)
            pad_b.add(t0, st)
        for k in range(8):  # pulso em colcheias (arpejo)
            tk = t0 + k * BEAT / 2
            lk = section_level(tk + 0.01)
            if lk["pulse"] > 0:
                f = hz(arp[k % 4]) * (2 if (tk >= S["sol"] and tk < S["key"]) else 1)
                pul_b.add(tk, pluck(f, 0.45, 1700), lk["pulse"] * (1.0 if k % 2 == 0 else 0.7), 0.42 if k % 2 else 0.58)
            if lk["hats"] > 0:
                drm_b.add(tk, a19.hat(False, 1.0), lk["hats"] * (0.6 if k % 2 else 1.0), 0.55)
        for k in range(4):
            tk = t0 + k * BEAT
            lk = section_level(tk + 0.01)
            if lk["kick"] > 0 and k in (0, 2):
                drm_b.add(tk, a19.kick(), lk["kick"] * 0.55)
            if lk["kick"] > 0.5 and k in (1, 3):
                drm_b.add(tk, a19.clap(), 0.18)
    # tensão na resposta: pulso grave em semínimas + relógio
    t = S["ans"]
    while t < S["rev"] - 0.2:
        pul_b.add(t, pluck(hz("D2"), 0.6, 600), 0.5)
        t += BEAT
    for i in range(int((M(36.4) - M(34.4)) / 0.5)):
        fx_b.add(M(34.4) + i * 0.5, tick(), 0.18, 0.4 + 0.2 * (i % 2))
    # piano: notas esparsas na pergunta, graves na frase-chave, motivo na conclusão e fecho
    for at, n, vel in [(S["q"], "D5", 0.22), (M(28.72), "A4", 0.2), (M(57.92), "D3", 0.3), (S["prob"], "A2", 0.32)]:
        pno_b.add(at, a20.piano(midi(n), vel, 3.0), 1.0, 0.5)
    motif = ["A4", "D5", "F5", "E5", "D5", "C5", "A4", "D5"]
    for i, n in enumerate(motif):
        pno_b.add(S["conc"] + 0.4 + i * BEAT * 0.75, a20.piano(midi(n), 0.2 - 0.008 * i, 2.4), 1.0, 0.45 + 0.1 * (i % 2))
    for i, n in enumerate(["D3", "A3", "D4", "F4", "A4", "E5"]):
        pno_b.add(S["outro"] + 0.3 + i * 0.05, a20.piano(midi(n), 0.26, 4.5), 1.0, 0.5)

    # ——— efeitos sonoros (tempo original → M) ———
    def W(at, d=0.4, cmax=1900, g=0.32, pan=0.5):
        L, R = a19.whoosh(d, cmax=cmax, seed=int(at * 10))
        fx_b.add(M(at) - d * 0.6, stereo(L, R), g, pan)

    fx_b.add(M(0.24), a19.impact(big=False), 0.28)
    for at, pan in [(0.24, 0.3), (0.56, 0.7)]:
        fx_b.add(M(at), click(), 0.22, pan)
    W(2.08, 0.6, 1500, 0.22)
    for at in (4.4, 6.64):
        fx_b.add(M(at), click(), 0.18)
    fx_b.add(M(8.08), a19.hit(), 0.42)
    fx_b.add(M(8.2), click(0.8), 0.16, 0.65)
    W(9.75, 0.5)
    fx_b.add(S["drop"], subdrop(), 0.5)
    W(11.4, 0.45, 1700, 0.26, 0.65)
    for at in (11.92, 13.2):
        fx_b.add(M(at), click(), 0.18)
    W(14.0, 0.9, 1300, 0.16)
    W(15.75, 0.45, 1700, 0.26, 0.35)
    for at in (19.52, 20.48, 21.28, 22.32):
        fx_b.add(M(at), click(), 0.22, 0.62)
    W(23.05, 0.45, 1500, 0.2)
    W(26.6, 0.45, 1600, 0.22, 0.65)
    fx_b.add(M(26.88), a19.hit(0.7), 0.2)
    W(30.35, 0.35, 1600, 0.2)
    fx_b.add(M(31.4), a19.shutter(), 0.2, 0.5)
    fx_b.add(M(31.4), a19.hit(0.8), 0.3)
    W(31.45, 0.5, 1700, 0.26, 0.3)
    fx_b.add(M(33.2), click(), 0.16)
    fx_b.add(M(36.8), a19.hit(0.6), 0.24)
    W(37.7, 0.5, 1700, 0.26, 0.6)
    L, R = a19.riser(S["diff"] - M(38.6), level=1.0)
    fx_b.add(M(38.6), stereo(L, R), 0.22)
    fx_b.add(S["diff"], subdrop(1.0, 1.8), 0.6)
    fx_b.add(S["diff"], a19.impact(big=False), 0.32)
    W(40.6, 0.55, 1800, 0.28, 0.7)
    fx_b.add(M(43.31), click(), 0.16, 0.7)
    fx_b.add(M(47.36), a19.hit(0.7), 0.26)
    fx_b.add(M(49.81), click(0.9), 0.18, 0.7)
    fx_b.add(M(50.95), click(), 0.2, 0.7)
    W(51.57, 1.0, 1300, 0.14, 0.7)
    L, R = a19.riser(M(53.6) - M(52.1), level=1.0)
    fx_b.add(M(52.1), stereo(L, R), 0.18)
    W(53.45, 0.55, 1800, 0.26)
    fx_b.add(M(54.56), a19.hit(0.8), 0.3)
    fx_b.add(S["peak"], a19.impact(big=True), 0.42)
    W(57.75, 0.45, 1700, 0.24, 0.65)
    fx_b.add(M(57.92), subdrop(0.8, 1.4), 0.38)
    fx_b.add(S["prob"], a19.hit(0.9), 0.38)
    W(61.95, 0.6, 1400, 0.2)
    W(67.95, 0.6, 1600, 0.24, 0.65)
    fx_b.add(S["outro"] + 1.9, click(), 0.24, 0.6)

    # ——— mistura ———
    irs = a20.hall_ir()
    music = pad_b.x * 0.55 + pul_b.x * 0.5 + pno_b.x * 0.7 + drm_b.x * 0.6
    wetsrc = pad_b.x * 0.4 + pul_b.x * 0.5 + pno_b.x * 0.9 + fx_b.x * 0.25
    wet = np.stack([fftconvolve(wetsrc[:, c], irs[c])[:N] for c in range(2)], 1) * 0.3
    music = music + wet
    # a revelação: a música sai antes do riser
    i0, i1 = int(M(38.2) * SR), int(S["split"] * SR)
    fade = np.ones(N)
    fade[i0 : i0 + int(0.4 * SR)] = np.linspace(1, 0, int(0.4 * SR))
    fade[i0 + int(0.4 * SR) : i1] = 0
    fade[i1 : i1 + int(0.5 * SR)] = np.linspace(0, 1, int(0.5 * SR))
    music *= fade[:, None]
    # fecho: cauda até ao fim
    io = int(min(N - 1, (total - 1.2) * SR))
    music[io:] *= np.linspace(1, 0, N - io)[:, None] ** 1.5
    # ducking pela voz (envolvente de 60 ms)
    env = np.sqrt(np.maximum(a19.lp(v**2, 6), 0))
    env = env / (np.percentile(env[env > 1e-4], 95) + 1e-9)
    duck = 1 - 0.55 * np.clip(env, 0, 1)
    music *= duck[:, None]
    fxm = fx_b.x * (1 - 0.3 * np.clip(env, 0, 1))[:, None]
    # níveis: música ~19 dB abaixo da voz (nas zonas com fala)
    act = env > 0.15
    vr = np.sqrt((v[act] ** 2).mean())
    mr = np.sqrt((music.mean(1)[act] ** 2).mean()) + 1e-9
    # níveis medidos em janelas de 50 ms com fala: a voz fica ~21 dB acima da música (mediana)
    # e os efeitos, mesmo nos picos (p95), ~13 dB abaixo da voz — presentes, nunca por cima dela
    hop = int(0.05 * SR)
    kk = N // hop
    wr = lambda x: np.sqrt((x[: kk * hop].reshape(kk, hop) ** 2).mean(1)) + 1e-9
    vw = wr(v)
    sp = vw > np.percentile(vw[vw > 1e-4], 40)
    mw = wr(music.mean(1))
    music *= 10 ** ((np.median(20 * np.log10(vw[sp]) - 20 * np.log10(mw[sp])) - 21) / 20)
    fw = wr(fxm.mean(1))
    on = fw > fw.max() * 0.05
    fxm *= 10 ** ((20 * np.log10(np.median(vw[sp])) - 13 - 20 * np.log10(np.percentile(fw[on], 95))) / 20)
    mix = np.stack([v, v], 1) + music + fxm
    bw = wr((music + fxm).mean(1))
    marg = 20 * np.log10(vw[sp]) - 20 * np.log10(bw[sp])
    print(f"voz acima de música+efeitos (janelas com fala): mediana {np.median(marg):.1f} dB, p10 {np.percentile(marg, 10):.1f} dB")
    mix = a19.hp(mix, 30, order=2) if mix.ndim == 1 else np.stack([a19.hp(mix[:, c], 30, order=2) for c in range(2)], 1)
    for _ in range(2):
        mix = mix * 10 ** ((-16.0 - a20.lufs(mix)) / 20)
    mix = a20.soft_limit(mix, ceiling=0.84)
    sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
    if "--stems" in sys.argv:
        d = sys.argv[sys.argv.index("--stems") + 1]
        os.makedirs(d, exist_ok=True)
        for nm, st in [("music", music), ("fx", fxm), ("voice", np.stack([v, v], 1))]:
            sf.write(os.path.join(d, nm + ".wav"), (st / (np.abs(st).max() + 1e-9) * 0.9).astype(np.float32), SR)
    vm = np.sqrt((mix[act].mean(1) ** 2).mean())
    print(f"ok {out} {total:.2f}s LUFS {a20.lufs(mix):.1f} pico {20 * np.log10(np.abs(mix).max()):.1f} dB")


if __name__ == "__main__":
    main()
