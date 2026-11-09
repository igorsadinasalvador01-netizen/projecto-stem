#!/usr/bin/env python3
"""Vídeo 23 (tema branco e fosco): cenário ORIGINAL — sala de vidro fosco branca, desenhada de raiz.

Uso: scene-v23-branco.py <saida_dir>

- Parede do fundo em painéis de vidro FOSCO do chão ao teto: a luz de fora chega difusa (manchas
  muito suaves, sem nada nítido), caixilhos finos em cinzento-claro com fio de luz;
- paredes laterais brancas em ripas suaves, teto branco com duas calhas de luz, chão claro
  acetinado com o reflexo desfocado do vidro e juntas muito discretas;
- sombras de contacto suaves nos cantos (dão profundidade sem escurecer).
Calculado em float e gravado em PNG de 8 bits com dither (degradés claros sem bandas).
Saída: scene_branco.png (2112×1188, 10% maior para a paralaxe lenta).
"""
import sys

import cv2
import numpy as np

out = sys.argv[1]
W, H = 2112, 1188
rng = np.random.default_rng(2323)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)


def lerp(a, b, t):
    return a + (b - a) * t


VPX, VPY = W * 0.5, H * 0.47
BL, BR, BT, BB = W * 0.17, W * 0.83, H * 0.12, H * 0.74
dx, dy = xx - VPX, yy - VPY
sx = np.where(dx > 0, (BR - VPX) / np.maximum(dx, 1e-3), (BL - VPX) / np.minimum(dx, -1e-3))
sy = np.where(dy > 0, (BB - VPY) / np.maximum(dy, 1e-3), (BT - VPY) / np.minimum(dy, -1e-3))
inside = (xx >= BL) & (xx <= BR) & (yy >= BT) & (yy <= BB)
horiz = sy < sx
zone = np.zeros((H, W), np.uint8)
zone[~inside & horiz & (dy > 0)] = 1  # chão
zone[~inside & horiz & (dy <= 0)] = 2  # teto
zone[~inside & ~horiz & (dx <= 0)] = 3  # parede esquerda
zone[~inside & ~horiz & (dx > 0)] = 4  # parede direita
img = np.zeros((H, W, 3), np.float32)

# ---- parede do fundo: vidro fosco (luz difusa de fora) ----
t = np.clip((yy - BT) / (BB - BT), 0, 1)[..., None]
wall = lerp(hexc("#F6F8FB"), hexc("#E8EDF3"), t ** 1.2)
glow = np.zeros((H, W), np.float32)
for _ in range(14):  # luz de fora, completamente desfocada pelo vidro fosco
    cx, cy = rng.uniform(BL, BR), rng.uniform(BT, BB)
    r = rng.uniform(60, 180)
    cv2.circle(glow, (int(cx), int(cy)), int(r), float(rng.uniform(0.3, 1.0)), -1)
glow = cv2.GaussianBlur(glow, (0, 0), 70)
glow = glow / (glow.max() + 1e-6)
wall = wall + glow[..., None] * (hexc("#FFFFFF") - wall) * 0.6 - (1 - glow[..., None]) * hexc("#0B1830") * 0.012
# sombras difusas muito ténues de "silhuetas" atrás do vidro (dão vida sem se verem)
sil = np.zeros((H, W), np.float32)
x = BL
while x < BR:
    bw = rng.uniform(90, 220)
    top = rng.uniform(BT + (BB - BT) * 0.35, BB - (BB - BT) * 0.15)
    sil[int(top) : int(BB), int(x) : int(min(BR, x + bw))] = rng.uniform(0.3, 1.0)
    x += bw + rng.uniform(20, 120)
sil = cv2.GaussianBlur(sil, (0, 0), 30)
wall -= sil[..., None] * hexc("#4A3E30") * 0.12  # tira mais vermelho que azul: sombra fria, nunca amarelada
# caixilhos: linha cinzenta fina + fio de luz ao lado
frame = np.zeros((H, W), np.float32)
hi = np.zeros((H, W), np.float32)
for kk in range(7):
    xm = BL + (BR - BL) * kk / 6
    cv2.line(frame, (int(xm), int(BT)), (int(xm), int(BB)), 1.0, 5 if kk in (0, 6) else 3, cv2.LINE_AA)
    cv2.line(hi, (int(xm) + 4, int(BT)), (int(xm) + 4, int(BB)), 1.0, 2, cv2.LINE_AA)
yt = BT + (BB - BT) * 0.22
cv2.line(frame, (int(BL), int(yt)), (int(BR), int(yt)), 1.0, 3, cv2.LINE_AA)
cv2.line(hi, (int(BL), int(yt) + 4), (int(BR), int(yt) + 4), 1.0, 2, cv2.LINE_AA)
wall = wall * (1 - frame[..., None] * 0.9) + hexc("#C3CCD8") * frame[..., None] * 0.9
wall = wall + hi[..., None] * (1 - wall) * 0.7
img = np.where((zone == 0)[..., None], wall, img)

