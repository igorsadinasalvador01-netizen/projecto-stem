// Vídeo 13 — "Vendedor herbívoro vs carnívoro" · PADRÃO DA SÉRIE (horizontal)
// Sem desenhos de animais: a metáfora fica na narração; a imagem mostra o mundo das vendas
// (caixa de entrada, comissão, prospecção, carteira, mercado). Fundo azul-escuro, branco,
// turquesa = vendedor carnívoro, cinza = vendedor herbívoro, vermelho/verde = sinais.
// Fontes: Fraunces (títulos editoriais) + Space Grotesk (dados e legendas).
import { FONTS } from "../kit/fonts2";
import { SERIE } from "../kit/serie";

export const T13 = {
  paper: SERIE.navy,
  stone: SERIE.navy2,
  ink: SERIE.white,
  dim: SERIE.gray,
  faint: "rgba(244,247,250,0.32)",
  line: "rgba(255,255,255,0.10)",
  herb: SERIE.gray,
  herbSoft: "rgba(154,168,184,0.16)",
  carn: SERIE.turq,
  carnSoft: "rgba(46,196,214,0.16)",
  miss: SERIE.red,
  missSoft: "rgba(242,92,92,0.16)",
  good: SERIE.green,
  goodSoft: "rgba(54,211,153,0.16)",
  glass: "rgba(255,255,255,0.06)",
  edge: "rgba(255,255,255,0.16)",
  shadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
  turqDeep: SERIE.turqDeep,
  serif: FONTS.fraunces,
  sans: FONTS.grotesk,
} as const;
