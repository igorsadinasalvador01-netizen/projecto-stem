#!/usr/bin/env python3
"""Sons próprios do vídeo 17 (sintetizados, sem downloads nem licenças de terceiros).

Uso: gen-v17-audio.py sfx
     gen-v17-audio.py bed <narracao_cortada> <cuts.json> <saida.m4a> <duracao_total_s>

sfx → public/sfx/v17_*.wav: entrada (swell invertido curto e longo), sub (impacto grave),
      slide e slide_long (transições suaves: sopro de ar filtrado, sem tom a subir — nada de
      sirene — e sem agudos; "soft" gera só estes, e também pb, cor e riser na versão suave),
      glitch (falha digital), pb (cor a escorrer → preto e branco), cor (volta da cor),
      riser (subida de 2 s) e hit (impacto cinematográfico).
bed → música de fundo a 100 BPM (pad, sub, kick, hats, arpejo) com secções que seguem a
      história (tensão, groove, quebra no "é aqui que falham", subida para "transformar") e
      ducking à voz já aplicado (a música baixa ~9 dB quando há fala e sobe nas pausas).
"""
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000
rng = np.random.default_rng(17)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def sweep_lp(x, f0, f1, curve=1.0):
    """passa-baixo de 1 polo com corte a variar no tempo (f0 → f1)"""
    n = len(x)
    k = (np.arange(n) / max(1, n - 1)) ** curve
    fc = f0 * (f1 / f0) ** k
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty(n)
    acc = 0.0
    for i in range(n):
        acc = a[i] * acc + (1 - a[i]) * x[i]
        y[i] = acc
    return y


def fade(x, a=0.004, b=0.01):
    n = len(x)
    na, nb = int(a * SR), int(b * SR)
    if na:
        x[:na] *= np.linspace(0, 1, na)
    if nb:
        x[n - nb :] *= np.linspace(1, 0, nb)
    return x


def save(name, L, R=None, peak=0.5):
    R = L if R is None else R
    st = np.stack([L, R], 1)
    st = st * (peak / (np.abs(st).max() + 1e-9))
    sf.write(os.path.join(ROOT, "public", "sfx", name), st.astype(np.float32), SR, subtype="PCM_16")


def tvec(d):
    return np.arange(int(d * SR)) / SR


