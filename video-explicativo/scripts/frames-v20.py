#!/usr/bin/env python3
"""Vídeo 20: pré-mistura dos fotogramas da câmara lenta, em precisão total (float), um JPEG 4K por
fotograma de saída e por plano: public/v20/fx/<plano>/NNNN.jpg (NNNN = fotograma da montagem).

Porquê aqui e não na composição: misturar 3–4 camadas com opacidade no Chrome é feito a 8 bits e
o arredondamento muda quando muda o número de camadas → "clarões" de ~1 nível nas zonas escuras.

Para cada fotograma: tempo da montagem → tempo da filmagem (a mesma PCHIP de src/v20/edit20.ts e
de gen-v20-audio.py) → janela temporal FIXA de 3 fotogramas de origem (≈1/20 s) centrada no
índice fracionário (nitidez e ruído iguais em todos os fotogramas; espalha o resto dos saltos de
I-frame da origem). Lê public/v20/plate4k.mp4 (graduado) sequencialmente.
Correr depois de mudar os tempos em edit20.json.
"""
import importlib.util
import json
import math
import os
import shutil

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ED = json.load(open(os.path.join(ROOT, "src", "v20", "edit20.json")))
spec = importlib.util.spec_from_file_location("a20", os.path.join(ROOT, "scripts", "gen-v20-audio.py"))
a20 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(a20)
pchip = a20.pchip

FPS, SFPS, NSRC, WIN = ED["fps"], ED["srcFps"], 1838, 3.0


def weights(k):
    a, b = k - WIN / 2, k + WIN / 2
    out = []
    for j in range(round(a), round(b) + 1):
        w = max(0.0, min(b, j + 0.5) - max(a, j - 0.5))
        if w > 1e-4 and 0 <= j < NSRC:
            out.append((j, w))
    tot = sum(w for _, w in out)
    return [(j, w / tot) for j, w in out]


def main():
    base = os.path.join(ROOT, "public", "v20", "fx")
    shutil.rmtree(base, ignore_errors=True)
    for sh in ED["shots"]:
        if sh["kind"] != "footage":
            continue
        d = os.path.join(base, sh["id"])
        os.makedirs(d)
        f0, f1 = math.ceil(sh["span"][0] * FPS), math.ceil(sh["span"][1] * FPS) - 1
        plan = []
        for f in range(f0, f1 + 1):
            k = min(NSRC - 2, max(1, pchip(sh["t"], f / FPS) * SFPS))
            plan.append((f, weights(k)))
        jmin = min(j for _, ws in plan for j, _ in ws)
        cap = cv2.VideoCapture(os.path.join(ROOT, "public", "v20", "plate4k.mp4"))
        cap.set(cv2.CAP_PROP_POS_FRAMES, jmin)
        buf, nxt = {}, jmin
        for f, ws in plan:
            need = max(j for j, _ in ws)
            while nxt <= need:
                ok, fr = cap.read()
                if not ok:
                    raise SystemExit(f"plate4k.mp4 terminou antes do fotograma {nxt}")
                buf[nxt] = fr.astype(np.float32)
                nxt += 1
            for j in [j for j in buf if j < min(jj for jj, _ in ws)]:
                del buf[j]
            acc = sum(buf[j] * w for j, w in ws)
            cv2.imwrite(os.path.join(d, f"{f:04d}.jpg"), np.clip(acc + 0.5, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 94])
        print(sh["id"], "fotogramas", f0, "–", f1)


if __name__ == "__main__":
    main()
