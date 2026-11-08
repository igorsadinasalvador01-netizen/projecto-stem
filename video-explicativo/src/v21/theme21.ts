// Vídeo 21 · identidade visual: documental empresarial, dark premium, minimalista.
// Branco como cor principal, azul elétrico como destaque; vidro escuro nos painéis.
export const T21 = {
  ink: "#05070B",
  night: "#0A0E15",
  white: "#F4F6FA",
  dim: "rgba(244,246,250,0.52)",
  gray: "#8C95A5",
  line: "rgba(244,246,250,0.16)",
  blue: "#2F7BFF",
  blueHi: "#6FA3FF",
  glow: "rgba(47,123,255,0.55)",
  glass: "rgba(10,14,21,0.66)",
  glassEdge: "rgba(255,255,255,0.10)",
  ui: "Inter Tight",
  mono: "JetBrains Mono",
} as const;

// enquadramentos: escala do recorte (1080×1920) e posição do rosto no ecrã 1920×1080
export type Cam = { s: number; fx: number; fy: number };
export const FACE = { x: 540, y: 1137 }; // centro do rosto no recorte (px)
export const CAM = {
  wide: { s: 0.74, fx: 960, fy: 470 },
  med: { s: 0.88, fx: 960, fy: 420 },
  close: { s: 1.1, fx: 960, fy: 440 },
  xcu: { s: 1.42, fx: 960, fy: 380 },
  right: { s: 0.86, fx: 1330, fy: 430 },
  left: { s: 0.86, fx: 600, fy: 430 },
  rightClose: { s: 1.02, fx: 1350, fy: 450 },
  splitL: { s: 0.82, fx: 500, fy: 440 },
} satisfies Record<string, Cam>;
