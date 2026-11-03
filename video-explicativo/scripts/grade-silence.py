#!/usr/bin/env python3
"""Vídeo 20 ("A Moment of Silence"): gradação de filme + subida para 4K da filmagem fixa.

Uso:
  grade-silence.py clip  <src.mp4> <alpha.mp4> <saida_dir>      # todos os fotogramas → <saida>/plate4k.mp4
  grade-silence.py empty <src.mp4> <saida.png>                   # placa da sala vazia (graduada, 4K)
  grade-silence.py still <src.mp4> <alpha.mp4> <seg> <saida.png> # um fotograma para afinar

A filmagem é de 59,94 fps; aqui cada fotograma de origem vira um fotograma do ficheiro de saída
(base de 30 fps), para a composição escolher qualquer fotograma (câmara lenta nativa a 0,5×).

Gradação (por fotograma, à resolução nativa; a subida para 2160×3840 é feita pelo ffmpeg):
- tons terrosos ligeiramente dessaturados; o azul elétrico do chão fica sóbrio, o laranja do
  equipamento mantém-se;
- altas luzes ligeiramente quentes e suaves (ombro da curva + halação e "bloom" de película na
  janela), sombras mais frias, profundas mas com detalhe;
- separação subtil do sujeito: um pouco mais de luz e micro-contraste dentro do recorte (RVM).
"""
import subprocess
import sys

import cv2
import numpy as np

SW, SH = 464, 832
OW, OH = 2160, 3840
# 464×832 é 9:16 arredondado a múltiplos de 16: sobe a 2160 de largura e corta 33 px de altura
UP = f"scale={OW}:{round(SH * OW / SW)}:flags=lanczos,crop={OW}:{OH},unsharp=5:5:0.32:5:5:0"


def tone(x):
    """curva fílmica: pé com detalhe (pretos profundos, não esmagados) e ombro suave"""
    xs = np.array([0.0, 0.05, 0.14, 0.30, 0.52, 0.72, 0.86, 0.95, 1.0])
    ys = np.array([0.022, 0.045, 0.115, 0.265, 0.495, 0.685, 0.800, 0.865, 0.89])
    return np.interp(x, xs, ys).astype(np.float32)


def lum(x):
    return (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]


def grade(rgb, a=None):
    x = rgb.astype(np.float32) / 255.0
    if a is None:
        a = np.zeros(x.shape[:2], np.float32)
    am = a[..., None]
    L = lum(x)
    # 1) separação subtil: o sujeito ganha ~1/4 de stop nas sombras e micro-contraste
    blur = cv2.GaussianBlur(L, (0, 0), 6)[..., None]
    x = x * (1 + 0.22 * am * (1 - L)) + (L - blur) * 0.25 * am
    # 2) saturação seletiva: azuis muito saturados (chão, céu) sóbrios; laranja preservado
    L = lum(x)
    mx = x.max(-1, keepdims=True)
    mn = x.min(-1, keepdims=True)
    sat = (mx - mn) / (mx + 1e-4)
    blue = np.clip((x[..., 2:3] - np.maximum(x[..., 0:1], x[..., 1:2])) / (mx + 1e-4), 0, 1)
    orange = np.clip((x[..., 0:1] - x[..., 2:3]) / (mx + 1e-4) - 0.25, 0, 1)
    s = 0.80 - 0.30 * blue * np.clip(sat * 1.4, 0, 1) + 0.10 * orange
    x = L + (x - L) * s
    # azuis empurrados para um ardósia/petróleo (mais terroso, menos "elétrico")
    x = x + np.concatenate([0.010 * blue, 0.016 * blue, -0.022 * blue], -1) * np.clip(sat * 2, 0, 1)
    # 3) temperatura: altas luzes quentes, sombras frias
    L = lum(x)
    hl = np.clip((L - 0.45) / 0.5, 0, 1) ** 1.5
    sh = np.clip(1 - L / 0.32, 0, 1) ** 2
    mid = np.clip(1 - np.abs(L - 0.42) / 0.32, 0, 1)
    x = x + np.concatenate([0.026 * hl + 0.012 * mid - 0.010 * sh, 0.020 * hl + 0.006 * mid + 0.002 * sh, -0.026 * hl - 0.012 * mid + 0.016 * sh], -1)
    x = np.clip(x, 0, 1)
    # 4) halação (vermelho-alaranjado à volta das zonas muito claras) e "bloom" suave
    L = lum(x)[..., 0]
    hot = np.clip((L - 0.70) / 0.30, 0, 1)
    hal = cv2.GaussianBlur(hot, (0, 0), 5)[..., None]
    blo = cv2.GaussianBlur(hot, (0, 0), 16)[..., None]
    x = x + hal * np.array([0.034, 0.020, 0.008], np.float32) + blo * np.array([0.048, 0.042, 0.032], np.float32)
    # 5) curva fílmica + leve "fade" de película nas sombras (frio) e altas luzes (quente)
    x = tone(np.clip(x, 0, 1.2) / 1.04)
    return np.clip(x, 0, 1)


