import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { theme } from "../theme";
import { CUTS, FPS9, VOICE_END as VEND } from "../v9/timeline9";
import { Act, actAt, CHUNKSH, sceneHAt, VOICE_END } from "./timelineH";

export const W = 1920;
export const H = 1080;

// ——— paleta: branco dominante; azul e cinza destacam vídeos e cenas;
// verde = positivo, vermelho = alerta ———
const BASE = {
  ink: "#0F172A",
  dim: "rgba(15,23,42,0.6)",
  faint: "rgba(15,23,42,0.32)",
  accent: "#2563EB",
  blue: "#2563EB",
  blueSoft: "#DBEAFE",
  good: "#16A34A",
  goodSoft: "#DCFCE7",
  warn: "#E5484D",
  warnSoft: "#FDECEC",
  gray: "#64748B",
  graySoft: "#F1F5F9",
  line: "#E5E7EB",
  glass: "rgba(255,255,255,0.82)",
  stroke: "rgba(15,23,42,0.08)",
};
export const A = { night: BASE, dawn: BASE, day: BASE } as const;
export const C = BASE;
export const AI_GRAD = "linear-gradient(90deg, #2563EB, #06B6D4 50%, #16A34A)";
// gradientes para miniaturas de vídeo / cenas (azuis, cinzas, verde)
export const THUMBS = ["#2563EB,#60A5FA", "#0F172A,#475569", "#16A34A,#86EFAC", "#0EA5E9,#BAE6FD", "#64748B,#CBD5E1", "#1D4ED8,#93C5FD", "#15803D,#4ADE80", "#334155,#94A3B8", "#3B82F6,#DBEAFE"];

export const F = { sans: theme.fonts.display, serif: theme.fonts.serif, mono: theme.fonts.mono, hand: theme.fonts.hand, body: theme.fonts.body };

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;
export const Grain: React.FC<{ o?: number }> = ({ o = 0.035 }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, backgroundSize: "240px", backgroundPosition: `${(frame * 37) % 240}px ${(frame * 53) % 240}px`, opacity: o, mixBlendMode: "overlay" }} />;
};

// ——— fundo de estúdio com luz suave a respirar ———
export const Backdrop: React.FC<{ act: Act; city?: boolean }> = ({ act, city = false }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const bg =
    act === "night"
      ? `radial-gradient(1200px 800px at ${28 + Math.sin(t * 0.2) * 3}% 8%, rgba(100,116,139,0.10), transparent 60%), radial-gradient(900px 700px at 90% 95%, rgba(37,99,235,0.07), transparent 60%), linear-gradient(180deg, #FFFFFF, #F1F3F6)`
      : act === "dawn"
        ? `radial-gradient(1100px 760px at ${80 + Math.sin(t * 0.25) * 2}% 92%, rgba(37,99,235,0.12), transparent 62%), radial-gradient(900px 600px at 10% 5%, rgba(6,182,212,0.07), transparent 60%), linear-gradient(170deg, #FFFFFF, #F4F7FF)`
        : `radial-gradient(1200px 700px at 50% -10%, #FFFFFF, transparent 60%), radial-gradient(900px 600px at 90% 100%, rgba(22,163,74,0.09), transparent 60%), linear-gradient(180deg, #FFFFFF, #F2F6F3)`;
  return (
    <AbsoluteFill style={{ background: bg }}>
      {city &&
        Array.from({ length: 34 }).map((_, i) => {
          const r = 14 + random(`cr${i}`) * 46;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: random(`cx${i}`) * W - r,
                top: 520 + random(`cy${i}`) * 520 - r,
                width: 2 * r,
                height: 2 * r,
                borderRadius: "50%",
                background: random(`cc${i}`) > 0.6 ? "rgba(100,116,139,0.18)" : "rgba(37,99,235,0.14)",
                filter: `blur(${6 + random(`cb${i}`) * 10}px)`,
                opacity: 0.35 + 0.25 * Math.sin(t * (0.5 + random(`cs${i}`)) + i),
              }}
            />
          );
        })}
      <Grain />
    </AbsoluteFill>
  );
};

