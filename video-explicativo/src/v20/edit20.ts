import ED from "./edit20.json";

// ——— Vídeo 20 "A Moment of Silence": montagem em segundos (a mesma fonte do áudio: scripts/gen-v20-audio.py) ———
export const FPS20 = ED.fps;
export const SRC_FPS = ED.srcFps;
export const TOTAL20 = ED.total;
export const FRAMES20 = Math.round(TOTAL20 * FPS20);
export const SRC_FRAMES = 1838;

export type Shot20 = {
  id: string;
  kind: "plate" | "footage";
  span: [number, number];
  in?: [number, number];
  t?: [number, number][];
  z: [number, number][];
  c: [number, number];
  follow?: string;
};
export const SHOTS20 = ED.shots as Shot20[];
export const FADES = ED.fades as { fromBlack: [number, number]; toBlack: [number, number] };
export const TITLE = ED.title as { txt: string; span: [number, number] };

// ——— PCHIP monótona (Fritsch–Carlson): rampas suaves que nunca ultrapassam os pontos ———
const slopes = (x: number[], y: number[]) => {
  const n = x.length;
  const h = x.slice(1).map((v, i) => v - x[i]);
  const d = h.map((hi, i) => (y[i + 1] - y[i]) / hi);
  if (n === 2) return [d[0], d[0]];
  const m = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  const end = (h0: number, h1: number, d0: number, d1: number) => {
    let v = ((2 * h0 + h1) * d0 - h0 * d1) / (h0 + h1);
    if (Math.sign(v) !== Math.sign(d0)) v = 0;
    else if (Math.sign(d0) !== Math.sign(d1) && Math.abs(v) > Math.abs(3 * d0)) v = 3 * d0;
    return v;
  };
  m[0] = end(h[0], h[1], d[0], d[1]);
  m[n - 1] = end(h[n - 2], h[n - 3], d[n - 2], d[n - 3]);
  return m;
};

export const pchip = (keys: [number, number][], q: number) => {
  const x = keys.map((k) => k[0]);
  const y = keys.map((k) => k[1]);
  if (q <= x[0]) return y[0];
  if (q >= x[x.length - 1]) return y[y.length - 1];
  const m = slopes(x, y);
  let i = 0;
  while (q > x[i + 1]) i++;
  const h = x[i + 1] - x[i];
  const s = (q - x[i]) / h;
  return (2 * s ** 3 - 3 * s ** 2 + 1) * y[i] + (s ** 3 - 2 * s ** 2 + s) * h * m[i] + (-2 * s ** 3 + 3 * s ** 2) * y[i + 1] + (s ** 3 - s ** 2) * h * m[i + 1];
};

const byId = (id: string) => SHOTS20.find((s) => s.id === id)!;

export const zoomAt = (sh: Shot20, t: number): number => {
  if (sh.follow && sh.in && t <= sh.in[1]) return zoomAt(byId(sh.follow), t);
  return pchip(sh.z, t);
};

// opacidade da dissolução de entrada (seno: começa e acaba devagar)
export const opacityAt = (sh: Shot20, t: number) => {
  if (!sh.in || t >= sh.in[1]) return 1;
  if (t <= sh.in[0]) return 0;
  const p = (t - sh.in[0]) / (sh.in[1] - sh.in[0]);
  return 0.5 - 0.5 * Math.cos(Math.PI * p);
};

// fotograma(s) da filmagem: janela temporal de largura FIXA (3 fotogramas de origem ≈ 1/20 s)
// centrada no índice fracionário. Com largura fixa a nitidez/ruído é igual em todos os
// fotogramas; com a mistura simples de 2 vizinhos, um fotograma "puro" de vez em quando
// ficava mais nítido e via-se um pequeno salto no contorno.
const WIN = 3; // também espalha o resto dos saltos de I-frame da origem por 3 fotogramas
export const footageFrames = (sh: Shot20, t: number) => {
  const s = pchip(sh.t!, t);
  const k = Math.max(1, Math.min(SRC_FRAMES - 2, s * SRC_FPS));
  const a = k - WIN / 2;
  const b = k + WIN / 2;
  const out: { f: number; w: number }[] = [];
  for (let j = Math.round(a); j <= Math.round(b); j++) {
    const w = Math.max(0, Math.min(b, j + 0.5) - Math.max(a, j - 0.5));
    if (w > 0.01 && j >= 0 && j < SRC_FRAMES) out.push({ f: j, w });
  }
  const tot = out.reduce((x, y) => x + y.w, 0);
  return out.map((o) => ({ f: o.f, w: o.w / tot }));
};

export const visibleAt = (t: number) => SHOTS20.filter((s) => t >= s.span[0] && t < s.span[1]);
