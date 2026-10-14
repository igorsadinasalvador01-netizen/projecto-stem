// Vídeo 9 — CONTEUDO A FAZER, editado com a estrutura do EXEMPLO.
//
// Estrutura extraída do EXEMPLO (Vinícius, 37 s): gancho com o rosto + legenda
// palavra a palavra; alternância de 3 layouts (rosto inteiro nas frases de impacto,
// ecrã dividido gráfico/rosto, gráfico inteiro com legenda em baixo); etiquetas de
// capítulo ("PASSO 1/2/3"); cursor e cartões de interface; zero pausas (cortes secos);
// CTA final com barra de comentário/notificação e cartão escuro com o perfil.
//
// O áudio original (69,0 s) foi limpo: só se removeu silêncio verdadeiro (< -50 dB),
// as pausas ficaram em micro-respirações, e a voz foi normalizada a -15 LUFS
// (public/v9/voz.wav). edit9.json guarda os cortes (fonte → novo tempo) e as palavras.
import edit from "./edit9.json";

export const FPS9 = 30;
export const VOICE_END = edit.totalFrames / FPS9; // 62,8 s
export const TAIL9 = 1.4; // cartão final
export const TOTAL9 = VOICE_END + TAIL9;

export type Word = { text: string; start: number; end: number; seg: number };
export const WORDS: Word[] = edit.words.map((w) => ({ text: w.text, start: w.start, end: w.end, seg: w.seg }));
export const CUTS = edit.cuts as { srcFrom: number; srcTo: number; dstFrom: number }[];

// procura a primeira palavra que começa com um texto, a partir de um instante
export const t9 = (text: string, after = 0) => {
  const w = WORDS.find((x) => x.start >= after - 0.01 && x.text.toLowerCase().replace(/[.,!?]/g, "").startsWith(text.toLowerCase()));
  if (!w) throw new Error(`palavra não encontrada: ${text} @${after}`);
  return w.start;
};

export type Mode = "nos" | "cin" | "his";
export type Layout = "face" | "split" | "graphic";
export type CapPos = "low" | "bottom" | "mid";

export const ACT2 = 16.37; // nostálgico → cinema
export const ACT3 = 39.3; // cinema → histórico

export type SceneDef = { id: string; from: number; to: number; mode: Mode; layout: Layout; cap: CapPos };

export const SCENES9: SceneDef[] = [
  // ——— 1 · NOSTÁLGICO — o problema (como era antes) ———
  { id: "n1", from: 0, to: 2.43, mode: "nos", layout: "face", cap: "low" },
  { id: "n2", from: 2.43, to: 5.47, mode: "nos", layout: "graphic", cap: "bottom" },
  { id: "n3", from: 5.47, to: 10.37, mode: "nos", layout: "graphic", cap: "bottom" },
  { id: "n4", from: 10.37, to: 14.27, mode: "nos", layout: "split", cap: "mid" },
  { id: "n5", from: 14.27, to: ACT2, mode: "nos", layout: "graphic", cap: "bottom" },
  // ——— 2 · CINEMA — a virada ———
  { id: "c1", from: ACT2, to: 18.4, mode: "cin", layout: "face", cap: "low" },
  { id: "c2", from: 18.4, to: 20.95, mode: "cin", layout: "graphic", cap: "bottom" },
  { id: "c3", from: 20.95, to: 26.37, mode: "cin", layout: "graphic", cap: "bottom" },
  { id: "c4", from: 26.37, to: 27.6, mode: "cin", layout: "face", cap: "low" },
  { id: "c5", from: 27.6, to: 33.07, mode: "cin", layout: "graphic", cap: "bottom" },
  { id: "c6", from: 33.07, to: 37.0, mode: "cin", layout: "graphic", cap: "bottom" },
  { id: "c7", from: 37.0, to: ACT3, mode: "cin", layout: "split", cap: "mid" },
  // ——— 3 · HISTÓRICO — a mensagem ———
  { id: "h1", from: ACT3, to: 40.0, mode: "his", layout: "face", cap: "low" },
  { id: "h2", from: 40.0, to: 43.07, mode: "his", layout: "graphic", cap: "bottom" },
  { id: "h3", from: 43.07, to: 48.47, mode: "his", layout: "graphic", cap: "bottom" },
  { id: "h4", from: 48.47, to: 50.8, mode: "his", layout: "graphic", cap: "bottom" },
  { id: "h5", from: 50.8, to: 55.3, mode: "his", layout: "graphic", cap: "bottom" },
  { id: "h6", from: 55.3, to: 58.1, mode: "his", layout: "face", cap: "low" },
  { id: "h7", from: 58.1, to: TOTAL9, mode: "his", layout: "face", cap: "low" },
];

export const modeAt = (t: number): Mode => (t < ACT2 ? "nos" : t < ACT3 ? "cin" : "his");
export const sceneAt = (t: number) => SCENES9.find((s) => t >= s.from && t < s.to) ?? SCENES9[SCENES9.length - 1];

// ——— legendas em blocos (como no EXEMPLO: 1–3 palavras, a ativa destacada) ———
export type Chunk = { words: Word[]; start: number; end: number };
export const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    const sceneChange = prev && sceneAt(prev.start).id !== sceneAt(w.start).id;
    const len = cur.reduce((a, x) => a + x.text.length + 1, 0);
    if (cur.length && (sceneChange || w.start - prev.end > 0.28 || len + w.text.length > 17)) flush();
    cur.push(w);
    if (/[.,!?]$/.test(w.text) || cur.length >= 3) flush();
  });
  flush();
  // cada bloco fica até ao início do seguinte (sem buracos)
  for (let i = 0; i < out.length - 1; i++) out[i].end = Math.min(out[i + 1].start, out[i].end + 0.5);
  out[out.length - 1].end += 0.4;
  return out;
})();
