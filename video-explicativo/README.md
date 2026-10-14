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

---

# Vídeo 3 — "Comece mesmo com medo" (composição `Explicativo3`)

Mesma dinâmica do vídeo 2 (código partilhado em `src/v2/`, cenas em `src/v3/`)
sobre `public/narracao3.m4a` (22,64 s; voz e "boom" dos 18,63 s intactos).
Resultado em `out/video-explicativo-3.mp4`.

| # | Tempo | Narração | Tema · padrão · transição |
|---|---|---|---|
| 1 | 0–4,6 s | não precisa saber ~~tudo~~ (vermelho) para a primeira venda (verde) | branco · pontos · barra de conhecimento com a 1.ª venda aos 22% |
| 2 | 4,6–7,7 s | todo especialista já foi iniciante um dia | turquesa · anéis · íris · escada |
| 3 | 7,7–11,1 s | alguns começaram (verde) mesmo com medo (vermelho) | branco · diagonais · painel · medidor de medo |
| 4 | 11,1–14,9 s | aprenda, aplique e melhore todos os dias | turquesa profundo · grelha · íris · ciclo + contador |
| 5 | 14,9–19,4 s | a primeira venda está mais perto do que imagina + boom | estúdio · chão · zoom · bandeira + notificação |
| 6 | 19,4–22,6 s | fecho | turquesa · íris · "Comece mesmo com medo" |

```bash
npx remotion render src/index.ts Explicativo3 out/video-explicativo-3.mp4 --codec h264 --crf 16
```

---

# Vídeo 4 — "A primeira venda prova que é possível" (composição `Explicativo4`)

Mesmo padrão dos vídeos 2 e 3, numa versão **um pouco dark**: superfícies "noite"
(carvão com brilho turquesa) e "abismo" (turquesa quase preto), peças em vidro
fumado, branco + turquesa, verde/vermelho só para sinais. Cenas em `src/v4/`;
áudio `public/narracao4.m4a` (31,46 s; voz e "boom" dos 27,46 s intactos).
A voz deste vídeo está ~8 dB acima das outras, por isso `sfxGain` = 2,2.

| # | Tempo | Narração | Tema · padrão · transição |
|---|---|---|---|
| 1 | 0–3,9 s | porque a primeira venda é tão importante? | noite · pontos · "1ª" a encher-se |
| 2 | 3,9–7,0 s | ela prova que é possível | abismo · anéis · íris · ~~im~~possível |
| 3 | 7,0–12,8 s | ninguém começa sabendo (perfeito ✕, tudo ✕) | noite · grelha · painel |
| 4 | 12,8–17,4 s | errando (vermelho), testando, melhorando (verde) | abismo · diagonais · íris · gráfico |
| 5 | 17,4–22,4 s | não muda só a conta bancária — muda a mentalidade | noite · pautas · cortina · cartão + esfera |
| 6 | 22,4–28,2 s | o esforço valeu a pena — continuar crescendo + boom | abismo · chão · zoom · barras |
| 7 | 28,2–31,5 s | fecho "é possível." | turquesa profundo · íris |

```bash
npx remotion render src/index.ts Explicativo4 out/video-explicativo-4.mp4 --codec h264 --crf 16
```

**Nota de mistura (todos os vídeos):** o "boom" original já chega a ~0 dBFS, por
isso os efeitos de brilho/ding entram depois do corpo do boom (≈ +0,7 s) para não
saturar. Para refazer só o áudio sem renderizar a imagem: renderizar com
`--codec=wav` e juntar com `ffmpeg -c:v copy -c:a aac` (o `.aac` solto perde a
sincronização por causa do atraso do codificador).

---

# Vídeo 5 — "A experiência vem depois da ação" (composição `Explicativo5`)

