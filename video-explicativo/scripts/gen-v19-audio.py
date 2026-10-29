#!/usr/bin/env python3
"""Vídeo 19 (ginásio): música original + efeitos sonoros, sintetizados aqui (sem samples de terceiros,
sem questões de licença). Lê a montagem em src/v19/edit19.json para que cortes, impactos, whooshes e
risers caiam exatamente nas batidas da imagem.

Uso: gen-v19-audio.py <saida.wav> [--stems <pasta>]

Estilo: phonk / trap cinematográfico escuro, 140 BPM, Fá menor. 808 saturado com slides, kick, clap
em meio-tempo, hats com rolos, cowbell melódico (assinatura phonk), pad escuro, sino FM no build.
Estrutura: hook (antevisão do drop) → intro/build (filtro a abrir, riser de ruído, sem tom de sirene)
→ silêncio de meia batida → drop → pausa com freeze → clímax → impacto final e cauda.
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt, sosfilt_zi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
ED = json.load(open(os.path.join(ROOT, "src", "v19", "edit19.json")))
BPM = ED["bpm"]
B = 60.0 / BPM  # batida (s)
ST = B / 4  # semicolcheia (s)
TOTAL = ED["beats"] * B + ED["tail"]
N = int(np.ceil(TOTAL * SR))
rng = np.random.default_rng(19)


def bt(b):
    return b * B


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output="sos")


def lp(x, f, order=2):
    return sosfilt(sos("low", f, order), x)


def hp(x, f, order=2):
    return sosfilt(sos("high", f, order), x)


def bp(x, lo, hi, order=2):
    return sosfilt(sos("band", [lo, hi], order), x)


def lp_sweep(x, f_of_t, block=480, order=2):
    """passa-baixo com corte a variar no tempo (por blocos de 10 ms, estado contínuo)"""
    y = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), block):
        f = float(np.clip(f_of_t((i + block / 2) / SR), 40, SR * 0.45))
        s = sos("low", f, order)
        if zi is None:
            zi = sosfilt_zi(s) * 0
        y[i : i + block], zi = sosfilt(s, x[i : i + block], zi=zi)
    return y


def tv(d):
    return np.arange(int(d * SR)) / SR


def env_ad(n, a, d, total=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def fade(x, a=0.002, b=0.01):
    na, nb = int(a * SR), int(b * SR)
    if na:
        x[:na] *= np.linspace(0, 1, na)
    if nb and nb < len(x):
        x[len(x) - nb :] *= np.linspace(1, 0, nb)
    return x


def note(n):
    """nome → Hz (A4 = 440)"""
    names = {"C": 0, "Db": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "Gb": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
    nm, oc = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((names[nm] + 12 * (oc + 1) - 69) / 12)


class Bus:
    def __init__(self):
        self.L = np.zeros(N)
        self.R = np.zeros(N)

    def add(self, t0, x, gain=1.0, pan=0.5, xr=None):
        i = int(round(t0 * SR))
        if i >= N:
            return
        xl = x
        xr = x if xr is None else xr
        j = min(N, i + len(xl))
        if i < 0:
            xl, xr, i = xl[-i:], xr[-i:], 0
            j = min(N, i + len(xl))
        gl, gr = np.cos(pan * np.pi / 2) * 1.414, np.sin(pan * np.pi / 2) * 1.414
        self.L[i:j] += xl[: j - i] * gain * gl
        self.R[i:j] += xr[: j - i] * gain * gr

    def st(self):
        return np.stack([self.L, self.R], 1)


# ——————————————————————————— instrumentos ———————————————————————————
def kick(level=1.0):
    t = tv(0.42)
    f = 46 + 95 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.26)
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t / 0.0025) * 0.35
    x = np.tanh(1.8 * (body + click)) / np.tanh(1.8)
    return fade(x * level, 0.0005, 0.03)


def clap(level=1.0):
    t = tv(0.5)
    nz = rng.standard_normal(len(t))
    e = np.zeros(len(t))
    for k, o in enumerate([0, 0.009, 0.017]):
        e += (t >= o) * np.exp(-np.maximum(t - o, 0) / (0.006 if k < 2 else 0.13)) * (0.8 if k < 2 else 1.0)
    x = bp(nz, 900, 4200) * e
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t / 0.05) * 0.35
    return fade((x + body) * level, 0.0005, 0.05)


def hat(open_=False, level=1.0):
    d = 0.32 if open_ else 0.06
    t = tv(d)
    nz = rng.standard_normal(len(t))
    # metálico: soma de quadradas inarmónicas + ruído, passa-alto alto
    metal = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in (317, 451, 597, 721, 893, 1043)) / 6
    x = hp(0.55 * nz + 0.45 * metal, 7200, order=4)
    x *= np.exp(-t / (0.11 if open_ else 0.016))
    return fade(x * level, 0.0003, 0.01)


def rim(level=1.0):
    t = tv(0.12)
    x = bp(rng.standard_normal(len(t)), 1500, 5000) * np.exp(-t / 0.01) + np.sin(2 * np.pi * 820 * t) * np.exp(-t / 0.02) * 0.5
    return fade(x * level, 0.0003, 0.01)


def bass808(f0, dur, glide_to=None, glide_t=0.08, drive=2.6, level=1.0, decay=0.85):
    t = tv(dur + 0.04)
    if glide_to:
        k = np.clip((t - max(0.0, dur - glide_t - 0.05)) / glide_t, 0, 1)
        f = f0 * (glide_to / f0) ** (k * k * (3 - 2 * k))
    else:
        f = np.full(len(t), f0)
    f = f * (1 + 0.5 * np.exp(-t / 0.012))  # pequeno "punch" de afinação no ataque
    ph = 2 * np.pi * np.cumsum(f) / SR
    e = np.minimum(1, t / 0.003) * np.exp(-t / decay)
    e[t > dur] *= np.exp(-(t[t > dur] - dur) / 0.012)
    x = np.sin(ph) * e
    x = np.tanh(drive * x) / np.tanh(drive)  # harmónicos: o 808 ouve-se no telemóvel
    x = lp(x, 2400)
    return fade(x * level, 0.001, 0.02)


def cowbell(f, level=1.0, dur=0.32):
    t = tv(dur)
    sq = np.sign(np.sin(2 * np.pi * f * t)) * 0.6 + np.sign(np.sin(2 * np.pi * f * 1.4836 * t)) * 0.4
    x = bp(sq, f * 0.9, min(f * 5.5, 9000), order=2)
    e = 0.7 * np.exp(-t / 0.035) + 0.3 * np.exp(-t / 0.16)
    x = lp(x * e, 5200)
    return fade(x * level, 0.0005, 0.02)


def bell(f, dur=2.2, level=1.0):
    t = tv(dur)
    idx = 2.4 * np.exp(-t / 0.35)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t / 0.9)
    x += 0.25 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / 0.4)
    return fade(lp(x, 4200) * level, 0.002, 0.2)


def pad_chord(freqs, dur, level=1.0, bright=1100.0):
    t = tv(dur)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for f in freqs:
        for det, side in ((-0.006, 0), (0.0, 2), (0.006, 1)):
            ff = f * (1 + det)
            ph = rng.uniform(0, 2 * np.pi)
            saw = 2 * ((ff * t + ph / (2 * np.pi)) % 1.0) - 1
            if side in (0, 2):
                L += saw
            if side in (1, 2):
                R += saw
    e = np.minimum(1, t / 0.5) * np.minimum(1, (dur - t) / 0.35).clip(0, 1)
    L = lp(L, bright, order=2) * e
    R = lp(R, bright, order=2) * e
    sc = level / (len(freqs) * 2.0)
    return L * sc, R * sc


# ——————————————————————————— efeitos ———————————————————————————
def impact(level=1.0, big=True):
    t = tv(2.6 if big else 1.6)
    f = 30 + 42 * np.exp(-t / 0.18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    boom = np.sin(ph) * np.exp(-t / (0.95 if big else 0.6))
    thump = lp(rng.standard_normal(len(t)), 220, order=4) * np.exp(-t / 0.12) * 2.2
    crack = bp(rng.standard_normal(len(t)), 600, 2600) * np.exp(-t / 0.02) * 0.35
    x = np.tanh(1.6 * (boom + thump + crack)) / np.tanh(1.6)
    return fade(x * level, 0.0005, 0.3)


def hit(level=1.0):
    t = tv(0.6)
    f = 40 + 70 * np.exp(-t / 0.05)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / 0.22) + lp(rng.standard_normal(len(t)), 300) * np.exp(-t / 0.05) * 0.9
    return fade(np.tanh(1.4 * x) * level, 0.0005, 0.05)


def whoosh(d=0.34, cmax=2300, seed=1, shape=(1.6, 1.1)):
    """sopro de ar SEM tom (nada de sirene): ruído filtrado, abre e fecha com o envelope"""
    t = tv(d)
    x = t / d
    e = (x ** shape[0]) * ((1 - x) ** shape[1])
    e /= e.max()
    r = np.random.default_rng(seed)
    out = []
    for ch in range(2):
        nz = hp(r.standard_normal(len(t)), 150)
        y = lp_sweep(nz, lambda s: 350 + (cmax - 350) * np.interp(s, t, e), block=240)
        y = lp(y, cmax * 1.25, order=4) * e
        out.append(fade(y, 0.003, 0.03))
    return out


def riser(d, level=1.0, seed=3):
    """riser de ruído (sem altura definida): amplitude e brilho sobem, corta seco no fim"""
    t = tv(d)
    x = t / d
    r = np.random.default_rng(seed)
    out = []
    for ch in range(2):
        nz = r.standard_normal(len(t))
        pink = lp(nz, 1800) + 0.4 * nz
        y = lp_sweep(pink, lambda s: 260 + 5200 * (s / d) ** 2.2)
        y = hp(y, 140) * (x ** 2.4)
        out.append(fade(y * level, 0.01, 0.004))
    return out


def reverse_swell(d, level=1.0, seed=5):
    t = tv(d)
    r = np.random.default_rng(seed)
    out = []
    for ch in range(2):
        y = lp(r.standard_normal(len(t)), 2200) * np.exp(-t / (d * 0.35))
        out.append(fade(y[::-1].copy() * level, 0.01, 0.004))
    return out


def shutter(level=1.0):
    t = tv(0.09)
    c = lambda o: (t >= o) * np.exp(-np.maximum(t - o, 0) / 0.004)
    x = bp(rng.standard_normal(len(t)), 1800, 6000) * (c(0) + 0.6 * c(0.035))
    return fade(x * level, 0.0002, 0.01)


def reverb_ir(rt=1.8, pre=0.018, bright=5000, seed=7):
    t = tv(rt * 1.4)
    r = np.random.default_rng(seed)
    irs = []
    for ch in range(2):
        ir = r.standard_normal(len(t)) * np.exp(-t * 6.9 / rt)
        ir = lp(ir, bright)
        ir = np.concatenate([np.zeros(int(pre * SR)), ir])
        irs.append(ir / np.sqrt((ir ** 2).sum()))
    return irs


def apply_reverb(bus, ir, wet):
    st = bus.st()
    L = fftconvolve(st[:, 0], ir[0])[:N] * wet
    R = fftconvolve(st[:, 1], ir[1])[:N] * wet
    return np.stack([L, R], 1)


def delay(st, t_d, fb=0.35, mix=0.3, lp_f=3500):
    d = int(t_d * SR)
    out = np.zeros_like(st)
    buf = st.copy()
    g = 1.0
    for k in range(1, 6):
        g *= fb
        sh = np.zeros_like(st)
        sh[d * k :] = buf[: N - d * k]
        out += sh * g
    out[:, 0] = lp(out[:, 0], lp_f)
    out[:, 1] = lp(out[:, 1], lp_f)
    # ping-pong ligeiro
    out[:, 0], out[:, 1] = out[:, 0] * 0.8 + out[:, 1] * 0.2, out[:, 1] * 0.8 + out[:, 0] * 0.2
    return st + out * mix


# ——————————————————————————— arranjo ———————————————————————————
CH = ["Fm", "Db", "Fm", "Db", "Fm", "Db", "Bbm", "C", "Fm", "Db", "Bbm", "C", "Fm", "Db", "Fm", "Db", "Bbm", "C", "Fm", "Fm"]
PAD = {"Fm": ["F3", "Ab3", "C4", "F4"], "Db": ["Db3", "F3", "Ab3", "Db4"], "Bbm": ["Bb2", "Db3", "F3", "Bb3"], "C": ["C3", "E3", "G3", "C4"]}
ROOT808 = {"Fm": "F1", "Db": "Db2", "Bbm": "Bb1", "C": "C2"}
COW = {
    "Fm": [(0, "F5"), (3, "F5"), (6, "Ab5"), (8, "C6"), (10, "Ab5"), (12, "F5"), (14, "Eb5")],
    "Db": [(0, "F5"), (3, "F5"), (6, "Ab5"), (8, "Db6"), (10, "C6"), (12, "Ab5"), (14, "F5")],
    "Bbm": [(0, "F5"), (3, "F5"), (6, "Db6"), (8, "Bb5"), (10, "Ab5"), (12, "F5"), (14, "Db5")],
    "C": [(0, "E5"), (3, "E5"), (6, "G5"), (8, "C6"), (10, "Bb5"), (12, "G5"), (14, "E5")],
}


def section(b):
    if b < 8:
        return "hook"
    if b < 16:
        return "intro"
    if b < 24:
        return "build1"
    if b < 31.5:
        return "build2"
    if b < 32:
        return "gap"
    if b < 52:
        return "drop"
    if b < 56:
        return "break"
    if b < 72:
        return "climax"
    return "end"


def main():
    out = sys.argv[1]
    stems_dir = sys.argv[sys.argv.index("--stems") + 1] if "--stems" in sys.argv else None
    drums, bass, cow, pad, bellb, sfx = Bus(), Bus(), Bus(), Bus(), Bus(), Bus()
    K = kick()
    CL = clap()
    HC = [hat(False, 1.0) for _ in range(4)]
    HO = hat(True, 1.0)

    nbars = ED["beats"] // 4
    for bar in range(nbars):
        b0 = bar * 4
        sec = section(b0 + 0.01)
        ch = CH[bar]
        tb = bt(b0)
        full = sec in ("hook", "drop", "climax")
        # ——— pad
        if sec != "gap":
            L, R = pad_chord([note(n) for n in PAD[ch]], 4 * B + 0.4, level=1.0, bright=1500 if full else 900)
            pad.add(tb, L, 0.55 if full else 0.75, 0.5, R)
        # ——— bateria
        if full or sec == "build2":
            kicks = [0, 7, 10] if bar % 2 == 0 else [0, 10, 13]
            if sec == "climax" and bar % 2 == 1:
                kicks = [0, 6, 10, 13]
            for s in kicks:
                drums.add(tb + s * ST, K, 0.95)
            drums.add(tb + 8 * ST, CL, 0.55)
            if sec == "climax":
                drums.add(tb + 15 * ST, CL, 0.14)
            # hats
            for s in range(0, 16, 2):
                if sec == "build2" and bar == 7 and s >= 8:
                    continue
                drums.add(tb + s * ST, HC[s % 4], 0.16 if s % 4 else 0.11, 0.56)
            if bar % 2 == 1 or sec == "climax":
                for k in range(6):  # tercinas na 4ª batida
                    drums.add(tb + (12 + k * 4 / 6) * ST, HC[k % 4], 0.07 + 0.012 * k, 0.6)
            else:
                for s in (13, 15):
                    drums.add(tb + s * ST, HC[1], 0.08, 0.6)
            if sec == "climax":
                for s in (6, 14):
                    drums.add(tb + s * ST, HO, 0.06, 0.4)
        elif sec == "build1":
            for s in range(0, 16, 2):
                drums.add(tb + s * ST, HC[s % 4], 0.07 if s % 4 else 0.05, 0.56)
            drums.add(tb + 8 * ST, rim(), 0.22, 0.45)
        elif sec == "intro":
            drums.add(tb, K, 0.45)  # batimento lento
            drums.add(tb + 3 * ST, K, 0.2)
        # ——— 808
        root = note(ROOT808[ch])
        if full:
            pat = [(0, 6, None), (7, 2, None), (10, 4, root * 2 ** (3 / 12)), (14, 2, None)]
            if sec == "climax":
                pat = [(0, 6, None), (7, 2, None), (10, 3, None), (13, 1, None), (14, 2, root * 2)]
            for s, d, g in pat:
                bass.add(tb + s * ST, bass808(root, d * ST, glide_to=g), 0.7)
        elif sec == "build2":
            bass.add(tb, bass808(root, 6 * ST), 0.45)
            if bar == 6:
                bass.add(tb + 10 * ST, bass808(root, 4 * ST), 0.4)
        elif sec == "intro":
            bass.add(tb, bass808(root, 14 * ST, drive=1.4, decay=1.6), 0.38)
        elif sec == "build1":
            bass.add(tb, bass808(root, 12 * ST, drive=1.8, decay=1.2), 0.45)
            drums.add(tb, K, 0.5)
        # ——— cowbell
        if sec in ("drop", "climax") or sec == "build1":
            for s, nm in COW[ch]:
                f = note(nm)
                g = 0.3 if sec != "build1" else 0.36
                cow.add(tb + s * ST, cowbell(f), g, 0.45 if s % 4 else 0.55)
                if sec == "climax" and s in (8, 10):
                    cow.add(tb + s * ST, cowbell(f * 2, 0.5), g * 0.35, 0.7)
    # ——— sino FM (intro + build1): motivo esparso, com eco
    for b, nm in [(8, "F5"), (10, "C5"), (12, "Ab4"), (14, "G4"), (16, "F5"), (18, "Eb5"), (20, "Db5"), (22, "C5")]:
        bellb.add(bt(b), bell(note(nm)), 0.2, 0.42 if b % 4 else 0.58)

    # ——— filtro do build1 (cowbell abafado) e abertura no build2
    cowst = cow.st()
    lo_f = lambda s: 700 if s < bt(24) else (700 + 7000 * ((s - bt(24)) / (bt(31.5) - bt(24))) ** 1.6 if s < bt(31.5) else 12000)
    cw = np.stack([lp_sweep(cowst[:, 0], lo_f), lp_sweep(cowst[:, 1], lo_f)], 1)
    dst = drums.st()
    d_f = lambda s: (1800 + 9000 * ((s - bt(24)) / (bt(31.5) - bt(24))) ** 2) if bt(24) <= s < bt(31.5) else 16000
    dst = np.stack([lp_sweep(dst[:, 0], d_f), lp_sweep(dst[:, 1], d_f)], 1)
    cw = delay(cw, 0.75 * B, fb=0.32, mix=0.28)
    bst = delay(bellb.st(), 0.75 * B, fb=0.4, mix=0.45, lp_f=2600)

    # ——— efeitos da montagem
    for b in ED["impacts"]:
        sfx.add(bt(b), impact(big=b in (32, 56, 72)), 0.95 if b else 0.85)
    for b in ED["hits"]:
        sfx.add(bt(b), hit(), 0.55)
    for b in ED["freezeHits"]:
        sfx.add(bt(b), impact(big=False), 0.75)
        sfx.add(bt(b) - 0.005, shutter(), 0.22, 0.55)
    sfx.add(bt(72) - 0.005, shutter(), 0.2, 0.5)
    for a, e in ED["risers"]:
        L, R = riser(bt(e) - bt(a))
        sfx.add(bt(a), L, 0.34, 0.5, R)
    # swell inverso antes do título (b8) e antes do clímax
    L, R = reverse_swell(bt(1.0))
    sfx.add(bt(7), L, 0.32, 0.5, R)
    sfx.add(bt(8), hit(0.8), 0.45)
    # whooshes nas transições direcionais (pico no corte)
    seed = 11
    for sh in ED["shots"]:
        tr = sh.get("in", "cut")
        if tr.startswith("whip") or tr == "zoom":
            d = 0.5 if tr == "zoom" else 0.32
            L, R = whoosh(d, cmax=2000 if tr == "zoom" else 2300, seed=seed)
            seed += 1
            pan = {"whipL": 0.3, "whipR": 0.7}.get(tr, 0.5)
            sfx.add(bt(sh["b"][0]) - d * 0.6, L, 0.42, pan, R)

    # ——— mistura
    rev = reverb_ir(1.9)
    send = Bus()
    send.L = cw[:, 0] * 0.6 + dst[:, 0] * 0.18 + bst[:, 0] * 0.8 + sfx.L * 0.45
    send.R = cw[:, 1] * 0.6 + dst[:, 1] * 0.18 + bst[:, 1] * 0.8 + sfx.R * 0.45
    wet = apply_reverb(send, rev, 0.28)
    padst = pad.st()
    # sidechain: o pad, o cowbell e a reverb respiram com o kick
    sc = np.zeros(N)
    for bar in range(ED["beats"] // 4):
        sec = section(bar * 4 + 0.01)
        if sec in ("hook", "drop", "climax", "build2"):
            for s in ([0, 7, 10] if bar % 2 == 0 else [0, 10, 13]):
                i = int(bt(bar * 4 + s / 4) * SR)
                k = np.arange(int(0.25 * SR))
                seg = 0.55 * np.exp(-k / (0.09 * SR))
                j = min(N, i + len(seg))
                sc[i:j] = np.maximum(sc[i:j], seg[: j - i])
    duck = (1 - sc)[:, None]
    music = dst + bass.st() + cw * duck + padst * duck + bst + wet * duck
    # pausas: o gap (meia batida) e o fim do break ficam em silêncio musical
    for a, e in [(31.5, 32), (55.75, 56)]:
        i, j = int(bt(a) * SR), int(bt(e) * SR)
        r = int(0.01 * SR)
        music[i - r : i] *= np.linspace(1, 0, r)[:, None]
        music[i:j] = 0
    # break (b52–55.75): só pad grave + sub (o resto sai)
    i, j = int(bt(52) * SR), int(bt(55.75) * SR)
    brk = np.stack([lp(music[i:j, 0], 600), lp(music[i:j, 1], 600)], 1)
    music[i:j] = brk * 0.8
    # fim: depois do impacto final só ficam caudas, com fade
    i = int(bt(72.1) * SR)
    tail = np.linspace(1, 0, N - i) ** 1.6
    music[i:] *= tail[:, None]

    mix = music * 0.62 + sfx.st() * 0.9
    # sub inaudível (< 28 Hz) só gasta margem: fora
    mix = np.stack([hp(mix[:, 0], 28, order=4), hp(mix[:, 1], 28, order=4)], 1)
    # master: compressão suave → normaliza para ~−14 LUFS (Reels/TikTok) → limitador a −1 dBFS
    mix = bus_comp(mix)
    for _ in range(2):
        mix = mix * 10 ** ((TARGET_LUFS - lufs(mix)) / 20)
    pre = mix.copy()
    mix = limiter(mix)
    gr = 20 * np.log10(np.abs(mix).max(1).clip(1e-9) / np.abs(pre).max(1).clip(1e-9))
    print(f"LUFS {lufs(mix):.1f}  redução máx do limitador {gr.min():.1f} dB  (>1 dB em {100 * (gr < -1).mean():.1f}% das amostras)")
    sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
    if stems_dir:
        os.makedirs(stems_dir, exist_ok=True)
        for nm, st in [("drums", dst), ("bass", bass.st()), ("cow", cw), ("pad", padst), ("bell", bst), ("sfx", sfx.st()), ("wet", wet)]:
            sf.write(os.path.join(stems_dir, nm + ".wav"), (st / (np.abs(st).max() + 1e-9) * 0.9).astype(np.float32), SR)
    print("ok", out, f"{TOTAL:.3f}s", "pico", float(np.abs(mix).max()))


TARGET_LUFS = -14.0


def lufs(x):
    """loudness integrada BS.1770 (ponderação K, blocos de 400 ms, gating −70/−10)"""
    from scipy.signal import lfilter

    y = lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585], x, axis=0)
    y = lfilter([1, -2, 1], [1, -1.99004745483398, 0.99007225036621], y, axis=0)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    ms = np.array([np.mean(y[i : i + blk] ** 2, 0).sum() for i in range(0, len(y) - blk, hop)])
    l = -0.691 + 10 * np.log10(ms + 1e-12)
    g = ms[l > -70]
    rel = -0.691 + 10 * np.log10(g.mean()) - 10
    g = ms[(l > -70) & (l > rel)]
    return -0.691 + 10 * np.log10(g.mean())


def bus_comp(x):
    # compressor de barramento suave (RMS ~30 ms, rácio 1.6:1 acima de −16 dBFS)
    m = np.sqrt(lp(np.mean(x ** 2, 1), 5).clip(1e-12))
    db = 20 * np.log10(m + 1e-12)
    over = np.maximum(0, db + 16)
    g = 10 ** (-(over * (1 - 1 / 1.6)) / 20)
    return x * lp(g, 6)[:, None]


def limiter(x, ceiling=0.891):
    # limitador: envolvente de pico com antecipação de 3 ms
    la = int(0.003 * SR)
    pk = np.abs(x).max(1)
    pk = np.concatenate([pk[la:], np.zeros(la)])
    from scipy.ndimage import maximum_filter1d

    pk = maximum_filter1d(pk, la * 2 + 1)
    need = np.minimum(1, ceiling / (pk + 1e-9))
    # libertação suave (60 ms), ataque instantâneo
    rel = np.exp(-1 / (0.06 * SR))
    gg = np.empty_like(need)
    acc = 1.0
    for i in range(len(need)):
        acc = need[i] if need[i] < acc else acc * rel + need[i] * (1 - rel)
        gg[i] = acc
    return np.clip(x * gg[:, None], -ceiling, ceiling)


if __name__ == "__main__":
    main()
