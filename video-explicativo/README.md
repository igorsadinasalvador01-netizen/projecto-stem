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

---

# Vídeo 8 — "O truque da opção-isca" (composição `Explicativo8`)

Mesma dinâmica dos vídeos 6 e 7 (fios de ligação, batimento, fios que se partem,
entradas em arco), num **fundo e modelo dark**: superfícies `night` (carvão com brilho
turquesa) e `abyss` (turquesa quase preto), vidro fumado (`DarkCard`), turquesa
luminoso e verde/vermelho mais vivos para sinais (tokens `d4`), acabamento com grão
e vinheta escura (`Finish4`). Peças novas em `src/v8/Sweet.tsx`: cupcake ilustrado,
etiquetas de preço que balançam e focos de luz de palco.
Áudio `public/narracao8.m4a` (30,63 s; voz intacta).

| # | Tempo | Narração | Ideia · tema · transição |
|---|---|---|---|
| 1 | 0–3,0 s | o cliente compra dois produtos em vez de um | o cliente liga-se a uma caixa que se divide em duas (×2), "um" riscado · noite · pontos |
| 2 | 3,0–5,9 s | você vende cupcakes a 5 reais | cupcake sob um foco de luz, etiqueta R$ 5 a balançar · abismo · anéis · íris |
| 3 | 5,9–11,6 s | opção maior por 9; dois pequenos por 10 | palco com três focos: pequeno, grande e par · noite · chão · painel |
| 4 | 11,6–17,9 s | três escolhas: pequeno 5, grande 9, dois por 10 | menu de vidro ligado ao cliente; cada linha acende quando é dita · abismo · grelha · íris |
| 5 | 17,9–24,3 s | pouco · não vale tanto · +1 real = melhor negócio | três colunas; os fios para o pequeno e o grande partem-se, "+ R$ 1", o par acende a verde · noite · diagonais · zoom |
| 6 | 24,3–28,8 s | o truque: uma opção que existe só para escolherem o que você quer | o grande vira "isca", seta para o par, o cliente larga a isca e liga-se ao alvo · abismo · anéis · íris |
| 7 | 28,8–30,6 s | siga para mais estratégias de marketing | botão Seguir → Seguindo · noite · íris |

**Mistura:** `sfxGain` = 3,8 com *ducking* (`src/v8/mix8.json`); efeitos sempre ≥ 2,8 dB
abaixo da voz. O estalido no último fotograma (30,60 s) vem do áudio original.

```bash
npx remotion render src/index.ts Explicativo8 out/video-explicativo-8.mp4 --codec h264 --crf 16 --audio-bitrate 320k
```

---

# Vídeo 9 — "CONTEUDO A FAZER" com a estrutura do EXEMPLO (composição `Conteudo9`)

Vídeo com o rosto do autor (fala real, não só narração). Primeiro estudei o vídeo de
EXEMPLO e extraí a estrutura; depois apliquei-a ao CONTEUDO A FAZER em três modos visuais.

**Estrutura extraída do EXEMPLO:**
- gancho com o rosto e legenda palavra a palavra;
- três layouts alternados: rosto inteiro nas frases de impacto, ecrã dividido
  (gráfico + rosto num cartão) e gráfico inteiro com legenda em baixo;
- etiqueta de capítulo fixa ("PASSO 1/2/3"), aqui adaptada a cada modo;
- cortes secos sem pausas;
- CTA final sobre o rosto e cartão escuro para fechar.

**Pausas eliminadas:**
- a voz original (69,0 s) foi limpa só de silêncio verdadeiro (< −50 dB), com os limites
  do VAD Silero, e ficou com 62,8 s; o script está em `scripts/edit-v9-voz.py`;
- os saltos de imagem nos cortes ficam escondidos com *punch-in* alternado (100 % ↔ 108 %),
  e as junções entre frases levam transições e sons de entrada e saída;
- a trilha contínua (`scripts/gen-v9-audio.py`) baixa sozinha quando a voz fala.

**Voz e presença:**
- a voz foi normalizada a −15 LUFS; o rosto aparece em cerca de 36 % do vídeo (23 s de 64 s);
- o texto foi corrigido cruzando Parakeet v3 e Whisper-small;
- as palavras foram alinhadas por sílabas dentro de cada frase.