Mesma referência de edição, com **expressão nostálgica**: papel envelhecido em vez
de branco, turquesa desbotado, grade sépia, grão forte, pó e riscos, fugas de luz,
cintilação e trepidação de projetor; serifa Instrument Serif + manuscrito (Caveat)
+ máquina de escrever. Cenas em `src/v5/`; áudio `public/narracao5.m4a`
(24,06 s; voz, música e "boom" dos 20,04 s intactos).

| # | Tempo | Narração | Ideia · transição |
|---|---|---|---|
| 1 | 0–3,3 s | quer saber um segredo sobre começar no digital? | envelope com lacre, carta datilografada · cintilação de projetor |
| 2 | 3,3–6,6 s | você **nunca** vai se sentir ~~100%~~ pronto | mostrador analógico preso nos 99% · tira de película |
| 3 | 6,6–9,2 s | sempre vai existir algo novo para aprender | fichas de arquivo com carimbo "novo" · virar de página |
| 4 | 9,2–13,1 s | quem faz a **primeira venda** não sabe ~~tudo~~ | polaroide a revelar-se + enciclopédia com carimbo "não" · projetor de diapositivos |
| 5 | 13,1–17,8 s | começam, corrigem os erros, continuam melhorando | tira de película na câmara escura · queima |
| 6 | 17,8–20,4 s | a experiência vem depois da ação + boom | carimbos 1 · ação → 2 · experiência, queima de película no boom |
| 7 | 20,4–24,1 s | fecho | "Comece." + polaroide "dia 1" a revelar-se, fim de bobine |

**Mistura:** este original já vem limitado (~0 dBFS em muitas sílabas). Os efeitos
usam *ducking* automático: `src/v5/mix5.json` guarda a margem livre do original
por fotograma e cada efeito só ocupa essa margem — a voz nunca é alterada.

```bash
npx remotion render src/index.ts Explicativo5 out/video-explicativo-5.mp4 --codec h264 --crf 16
```

---

# Vídeo 6 — "Prova social" (composição `Explicativo6`)

Mesmos critérios dos vídeos 2–5 (branco + turquesa, verde só para positivo,
vermelho só para negativo), com um motion **envolvente, que cria emoção e ligação**.
Cenas em `src/v6/`; áudio `public/narracao6.m4a` (29,43 s; voz intacta, sem boom:
o clímax é a própria frase "e é aí que a venda acontece").

Linguagem emocional (`src/v6/Emotion.tsx`), com personalidade "premium emocional"
(uma curva-assinatura, três durações, entradas sempre em arco):

- **fios de ligação** que se desenham entre pessoas, com uma faísca a percorrê-los;
- **batimento cardíaco** (escala lub-dub + som) nos momentos de confiança;
- **luz quente vs. luz fria**: quem está sozinho fica frio; quem é acompanhado aquece;
- ondas que se expandem, estrelas que acendem e bokeh ambiente a subir.

| # | Tempo | Narração | Ideia · tema · transição |
|---|---|---|---|
| 1 | 0–4,6 s | o truque psicológico que faz as pessoas confiarem em você | constelação de pessoas ligada a você por fios, coração a bater · branco · pontos |
| 2 | 4,6–6,6 s | se chama prova social | avatares que se juntam + 5 estrelas · turquesa · anéis · íris |
| 3 | 6,6–13,8 s | o cérebro odeia ser o primeiro a arriscar… a resistência some | você frio diante da barreira vermelha "risco"; comprou/elogiou/recomendou ligam-se a você, a barreira desfaz-se · névoa · chão · painel |
| 4 | 13,8–20,4 s | restaurante vazio vs. fila na porta; o da fila é melhor | duas fachadas (fria/quente), fila a chegar, prato tapado "?", você escolhe a fila · branco · grelha · cortina lateral |
| 5 | 20,4–24,8 s | o seu produto: quem comprou, teve resultado, recomenda | o produto recebe as provas por fios; medidor de confiança até 100% · turquesa profundo · anéis · íris |
| 6 | 24,8–27,7 s | não precisa falar que é bom, deixa os outros falarem por você | o seu "o meu é bom!" é riscado; o coro de recomendações liga-se a você · branco · pontos · painel |
| 7 | 27,7–29,4 s | e é aí que a venda acontece | todos os fios convergem; selo verde da venda bate como um coração · turquesa · íris |

