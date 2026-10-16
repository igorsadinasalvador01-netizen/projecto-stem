// Vídeo 17 — "Vender valor na construção" (vertical, filmagem do próprio cliente)
// Modelo de edição extraído por engenharia reversa de um vídeo de referência ("editando ao
// vivo"): plano contínuo, HUD de edição com timecode e etapas, gráficos atrás da pessoa
// (recorte com RVM), separação em camadas de vidro 3D, modo moldura, ecrãs/tiles flutuantes,
// prédio 3D explodido e CTA final. Sem modo moldura: o fundo do vídeo nunca é tapado por cor. Paleta: branco, cinza, turquesa e azul (alternados),
// vermelho = cenas de atenção, verde = validação/positivo, vidro transparente no 3D.
import { FONTS } from "../kit/fonts2";

export const T17 = {
  navy: "#0A1A2F",
  navy2: "#0F2440",
  white: "#F4F7FA",
  gray: "#9AA8B8",
  turq: "#2EC4D6",
  turqSoft: "rgba(46,196,214,0.16)",
  blue: "#3B82F6",
  blueLight: "#8DB8FF",
  blueSoft: "rgba(59,130,246,0.16)",
  red: "#F25C5C",
  redSoft: "rgba(242,92,92,0.16)",
  green: "#36D399",
  greenSoft: "rgba(54,211,153,0.16)",
  glass: "rgba(12,30,54,0.5)",
  chip: "rgba(10,26,47,0.74)",
  edge: "rgba(255,255,255,0.18)",
  line: "rgba(255,255,255,0.12)",
  ui: "Inter Tight",
  display: FONTS.bebas,
  mono: "JetBrains Mono",
} as const;

// a filmagem fica sempre no ecrã inteiro; o conteúdo vive na faixa de cima, por cima do
// capacete (que começa perto de y≈540) e por baixo do HUD
export const ZONE = { top: 176, h: 352 } as const;
