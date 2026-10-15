#!/usr/bin/env bash
# Peças reais para a versão horizontal do vídeo 9 (public/v9h), tiradas do próprio material do autor:
#   v1–v9  miniaturas dos 9 vídeos já feitos (out/), num momento com o título visível;
#   s1–s6  cenas do vídeo 9 vertical (storyboard "Cenas");
#   f1–f4  fotogramas do rosto (clipes de gravação, avatar do perfil);
#   preview.mp4  o vídeo 9 vertical, mudo e pequeno (pré-visualização no código Remotion).
# Uso: bash scripts/extract-v9h-thumbs.sh   (precisa de ffmpeg e dos vídeos em out/ + public/v9/rosto.mp4)
set -euo pipefail
cd "$(dirname "$0")/.."
D=public/v9h/thumbs
mkdir -p "$D"
grab() { ffmpeg -y -v error -ss "$2" -i "$1" -frames:v 1 -vf scale=540:-2 -q:v 3 "$3"; }
i=1
for spec in "out/video-explicativo.mp4 20.6" "out/video-explicativo-2.mp4 6.0" "out/video-explicativo-3.mp4 15.5" \
  "out/video-explicativo-4.mp4 15.0" "out/video-explicativo-5.mp4 11.5" "out/video-explicativo-6.mp4 28.8" \
  "out/video-explicativo-7.mp4 13.0" "out/video-explicativo-8.mp4 22.6" "out/video-conteudo-9.mp4 32.6"; do
  set -- $spec
  grab "$1" "$2" "$D/v$i.jpg"
  i=$((i + 1))
done
i=1
for t in 8.6 12.4 25.9 36.6 47.9 54.95; do
  grab out/video-conteudo-9.mp4 "$t" "$D/s$i.jpg"
  i=$((i + 1))
done
i=1
for t in 3 20 45 61; do
  grab public/v9/rosto.mp4 "$t" "$D/f$i.jpg"
  i=$((i + 1))
done
ffmpeg -y -v error -i out/video-conteudo-9.mp4 -an -vf scale=360:-2 -c:v libx264 -crf 26 -preset slow public/v9h/preview.mp4
echo "public/v9h pronto"
