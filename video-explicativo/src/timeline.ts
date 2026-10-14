// Engenharia reversa do áudio original (narracao.m4a, 24,06 s).
// Tempos em segundos, extraídos com reconhecimento de fala (Parakeet v3)
// e afinados pelo envelope de energia do áudio.

export const AUDIO_SECONDS = 24.055873;

// Momentos de impacto já presentes na mistura original.
export const HITS = {
  hookImpact: 3.44, // impacto grave depois de "dias?"
  boom: 20.04, // "boom" subgrave depois de "tentativa."
  silenceFrom: 21.1, // silêncio digital até ao fim
} as const;

// Palavra -> instante em que começa a ser dita.
export const W = {
  // Cena 1 — gancho
  quer: 0.0,
  saber: 0.32,
  o: 0.64,
  segredo: 0.72,
  de: 1.12,
  quem: 1.28,
  faz: 1.6,
  vendas: 1.84,
  todos: 2.32,
  os: 2.56,
  dias: 2.8,

  // Cena 2 — começo do zero
  eles: 4.0,
  comecaram: 4.4,
  sem1: 5.2,
  experiencia: 5.52,
  sem2: 6.96,
  seguidores: 7.28,
  sem3: 8.4,
  dinheiro: 8.8,

  // Cena 3 — a diferença
  a1: 9.92,
  diferenca: 10.16,
  e: 10.96,
  que: 11.12,
  eles2: 11.28,
  nao: 11.52,
  desistiram: 11.68,
  quando: 12.4,
  ninguem: 12.64,
  assistia: 12.96,
  aos: 13.52,
  videos: 13.68,
  deles: 14.16,

  // Cena 4 — a primeira venda
  a2: 15.04,
  sua1: 15.28,
  primeira: 15.6,
  venda: 16.0,
  pode: 16.56,
  estar: 16.88,
  escondida: 17.2,
  atras: 17.84,
  da: 18.16,
  sua2: 18.32,
  proxima: 18.64,
  tentativa: 19.04,
} as const;

// Fronteiras das cenas (s). Sobreposições curtas permitem transições.
export const SCENES = {
  hook: { from: 0, to: 3.92 },
  zero: { from: 3.72, to: 9.94 },
  diferenca: { from: 9.84, to: 14.98 },
  venda: { from: 14.9, to: AUDIO_SECONDS },
} as const;

export const sec = (s: number, fps: number) => Math.round(s * fps);
