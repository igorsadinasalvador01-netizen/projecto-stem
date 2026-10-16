// Renderiza vários fotogramas de verificação com um só navegador (bem mais rápido que
// chamar `remotion still` um a um). Uso:
//   node scripts/stills.mjs <bundle> <CompId> <pastaSaida> <escala> <seg1> <seg2> ...
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [bundle, id, out, scale, ...times] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
fs.mkdirSync(out, { recursive: true });
const browser = await openBrowser("chrome", { browserExecutable, chromiumOptions: { gl: "angle" } });
const composition = await selectComposition({ serveUrl: bundle, id, puppeteerInstance: browser, browserExecutable });
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(t) * composition.fps));
  const output = path.join(out, `${id}_${t}.jpg`);
  await renderStill({ serveUrl: bundle, composition, frame, output, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale), puppeteerInstance: browser, browserExecutable, chromiumOptions: { gl: "angle" }, overwrite: true });
  console.log(output);
}
await browser.close({ silent: true });
