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

---

# Vídeo 2 — "As 3 portas" (composição `Explicativo2`)

Mesmo processo de engenharia reversa sobre `public/narracao2.m4a` (57,47 s; voz,
música, o "ding" dos 6,40 s e o "boom" dos 53,44 s ficam intactos).
Código em `src/v2/`; resultado em `out/video-explicativo-2.mp4`.

- Cores: branco + azul-turquesa; **verde** só para sinais positivos e **vermelho**
  só para negativos nas escritas.
- Estilo: minimalista e premium (anúncio de grande marca): contraste de peso
  (Inter Tight 900 / 300), serifa itálica nas palavras de impacto, mono nos dados.
- Cada cena tem o seu tema (fundo, padrão e transição próprios):

| # | Tempo | Narração | Tema · padrão · transição |
|---|---|---|---|
| 1 | 0–3,4 s | o melhor vendedor bate a meta todos os meses | branco · anel de meta · — |
| 2 | 3,4–8,1 s | o cara do time, contratos, conversão 2× | turquesa · anéis · íris |
| 3 | 8,1–10,4 s | estudar o que faz *diferente* | branco · pontos · cortina |
| 4 | 10,4–17,2 s | fecha 3 portas → uma venda | estúdio · chão em perspetiva · zoom |
| 5 | 17,2–27,5 s | Porta 1: Prioridade (não ✕ / sim ✓) | branco · diagonais · painel |
| 6 | 27,5–34,6 s | Porta 2: Solução (problema + solução = resolvido) | turquesa profundo · anéis · íris |
| 7 | 34,6–40,9 s | Porta 3: Investimento (quanto custa) | branco · pautas · cortina lateral |
| 8 | 40,9–46,3 s | confirmação: as portas fecham | estúdio · chão · zoom |
| 9 | 46,3–51,7 s | investir (verde) ≪ continuar (vermelho) | branco · grelha · painel |
| 10 | 51,7–57,5 s | nenhuma venda perdida + fecho "3 portas" | turquesa · ondas no boom · íris |

```bash
npx remotion render src/index.ts Explicativo2 out/video-explicativo-2.mp4 --codec h264 --crf 16
```