// ——— vidro ———
export const Glass: React.FC<{ act: Act; children?: React.ReactNode; style?: React.CSSProperties; radius?: number }> = ({ act, children, style, radius = 28 }) => (
  <div
    style={{
      borderRadius: radius,
      background: A[act].glass,
      border: `1.5px solid ${A[act].stroke}`,
      backdropFilter: "blur(22px)",
      boxShadow: "0 40px 80px -36px rgba(15,23,42,0.28), 0 8px 24px -12px rgba(15,23,42,0.12)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ——— telemóvel realista (titânio, ilha dinâmica, reflexo) ———
export const Phone: React.FC<{ w: number; finish?: "dark" | "light"; children?: React.ReactNode; style?: React.CSSProperties; screen?: string }> = ({
  w,
  finish = "dark",
  children,
  style,
  screen = "#000",
}) => {
  const h = w * 2.05;
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: w * 0.16,
        padding: w * 0.032,
        background: finish === "dark" ? "linear-gradient(145deg, #4A4D55, #17181C 38%, #2E3036 70%, #0E0F12)" : "linear-gradient(145deg, #F2EFEA, #C9C4BC 40%, #E9E5DF 70%, #ABA59C)",
        boxShadow: "0 70px 120px -40px rgba(0,0,0,0.55), 0 24px 40px -24px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.12)",
        ...style,
      }}
    >
      {[0.2, 0.3].map((y, i) => (
        <div key={i} style={{ position: "absolute", left: -4, top: h * y, width: 5, height: h * 0.07, borderRadius: 3, background: finish === "dark" ? "#2A2C31" : "#B8B2A9" }} />
      ))}
      <div style={{ position: "absolute", right: -4, top: h * 0.26, width: 5, height: h * 0.11, borderRadius: 3, background: finish === "dark" ? "#2A2C31" : "#B8B2A9" }} />
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.13, overflow: "hidden", background: screen }}>
        {children}
        <div style={{ position: "absolute", left: "50%", top: w * 0.035, width: w * 0.3, height: w * 0.085, marginLeft: -w * 0.15, borderRadius: w, background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 32%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

// ——— portátil (ecrã + base de alumínio) ———
export const Laptop: React.FC<{ w: number; children?: React.ReactNode; style?: React.CSSProperties; screen?: string }> = ({ w, children, style, screen = "#0B0D12" }) => {
  const sh = w * 0.62;
  return (
    <div style={{ position: "relative", width: w * 1.14, ...style }}>
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: w,
          height: sh,
          borderRadius: "26px 26px 8px 8px",
          background: "#0A0A0C",
          padding: w * 0.018,
          paddingBottom: w * 0.03,
          boxShadow: "0 60px 100px -40px rgba(0,0,0,0.6), inset 0 0 0 2px #2A2B30",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 10, overflow: "hidden", background: screen }}>
          {children}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)", pointerEvents: "none" }} />
        </div>
      </div>
      <div style={{ position: "relative", height: w * 0.034, borderRadius: "0 0 22px 22px", background: "linear-gradient(180deg, #E4E5E8, #A9ACB2 70%, #7C7F86)", boxShadow: "0 30px 40px -20px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: w * 0.14, height: w * 0.012, marginLeft: -w * 0.07, borderRadius: "0 0 10px 10px", background: "#9DA0A6" }} />
      </div>
    </div>
  );
};

// ——— o rosto: cortes de pausa + punch-in alternado; gradação por ato ———
export type Grade = "night" | "dawn" | "day";
const GRADE: Record<Grade, string> = {
  night: "saturate(0.86) contrast(1.06) brightness(1.0)",
  dawn: "saturate(1.05) contrast(1.05) brightness(1.04)",
  day: "contrast(1.06) saturate(1.08) brightness(1.04)",
};
export const FaceVideo: React.FC<{ sceneFrom: number; grade: Grade; posY?: number; zoom?: number; extraFilter?: string; punch?: boolean }> = ({
  sceneFrom,
  grade,
  posY = 38,
  zoom = 1,
  extraFilter = "",
  punch = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const g0 = Math.round(sceneFrom * FPS9);
  const endF = Math.round(VEND * FPS9);
  const gNow = g0 + frame;
  const idx = CUTS.findIndex((c, i) => gNow >= c.dstFrom && (i === CUTS.length - 1 || gNow < CUTS[i + 1].dstFrom));
  const p = punch && idx % 2 === 1 ? 1.07 : 1;
  const push = interpolate(frame, [0, durationInFrames], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${p * push * zoom})`, transformOrigin: `50% ${posY}%`, filter: `${GRADE[grade]} ${extraFilter}` }}>
        {CUTS.map((c, i) => {
          const from = c.dstFrom - g0;
          const len = i === CUTS.length - 1 ? endF - c.dstFrom : CUTS[i + 1].dstFrom - c.dstFrom;
          if (len <= 0 || from + len < -2 || from > durationInFrames + 2) return null;
          return (
            <Sequence key={i} from={from} durationInFrames={len} layout="none">
              <OffthreadVideo src={staticFile("v9/rosto.mp4")} trimBefore={c.srcFrom} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${posY}%` }} />
            </Sequence>
          );
        })}
        {/* depois da última palavra a fonte acaba: repete 1,5 s anteriores */}
        {g0 + durationInFrames > endF && (
          <Sequence from={endF - g0} layout="none">
            <OffthreadVideo src={staticFile("v9/rosto.mp4")} trimBefore={Math.max(0, CUTS[CUTS.length - 1].srcFrom - 48)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${posY}%` }} />
          </Sequence>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// cartão com o rosto (ecrã dividido)
export const FaceCard: React.FC<{ sceneFrom: number; grade: Grade; x?: number; y?: number; w?: number; h?: number; enterAt?: number; label?: string; act: Act }> = ({
  sceneFrom,
  grade,
  x = 1250,
  y = 50,
  w = 600,
  h = 980,
  enterAt = 2,
  label,
  act,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - enterAt, fps, config: { damping: 18, stiffness: 110, mass: 0.9 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translateY(${(1 - p) * 120}px) scale(${0.94 + p * 0.06})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, overflow: "hidden", boxShadow: "0 50px 100px -40px rgba(15,23,42,0.45)" }}>
        <FaceVideo sceneFrom={sceneFrom} grade={grade} posY={36} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35))" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, border: "1.5px solid rgba(255,255,255,0.22)", pointerEvents: "none" }} />
      {label && (
        <div style={{ position: "absolute", left: 28, top: 26, padding: "8px 18px", borderRadius: 999, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(10px)", fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: "#FF453A" }} />
          {label}
        </div>
      )}
    </div>
  );
};

// rosto em destaque: cartão vertical ao centro sobre o próprio vídeo desfocado
export const FaceFull: React.FC<{ sceneFrom: number; grade: Grade; act: Act; light?: number }> = ({ sceneFrom, grade, act, light = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18, stiffness: 120, mass: 0.9 } });
  return (
    <AbsoluteFill>
      <Backdrop act={act} />
      <AbsoluteFill style={{ transform: "scale(1.3)", opacity: 0.16 }}>
        <FaceVideo sceneFrom={sceneFrom} grade={grade} posY={40} extraFilter="blur(50px)" punch={false} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 660, top: 40, width: 600, height: 1000, transform: `scale(${0.96 + p * 0.04})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 44, overflow: "hidden", boxShadow: "0 60px 120px -40px rgba(15,23,42,0.5)" }}>
          <FaceVideo sceneFrom={sceneFrom} grade={grade} posY={36} />
          <AbsoluteFill style={{ background: `linear-gradient(110deg, rgba(255,255,255,${0.35 * light}), rgba(255,255,255,0) 50%)`, mixBlendMode: "screen" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 44, border: "1.5px solid rgba(255,255,255,0.25)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ——— transições de entrada ———
export type EnterH = "fade" | "slide" | "rise" | "light" | "zoom" | "none";
export const SceneInH: React.FC<{ kind: EnterH; children: React.ReactNode }> = ({ kind, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round(0.5 * fps);
  const p = interpolate(frame, [0, len], [0, 1], { easing: theme.ease.inOut, ...clamp });
  if (kind === "none" || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (kind === "fade") return <AbsoluteFill style={{ opacity: p, transform: `scale(${1.04 - 0.04 * p})`, filter: `blur(${(1 - p) * 14}px)` }}>{children}</AbsoluteFill>;
  if (kind === "slide")
    return (
      <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, boxShadow: "-60px 0 120px rgba(15,23,42,0.18)" }}>
        {children}
      </AbsoluteFill>
    );
  if (kind === "rise") return <AbsoluteFill style={{ opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 140}px)` }}>{children}</AbsoluteFill>;
  if (kind === "zoom") return <AbsoluteFill style={{ opacity: p, transform: `scale(${0.88 + 0.12 * p})`, filter: `blur(${(1 - p) * 10}px)` }}>{children}</AbsoluteFill>;
  // luz: clarão quente que atravessa e revela (mudança de ato)
  const flash = interpolate(frame, [0, len * 0.45, len], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: interpolate(p, [0.3, 0.6], [0, 1], clamp) }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 70% 60%, rgba(255,255,255,1), rgba(219,234,254,0.95) 40%, rgba(219,234,254,0) 75%)", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ——— etiqueta de capítulo (o "PASSO" do EXEMPLO, minimalista) ———
export const ChapterTag: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const act = actAt(t);
  const start = act === "night" ? 0 : act === "dawn" ? 16.37 : 39.3;
  const p = spring({ frame: frame - Math.round((start + 0.25) * fps), fps, config: { damping: 16, stiffness: 140, mass: 0.7 } });
  const label = act === "night" ? ["01", "O problema"] : act === "dawn" ? ["02", "A virada"] : ["03", "A mensagem"];
  const c = A[act];
  if (t > VOICE_END) return null;
  return (
    <div style={{ position: "absolute", left: 60, top: 50, opacity: p, transform: `translateY(${(1 - p) * -30}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 22px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 10px 24px -14px rgba(15,23,42,0.3)",
          backdropFilter: "blur(16px)",
          fontFamily: F.sans,
          fontSize: 24,
          color: c.ink,
        }}
      >
        <span style={{ fontFamily: F.mono, fontSize: 20, color: c.accent, letterSpacing: "0.1em" }}>{label[0]}</span>
        <span style={{ fontWeight: 600 }}>{label[1]}</span>
      </div>
    </div>
  );
};

// ——— legendas: pílula branca; palavra ativa a azul, alertas a vermelho, positivos a verde ———
const NEG = ["problemas", "falta", "complicado", "substituir", "limita", "trabalhar", "mais."];
const POS = ["ideias", "conectar", "agregar", "partilhar", "minha.", "processo.", "siga", "like,", "curte", "compartilhe.", "aparecer."];
const tone = (w: string) => {
  const k = w.toLowerCase().replace(/[,]$/, (m) => m);
  if (NEG.some((n) => k === n || k.replace(/[.,]/g, "") === n)) return BASE.warn;
  if (POS.some((n) => k === n || k.replace(/[.,]/g, "") === n.replace(/[.,]/g, ""))) return BASE.good;
  return undefined;
};
export const CaptionsH: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t > VOICE_END + 0.2) return null;
  const c = CHUNKSH.find((x) => t >= x.start - 0.06 && t < x.end);
  if (!c) return null;
  const sc = sceneHAt(c.start);
  if (sc.layout === "quote") return null;
  const act = actAt(c.start);
  const pal = A[act];
  const pop = spring({ frame: frame - Math.round((c.start - 0.06) * fps), fps, config: { damping: 16, stiffness: 240, mass: 0.5 } });
  const cx = sc.layout === "split" ? 615 : 960;
  return (
    <div style={{ position: "absolute", left: cx, top: 985, transform: `translate(-50%, -50%) translateY(${(1 - pop) * 14}px)`, opacity: interpolate(pop, [0, 0.4], [0, 1], clamp) }}>
      <div
        style={{
          display: "flex",
          gap: 14,
          whiteSpace: "nowrap",
          padding: "14px 30px",
          borderRadius: 22,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(15,23,42,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 20px 40px -20px rgba(0,0,0,0.35)",
          fontFamily: F.sans,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: "-0.015em",
          color: pal.ink,
        }}
      >
        {c.words.map((w, i) => {
          const active = t >= w.start - 0.04 && (i === c.words.length - 1 || t < c.words[i + 1].start - 0.04);
          const said = t >= w.start - 0.04;
          return (
            <span key={i} style={{ color: tone(w.text) ?? (active ? pal.accent : pal.ink), opacity: said ? 1 : 0.45, transform: active ? "translateY(-2px)" : "none", display: "inline-block", textDecoration: active ? `underline ${tone(w.text) ?? pal.accent} 4px` : "none", textUnderlineOffset: 10 }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
