import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PerfilCard } from "../components/PerfilFinal";
import { loadFonts } from "../fonts";
import { clamp } from "../kit/Kit";
import { M, OUT_FRAMES, OUT_LEN, punch } from "../v21/cuts21";
import wordsJson from "../v21/words21.json";
import { BigWord, Brief, Calm, Chat, Focus, k, Keep, Mono, Pitch, Sellers, Solution, TextBlock, WinBadge } from "./Graphics21b";
import { CARD, FACE, FACE_IN_CARD, L, PK } from "./theme21b";

loadFonts();

// ——— Vídeo 21 v2 · estilo claro da referência, com textos grandes por trás da pessoa ———
export const OUTRO21B = 4.0;
export const TOTAL21B = OUT_LEN + OUTRO21B;
const MOVE = Easing.bezier(0.65, 0, 0.35, 1);

// a pessoa: cartão (imagem real) ou recorte (com o texto grande por trás); marcas no tempo ORIGINAL
type Mode = "card" | "cut" | "end";
const PKEYS: { at: number; cx: number; mode: Mode }[] = [
  { at: -1, cx: 960, mode: "card" },
  { at: 6.3, cx: 960, mode: "cut" }, // COMPREENDER
  { at: 9.6, cx: 960, mode: "card" },
  { at: 11.4, cx: 1460, mode: "card" }, // pedido do empresário
  { at: 15.75, cx: 440, mode: "card" }, // o primeiro vendedor
  { at: 23.05, cx: 960, mode: "card" }, // o segundo vendedor
  { at: 26.6, cx: 1460, mode: "card" }, // a pergunta
  { at: 30.5, cx: 440, mode: "card" }, // a resposta
  { at: 39.55, cx: 960, mode: "cut" }, // DIFERENÇA
  { at: 41.4, cx: 960, mode: "card" },
  { at: 46.9, cx: 960, mode: "cut" }, // PRODUTIVIDADE
  { at: 48.4, cx: 1460, mode: "card" }, // obra → solução
  { at: 53.45, cx: 960, mode: "cut" }, // COMUM → ESTRATÉGICO
  { at: 57.75, cx: 1460, mode: "card" }, // frase-chave
  { at: 61.95, cx: 960, mode: "card" },
  { at: 65.15, cx: 960, mode: "cut" }, // VANTAGEM
  { at: 67.95, cx: 960, mode: "end" },
];
const val = (m: Mode) => (m === "cut" ? 1 : 0);
const personAt = (to: number) => {
  let i = 0;
  while (i + 1 < PKEYS.length && M(PKEYS[i + 1].at) <= to) i++;
  const cur = PKEYS[i];
  const prev = PKEYS[Math.max(0, i - 1)];
  const u = (to - M(cur.at)) / 0.6;
  const p = MOVE(Math.min(1, Math.max(0, u)));
  const pm = MOVE(Math.min(1, Math.max(0, (to - M(cur.at)) / 0.42)));
  const cx = prev.cx + (cur.cx - prev.cx) * p;
  const cut = val(prev.mode) + (val(cur.mode) - val(prev.mode)) * pm;
  const moving = cur.cx !== prev.cx && u > 0 && u < 1 ? Math.sin(Math.PI * p) : 0;
  const gone = cur.mode === "end" ? pm : 0;
  return { cx, cut, moving, gone };
};

