# Trilha e efeitos do vídeo 9 (CONTEUDO A FAZER), sintetizados — sem downloads.
# Uso: python scripts/gen-v9-audio.py   (precisa de numpy, scipy, soundfile)
#
# Três bases, uma por modo, coladas aos atos do vídeo:
#   nostálgico (0–16,37 s)   lo-fi 82 BPM: piano elétrico, bateria suave, vinil, wow/flutter,
#                            e uma "paragem de fita" a fechar o ato;
#   cinema     (16,37–39,3)  drone em ré, ostinato a 100 BPM, cordas Dm–Bb–F–C;
#   histórico  (39,3–fim)    piano solene em lá menor, que passa a maior em "mudar o seu processo".
# A trilha baixa sozinha quando a voz fala (sidechain a partir de public/v9/voz.wav).
import json
import os

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000
rng = np.random.default_rng(7)
EDIT = json.load(open(os.path.join(ROOT, "src", "v9", "edit9.json")))
VOICE_END = EDIT["totalFrames"] / EDIT["fps"]
TAIL = 1.4  # cartão final depois da última palavra
TOTAL = VOICE_END + TAIL
A2, A3 = 16.37, 39.30  # mudanças de ato
N = int(TOTAL * SR)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def reverb(x, secs=2.2, mix=0.25, damp=3500):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp(ir, damp)
    ir /= np.sqrt((ir**2).sum())
    wet = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix * 3


def env_adsr(n, a, d, s, r):
    e = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = max(1, min(na, n))
    e[:na] = np.linspace(0, 1, na)
    if na + nd < n:
        e[na : na + nd] = np.linspace(1, s, nd)
    if nr > 0 and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def epiano(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3) + 0.12 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 6)
    x *= np.exp(-t * 1.1) * (1 + 0.15 * np.sin(2 * np.pi * 4.5 * t))
    return x * env_adsr(n, 0.005, 0.1, 1, 0.2) * vel


def felt_piano(f, dur, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.2 + k * 0.9)) for k, a in [(1, 1), (2, 0.45), (3, 0.2), (4, 0.1)])
    return lp(x, 2600) * env_adsr(n, 0.004, 0.05, 1, 0.3) * vel


