#!/usr/bin/env python3
"""Vídeo 20: texturas de grão de película (public/v20/grain/gNN.png, 1080×1920, ampliadas ×2 na
composição → grãos de ~2 px em 4K). Todas têm exatamente a mesma média e desvio: com o
feTurbulence algumas sementes davam um ruído ligeiramente mais claro e via-se um "clarão" de um
fotograma nas zonas escuras."""
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "v20", "grain")
N, W, H = 48, 1080, 1920
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(2020)
for i in range(N):
    g = rng.standard_normal((H, W)).astype(np.float32)
    g = cv2.GaussianBlur(g, (0, 0), 0.75)  # grão macio, não ruído digital de píxel
    g = (g - g.mean()) / g.std()
    g = np.clip(0.5 + 0.17 * g, 0, 1)
    g = 0.5 + (g - g.mean())  # média exata depois do corte
    cv2.imwrite(os.path.join(OUT, f"g{i:02d}.png"), (np.clip(g, 0, 1) * 255 + 0.5).astype(np.uint8))
print("texturas", N, "em", OUT)
