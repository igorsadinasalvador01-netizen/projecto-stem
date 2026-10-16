// Vídeo 15 — "5 palavras proibidas" · EDITORIAL NOIR & CHAMPANHE (horizontal)
// Página preta de revista, cartas em 3D (escuras = evite, marfim = use), filetes champanhe.
// Paleta minimalista: preto, marfim, champanhe; tijolo suave só para o que é proibido.
// Fontes: Playfair Display (palavras, editorial) + Manrope (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T15 = {
  base: "#0B0B0C",
  card: "#18181A",
  ivory: "#F3EFE6",
  ink: "#F3EFE6",
  inkDark: "#141414",
  dim: "#9C978C",
  champagne: "#C9B37E",
  champagneDeep: "#8A7442",
  brick: "#B5524A",
  rule: "rgba(201,179,126,0.28)",
  glass: "rgba(24,24,26,0.62)",
  edge: "rgba(201,179,126,0.3)",
  serif: FONTS.playfair,
  body: FONTS.manrope,
} as const;
