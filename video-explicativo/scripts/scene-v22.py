#!/usr/bin/env python3
"""Vídeo 22: cenário de fundo ORIGINAL (desenhado de raiz, sem imagens de terceiros).

Uso: scene-v22.py <saida_dir>

"Sala de reunião noturna em vidro" — a história passa-se numa sala de reunião:
- parede do fundo em janelas de vidro do chão ao teto, com a cidade noturna desfocada lá fora
  (prédios em silhueta, luzes em bokeh brancas e azuis);
- paredes laterais em ripas acústicas, teto com duas calhas de luz em perspetiva;
- chão escuro brilhante com o reflexo desfocado das janelas e linhas de perspetiva.
Tudo é calculado em float e gravado em PNG de 8 bits com dither (sem bandas nos degradés escuros).

Só branco e azul nas luzes (sem âmbar, sem reflexos nem manchas de cor por cima).
Saída: scene.png (2112×1188, 10% maior para a paralaxe lenta).
"""
import sys

import cv2
import numpy as np

out = sys.argv[1]
W, H = 2112, 1188
rng = np.random.default_rng(22)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def hexc(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)


def lerp(a, b, t):
    return a + (b - a) * t


img = np.zeros((H, W, 3), np.float32)

# ---- geometria (perspetiva de um ponto) ----
VPX, VPY = W * 0.5, H * 0.47
BL, BR, BT, BB = W * 0.17, W * 0.83, H * 0.12, H * 0.74  # parede do fundo


def side_of(px, py):
    """classifica cada píxel: 0 fundo, 1 chão, 2 teto, 3 parede esquerda, 4 parede direita"""
    m = np.zeros(px.shape, np.uint8)
    inside = (px >= BL) & (px <= BR) & (py >= BT) & (py <= BB)
    # projeta cada píxel para o retângulo do fundo a partir do ponto de fuga
    dx, dy = px - VPX, py - VPY
    # escala necessária para chegar à borda do retângulo
    sx = np.where(dx > 0, (BR - VPX) / np.maximum(dx, 1e-3), (BL - VPX) / np.minimum(dx, -1e-3))
    sy = np.where(dy > 0, (BB - VPY) / np.maximum(dy, 1e-3), (BT - VPY) / np.minimum(dy, -1e-3))
    horiz = sy < sx  # sai primeiro por cima/baixo → chão/teto
    m[~inside & horiz & (dy > 0)] = 1
    m[~inside & horiz & (dy <= 0)] = 2
    m[~inside & ~horiz & (dx <= 0)] = 3
    m[~inside & ~horiz & (dx > 0)] = 4
    return m, np.minimum(sx, sy)


zone, depth_s = side_of(xx, yy)
# "profundidade" 0 (junto ao fundo) → 1 (perto da câmara)
near = np.clip(1 - depth_s, 0, 1)

# ---- parede do fundo: céu noturno + cidade ----
wall = np.zeros((H, W, 3), np.float32)
t = np.clip((yy - BT) / (BB - BT), 0, 1)[..., None]
sky = lerp(hexc("#050C1C"), hexc("#10264A"), t ** 1.6)
wall += sky
# prédios em silhueta (desfocados), com janelas acesas
city = np.zeros((H, W, 3), np.float32)
cmask = np.zeros((H, W), np.float32)
x = BL - 40
while x < BR + 40:
    bw = rng.uniform(60, 170)
    top = rng.uniform(BT + (BB - BT) * 0.30, BB - (BB - BT) * 0.12)
    x0, x1 = int(x), int(x + bw)
    cmask[int(top) : int(BB), max(0, x0) : min(W, x1)] = rng.uniform(0.75, 1.0)
    # janelas acesas
    for wy in np.arange(top + 10, BB - 8, rng.uniform(16, 22)):
        for wx in np.arange(x0 + 8, x1 - 8, rng.uniform(14, 20)):
            if rng.random() < 0.22:
                col = [hexc("#EAF2FF"), hexc("#FFFFFF"), hexc("#7FB2FF"), hexc("#3D8BFF")][rng.choice(4, p=[0.4, 0.2, 0.25, 0.15])]
                kv = rng.uniform(0.35, 0.9)  # um só fator por janela (o tom não muda)
                cv2.rectangle(city, (int(wx), int(wy)), (int(wx + 5), int(wy + 4)), tuple(float(c) * kv for c in col), -1)
    x += bw + rng.uniform(-10, 30)
