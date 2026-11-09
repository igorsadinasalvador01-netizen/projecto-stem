import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PerfilCard } from "../components/PerfilFinal";
import { loadFonts } from "../fonts";
import { clamp } from "../kit/Kit";
import { C, loadFonts22, MOVE, OUT } from "./theme23";
import { M, OUT_FRAMES, OUT_LEN, punch } from "./cuts23";
import HEAD from "./head23.json";
import { Big, Glass, GLASS, k, Mono, Wide } from "./Kit23";
import { Bathroom, Cause, Chapter, Confirm, Hook, Install, Keep, Lesson } from "./Scenes23";
import TL from "./timeline23.json";
import wordsJson from "./words23.json";

loadFonts();
loadFonts22();

// ——— Vídeo 23 · "Dois centímetros": a dinâmica do vídeo 22 elevada — o quadrado segue o rosto,
// vidro vazio com entradas em 3D, tipografia letra a letra, indicador de capítulo, teclas que
// "batem" nas legendas, P&B nas falas trágicas ———
export const OUTRO23 = 4.0;
export const TOTAL23 = OUT_LEN + OUTRO23;
const END = 64.3;

// ——— onde está a pessoa (quadrado com a imagem real, nunca recortada) ———
type Mode = "hero" | "left" | "right" | "tl" | "tr" | "end";
const LAY: Record<Mode, { x: number; y: number; s: number }> = {
  hero: { x: 560, y: 64, s: 800 },
  left: { x: 96, y: 92, s: 760 },
  right: { x: 1064, y: 92, s: 760 },
  tl: { x: 44, y: 44, s: 300 },
  tr: { x: 1576, y: 44, s: 300 },
  end: { x: 760, y: 280, s: 400 },
};
const PKEYS = (TL.pkeys as [number, Mode][]).map(([at, mode]) => ({ at, mode }));
const personAt = (to: number) => {
  let i = 0;
  while (i + 1 < PKEYS.length && M(PKEYS[i + 1].at) <= to) i++;
  const cur = PKEYS[i];
  const prev = PKEYS[Math.max(0, i - 1)];
  const u = (to - M(cur.at)) / 0.62;
  const p = MOVE(Math.min(1, Math.max(0, u)));
  const A = LAY[prev.mode];
  const B = LAY[cur.mode];
  const lerp = (a: number, b: number) => a + (b - a) * p;
  return {
    x: lerp(A.x, B.x),
    y: lerp(A.y, B.y),
    s: lerp(A.s, B.s),
    gone: cur.mode === "end" ? p : 0,
    moving: u > 0 && u < 1 && prev.mode !== cur.mode ? Math.sin(Math.PI * p) : 0,
  };
};

// ——— zooms estratégicos ("puxadas"): rápidos, seguram e soltam ———
const env = (to: number, at: number, hold: number, rel: number) => {
  const u = to - M(at);
  if (u < 0) return 0;
  if (u < 0.16) return OUT(u / 0.16);
  if (u < hold) return 1;
  return 1 - Easing.inOut(Easing.cubic)(Math.min(1, (u - hold) / rel));
};
const zoomAt = (to: number) => {
  let z = 0;
  for (const [at, a] of TL.punch as [number, number][]) z = Math.max(z, a * env(to, at, 1.5, 0.5));
  for (const [a, b, amt] of TL.push as [number, number, number][]) z += amt * Easing.inOut(Easing.sin)(interpolate(to, [M(a), M(b)], [0, 1], clamp)) * (1 - interpolate(to, [M(b), M(b) + 0.5], [0, 1], clamp));
  return z;
};
const stageAt = (to: number) => {
  let s = 0;
  for (const [at] of TL.punch as [number, number][]) s = Math.max(s, env(to, at, 0.22, 0.7));
  return 1 + 0.028 * s;
};
// preto e branco nas falas trágicas
const bwAt = (to: number) => {
  let g = 0;
  for (const [a, b] of TL.bw as [number, number][]) g = Math.max(g, interpolate(to, [M(a), M(a) + 0.22], [0, 1], { easing: OUT, ...clamp }) * (1 - interpolate(to, [M(b), M(b) + 0.32], [0, 1], { easing: Easing.inOut(Easing.cubic), ...clamp })));
  return g;
};