def gen_sfx():
    # entrada: swell invertido (ruído a abrir + tom a subir), corte seco no fim
    for name, d, tone in [("v17_entry.wav", 0.42, 0.25), ("v17_entry_long.wav", 0.9, 0.45)]:
        t = tvec(d)
        env = (t / d) ** 2.6
        out = []
        for ch in range(2):
            nz = sweep_lp(rng.standard_normal(len(t)), 300, 7000, 1.4) * 0.9
            f = 220 * (2 ** (t / d * 1.0))
            ph = 2 * np.pi * np.cumsum(f) / SR
            tn = (np.sin(ph) + 0.4 * np.sin(2 * ph + ch)) * tone
            out.append(fade((nz + tn) * env, 0.002, 0.012))
        save(name, *out, peak=0.5)

    # sub: queda de 90 → 32 Hz, com pancada suave
    t = tvec(1.1)
    f = 32 + 58 * np.exp(-t / 0.12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.45)
    thump = lp(rng.standard_normal(len(t)), 900) * np.exp(-t / 0.03) * 0.5
    x = np.tanh(1.6 * (body + thump))
    save("v17_sub.wav", fade(x, 0.001, 0.08), peak=0.7)

    # glitch: rajadas digitais (quadradas com bitcrush) e ruído picotado
    d = 0.34
    n = int(d * SR)
    x = np.zeros(n)
    pos = 0
    while pos < n:
        seg = int(SR * rng.uniform(0.012, 0.045))
        kind = rng.integers(0, 3)
        tt = np.arange(seg) / SR
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * rng.uniform(250, 1900) * tt))
        elif kind == 1:
            s = rng.standard_normal(seg)
            s = np.repeat(s[:: 12], 12)[:seg]
        else:
            s = np.zeros(seg)
        s = np.round(s * 6) / 6
        x[pos : pos + seg] = s[: n - pos] * rng.uniform(0.4, 1.0)
        pos += seg
    x = hp(x, 180) * (0.6 + 0.4 * np.sin(np.linspace(0, 9 * np.pi, n)) ** 2)
    # suave: sem agudos ásperos (passa-baixo 3,8 kHz), ataque de 6 ms e a decair, mais baixo
    x = lp(x, 3800) * np.exp(-np.arange(n) / SR / 0.14)
    save("v17_glitch.wav", fade(x, 0.006, 0.04), np.roll(fade(x.copy(), 0.006, 0.04), 240), peak=0.3)

    # pb: a cor "escorre" (ruído a fechar 6 kHz → 250 Hz + tom a descer)
    t = tvec(0.65)
    out = []
    for ch in range(2):
        nz = sweep_lp(rng.standard_normal(len(t)), 6000, 250, 0.7)
        f = 620 * (0.2 ** (t / 0.65))
        tn = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35
        env = np.minimum(1, t / 0.03) * np.exp(-t / 0.32)
        out.append(fade((nz + tn) * env, 0.002, 0.05))
    save("v17_pb.wav", *out, peak=0.45)

    # cor: o inverso, a abrir com brilho
    t = tvec(0.55)
    out = []
    for ch in range(2):
        nz = sweep_lp(rng.standard_normal(len(t)), 300, 9000, 1.2) * 0.6
        sh = sum(np.sin(2 * np.pi * fr * t + ch) for fr in (1320, 1760, 2640)) * 0.12
        env = np.minimum(1, t / 0.2) * np.exp(-np.maximum(0, t - 0.2) / 0.12)
        out.append(fade((nz + sh) * env, 0.002, 0.04))
    save("v17_cor.wav", *out, peak=0.4)

    # riser de 2 s (ruído + serra a subir, trémulo a acelerar), acaba no pico
    t = tvec(2.0)
    out = []
    for ch in range(2):
        f = 180 * (2 ** (t / 2.0 * 2.6))
        ph = 2 * np.pi * np.cumsum(f) / SR
        saw = sum(np.sin(k * ph + ch * 0.3) / k for k in range(1, 7)) * 0.3
        nz = sweep_lp(rng.standard_normal(len(t)), 400, 9000, 1.6) * 0.7
        trem = 0.75 + 0.25 * np.sin(2 * np.pi * np.cumsum(4 + 14 * (t / 2.0) ** 2) / SR)
        out.append(fade((saw + nz) * trem * (t / 2.0) ** 2.2, 0.01, 0.015))
    save("v17_riser.wav", *out, peak=0.5)

    # hit cinematográfico: sub + estalo + anel metálico a decair
    t = tvec(1.4)
    f = 30 + 50 * np.exp(-t / 0.1)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.5)
    crack = bp(rng.standard_normal(len(t)), 1500, 8000) * np.exp(-t / 0.02) * 0.8
    ring = sum(np.sin(2 * np.pi * fr * t) * np.exp(-t / dd) for fr, dd in ((415, 0.6), (622, 0.45), (1244, 0.3))) * 0.18
    x = np.tanh(1.3 * (sub + crack + ring))
    save("v17_hit.wav", fade(x, 0.001, 0.1), fade(np.tanh(1.3 * (sub + np.roll(crack, 90) + ring)), 0.001, 0.1), peak=0.7)
    print("sfx ok")


# ——— transições suaves (sem ruído áspero) ———
def var_lp(x, fc):
    """passa-baixo de 1 polo com corte a variar amostra a amostra (fc em Hz, array)"""
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty(len(x))
    acc = 0.0
    for i in range(len(x)):
        acc = a[i] * acc + (1 - a[i]) * x[i]
        y[i] = acc
    return y


def air_slide(d, cmax=1500, pan=(0.3, 0.7), peak=0.4, seed=1, shape=(1.3, 1.2)):
    """slide suave SEM tom (nada de sirene): sopro de ar filtrado, o corte abre e fecha com o
    envelope (≤ cmax Hz, sem agudos ásperos) e o som atravessa o estéreo"""
    t = tvec(d)
    x = t / d
    env = (x ** shape[0]) * ((1 - x) ** shape[1])
    env /= env.max()
    srng = np.random.default_rng(seed)
    out = []
    for ch in range(2):
        nz = hp(srng.standard_normal(len(t)), 120)
        fc = 380 + (cmax - 380) * env
        y = var_lp(var_lp(nz, fc), fc)  # 2 polos
        y = lp(y, cmax * 1.3, order=4) * env
        p = pan[0] + (pan[1] - pan[0]) * x
        g = np.cos(p * np.pi / 2) if ch == 0 else np.sin(p * np.pi / 2)
        out.append(fade(y * g, 0.004, 0.03))
    return out[0], out[1], peak


