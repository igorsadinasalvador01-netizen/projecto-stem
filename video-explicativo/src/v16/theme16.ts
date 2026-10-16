// Vídeo 16 — "Chutar pro gol" · PADRÃO DA SÉRIE (vertical)
// Noite de estádio em azul-escuro, relvado verde, branco e acento turquesa;
// verde = golo/acerto, vermelho = remate falhado; cinza para o secundário.
// Fontes: Bebas Neue (placar e títulos) + Sora (texto e legendas).
import { FONTS } from "../kit/fonts2";

export const T16 = {
  night: "#0A1A2F",
  deep: "#0F2440",
  pitch: "#2F5D45",
  pitchDark: "#284F3B",
  chalk: "#F4F7FA",
  dim: "#9AA8B8",
  green: "#36D399",
  miss: "#F25C5C",
  glass: "rgba(16,36,64,0.55)",
  edge: "rgba(255,255,255,0.18)",
  turq: "#2EC4D6",
  display: FONTS.bebas,
  body: FONTS.sora,
} as const;