// ——— cenário original: sala de reunião noturna em vidro (scripts/scene-v22.py) ———
const Scenery: React.FC<{ to: number; px: number; bw: number }> = ({ to, px, bw }) => {
  const dx = Math.sin(to * 0.05) * 26 - px;
  const dy = Math.cos(to * 0.04) * 10;
  const sc = 1.0 + 0.015 * Math.sin(to * 0.031);
  return (
    <AbsoluteFill style={{ filter: bw > 0.001 ? `grayscale(${bw}) brightness(${1 - 0.12 * bw}) contrast(${1 + 0.1 * bw})` : undefined }}>
      <Img src={staticFile("v23/scene_branco.png")} style={{ position: "absolute", left: -96, top: -54, width: 2112, height: 1188, transform: `translate(${dx}px, ${dy}px) scale(${sc})` }} />
    </AbsoluteFill>
  );
};
// ——— a pessoa num quadrado de vidro (imagem real com a sala dela) ———
// rosto por fotograma da montagem (1080×1920), já suavizado: o quadrado acompanha-o com calma
const FACES = HEAD as [number, number][];
const faceAt = (frame: number) => {
  const f = FACES[Math.max(0, Math.min(FACES.length - 1, frame))];
  return { x: f[0], y: f[1] };
};
const Person: React.FC<{ to: number; frame: number; bw: number }> = ({ to, frame, bw }) => {
  const st = personAt(to);
  const s = st.s;
  const FACE = faceAt(Math.min(frame, OUT_FRAMES - 2));
  const z = punch(to) * (1 + zoomAt(to));
  const W = s * z;
  const H = (W * 1920) / 1080;
  const left = s / 2 - (FACE.x / 1080) * W;
  const top = 0.42 * s - (FACE.y / 1080) * W;
  const r = Math.max(16, s * 0.045);
  const last = OUT_FRAMES - 2;
  const v = <OffthreadVideo src={staticFile("v23/plate_c.mp4")} muted style={{ width: W, height: H }} />;
  const vid = frame > last ? (
    <Freeze frame={last} active>
      {v}
    </Freeze>
  ) : (
    v
  );
  const op = 1 - st.gone;
  if (op <= 0.001) return null;
  const handle = interpolate(to, [0.5, 0.9], [0, 1], { easing: OUT, ...clamp }) * interpolate(to, [M(5.6), M(6.86)], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: st.x - 12,
        top: st.y - 12,
        width: s + 24,
        height: s + 24,
        borderRadius: r + 12,
        opacity: op,
        transform: `scale(${1 - 0.03 * st.moving})`,
        filter: st.moving > 0.15 ? `blur(${(st.moving - 0.15) * 2.2}px)` : undefined,
        ...GLASS,
      }}
    >
      <div style={{ position: "absolute", left: 12, top: 12, width: s, height: s, borderRadius: r, overflow: "hidden", background: "#0B0F17" }}>
        <div style={{ position: "absolute", left, top, filter: `contrast(${1.05 + 0.15 * bw}) saturate(${1.06 * (1 - bw)}) brightness(${1.05 - 0.07 * bw})` }}>{vid}</div>
        {handle > 0.01 && (
          <div style={{ position: "absolute", left: 26, bottom: 26, display: "flex", alignItems: "center", gap: 12, padding: "10px 20px 10px 14px", borderRadius: 99, background: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.95)", boxShadow: "0 8px 20px -10px rgba(11,24,48,0.35)", opacity: handle, transform: `translateY(${(1 - handle) * 16}px)` }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: C.blue }} />
            <span style={{ fontFamily: C.ui, fontWeight: 700, fontSize: 26, color: C.ink }}>@sergio_salvador10</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ——— legendas escritas ao teclado (letra a letra, no início exato de cada palavra) ———
type Wd = { text: string; start: number; end: number };
const WORDS = wordsJson as Wd[];
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}]/gu, "");
const RED = new Set(["pressas", "ninguém", "incompatibilidade", "cortar", "adaptar", "corrigir", "erro", "custar", "depressa"]);
const GREEN = new Set(["evitar", "retrabalhos", "poupar", "tempo", "dinheiro", "recursos"]);
const BLUE = new Set(["centímetros", "revestimento", "medições", "dimensões", "instalação", "problema", "execução", "rigor", "medição", "verificação", "produtividade", "engenharia", "civil", "guarda", "custo", "materiais"]);
export const toneOf = (w: Wd): string | null => {
  const n = norm(w.text);
  if (n === "tempo" && w.start > 63) return C.red; // "detectou a tempo"
  if (n === "erro") return C.red;
  if (RED.has(n)) return C.red;
  if (GREEN.has(n)) return C.green;
  if (BLUE.has(n)) return C.blue;
  return null;
};
// duração da escrita de cada palavra (o som do teclado usa a MESMA regra: scripts/gen-v22-audio.py)
export const typeDur = (w: Wd) => Math.min(0.24, Math.max(0.09, 0.035 * [...w.text].length), Math.max(0.06, (M(w.end) - M(w.start)) * 0.85));
const CHUNKS: { w: Wd[]; a: number; b: number }[] = (() => {
  const out: { w: Wd[]; a: number; b: number }[] = [];
  let cur: Wd[] = [];
  const flush = () => {
    if (cur.length) out.push({ w: cur, a: cur[0].start, b: cur[cur.length - 1].end });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    const len = cur.reduce((s, x) => s + x.text.length + 1, 0);
    if (cur.length && (len + w.text.length > 26 || cur.length >= 5 || (prev && w.start - prev.end > 0.3) || /[.?!,]$/.test(prev?.text ?? ""))) flush();
    cur.push(w);
  });
  flush();
  return out;
})();
const hidden = (t: number) => (TL.hideCaps as [number, number][]).some(([a, b]) => t >= a && t < b);
// largura do texto já escrito (a barra de vidro cresce à medida que se escreve)
let ctx2d: CanvasRenderingContext2D | null = null;
const textW = (s: string) => {
  if (!s) return 0;
  if (!ctx2d) ctx2d = document.createElement("canvas").getContext("2d");
  if (!ctx2d) return s.length * 24;
  ctx2d.font = `800 46px "${C.ui}"`;
  (ctx2d as unknown as { letterSpacing: string }).letterSpacing = "-0.46px";
  return ctx2d.measureText(s).width;
};
const GAP = 14;
// cada tecla "bate": a letra nasce 22% maior e um pouco acima e assenta em 70 ms
const keyPop = (to: number, at: number) => {
  const u = (to - at) / 0.07;
  if (u < 0 || u >= 1) return undefined;
  const e = OUT(u);
  return `translateY(${(1 - e) * -5}px) scale(${1 + 0.22 * (1 - e)})`;
};
const PADX = 30;
const Captions: React.FC<{ to: number; bw: number }> = ({ to, bw }) => {
  const i = CHUNKS.findIndex((ch, j) => to >= M(ch.a) && to < Math.min(M(ch.b) + 0.45, j + 1 < CHUNKS.length ? M(CHUNKS[j + 1].a) : 1e9));
  if (i < 0) return null;
  const c = CHUNKS[i];
  if (hidden(c.a)) return null;
  const pin = interpolate(to, [M(c.a), M(c.a) + 0.14], [0, 1], { easing: OUT, ...clamp });
  const nextA = i + 1 < CHUNKS.length ? M(CHUNKS[i + 1].a) : 1e9;
  const pout = to > M(c.b) + 0.3 && to < nextA ? interpolate(to, [M(c.b) + 0.3, M(c.b) + 0.45], [1, 0], clamp) : 1;
  // quantos caracteres de cada palavra já foram escritos → cursor e largura da barra
  const typed = c.w.map((w) => {
    const n = [...w.text].length;
    let m = 0;
    for (let ci = 0; ci < n; ci++) if (to >= M(w.start) + (ci / n) * typeDur(w)) m = ci + 1;
    return m;
  });
  let lastW = -1;
  typed.forEach((m, wi) => {
    if (m > 0) lastW = wi;
  });
  const started = typed.filter((m) => m > 0).length;
  const wTyped = c.w.reduce((acc, w, wi) => acc + textW([...w.text].slice(0, typed[wi]).join("")), 0) + GAP * Math.max(0, started - 1);
  const barW = wTyped + 2 * PADX + 12;
  const blink = Math.sin(to * Math.PI * 3.4) > -0.25 ? 1 : 0.25;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 918, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", opacity: Math.min(1, pin * 1.5) * pout, transform: `translateY(${(1 - pin) * 12}px) scale(${0.96 + 0.04 * pin})` }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: barW,
            borderRadius: 22,
            ...GLASS,
          }}
        />
        <div style={{ position: "relative", display: "flex", columnGap: GAP, padding: `14px ${PADX + 12}px 16px ${PADX}px` }}>
          {c.w.map((w, wi) => {
            const t0 = toneOf(w);
            const col = t0 && bw > 0.5 && t0 !== C.red ? null : t0;
            const chars = [...w.text];
            const done = interpolate(to, [M(w.start) + typeDur(w), M(w.start) + typeDur(w) + 0.18], [0, 1], { easing: OUT, ...clamp });
            return (
              <span key={wi} style={{ position: "relative", fontFamily: C.ui, fontWeight: 800, fontSize: 46, letterSpacing: "-0.01em", color: col ?? C.ink, whiteSpace: "nowrap" }}>
                {chars.map((ch, ci) => (
                  <span key={ci} style={{ position: "relative", display: "inline-block", whiteSpace: "pre", opacity: ci < typed[wi] ? 1 : 0, transform: keyPop(to, M(w.start) + (ci / chars.length) * typeDur(w)) }}>
                    {ch}
                    {wi === lastW && ci === typed[wi] - 1 && <span style={{ position: "absolute", right: -7, top: 6, width: 4, height: 46, borderRadius: 2, background: C.blue, opacity: blink }} />}
                  </span>
                ))}
                {col && <span style={{ position: "absolute", left: 0, right: 0, bottom: 2, height: 4, borderRadius: 2, background: col, transformOrigin: "0 50%", transform: `scaleX(${done})`, opacity: 0.9 }} />}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ——— transições de filtro: mergulho escuro ao entrar no P&B, clarão ao voltar a cor ———
const Flashes: React.FC<{ to: number }> = ({ to }) => {
  let dip = 0;
  let flash = 0;
  for (const [a, b] of TL.bw as [number, number][]) {
    const u = to - M(a);
    if (u >= 0 && u < 0.45) dip = Math.max(dip, Math.sin((Math.PI * Math.min(u, 0.45)) / 0.45) * (u < 0.12 ? u / 0.12 : 1));
    const v = to - M(b);
    if (v >= 0 && v < 0.5) flash = Math.max(flash, 1 - v / 0.5);
  }
  return (
    <>
      {dip > 0.01 && <AbsoluteFill style={{ background: "rgba(11,24,48,1)", opacity: 0.2 * dip }} />}
      {flash > 0.01 && <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,255,255,1), rgba(255,255,255,0.35) 55%, rgba(0,0,0,0) 85%)", opacity: 0.18 * Easing.in(Easing.quad)(flash) }} />}
    </>
  );
};

const Finish: React.FC<{ frame: number; bw: number }> = ({ frame, bw }) => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 46%, rgba(11,24,48,0) 62%, rgba(11,24,48,0.10) 100%)" }} />
    {bw > 0.01 && <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 46%, rgba(11,24,48,0) 55%, rgba(11,24,48,0.22) 100%)", opacity: bw }} />}
    <Img src={staticFile(`v22/grain/g${String((frame * 7) % 24).padStart(2, "0")}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, mixBlendMode: "overlay", opacity: 0.07 }} />
  </>
);

// ——— fecho: "Siga o perfil" + o perfil ORIGINAL (sem alterações; só o toque em "Seguir") ———
const Ending: React.FC<{ to: number; fps: number }> = ({ to, fps }) => {
  const a = M(END);
  if (to < a) return null;
  const p = interpolate(to, [a + 0.15, a + 0.85], [0, 1], { easing: OUT, ...clamp });
  const p2 = interpolate(to, [a + 0.4, a + 1.1], [0, 1], { easing: OUT, ...clamp });
  return (
    <>
      <Glass x={110} y={300} w={780} h={420} p={p}>
        <div style={{ position: "absolute", left: 54, top: 50, display: "flex", flexDirection: "column", gap: 18 }}>
          <Mono p={p}>instagram</Mono>
          <Big text="SIGA O PERFIL" size={136} fill={C.blue} p={p} mode="slam" />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: C.blue }} />
            <span style={{ fontFamily: C.ui, fontWeight: 800, fontSize: 40, color: C.ink }}>@sergio_salvador10</span>
          </div>
          <Wide size={20} color={C.mute}>
            Igor Sadina
          </Wide>
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 990, top: 226, opacity: p2, transform: `translateX(${(1 - p2) * 70}px) scale(${0.95 + 0.05 * p2})` }}>
        <PerfilCard width={800} tapAt={Math.round((a + 2.0) * fps)} />
      </div>
    </>
  );
};

// indicador de capítulo (topo ao centro): pill de vidro vazio com o capítulo atual e o progresso
const CHAPS = TL.chapters as [number, string][];
const Tracker: React.FC<{ to: number }> = ({ to }) => {
  const a = M(CHAPS[1][0]);
  if (to < a || to >= M(END)) return null;
  let i = 1;
  while (i + 1 < CHAPS.length && to >= M(CHAPS[i + 1][0])) i++;
  const start = M(CHAPS[i][0]);
  const end = i + 1 < CHAPS.length ? M(CHAPS[i + 1][0]) : M(END);
  const p = interpolate(to, [start, start + 0.45], [0, 1], { easing: OUT, ...clamp });
  const fill = interpolate(to, [start, end], [0, 1], clamp);
  const fade = interpolate(to, [a, a + 0.4], [0, 1], clamp) * interpolate(to, [M(END) - 0.3, M(END)], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 14, display: "flex", justifyContent: "center", opacity: fade }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, padding: "8px 20px 10px", borderRadius: 99, ...GLASS, overflow: "hidden" }}>
        {CHAPS.slice(1).map((c, j) => (
          <div key={j} style={{ width: 8, height: 8, borderRadius: 4, background: j + 1 === i ? C.blue : j + 1 < i ? "rgba(11,24,48,0.6)" : "rgba(11,24,48,0.18)" }} />
        ))}
        <div style={{ fontFamily: C.mono, fontSize: 16, letterSpacing: "0.16em", textTransform: "uppercase", color: C.ink, opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>{CHAPS[i][1]}</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${fill * 100}%`, background: C.blue }} />
      </div>
    </div>
  );
};

