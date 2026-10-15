# Trilha da versão horizontal do vídeo 9 (moderna, emocional), sintetizada — sem downloads.
# Uso: python scripts/gen-v9h-audio.py   (numpy, scipy, soundfile)
#   noite        (0–16,37 s)  piano esparso em lá menor, pad quente, tique-taque do tempo;
#   nascer do sol(16,37–39,3) F–C–G–Am a 92 BPM, arpejo, pad, pulsação suave (pausa na citação);
#   dia          (39,3–fim)   C–G–Am–F a 84 BPM, piano + cordas, sinos na ligação com as pessoas,
#                             crescendo no apelo final e acorde a apagar no cartão de despedida.
# Baixa sozinha quando a voz fala (sidechain a partir de public/v9/voz.wav).
import json
import os

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000
rng = np.random.default_rng(11)
EDIT = json.load(open(os.path.join(ROOT, "src", "v9", "edit9.json")))
VOICE_END = EDIT["totalFrames"] / EDIT["fps"]
TOTAL = VOICE_END + 1.4
A2, A3 = 16.37, 39.30
N = int(TOTAL * SR)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def reverb(x, secs=2.8, mix=0.3, damp=3200):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 6.5, n))
    ir = lp(ir, damp)
    ir /= np.sqrt((ir**2).sum())
    return x * (1 - mix) + fftconvolve(x, ir)[: len(x)] * mix * 3


def env(n, a, r):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    if 0 < nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def piano(f, dur, vel=1.0, bright=2600):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.0 + k * 0.8)) for k, a in [(1, 1), (2, 0.5), (3, 0.22), (4, 0.1), (5, 0.05)])
    return lp(x, bright) * env(n, 0.004, 0.4) * vel


def bell(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 7)
    return x * np.exp(-t * 1.6) * env(n, 0.002, 0.3) * vel


def saw(f, n, det=0.004):
    t = np.arange(n) / SR
    return sum(2 * ((t * f * (1 + d)) % 1.0) - 1 for d in (-det, 0, det)) / 3


def pad(freqs, dur, cut=1300, att=1.2, rel=1.6):
    n = int(dur * SR)
    x = sum(saw(f, n) for f in freqs) / len(freqs)
    return lp(x, cut) * env(n, att, rel)


def pluck(f, dur=0.35, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    return x * np.exp(-t * 9) * vel


def kick(vel=1.0):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    f = 48 + 60 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10) * vel


def shaker(vel=1.0):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 6000) * np.exp(-t * 50) * vel


def tick(vel=1.0):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 3000) * np.exp(-t * 300) * vel


def norm_rms(x, db):
    return x * (10 ** (db / 20) / (np.sqrt(np.mean(x**2)) + 1e-12))


# ——— noite ———
def night(dur):
    n = int(dur * SR)
    x = np.zeros(n)
    beat = 60 / 70
    notes = [57, 64, 60, 71, 69, 64, 62, 60, 57, 64, 72, 71]
    for i, m in enumerate(notes * 3):
        t = i * 2 * beat * 0.75
        if t > dur:
            break
        place(x, piano(midi(m), 3.2, 0.45 if i % 3 else 0.6), t + rng.uniform(0, 0.02))
    place(x, pad([midi(45), midi(52), midi(57)], dur + 1, 700, 2.0, 2.0), 0, 0.5)
    tk = np.zeros(n)
    t = 0.0
    while t < dur:
        place(tk, tick(0.18), t)
        t += beat
    return reverb(x, 3.2, 0.38) + tk


# ——— nascer do sol ———
def dawn(dur, t_beat, t_hat, br0, br1):
    n = int(dur * SR)
    x = np.zeros(n)
    beat = 60 / 92
    prog = [[53, 57, 60], [48, 52, 55], [55, 59, 62], [57, 60, 64]]  # F C G Am
    bar = 4 * beat
    t, k = 0.0, 0
    while t < dur:
        ch = prog[k % 4]
        in_break = br0 <= t < br1
        place(x, pad([midi(p) for p in ch] + [midi(ch[0] - 12)], bar + 1.4, 1500 if not in_break else 900, 0.6, 1.2), t, 0.55)
        if not in_break:
            arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12]
            for j, m in enumerate(arp):
                place(x, pluck(midi(m), 0.4, 0.28), t + j * beat / 2)
        t += bar
        k += 1
    d = np.zeros(n)
    t = t_beat
    i = 0
    while t < dur:
        if not (br0 <= t < br1):
            if i % 2 == 0:
                place(d, kick(0.55), t)
            if t >= t_hat:
                place(d, shaker(0.18), t + beat / 2)
        t += beat
        i += 1
    # subida suave na entrada do ato
    sw = int(1.2 * SR)
    swell = lp(rng.standard_normal(sw), 2500) * np.linspace(0, 1, sw) ** 2 * 0.25
    out = reverb(x, 2.4, 0.28) + d
    pre = np.zeros(n)
    return out, swell


