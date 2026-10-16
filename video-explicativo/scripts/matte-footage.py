#!/usr/bin/env python3
"""Prepara a filmagem de um vídeo de rosto para composição em camadas (vídeo 17+).

Uso: matte-footage.py <entrada.mp4> <modelo_rvm.onnx> <pasta_saida> [--test N]

- Reamostra para 30 fps e sobe para 1080×1920 (Lanczos + nitidez suave).
- Recorta a pessoa com Robust Video Matting (RVM, ONNX, temporal).
- Escreve plate.mp4 (imagem completa) e fg.webm (só a pessoa, VP9 com transparência),
  para os gráficos poderem passar "atrás" da pessoa.
"""
import subprocess
import sys

import cv2
import numpy as np
import onnxruntime as ort

src, model, out = sys.argv[1:4]
test = int(sys.argv[sys.argv.index("--test") + 1]) if "--test" in sys.argv else 0
W, H, FPS = 1080, 1920, 30

probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src], capture_output=True, text=True, check=True).stdout.strip().split(",")
sw, sh = int(probe[0]), int(probe[1])
dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)

sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
rec = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
ratio = np.array([0.6], dtype=np.float32)

# escala para cobrir 1080×1920 e recorta ao centro
scale = max(W / sw, H / sh)
nw, nh = int(round(sw * scale)), int(round(sh * scale))
ox, oy = (nw - W) // 2, (nh - H) // 2


def up(img: np.ndarray, interp: int) -> np.ndarray:
    big = cv2.resize(img, (nw, nh), interpolation=interp)
    return big[oy : oy + H, ox : ox + W]


if test:
    plate_w = fg_w = None
else:
    plate_w = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", f"{out}/plate.mp4"], stdin=subprocess.PIPE)
    fg_w = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "5M", "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-auto-alt-ref", "0", f"{out}/fg.webm"], stdin=subprocess.PIPE)

n = 0
frame_bytes = sw * sh * 3
while True:
    buf = dec.stdout.read(frame_bytes)
    if len(buf) < frame_bytes:
        break
    rgb = np.frombuffer(buf, dtype=np.uint8).reshape(sh, sw, 3)
    x = (rgb.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
    fgr, pha, *rec = sess.run(None, {"src": x, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": ratio})
    a = pha[0, 0]
    big = up(rgb, cv2.INTER_LANCZOS4)
    # nitidez suave (unsharp) para compensar a subida de resolução
    blur = cv2.GaussianBlur(big, (0, 0), 1.6)
    big = cv2.addWeighted(big, 1.45, blur, -0.45, 0)
    al = np.clip(up(a, cv2.INTER_CUBIC), 0, 1)
    # bordas: contrai ligeiramente e suaviza para não ficar halo do fundo
    al = np.clip((al - 0.06) / 0.88, 0, 1)
    if test:
        if n % max(1, test // 6) == 0:
            cv2.imwrite(f"{out}/test_plate_{n:04d}.jpg", cv2.cvtColor(big, cv2.COLOR_RGB2BGR))
            chk = (big.astype(np.float32) * al[..., None] + np.array([16, 36, 64], dtype=np.float32) * (1 - al[..., None])).astype(np.uint8)
            cv2.imwrite(f"{out}/test_fg_{n:04d}.jpg", cv2.cvtColor(chk, cv2.COLOR_RGB2BGR))
        if n >= test:
            break
    else:
        plate_w.stdin.write(big.tobytes())
        rgba = np.dstack([big, (al * 255).astype(np.uint8)])
        fg_w.stdin.write(rgba.tobytes())
    n += 1
    if n % 150 == 0:
        print("fotogramas", n, flush=True)

dec.terminate()
if not test:
    plate_w.stdin.close()
    fg_w.stdin.close()
    plate_w.wait()
    fg_w.wait()
print("total", n)
