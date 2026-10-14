// Engenharia reversa do áudio do vídeo 3 (narracao3.m4a, 22,64 s).
// Parakeet v3 e Whisper-small concordam palavra a palavra.
import { c2, Pattern, Surface } from "../v2/theme2";

export const AUDIO3_SECONDS = 22.639002;

export const HITS3 = {
  voiceEnd: 18.52,
  boom: 18.63, // "boom" subgrave depois de "imagina."
  silenceFrom: 19.44,
} as const;

export const W3 = {
  // 1
  voce: 0.0,
  nao: 0.32,
  precisa: 0.48,
  comecar: 0.8,
  sabendo: 1.2,
  tudo: 1.68,
  para: 2.0,
  fazer: 2.16,
  sua: 2.48,
  primeira: 2.72,
  venda: 3.04,
  no: 3.44,
  digital: 3.6,
  // 2
  todo: 4.56,
  especialista: 5.04,
  ja: 5.68,
  foi: 5.92,
  iniciante: 6.16,
  um: 6.88,
  dia: 7.12,
  // 3
  a: 7.68,
  diferenca: 7.92,
  e: 8.56,
  que: 8.8,
  alguns: 8.96,
  comecaram: 9.28,
  mesmo: 9.92,
  com: 10.24,
  medo: 10.48,
  // 4
  aprenda: 11.12,
  aplique: 12.08,
  e2: 12.8,
  melhore: 13.04,
  todos: 13.68,
  os: 14.0,
  dias: 14.16,
  // 5
  a2: 14.88,
  sua2: 15.04,
  primeira2: 15.36,
  venda2: 15.68,
  pode: 16.08,
  estar: 16.4,
  mais: 16.56,
  perto: 16.8,
  doQue: 17.12,
  voce2: 17.44,
  imagina: 17.76,
} as const;

export const SCENES3 = {
  hook: { from: 0, to: 4.62 },
  especialista: { from: 4.4, to: 7.8 },
  diferenca: { from: 7.56, to: 11.2 },
  ciclo: { from: 10.96, to: 15.0 },
  perto: { from: 14.76, to: 19.6 },
  outro: { from: 19.36, to: AUDIO3_SECONDS },
} as const;

export const sceneThemes3 = {
  hook: { surface: "white", pattern: "dots", accent: c2.turq },
  especialista: { surface: "turq", pattern: "rings", accent: c2.white },
  diferenca: { surface: "white", pattern: "diagonal", accent: c2.turqDeep },
  ciclo: { surface: "deep", pattern: "grid", accent: c2.aqua },
  perto: { surface: "mist", pattern: "floor", accent: c2.turq },
  outro: { surface: "turq", pattern: "none", accent: c2.white },
} as const satisfies Record<string, { surface: Surface; pattern: Pattern; accent: string }>;