export type Video23Props = { music: boolean };
export const Video23: React.FC<Video23Props> = ({ music }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const to = frame / fps;
  const bw = bwAt(to);
  const st = personAt(to);
  const px = (st.x + st.s / 2 - 960) * 0.04; // paralaxe: o cenário desliza ao contrário da pessoa
  const stage = stageAt(to);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ transform: `scale(${stage})`, transformOrigin: "50% 46%" }}>
        <Scenery to={to} px={px} bw={bw} />
        <Person to={to} frame={frame} bw={bw} />
        <Hook to={to} />
        <Chapter
          to={to}
          a={6.86}
          b={8.16}
          num="01"
          label="a situação"
          right={<Big text="IMAGINE" size={150} p={k(to, 6.98, 0.6)} mode="letters" />}
        />
        <Bathroom to={to} />
        <Confirm to={to} />
        <Install to={to} />
        <Cause to={to} />
        <ErrorScene to={to} />
        <Lesson to={to} />
        <Keep to={to} />
        <Ending to={to} fps={fps} />
      </AbsoluteFill>
      <Tracker to={to} />
      <Captions to={to} bw={bw} />
      <Flashes to={to} />
      <Finish frame={frame} bw={bw} />
      {music && <Audio src={staticFile("audio23.m4a")} />}
    </AbsoluteFill>
  );
};

