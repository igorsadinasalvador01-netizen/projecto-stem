#!/usr/bin/env bash
# Vídeo 19: depois de scripts/grade-gym.py, grava a contagem real de fotogramas (n60) em
# src/v19/edit19.json e cria os recortes da pessoa (VP9 com alfa) só nos intervalos onde o texto
# passa por trás do corpo (DISCIPLINE. no plano A).
# Uso: scripts/fg-v19.sh   (a partir de video-explicativo/)
set -euo pipefail
D=public/v19
for k in A B C D E; do
  n=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$D/$k.mp4")
  python3 - "$k" "$n" <<'EOF'
import json, re, sys
k, n = sys.argv[1], int(sys.argv[2])
p = "src/v19/edit19.json"
s = open(p).read()
s = re.sub(rf'("{k}": {{ "fa": \d+, "fb": \d+)(, "n60": \d+)?( }})', rf'\1, "n60": {n}\3', s)
json.loads(s)
open(p, "w").write(s)
print(k, "n60 =", n)
EOF
done
fg() { # clip k0 k1
  ffmpeg -v error -y -i "$D/$1.mp4" -i "$D/$1_a.mp4" -filter_complex \
    "[0]select='between(n\,$2\,$3)',setpts=N/30/TB[v];[1]select='between(n\,$2\,$3)',setpts=N/30/TB,scale=1080:1920:flags=bicubic,format=gray[a];[v][a]alphamerge" \
    -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 8M -deadline good -cpu-used 4 -row-mt 1 -auto-alt-ref 0 -r 30 "$D/$1_fg.webm"
  echo "$1_fg.webm  fotogramas $2–$3"
}
fg A 120 250