// tela clara com manchas pastel em deriva muito lenta
const Canvas: React.FC<{ to: number }> = ({ to }) => {
  const a = Math.sin(to * 0.15) * 4;
  const b = Math.cos(to * 0.11) * 4;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${86 + a}% ${8 + b}%, rgba(118,165,255,0.24), rgba(118,165,255,0) 38%), radial-gradient(circle at ${8 - b}% ${94 + a}%, rgba(110,215,175,0.22), rgba(110,215,175,0) 40%), radial-gradient(circle at ${55 + b}% ${55 - a}%, rgba(255,255,255,0.9), rgba(255,255,255,0) 60%), ${L.canvas}`,
      }}
    />
  );
};

// geometria comum ao cartão e ao recorte: o rosto fica sempre no mesmo ponto do cartão
const geom = (cx: number, z: number) => {
  const s = PK * z;
  const left = cx - CARD.w / 2;
  return { s, cardLeft: left, imgLeft: left + FACE_IN_CARD.x - FACE.x * s, imgTop: CARD.top + FACE_IN_CARD.y - FACE.y * s };
};
const Person: React.FC<{ to: number; frame: number }> = ({ to, frame }) => {
  const st = personAt(to);
  const z = punch(to);
  const g = geom(st.cx, z);
  const sc = 1 - 0.025 * st.moving;
  const last = OUT_FRAMES - 2;
  const frozen = frame > last;
  const vid = (file: string, transparent: boolean) => {
    const v = <OffthreadVideo src={staticFile(file)} muted transparent={transparent} style={{ width: 1080 * g.s, height: 1920 * g.s }} />;
    return frozen ? (
      <Freeze frame={last} active>
        {v}
      </Freeze>
    ) : (
      v
    );
  };
  const mask = "linear-gradient(to bottom, #000 72%, transparent 97%), linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)";
  const op = 1 - st.gone;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, transform: `scale(${sc * (1 - 0.05 * st.gone)})`, transformOrigin: `${st.cx}px 540px` }}>
      {st.cut > 0.001 && (
        <div style={{ position: "absolute", left: g.imgLeft, top: g.imgTop, width: 1080 * g.s, height: 1920 * g.s, opacity: st.cut, WebkitMaskImage: mask, WebkitMaskComposite: "source-in", maskImage: mask, maskComposite: "intersect", filter: "drop-shadow(0 30px 40px rgba(14,17,22,0.18))" }}>
          {vid("v21b/fg_c.webm", true)}
        </div>
      )}
      {st.cut < 0.999 && (
        <div style={{ position: "absolute", left: g.cardLeft, top: CARD.top, width: CARD.w, height: CARD.h, borderRadius: CARD.r, overflow: "hidden", opacity: 1 - st.cut, boxShadow: "0 50px 90px -40px rgba(14,17,22,0.45), 0 14px 30px -16px rgba(14,17,22,0.25)", background: "#222" }}>
          <div style={{ position: "absolute", left: g.imgLeft - g.cardLeft, top: g.imgTop - CARD.top }}>{vid("v21b/plate_c.mp4", false)}</div>
        </div>
      )}
    </div>
  );
};

// ——— legendas dinâmicas (pill branca, palavra a palavra, cores com intenção) ———
type Wd = { text: string; start: number; end: number };
const WORDS = wordsJson as Wd[];
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}]/gu, "");
const RED = new Set(["perdem", "mal", "organizado", "preocupado", "obra", "comum"]);
const GREEN = new Set(["conquistou", "solução", "melhoraria", "negócio", "estratégico", "enormes"]);
const BLUE = new Set(["vendedores", "reunião", "empresário", "empresa", "remodelação", "materiais", "preço", "serviço", "pergunta", "calma", "friamente", "incomoda", "funcionários", "diferença", "problema", "produtividade", "separa", "profissional", "real", "guarda", "negociação", "cliente"]);
const tone = (w: Wd): string | null => {
  const n = norm(w.text);
  if (n === "vender" && Math.abs(w.start - 4.4) < 0.2) return L.red;
  if (n === "compreender") return L.green;
  if (n === "compreende") return L.green;
  if (n === "tempo" && w.start > 34) return L.red;
  if (n === "vantagens") return w.start > 60 ? L.green : L.blue;
  if (RED.has(n)) return L.red;
  if (GREEN.has(n)) return L.green;
  if (BLUE.has(n)) return L.blue;
  return null;
};
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
    if (cur.length && (len + w.text.length > 20 || cur.length >= 4 || (prev && w.start - prev.end > 0.3) || /[.?!,]$/.test(prev?.text ?? ""))) flush();
    cur.push(w);
  });
  flush();
  return out;
})();
const hideCaps = (to: number) => [[26.88, 30.35], [57.92, 61.95]].some(([a, b]) => to >= M(a) && to < M(b)) || to >= M(67.95);
const Captions: React.FC<{ to: number }> = ({ to }) => {
  if (hideCaps(to)) return null;
  const c = CHUNKS.find((ch) => to >= M(ch.a) - 0.04 && to < M(ch.b) + 0.3);
  if (!c) return null;
  const st = personAt(to);
  const x = st.cut > 0.5 ? 960 : st.cx;
  const pin = interpolate(to, [M(c.a) - 0.04, M(c.a) + 0.12], [0, 1], { easing: Easing.out(Easing.back(1.6)), ...clamp });
  const pout = interpolate(to, [M(c.b) + 0.18, M(c.b) + 0.3], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x - 700, width: 1400, top: 964, display: "flex", justifyContent: "center", opacity: Math.min(1, pin * 1.4) * pout }}>
      <div style={{ display: "flex", columnGap: 13, padding: "12px 26px 14px", borderRadius: 18, background: "#fff", boxShadow: "0 18px 40px -18px rgba(14,17,22,0.35), 0 2px 8px rgba(14,17,22,0.08)", transform: `scale(${0.9 + 0.1 * pin})` }}>
        {c.w.map((w, i) => {
          const p = interpolate(to, [M(w.start) - 0.02, M(w.start) + 0.11], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
          const col = tone(w);
          return (
            <span key={i} style={{ display: "inline-block", fontFamily: L.ui, fontWeight: 700, fontSize: 46, letterSpacing: "-0.01em", color: col ?? L.ink, opacity: p, transform: `translateY(${(1 - p) * 8}px) scale(${0.85 + 0.15 * p})`, textDecoration: col ? "underline" : undefined, textDecorationThickness: 3, textUnderlineOffset: 7 }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// capítulos em pill (canto superior esquerdo, como na referência)
const CHAPTERS: [number, number, string, string][] = [
  [0.0, 38.45, "01", "A situação"],
  [38.56, 53.6, "02", "A diferença"],
  [53.68, 67.9, "03", "A lição"],
];
const Chapter: React.FC<{ to: number }> = ({ to }) => {
  const c = CHAPTERS.find(([a, b]) => to >= M(a) && to < M(b));
  if (!c) return null;
  const p = c[0] === 0 ? interpolate(to, [0.1, 0.5], [0, 1], clamp) : k(to, c[0], 0.4);
  const out = interpolate(to, [M(c[1]) - 0.2, M(c[1])], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: "#fff", boxShadow: "0 10px 24px -12px rgba(14,17,22,0.25)", opacity: p * out, transform: `translateY(${(1 - p) * -10}px)` }}>
      <Mono color={L.blue} size={18}>{c[2]}</Mono>
      <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 22, color: L.ink }}>{c[3]}</span>
    </div>
  );
};

// fecho: "Siga o perfil" + o perfil ORIGINAL (sem filtros; só o toque em "Seguir")
const Ending: React.FC<{ to: number; fps: number }> = ({ to, fps }) => {
  const a = M(67.95);
  if (to < a) return null;
  const p = interpolate(to, [a + 0.15, a + 0.85], [0, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1), ...clamp });
  const p2 = interpolate(to, [a + 0.45, a + 1.15], [0, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1), ...clamp });
  return (
    <>
      <div style={{ position: "absolute", left: 150, top: 300, width: 700, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
        <div style={{ fontFamily: L.serif, fontStyle: "italic", fontSize: 128, color: L.ink, lineHeight: 1 }}>Siga o perfil</div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 999, background: "#fff", boxShadow: "0 14px 30px -14px rgba(14,17,22,0.3)" }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="url(#ig21b)" strokeWidth={2}>
            <defs>
              <linearGradient id="ig21b" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#F9A23A" />
                <stop offset="0.5" stopColor="#E1306C" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <rect x={3} y={3} width={18} height={18} rx={5} />
            <circle cx={12} cy={12} r={4} />
            <circle cx={17.3} cy={6.7} r={0.6} fill="#E1306C" />
          </svg>
          <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 36, color: L.ink }}>@sergio_salvador10</span>
        </div>
        <div style={{ marginTop: 20, fontFamily: L.ui, fontSize: 26, color: L.gray }}>Igor Sadina</div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 220, opacity: p2, transform: `translateX(${(1 - p2) * 60}px) scale(${0.95 + 0.05 * p2})` }}>
        <PerfilCard width={780} tapAt={Math.round((a + 2.0) * fps)} />
      </div>
    </>
  );
};

export type Video21bProps = { music: boolean };
export const Video21b: React.FC<Video21bProps> = ({ music }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const to = frame / fps;
  return (
    <AbsoluteFill style={{ background: L.canvas }}>
      <Canvas to={to} />
      {/* textos GRANDES por trás da pessoa (só nos destaques, em modo recorte) */}
      <BigWord to={to} at={6.64} until={9.75} text="COMPREENDER" size={232} />
      <BigWord to={to} at={40.08} until={41.55} text="DIFERENÇA" size={270} />
      <BigWord to={to} at={47.36} until={48.55} text="PRODUTIVIDADE" size={200} />
      <BigWord to={to} at={55.52} until={56.96} text="COMUM" size={290} tone="gray" strikeAt={56.34} exitUp />
      <BigWord to={to} at={56.96} until={57.9} text="ESTRATÉGICO" size={236} />
      <BigWord to={to} at={65.6} until={68.1} text="VANTAGEM" size={290} />
      <Person to={to} frame={frame} />
      <Sellers to={to} />
      <WinBadge to={to} />
      <Brief to={to} />
      <Pitch to={to} />
      <Calm to={to} />
      <TextBlock
        to={to}
        a={26.88}
        b={30.45}
        label="Vendedor 2 · pergunta"
        rows={[
          [[26.88, "O"], [27.04, "que"], [27.13, "atualmente"]],
          [[28.24, "mais"], [28.56, "te"], [28.72, "incomoda", "serif"]],
          [[29.52, "neste"], [29.92, "espaço?", "bold"]],
        ]}
      />
      <Chat to={to} />
      <Focus to={to} />
      <Solution to={to} />
      <TextBlock
        to={to}
        a={57.92}
        b={61.95}
        rows={[
          [[57.92, "Não", "bold"], [58.24, "vendas", "bold"], [58.96, "soluções", "bold"]],
          [[59.68, "antes"], [60.0, "de"], [60.16, "compreenderes"]],
          [[60.49, "o"], [61.04, "real"], [61.36, "problema.", "serif"]],
        ]}
      />
      <Keep to={to} />
      <Chapter to={to} />
      <Captions to={to} />
      <Ending to={to} fps={fps} />
      {music && <Audio src={staticFile("audio21b.m4a")} />}
    </AbsoluteFill>
  );
};