**Mistura:** `sfxGain` = 3,8 com *ducking* automático (`src/v6/mix6.json`); cada
efeito tem a duração do próprio som e o volume é quantizado para o ffmpeg. No
clímax os efeitos ficam 3–6 dB abaixo da voz para "venda" se ouvir limpo.

```bash
npx remotion render src/index.ts Explicativo6 out/video-explicativo-6.mp4 --codec h264 --crf 16 --audio-bitrate 320k
```

---

# Vídeo 7 — "5 tipos de pessoas para evitar nos negócios" (composição `Explicativo7`)

Mesma dinâmica do vídeo 6 (fios de ligação, batimento, luz quente/fria, entradas
em arco), com **fundo cinza em vez de branco**: três superfícies novas partilhadas em
`src/v2` — `fog` (cinza claro de estúdio), `stone` (cinza médio) e `graphite`
(cinza escuro, nos dois tipos mais negativos). Cartões brancos sobressaem do cinza.
Cenas em `src/v7/`; áudio `public/narracao7.m4a` (36,40 s; voz intacta).

Motivo novo (`src/v7/Bond.tsx`): **o fio que se parte** — cada tipo de pessoa liga-se
a você; no fim do capítulo o fio fica vermelho, treme e parte-se em duas metades
que caem. No fecho, as "pessoas certas" ligam-se com fios verdes e luz quente.
Progresso 1–5 no topo: os tipos já evitados ficam a vermelho.

| # | Tempo | Narração | Ideia · tema · transição |
|---|---|---|---|
| 0 | 0–3,2 s | evite fazer negócios com esses cinco tipos de pessoas | 5 pessoas ligadas a você, números a vermelho · cinza claro · pontos |
| 1 | 3,2–8,4 s | os desesperados: decisões rápidas, acordos ruins | coração acelerado, cronómetro, empurrão, carimbo "ruim" · grafite · diagonais · íris |
| 2 | 8,4–13,8 s | os que discutem tudo: debate, nunca fecham | "Vamos fechar?" vs. "Mas… / Discordo. / E se…?", barra de fecho que nunca chega · cinza claro · grelha · painel |
| 3 | 13,8–19,0 s | amigos e família: relação pessoal + dinheiro = problema | coração que aquece, moeda que cai, coração que racha · cinza médio · anéis · cortina |
| 4 | 19,0–25,2 s | quem não te respeita: ignora limites, desvaloriza | limite tracejado atravessado, "o seu valor" de R$ 1.000 a R$ 350 · grafite · chão · íris |
| 5 | 25,2–31,1 s | os atrasados crónicos: o seu tempo e o seu trabalho | relógio a comer tempo (+40 min), lugar vazio "?", trabalho riscado · cinza claro · pautas · painel |
| 6 | 31,1–33,7 s | negócios certos começam com as pessoas certas | pessoas certas com visto verde ligam-se a você, coração calmo · cinza claro quente · zoom |
| 7 | 33,7–36,4 s | siga para mais insights que te fazem vender melhor | botão Seguir → Seguindo, insights ligados ao botão, vendas a subir · cinza médio · íris |

**Mistura:** `sfxGain` = 3,8 com *ducking* (`src/v7/mix7.json`). Os acentos nos
números dos capítulos ficam ≥ 1 dB abaixo da voz; o estalido no último fotograma
(36,35 s) faz parte do áudio original e foi mantido.

```bash
npx remotion render src/index.ts Explicativo7 out/video-explicativo-7.mp4 --codec h264 --crf 16 --audio-bitrate 320k
```
