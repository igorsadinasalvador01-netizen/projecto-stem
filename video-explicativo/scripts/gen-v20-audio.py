#!/usr/bin/env python3
"""Vídeo 20 ("A Moment of Silence"): banda sonora original, sintetizada aqui (sem samples de
terceiros). Lê src/v20/edit20.json para que cada gesto musical caia no gesto da imagem.

Uso: gen-v20-audio.py <saida.wav> [--stems <pasta>]

- Piano de feltro (síntese aditiva: inarmonicidade de corda real, decaimento em dois tempos,
  cordas ligeiramente desafinadas entre si, ataque macio de martelo), em Dó maior / Lá menor.
- Pad quente de cordas, muito baixo, a seguir a harmonia.
- Ambiente: tom de sala, cidade distante, um carro a passar ao longe durante o silêncio.
- Passos macios de bota na caminhada, nos fotogramas em que o calcanhar pousa.
- Arco: primeira nota quando ele aparece → cresce até à janela → cadência quando para →
  silêncio (só ar e pad) → motivo agudo quando olha para cima → o tema volta quando se vira →
  acorde final quando desaparece → uma nota no título.
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, lfilter, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ED = json.load(open(os.path.join(ROOT, "src", "v20", "edit20.json")))
SR = 48000
TOTAL = ED["total"]
N = int(TOTAL * SR)
rng = np.random.default_rng(20)


def sos(kind, f, order=2):
    return butter(order, f, kind, fs=SR, output="sos")


def lp(x, f, order=2):
    return sosfilt(sos("low", f, order), x, axis=0)


def hp(x, f, order=2):
    return sosfilt(sos("high", f, order), x, axis=0)


def bp(x, lo, hi, order=2):
    return sosfilt(sos("band", [lo, hi], order), x, axis=0)


def tv(d):
    return np.arange(int(d * SR)) / SR


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


class Bus:
    def __init__(self):
        self.x = np.zeros((N, 2))

    def add(self, t0, sig, gain=1.0, pan=0.5):
        i = int(round(t0 * SR))
        if i >= N:
            return
        if sig.ndim == 1:
            g = np.array([np.cos(pan * np.pi / 2), np.sin(pan * np.pi / 2)]) * 1.414
            sig = sig[:, None] * g[None, :]
        j = min(N, i + len(sig))
        self.x[i:j] += sig[: j - i] * gain


# ——————————————————————— piano de feltro ———————————————————————
def piano(m, vel, dur):
    f0 = midi_hz(m)
    tail = dur + 1.2
    t = tv(tail)
    B = 0.00012 * 2 ** ((m - 48) / 18)  # inarmonicidade cresce para o agudo
    T1 = 0.9 * (262 / f0) ** 0.35  # decaimento "prompt"
    T2 = 7.0 * (262 / f0) ** 0.55  # "aftersound" longo
    out = np.zeros(len(t))
    nmax = int(min(28, 6500 / f0))
    bright = 0.55 + 0.45 * vel
    for n in range(1, nmax + 1):
        fn = n * f0 * np.sqrt(1 + B * n * n)
        if fn > 9000:
            break
        a = (1 / n ** (1.55 - 0.55 * vel)) * np.exp(-n * 0.10 * (1.2 - bright))
        a *= abs(np.sin(np.pi * n / 7.3)) * 0.85 + 0.15  # posição do martelo (~1/7 da corda)
        d1 = T1 / (1 + 0.22 * n)
        d2 = T2 / (1 + 0.10 * n)
        env = 0.72 * np.exp(-t / d1) + 0.28 * np.exp(-t / d2)
        part = np.zeros(len(t))
        for det in (-0.6, 0.0, 0.7):  # três cordas, desafinadas em cêntimos (batimento quente)
            ph = rng.uniform(0, 2 * np.pi)
            part += np.sin(2 * np.pi * fn * (1 + det / 1731.0) * t + ph)
        out += a * env * part / 3
    att = np.minimum(1, t / (0.006 - 0.003 * vel))  # feltro: ataque macio
    out *= att
    # martelo: um toque de ruído grave, muito curto
    th = lp(rng.standard_normal(len(t)), 900) * np.exp(-t / 0.012) * 0.08 * vel
    out = out + th
    # abafador no fim da nota (com pedal, a cauda continua um pouco)
    rel = np.ones(len(t))
    k = t > dur
    rel[k] = np.exp(-(t[k] - dur) / 0.45)
    out = lp(out * rel, 2600 + 2600 * vel)
    return out * (0.25 + 0.75 * vel) / 3.0


# ——————————————————————— pad de cordas ———————————————————————
def pad(notes, a, b, level, att=1.4, rel=2.0):
    d = b - a + rel
    t = tv(d)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for m in notes:
        f = midi_hz(m)
        for det, side in ((-0.004, 0), (0.0, 2), (0.005, 1)):
            vib = 1 + 0.0015 * np.sin(2 * np.pi * (4.6 + det * 100) * t)
            ph = np.cumsum(f * (1 + det) * vib) / SR
            s = np.sin(2 * np.pi * ph) + 0.35 * np.sin(4 * np.pi * ph) + 0.12 * np.sin(6 * np.pi * ph)
            if side in (0, 2):
                L += s
            if side in (1, 2):
                R += s
    e = np.minimum(1, t / att) * np.clip((d - t) / rel, 0, 1)
    e = e * e * (3 - 2 * e)
    st = np.stack([L * e, R * e], 1) * level / (len(notes) * 2.5)
    return lp(st, 1500)


# ——————————————————————— ambiente e passos ———————————————————————
def ambience():
    t = np.arange(N) / SR
    room = hp(lp(rng.standard_normal((N, 2)), 320, order=2), 70) * 0.5 + lp(hp(rng.standard_normal((N, 2)), 300), 1400) * 0.06
    city = hp(lp(rng.standard_normal((N, 2)), 220, order=4), 55, order=2) * (1 + 0.25 * np.sin(2 * np.pi * 0.07 * t))[:, None]
    air = hp(rng.standard_normal((N, 2)), 2500, order=2) * 0.010
    amb = room * 0.006 + city * 0.008 + air
    # carro distante (sem tom): banda de ruído que aparece e desaparece durante o silêncio
    a, b = 16.2, 21.2
    i, j = int(a * SR), int(b * SR)
    tt = np.linspace(0, 1, j - i)
    env = np.sin(np.pi * tt) ** 2
    car = bp(rng.standard_normal((j - i, 2)), 90, 700) * env[:, None] * 0.018
    car[:, 0] *= 1 - 0.4 * tt
    car[:, 1] *= 0.6 + 0.4 * tt
    amb[i:j] += car
    fi = np.clip(t / 2.2, 0, 1)
    fo = np.clip((43.6 - t) / 4.0, 0, 1)
    return amb * (fi * fo)[:, None]


def footstep(level=1.0):
    t = tv(0.5)
    body = np.sin(2 * np.pi * (70 + 40 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.07)
    scuff = bp(rng.standard_normal(len(t)), 250, 1600) * np.exp(-t / 0.035) * 0.5
    x = lp(body + scuff, 1400) * level
    return x


def pchip(keys, q):
    """a mesma PCHIP monótona da composição (src/v20/edit20.ts)"""
    x = [k[0] for k in keys]
    y = [k[1] for k in keys]
    if q <= x[0]:
        return y[0]
    if q >= x[-1]:
        return y[-1]
    n = len(x)
    h = [x[i + 1] - x[i] for i in range(n - 1)]
    d = [(y[i + 1] - y[i]) / h[i] for i in range(n - 1)]
    if n == 2:
        m = [d[0], d[0]]
    else:
        m = [0.0] * n
        for i in range(1, n - 1):
            if d[i - 1] * d[i] <= 0:
                m[i] = 0
            else:
                w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
                m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])

        def end(h0, h1, d0, d1):
            v = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1)
            if np.sign(v) != np.sign(d0):
                v = 0
            elif np.sign(d0) != np.sign(d1) and abs(v) > abs(3 * d0):
                v = 3 * d0
            return v

        m[0] = end(h[0], h[1], d[0], d[1])
        m[-1] = end(h[-1], h[-2], d[-1], d[-2])
    i = 0
    while q > x[i + 1]:
        i += 1
    s = (q - x[i]) / h[i]
    return (2 * s**3 - 3 * s**2 + 1) * y[i] + (s**3 - 2 * s**2 + s) * h[i] * m[i] + (-2 * s**3 + 3 * s**2) * y[i + 1] + (s**3 - s**2) * h[i] * m[i + 1]


def src_to_out(shot, s):
    a, b = shot["t"][0][0], shot["t"][-1][0]
    for _ in range(60):
        mid = (a + b) / 2
        if pchip(shot["t"], mid) < s:
            a = mid
        else:
            b = mid
    return (a + b) / 2


# ——————————————————————— reverberação de sala grande ———————————————————————
def hall_ir(seed=9):
    r = np.random.default_rng(seed)
    t = tv(4.2)
    irs = []
    for ch in range(2):
        nz = r.standard_normal(len(t))
        lo = lp(nz, 500) * np.exp(-t * 6.9 / 3.6)
        mid = bp(nz, 500, 3000) * np.exp(-t * 6.9 / 2.8)
        hi = hp(nz, 3000) * np.exp(-t * 6.9 / 1.5) * 0.6
        ir = lo + mid + hi
        ir[: int(0.024 * SR)] = 0  # pré-atraso
        for k, (dt, g) in enumerate([(0.011, 0.5), (0.019, 0.35), (0.031, 0.3), (0.043, 0.2)]):
            ir[int((dt + 0.004 * ch) * SR)] += g
        irs.append(ir / np.sqrt((ir**2).sum()))
    return irs


def reverb(st, irs, wet):
    L = fftconvolve(st[:, 0], irs[0])[:N]
    R = fftconvolve(st[:, 1], irs[1])[:N]
    return np.stack([L, R], 1) * wet


# ——————————————————————— partitura (segundos da montagem) ———————————————————————
A2, C2, E3, F2, G2, C3, D3, G3, A3, B3 = 45, 36, 52, 41, 43, 48, 50, 55, 57, 59
C4, D4, E4, G4, A4, B4, C5, D5, E5, G5, A5, B5, C6, D6, E6 = 60, 62, 64, 67, 69, 71, 72, 74, 76, 79, 81, 83, 84, 86, 88


def score(cue):
    ap, ar, st, lu, rt, vn, tn = cue["appear"], cue["arrive"], cue["settle"], cue["lookUp"][0], cue["returnTheme"], cue["vanish"], cue["titleNote"]
    ev = []
    roll = lambda t0, notes, vel, dur, step=0.035: [ev.append((t0 + i * step, m, vel * (0.92 if i else 1), dur)) for i, m in enumerate(notes)]
    # aproximação: cresce devagar
    roll(ap, [A2, E3], 0.34, 6.0, 0.06)
    ev += [(ap + 0.55, C5, 0.30, 3.0), (ap + 1.45, B4, 0.27, 2.6), (ap + 2.25, E4, 0.24, 2.6), (ap + 2.28, A3, 0.20, 2.6)]
    t = ap + 3.0
    roll(t, [F2, C3, A3, E4], 0.33, 4.0, 0.22)
    ev += [(t + 1.15, E5, 0.33, 3.0)]
    t = ap + 5.0
    roll(t, [C3, G3, E4, G4], 0.32, 3.0, 0.22)
    ev += [(t + 0.1, C5, 0.30, 2.0), (t + 1.0, D5, 0.33, 2.0)]
    t = ar - 0.6
    roll(t, [G2, D3, B3], 0.33, 2.0, 0.2)
    ev += [(t + 0.25, B4, 0.29, 1.4)]
    # chegada à janela: o ponto mais cheio da aproximação
    roll(ar, [F2, C3, A3, E4, G4], 0.42, 4.5, 0.04)
    ev += [(ar + 0.85, A4, 0.31, 2.4), (ar + 1.7, G4, 0.27, 2.0)]
    # ele assenta: cadência suave em Dó (add9) e depois só eco
    roll(st, [C3, G3, D4, E4], 0.30, 6.0, 0.05)
    ev += [(st + 0.02, C5, 0.27, 6.0), (st + 0.9, G4, 0.17, 4.0)]
    # silêncio … até ele olhar para cima: motivo agudo, como uma memória
    ev += [(lu, E6, 0.17, 4.0), (lu + 0.8, D6, 0.15, 4.0), (lu + 1.65, B5, 0.15, 4.0), (lu + 2.2, A5, 0.19, 5.0), (lu + 2.25, A3, 0.12, 5.0)]
    # o tema volta quando ele se vira
    roll(rt, [A2, E3], 0.32, 4.0, 0.06)
    ev += [(rt + 0.4, E5, 0.30, 2.4), (rt + 1.2, D5, 0.28, 2.2), (rt + 2.0, C5, 0.30, 2.0)]
    roll(rt + 2.0, [F2, C3, A3], 0.31, 2.0, 0.22)
    ev += [(rt + 2.85, A4, 0.27, 1.6)]
    roll(rt + 3.6, [G2, D3, B3], 0.33, 2.0, 0.2)
    ev += [(rt + 3.6, B4, 0.30, 1.4), (rt + 4.4, D5, 0.32, 1.6)]
    roll(vn - 1.1, [F2, C3, A3, E4], 0.35, 1.4, 0.06)
    ev += [(vn - 1.1, C5, 0.30, 1.4)]
    # ele desaparece: acorde final aberto, longo
    roll(vn, [C2, G2, E3, D4, G4], 0.38, 8.0, 0.05)
    ev += [(vn + 0.02, E5, 0.34, 8.0), (vn + 1.4, G5, 0.15, 5.0), (vn + 2.3, C6, 0.12, 4.5)]
    # título: uma última nota
    ev += [(tn, E5, 0.15, 3.0), (tn + 0.04, C4, 0.10, 3.0)]
    return ev


def pads(cue):
    ap, ar, st, vn = cue["appear"], cue["arrive"], cue["settle"], cue["vanish"]
    lu0, lu1 = cue["lookUp"]
    rt = cue["returnTheme"]
    return [
        ([C3, G3], 1.2, ap, 0.35),
        ([A2, E3, C4], ap, ap + 3.0, 0.55),
        ([F2, C3, A3], ap + 3.0, ap + 5.0, 0.6),
        ([C3, G3, E4], ap + 5.0, ar - 0.6, 0.62),
        ([G2, D3, B3], ar - 0.6, ar, 0.62),
        ([F2, C3, A3, E4], ar, st, 0.75),
        ([C3, G3, D4], st, 16.4, 0.4),
        ([G3, D4], 16.0, lu0, 0.14),
        ([A2, E3, B3], lu0 - 0.4, 26.6, 0.34),
        ([A2, E3, C4], rt - 0.4, rt + 2.0, 0.55),
        ([F2, C3, A3], rt + 2.0, rt + 3.6, 0.6),
        ([G2, D3, B3], rt + 3.6, vn - 1.1, 0.62),
        ([F2, C3, A3], vn - 1.1, vn, 0.62),
        ([C2, G2, E3, G3], vn, 38.6, 0.7),
    ]


def lufs(x):
    y = lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585], x, axis=0)
    y = lfilter([1, -2, 1], [1, -1.99004745483398, 0.99007225036621], y, axis=0)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    ms = np.array([np.mean(y[i : i + blk] ** 2, 0).sum() for i in range(0, len(y) - blk, hop)])
    l = -0.691 + 10 * np.log10(ms + 1e-12)
    g = ms[l > -70]
    rel = -0.691 + 10 * np.log10(g.mean()) - 10
    return -0.691 + 10 * np.log10(ms[(l > -70) & (l > rel)].mean())


def soft_limit(x, ceiling=0.84):
    from scipy.ndimage import maximum_filter1d

    la = int(0.004 * SR)
    pk = np.abs(x).max(1)
    pk = maximum_filter1d(np.concatenate([pk[la:], np.zeros(la)]), 2 * la + 1)
    need = np.minimum(1, ceiling / (pk + 1e-9))
    rel = np.exp(-1 / (0.12 * SR))
    g = np.empty_like(need)
    acc = 1.0
    for i in range(len(need)):
        acc = need[i] if need[i] < acc else acc * rel + need[i] * (1 - rel)
        g[i] = acc
    return np.clip(x * g[:, None], -ceiling, ceiling)


def main():
    out = sys.argv[1]
    stems = sys.argv[sys.argv.index("--stems") + 1] if "--stems" in sys.argv else None
    cue = ED["cues"]
    pn, pd, fx = Bus(), Bus(), Bus()
    for t0, m, vel, dur in score(cue):
        pan = 0.5 + np.clip((m - 60) / 40, -0.3, 0.3)
        pn.add(t0, piano(m, vel, dur), 1.0, pan)
    for notes, a, b, lvl in pads(cue):
        pd.add(a, pad(notes, a, b, lvl), 1.0)
    wide = next(s for s in ED["shots"] if s["id"] == "wide")
    steps = []
    for k, s in enumerate(ED["steps"]):
        to = src_to_out(wide, s)
        steps.append(round(to, 3))
        fx.add(to, footstep(), 0.07 if k < 6 else 0.04, 0.55 + 0.05 * (k % 2))
    irs = hall_ir()
    piano_st = pn.x
    wet = reverb(piano_st * 0.9 + pd.x * 0.5 + fx.x * 0.6, irs, 0.42)
    amb = ambience()
    mix = piano_st * 0.85 + pd.x * 0.28 + fx.x + wet + amb
    mix = hp(mix, 38, order=3)
    for _ in range(2):
        mix = mix * 10 ** ((-16.0 - lufs(mix)) / 20)
    mix = soft_limit(mix)
    sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
    if stems:
        os.makedirs(stems, exist_ok=True)
        for nm, st in [("piano", piano_st), ("pad", pd.x), ("fx", fx.x), ("wet", wet), ("amb", amb)]:
            sf.write(os.path.join(stems, nm + ".wav"), (st / (np.abs(st).max() + 1e-9) * 0.9).astype(np.float32), SR)
    print("ok", out, f"{TOTAL:.2f}s  LUFS {lufs(mix):.1f}  pico {20 * np.log10(np.abs(mix).max()):.1f} dB  passos (s) {steps}")


if __name__ == "__main__":
    main()
