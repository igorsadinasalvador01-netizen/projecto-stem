// Vídeo 14 — "Vender qualquer coisa" · GELO & AÇO (vertical)
// Fundo branco-gelo, vidro fosco claro, grafite para o texto e um único acento azul-aço.
// Paleta minimalista (sem cores exageradas): sálvia = certo, tijolo suave = erro.
// Fontes: Unbounded (títulos geométricos) + Manrope (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T14 = {
  base: "#EEF1F4",
  paper: "#F8F9FA",
  mist: "#DDE3E9",
  ink: "#121417",
  dim: "#5B636C",
  faint: "rgba(18,20,23,0.32)",
  steel: "#3E5C76",
  steelSoft: "rgba(62,92,118,0.12)",
  ice: "#8FA7BC",
  sage: "#5E8C6A",
  brick: "#B5524A",
  glass: "rgba(255,255,255,0.55)",
  edge: "rgba(255,255,255,0.95)",
  line: "rgba(18,20,23,0.08)",
  shadow: "0 30px 60px -30px rgba(30,45,60,0.35)",
  display: FONTS.unbounded,
  body: FONTS.manrope,
} as const;