| Ato · modo | Tempo | Narração | Cenas |
|---|---|---|---|
| 1 · **Nostálgico** (VHS, papel, polaroide, lo-fi) | 0–16,4 s | o problema: falta de tempo, o processo antigo | rosto em camcorder · ideias/ampulheta/TV sem sinal · 6 cassetes (parar → publicar) · quadro de cortiça + rosto em polaroide · fita emaranhada "COMPLICADO" → ■ STOP |
| 2 · **Cinema** (2.39:1, teal & laranja, flares, drone) | 16,4–39,3 s | a virada: IA + Remotion | rosto em cinemascope · INTELIGÊNCIA ARTIFICIAL → novo processo · conhecimento/ideias/aprendizado → IA → roteiro/prompts/vídeos · "a ideia é minha" · storyboard · código Remotion → 9 vídeos · 9 vídeos em 1 dia + rosto |
| 3 · **Histórico** (P&B contrastado, pergaminho, carimbos, piano) | 39,3–64,2 s | a mensagem e o apelo | "ATENÇÃO" · retrato oval que não é substituído · mapa do conhecimento · câmara de fole e cadeira vazia · livro de contas "TRABALHAR MAIS" riscado · o rosto ganha cor em "mudar o seu processo" · siga/like/curte/compartilhe + cartão final |

```bash
# o rosto em 1080 px (não vai para o git)
ffmpeg -i public/v9/conteudo_original.mp4 -an -vf "scale=1080:-2:flags=lanczos,unsharp=5:5:0.5:5:5:0.0,format=yuv420p" -c:v libx264 -crf 15 public/v9/rosto.mp4
python scripts/gen-v9-audio.py      # trilha + efeitos novos (braam, vhs, filmburn, rec, clap)
npx remotion render src/index.ts Conteudo9 out/video-conteudo-9.mp4 --codec h264 --crf 18 --audio-bitrate 320k
```

## Vídeo 9 — versão horizontal (composição `Conteudo9H`, 1920×1080)

A mesma voz limpa (`public/v9/voz.wav`) e os mesmos tempos por palavra, com uma linguagem
moderna, realista e premium. Código em `src/v9h/`; trilha em `scripts/gen-v9h-audio.py`.

**Paleta:**
- **branco** como cenário dominante;
- **azul e cinza** destacam vídeos, miniaturas e cenas;
- **verde** só para o que é positivo (vistos, "publicado", "Você", novo processo, ligações entre pessoas);
- **vermelho** só para alertas (sem espaço, adiado, limitado, avatar recusado, "trabalhar mais" riscado);
- as legendas seguem a mesma regra: palavra ativa a azul, palavras negativas a vermelho, positivas a verde.

**Realismo:** telemóveis e portátil desenhados em detalhe, vidro, sombras suaves e profundidade.
O rosto aparece em cartões verticais (sem esticar a imagem vertical), em cerca de 38% do vídeo.

**Peças reais (sem espaços mortos):** em vez de gradientes vazios, tudo o que é "vídeo", "cena"
ou "perfil" usa material real do autor (`public/v9h`, extraído com `scripts/extract-v9h-thumbs.sh`):
- as miniaturas dos **9 vídeos já feitos**, com títulos e durações reais (lista de ideias, estúdio,
  leque do Remotion, agenda do dia, grelha do perfil, "vídeo publicado", novo processo);
- as **cenas reais do vídeo 9 vertical** no cartão "Cenas" e o próprio vídeo a correr na pré-visualização;
- **fotogramas do rosto** nas gravações, no avatar do perfil e no "avatar gerado por IA" recusado;
- o **perfil real do Instagram** recriado (@sergio_salvador10 · "IGOR SADINA| POLÍMATA", 3 publicações,
  2127 seguidores, 31 a seguir, a bio real e os botões Seguir / Mensagem / Contactar): ao tocar em
  "Seguir" passa a 2128, e "todos os dias" entram duas linhas de vídeos novos na grelha;
