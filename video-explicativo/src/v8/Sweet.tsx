import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { c2 } from "../v2/theme2";
import { t2 } from "../v2/type2";
import { d4 } from "../v4/timeline4";
import { emo } from "../v6/Emotion";

// Vídeo 8 — modelo dark: palco escuro, focos de luz, vidro fumado, turquesa
// luminoso (d4) e verde/vermelho só como sinais.

// Cupcake ilustrado (forma + cobertura + granulado), em turquesa e branco.
export const Cupcake: React.FC<{ size: number; glow?: number; id: string }> = ({ size, glow = 0, id }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 ${24 * glow}px ${d4.turqSoft})` : undefined }}>
    <defs>
      <linearGradient id={`w${id}`} x1="0" x2="1">
        <stop offset="0" stopColor={c2.turqDeep} />
        <stop offset="0.5" stopColor={c2.turq} />
        <stop offset="1" stopColor={c2.turqDark} />
      </linearGradient>
      <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c2.white} />
        <stop offset="1" stopColor={c2.aqua} />
      </linearGradient>
    </defs>
    <ellipse cx={100} cy={214} rx={70} ry={8} fill="rgba(0,0,0,0.45)" />
    <path d="M36 122 L164 122 L148 210 L52 210 Z" fill={`url(#w${id})`} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M${52 + i * 19} 124 L${60 + i * 16} 208`} stroke="rgba(255,255,255,0.18)" strokeWidth={4} />
    ))}
    <ellipse cx={100} cy={118} rx={74} ry={24} fill={`url(#f${id})`} />
    <ellipse cx={100} cy={94} rx={58} ry={24} fill={`url(#f${id})`} />
    <ellipse cx={100} cy={70} rx={38} ry={20} fill={`url(#f${id})`} />
    <path d="M86 56 Q100 30 114 56 Z" fill={c2.white} />
    <circle cx={102} cy={34} r={12} fill={d4.turq} />
    <circle cx={98} cy={30} r={3.5} fill="rgba(255,255,255,0.8)" />
    {[
      [70, 104, 20],
      [120, 86, 70],
      [136, 112, -30],
      [88, 78, 50],
      [108, 112, 10],
      [60, 120, -50],
    ].map(([x, y, r], i) => (
      <rect key={i} x={x} y={y} width={12} height={4} rx={2} fill={i % 2 ? d4.turq : c2.turqDeep} transform={`rotate(${r} ${x + 6} ${y + 2})`} />
    ))}
    <path d="M58 104 Q66 92 80 90" stroke="rgba(255,255,255,0.9)" strokeWidth={5} fill="none" strokeLinecap="round" />
  </svg>
);

// Etiqueta de preço pendurada por um fio, que entra a balançar.
export const PriceTag: React.FC<{ at: number; label: string; x: number; y: number; size?: number; tone?: "white" | "pos" | "neg" | "dim" }> = ({
  at,
  label,
  x,
  y,
  size = 1,
  tone = "white",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: emo.arrive });
  if (frame < at - 2) return null;
  const tt = Math.max(0, (frame - at) / fps);
  const swing = Math.sin(tt * 7) * 18 * Math.exp(-tt * 2.6);
  const bg = tone === "pos" ? d4.green : tone === "neg" ? d4.red : tone === "dim" ? "rgba(255,255,255,0.35)" : c2.white;
  const fg = tone === "white" ? c2.turqDeep : tone === "dim" ? c2.ink : c2.white;
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "50% 0%", transform: `rotate(${swing}deg) scale(${size})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) }}>
      <div style={{ position: "absolute", left: -1, top: -60 * (1 - p) - 46, width: 2, height: 46, background: "rgba(255,255,255,0.35)" }} />
      <div
        style={{
          transform: `translate(-50%, ${(1 - p) * -60}px)`,
          padding: "16px 30px 16px 44px",
          borderRadius: 18,
          background: bg,
          ...t2.head,
          color: fg,
          fontSize: 54,
          whiteSpace: "nowrap",
          boxShadow: `0 20px 40px -14px rgba(0,0,0,0.6)`,
          position: "relative",
        }}
      >
        <span style={{ color: fg }}>{label}</span>
        <div style={{ position: "absolute", left: 16, top: "50%", width: 14, height: 14, marginTop: -7, borderRadius: 7, background: "rgba(0,0,0,0.25)" }} />
      </div>
    </div>
  );
};

// Foco de luz de palco (cone + poça de luz no chão).
export const Spotlight: React.FC<{ x: number; floorY: number; at: number; width?: number; color?: string }> = ({
  x,
  floorY,
  at,
  width = 360,
  color = "rgba(166,238,238,",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = interpolate(frame, [at, at + 0.35 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const flick = 0.94 + Math.sin(frame * 0.7) * 0.03;
  if (on <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - width / 2 - 60,
          top: 0,
          width: width + 120,
          height: floorY,
          background: `linear-gradient(180deg, ${color}0) 0%, ${color}${0.1 * on * flick}) 70%, ${color}${0.16 * on * flick}) 100%)`,
          clipPath: `polygon(${(width + 120) / 2 - 40}px 0, ${(width + 120) / 2 + 40}px 0, 100% 100%, 0 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - width / 2 - 40,
          top: floorY - 50,
          width: width + 80,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${color}${0.32 * on}), ${color}0) 70%)`,
        }}
      />
    </>
  );
};

// Pílula escura compacta para rótulos de sinal.
export const Tag: React.FC<{ kind: "pos" | "neg" | "turq"; children: React.ReactNode; size?: number }> = ({ kind, children, size = 30 }) => {
  const s =
    kind === "pos"
      ? { bg: d4.greenSoft, fg: d4.green, gl: d4.greenGlow }
      : kind === "neg"
        ? { bg: d4.redSoft, fg: d4.red, gl: d4.redGlow }
        : { bg: d4.turqSoft, fg: d4.turq, gl: d4.turqSoft };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${size * 0.3}px ${size * 0.66}px`,
        borderRadius: 999,
        background: s.bg,
        border: `1.5px solid ${s.gl}`,
        boxShadow: `0 0 30px -8px ${s.gl}`,
        ...t2.head,
        color: s.fg,
        fontSize: size,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};
