#!/usr/bin/env python3
"""Vídeo 20: texturas de grão de película (public/v20/grain/gNN.png, 1080×1920, ampliadas ×2 na
composição → grãos de ~2 px em 4K). Todas têm exatamente a mesma média e desvio: com o
feTurbulence algumas sementes davam um ruído ligeiramente mais claro e via-se um "clarão" de um
fotograma nas zonas escuras."""
import os
import sys

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# uso: grain-v20.py [pasta W H N]  (por omissão: public/v20/grain 1080 1920 48; o vídeo 21 usa 960×540)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "public", "v20", "grain")
W, H, N = (int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1080, 1920, 48)
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
