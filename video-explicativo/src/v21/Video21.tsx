import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PerfilCard } from "../components/PerfilFinal";
import { loadFonts } from "../fonts";
import { clamp } from "../kit/Kit";
import { M, OUT_LEN, punch } from "./cuts21";
import { Answer, Brief, Chapter, Climax, Hook, KeyLine, Label, Pitch, Question, Reveal, Split, win } from "./Graphics21";
import { Cam, CAM, FACE, T21 as T } from "./theme21";
import wordsJson from "./words21.json";

loadFonts();

// ——— Vídeo 21 · documental 16:9: o sujeito (recortado) sobre o próprio espaço desfocado ———
export const OUTRO = 3.8;
export const TOTAL21 = OUT_LEN + OUTRO;
const MOVE = Easing.bezier(0.65, 0, 0.35, 1);

// câmara virtual: escala do recorte e posição do rosto, por marcas no tempo ORIGINAL da fala
const PIP: Cam = { s: 0.42, fx: 1670, fy: 650 };
const CORNER: Cam = { s: 0.5, fx: 330, fy: 700 };
const END: Cam = { s: 0.7, fx: 540, fy: 540 };
const KEYS: { at: number; cam: Cam; d: number }[] = [
  { at: -1, cam: CAM.med, d: 0.01 },
  { at: 7.52, cam: { s: 0.98, fx: 960, fy: 430 }, d: 0.45 }, // "só um"
  { at: 9.75, cam: CAM.wide, d: 0.9 }, // "Imagina esta situação"
  { at: 11.4, cam: PIP, d: 0.75 }, // empresário → empresa (PiP)
  { at: 15.75, cam: CAM.left, d: 0.8 }, // o primeiro vendedor
  { at: 23.05, cam: CAM.close, d: 0.8 }, // o segundo vendedor, calmo
  { at: 26.6, cam: CAM.rightClose, d: 0.7 }, // a pergunta
  { at: 30.35, cam: CAM.med, d: 0.5 }, // "E o cliente responde"
  { at: 31.4, cam: CORNER, d: 0.6 }, // freeze → canto
  { at: 37.7, cam: CAM.med, d: 0.6 }, // volta
  { at: 39.2, cam: CAM.xcu, d: 0.35 }, // "percebes a diferença?"
  { at: 40.6, cam: CAM.splitL, d: 0.7 }, // split screen
  { at: 53.45, cam: CAM.close, d: 0.7 }, // clímax
  { at: 57.75, cam: CAM.rightClose, d: 0.6 }, // frase-chave
  { at: 61.95, cam: CAM.med, d: 0.9 }, // conclusão
  { at: 67.95, cam: END, d: 0.8 }, // fecho
];
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const camAt = (to: number): Cam => {
  let i = 0;
  while (i + 1 < KEYS.length && M(KEYS[i + 1].at) <= to) i++;
  const cur = KEYS[i];
  const prev = KEYS[Math.max(0, i - 1)].cam;
  const p = MOVE(Math.min(1, Math.max(0, (to - M(cur.at)) / cur.d)));
  return { s: lerp(prev.s, cur.cam.s, p), fx: lerp(prev.fx, cur.cam.fx, p), fy: lerp(prev.fy, cur.cam.fy, p) };
};
const FREEZE: [number, number] = [31.4, 37.7];
const PIPWIN: [number, number] = [11.4, 15.75];
const inWin = (to: number, w: [number, number]) => to >= M(w[0]) && to < M(w[1]);

// fundo: o próprio espaço, sem o sujeito, desfocado (profundidade de campo) e com parallax
const Background: React.FC<{ cam: Cam; dark: number }> = ({ cam, dark }) => {
  const sc = 1 + (cam.s - 0.88) * 0.06;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("v21/bg_wide.png")} style={{ position: "absolute", left: -40 - (cam.fx - 960) * 0.05, top: -1060 - (cam.fy - 430) * 0.04, width: 2000, height: 3556, transform: `scale(${sc})`, transformOrigin: "50% 38%" }} />
      <AbsoluteFill style={{ background: `rgba(4,6,10,${0.18 + dark})` }} />
    </AbsoluteFill>
  );
};

