#!/usr/bin/env python3
"""Verifica o áudio final de um vídeo contra a narração original.

Uso: check-audio.py <narracao_original> <video.mp4>

Mede: atraso (deve ser 0 ms), amostras saturadas, ganho da voz (≈1) e a margem entre
a voz e os efeitos (resíduo) durante a fala — a voz tem de ficar sempre por cima.
"""
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

SR = 48000


def load(path: str) -> np.ndarray:
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_f32le", tmp.name], check=True)
        x, _ = sf.read(tmp.name, dtype="float32")
    return x


orig, rend = load(sys.argv[1]), load(sys.argv[2])
n = min(len(orig), len(rend))

# atraso por correlação cruzada (janela de 20 s, ±200 ms)
seg = slice(SR * 2, SR * 22)
o, r = orig[seg], rend[seg]
best, lag = -1.0, 0
for d in range(-SR // 5, SR // 5 + 1, 24):
    a = o[max(0, d): len(o) + min(0, d)]
    b = r[max(0, -d): len(r) - max(0, d)]
    m = min(len(a), len(b))
    c = float(np.dot(a[:m], b[:m]))
    if c > best:
        best, lag = c, d
print(f"atraso: {lag / SR * 1000:.1f} ms")

clip_o = int(np.sum(np.abs(orig) >= 0.999))
clip_r = int(np.sum(np.abs(rend) >= 0.999))
print(f"saturadas: original {clip_o} · render {clip_r}")

o, r = orig[:n], rend[:n]
g = float(np.dot(o, r) / np.dot(o, o))
print(f"ganho da voz: {g:.3f}")

res = r - g * o
win = SR // 20
k = n // win
ow = o[: k * win].reshape(k, win)
rw = res[: k * win].reshape(k, win)
orms = np.sqrt(np.mean(ow**2, axis=1)) + 1e-9
rrms = np.sqrt(np.mean(rw**2, axis=1)) + 1e-9
speech = orms > 0.02
margin = 20 * np.log10(orms / rrms)
sm = margin[speech]
print(f"margem voz/efeitos na fala: mín {sm.min():.1f} dB · mediana {np.median(sm):.1f} dB")
bad = np.where(speech & (margin < 0))[0]
if len(bad):
    print("efeitos acima da voz em:", ", ".join(f"{i * 0.05:.2f}s ({margin[i]:.1f} dB)" for i in bad[:20]))
else:
    print("OK: a voz fica sempre por cima dos efeitos")
