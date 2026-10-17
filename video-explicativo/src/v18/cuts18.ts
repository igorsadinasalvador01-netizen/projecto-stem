import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SP, Spr } from "../kit/Kit";
import cuts from "./cuts18.json";

// Vídeo 18 · montagem sem pausas mortas (scripts/cut-pauses.py): a filmagem, o recorte e a narração foram
// cortados nos mesmos fotogramas. Todas as marcas de tempo do vídeo continuam escritas no tempo
// ORIGINAL da fala; M() converte para o tempo da montagem e Minv() faz o inverso.
const FPS = cuts.fps;
type Seg = { s: number; e: number; o: number; zoom: number };
const LEVELS = [1.0, 1.08, 1.03, 1.12];
const SEGS: Seg[] = (() => {
  let o = 0;
  let lvl = 0;
  let lastToggle = -99;
  return cuts.keep.map(([a, b], k) => {
    // cortes com mais de 6 fotogramas mudam o enquadramento (punch-in) para esconder o salto;
    // nunca duas mudanças em menos de meio segundo
    const removed = k === 0 ? 0 : a - cuts.keep[k - 1][1];
    if (removed >= 7 && o - lastToggle >= 0.5) {
      lvl = (lvl + 1) % LEVELS.length;
      lastToggle = o;
    }
    const g = { s: a / FPS, e: b / FPS, o, zoom: LEVELS[lvl] };
    o += (b - a) / FPS;
    return g;
  });
})();
const LAST = SEGS[SEGS.length - 1];
export const OUT_LEN = cuts.outFrames / FPS;
export const OUT_FRAMES = cuts.outFrames;

// tempo original → tempo da montagem (dentro de uma pausa cortada, fica no ponto do corte)
export const M = (x: number) => {
  for (const g of SEGS) {
    if (x < g.s) return g.o;
    if (x <= g.e) return g.o + (x - g.s);
  }
  return LAST.o + (LAST.e - LAST.s) + (x - LAST.e);
};
// tempo da montagem → tempo original
export const Minv = (t: number) => {
  for (const g of SEGS) if (t < g.o + (g.e - g.s)) return g.s + Math.max(0, t - g.o);
  return LAST.e + (t - (LAST.o + LAST.e - LAST.s));
};
// enquadramento do segmento atual + um avanço lento dentro de cada plano (ritmo)
export const punch = (t: number) => {
  let g = LAST;
  for (const x of SEGS)
    if (t < x.o + (x.e - x.s)) {
      g = x;
      break;
    }
  return g.zoom * (1 + Math.min(0.025, (t - g.o) * 0.006));
};

// relógio do vídeo 17: `t` no tempo original (para as marcas), `to` no tempo da montagem
export const useClock18 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const to = frame / fps;
  const t = Minv(to);
  const sp = (at: number, cfg: Spr = SP.soft) => spring({ frame: frame - Math.round(M(at) * fps), fps, config: cfg });
  return { frame, fps, t, to, sp };
};