def saw(f, n, detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        ph = (t * f * (1 + d)) % 1.0
        out += 2 * ph - 1
    return out / 3


def pad(freqs, dur, cutoff=1400, attack=1.2, release=1.5):
    n = int(dur * SR)
    x = sum(saw(f, n, 0.004) for f in freqs) / len(freqs)
    x = lp(x, cutoff, 2)
    return x * env_adsr(n, attack, 0.5, 0.9, release)


def kick(vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * vel


def snare(vel=1.0):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    x = bp(rng.standard_normal(n), 900, 5000) * np.exp(-t * 16) + 0.4 * np.sin(2 * np.pi * 185 * t) * np.exp(-t * 20)
    return x * vel


def hat(vel=1.0):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t * 70) * vel


def pluck(f, dur=0.14, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = saw(f, n, 0.002)
    return lp(x, 900) * np.exp(-t * 22) * vel


# ——— 1. Nostálgico: lo-fi 82 BPM ———
def nostalgia(dur):
    n = int(dur * SR)
    m = np.zeros(n)
    dr = np.zeros(n)
    beat = 60 / 82
    chords = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]]  # Fmaj7 Em7 Dm7 Cmaj7
    bar = 4 * beat
    t, k = 0.0, 0
    while t < dur:
        ch = chords[(k // 2) % 4]
        for off, v in [(0, 1.0), (1.5 * beat, 0.6), (2.5 * beat, 0.5)]:
            for p in ch:
                place(m, epiano(midi(p), 2.2, v * 0.22), t + off + rng.uniform(0, 0.012))
        place(m, epiano(midi(ch[0] - 12), 3.0, 0.3), t)
        t += bar
        k += 1
    sw = 0.08 * beat
    for i in range(int(dur / beat) + 1):
        tb = i * beat
        if i % 4 in (0, 2):
            place(dr, kick(0.9), tb)
        if i % 4 in (1, 3):
            place(dr, snare(0.28), tb)
        place(dr, hat(0.18), tb)
        place(dr, hat(0.12), tb + beat / 2 + sw)
    x = m + dr * 0.8
    # wow & flutter
    tt = np.arange(n) / SR
    warp = tt + 0.0018 * np.sin(2 * np.pi * 0.55 * tt) + 0.0004 * np.sin(2 * np.pi * 6.3 * tt)
    x = np.interp(warp, tt, x)
    x = np.tanh(x * 1.6) / 1.6
    x = lp(hp(x, 60), 5200)
    # vinil: estalidos + chiado
    crackle = np.zeros(n)
    idx = rng.choice(n, int(dur * 9), replace=False)
    crackle[idx] = rng.standard_normal(len(idx)) * 0.5
    crackle = bp(crackle, 1500, 9000)
    hiss = hp(rng.standard_normal(n), 4000) * 0.012
    x = x + crackle * 0.35 + hiss
    return reverb(x, 1.4, 0.18)


# ——— 2. Cinema: drone em ré + ostinato 100 BPM + cordas ———
def cinema(dur, t_ost, t_drop, t_back):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    drone = saw(midi(38), n, 0.003) + 0.6 * saw(midi(45), n, 0.004) + 0.5 * saw(midi(26), n, 0.002)
    lo = lp(drone, 220, 2)
    hi = lp(drone, 900, 2)
    open_ = np.clip(tt / dur, 0, 1) ** 1.5
    x = (lo * (1 - open_) + hi * open_) * 0.5
    x *= np.minimum(1, tt / 1.5)
    # ostinato em semicolcheias
    s16 = 60 / 100 / 4
    pat = [50, 50, 53, 50, 57, 50, 53, 50]
    o = np.zeros(n)
    i = 0
    t = t_ost
    while t < dur:
        if not (t_drop <= t < t_back):
            build = min(1, (t - t_ost) / 6)
            place(o, pluck(midi(pat[i % 8] - 12), 0.14, 0.35 + 0.35 * build), t)
            if i % 4 == 0:
                place(o, kick(0.35 + 0.4 * build), t)
        t += s16
        i += 1
    # cordas a partir do regresso
    st = np.zeros(n)
    bar2 = 2 * 4 * 60 / 100
    chords = [[50, 53, 57, 62], [46, 50, 53, 58], [53, 57, 60, 65], [48, 52, 55, 60]]
    t, k = t_back, 0
    while t < dur:
        place(st, pad([midi(p) for p in chords[k % 4]], bar2 + 1.2, 1600, 0.8, 1.2), t)
        t += bar2
        k += 1
    x = x + o + st * 0.55
    return reverb(x, 2.6, 0.3)


# ——— 3. Histórico: piano solene 70 BPM (lá menor → dó maior) ———
def historic(dur, t_major, t_cta):
    n = int(dur * SR)
    beat = 60 / 70
    minor = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
    major = [[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
    p = np.zeros(n)
    low = np.zeros(n)
    t, k = 0.0, 0
    while t < dur:
        prog = major if t >= t_major else minor
        ch = prog[(k // 2) % 4]
        arp = [ch[0], ch[1], ch[2], ch[1] + 12 if t >= t_major else ch[1]]
        for j, note in enumerate(arp):
            place(p, felt_piano(midi(note), 2.4, 0.5 if j == 0 else 0.32), t + j * beat)
        place(low, pad([midi(ch[0] - 24), midi(ch[0] - 12)], 4 * beat + 0.8, 600, 0.6, 0.8), t)
        t += 4 * beat
        k += 1
    x = p + low * 0.5
    # projetor: ruído modulado muito baixo
    tt = np.arange(n) / SR
    proj = bp(rng.standard_normal(n), 300, 3000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * tt))) * 0.02
    x = x + proj
    # pulsação suave no apelo final
    pl = np.zeros(n)
    t = t_cta
    while t < dur - 0.5:
        place(pl, kick(0.5), t)
        t += beat
    x = x + pl
    return reverb(x, 3.0, 0.32, 3000)


def norm_rms(x, db):
    r = np.sqrt(np.mean(x**2)) + 1e-12
    return x * (10 ** (db / 20) / r)


def xfade_place(buf, x, t0, fin, fout):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    place(buf, x, t0)


bed = np.zeros(N)
# 1 · nostálgico, com paragem de fita no fim
nos = norm_rms(nostalgia(A2 + 0.3), -24)
stop0 = A2 - 0.55
i0 = int(stop0 * SR)
seg = nos[i0:]
m_ = len(seg)
u = np.linspace(0, 1, m_)
rate = (1 - u) ** 1.6  # velocidade a cair até zero
pos = np.cumsum(rate)
pos = pos / pos[-1] * (m_ * 0.45)
seg = np.interp(pos, np.arange(m_), seg) * (1 - u**3)
nos = np.concatenate([nos[:i0], seg])
xfade_place(bed, nos, 0.0, 0.02, 0.05)
# 2 · cinema
ci = norm_rms(cinema(A3 - A2 + 0.4, 19.43 - A2, 26.37 - A2, 27.6 - A2), -23)
xfade_place(bed, ci, A2, 0.05, 0.5)
# 3 · histórico
hi_ = norm_rms(historic(TOTAL - A3, 55.3 - A3, 58.1 - A3), -23)
xfade_place(bed, hi_, A3, 0.6, 0.9)

# ——— sidechain: baixa a trilha quando a voz fala ———
v, vsr = sf.read(os.path.join(ROOT, "public", "v9", "voz.wav"), dtype="float32")
vm = np.abs(v.mean(axis=1) if v.ndim > 1 else v)
hop = vsr // 100
nv = len(vm) // hop
venv = np.sqrt((vm[: nv * hop].reshape(nv, hop) ** 2).mean(axis=1))
vdb = 20 * np.log10(venv + 1e-9)
act = np.clip((vdb + 42) / 14, 0, 1)  # 0 = silêncio, 1 = voz
g = np.zeros_like(act)
cur = 0.0
for i, a in enumerate(act):
    cur = cur + (a - cur) * (0.5 if a > cur else 0.06)  # ataque ~20 ms, libertação ~200 ms
    g[i] = cur
duck = 1 - 0.62 * g  # ~ -8,4 dB sob a voz
duck = np.concatenate([duck, np.ones(max(0, int(TOTAL * 100) - len(duck)) + 2)])
dk = np.interp(np.arange(N) / SR * 100, np.arange(len(duck)), duck)
bed *= dk
bed[-int(0.6 * SR) :] *= np.linspace(1, 0, int(0.6 * SR))
st = np.stack([bed, bed], axis=1)
# largura estéreo: atraso de 9 ms num canal
d = int(0.009 * SR)
st[d:, 1] = bed[:-d] * 0.92 + bed[d:] * 0.08
peak = np.abs(st).max()
if peak > 0.5:
    st *= 0.5 / peak
sf.write(os.path.join(ROOT, "public", "v9", "trilha.wav"), st.astype(np.float32), SR, subtype="PCM_16")
print("trilha.wav", round(TOTAL, 2), "s, pico", round(float(np.abs(st).max()), 3))

# ——— efeitos novos ———
SFX = os.path.join(ROOT, "public", "sfx")


def save(name, x, db=-14):
    x = norm_rms(x, db)
    pk = np.abs(x).max()
    if pk > 0.95:
        x *= 0.95 / pk
    sf.write(os.path.join(SFX, name), x.astype(np.float32), SR, subtype="PCM_16")


# braam: metais graves de trailer
n = int(2.6 * SR)
tt = np.arange(n) / SR
b = sum(saw(midi(p), n, 0.006) for p in (33, 45, 52)) / 3
cut = 200 + 1400 * np.exp(-((tt - 0.25) ** 2) / 0.18)
b = lp(b, 300) * 0.6 + lp(b, 1500) * (cut / 1600)
b = np.tanh(b * 3) * env_adsr(n, 0.03, 0.4, 0.7, 1.4)
save("braam.wav", reverb(b, 2.5, 0.35), -12)
# vhs: estática + zumbido + corte
n = int(0.45 * SR)
tt = np.arange(n) / SR
x = bp(rng.standard_normal(n), 800, 6000) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 31 * tt))) + 0.3 * np.sign(np.sin(2 * np.pi * 60 * tt))
save("vhs.wav", x * env_adsr(n, 0.005, 0.05, 0.8, 0.12), -16)
# queima de película: varrimento de ruído com estalidos
n = int(1.1 * SR)
tt = np.arange(n) / SR
x = rng.standard_normal(n)
lo_, hi2 = lp(x, 600), lp(x, 6000)
mixw = np.sin(np.pi * tt / 1.1) ** 2
x = lo_ * (1 - mixw) + hi2 * mixw
cr = np.zeros(n)
cr[rng.choice(n, 60, replace=False)] = 1
x = x * np.sin(np.pi * tt / 1.1) + bp(cr, 1500, 8000) * 2
save("filmburn.wav", x, -16)
# rec: dois bips de câmara
n = int(0.32 * SR)
tt = np.arange(n) / SR
x = np.sin(2 * np.pi * 1760 * tt) * (((tt > 0) & (tt < 0.08)) | ((tt > 0.16) & (tt < 0.24)))
save("rec.wav", lp(x, 6000), -20)
# claquete
n = int(0.25 * SR)
tt = np.arange(n) / SR
x = bp(rng.standard_normal(n), 1800, 7000) * np.exp(-tt * 60) + 0.5 * np.sin(2 * np.pi * 220 * tt) * np.exp(-tt * 40)
save("clap.wav", x, -15)
print("sfx: braam, vhs, filmburn, rec, clap")
