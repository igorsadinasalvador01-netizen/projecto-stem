#!/usr/bin/env python3
"""Vídeo 20: extrai de public/v20/plate4k.mp4 só os fotogramas que a montagem usa (edit20.json),
como JPEG 4K em public/v20/f/NNNN.jpg. A composição lê-os com <Img> (o extrator de vídeo do
Remotion esgotava a memória com fotogramas 4K em paralelo)."""
import json
import os

import cv2

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ED = json.load(open(os.path.join(ROOT, "src", "v20", "edit20.json")))
fps = ED["srcFps"]
need = set()
for sh in ED["shots"]:
    if sh["kind"] != "footage":
        continue
    a = min(k[1] for k in sh["t"])
    b = max(k[1] for k in sh["t"])
    need.update(range(max(0, int(a * fps) - 3), min(1837, int(b * fps) + 4) + 1))
out = os.path.join(ROOT, "public", "v20", "f")
os.makedirs(out, exist_ok=True)
cap = cv2.VideoCapture(os.path.join(ROOT, "public", "v20", "plate4k.mp4"))
i = n = 0
while cap.grab():
    if i in need:
        ok, fr = cap.retrieve()
        cv2.imwrite(os.path.join(out, f"{i:04d}.jpg"), fr, [cv2.IMWRITE_JPEG_QUALITY, 94])
        n += 1
    i += 1
print("lidos", i, "guardados", n)
