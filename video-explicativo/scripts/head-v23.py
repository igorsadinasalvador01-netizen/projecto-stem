#!/usr/bin/env python3
"""Vídeo 23: suaviza o seguimento da cabeça (saída de prep-v23.py) para o quadrado acompanhar o rosto.

Uso: head-v23.py <cabeca.json> <cuts23.json> <head23.json>

- Rosto = centro da faixa da cabeça − 40 px (x) e topo da cabeça + 240 px (y), em 1080×1920
  (calibrado no take do vídeo 21/22, onde o rosto estava em (540, 1137)).
- Suavização gaussiana (σ = 0,45 s) DENTRO de cada plano entre cortes de pausa: num corte o
  enquadramento muda logo (como um jump cut), nunca desliza devagar entre planos.
- Seguimento parcial (75%) em torno da posição média: acompanha como um operador de câmara, sem
  "colar" ao rosto.
"""
import json
import sys

import numpy as np
from scipy.ndimage import gaussian_filter1d

heads, cuts, out = json.load(open(sys.argv[1])), json.load(open(sys.argv[2])), sys.argv[3]
h = np.array(heads, float)
face = np.stack([h[:, 0] - 40, h[:, 1] + 240], 1)
# planos da montagem (em fotogramas de saída)
bounds, o = [], 0
for a, b in cuts["keep"]:
    bounds.append((o, o + (b - a)))
    o += b - a
assert o == len(face), (o, len(face))
sm = np.zeros_like(face)
for a, b in bounds:
    seg = face[a:b]
    sm[a:b] = gaussian_filter1d(seg, sigma=13.5, axis=0, mode="nearest") if b - a > 3 else seg.mean(0)
mean = np.median(face, 0)
res = mean + 0.75 * (sm - mean)
json.dump([[round(float(x), 1), round(float(y), 1)] for x, y in res], open(out, "w"))
d = np.abs(np.diff(res, axis=0)).max(0)
print(f"rosto médio {mean.round(1)} · amplitude x {np.ptp(res[:, 0]):.1f} px, y {np.ptp(res[:, 1]):.1f} px · maior salto por fotograma {d.round(1)}")