cmask = cv2.GaussianBlur(cmask, (0, 0), 6)
wall = wall * (1 - cmask[..., None] * 0.72) + hexc("#040812") * cmask[..., None] * 0.72
city = cv2.GaussianBlur(city, (0, 0), 3.2) * 1.3
wall += city * cmask[..., None]
# bokeh: luzes da cidade fora de foco (discos de borda suave com aro ligeiramente mais claro)
bok = np.zeros((H, W, 3), np.float32)
for _ in range(36):
    cx = rng.uniform(BL, BR)
    cy = rng.uniform(BT + (BB - BT) * 0.38, BB - 6)
    r = float(np.exp(rng.uniform(np.log(4), np.log(24))))
    col = [hexc("#EAF2FF"), hexc("#FFFFFF"), hexc("#3D8BFF"), hexc("#7FB2FF")][rng.choice(4, p=[0.35, 0.15, 0.3, 0.2])]
    k = rng.uniform(0.03, 0.15) * (0.55 + 0.45 * (cy - BT) / (BB - BT)) * (1.4 if r < 8 else 1.0)
    pad = int(r * 2 + 6)
    y0, y1, x0, x1 = max(0, int(cy) - pad), min(H, int(cy) + pad), max(0, int(cx) - pad), min(W, int(cx) + pad)
    d = np.sqrt((xx[y0:y1, x0:x1] - cx) ** 2 + (yy[y0:y1, x0:x1] - cy) ** 2) / r
    disc = np.clip((1 - d) / 0.18, 0, 1) * (0.75 + 0.25 * np.clip((d - 0.6) / 0.35, 0, 1))
    bok[y0:y1, x0:x1] += disc[..., None] * col * k
bok = cv2.GaussianBlur(bok, (0, 0), 1.4)
wall += bok
# brilho de horizonte (névoa quente da cidade)
haze = np.exp(-(((yy - BB * 0.97) / (H * 0.10)) ** 2))[..., None] * np.clip(1 - np.abs(xx - W * 0.62) / (W * 0.5), 0, 1)[..., None]
wall += haze * hexc("#3D8BFF") * 0.06
# caixilhos das janelas (verticais + travessa)
frame = np.zeros((H, W), np.float32)
for k in range(7):
    xm = BL + (BR - BL) * k / 6
    cv2.line(frame, (int(xm), int(BT)), (int(xm), int(BB)), 1.0, 5 if k in (0, 6) else 3, cv2.LINE_AA)
yt = BT + (BB - BT) * 0.22
cv2.line(frame, (int(BL), int(yt)), (int(BR), int(yt)), 1.0, 3, cv2.LINE_AA)
wall = wall * (1 - frame[..., None] * 0.85) + hexc("#1A2B47") * frame[..., None] * 0.85
img = np.where((zone == 0)[..., None], wall, img)

# ---- paredes laterais: ripas acústicas em perspetiva ----
side = np.zeros((H, W, 3), np.float32)
# coordenada "u" ao longo da parede (profundidade) → ripas verticais que convergem
for zi, (xa, sgn) in ((3, (BL, -1)), (4, (BR, 1))):
    m = zone == zi
    d = np.abs(xx - VPX) / np.abs(xa - VPX)  # 1 junto ao fundo → maior perto da câmara
    u = 1 / np.maximum(d, 1e-3)  # inverso dá espaçamento em perspetiva
    slat = 0.5 + 0.5 * np.cos(u * 2 * np.pi * 9)
    base = lerp(hexc("#0B1528"), hexc("#060B16"), np.clip((d - 1) / 1.6, 0, 1)[..., None])
    s = base * (0.82 + 0.18 * slat[..., None])
    # luz quente rasante na parede direita, fria na esquerda
    glow = np.exp(-((yy - H * 0.42) / (H * 0.32)) ** 2) * np.exp(-((d - 1.15) / 0.5) ** 2)
    s += glow[..., None] * hexc("#2E7BFF") * 0.05
    side = np.where(m[..., None], s, side)
img = np.where(((zone == 3) | (zone == 4))[..., None], side, img)

# ---- teto: duas calhas de luz em perspetiva ----
ceil = lerp(hexc("#070D1A"), hexc("#03060D"), np.clip((VPY - yy) / VPY, 0, 1)[..., None])
lines = np.zeros((H, W), np.float32)
for fx in (0.36, 0.64):
    x0 = BL + (BR - BL) * fx
    x1 = VPX + (x0 - VPX) * 3.2
    y1 = VPY + (BT - VPY) * 3.2
    cv2.line(lines, (int(x0), int(BT)), (int(x1), int(y1)), 1.0, 4, cv2.LINE_AA)
