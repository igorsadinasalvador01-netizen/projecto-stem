#!/usr/bin/env python3
"""Vídeo 21 (documental 16:9): prepara a filmagem vertical para a composição horizontal.

Uso: prep-v21.py <src.mp4> <rvm.onnx> <saida_dir> [--test N]

Saídas (1080×1920, 30 fps):
- plate.mp4      imagem completa graduada (para os cartões "picture-in-picture");
- fg.webm        só o sujeito, graduado, com transparência (VP9 yuva420p) — é ele que flutua na
                 composição 16:9, por cima do próprio espaço desfocado;
- bg_clean.png   o espaço sem o sujeito (mediana dos fotogramas + preenchimento da zona sempre
                 tapada pelo corpo), graduado — a composição desfoca-o (profundidade de campo).

Gradação "dark cinematic": fundo ~1 stop abaixo, mais frio e menos saturado (a luz quente do
candeeiro fica como ponto de luz); sujeito com pele natural, contraste fílmico, sombras
ligeiramente frias; pretos sólidos com detalhe, altas luzes contidas.
"""
import subprocess
import sys

import cv2
import numpy as np
import onnxruntime as ort

W, H, FPS = 1080, 1920, 30


def tone(x):
    xs = np.array([0.0, 0.05, 0.15, 0.32, 0.55, 0.78, 0.92, 1.0])
    ys = np.array([0.014, 0.036, 0.118, 0.288, 0.535, 0.765, 0.875, 0.93])
    return np.interp(x, xs, ys).astype(np.float32)


def lum(x):
    return (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]


def grade(rgb, a):
    """rgb uint8 RGB, a alfa 0..1 → float 0..1"""
    x = rgb.astype(np.float32) / 255.0
    am = a[..., None]
    bg = 1 - am
    L = lum(x)
    # sujeito: micro-contraste suave (detalhe sem sobre-nitidez)
    blur = cv2.GaussianBlur(L, (0, 0), 7)[..., None]
    x = x + (L - blur) * 0.28 * am
    # saturação: pele natural (0.94), fundo apagado (0.58)
    L = lum(x)
    x = L + (x - L) * (0.94 * am + 0.58 * bg)
    # fundo ~1 stop abaixo
    x = x * (1 - 0.48 * bg)
    # sombras frias, um pouco mais no fundo; altas luzes neutras/quentes
    L = lum(x)
    sh = np.clip(1 - L / 0.35, 0, 1) ** 2
    cool = sh * (0.010 + 0.016 * bg)
    x = x + np.concatenate([-cool * 0.9, cool * 0.15, cool * 1.4], -1)
    # neutraliza a dominante bege/amarela da parede (sobretudo no fundo)
    mid = np.clip(1 - np.abs(L - 0.5) / 0.4, 0, 1)
    x = x + np.concatenate([-0.012 * mid * bg, -0.004 * mid * bg, 0.016 * mid * bg], -1)
    return tone(np.clip(x, 0, 1))


