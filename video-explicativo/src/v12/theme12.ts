// Vídeo 12 — "O que você não quer?" · PADRÃO DA SÉRIE (vertical)
// Fundo azul-escuro, texto branco, vidro fumado e acento azul-turquesa;
// vermelho = dor/erro, verde = solução. Cinza para o texto secundário.
// Fontes: Syne (títulos, carácter editorial) + Manrope (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T12 = {
  base: "#0A1A2F",
  deep: "#0F2440",
  violet: "#2EC4D6",
  violetDeep: "#147A88",
  indigo: "#16335A",
  coral: "#F25C5C",
  coralSoft: "rgba(242,92,92,0.16)",
  mint: "#36D399",
  mintSoft: "rgba(54,211,153,0.16)",
  ink: "#F4F7FA",
  dim: "#9AA8B8",
  faint: "rgba(244,247,250,0.35)",
  glass: "rgba(255,255,255,0.06)",
  edge: "rgba(46,196,214,0.26)",
  display: FONTS.syne,
  body: FONTS.manrope,
} as const;