def gen_soft():
    for name, args in [
        ("v17_shu.wav", dict(d=0.26, cmax=1900, pan=(0.42, 0.58), peak=0.3, seed=11, shape=(0.55, 2.2))),  # "shu": sopro curto, quase inaudível
        ("v17_slide.wav", dict(d=0.36, cmax=1600, seed=3)),  # transições entre cenas
        ("v17_slide_long.wav", dict(d=0.6, cmax=1400, seed=5)),  # transição mais longa
        ("v17_pb.wav", dict(d=0.5, cmax=1100, pan=(0.7, 0.3), peak=0.32, seed=7)),  # cor → preto e branco
        ("v17_cor.wav", dict(d=0.5, cmax=1800, peak=0.32, seed=9)),  # volta da cor
    ]:
        L, R, peak = air_slide(**args)
        save(name, L, R, peak=peak)
    # riser suave: dois tons a subir + "ar" filtrado (corte a abrir só até 2,5 kHz)
    t = tvec(2.0)
    x = t / 2.0
    out = []
    srng = np.random.default_rng(29)
    for ch in range(2):
        f = 200 * (2 ** (x * 2.0))
        ph = 2 * np.pi * np.cumsum(f * (1 + 0.004 * (ch * 2 - 1))) / SR
        tone = (np.sin(ph) + 0.35 * np.sin(2 * ph)) * 0.5
        nz = sweep_lp(srng.standard_normal(len(t)), 300, 2500, 1.5) * 0.35
        out.append(fade(lp(tone + nz, 2500, order=4) * x ** 2.2, 0.01, 0.02))
    save("v17_riser.wav", *out, peak=0.4)
    print("soft ok")


# ——— música de fundo ———
NOTE = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}


def hz(name, octv):
    return 440.0 * 2 ** ((NOTE[name] + 12 * (octv - 4)) / 12)


CHORDS = [  # Am9 · Fmaj7 · Cmaj7 · G6 (2 compassos cada)
    ("A", [("A", 3), ("C", 4), ("E", 4), ("G", 4), ("B", 4)]),
    ("F", [("F", 3), ("A", 3), ("C", 4), ("E", 4), ("G", 4)]),
    ("C", [("C", 4), ("E", 4), ("G", 4), ("B", 4), ("D", 5)]),
    ("G", [("G", 3), ("B", 3), ("D", 4), ("E", 4), ("A", 4)]),
]


def osc_saw(f, t, harm=7):
    ph = 2 * np.pi * f * t
    return sum(np.sin(k * ph) / k for k in range(1, harm + 1))