// ——— 5 · o erro de muitos profissionais (hero; P&B em "cometem um erro") ———
const ErrorScene: React.FC<{ to: number }> = ({ to }) => {
  const o = 1 - interpolate(to, [M(46.72), M(46.72) + 0.24], [0, 1], clamp);
  if (to < M(38.67) || o <= 0) return null;
  const ex: React.CSSProperties = { opacity: o, filter: o < 0.99 ? `blur(${(1 - o) * 8}px)` : undefined };
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 190, width: 460, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, ...ex }}>
        <Mono p={k(to, 38.88)}>é aqui onde</Mono>
        <Big text="MUITOS" size={110} p={k(to, 39.68, 0.45)} />
        <Big text="PROFISSIONAIS" size={92} p={k(to, 40.0, 0.5)} mode="letters" />
        <Big text="COMETEM" size={110} fill={C.red} p={k(to, 40.72, 0.4)} mode="slam" />
        <Big text="UM ERRO" size={150} fill={C.red} p={k(to, 41.2, 0.4)} mode="slam" />
      </div>
      <div style={{ position: "absolute", left: 1400, top: 230, width: 470, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, ...ex }}>
        <Mono p={k(to, 41.83)}>acreditam que a</Mono>
        <Big text="PRODUTIVIDADE" size={84} fill={C.blue} p={k(to, 42.8, 0.6)} mode="letters" />
        <Wide size={22} color={C.ink2} p={k(to, 43.76)}>
          está em
        </Wide>
        <Big text="TRABALHAR" size={100} p={k(to, 44.4, 0.45)} />
        <Big text="DEPRESSA" size={120} p={k(to, 44.96, 0.4)} mode="slam" />
      </div>
    </>
  );
};
