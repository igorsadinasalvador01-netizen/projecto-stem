// Engenharia reversa do áudio do vídeo 5 (narracao5.m4a, 24,06 s).
// Parakeet v3 e Whisper-small concordam palavra a palavra.
// Mistura mais "quente": música alta (~-20 dB) e voz a ~-13 dB, sem silêncios internos.

export const AUDIO5_SECONDS = 24.055873;

export const HITS5 = {
  voiceEnd: 20.0,
  boom: 20.04,
  silenceFrom: 21.0,
} as const;

export const W5 = {
  // 1
  quer: 0.0,
  saber: 0.4,
  um: 0.64,
  segredo: 0.8,
  sobre: 1.28,
  comecar: 1.52,
  no: 2.0,
  digital: 2.24,
  // 2
  voce: 3.6,
  nunca: 3.92,
  vai: 4.32,
  se: 4.56,
  sentir: 4.72,
  cem: 5.04,
  pronto: 5.76,
  // 3
  sempre: 6.56,
  vai2: 7.04,
  existir: 7.28,
  algo: 7.68,
  novo: 7.92,
  para: 8.24,
  aprender: 8.4,
  // 4
  as: 9.28,
  pessoas: 9.6,
  que: 9.92,
  fazem: 10.08,
  a: 10.48,
  primeira: 10.56,
  venda: 10.96,
  nao: 11.36,
  sao: 11.52,
  aquelas: 11.68,
  que2: 12.08,
  sabem: 12.24,
  tudo: 12.64,
  // 5
  sao2: 13.12,
  aquelas2: 13.36,
  comecam: 14.0,
  corrigem: 14.88,
  os: 15.52,
  erros: 15.68,
  e: 16.16,
  continuam: 16.4,
  melhorando: 16.96,
  // 6
  a2: 17.76,
  experiencia: 17.92,
  vem: 18.48,
  depois: 18.8,
  da: 19.12,
  acao: 19.28,
} as const;

export const SCENES5 = {
  segredo: { from: 0, to: 3.46 },
  pronto: { from: 3.3, to: 6.66 },
  aprender: { from: 6.44, to: 9.24 },
  venda: { from: 9.04, to: 13.2 },
  filme: { from: 13.0, to: 17.84 },
  acao: { from: 17.64, to: 20.6 },
  outro: { from: 20.36, to: AUDIO5_SECONDS },
} as const;