def gen_bed(narr, cuts_path, out_path, total):
    cuts = json.load(open(cuts_path))
    fps = cuts["fps"]
    segs, o = [], 0.0
    for a, b in cuts["keep"]:
        segs.append((a / fps, b / fps, o))
        o += (b - a) / fps

    def M(x):
        for s, e, oo in segs:
            if x < s:
                return oo
            if x <= e:
                return oo + x - s
        s, e, oo = segs[-1]
        return oo + e - s + x - e

    n = int(total * SR)
    t = np.arange(n) / SR
    bpm = 100.0
    beat = 60 / bpm
    bar = beat * 4
    L = np.zeros(n)
    R = np.zeros(n)

    # secções (tempo original da fala → montagem): nível de cada camada
    #            início  pad  sub  kick hats arp  corte_pad
    SEC_SRC = [
        (0.0, 0.8, 0.6, 0.0, 0.35, 0.0, 900),  # o problema: tensão
        (8.2, 0.8, 0.8, 0.7, 0.6, 0.0, 1300),  # não basta ser bom: entra o kick
        (15.6, 0.6, 0.0, 0.0, 0.0, 0.0, 700),  # "exemplo": quebra curta
        (16.6, 0.8, 0.9, 0.9, 0.8, 0.7, 1700),  # propostas: groove + arpejo
        (36.2, 0.85, 0.9, 0.9, 0.9, 0.8, 2200),  # o que se vende: abre
        (42.25, 0.55, 0.5, 0.0, 0.0, 0.0, 500),  # é aqui que falham: fecha (PB)
        (49.2, 0.85, 0.9, 0.9, 0.85, 0.8, 2000),  # o valor: volta tudo
        (51.4, 0.75, 0.7, 0.5, 0.6, 0.4, 1500),  # guarda isto: mais calmo
        (55.1, 0.85, 0.9, 0.8, 0.8, 0.8, 2300),  # transformar: sobe
        (59.6, 0.8, 0.8, 0.7, 0.7, 0.6, 1800),  # segue o perfil
        (64.0, 0.7, 0.4, 0.0, 0.3, 0.3, 1200),  # fecho
    ]
    secs = [(M(s),) + tuple(v) for s, *v in SEC_SRC]

    def level(idx):
        """curva de nível por camada, com transições de 0,25 s"""
        y = np.zeros(n)
        for k, sec in enumerate(secs):
            a = int(sec[0] * SR)
            b = int(secs[k + 1][0] * SR) if k + 1 < len(secs) else n
            y[a:b] = sec[1 + idx]
        w = int(0.25 * SR)
        ker = np.ones(w) / w
        return np.convolve(y, ker, mode="same")

    lv_pad, lv_sub, lv_kick, lv_hat, lv_arp, lv_cut = (level(i) for i in range(6))

    # pad: 5 notas por acorde, 3 osciladores desafinados por nota, L/R com afinações diferentes
    chord_len = bar * 2
    for ci in range(int(np.ceil(total / chord_len)) + 1):
        root, notes = CHORDS[ci % len(CHORDS)]
        a = ci * chord_len - 0.4
        b = a + chord_len + 0.8
        ia, ib = max(0, int(a * SR)), min(n, int(b * SR))
        if ia >= ib:
            continue
        tt = t[ia:ib] - a
        env = np.minimum(1, tt / 0.7) * np.minimum(1, (b - a - tt) / 0.7)
        for nm, oc in notes:
            f = hz(nm, oc)
            for det, gl, gr in ((-0.004, 0.8, 0.35), (0.0, 0.6, 0.6), (0.005, 0.35, 0.8)):
                s = osc_saw(f * (1 + det), tt, 5) * env * 0.055
                L[ia:ib] += s * gl
                R[ia:ib] += s * gr
        # sub na fundamental
        fsub = hz(root, 2) if root == "C" else hz(root, 1)
        sub = np.sin(2 * np.pi * fsub * tt) * env * 0.13
        L[ia:ib] += sub * lv_sub[ia:ib]
        R[ia:ib] += sub * lv_sub[ia:ib]

    # filtro do pad a acompanhar as secções (aproximação: mistura de 3 cortes fixos)
    lo = np.stack([lp(L, 500), lp(R, 500)])
    mid = np.stack([lp(L, 1200), lp(R, 1200)])
    hi = np.stack([lp(L, 2400), lp(R, 2400)])
    c = np.clip((lv_cut - 500) / 700, 0, 1)
    c2 = np.clip((lv_cut - 1200) / 1200, 0, 1)
    pad = lo * (1 - c) + mid * c * (1 - c2) + hi * c2
    pad *= lv_pad

    drums = np.zeros((2, n))
    nb = int(total / beat) + 1
    for k in range(nb):
        tb = k * beat
        ib = int(tb * SR)
        if ib >= n:
            break
        # kick nos tempos 1 e 3, com bombeamento do sub/pad
        if k % 2 == 0:
            d = int(0.3 * SR)
            tt = np.arange(min(d, n - ib)) / SR
            f = 45 + 75 * np.exp(-tt / 0.035)
            kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.11) * 0.32
            kick += lp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt / 0.004) * 0.08
            g = lv_kick[ib]
            drums[:, ib : ib + len(tt)] += kick * g
        # hats nos contratempos (colcheias)
        for half, vel in ((0.5, 1.0), (0.0, 0.45)):
            ih = int((tb + half * beat) * SR)
            if ih >= n:
                continue
            d = int(0.05 * SR)
            tt = np.arange(min(d, n - ih)) / SR
            hat = hp(rng.standard_normal(len(tt)), 7000) * np.exp(-tt / 0.012) * 0.09 * vel
            drums[0, ih : ih + len(tt)] += hat * lv_hat[ih] * (0.8 if half else 1.0)
            drums[1, ih : ih + len(tt)] += hat * lv_hat[ih] * (1.0 if half else 0.8)
        # clap leve nos tempos 2 e 4 quando há groove
        if k % 4 in (1, 3):
            d = int(0.16 * SR)
            tt = np.arange(min(d, n - ib)) / SR
            clap = bp(rng.standard_normal(len(tt)), 900, 4000) * np.exp(-tt / 0.05) * 0.08
            drums[:, ib : ib + len(tt)] += clap * lv_kick[ib] * 0.8

    # arpejo: colcheias com as notas do acorde uma oitava acima, pluck triangular
    arp = np.zeros((2, n))
    for k in range(int(total / (beat / 2)) + 1):
        ts = k * beat / 2
        ci = int(ts // chord_len)
        _, notes = CHORDS[ci % len(CHORDS)]
        nm, oc = notes[[0, 2, 3, 4, 2, 3, 1, 4][k % 8]]
        f = hz(nm, oc + 1)
        i0 = int(ts * SR)
        if i0 >= n:
            break
        d = int(0.4 * SR)
        tt = np.arange(min(d, n - i0)) / SR
        tri = (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * f * tt))
        p = tri * np.exp(-tt / 0.11) * 0.07 * lv_arp[i0]
        pan = 0.5 + 0.35 * np.sin(k * 0.9)
        arp[0, i0 : i0 + len(tt)] += p * (1 - pan) * 2
        arp[1, i0 : i0 + len(tt)] += p * pan * 2
    arp = np.stack([lp(arp[0], 3500), lp(arp[1], 3500)])
    # eco simples (colcheia pontuada) no arpejo
    dly = int(beat * 0.75 * SR)
    arp[:, dly:] += arp[:, :-dly] * 0.3

    # bombeamento (sidechain ao kick) no pad
    pump = np.ones(n)
    for k in range(0, nb, 2):
        ib = int(k * beat * SR)
        d = int(0.28 * SR)
        if ib >= n:
            break
        seg = 1 - 0.35 * np.exp(-np.arange(min(d, n - ib)) / SR / 0.09)
        pump[ib : ib + len(seg)] = np.minimum(pump[ib : ib + len(seg)], 1 - (1 - seg) * lv_kick[ib])

    # EQ a pensar na voz: pad sem graves embolados (passa-alto 160 Hz) e com a zona da fala
    # (350 Hz–2,5 kHz) rebaixada ~7 dB, para a música rodear a voz em vez de a tapar
    pad = np.stack([hp(pad[0], 160), hp(pad[1], 160)])
    pad = pad - 0.55 * np.stack([bp(pad[0], 350, 2500), bp(pad[1], 350, 2500)])
    arp = arp - 0.45 * np.stack([bp(arp[0], 350, 2000), bp(arp[1], 350, 2000)])
    drums = np.stack([hp(drums[0], 38), hp(drums[1], 38)])
    mix = pad * pump + drums + arp
    # fade de entrada e de saída
    fi = int(0.6 * SR)
    mix[:, :fi] *= np.linspace(0, 1, fi)
    fo = int(1.6 * SR)
    mix[:, n - fo :] *= np.linspace(1, 0, fo) ** 1.5

    # ducking à voz: envelope da narração (ataque 20 ms, libertação 300 ms) → -9 dB na fala
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", narr, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    v = np.frombuffer(pcm, dtype=np.float32)
    v = np.pad(v, (0, max(0, n - len(v))))[:n]
    hop = SR // 200
    m = n // hop
    rms = np.sqrt(np.mean(v[: m * hop].reshape(m, hop) ** 2, axis=1))
    act = np.clip((20 * np.log10(rms + 1e-9) + 48) / 14, 0, 1)
    env = np.zeros(m)
    acc = 0.0
    for i in range(m):
        k = 0.45 if act[i] > acc else 0.017
        acc += (act[i] - acc) * k
        env[i] = acc
    # olhar 40 ms à frente para a música baixar antes da primeira sílaba
    env = np.maximum(env, np.concatenate([env[8:], np.zeros(8)]))
    duck = np.repeat(1 - 0.72 * env, hop)
    duck = np.pad(duck, (0, n - len(duck)), constant_values=1.0)
    mix *= duck

    mix = np.tanh(mix * 1.1) / 1.1
    target = 10 ** (-27 / 20)  # RMS alvo da música (antes do volume da composição)
    mix *= target / (np.sqrt(np.mean(mix**2)) + 1e-9)
    print("bed peak", np.abs(mix).max(), "rms dB", 20 * np.log10(np.sqrt(np.mean(mix**2))))
    tmp = out_path + ".wav"
    sf.write(tmp, mix.T.astype(np.float32), SR, subtype="FLOAT")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-c:a", "aac", "-b:a", "256k", out_path], check=True)
    os.remove(tmp)
    print("bed ok", out_path)


if __name__ == "__main__":
    if sys.argv[1] == "sfx":
        gen_sfx()
        gen_soft()
    elif sys.argv[1] == "soft":
        gen_soft()
    else:
        gen_bed(sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]))