def main():
    src, model, out = sys.argv[1:4]
    test = int(sys.argv[sys.argv.index("--test") + 1]) if "--test" in sys.argv else 0
    sw, sh = map(int, subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src], capture_output=True, text=True, check=True).stdout.strip().split(","))
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
    rec = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
    if not test:
        pw = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", f"{out}/plate.mp4"], stdin=subprocess.PIPE)
        fw = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "6M", "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-auto-alt-ref", "0", f"{out}/fg.webm"], stdin=subprocess.PIPE)
    acc, cnt = None, None  # para a placa limpa (média ponderada pelo "não-sujeito")
    n = 0
    fb = sw * sh * 3
    while True:
        buf = dec.stdout.read(fb)
        if len(buf) < fb:
            break
        rgb = np.frombuffer(buf, dtype=np.uint8).reshape(sh, sw, 3)
        xin = (rgb.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
        for _ in range(3 if n == 0 else 1):
            fgr, pha, *rec = sess.run(None, {"src": xin, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": np.array([0.5], dtype=np.float32)})
        a = np.clip(pha[0, 0], 0, 1)
        # alfa do recorte: contrai 1 px e esbate pouco (contorno limpo, sem halo do fundo)
        a_cut = cv2.GaussianBlur(cv2.erode(a, np.ones((3, 3), np.uint8)), (0, 0), 0.8)
        # alfa da gradação: contraído e esbatido — o fundo escurece até ao contorno (sem halo)
        a_gr = cv2.GaussianBlur(cv2.erode(a, np.ones((5, 5), np.uint8)), (0, 0), 2.0)
        g = grade(rgb, a_gr)
        big = cv2.resize(g, (W, H), interpolation=cv2.INTER_LANCZOS4)
        bl = cv2.GaussianBlur(big, (0, 0), 1.4)
        big = np.clip(cv2.addWeighted(big, 1.3, bl, -0.3, 0), 0, 1)
        big8 = (big * 255 + 0.5).astype(np.uint8)
        al = np.clip(cv2.resize(a_cut, (W, H), interpolation=cv2.INTER_CUBIC), 0, 1)
        # placa limpa: acumula o fundo onde o sujeito não está
        wbg = (cv2.dilate(a, np.ones((31, 31), np.uint8)) < 0.02).astype(np.float64)[..., None]
        if n % 3 == 0:
            if acc is None:
                acc = np.zeros(rgb.shape, np.float64)
                cnt = np.zeros(rgb.shape[:2] + (1,), np.float64)
            acc += rgb.astype(np.float64) * wbg
            cnt += wbg
        if test:
            if n % max(1, test // 4) == 0:
                cv2.imwrite(f"{out}/t_plate_{n:04d}.jpg", cv2.cvtColor(big8, cv2.COLOR_RGB2BGR))
                chk = (big8.astype(np.float32) * al[..., None] + np.array([30, 40, 60], np.float32) * (1 - al[..., None])).astype(np.uint8)
                cv2.imwrite(f"{out}/t_fg_{n:04d}.jpg", cv2.cvtColor(chk, cv2.COLOR_RGB2BGR))
            if n >= test:
                break
        else:
            pw.stdin.write(big8.tobytes())
            fw.stdin.write(np.dstack([big8, (al * 255).astype(np.uint8)]).tobytes())
        n += 1
        if n % 300 == 0:
            print("fotogramas", n, flush=True)
    dec.terminate()
    if not test:
        pw.stdin.close()
        fw.stdin.close()
        pw.wait()
        fw.wait()
    # placa limpa: média onde houve fundo; a zona sempre tapada pelo corpo é preenchida por
    # convolução normalizada (continuação suave das cores à volta — vai ser muito desfocada)
    valid = cv2.erode((cnt[..., 0] > 0.15 * cnt.max()).astype(np.float32), np.ones((9, 9), np.uint8))
    avg = (acc / np.maximum(cnt, 1e-3)).astype(np.float32)
    fill = np.zeros_like(avg)
    have = np.zeros(valid.shape, np.float32)
    for sig in (12, 25, 50, 100, 200):  # do pormenor para o geral: cada raio só preenche o que falta
        num = cv2.GaussianBlur(avg * valid[..., None], (0, 0), sig)
        den = cv2.GaussianBlur(valid, (0, 0), sig)
        est = num / np.maximum(den, 1e-6)[..., None]
        take = np.clip(den / 0.25, 0, 1) * (1 - have)
        fill += est * take[..., None]
        have += take
    m = cv2.GaussianBlur(1 - valid, (0, 0), 3)[..., None]
    clean = np.clip(avg * (1 - m) + fill * m, 0, 255).astype(np.uint8)
    hole = valid < 0.5
    gclean = grade(clean, np.zeros(clean.shape[:2], np.float32))
    big = cv2.resize(gclean, (W, H), interpolation=cv2.INTER_LANCZOS4)
    cv2.imwrite(f"{out}/bg_clean.png", cv2.cvtColor((np.clip(big, 0, 1) * 255 + 0.5).astype(np.uint8), cv2.COLOR_RGB2BGR))
    print("total", n, "fotogramas; placa limpa: zona preenchida", round(float(hole.mean()) * 100, 1), "%")


if __name__ == "__main__":
    main()
