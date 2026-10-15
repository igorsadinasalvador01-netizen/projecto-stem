// Engenharia reversa do áudio do vídeo 10 (narracao10.m4a, 29,28 s) — "o efeito isca"
// para fazer o produto parecer mais barato. Tempos por palavra do Parakeet v3.
// Uma pausa real (8,8–9,3 s) e um grave no próprio áudio (19,9–20,9 s, pico 20,35 s)
// em "comparar, vai pensar" — fica intacto e vira o momento de impacto.

export const AUDIO10_SECONDS = 29.279;
// 0,6 s de respiração no fim para o apelo final não acabar seco
export const TOTAL10 = 29.9;

export const W10 = {
  // 1 · gancho
  seu: 1.04,
  produto: 1.28,
  servico: 1.76,
  parecer: 2.16,
  mais: 2.64,
  barato: 2.8,
  usando: 3.2,
  psicologia: 3.52,
  // 2 · segunda opção
  crie: 4.24,
  uma: 4.64,
  segunda: 4.8,
  opcao: 5.12,
  com: 5.36,
  preco: 5.6,
  um: 6.0,
  pouco: 6.08,
  menor: 6.24,
  produto2: 6.8,
  voce: 7.36,
  realmente: 7.6,
  quer: 8.08,
  vender: 8.32,
  // 3 · benefícios
  agora: 9.3,
  liste: 9.68,
  os: 10.24,
  beneficios: 10.32,
  principais: 10.88,
  e: 11.28,
  secundarios: 11.44,
  cada: 12.08,
  opcao2: 12.32,
  // 4 · o truque
  aqui: 12.8,
  vem: 12.96,
  o: 13.2,
  truque: 13.28,
  // 5 · retirar
  retire: 13.84,
  os2: 14.32,
  principais2: 14.48,
  beneficios2: 14.88,
  da: 15.52,
  opcao3: 15.68,
  mais2: 16.08,
  barata: 16.24,
  // 6 · isca
  a: 16.72,
  opcao4: 16.88,
  barata2: 17.2,
  vira: 17.52,
  uma2: 17.84,
  isca: 18.0,
  ruim: 18.32,
  de: 18.64,
  proposito: 18.72,
  // 7 · comparar
  quando: 19.28,
  o2: 19.52,
  cliente: 19.6,
  comparar: 19.92,
  boom: 20.35,
  vai: 20.48,
  pensar: 20.72,
  // 8 · por um pouco mais
  por: 21.2,
  um2: 21.44,
  pouco2: 21.52,
  mais3: 21.76,
  eu: 22.08,
  levo: 22.24,
  muito: 22.64,
  mais4: 22.88,
  beneficios3: 23.04,
  // 9 · efeito isca
  e2: 23.68,
  o3: 23.84,
  efeito: 23.92,
  isca2: 24.24,
  // 10 · psicologia
  psicologia2: 24.96,
  pura: 25.6,
  aplicada: 25.92,
  nas: 26.4,
  vendas: 26.56,
  // 11 · siga
  siga: 27.04,
  para: 27.44,
  mais5: 27.6,
  dicas: 27.84,
  valiosas: 28.16,
  de2: 28.64,
  marketing: 28.8,
};

export const SCENES10 = {
  palco: { from: 0, to: 23.62 }, // o mesmo palco do gancho até à escolha
  efeito: { from: 23.62, to: 24.96 },
  psico: { from: 24.96, to: 27.04 },
  siga: { from: 27.04, to: TOTAL10 },
};