// o recorte do sujeito, com fade suave nas margens (os ombros cortados pelo quadro vertical
// dissolvem-se no escuro) e, no freeze, um contorno fino de recorte
const Subject: React.FC<{ cam: Cam; frozen: number | null; rim: number; opacity: number }> = ({ cam, frozen, rim, opacity }) => {
  const w = 1080 * cam.s;
  const h = 1920 * cam.s;
  const mask = "linear-gradient(to bottom, #000 66%, transparent 96%), linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)";
  const vid = <OffthreadVideo src={staticFile("v21/fg_c.webm")} transparent muted style={{ width: w, height: h }} />;
  return (
    <div style={{ position: "absolute", left: cam.fx - FACE.x * cam.s, top: cam.fy - FACE.y * cam.s, width: w, height: h, opacity, filter: rim > 0.01 ? `drop-shadow(0 0 ${1.5 * rim}px rgba(255,255,255,${0.95 * rim})) drop-shadow(0 0 ${22 * rim}px rgba(47,123,255,${0.45 * rim}))` : undefined }}>
      <div style={{ width: w, height: h, WebkitMaskImage: mask, WebkitMaskComposite: "source-in", maskImage: mask, maskComposite: "intersect" }}>
        {frozen !== null ? (
          <Freeze frame={frozen} active>
            {vid}
          </Freeze>
        ) : (
          vid
        )}
      </div>
    </div>
  );
};

// picture-in-picture: a imagem real (com o espaço) numa moldura, no canto
const Pip: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0) return null;
  const kk = 0.42;
  return (
    <div style={{ position: "absolute", left: 1490, top: 410, width: 360, height: 480, borderRadius: 20, overflow: "hidden", opacity: p, transform: `scale(${0.94 + 0.06 * p})`, border: "1.5px solid rgba(255,255,255,0.22)", boxShadow: "0 50px 90px -40px rgba(0,0,0,0.9), 0 0 0 8px rgba(255,255,255,0.03)" }}>
      <OffthreadVideo src={staticFile("v21/plate_c.mp4")} muted style={{ position: "absolute", left: 180 - FACE.x * kk, top: 240 - FACE.y * kk, width: 1080 * kk, height: 1920 * kk }} />
    </div>
  );
};

