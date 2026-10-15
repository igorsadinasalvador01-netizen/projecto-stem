// Vídeo 10 — direção de arte: branco premium dominante, cinzas de estúdio,
// azul-turquesa como cor herói (o produto que você quer vender), preto em minoria
// (tinta do texto, "VS", botão, o instante do truque) e cores vivas só nos detalhes
// que mandam: coral = retirar/isca, âmbar = truque/principal, verde-lima = escolha
// e ganho, violeta = psicologia.
import { theme } from "../theme";

export const P10 = {
  paper: "#FBFBFA",
  paperCool: "#F1F4F6",
  mist: "#EEF1F4",
  line: "#E3E7EC",
  line2: "#D2D8DF",
  gray: "#8A94A2",
  grayDeep: "#576170",
  ink: "#0B0D12",
  inkSoft: "#272C35",
  turq: "#00A7B5",
  turqDeep: "#007E89",
  turqLight: "#5CD3DC",
  turqSoft: "#DCF5F7",
  coral: "#FF3B5C",
  coralSoft: "#FFE4E9",
  amber: "#FFB300",
  amberSoft: "#FFF2CC",
  lime: "#10C977",
  limeSoft: "#D9F7E8",
  violet: "#7A5CFF",
  violetSoft: "#ECE7FF",
} as const;

export const F10 = { display: theme.fonts.display, serif: theme.fonts.serif, mono: theme.fonts.mono, body: theme.fonts.body } as const;

export const SPR = {
  soft: { damping: 18, stiffness: 110, mass: 0.9 },
  snap: { damping: 14, stiffness: 180, mass: 0.6 },
  pop: { damping: 10, stiffness: 210, mass: 0.6 },
  heavy: { damping: 20, stiffness: 120, mass: 1.2 },
} as const;
export type Spr = { damping: number; stiffness: number; mass: number };

export const EASE = theme.ease;