# ——— dia ———
def day(dur, t_bells, t_build, t_cta, t_end):
    n = int(dur * SR)
    x = np.zeros(n)
    beat = 60 / 84
    prog = [[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
    bar = 4 * beat
    t, k = 0.0, 0
    while t < dur:
        ch = prog[k % 4] if t < t_end else [48, 52, 55]
        for j in range(4):
            if t + j * beat < t_end or j == 0:
                v = 0.3 if j else 0.42
                for m in ch:
                    place(x, piano(midi(m + (12 if j % 2 else 0)), 2.6, v * 0.6, 3200), t + j * beat)
        place(x, pad([midi(p + 12) for p in ch], bar + 1.6, 1800 if t >= t_build else 1200, 0.9, 1.4), t, 0.4 if t < t_build else 0.6)
        place(x, piano(midi(ch[0] - 12), 3.0, 0.5), t)
        t += bar
        k += 1
    # sinos: a ligação com as pessoas
    mel = [76, 79, 81, 79, 76, 74, 72, 74]
    for i, m in enumerate(mel * 2):
        tb = t_bells + i * beat
        if tb < t_build:
            place(x, bell(midi(m), 2.0, 0.22), tb)
    d = np.zeros(n)
    t = t_cta
    i = 0
    while t < t_end:
        place(d, kick(0.5 if i % 2 == 0 else 0.3), t)
        place(d, shaker(0.14), t + beat / 2)
        t += beat
        i += 1
    out = reverb(x, 3.0, 0.32) + d
    fade = int((dur - t_end) * SR)
    if fade > 0:
        out[-fade:] *= np.linspace(1, 0, fade) ** 1.5
    return out


bed = np.zeros(N)


def put(x, t0, fin, fout):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    place(bed, x, t0)


put(norm_rms(night(A2 + 0.6), -25), 0.0, 0.05, 0.7)
dw, swell = dawn(A3 - A2 + 0.6, 18.4 - A2, 20.95 - A2, 26.37 - A2, 27.6 - A2)
put(norm_rms(dw, -23), A2, 0.15, 0.7)
place(bed, norm_rms(swell, -28), A2 - 1.2)
put(norm_rms(day(TOTAL - A3, 43.07 - A3, 55.3 - A3, 58.1 - A3, VOICE_END - A3 + 0.2), -23), A3, 0.6, 0.05)

# sidechain pela voz
v, vsr = sf.read(os.path.join(ROOT, "public", "v9", "voz.wav"), dtype="float32")
vm = np.abs(v.mean(axis=1) if v.ndim > 1 else v)
hop = vsr // 100
nv = len(vm) // hop
vdb = 20 * np.log10(np.sqrt((vm[: nv * hop].reshape(nv, hop) ** 2).mean(axis=1)) + 1e-9)
act = np.clip((vdb + 42) / 14, 0, 1)
g = np.zeros_like(act)
cur = 0.0
for i, a in enumerate(act):
    cur += (a - cur) * (0.5 if a > cur else 0.06)
    g[i] = cur
duck = np.concatenate([1 - 0.6 * g, np.ones(int(TOTAL * 100) - len(g) + 2)])
bed *= np.interp(np.arange(N) / SR * 100, np.arange(len(duck)), duck)
st = np.stack([bed, bed], axis=1)
dl = int(0.011 * SR)
st[dl:, 1] = bed[:-dl] * 0.9 + bed[dl:] * 0.1
pk = np.abs(st).max()
if pk > 0.5:
    st *= 0.5 / pk
sf.write(os.path.join(ROOT, "public", "v9", "trilhaH.wav"), st.astype(np.float32), SR, subtype="PCM_16")
print("trilhaH.wav", round(TOTAL, 2), "s, pico", round(float(np.abs(st).max()), 3))
