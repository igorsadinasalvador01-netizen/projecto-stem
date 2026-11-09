// Vídeo 21 v2 · estilo claro da referência (vídeo do autor): tela quase branca com manchas pastel,
// cartões brancos com sombra suave, capítulos em pill, azul sublinhado nas palavras-chave,
// vermelho nas negativas, verde nas positivas, títulos em gradiente azul→verde e itálico serifado.
export const L = {
  canvas: "#F5F6F9",
  ink: "#0E1116",
  ink2: "#3B4250",
  gray: "#8A93A3",
  line: "rgba(14,17,22,0.08)",
  card: "#FFFFFF",
  blue: "#2D5BD7",
  blueSoft: "rgba(45,91,215,0.10)",
  green: "#16A05A",
  greenSoft: "rgba(22,160,90,0.10)",
  red: "#D64545",
  redSoft: "rgba(214,69,69,0.10)",
  grad: "linear-gradient(92deg, #2D5BD7 0%, #1E8AD8 45%, #17AE7C 100%)",
  shadow: "0 30px 60px -28px rgba(14,17,22,0.28), 0 8px 22px -12px rgba(14,17,22,0.14)",
  ui: "Inter Tight",
  serif: "Instrument Serif",
  mono: "JetBrains Mono",
} as const;

// a pessoa: cartão 600×980 com a imagem real; o recorte usa exatamente a mesma geometria
export const CARD = { w: 600, h: 980, top: 55, r: 38 };
export const PK = 0.76; // escala da imagem 1080×1920 dentro do cartão
export const FACE = { x: 540, y: 1137 }; // rosto na imagem 1080×1920
export const FACE_IN_CARD = { x: 300, y: 390 };
