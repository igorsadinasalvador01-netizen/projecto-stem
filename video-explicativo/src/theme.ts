// theme.ts — fonte única de cores, curvas, molas e fontes.
// Nunca usar hex, easing ou spring inline nos componentes.
// Paleta pedida: branco, azul-turquesa um pouco mais escuro,
// cinza e partes transparentes (vidro). O preto fica só no fundo, sombras e
// vinheta (contraste) — nunca nas peças animadas.
import { Easing } from "remotion";

export const theme = {
  colors: {
    // Fundo: preto/carvão para contraste (nunca usado nas peças)
    bg: "#0D0E10",
    bgAlt: "#1D1F23",
    bgDeep: "#050506",
    // Peças animadas: só cinzas (nunca preto)
    piece: "#5B6168",
    pieceLight: "#7A8088",
    pieceDark: "#474C53",
    pieceDeep: "#3A3E44",
    pieceTint: "rgba(128,135,143,0.24)",
    // Vidro / transparências
    glass: "rgba(255,255,255,0.06)",
    glassStrong: "rgba(255,255,255,0.10)",
    glassTop: "rgba(255,255,255,0.16)",
    panel: "rgba(106,113,121,0.92)",
    stroke: "rgba(255,255,255,0.18)",
    strokeStrong: "rgba(255,255,255,0.34)",
    // Azul-turquesa mais escuro — a cor herói (máx. um elemento por fotograma)
    primary: "#12B5BA",
    primaryDeep: "#0A7F86",
    primaryLight: "#5FD6D9",
    glow: "rgba(18,181,186,0.55)",
    glowSoft: "rgba(18,181,186,0.22)",
    glowFaint: "rgba(18,181,186,0.12)",
    // Branco e cinzas de texto
    text: "#FFFFFF",
    textSoft: "#F1F3F5",
    textDim: "#B9BEC4",
    textFaint: "#9CA2A8",
    white: "rgba(255,255,255,1)",
    whiteMist: "rgba(255,255,255,0.05)",
    // Sombras e vinheta: preto para contraste
    shadow: "rgba(0,0,0,0.55)",
    shadowDeep: "rgba(0,0,0,0.72)",
    shade: "rgba(0,0,0,0.26)",
    shadeStrong: "rgba(0,0,0,0.46)",
    // Materiais 3D (three.js)
    metalDark: "#858B93",
    chrome: "#EEF0F2",
    envGray: "#7F858C",
  },
  // Alternância tipográfica: sans forte para contexto, serifa itálica para
  // as frases de impacto, mono para dados e etiquetas.
  fonts: {
    display: "Inter Tight",
    body: "Inter",
    serif: "Instrument Serif",
    mono: "JetBrains Mono",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entradas
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — movimentos, câmara
    in: Easing.bezier(0.7, 0, 0.84, 0), // só saídas
    soft: Easing.bezier(0.33, 1, 0.68, 1), // easeOutCubic — derivas lentas
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    heavy: { damping: 18, stiffness: 120, mass: 1.4 },
    settle: { damping: 30, stiffness: 60, mass: 1 },
  },
  // Duração das saídas (s) — mais rápidas do que as entradas.
  exitSeconds: 0.36,
} as const;
