# Vídeo explicativo — "O segredo de quem vende todos os dias"

Animações explicativas em Remotion (React → vídeo) criadas por engenharia reversa
do vídeo original: a narração, a música e os impactos ficam **exatamente iguais**
(`public/narracao.m4a`), e as animações seguem a voz palavra a palavra.

- Formato: 1080×1920 (9:16), 30 fps, 24,06 s
- Resultado: `out/video-explicativo.mp4`

## Como foi sincronizado

O vídeo original era só áudio sobre ecrã preto. A transcrição com tempos por palavra
(Parakeet v3, via sherpa-onnx) e o envelope de energia do áudio deram a partitura em
`src/timeline.ts`:

| Momento | Áudio original | Animação |
|---|---|---|
| 0,0–3,0 s | "Quer saber o segredo de quem faz vendas todos os dias?" | cadeado 3D, barras dos 7 dias |
| 3,44 s | impacto grave | o cadeado abre, transição para a cena 2 |
| 4,0–9,5 s | "Eles começaram sem experiência, sem seguidores, sem dinheiro." | 3 cartões de vidro com valor "0" |
| 9,9–14,4 s | "A diferença é que eles não desistiram quando ninguém assistia aos vídeos deles." | marcador turquesa, telemóvel 3D com publicações a subir e 0 visualizações |
| 15,0–20,0 s | "A sua primeira venda pode estar escondida atrás da sua próxima tentativa." | baralho de tentativas com a luz da venda escondida |
| 20,04 s | "boom" subgrave | a carta voa, selo 3D com o visto, notificação "Nova venda" |
| 21,1–24,06 s | silêncio | fecho: "Poste o próximo vídeo." |

## Direção de arte

- Cores: branco, azul-turquesa escuro (`#12B5BA`), cinza de estúdio e vidro transparente. Sem preto.
- Fontes alternadas: Inter Tight (contexto), Instrument Serif itálico (frases de impacto),
  JetBrains Mono (dados e etiquetas), Inter (apoio).
- 3D real (three.js): cadeado e selo metálicos com iluminação de estúdio.
  3D em CSS: cartões de vidro, telemóvel e baralho em perspetiva.
- Sons (sintetizados em `scripts/gen-sfx.mjs`, calibrados abaixo da voz):
  entrada (whoosh, swish, thud, tick), destaque (hit, riser, shimmer), alerta (bip "zero", ding de venda).

## Comandos

```bash
npm install
node scripts/gen-sfx.mjs          # regenera os efeitos sonoros
npx remotion studio src/index.ts  # pré-visualizar e editar
npx remotion render src/index.ts Explicativo out/video-explicativo.mp4 --codec h264 --crf 16 --gl=angle
```

Para renderizar sem os efeitos sonoros extra: `--props='{"sfx":false,"sfxGain":1}'`.
Num ambiente sem GPU, usar `--gl=swangle`.
