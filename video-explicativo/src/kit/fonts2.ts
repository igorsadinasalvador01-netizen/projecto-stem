import { continueRender, delayRender, staticFile } from "remotion";

// Fontes premium dos vídeos 12+ (locais, sem rede durante o render; @fontsource, licença OFL).
export const FONTS = {
  syne: "Syne",
  fraunces: "Fraunces",
  grotesk: "Space Grotesk",
  bebas: "Bebas Neue",
  unbounded: "Unbounded",
  playfair: "Playfair Display",
  sora: "Sora",
  manrope: "Manrope",
} as const;

const faces: { family: string; file: string; weight: string; style?: string }[] = [
  ...["500", "700", "800"].map((w) => ({ family: FONTS.syne, file: `syne-latin-${w}-normal.woff2`, weight: w })),
  ...["400", "600", "900"].map((w) => ({ family: FONTS.fraunces, file: `fraunces-latin-${w}-normal.woff2`, weight: w })),
  ...["400", "600"].map((w) => ({ family: FONTS.fraunces, file: `fraunces-latin-${w}-italic.woff2`, weight: w, style: "italic" })),
  ...["400", "500", "700"].map((w) => ({ family: FONTS.grotesk, file: `space-grotesk-latin-${w}-normal.woff2`, weight: w })),
  { family: FONTS.bebas, file: "bebas-neue-latin-400-normal.woff2", weight: "400" },
  ...["400", "600", "800"].map((w) => ({ family: FONTS.unbounded, file: `unbounded-latin-${w}-normal.woff2`, weight: w })),
  ...["400", "700", "900"].map((w) => ({ family: FONTS.playfair, file: `playfair-display-latin-${w}-normal.woff2`, weight: w })),
  ...["400", "700"].map((w) => ({ family: FONTS.playfair, file: `playfair-display-latin-${w}-italic.woff2`, weight: w, style: "italic" })),
  ...["300", "400", "600", "800"].map((w) => ({ family: FONTS.sora, file: `sora-latin-${w}-normal.woff2`, weight: w })),
  ...["400", "600", "800"].map((w) => ({ family: FONTS.manrope, file: `manrope-latin-${w}-normal.woff2`, weight: w })),
];

let loaded = false;
export const loadFonts2 = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fontes premium");
  Promise.all(
    faces.map((f) =>
      new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, { weight: f.weight, style: f.style ?? "normal" }).load().then((ff) => document.fonts.add(ff)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
