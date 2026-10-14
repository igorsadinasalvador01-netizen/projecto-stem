// Vídeo 5 — expressão nostálgica, mesma referência de edição dos vídeos 2–4.
// Branco → papel envelhecido; turquesa → turquesa desbotado (película antiga).
// Verde/vermelho continuam reservados a sinais positivos/negativos.
import type React from "react";
import { theme } from "../theme";

export const c5 = {
  paper: "#F3ECDD",
  paperLight: "#FAF6EC",
  paperDeep: "#E5D9C2",
  paperEdge: "#D6C7AA",
  ink: "#2B2622",
  inkSoft: "#6B6157",
  inkFaint: "#9C9182",
  line: "rgba(43,38,34,0.10)",
  lineStrong: "rgba(43,38,34,0.18)",

  teal: "#3E9C9A",
  tealDeep: "#2C6F6E",
  tealDark: "#1E4B4B",
  tealLight: "#8CC9C4",
  tealMist: "#D5E8E2",

  green: "#4C9A6A",
  greenSoft: "#DCEBDA",
  red: "#C0504A",
  redLight: "#F4B6AE",
  redSoft: "#F2DAD5",

  darkroom: "#1B1714",
  darkroomGlow: "rgba(190,150,100,0.18)",
  cream: "#FFF9EC",
  creamDim: "rgba(255,249,236,0.72)",
  creamFaint: "rgba(255,249,236,0.42)",

  sepia: "#B8946A",
  leakWarm: "rgba(255,168,92,0.42)",
  leakTeal: "rgba(140,201,196,0.40)",
  burn: "rgba(255,236,200,1)",
  shadow: "rgba(60,40,20,0.22)",
  shadowDeep: "rgba(50,32,16,0.38)",
  black: "rgba(0,0,0,0.55)",
  clear: "rgba(0,0,0,0)",
} as const;

export const t5 = {
  serif: { fontFamily: theme.fonts.serif, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1, color: c5.ink },
  serifIt: { fontFamily: theme.fonts.serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1, color: c5.ink },
  light: { fontFamily: theme.fonts.display, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, color: c5.inkSoft },
  type: { fontFamily: theme.fonts.mono, fontWeight: 500, letterSpacing: "0.02em", color: c5.ink },
  label: { fontFamily: theme.fonts.mono, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: c5.inkFaint },
  hand: { fontFamily: theme.fonts.hand, fontWeight: 600, letterSpacing: "0em", lineHeight: 1, color: c5.ink },
} satisfies Record<string, React.CSSProperties>;

// Movimento mais lento e suave (nostálgico): molas mais amortecidas.
export const springs5 = {
  drift: { damping: 26, stiffness: 60, mass: 1.2 },
  settle: { damping: 22, stiffness: 80, mass: 1 },
  drop: { damping: 16, stiffness: 110, mass: 1.1 },
} as const;

export const ease5 = theme.ease;
