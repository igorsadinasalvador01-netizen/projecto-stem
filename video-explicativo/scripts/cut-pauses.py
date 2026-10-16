#!/usr/bin/env python3
"""Corta as pausas mortas de um vídeo de rosto (vídeo 17+) e mantém tudo sincronizado.

Uso: cut-pauses.py <narracao> <plate.mp4> <fg.webm> <saida_dir> <cuts.json> [--fps 30]
       [--min 0.22] [--keep 0.13] [--long 0.5] [--keep-long 0.2] [--narr-out f.m4a]

- Mede o silêncio na narração (RMS em janelas de 10 ms, limiar = p95 - 32 dB).
- Cada pausa >= --min fica com --keep segundos (as >= --long ficam com --keep-long, para
  respirar); o silêncio inicial fica com --keep. Os cortes são alinhados aos fotogramas.
- Escreve <cuts.json> (fotogramas mantidos) e aplica os MESMOS cortes a plate.mp4, fg.webm
  (com transparência) e à narração (com micro-fades de 8 ms para não dar estalos).
"""
import json
import subprocess
import sys

import numpy as np

narr, plate, fg, out, cuts_path = sys.argv[1:6]


def opt(name: str, default: float) -> float:
    return float(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default


FPS = int(opt("--fps", 30))
MIN, KEEP, LONG, KEEP_LONG = opt("--min", 0.22), opt("--keep", 0.13), opt("--long", 0.5), opt("--keep-long", 0.2)
SR = 16000

pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", narr, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, dtype=np.float32)
hop = SR // 100
n = len(x) // hop
rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1))
db = 20 * np.log10(rms + 1e-9)
sil = db < np.percentile(db, 95) - 32
dur = len(x) / SR

runs, i = [], 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]:
            j += 1
        runs.append((i / 100, j / 100))
        i = j
    else:
        i += 1

src_frames = int(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", plate], capture_output=True, text=True, check=True).stdout.strip())
remove = []
for a, b in runs:
    L = b - a
    if a <= 0.001:  # silêncio inicial
        ra, rb = 0.0, b - KEEP
    elif b >= dur - 0.02:  # cauda: fica (o fecho com o perfil vem depois)
        continue
    elif L >= MIN:
        keep = KEEP_LONG if L >= LONG else KEEP
        pad_l = keep * 0.55
        ra, rb = a + pad_l, b - (keep - pad_l)
    else:
        continue
    fa, fb = int(np.ceil(ra * FPS)), int(np.floor(rb * FPS))
    if fb - fa >= 3:
        remove.append((fa, fb))

keep, cur = [], 0
for fa, fb in remove:
    if fa > cur:
        keep.append([cur, fa])
    cur = fb
keep.append([cur, src_frames])
out_frames = sum(b - a for a, b in keep)
json.dump({"fps": FPS, "srcFrames": src_frames, "outFrames": out_frames, "keep": keep}, open(cuts_path, "w"))
print(f"{len(remove)} cortes · {src_frames} → {out_frames} fotogramas ({src_frames / FPS:.2f} s → {out_frames / FPS:.2f} s)")

sel = "+".join(f"between(n\\,{a}\\,{b - 1})" for a, b in keep)
vf = f"select='{sel}',setpts=N/{FPS}/TB"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", plate, "-vf", vf, "-an", "-r", str(FPS), "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-pix_fmt", "yuv420p", f"{out}/plate_c.mp4"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-c:v", "libvpx-vp9", "-i", fg, "-vf", vf, "-an", "-r", str(FPS), "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "5M", "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-auto-alt-ref", "0", f"{out}/fg_c.webm"], check=True)

parts, labels = [], []
for k, (a, b) in enumerate(keep):
    s, e = a / FPS, b / FPS
    if k == len(keep) - 1:
        e = max(e, dur)
    d = e - s
    parts.append(f"[0:a]atrim=start={s:.5f}:end={e:.5f},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={max(0, d - 0.008):.5f}:d=0.008[a{k}]")
    labels.append(f"[a{k}]")
fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(keep)}:v=0:a=1[out]"
narr_out = sys.argv[sys.argv.index("--narr-out") + 1] if "--narr-out" in sys.argv else f"{out}/narracao_c.m4a"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", narr, "-filter_complex", fc, "-map", "[out]", "-c:a", "aac", "-b:a", "256k", narr_out], check=True)
print("ok", narr_out)
