// Vídeo 11 — a mesma história do vídeo 10 (mesmo áudio), com cores novas e a nostalgia
// reduzida a dois momentos apenas: o intertítulo de cinema mudo ("Aqui vem o truque") e a
// página de dicionário ("efeito isca"). O resto é moderno e limpo.
// Paleta moderna: branco e cinza frio dominantes, azul-cobalto como cor herói (o produto que
// você quer vender), tinta quase preta em minoria e cores vivas só nos detalhes: laranja
// vivo = retirar/isca, amarelo = truque/benefício principal, verde-esmeralda = escolha e
// ganho, magenta = psicologia.
import { theme } from "../theme";

export { EASE, SPR } from "../v10/look10";
export type { Spr } from "../v10/look10";

export const P11 = {
  paper: "#FAFAF8",
  paperCool: "#EEF1F7",
  mist: "#EEF0F6",
  line: "#E2E6EE",
  line2: "#CBD2DE",
  gray: "#8890A2",
  grayDeep: "#545D71",
  ink: "#0E1220",
  inkSoft: "#272D3E",
  turq: "#2F5BEA",
  turqDeep: "#1E3FB0",
  turqLight: "#7C9BFF",
  turqSoft: "#E1E8FF",
  coral: "#FF6A2B",
  coralSoft: "#FFE7DB",
  amber: "#FFC21A",
  amberSoft: "#FFF3C6",
  lime: "#12B886",
  limeSoft: "#D6F5E9",
  limeText: "#0B8A63",
  violet: "#C02BC9",
  violetSoft: "#F7E1F8",
  glow: "47,91,234",
} as const;

// só para os dois momentos nostálgicos
export const N11 = {
  paper: "#F1E6D1",
  paperLight: "#FBF5E8",
  paperDeep: "#E4D3B4",
  card: "#FCF6EA",
  ink: "#2A1F17",
  inkSoft: "#4B3B2D",
  sepia: "#8B6B4A",
  faint: "rgba(42,31,23,0.42)",
  rule: "rgba(70,110,150,0.22)",
  margin: "rgba(178,58,46,0.38)",
  teal: "#2E7D7E",
  tealSoft: "#D3E6E0",
  mustard: "#D4952A",
  mustardSoft: "#F4E2B4",
  rust: "#C0552B",
  red: "#B1372B",
  redSoft: "#F2D5C9",
  olive: "#5E7E37",
  oliveSoft: "#DFE7CB",
  plum: "#6E4C7C",
  night: "#15100B",
} as const;

export const F11 = { display: theme.fonts.display, serif: theme.fonts.serif, mono: theme.fonts.mono, body: theme.fonts.body, hand: theme.fonts.hand } as const;
