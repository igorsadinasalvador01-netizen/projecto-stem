// Vídeo 9 — versão horizontal (1920×1080), moderna e premium.
// Mesma voz limpa de pausas (public/v9/voz.wav) e mesmos tempos por palavra (edit9.json);
// muda a linguagem visual: um arco emocional de luz em três atos —
//   noite (o problema) → nascer do sol (a virada) → luz do dia (a mensagem).
import { TOTAL9, VOICE_END, WORDS, Word } from "../v9/timeline9";

export { t9, TOTAL9, VOICE_END, WORDS } from "../v9/timeline9";

export type Act = "night" | "dawn" | "day";
export type LayoutH = "face" | "split" | "graphic" | "quote";

export const ACT2H = 16.37;
export const ACT3H = 39.3;
export const actAt = (t: number): Act => (t < ACT2H ? "night" : t < ACT3H ? "dawn" : "day");

export type SceneH = { id: string; from: number; to: number; layout: LayoutH };
export const SCENESH: SceneH[] = [
  // noite — o problema
  { id: "a1", from: 0, to: 2.43, layout: "face" },
  { id: "a2", from: 2.43, to: 5.47, layout: "graphic" },
  { id: "a3", from: 5.47, to: 10.37, layout: "graphic" },
  { id: "a4", from: 10.37, to: 14.27, layout: "split" },
  { id: "a5", from: 14.27, to: ACT2H, layout: "graphic" },
  // nascer do sol — a virada
  { id: "b1", from: ACT2H, to: 18.4, layout: "face" },
  { id: "b2", from: 18.4, to: 20.95, layout: "graphic" },
  { id: "b3", from: 20.95, to: 26.37, layout: "graphic" },
  { id: "b4", from: 26.37, to: 27.6, layout: "quote" },
  { id: "b5", from: 27.6, to: 33.07, layout: "graphic" },
  { id: "b6", from: 33.07, to: 37.0, layout: "graphic" },
  { id: "b7", from: 37.0, to: ACT3H, layout: "split" },
  // luz do dia — a mensagem
  { id: "c1", from: ACT3H, to: 40.0, layout: "face" },
  { id: "c2", from: 40.0, to: 43.07, layout: "graphic" },
  { id: "c3", from: 43.07, to: 48.47, layout: "graphic" },
  { id: "c4", from: 48.47, to: 50.8, layout: "graphic" },
  { id: "c5", from: 50.8, to: 55.3, layout: "graphic" },
  { id: "c6", from: 55.3, to: 58.1, layout: "face" },
  { id: "c7", from: 58.1, to: TOTAL9, layout: "split" },
];
export const sceneHAt = (t: number) => SCENESH.find((s) => t >= s.from && t < s.to) ?? SCENESH[SCENESH.length - 1];

// legendas mais longas (o ecrã horizontal tem espaço): até 4 palavras / ~26 caracteres
export type ChunkH = { words: Word[]; start: number; end: number };
export const CHUNKSH: ChunkH[] = (() => {
  const out: ChunkH[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    const len = cur.reduce((a, x) => a + x.text.length + 1, 0);
    const sceneChange = prev && sceneHAt(prev.start).id !== sceneHAt(w.start).id;
    if (cur.length && (sceneChange || w.start - prev.end > 0.3 || len + w.text.length > 26)) flush();
    cur.push(w);
    if (/[.,!?]$/.test(w.text) || cur.length >= 4) flush();
  });
  flush();
  for (let i = 0; i < out.length - 1; i++) out[i].end = Math.min(out[i + 1].start, out[i].end + 0.5);
  out[out.length - 1].end += 0.4;
  return out;
})();

export { VOICE_END as VOICE_END_H };
export const TOTALH = TOTAL9;