// ——— legendas: segmentos curtos, palavra a palavra, destaque em azul elétrico ———
type Wd = { text: string; start: number; end: number };
const WORDS = wordsJson as Wd[];
const KEYW = new Set(["vendedores", "vender", "compreender", "conquistou", "cliente", "empresário", "remodelação", "materiais", "preço", "vantagens", "serviço", "calma", "incomoda", "funcionários", "tempo", "organizado", "diferença", "preocupado", "problema", "produtividade", "obra", "solução", "negócio", "separa", "comum", "estratégico", "real", "compreende", "melhor", "enormes", "negociação"]);
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}]/gu, "");
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
    if (cur.length && (len + w.text.length > 24 || (prev && w.start - prev.end > 0.3) || /[.?!,]$/.test(prev?.text ?? ""))) flush();
    cur.push(w);
  });
  flush();
  return out;
})();
// onde (e se) as legendas aparecem: zona segura, nunca sobre o rosto
const capPos = (to: number): { x: number; w: number } | null => {
  const t = (a: number, b: number) => to >= M(a) && to < M(b);
  if (t(26.6, 30.35) || t(38.5, 40.72) || t(53.6, 57.85) || t(57.75, 61.95) || to >= M(67.95)) return null;
  if (t(11.4, 15.75)) return { x: 700, w: 1100 };
  if (t(15.75, 23.05)) return { x: 600, w: 900 };
  if (t(31.4, 37.7)) return { x: 1260, w: 1000 };
  if (t(40.6, 53.45)) return { x: 500, w: 820 };
  return { x: 960, w: 1300 };
};
const Captions21: React.FC<{ to: number }> = ({ to }) => {
  const pos = capPos(to);
  if (!pos) return null;
  const c = CHUNKS.find((ch) => to >= M(ch.a) - 0.05 && to < M(ch.b) + 0.35);
  if (!c) return null;
  const pin = interpolate(to, [M(c.a) - 0.05, M(c.a) + 0.13], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const pout = interpolate(to, [M(c.b) + 0.2, M(c.b) + 0.35], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: pos.x - pos.w / 2, width: pos.w, top: 935, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 14, opacity: pin * pout, transform: `translateY(${(1 - pin) * 14}px)`, filter: pin < 0.98 ? `blur(${(1 - pin) * 6}px)` : undefined }}>
      {c.w.map((w, i) => {
        const said = to >= M(w.start);
        const key = KEYW.has(norm(w.text));
        const pk = interpolate(to, [M(w.start), M(w.start) + 0.12], [0, 1], clamp);
        return (
          <span key={i} style={{ display: "inline-block", fontFamily: T.ui, fontWeight: 700, fontSize: 50, letterSpacing: "-0.005em", color: said && key ? T.blueHi : T.white, opacity: said ? 1 : 0.38, textShadow: said && key ? `0 0 22px ${T.glow}, 0 4px 18px rgba(0,0,0,0.7)` : "0 4px 18px rgba(0,0,0,0.75)", transform: `scale(${key ? 1 + 0.06 * pk : 1})` }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// grão (texturas com média constante) + vinheta + "light leaks" muito discretos nas viragens
const Finish: React.FC<{ frame: number; to: number }> = ({ frame, to }) => {
  const leaks = [9.75, 40.6, 53.45, 67.95].map((a) => {
    const u = (to - M(a)) / 1.6;
    return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
  });
  const leak = Math.max(...leaks);
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
      {leak > 0.01 && <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 60% at ${30 + 40 * leak}% 30%, rgba(255,170,90,${0.1 * leak}), rgba(47,123,255,${0.06 * leak}) 45%, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />}
      <Img src={staticFile(`v21/grain/g${String((frame * 7) % 24).padStart(2, "0")}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, mixBlendMode: "overlay", opacity: 0.1 }} />
    </>
  );
};

const Outro: React.FC<{ to: number; fps: number }> = ({ to, fps }) => {
  const a = M(67.95);
  if (to < a) return null;
  const p = interpolate(to, [a + 0.2, a + 1.0], [0, 1], { easing: Easing.bezier(0.22, 1, 0.36, 1), ...clamp });
  return (
    <div style={{ position: "absolute", left: 1000, top: 210, opacity: p, transform: `translateX(${(1 - p) * 80}px) scale(${0.95 + 0.05 * p})` }}>
      <Label color={T.blueHi} style={{ marginBottom: 22 }}>@sergio_salvador10</Label>
      {/* o perfil ORIGINAL, sem filtros; só o toque em "Seguir" por cima */}
      <PerfilCard width={780} tapAt={Math.round((a + 1.9) * fps)} />
    </div>
  );
};

export type Video21Props = { music: boolean };
export const Video21: React.FC<Video21Props> = ({ music }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const to = frame / fps;
  const base = camAt(to);
  const live = !inWin(to, FREEZE);
  const zoom = live ? punch(to) : 1;
  const cam: Cam = { s: base.s * zoom, fx: base.fx, fy: base.fy };
  // escurecer o fundo quando os gráficos ocupam o ecrã
  const dark = Math.max(win(to, 11.4, 15.75) * 0.3, win(to, 31.4, 37.7) * 0.32, win(to, 40.6, 53.45) * 0.2, win(to, 38.56, 40.72) * 0.25, win(to, 57.75, 61.95) * 0.25, win(to, 26.6, 30.35) * 0.2);
  // PiP: o recorte encolhe para o canto e dá lugar à imagem real na moldura
  const pipP = win(to, PIPWIN[0] + 0.55, PIPWIN[1], 0.35, 0.3);
  const freezeF = Math.round(M(FREEZE[0]) * fps);
  const rim = win(to, FREEZE[0] + 0.2, FREEZE[1], 0.4, 0.3);
  const unfreeze = interpolate(to, [M(FREEZE[1]), M(FREEZE[1]) + 0.25], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: T.ink }}>
      <Background cam={cam} dark={dark} />
      <Climax to={to} layer="behind" />
      {/* sujeito: ao vivo, ou congelado no freeze (com transição para o vivo ao voltar) */}
      {inWin(to, FREEZE) ? (
        <Subject cam={cam} frozen={freezeF} rim={rim} opacity={1} />
      ) : unfreeze > 0 && unfreeze < 1 ? (
        <>
          <Subject cam={cam} frozen={freezeF} rim={0} opacity={1 - unfreeze} />
          <Subject cam={cam} frozen={null} rim={0} opacity={unfreeze} />
        </>
      ) : (
        <Subject cam={cam} frozen={null} rim={0} opacity={1 - pipP} />
      )}
      <Pip p={pipP} />
      <Hook to={to} />
      <Chapter to={to} at={10.0} until={15.75} n="01" title="A situação" />
      <Brief to={to} />
      <Pitch to={to} />
      <Question to={to} />
      <Answer to={to} />
      <Reveal to={to} />
      <Split to={to} />
      <Climax to={to} layer="front" />
      <KeyLine to={to} />
      <Captions21 to={to} />
      <Outro to={to} fps={fps} />
      <Finish frame={frame} to={to} />
      {music && <Audio src={staticFile("audio21.m4a")} />}
    </AbsoluteFill>
  );
};
