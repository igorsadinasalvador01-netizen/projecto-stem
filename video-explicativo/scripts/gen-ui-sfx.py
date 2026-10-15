# Sons de interface para o cursor: clique de rato (click.wav) e toque no ecrã (tap.wav), sintetizados.
# Uso: python scripts/gen-ui-sfx.py   (numpy, scipy, soundfile) — também atualiza os picos em src/v9h/mixH.json
import json
import os

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000
rng = np.random.default_rng(5)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def transient(dur, f_ring, decay, noise_band):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ring = np.sin(2 * np.pi * f_ring * t) * np.exp(-t * decay)
    nz = bp(rng.standard_normal(n), *noise_band) * np.exp(-t * decay * 2.2)
    return ring * 0.6 + nz


def save(name, x, peak=0.12):
    # normalizado por pico (são transientes curtos): o volume final decide-se na composição
    x = x * (peak / np.abs(x).max())
    sf.write(os.path.join(ROOT, "public", "sfx", name), x.astype(np.float32), SR, subtype="PCM_16")
    return float(np.abs(x).max())


# clique de rato: carregar + soltar (40 ms depois), seco e brilhante
n = int(0.09 * SR)
click = np.zeros(n)
a = transient(0.03, 3100, 320, (2000, 9000))
b = transient(0.025, 3600, 380, (2500, 10000)) * 0.55
click[: len(a)] += a
i = int(0.042 * SR)
click[i : i + len(b)] += b[: n - i]
pk_click = save("click.wav", click)

# toque no ecrã: baque suave e curto, com um tique de vidro por cima
n = int(0.07 * SR)
t = np.arange(n) / SR
thump = lp(rng.standard_normal(n), 900) * np.exp(-t * 90) * 0.8 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 70) * 0.6
tick = bp(rng.standard_normal(n), 4000, 11000) * np.exp(-t * 400) * 0.35
pk_tap = save("tap.wav", thump + tick)

p = os.path.join(ROOT, "src", "v9h", "mixH.json")
mix = json.load(open(p))
mix["peaks"]["click.wav"] = round(pk_click, 5)
mix["peaks"]["tap.wav"] = round(pk_tap, 5)
json.dump(mix, open(p, "w"))
print("click.wav", round(pk_click, 4), "tap.wav", round(pk_tap, 4))
