// Engenharia reversa do áudio do vídeo 6 (narracao6.m4a, 29,43 s).
// Parakeet v3 e Whisper-small concordam; sem "boom" nem silêncio final:
// o clímax é a própria frase "e é aí que a venda acontece" (27,6–29,3 s).

export const AUDIO6_SECONDS = 29.433333;

export const W6 = {
  // 1
  voce: 0.0,
  sabe: 0.24,
  qual: 0.48,
  truque: 0.88,
  psicologico: 1.2,
  faz: 1.84,
  pessoas: 2.16,
  confiarem: 2.4,
  em: 2.88,
  voce2: 3.04,
  sem: 3.36,
  pensar: 3.52,
  duas: 3.84,
  vezes: 4.16,
  // 2
  se: 4.56,
  chama: 4.8,
  prova: 5.2,
  social: 5.6,
  // 3
  cerebro: 6.72,
  humano: 7.2,
  odeia: 7.52,
  primeiro: 8.24,
  arriscar: 8.56,
  mas: 9.12,
  quando: 9.28,
  ve: 9.6,
  outros: 9.92,
  ja: 10.16,
  compraram: 10.32,
  elogiaram: 10.8,
  recomendaram: 11.68,
  resistencia: 12.48,
  some: 13.04,
  // 4
  exemplo: 13.84,
  entra: 14.4,
  restaurante: 14.88,
  vazio: 15.36,
  outro: 16.16,
  fila: 16.56,
  porta: 16.96,
  mesmo: 17.28,
  provar: 17.68,
  comida: 18.08,
  acredita: 18.8,
  daFila: 19.52,
  melhor: 19.92,
  // 5
  mesmo2: 20.4,
  produto: 21.04,
  mostra: 21.44,
  comprou: 22.24,
  teve: 22.96,
  resultado: 23.28,
  recomenda: 24.08,
  // 6
  nao: 24.72,
  precisa: 24.88,
  falar: 25.2,
  bom: 25.76,
  deixa: 26.08,
  outros2: 26.56,
  falarem: 26.8,
  porVoce: 27.28,
  // 7
  e: 27.6,
  ai: 27.84,
  venda: 28.32,
  acontece: 28.64,
} as const;

export const SCENES6 = {
  confianca: { from: 0, to: 4.62 },
  prova: { from: 4.4, to: 6.62 },
  resistencia: { from: 6.4, to: 13.8 },
  restaurante: { from: 13.56, to: 20.36 },
  produto: { from: 20.1, to: 24.84 },
  coro: { from: 24.6, to: 27.72 },
  venda: { from: 27.46, to: AUDIO6_SECONDS },
} as const;
