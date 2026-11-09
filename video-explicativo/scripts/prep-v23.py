#!/usr/bin/env python3
"""Vídeo 23: prepara a filmagem para o quadrado (a mesma gradação do vídeo 22) e segue a cabeça.

Uso: prep-v23.py <src.mp4> <rvm.onnx> <cuts.json> <saida.mp4> <cabeca.json> [--test N --test-dir DIR]

- Igual ao prep-v22 (matte só para a cor, nunca recorte; 1080×1920; só os fotogramas mantidos).
- Seguimento da cabeça a partir do matte: topo da cabeça e centro horizontal da faixa da cabeça,
  por fotograma mantido, em coordenadas 1080×1920 (cabeca.json) — a composição suaviza-o e o
  quadrado acompanha o rosto como um operador de câmara.

- A pessoa NUNCA aparece recortada: o matte (RVM) serve só para graduar sujeito e sala em separado.
- Gradação "cartão": pele natural e um pouco mais luminosa (a exportação nova é ~0,3 stop mais
  escura), sala ~0,4 stop abaixo, mais fria e menos saturada — a sala real dentro do cartão
  combina com o cenário azul-noite e o rosto destaca-se.
- Amplia para 1080×1920 (Lanczos + nitidez suave) e escreve SÓ os fotogramas mantidos pelos cortes
  de pausa (cuts.json do vídeo 21: a fala é a mesma, com desfasamento de 0 ms).
"""
import json
import subprocess
import sys

import cv2
import numpy as np
import onnxruntime as ort

W, H, FPS = 1080, 1920, 30


def tone(x):
    xs = np.array([0.0, 0.04, 0.12, 0.30, 0.52, 0.75, 0.90, 1.0])
    ys = np.array([0.012, 0.030, 0.098, 0.270, 0.520, 0.765, 0.885, 0.94])
    return np.interp(x, xs, ys).astype(np.float32)


def lum(x):
    return (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]


def grade(rgb, a):
    x = rgb.astype(np.float32) / 255.0
    am = a[..., None]
    bg = 1 - am
    # exposição: sujeito +0,25 stop, sala -0,35 stop
    x = x * (1.19 * am + 0.79 * bg)
    L = lum(x)
    blur = cv2.GaussianBlur(L, (0, 0), 7)[..., None]
    x = x + (L - blur) * 0.26 * am
    L = lum(x)
    x = L + (x - L) * (0.97 * am + 0.60 * bg)
    # sombras frias (mais na sala), parede bege neutralizada
    L = lum(x)
    sh = np.clip(1 - L / 0.35, 0, 1) ** 2
    cool = sh * (0.008 + 0.018 * bg)
    x = x + np.concatenate([-cool * 0.9, cool * 0.2, cool * 1.5], -1)
    mid = np.clip(1 - np.abs(L - 0.5) / 0.4, 0, 1)
    x = x + np.concatenate([-0.011 * mid * bg, -0.001 * mid * bg, 0.009 * mid * bg], -1)
    return tone(np.clip(x, 0, 1))


def main():
    src, model, cuts_path, out, head_path = sys.argv[1:6]
    test = int(sys.argv[sys.argv.index("--test") + 1]) if "--test" in sys.argv else 0
    tdir = sys.argv[sys.argv.index("--test-dir") + 1] if "--test-dir" in sys.argv else "."
    cuts = json.load(open(cuts_path))
    keep = np.zeros(cuts["srcFrames"], bool)
    for a, b in cuts["keep"]:
        keep[a:b] = True
    sw, sh = map(int, subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src], capture_output=True, text=True, check=True).stdout.strip().split(","))
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    rec = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
    if not test:
        pw = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    n = written = 0
    heads = []
    fb = sw * sh * 3
    while True:
        buf = dec.stdout.read(fb)
        if len(buf) < fb:
            break
        rgb = np.frombuffer(buf, dtype=np.uint8).reshape(sh, sw, 3)
        xin = (rgb.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
        # o matte recorrente corre em TODOS os fotogramas (mesmo os cortados) para não perder estado
        for _ in range(3 if n == 0 else 1):
            fgr, pha, *rec = sess.run(None, {"src": xin, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": np.array([0.5], dtype=np.float32)})
        if n < len(keep) and keep[n] or test:
            a = np.clip(pha[0, 0], 0, 1)
            rows = np.where((a > 0.5).sum(1) > 6)[0]
            if len(rows):
                top = int(rows[0])
                band = a[top : top + int(0.11 * sh)] > 0.5
                xs = np.where(band.any(0))[0]
                cx = float((band * np.arange(sw)[None, :]).sum() / max(1, band.sum())) if len(xs) else sw / 2
                heads.append([round(cx * W / sw, 1), round(top * H / sh, 1)])
            else:
                heads.append(heads[-1] if heads else [W / 2, H * 0.3])
            a_gr = cv2.GaussianBlur(cv2.erode(a, np.ones((5, 5), np.uint8)), (0, 0), 2.2)
            g = grade(rgb, a_gr)
            big = cv2.resize(g, (W, H), interpolation=cv2.INTER_LANCZOS4)
            bl = cv2.GaussianBlur(big, (0, 0), 1.4)
            big = np.clip(cv2.addWeighted(big, 1.28, bl, -0.28, 0), 0, 1)
            big8 = (big * 255 + 0.5).astype(np.uint8)
            if test:
                if n % max(1, test // 4) == 0:
                    side = np.hstack([cv2.resize(rgb, (W, H), interpolation=cv2.INTER_LANCZOS4), big8])
                    cv2.imwrite(f"{tdir}/t22_{n:04d}.jpg", cv2.cvtColor(side, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 90])
                if n >= test:
                    break
            else:
                pw.stdin.write(big8.tobytes())
                written += 1
        n += 1
        if n % 300 == 0:
            print("fotogramas", n, flush=True)
    dec.terminate()
    if not test:
        pw.stdin.close()
        pw.wait()
        print("lidos", n, "escritos", written, "esperados", cuts["outFrames"])
    import json as _j
    _j.dump(heads, open(head_path, "w"))


if __name__ == "__main__":
    main()
