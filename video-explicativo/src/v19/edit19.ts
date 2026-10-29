import ED from "./edit19.json";

// ——— Vídeo 19: montagem em batidas (a mesma fonte de verdade do áudio: scripts/gen-v19-audio.py) ———
export const FPS19 = 30;
export const BPM = ED.bpm;
export const BEAT = 60 / BPM; // s
export const TOTAL19 = ED.beats * BEAT + ED.tail; // s
export const FRAMES19 = Math.ceil(TOTAL19 * FPS19);

export type ClipId = "A" | "B" | "C" | "D" | "E";
export type Shot = {
  clip: ClipId;
  b: [number, number];
  t: [number, number][];
  z: [number, number];
  c: [number, number];
  in?: "cut" | "flash" | "dip" | "whipL" | "whipR" | "whipU" | "whipD" | "zoom";
  kick?: number[];
  shake?: number[];
  freeze?: [number, number];
};
export const SHOTS = ED.shots as Shot[];
export const CLIPS = ED.clips as Record<ClipId, { fa: number; fb: number; n60?: number }>;
export const BLACK = ED.black as [number, number][];
export const TEXTS = ED.text as { txt: string; b: [number, number]; style: "behind" | "hero" | "end" }[];

export const bf = (b: number) => (b * BEAT * FPS19); // batida → fotograma (fracionário)
export const fb = (f: number) => f / FPS19 / BEAT; // fotograma → batida

// fotogramas de cada ficheiro graduado (60 fps de conteúdo numa base de 30 fps; contagem real em n60)
export const NFRAMES: Record<ClipId, number> = Object.fromEntries(
  (Object.keys(CLIPS) as ClipId[]).map((k) => [k, CLIPS[k].n60 ?? (CLIPS[k].fb - CLIPS[k].fa) * 2 - 1]),
) as Record<ClipId, number>;

// ——— curva de tempo (PCHIP monótona: rampas de velocidade suaves, sem ultrapassar os pontos) ———
const pchipSlopes = (x: number[], y: number[]) => {
  const n = x.length;
  const h = x.slice(1).map((v, i) => v - x[i]);
  const d = h.map((hi, i) => (y[i + 1] - y[i]) / hi);
  const m = new Array(n).fill(0);
  if (n === 2) return [d[0], d[0]];
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
  m[n - 1] = end(h[n - 2], h[n - 3] ?? h[n - 2], d[n - 2], d[n - 3] ?? d[n - 2]);
  return m;
};

export const srcAt = (sh: Shot, beat: number) => {
  const x = sh.t.map((k) => k[0]);
  const y = sh.t.map((k) => k[1]);
  if (beat <= x[0]) return y[0];
  if (beat >= x[x.length - 1]) return y[y.length - 1];
  const m = pchipSlopes(x, y);
  let i = 0;
  while (beat > x[i + 1]) i++;
  const h = x[i + 1] - x[i];
  const s = (beat - x[i]) / h;
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1;
  const h10 = s ** 3 - 2 * s ** 2 + s;
  const h01 = -2 * s ** 3 + 3 * s ** 2;
  const h11 = s ** 3 - s ** 2;
  return h00 * y[i] + h10 * h * m[i] + h01 * y[i + 1] + h11 * h * m[i + 1];
};

// velocidade (s de filmagem por s de montagem)
export const speedAt = (sh: Shot, beat: number) => {
  const e = 0.02;
  return Math.max(0, (srcAt(sh, beat + e) - srcAt(sh, beat - e)) / (2 * e * BEAT));
};

// índice (fracionário) no ficheiro graduado a 60 fps
export const k60 = (clip: ClipId, s: number) => (s - CLIPS[clip].fa / 30) * 60;

/** amostras ponderadas: interpolação entre fotogramas (câmara lenta suave) e desfoque de
 *  movimento quando a velocidade sobe (obturador ~270°) */
export const samples = (clip: ClipId, s: number, speed: number) => {
  const nf = NFRAMES[clip];
  const c = Math.max(0, Math.min(nf - 1.001, k60(clip, s)));
  const w = speed * 1.5; // largura do obturador em fotogramas de 60 fps
  const acc = new Map<number, number>();
  if (w <= 1) {
    const f0 = Math.floor(c);
    const fr = c - f0;
    acc.set(f0, 1 - fr);
    if (fr > 0.02) acc.set(Math.min(nf - 1, f0 + 1), fr);
  } else {
    const n = Math.min(5, Math.ceil(w) + 1);
    for (let i = 0; i < n; i++) {
      const p = c - w / 2 + (w * i) / (n - 1);
      const f = Math.max(0, Math.min(nf - 1, Math.round(p)));
      acc.set(f, (acc.get(f) ?? 0) + 1);
    }
  }
  const tot = [...acc.values()].reduce((a, b) => a + b, 0);
  return [...acc.entries()].sort((a, b) => a[0] - b[0]).map(([f, wt]) => ({ f, w: wt / tot }));
};

// fotograma de corte (arredondado): planos, pretos e transições usam todos o mesmo
export const cutF = (b: number) => Math.round(bf(b));

export const shotIndexAt = (frame: number) => {
  for (let i = SHOTS.length - 1; i >= 0; i--) if (frame >= cutF(SHOTS[i].b[0])) return i;
  return 0;
};
