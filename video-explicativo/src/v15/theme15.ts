// Vídeo 15 — "5 palavras proibidas" · PADRÃO DA SÉRIE (horizontal)
// Página azul-escura, cartas em 3D (escuras = evite, brancas = use), filetes turquesa.
// Vermelho = palavra proibida, verde = porque funciona; cinza para o secundário.
// Fontes: Playfair Display (palavras, editorial) + Manrope (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T15 = {
  base: "#0A1A2F",
  card: "#10243F",
  ivory: "#F4F7FA",
  ink: "#F4F7FA",
  inkDark: "#0A1A2F",
  dim: "#9AA8B8",
  champagne: "#2EC4D6",
  champagneDeep: "#147A88",
  brick: "#F25C5C",
  rule: "rgba(46,196,214,0.28)",
  glass: "rgba(16,36,64,0.62)",
  edge: "rgba(46,196,214,0.3)",
  green: "#36D399",
  serif: FONTS.playfair,
  body: FONTS.manrope,
} as const;