# ---- paredes laterais brancas em ripas suaves ----
for zi, xa in ((3, BL), (4, BR)):
    m = zone == zi
    d = np.abs(xx - VPX) / np.abs(xa - VPX)
    u = 1 / np.maximum(d, 1e-3)
    slat = 0.5 + 0.5 * np.cos(u * 2 * np.pi * 9)
    base = lerp(hexc("#EDF1F5"), hexc("#DCE3EA"), np.clip((d - 1) / 1.6, 0, 1)[..., None])
    s = base * (0.985 + 0.015 * slat[..., None])
    img = np.where(m[..., None], s, img)

# ---- teto branco com calhas de luz ----
ceil = lerp(hexc("#F3F6F9"), hexc("#E4E9EF"), np.clip((VPY - yy) / VPY, 0, 1)[..., None])
lines = np.zeros((H, W), np.float32)
for fx in (0.36, 0.64):
    x0 = BL + (BR - BL) * fx
    cv2.line(lines, (int(x0), int(BT)), (int(VPX + (x0 - VPX) * 3.2), int(VPY + (BT - VPY) * 3.2)), 1.0, 6, cv2.LINE_AA)
core = cv2.GaussianBlur(lines, (0, 0), 1.5)
gl = cv2.GaussianBlur(lines, (0, 0), 16)
ceil = ceil + (core[..., None] * 0.9 + gl[..., None] * 0.5) * (1 - ceil)
img = np.where((zone == 2)[..., None], ceil, img)

# ---- chão claro acetinado: reflexo desfocado do vidro + juntas discretas ----
floor = lerp(hexc("#E6EBF1"), hexc("#D3DAE3"), np.clip((yy - BB) / (H - BB), 0, 1)[..., None])
wall_only = np.where((zone == 0)[..., None], wall, 0)
rows = np.clip((2 * BB - yy[:, 0]).astype(int), 0, H - 1)
mir = cv2.GaussianBlur(wall_only[rows, :, :], (0, 0), sigmaX=6, sigmaY=26)
fade = np.exp(-np.clip(yy - BB, 0, None) / (H * 0.14))[..., None]
floor = floor * (1 - 0.35 * fade) + mir * 0.35 * fade
fl = np.zeros((H, W), np.float32)
for kk in range(-12, 13):
    xb = VPX + kk * (BR - BL) / 8
    x_far = VPX + (xb - VPX) * (BB - VPY) / (H * 1.6 - VPY)
    cv2.line(fl, (int(x_far), int(BB)), (int(VPX + (xb - VPX)), int(H * 1.6)), 1.0, 2, cv2.LINE_AA)
for kk in range(1, 9):
    yk = VPY + (BB - VPY) / (1 - kk * 0.105)
    if yk < H:
        cv2.line(fl, (0, int(yk)), (W, int(yk)), 1.0, 2, cv2.LINE_AA)
fl = cv2.GaussianBlur(fl, (0, 0), 0.8) * np.clip((yy - BB) / 200, 0, 1)
floor -= fl[..., None] * hexc("#33486A") * 0.05
img = np.where((zone == 1)[..., None], floor, img)

# ---- sombras de contacto nas arestas da sala (profundidade) ----
edges = np.zeros((H, W), np.float32)
for (cx, cy) in ((BL, BT), (BR, BT), (BL, BB), (BR, BB)):
    cv2.line(edges, (int(cx), int(cy)), (int(VPX + (cx - VPX) * 4), int(VPY + (cy - VPY) * 4)), 1.0, 3, cv2.LINE_AA)
cv2.rectangle(edges, (int(BL), int(BT)), (int(BR), int(BB)), 1.0, 3, cv2.LINE_AA)
ao = cv2.GaussianBlur(edges, (0, 0), 14)
img -= ao[..., None] * hexc("#2A3C5A") * 0.10
img -= cv2.GaussianBlur(edges, (0, 0), 1.2)[..., None] * hexc("#2A3C5A") * 0.06

# vinheta muito leve (só para assentar o olhar ao centro)
r = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.5) / (H * 0.62)) ** 2)
img *= (1 - 0.10 * np.clip(r - 0.6, 0, 1) ** 1.4)[..., None]
img = cv2.GaussianBlur(img, (0, 0), 1.6)

a = np.clip(img, 0, 1)
dither = rng.uniform(-0.5, 0.5, a.shape).astype(np.float32) + rng.uniform(-0.5, 0.5, a.shape).astype(np.float32)
q = np.clip(np.round(a * 255 + dither * 0.9), 0, 255).astype(np.uint8)
cv2.imwrite(f"{out}/scene_branco.png", cv2.cvtColor(q, cv2.COLOR_RGB2BGR))
print("cenário branco: média", round(float(img.mean()) * 255, 1), "mín", round(float(img.min()) * 255, 1))
