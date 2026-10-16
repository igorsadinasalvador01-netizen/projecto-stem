// Vídeo 16 — "Chutar pro gol" · ESTÁDIO NOTURNO (vertical)
// Relvado escuro sob refletores, branco-giz e um único verde suave para o golo/acerto.
// Paleta minimalista: sem néon; vermelho apagado só para o remate falhado.
// Fontes: Bebas Neue (placar e títulos) + Sora (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T16 = {
  night: "#0A0F0D",
  deep: "#101915",
  pitch: "#2F5D45",
  pitchDark: "#284F3B",
  chalk: "#F2F4EF",
  dim: "rgba(242,244,239,0.66)",
  green: "#7DBF8A",
  miss: "#C46A5E",
  glass: "rgba(16,25,21,0.55)",
  edge: "rgba(242,244,239,0.22)",
  display: FONTS.bebas,
  body: FONTS.sora,
} as const;
