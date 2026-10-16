// Vídeo 14 — "Vender qualquer coisa" · PADRÃO DA SÉRIE (vertical)
// Fundo azul-escuro, vidro fumado, texto branco e acento azul-turquesa; carrossel 3D de
// produtos num estúdio escuro. Verde = certo, vermelho = erro; cinza para o secundário.
// Fontes: Unbounded (títulos geométricos) + Manrope (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T14 = {
  base: "#0A1A2F",
  paper: "#0F2440",
  mist: "#2A4466",
  ink: "#F4F7FA",
  dim: "#9AA8B8",
  faint: "rgba(244,247,250,0.32)",
  steel: "#2EC4D6",
  steelSoft: "rgba(46,196,214,0.14)",
  ice: "#8FE6F0",
  sage: "#36D399",
  brick: "#F25C5C",
  glass: "rgba(255,255,255,0.06)",
  edge: "rgba(255,255,255,0.16)",
  line: "rgba(255,255,255,0.10)",
  shadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
  display: FONTS.unbounded,
  body: FONTS.manrope,
} as const;
