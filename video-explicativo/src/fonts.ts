import { continueRender, delayRender, staticFile } from "remotion";
import { theme } from "./theme";

// Fontes locais (sem rede durante o render).
const faces: { family: string; file: string; weight: string; style?: string }[] = [
  { family: theme.fonts.serif, file: "instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  { family: theme.fonts.serif, file: "instrument-serif-latin-400-normal.woff2", weight: "400" },
  { family: theme.fonts.mono, file: "jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  { family: theme.fonts.display, file: "inter-tight-latin-300-normal.woff2", weight: "300" },
  { family: theme.fonts.display, file: "inter-tight-latin-400-normal.woff2", weight: "400" },
  { family: theme.fonts.display, file: "inter-tight-latin-500-normal.woff2", weight: "500" },
  { family: theme.fonts.display, file: "inter-tight-latin-600-normal.woff2", weight: "600" },
  { family: theme.fonts.display, file: "inter-tight-latin-700-normal.woff2", weight: "700" },
  { family: theme.fonts.display, file: "inter-tight-latin-800-normal.woff2", weight: "800" },
  { family: theme.fonts.display, file: "inter-tight-latin-900-normal.woff2", weight: "900" },
  { family: theme.fonts.body, file: "inter-latin-400-normal.woff2", weight: "400" },
  { family: theme.fonts.body, file: "inter-latin-500-normal.woff2", weight: "500" },
  { family: theme.fonts.body, file: "inter-latin-600-normal.woff2", weight: "600" },
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fontes");
  Promise.all(
    faces.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
        weight: f.weight,
        style: f.style ?? "normal",
      });
      return face.load().then((ff) => document.fonts.add(ff));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