def to8(x):
    return (np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8)


def read_frame(path, n, gray=False):
    cap = cv2.VideoCapture(path)
    cap.set(cv2.CAP_PROP_POS_FRAMES, n)
    ok, f = cap.read()
    cap.release()
    if not ok:
        raise SystemExit(f"sem fotograma {n} em {path}")
    return f[..., 0].astype(np.float32) / 255 if gray else cv2.cvtColor(f, cv2.COLOR_BGR2RGB)


def alpha_clean(a, n):
    # o RVM precisa de ~12 fotogramas para estabilizar: antes disso não há separação
    if n < 12:
        return np.zeros_like(a)
    a = cv2.erode(a, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(a, (0, 0), 2.0)


def upscale_png(rgb8, out):
    p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{SW}x{SH}", "-i", "-", "-vf", UP, out], input=rgb8.tobytes())
    if p.returncode:
        raise SystemExit("ffmpeg falhou")


def empty_plate(src):
    """sala vazia: fotograma 2 (janela livre, ele ainda à entrada, à direita) + fotograma 480
    (ele parado à janela, a faixa direita livre), unidos com transição suave em x≈0.80–0.85"""
    left = read_frame(src, 2).astype(np.float32)
    right = read_frame(src, 480).astype(np.float32)
    xs = np.arange(SW) / SW
    w = np.clip((xs - 0.80) / 0.05, 0, 1)
    w = (w * w * (3 - 2 * w))[None, :, None]
    return (left * (1 - w) + right * w).astype(np.uint8)


def main():
    mode = sys.argv[1]
    if mode == "still":
        src, alp, t, out = sys.argv[2:6]
        n = int(round(float(t) * 59.94))
        rgb = read_frame(src, n)
        a = alpha_clean(read_frame(alp, n, gray=True), n)
        upscale_png(to8(grade(rgb, a)), out)
        return
    if mode == "empty":
        src, out = sys.argv[2:4]
        upscale_png(to8(grade(empty_plate(src))), out)
        return
    src, alp, outd = sys.argv[2:5]
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    dea = subprocess.Popen(["ffmpeg", "-v", "error", "-i", alp, "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{SW}x{SH}", "-r", "30", "-i", "-", "-vf", UP, "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-g", "10", "-pix_fmt", "yuv420p", f"{outd}/plate4k.mp4"], stdin=subprocess.PIPE)
    n = 0
    while True:
        b = dec.stdout.read(SW * SH * 3)
        ab = dea.stdout.read(SW * SH)
        if len(b) < SW * SH * 3 or len(ab) < SW * SH:
            break
        rgb = np.frombuffer(b, np.uint8).reshape(SH, SW, 3)
        a = alpha_clean(np.frombuffer(ab, np.uint8).reshape(SH, SW).astype(np.float32) / 255, n)
        enc.stdin.write(to8(grade(rgb, a)).tobytes())
        n += 1
        if n % 200 == 0:
            print("fotogramas", n, flush=True)
    enc.stdin.close()
    enc.wait()
    print("total", n, flush=True)


if __name__ == "__main__":
    main()
