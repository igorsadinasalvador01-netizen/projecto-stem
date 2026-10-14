// Tema do vídeo 2 — "As 3 portas".
// Base: branco + azul-turquesa. Vermelho só para sinais negativos e verde só
// para positivos nas escritas. Cada cena tem o seu tema (fundo, padrão, destaque).
import { theme } from "../theme";

export const c2 = {
  white: "#FFFFFF",
  paper: "#F5F9F9",
  mist: "#E8F4F4",
  ink: "#0B2A30", // texto principal (petróleo muito escuro)
  inkSoft: "#4C676D",
  inkFaint: "#8EA4A9",
  line: "rgba(11,42,48,0.08)",
  lineStrong: "rgba(11,42,48,0.16)",

  turq: "#12B5BA",
  turqDeep: "#0A7F86",
  turqDark: "#06555C",
  turqLight: "#5FD6D9",
  turqMist: "#D6F2F2",
  aqua: "#A6EEEE",

  green: "#0F9D58",
  greenSoft: "#DDF4E8",
  greenLight: "#34C77B",
  red: "#E5484D",
  redSoft: "#FDE6E6",
  redLight: "#F17A7E",
  redFade: "rgba(241,122,126,0)",

  // superfícies escuras (vídeo 4)
  nightTop: "#0C1113",
  nightBottom: "#06090A",
  abyssTop: "#06343A",
  abyssBottom: "#031417",
  glowNight: "rgba(18,181,186,0.20)",
  glowAbyss: "rgba(18,181,186,0.28)",
  turqClear: "rgba(18,181,186,0)",

  glassOnWhite: "rgba(255,255,255,0.78)",
  glassOnTurq: "rgba(255,255,255,0.16)",
  glassOnTurqStrong: "rgba(255,255,255,0.26)",
  strokeOnTurq: "rgba(255,255,255,0.34)",
  whiteDim: "rgba(255,255,255,0.72)",
  whiteFaint: "rgba(255,255,255,0.45)",

  shadow: "rgba(11,42,48,0.10)",
  shadowDeep: "rgba(11,42,48,0.22)",
  shadowTurq: "rgba(4,60,66,0.35)",
  glowTurq: "rgba(18,181,186,0.35)",
  glowGreen: "rgba(15,157,88,0.30)",
  glowRed: "rgba(229,72,77,0.28)",
} as const;

export type Surface = "white" | "mist" | "turq" | "deep" | "night" | "abyss";
export type Pattern = "none" | "dots" | "grid" | "diagonal" | "rings" | "ledger" | "floor";

// Tema por cena: fundo, padrão, cor de destaque e tinta.
export const sceneThemes = {
  hook: { surface: "white", pattern: "none", accent: c2.turq, ink: c2.ink },
  time: { surface: "turq", pattern: "rings", accent: c2.white, ink: c2.white },
  estudo: { surface: "white", pattern: "dots", accent: c2.turqDeep, ink: c2.ink },
  portas: { surface: "mist", pattern: "floor", accent: c2.turq, ink: c2.ink },
  p1: { surface: "white", pattern: "diagonal", accent: c2.turq, ink: c2.ink },
  p2: { surface: "deep", pattern: "rings", accent: c2.aqua, ink: c2.white },
  p3: { surface: "white", pattern: "ledger", accent: c2.turqDeep, ink: c2.ink },
  confirma: { surface: "mist", pattern: "floor", accent: c2.turq, ink: c2.ink },
  compara: { surface: "white", pattern: "grid", accent: c2.turq, ink: c2.ink },
  final: { surface: "turq", pattern: "none", accent: c2.white, ink: c2.white },
} as const satisfies Record<string, { surface: Surface; pattern: Pattern; accent: string; ink: string }>;

// Curvas e molas partilhadas com o vídeo 1.
export const ease = theme.ease;
export const springs = theme.spring;
