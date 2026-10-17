// Vídeo 18 — "Medir antes de vender" (vertical, segunda filmagem do cliente)
// Dinâmica inspirada no vídeo de referência (criador de conteúdo de IA): cartões brancos de app,
// texto forte + itálico serifado, etiquetas mono, destaque azul, cenas escuras em azul-marinho,
// entradas com "pop" (escala + desfoque), escrita ao vivo e listas. O cliente aparece SEMPRE,
// em simultâneo com os motions (a filmagem nunca é substituída por fundos de cor).
export const T18 = {
  navy: "#0A1A2F",
  navy2: "#0F2440",
  ink: "#0A1A2F",
  white: "#FFFFFF",
  paper: "#F6F7F9",
  gray: "#8A94A6",
  line: "rgba(10,26,47,0.08)",
  blue: "#1F6BFF",
  blueSoft: "rgba(31,107,255,0.12)",
  blueLight: "#8DB8FF",
  turq: "#2EC4D6",
  red: "#F25C5C",
  redSoft: "rgba(242,92,92,0.12)",
  green: "#22B07D",
  greenSoft: "rgba(34,176,125,0.12)",
  ui: "Inter Tight",
  serif: "Instrument Serif",
  mono: "JetBrains Mono",
} as const;

// faixa livre por cima do boné (o boné começa perto de y≈600)
export const ZONE18 = { top: 170, bottom: 570 } as const;
