// Engenharia reversa do áudio do vídeo 4 (narracao4.m4a, 31,46 s).
// Parakeet v3 e Whisper-small concordam palavra a palavra.
import { c2, Pattern, Surface } from "../v2/theme2";

export const AUDIO4_SECONDS = 31.463016;

export const HITS4 = {
  voiceEnd: 26.7,
  boom: 27.46, // "boom" subgrave depois de "crescendo."
  silenceFrom: 28.28,
} as const;

export const W4 = {
  // 1
  voce: 0.0,
  sabe: 0.32,
  porQue: 0.56,
  a: 0.88,
  primeira: 0.96,
  venda: 1.2,
  e: 1.52,
  tao: 1.68,
  importante: 1.92,
  no: 2.16,
  marketing: 2.32,
  digital: 2.88,
  // 2
  porque: 3.92,
  ela: 4.32,
  prova: 4.56,
  para: 4.96,
  voce2: 5.2,
  mesmo: 5.44,
  que: 5.76,
  e2: 6.0,
  possivel: 6.16,
  // 3
  noComeco: 7.04,
  comeco: 7.28,
  ninguem: 7.92,
  comeca: 8.32,
  sabendo: 8.8,
  criar: 9.2,
  conteudo: 9.6,
  perfeito: 10.08,
  ou: 10.72,
  entender: 11.04,
  tudo: 11.52,
  sobre: 11.76,
  vendas: 12.0,
  // 4
  voce3: 12.8,
  aprende: 13.04,
  errando: 13.6,
  testando: 14.4,
  e3: 15.04,
  melhorando: 15.28,
  todos: 16.0,
  os: 16.32,
  dias: 16.56,
  // 5
  a2: 17.36,
  primeira2: 17.52,
  venda2: 17.92,
  nao: 18.32,
  muda: 18.48,
  apenas: 18.8,
  sua: 19.2,
  conta: 19.44,
  bancaria: 19.76,
  ela2: 20.56,
  muda2: 20.8,
  sua2: 21.12,
  mentalidade: 21.36,
  // 6
  voce4: 22.4,
  percebe: 22.72,
  todo: 23.44,
  esforco: 23.68,
  valeu: 24.08,
  pena: 24.64,
  voce5: 25.36,
  pode: 25.6,
  continuar: 25.92,
  crescendo: 26.4,
} as const;

export const SCENES4 = {
  hook: { from: 0, to: 3.92 },
  prova: { from: 3.7, to: 7.1 },
  comeco: { from: 6.86, to: 12.86 },
  aprende: { from: 12.62, to: 17.44 },
  mentalidade: { from: 17.2, to: 22.46 },
  cresce: { from: 22.22, to: 28.4 },
  outro: { from: 28.16, to: AUDIO4_SECONDS },
} as const;

// Versão "um pouco dark": superfícies escuras, cada cena com o seu padrão.
export const sceneThemes4 = {
  hook: { surface: "night", pattern: "dots" },
  prova: { surface: "abyss", pattern: "rings" },
  comeco: { surface: "night", pattern: "grid" },
  aprende: { surface: "abyss", pattern: "diagonal" },
  mentalidade: { surface: "night", pattern: "ledger" },
  cresce: { surface: "abyss", pattern: "floor" },
  outro: { surface: "deep", pattern: "none" },
} as const satisfies Record<string, { surface: Surface; pattern: Pattern }>;

// Cores de sinal mais luminosas para fundo escuro.
export const d4 = {
  text: c2.white,
  dim: "rgba(255,255,255,0.66)",
  faint: "rgba(255,255,255,0.40)",
  turq: "#2FD0D4",
  turqSoft: "rgba(47,208,212,0.16)",
  green: "#3DDC84",
  greenSoft: "rgba(61,220,132,0.15)",
  greenGlow: "rgba(61,220,132,0.35)",
  red: "#FF5A5F",
  redSoft: "rgba(255,90,95,0.15)",
  redGlow: "rgba(255,90,95,0.32)",
  glass: "rgba(255,255,255,0.06)",
  glassStrong: "rgba(255,255,255,0.10)",
  stroke: "rgba(255,255,255,0.12)",
  strokeStrong: "rgba(255,255,255,0.22)",
  shadow: "rgba(0,0,0,0.55)",
  black: "rgba(0,0,0,0.6)",
} as const;