core = cv2.GaussianBlur(lines, (0, 0), 1.2)
glowl = cv2.GaussianBlur(lines, (0, 0), 14)
ceil += core[..., None] * hexc("#FFFFFF") * 0.5 + glowl[..., None] * hexc("#3D8BFF") * 0.45
img = np.where((zone == 2)[..., None], ceil, img)
# luz das calhas a cair na parede do fundo (topo)
img += (np.exp(-((yy - BT) / 60) ** 2) * (zone == 0))[..., None] * hexc("#3D8BFF") * 0.04

# ---- chão: escuro brilhante, reflexo desfocado das janelas + linhas de perspetiva ----
floor = lerp(hexc("#070C17"), hexc("#020408"), np.clip((yy - BB) / (H - BB), 0, 1)[..., None])
# reflexo: espelha a parede do fundo à volta de BB e esbate na vertical
wall_only = np.where((zone == 0)[..., None], wall, 0)
mir = np.zeros_like(wall_only)
src_rows = np.clip((2 * BB - yy[:, 0]).astype(int), 0, H - 1)
mir = wall_only[src_rows, :, :]
mir = cv2.GaussianBlur(mir, (0, 0), sigmaX=4, sigmaY=22)
fade = np.exp(-np.clip(yy - BB, 0, None) / (H * 0.16))[..., None]
floor += mir * fade * 0.42
# linhas de perspetiva no chão (juntas do pavimento)
fl = np.zeros((H, W), np.float32)
for k in range(-12, 13):
    xb = VPX + k * (BR - BL) / 8
    x_far = VPX + (xb - VPX) * (BB - VPY) / (H * 1.6 - VPY)
    cv2.line(fl, (int(x_far), int(BB)), (int(VPX + (xb - VPX)), int(H * 1.6)), 1.0, 2, cv2.LINE_AA)
for k in range(1, 9):  # juntas transversais com espaçamento em perspetiva
    yk = VPY + (BB - VPY) / (1 - k * 0.105)
    if yk < H:
        cv2.line(fl, (0, int(yk)), (W, int(yk)), 1.0, 2, cv2.LINE_AA)
fl = cv2.GaussianBlur(fl, (0, 0), 0.8) * np.clip((yy - BB) / 200, 0, 1)
floor += fl[..., None] * hexc("#6E8CC0") * 0.06
img = np.where((zone == 1)[..., None], floor, img)

# ---- arestas da sala (cantos) com fio de luz ----
edges = np.zeros((H, W), np.float32)
for (cx, cy) in ((BL, BT), (BR, BT), (BL, BB), (BR, BB)):
    cv2.line(edges, (int(cx), int(cy)), (int(VPX + (cx - VPX) * 4), int(VPY + (cy - VPY) * 4)), 1.0, 2, cv2.LINE_AA)
cv2.rectangle(edges, (int(BL), int(BT)), (int(BR), int(BB)), 1.0, 2, cv2.LINE_AA)
img += cv2.GaussianBlur(edges, (0, 0), 1.0)[..., None] * hexc("#7AA6E8") * 0.05

# ---- atmosfera: névoa suave, vinheta ----
img += np.exp(-(((xx - W * 0.5) / (W * 0.42)) ** 2 + ((yy - H * 0.55) / (H * 0.45)) ** 2))[..., None] * hexc("#0E2A55") * 0.10
r = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.5) / (H * 0.62)) ** 2)
img *= (1 - 0.55 * np.clip(r - 0.55, 0, 1) ** 1.4)[..., None]

# ligeiro desfoque global (profundidade de campo: o cenário está atrás da pessoa)
img = cv2.GaussianBlur(img, (0, 0), 1.6)


def save(path, a, alpha=None):
    a = np.clip(a, 0, 1)
    dither = rng.uniform(-0.5, 0.5, a.shape).astype(np.float32) + rng.uniform(-0.5, 0.5, a.shape).astype(np.float32)
    q = np.clip(np.round(a * 255 + dither * 0.9), 0, 255).astype(np.uint8)
    if alpha is not None:
        d2 = rng.uniform(-0.5, 0.5, alpha.shape) + rng.uniform(-0.5, 0.5, alpha.shape)
        qa = np.clip(np.round(alpha * 255 + d2 * 0.9), 0, 255).astype(np.uint8)
        cv2.imwrite(path, cv2.cvtColor(np.dstack([q, qa]), cv2.COLOR_RGBA2BGRA))
    else:
        cv2.imwrite(path, cv2.cvtColor(q, cv2.COLOR_RGB2BGR))


save(f"{out}/scene.png", img)
print("cenário: média", round(float(img.mean()) * 255, 1), "máx", round(float(img.max()) * 255, 1))

print("ok")
