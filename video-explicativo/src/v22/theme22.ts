import { continueRender, delayRender, Easing, staticFile } from "remotion";

// Vídeo 22 · "Glass noir": sala de reunião noturna (cenário original), vidro VAZIO e transparente
// (sem cor, sem desfoque, sem brilhos), tipografia dinâmica e só branco, azul, verde e vermelho.
export const C = {
  night: "#050A14",
  navy: "#0B1830",
  ink: "#F4F7FB",
  ink2: "rgba(232,240,255,0.74)",
  mute: "rgba(200,214,240,0.52)",
  blue: "#3D8BFF",
  sky: "#8DBBFF",
  red: "#FF4B4B",
  green: "#2EDB7F",
  display: "Bebas Neue",
  wide: "Unbounded",
  ui: "Inter Tight",
  mono: "JetBrains Mono",
} as const;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1); // entrada rápida que assenta
export const IN = Easing.bezier(0.5, 0, 0.75, 0); // saída que acelera
export const MOVE = Easing.bezier(0.65, 0, 0.35, 1);

// fontes extra do vídeo 22 (locais: public/fonts)
const FACES: { family: string; file: string; weight: string }[] = [
  { family: C.display, file: "bebas-neue-latin-400-normal.woff2", weight: "400" },
  { family: C.wide, file: "unbounded-latin-400-normal.woff2", weight: "400" },
  { family: C.wide, file: "unbounded-latin-600-normal.woff2", weight: "600" },
];
let loaded = false;
export const loadFonts22 = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const h = delayRender("fontes v22");
  Promise.all(
    FACES.map((f) =>
      new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, { weight: f.weight }).load().then((ff) => document.fonts.add(ff)),
    ),
  )
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
};
