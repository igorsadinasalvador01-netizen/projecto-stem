# Margem livre por fotograma para o ducking dos efeitos (mixN.json).
# headroom = 0,97 − pico do áudio original nesse fotograma (a voz nunca é tocada);
# voice = RMS da voz por fotograma (ducking em cadeia lateral: o efeito fica sempre abaixo da voz);
# peaks = pico de cada efeito em public/sfx, para o volume nunca passar a margem;
# loud = RMS mais alto (janelas de 50 ms) de cada efeito, referência de sonoridade.
# Uso: python scripts/gen-mix.py public/narracao10.m4a src/v10/mix10.json [segundos_totais]
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FPS = 30
src, out = sys.argv[1], sys.argv[2]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "2", "-ar", "48000", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
total = float(sys.argv[3]) if len(sys.argv) > 3 else len(x) / 48000
n = int(np.ceil(total * FPS)) + 2
hop = 48000 // FPS
head, voice = [], []
for i in range(n):
    seg = x[i * hop : (i + 1) * hop]
    pk = float(np.abs(seg).max()) if len(seg) else 0.0
    head.append(round(max(0.0, 0.97 - pk), 4))
    voice.append(round(float(np.sqrt(np.mean(seg.mean(axis=1) ** 2))) if len(seg) else 0.0, 4))
peaks, loud = {}, {}
sfx_dir = os.path.join(ROOT, "public", "sfx")
for f in sorted(os.listdir(sfx_dir)):
    if f.endswith(".wav"):
        y, _ = sf.read(os.path.join(sfx_dir, f), dtype="float32")
        peaks[f] = round(float(np.abs(y).max()), 5)
        m = y.mean(axis=1) if y.ndim > 1 else y
        w = 2400
        k = max(1, len(m) // w)
        loud[f] = round(float(np.sqrt((m[: k * w].reshape(k, w) ** 2).mean(axis=1)).max()) if len(m) >= w else float(np.sqrt((m**2).mean())), 5)
json.dump({"fps": FPS, "headroom": head, "voice": voice, "peaks": peaks, "loud": loud}, open(out, "w"))
print(out, len(head), "fotogramas; margem mediana", round(float(np.median(head)), 3))