- o **editor de vídeo no telemóvel** (como o CapCut: pista de clipes, forma de onda, "Toque para
  adicionar legenda / música / autocolante", Editar · Áudio · Texto · Autocolantes · PiP · Efeitos);
- **cartões laterais** à volta do rosto (ideias guardadas, notificação da IA, antes → depois,
  atenção, processo atual vs. novo processo);
- **cursor realista** (seta no portátil, toque no telemóvel) com onda de clique e som de clique
  sintetizado (`scripts/gen-ui-sfx.py` → `public/sfx/click.wav`, `tap.wav`).

**Referências emocionais:**
- caderno cheio de ideias vs. "0 publicados";
- "47 ideias por gravar";
- take 7 e "video_final_v7";
- calendário sem espaço;
- ecrã de bloqueio às 23:48 com "criar conteúdo · adiado 7×";
- a esfera da IA;
- "a minha." em destaque;
- o avatar gerado recusado no visor da câmara;
- globo com mensagens de agradecimento (ilustrativas);
- a cadeira vazia diante da câmara;
- o perfil a encher-se.

| Ato | Tempo | Cenas |
|---|---|---|
| 01 · O problema | 0–16,4 s | rosto + ideias guardadas (vídeos reais) e "o meu maior problema" · caderno de ideias + telemóvel (tempo livre 0 h 15, 47 rascunhos, 0 publicados) · telemóvel no tripé (take 7) + editor no telemóvel (cortar, legendas, exportar) + "O meu processo ≈ 3 h por vídeo" · calendário da semana sem espaço + rosto · ecrã de bloqueio 23:48 + vídeos por terminar |
| 02 · A virada | 16,4–39,3 s | rosto + notificação da IA e antes → depois · esfera de IA "Inteligência artificial" + o processo reorganizado · estúdio de conteúdo no portátil (fontes e gravações reais → roteiro real, prompts, 6 vídeos reais; cursor a clicar "Gerar") · "A ideia continua a ser *a minha.*" · estrutura / roteiro / cenas reais · código Remotion ("Render") → o vídeo 9 a correr → leque dos 9 vídeos reais · agenda do dia com os 9 vídeos + rosto |
| 03 · A mensagem | 39,3–64,2 s | rosto + "Atenção" e "a tua imagem continua a ser tua" · visor de câmara: avatar gerado recusado, "Você ✓", imagem / voz / ideias · globo de pessoas ligadas · cadeira vazia + "vídeo publicado" (miniatura real) · conhecimento ✓ / tempo limitado / trabalhar mais ✕ · rosto + processo atual → novo processo · perfil real @sergio_salvador10: seguir (+1), novos vídeos, like, curte, compartilhe · despedida com o @ |

```bash
bash scripts/extract-v9h-thumbs.sh   # peças reais (public/v9h)
python scripts/gen-v9h-audio.py      # trilha
python scripts/gen-ui-sfx.py         # clique + toque (e picos em src/v9h/mixH.json)
npx remotion render src/index.ts Conteudo9H out/video-conteudo-9-horizontal.mp4 --codec h264 --crf 16 --audio-bitrate 320k
```

---

# Vídeo 10 — "O efeito isca: parecer mais barato" (composição `Explicativo10`)

Mesmos critérios dos vídeos anteriores (voz intacta, animação palavra a palavra, efeitos
por baixo da voz), com uma **paleta nova**: branco premium dominante, cinzas de estúdio,
**azul-turquesa** como cor herói (só o produto que você quer vender), **preto em minoria**
(tinta do texto, "VS", botão Seguir e o instante do "truque") e **cores vivas** só nos
detalhes que mandam: coral = retirar / isca, âmbar = truque / benefício principal,
verde-lima = escolha e ganho, violeta = psicologia.
Áudio `public/narracao10.m4a` (29,28 s, voz intacta; o grave dos 20,35 s em
"comparar, vai pensar" é do próprio áudio e vira o momento de impacto). Código em `src/v10/`.

**Um palco contínuo** (0–23,6 s): os mesmos dois cartões evoluem com a voz, em vez de
cenas soltas — o produto nasce sozinho, a segunda opção nasce tracejada ao lado, os
benefícios entram, os principais da opção barata caem para a bandeja "retirados", o
cartão é içado por uma linha de pesca e leva o carimbo "ISCA", o cliente compara
(olhos esquerda/direita, "VS") e escolhe. A câmara aproxima-se da opção barata ao retirar
e da escolhida no fim; o grave dá um *punch*.

| # | Tempo | Narração | Ideia |
|---|---|---|---|
| 1 | 0–4,2 s | parecer mais barato usando psicologia | o produto (capa + R$ 197) sozinho; medidor "percepção de preço" de caro para barato; cérebro violeta |
| 2 | 4,2–9,3 s | crie uma segunda opção com preço um pouco menor | a opção B nasce tracejada; preço 197 → 167 a contar; "− R$ 30"; barras de diferença; anel turquesa "o que você quer vender" |
| 3 | 9,3–12,8 s | liste os benefícios principais e secundários | as capas recolhem; 3 principais (★) e 3 secundários nos dois cartões; legenda |
| 4 | 12,8–13,8 s | aqui vem o truque | o único instante a preto: íris que abre e fecha, "truque." em âmbar |
| 5 | 13,8–16,7 s | retire os principais benefícios da opção mais barata | zoom na opção B; cada principal é riscado, cai e deixa um lugar "retirado"; 6 → 3 benefícios |
| 6 | 16,7–19,3 s | vira uma isca ruim de propósito | linha de pesca e anzol içam o cartão, que balança; carimbo "ISCA", "ruim de propósito" |
| 7 | 19,3–21,2 s | quando o cliente comparar, vai pensar | o cliente aparece, os olhos comparam, "VS"; punch no grave; balão a pensar |
| 8 | 21,2–23,6 s | por um pouco mais, eu levo muito mais benefícios | "+ R$ 30 → 2× benefícios"; o pensamento palavra a palavra; "Escolhido" |
| 9 | 23,6–25,0 s | é o efeito isca | a etiqueta da opção B pendurada no anzol; "efeito *isca.*"; definição |
| 10 | 25,0–27,0 s | psicologia pura aplicada nas vendas | cérebro com sinapses, feixe até ao gráfico de vendas a subir |
| 11 | 27,0–29,9 s | siga para mais dicas valiosas de marketing | o perfil original do Instagram (captura sem alterações) com o toque em "Seguir"; por baixo, 3 vídeos de dicas já publicados |

**Mistura:** `sfxGain` = 3,8 com *ducking* (`src/v10/mix10.json`, gerado com
`scripts/gen-mix.py`); nenhum efeito sobre o grave original.

```bash
python scripts/gen-mix.py public/narracao10.m4a src/v10/mix10.json 29.9
npx remotion render src/index.ts Explicativo10 out/video-explicativo-10.mp4 --codec h264 --crf 16 --audio-bitrate 320k
```

**Fecho padrão com o perfil:** `src/components/PerfilFinal.tsx` (`PerfilCard`) mostra a captura
**original** do perfil @sergio_salvador10 (`public/perfil/perfil.png`, com a foto de fundo laranja),
sem qualquer alteração — por cima entra só a animação do toque em "Seguir" (dedo, onda e brilhos).
É o fecho de todos os vídeos com "siga"; trocar esse ficheiro atualiza-os todos.

---

# Vídeo 11 — "O efeito isca", versão cobalto (composição `Explicativo11`)

O ficheiro enviado tem **exatamente o mesmo áudio do vídeo 10** (byte a byte; só muda o fundo
da imagem), por isso usa `public/narracao10.m4a`, os mesmos tempos (`src/v10/timeline10.ts`) e
a mesma margem de mistura (`src/v10/mix10.json`). Mesma dinâmica do vídeo 10 (palco contínuo
com as duas opções), com **cores novas** e a **nostalgia só em dois momentos**:

- **Paleta moderna** (`src/v11/look11.ts`): branco e cinza frio dominantes, **azul-cobalto** como
  cor herói (o produto que você quer vender), tinta quase preta em minoria e cores vivas nos
  detalhes — laranja vivo = retirar/isca, amarelo = truque/benefício principal,
  verde-esmeralda = escolha e ganho, magenta = psicologia.
- **Os dois únicos momentos nostálgicos**, com película (grão, pó, cintilação, fuga de luz),
  papel envelhecido e som de época (projetor, película, papel):
  1. "Aqui vem o truque." — intertítulo de cinema mudo com moldura ornamentada (12,8–13,8 s);
  2. "É o efeito isca." — página de dicionário antigo com a etiqueta da opção B no anzol
     e a definição (23,6–25,0 s).
- Fecho com o **perfil original** (captura sem alterações), sem filtros por cima.

```bash
npx remotion render src/index.ts Explicativo11 out/video-explicativo-11.mp4 --codec h264 --crf 16 --audio-bitrate 320k
```

# Vídeos 12–16 — primeiro lote de 5 (kit partilhado `src/kit/`)

Cada vídeo tem animações e modelos diferentes, mas a mesma gramática: narração original
intacta, legendas palavra a palavra, títulos cinéticos, vidro premium e o **fecho com o perfil
original** (`public/perfil/perfil.png`, sem filtros por cima).

**Padrão de cores da série** (pedido do cliente, vale para todos os vídeos, `src/kit/serie.ts`):
fundos **azul-escuro**, **branco**, acento **azul-turquesa**, **cinza** para o secundário,
**vermelho** para falas/sinais negativos e **verde** para positivos. Nada de rosa/roxo nem cores
exageradas; cenários limpos e fáceis de ler. **Sem gráficos a exemplificar animais**: quando a
narração usa uma metáfora (vaca, leão), a imagem mostra o que ela significa no mundo das vendas.

| Vídeo | Formato | Modelo | Fontes | 3D |
|---|---|---|---|---|
| 12 — "O que você não quer?" (`Video12`) | 1080×1920 | vidro fumado sobre azul-escuro, perguntas e listas | Syne + Manrope | "?" de vidro turquesa em three.js |
| 13 — "Herbívoro vs carnívoro" (`Video13`) | 1920×1080 | o mundo das vendas: caixa de entrada que o marketing enche, comissão a cair, lista de prospecção com o alvo do dia, carteira esgotada → mercado novo, ligações, reação do mercado, contrato high ticket | Fraunces + Space Grotesk | — |
| 14 — "Vender qualquer coisa" (`Video14`) | 1080×1920 | roteiro de vendas, parâmetros, característica → benefício → vantagem | Unbounded + Manrope | carrossel com 8 produtos modelados |
| 15 — "5 palavras proibidas" (`Video15`) | 1920×1080 | cartas editoriais: evite (escura, vermelho) → use (branca, verde) | Playfair Display + Manrope | cartas que viram e leque |
| 16 — "Chutar pro gol" (`Video16`) | 1080×1920 | placar, metas e remates | Bebas Neue + Sora | relvado, baliza com rede e bola |

- **Kit** (`src/kit/Kit.tsx`): relógio em segundos (`useClock`), fundos mesh, `Glass`, legendas,
  `Kinetic`, entradas de cena, `SfxTrack` e `ProfileOutro`. Fontes locais em `public/fonts`
  (`src/kit/fonts2.ts`, licença OFL).
- **Mistura com cadeia lateral**: `scripts/gen-mix.py` grava, por fotograma, a margem livre e o
  nível da voz; o `SfxTrack` mantém cada efeito ~4 dB abaixo da voz durante a fala (antecipa
  100 ms) e só deixa subir nos silêncios. Efeitos Kenney (CC0) em `public/sfx/k_*.wav`.
- **Verificação**: `node scripts/stills.mjs <bundle> <Comp> <pasta> 0.5 <seg>…` renderiza
  fotogramas de controlo com um só navegador; `scripts/check-audio.py <narração> <vídeo>`
  confirma atraso 0 ms, sem saturação nova, ganho da voz ≈ 1 e a voz sempre acima dos efeitos.
- O vídeo 15 já pede "siga o meu perfil" na narração (50,6 s): o fecho entra aí e ocupa o
  silêncio final; nos outros, o fecho tem 3,6 s depois da narração.

```bash
npx remotion bundle src/index.ts --out-dir /tmp/bundle
for n in 12 13 14 15 16; do
  npx remotion render /tmp/bundle Video$n out/video-$n.mp4 --codec h264 --crf 17 --audio-bitrate 320k --gl=angle
done
```

# Vídeo 17 — "Vender valor na construção" (composição `Video17`, 1080×1920)

Filmagem do próprio cliente (vertical, 464×832 a 60 fps) editada com o **modelo extraído por
engenharia reversa** de um vídeo de referência no estilo "editando ao vivo".

**Modelo da referência** (plano único, sem cortes; tudo por camadas):
1. HUD fixo no canto: ponto vermelho "AO VIVO", timecode com fotogramas, contador de etapas
   (05/13) e o nome da etapa; @ e ícone do Instagram no canto oposto.
2. Legendas curtas (3–5 palavras) com a palavra-chave destacada.
3. Profundidade: objetos 3D a passar **atrás** do apresentador (recorte da pessoa).
4. A cena separa-se em **camadas de vidro** em perspetiva (fundo · gráficos · pessoa), com rótulos.
5. **Modo moldura**: o apresentador encolhe para uma moldura com crachá e o resto do ecrã mostra
   conteúdo editorial (passos numerados, checklist, objetos 3D). *Não usado aqui (ver abaixo).*
6. Volta ao ecrã inteiro; **ecrãs/tiles 3D a flutuar**; **casa 3D explodida** por andares com
   etiquetas e depois remontada; CTA final (comentar + direct).

**O que foi melhorado na edição do cliente**:
- Recorte da pessoa com Robust Video Matting (`scripts/matte-footage.py`): `public/v17/plate.mp4`
  + `public/v17/fg.webm` (VP9 com transparência); os gráficos passam entre os dois.
- **Regra do cliente: o fundo do vídeo nunca é tapado por cor.** A filmagem fica sempre no ecrã
  inteiro e com a cor natural. Em vez do modo moldura da referência, o conteúdo vive na faixa de
  cima (por cima do capacete, por baixo do HUD) em vidro escuro e passa por trás da cabeça.
  Vermelho e verde aparecem só como bordas finas, e a separação em camadas usa a própria
  filmagem desfocada à volta.
- Subida para 1080×1920 a 30 fps com nitidez; HUD com 10 capítulos da própria fala.
- **Ritmo sem pausas mortas** (`scripts/cut-pauses.py`): mede o silêncio da fala e encurta cada
  pausa (>= 0,18 s fica com 0,10 s; as de respiração >= 0,45 s ficam com 0,16 s). A filmagem, o
  recorte e a narração são cortados nos mesmos fotogramas (33 cortes, 64,3 s → 57,0 s). Cada corte
  maior muda o enquadramento (punch-in 1,00 / 1,08 / 1,03 / 1,12) para esconder o salto, com um
  avanço lento dentro de cada plano. Todas as marcas continuam no tempo original da fala e
  `src/v17/cuts17.ts` converte-as para a montagem (cenas, legendas e efeitos sonoros).
- 3D de vidro turquesa com transparência real (three.js, `src/v17/Building3D.tsx`): prédio de
  vidro e prédio de betão por cima do capacete ("obra excelente" → "perdeu a obra"), "?" de vidro,
  e um prédio atrás do ombro que explode em andares com o **valor entregue** e se remonta em
  "transformar".
- **Som** (`scripts/gen-v17-audio.py`, tudo sintetizado): música de fundo própria a 100 BPM (pad,
  sub, kick, hats, arpejo) com secções que seguem a história e ducking à voz já aplicado (fica
  ~15 dB abaixo da fala, sobe nas pausas, fecha no "é aqui que falham"); sons de entrada que
  acabam mesmo antes de cada frase (cobrem as pausas); gatilhos: sub-grave, glitch, PB, volta da
  cor, riser e impacto cinematográfico.
- **Destaque da fala** (`src/v17/Fx17.tsx`): **PB** nos momentos de falha (perder, apenas
  construção, é aqui que falham → esquecem-se); a cor volta no "valor" num círculo a partir do
  rosto; **falhas** (glitch com bandas deslocadas e separação RGB) nas viragens e palavras-chave;
  zoom curto e tremor de impacto; legendas com a palavra ativa realçada e as palavras-chave maiores.
- **8 efeitos** (`src/v17/Effects17.tsx`), cada um no momento da fala que lhe assenta (o HUD mostra
  "FX nn · nome" enquanto estão ativos): 01 **orbit** (etiquetas a girar à volta do capacete, atrás
  e à frente) em "obras excelentes"; 06 **phone mockup** (telemóvel 3D com as duas propostas a
  chegar) em "dois empreendedores"; 07 **checklist** (caixas a marcar com o visto desenhado) na
  proposta B; 05 **digital zoom** (zoom em degraus com visor) em "quem tu achas…"; 03 **ui world**
  (widgets de segurança, cronograma e notificação a flutuar) em "segurança, previsibilidade e
  tranquilidade"; 04 **frame break** (moldura vermelha atrás, a cabeça a sair dela, estilhaços)
  em "é aqui que falham"; 02 **quote wall** (parede de citações) em "guarda isto"; 08 **headline
  wall** (linhas de títulos a correr por trás) em "compra aquilo que acredita… transformar".
- Falhas e gatilhos alinhados ao arranque real das palavras (medido no áudio, não na transcrição);
  sons de falha suaves e música mais baixa: a voz fica ~19 dB acima de tudo.
- Animações: ícones desenhados nas propostas e no valor, medidores de confiança (31 % · 87 %),
  reflexo de luz a passar no vidro, palavras grandes a entrar letra a letra, linha do tempo de
  edição no HUD.
- Paleta: branco, cinza, turquesa e azul alternados; **vermelho** nas cenas de atenção
  ("perder", "é aqui que falham"); **verde** para validação (checks, confiança, transformar).
- Fecho com o **perfil original** (captura sem filtros) a subir por cima do colete, com seguir,
  like e partilhar ao ritmo da fala; a filmagem fica parada no último fotograma nos 2 s finais.

```bash
# public/v17/ não vai para o git (filmagem do cliente, ~117 MB): regenera-se com
python scripts/matte-footage.py <video.mp4> rvm_mobilenetv3_fp32.onnx public/v17
python scripts/cut-pauses.py public/narracao17.m4a public/v17/plate.mp4 public/v17/fg.webm public/v17 src/v17/cuts17.json --min 0.18 --keep 0.10 --long 0.45 --keep-long 0.16 --narr-out public/narracao17c.m4a
python scripts/gen-v17-audio.py sfx
python scripts/gen-v17-audio.py bed public/narracao17c.m4a src/v17/cuts17.json public/bed17.m4a 59.0
python scripts/gen-mix.py public/narracao17c.m4a src/v17/mix17.json 59.0
npx remotion render src/index.ts Video17 out/video-17.mp4 --codec h264 --crf 17 --audio-bitrate 320k --gl=angle
```


# Vídeo 18 — "Medir antes de vender" (composição `Video18`, 1080×1920)

Segunda filmagem do cliente (464×832, 83 s), editada com a **dinâmica do vídeo de referência**
(criador de conteúdo sobre IA): cartões brancos de app com sombra, texto forte + *itálico
serifado*, etiquetas mono em maiúsculas, destaque azul, cartões escuros em azul-marinho,
entradas em "pop" (escala + desfoque), listas que se marcam, conversa no telemóvel, riscos
vermelhos no "não", modo cartão (o cliente grande num cartão de borda azul), legendas de 1–3
palavras com a palavra ativa num bloco azul e as palavras-chave em itálico serifado maiúsculo.
**O cliente aparece sempre**, em simultâneo com os motions (sem cenas só de gráficos e sem
fundos de cor: no modo cartão, à volta fica a própria filmagem desfocada).

- Transcrição em português com Whisper turbo (sherpa-onnx) + tempos palavra a palavra do
  Parakeet, alinhados por semelhança (`scratchpad/asr-py/align_words.py`) → `src/v18/words18.json`.
- Recorte da pessoa (RVM), 37 pausas cortadas (83,4 s → 75,2 s), zoom alternado nos cortes.
- **8 efeitos** (`src/v18/Effects18.tsx`), cada um no momento certo da fala:
  01 orbit (gancho: medições · obra · vendas · dinheiro à volta do boné; em "perder" cai) ·
  07 checklist (como medir uma obra, 6 passos com visto desenhado) · 06 phone mockup (conversa
  com o cliente: o que precisa e que problema quer resolver) · 03 ui world (o que impede a
  decisão: orçamento, prazo, confiança, decisão pendente) · 04 frame break (solução perfeita
  para o problema errado, em PB, com a cor a voltar num círculo) · 05 digital zoom (o
  diagnóstico: visor, linha de varrimento, foco) · 02 quote wall (parede de perguntas) ·
  08 headline wall (compreender · resolver · perguntar).
- Som como na referência: música de fundo própria (secções em `src/v18/bed18.json`), "pop" em
  cada elemento, cliques nos vistos, teclas na conversa, "shu" quase inaudível nas transições,
  graves suaves nas palavras-chave; a voz fica ~20 dB acima de tudo.
- Fecho com o perfil original (sem filtros) + gostar, seguir, partilhar na própria fala.

```bash
python scripts/matte-footage.py <video.mp4> rvm_mobilenetv3_fp32.onnx public/v18
python scripts/cut-pauses.py public/narracao18.m4a public/v18/plate.mp4 public/v18/fg.webm public/v18 src/v18/cuts18.json --min 0.18 --keep 0.10 --long 0.45 --keep-long 0.16 --narr-out public/narracao18c.m4a
python scripts/gen-mix.py public/narracao18c.m4a src/v18/mix18.json 77.25
python scripts/gen-v17-audio.py bed public/narracao18c.m4a src/v18/cuts18.json public/bed18.m4a 77.25 src/v18/bed18.json
npx remotion render src/index.ts Video18 out/video-18.mp4 --codec h264 --crf 17 --gl=angle
npx remotion render src/index.ts Video18Audio a18.wav --codec wav   # mistura final (+6 dB com limitador a -1 dB)
```

# Vídeo 19 — edição cinematográfica de ginásio (composição `Video19`, 1080×1920, 30 fps)

Filmagem de treino sem fala (576×1024, 58 s, 5 clipes com transições já gravadas pelo telemóvel).
Edição em estilo anúncio atlético / videoclipe: escuro, premium, minimalista, **ao ritmo da música**.

- **Análise**: cortes de origem por diferença de histograma e nitidez (só se usam os intervalos
  limpos, sem as transições gravadas); picos de cada repetição (topo da rosca, bloqueio do
  press, extensão no cabo) por fluxo ótico integrado. Os picos caem nas batidas.
- **Planos** (`src/v19/edit19.json`, em batidas de 140 BPM): cada plano tem uma curva de tempo
  (PCHIP monótona) → speed ramps suaves, câmara lenta, freeze frames. Estrutura: gancho (5 picos,
  ~3 s) → título → build-up com planos longos → meia batida de preto → drop → freeze com
  "NO EXCUSES." → clímax com cortes a cada meia batida → freeze final no bloqueio do press.
- **Câmara lenta**: interpolação a 60 fps por compensação de movimento (minterpolate) por clipe;
  na composição, mistura de fotogramas vizinhos (lento) e obturador de ~270° quando a velocidade
  sobe (desfoque de movimento natural).
- **Gradação** (`scripts/grade-gym.py`): recorte da pessoa (RVM) só para graduar à parte — fundo
  ~0,6 stop abaixo, mais frio e menos saturado; pele natural e micro-contraste suave no sujeito;
  sombras neutras/frias, pretos profundos com detalhe, altas luzes contidas. Vinheta e grão subtis.
- **Movimento**: punch-ins nos picos, tremor controlado só nos impactos, whips com desfoque
  direcional, zoom-through, flash curto no drop e no clímax, mergulho em preto no título.
- **Texto**: só três momentos, Inter Tight em maiúsculas espaçadas; "DISCIPLINE." e
  "NO EXCUSES." passam por trás do corpo (recorte em `public/v19/*_fg.webm`). Sem marca inventada.
- **Música e SFX originais** (`scripts/gen-v19-audio.py`, sintetizados, sem licenças de terceiros):
  phonk / trap cinematográfico em Fá menor — 808 saturado com slides, kick, clap em meio-tempo,
  hats com rolos, cowbell melódico, pad escuro, sino FM no build; impactos graves, golpes de grave
  nos picos, whooshes de ar (sem tom) nos whips, risers de ruído (sem sirene). Master a −14 LUFS,
  pico −1 dBFS. O som original do ginásio não é usado (tinha música de fundo de terceiros).

```bash
# 1) graduar + interpolar cada clipe limpo (fotogramas de origem fa–fb)
for c in "A 0 389" "B 401 857" "C 871 1223" "D 1235 1437" "E 1449 1751"; do set -- $c
  python scripts/grade-gym.py clip public/v19/src.mp4 rvm_mobilenetv3_fp32.onnx $1 $2 $3 public/v19 & done; wait
# 2) contagens reais + recortes para o texto por trás do corpo
scripts/fg-v19.sh
# 3) música + SFX a partir da montagem
python scripts/gen-v19-audio.py a19.wav && ffmpeg -i a19.wav -c:a aac -b:a 256k public/audio19.m4a
# 4) render (o áudio final é o wav, multiplexado sem recodificar o vídeo)
npx remotion render src/index.ts Video19 out/v19-video.mp4 --codec h264 --crf 16 --gl=angle --muted
ffmpeg -i out/v19-video.mp4 -i a19.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest out/video-19.mp4
```
