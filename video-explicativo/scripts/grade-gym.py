#!/usr/bin/env python3
"""Vídeo 19 (ginásio): prepara cada clipe limpo da filmagem para a montagem cinematográfica.

Uso:
  grade-gym.py clip <src.mp4> <rvm.onnx> <nome> <frame_ini> <frame_fim> <saida_dir>
  grade-gym.py still <imagem.png> <rvm.onnx> <saida.png>

Por clipe (intervalo de fotogramas limpo, sem as transições já gravadas na origem):
- interpola para 60 fps (minterpolate, compensação de movimento) para câmara lenta suave;
- recorta a pessoa com RVM (Robust Video Matting) para graduar fundo e sujeito em separado;
- gradação: fundo ~meio stop abaixo, mais frio e menos saturado; sujeito com pele natural e
  micro-contraste suave; sombras neutras/frias, pretos profundos com detalhe, altas luzes contidas;
- sobe para 1080×1920 (Lanczos + nitidez leve).
Escreve <nome>.mp4 com os fotogramas de 60 fps numa base de 30 fps (o índice do fotograma é o
índice a 60 fps, o que deixa a composição escolher meio-fotogramas) e <nome>_a.mp4 com o alfa.
"""
import subprocess
import sys

import cv2
import numpy as np
import onnxruntime as ort

W, H = 1080, 1920


def tone(x: np.ndarray) -> np.ndarray:
    """Curva fílmica: pé suave (pretos profundos mas com detalhe) e ombro que segura as altas luzes."""
    xs = np.array([0.0, 0.06, 0.16, 0.32, 0.55, 0.78, 0.92, 1.0])
    ys = np.array([0.012, 0.035, 0.115, 0.275, 0.53, 0.765, 0.87, 0.925])
    return np.interp(x, xs, ys).astype(np.float32)


def grade(rgb: np.ndarray, a: np.ndarray) -> np.ndarray:
    """rgb uint8 (h,w,3), a alfa 0..1 (h,w). Devolve float 0..1."""
    x = rgb.astype(np.float32) / 255.0
    L = (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]
    # 1) neutraliza a dominante amarela/bege do ginásio (mais nas zonas médias e claras)
    mid = np.clip(L * 1.6, 0, 1)
    x = x + np.stack([-0.016 * mid[..., 0], -0.003 * mid[..., 0], 0.026 * mid[..., 0]], -1)
    # 2) sombras neutras a frias
    sh = np.clip(1 - L / 0.38, 0, 1) ** 2
    x = x + np.stack([-0.008 * sh[..., 0], 0.002 * sh[..., 0], 0.011 * sh[..., 0]], -1)
    x = np.clip(x, 0, 1)
    L = (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]
    # 3) sujeito: micro-contraste suave (detalhe nítido sem sobre-nitidez)
    blur = cv2.GaussianBlur(L, (0, 0), 9)[..., None]
    am = a[..., None]
    x = x + (L - blur) * 0.32 * am
    # 4) saturação: sujeito quase natural, fundo mais apagado
    L = (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]
    sat = 0.86 * am + 0.62 * (1 - am)
    x = L + (x - L) * sat
    # 5) fundo ~0.6 stop abaixo e um pouco mais frio (o sujeito destaca-se sem recorte visível)
    bg = (1 - am)
    x = x * (1 - 0.33 * bg)
    x = x + np.concatenate([-0.006 * bg, 0.0 * bg, 0.012 * bg], -1) * (1 - L)
    # 6) curva fílmica
    x = tone(np.clip(x, 0, 1))
    return x


def load_alpha_sess(model: str):
    return ort.InferenceSession(model, providers=["CPUExecutionProvider"])


def rvm_step(sess, rgb, rec, ratio=0.5):
    x = (rgb.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
    fgr, pha, *rec = sess.run(None, {"src": x, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": np.array([ratio], dtype=np.float32)})
    a = np.clip(pha[0, 0], 0, 1)
    # matte suave: contrai 1–2 px e esbate pouco, para o fundo escurecer até ao contorno (sem halo)
    a = cv2.erode(a, np.ones((3, 3), np.uint8))
    a = cv2.GaussianBlur(a, (0, 0), 2.2)
    return a, rec


def finish(x: np.ndarray) -> np.ndarray:
    big = cv2.resize(x, (W, H), interpolation=cv2.INTER_LANCZOS4)
    blur = cv2.GaussianBlur(big, (0, 0), 1.3)
    big = cv2.addWeighted(big, 1.28, blur, -0.28, 0)
    return (np.clip(big, 0, 1) * 255 + 0.5).astype(np.uint8)


def main():
    mode = sys.argv[1]
    if mode == "still":
        img, model, out = sys.argv[2:5]
        rgb = cv2.cvtColor(cv2.imread(img), cv2.COLOR_BGR2RGB)
        sess = load_alpha_sess(model)
        rec = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
        for _ in range(4):  # o RVM é temporal: algumas passagens estabilizam o alfa
            a, rec = rvm_step(sess, rgb, rec)
        cv2.imwrite(out, cv2.cvtColor(finish(grade(rgb, a)), cv2.COLOR_RGB2BGR))
        return
    src, model, name, fa, fb, outd = sys.argv[2:8]
    fa, fb = int(fa), int(fb)
    sw, sh = 576, 1024
    vf = f"select='between(n\\,{fa}\\,{fb})',setpts=N/30/TB,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", vf, "-an", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-g", "12", "-pix_fmt", "yuv420p", f"{outd}/{name}.mp4"], stdin=subprocess.PIPE)
    aenc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{sw}x{sh}", "-r", "30", "-i", "-", "-c:v", "libx264", "-crf", "10", "-g", "12", "-pix_fmt", "yuv420p", f"{outd}/{name}_a.mp4"], stdin=subprocess.PIPE)
    sess = load_alpha_sess(model)
    rec = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
    fbytes = sw * sh * 3
    n = 0
    while True:
        buf = dec.stdout.read(fbytes)
        if len(buf) < fbytes:
            break
        rgb = np.frombuffer(buf, dtype=np.uint8).reshape(sh, sw, 3)
        if n == 0:  # aquece o estado temporal do RVM no primeiro fotograma
            for _ in range(3):
                _, rec = rvm_step(sess, rgb, rec)
        a, rec = rvm_step(sess, rgb, rec)
        enc.stdin.write(finish(grade(rgb, a)).tobytes())
        aenc.stdin.write((a * 255).astype(np.uint8).tobytes())
        n += 1
        if n % 120 == 0:
            print(name, "fotogramas", n, flush=True)
    dec.wait()
    enc.stdin.close()
    aenc.stdin.close()
    enc.wait()
    aenc.wait()
    print(name, "total", n, flush=True)


if __name__ == "__main__":
    main()
