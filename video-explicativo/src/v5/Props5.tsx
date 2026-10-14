import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { c5, springs5, t5 } from "./theme5";

// Palavras sincronizadas com a voz, com entrada mais lenta e suave (nostálgica).
export type W = { text: string; at: number; style?: React.CSSProperties };
export const SoftWords: React.FC<{ words: W[]; style?: React.CSSProperties; gap?: number; rise?: number }> = ({
  words,
  style,
  gap = 16,
  rise = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: gap, ...style }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - (w.at - 2), fps, config: springs5.settle });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px)`,
              filter: `blur(${interpolate(p, [0, 1], [10, 0], clamp)}px)`,
              ...w.style,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// Máquina de escrever: os caracteres aparecem entre [from, to].
export const Typewriter: React.FC<{ text: string; from: number; to: number; style?: React.CSSProperties; caret?: boolean }> = ({
  text,
  from,
  to,
  style,
  caret = true,
}) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [from, to], [0, text.length], clamp));
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{ ...t5.type, whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      {caret && frame >= from && <span style={{ opacity: n < text.length || blink ? 1 : 0 }}>▍</span>}
    </span>
  );
};

// Carimbo de borracha.
export const Stamp: React.FC<{ text: string; color: string; p: number; rotate?: number; size?: number }> = ({
  text,
  color,
  p,
  rotate = -8,
  size = 34,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.35}px ${size * 0.7}px`,
      border: `${Math.max(3, size * 0.12)}px solid ${color}`,
      borderRadius: size * 0.35,
      ...t5.label,
      color,
      fontSize: size,
      letterSpacing: "0.12em",
      opacity: interpolate(p, [0, 0.3], [0, 0.9], clamp),
      transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [1.8, 1])})`,
      mixBlendMode: "multiply",
    }}
  >
    {text}
  </div>
);

// Polaroide (foto + legenda manuscrita); develop: 0 = escura → 1 = revelada.
export const Polaroid: React.FC<{
  caption: string;
  width?: number;
  develop?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ caption, width = 520, develop = 1, children, style }) => (
  <div
    style={{
      width,
      padding: `${width * 0.06}px ${width * 0.06}px ${width * 0.24}px`,
      background: c5.cream,
      borderRadius: 6,
      boxShadow: `0 30px 60px -20px ${c5.shadowDeep}, 0 4px 10px ${c5.shadow}`,
      position: "relative",
      ...style,
    }}
  >
    <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: c5.tealDark }}>
      <div style={{ position: "absolute", inset: 0, filter: `brightness(${0.25 + develop * 0.75}) sepia(${0.6 - develop * 0.4}) contrast(${0.8 + develop * 0.2})` }}>
        {children}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: width * 0.05, textAlign: "center", ...t5.hand, fontSize: width * 0.12, color: c5.inkSoft }}>{caption}</div>
  </div>
);

// Paisagem-memória simples para dentro das polaroides.
export const Memory: React.FC<{ sun?: number }> = ({ sun = 0.5 }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${c5.tealLight} 0%, ${c5.tealMist} 55%, ${c5.paperDeep} 56%, ${c5.sepia} 100%)` }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "56%", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "50%", top: `${105 - sun * 62}%`, width: "26%", aspectRatio: "1 / 1", marginLeft: "-13%", borderRadius: "50%", background: c5.cream, boxShadow: `0 0 80px ${c5.leakWarm}` }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: "56%", height: 3, background: c5.paperEdge }} />
  </div>
);

// Mostrador analógico vintage (0..1).
export const Gauge: React.FC<{ value: number; size?: number }> = ({ value, size = 620 }) => {
  const R = size / 2 - 40;
  const cx = size / 2;
  const cy = size / 2 + 40;
  const ang = -90 + value * 180;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.78 }}>
      <svg width={size} height={size * 0.78}>
        <defs>
          <radialGradient id="face" cx="50%" cy="60%" r="70%">
            <stop offset="0" stopColor={c5.cream} />
            <stop offset="1" stopColor={c5.paperDeep} />
          </radialGradient>
        </defs>
        <path d={`M ${cx - R - 30} ${cy} A ${R + 30} ${R + 30} 0 0 1 ${cx + R + 30} ${cy} L ${cx + R + 30} ${cy + 40} L ${cx - R - 30} ${cy + 40} Z`} fill="url(#face)" stroke={c5.paperEdge} strokeWidth={6} />
        {Array.from({ length: 21 }).map((_, i) => {
          const a = ((-90 + i * 9 - 90) * Math.PI) / 180;
          const big = i % 5 === 0;
          const r1 = R - (big ? 36 : 20);
          return (
            <line key={i} x1={cx + R * Math.cos(a)} y1={cy + R * Math.sin(a)} x2={cx + r1 * Math.cos(a)} y2={cy + r1 * Math.sin(a)} stroke={i === 20 ? c5.red : c5.ink} strokeWidth={big ? 5 : 2.5} />
          );
        })}
        {[0, 25, 50, 75, 100].map((v, i) => {
          const a = ((-90 + i * 45 - 90) * Math.PI) / 180;
          const r = R - 72;
          return (
            <text key={v} x={cx + r * Math.cos(a)} y={cy + r * Math.sin(a) + 10} textAnchor="middle" fontFamily={t5.type.fontFamily} fontSize={26} fill={v === 100 ? c5.red : c5.inkSoft}>
              {v}
            </text>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 5, top: cy - R + 20, width: 10, height: R - 20, borderRadius: 5, background: c5.ink, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, boxShadow: `2px 4px 6px ${c5.shadow}` }} />
      <div style={{ position: "absolute", left: cx - 26, top: cy - 26, width: 52, height: 52, borderRadius: "50%", background: c5.tealDeep, border: `6px solid ${c5.cream}` }} />
    </div>
  );
};

// Ficha de arquivo (biblioteca antiga).
export const IndexCard: React.FC<{ title: string; n: number; stampP: number }> = ({ title, n, stampP }) => (
  <div
    style={{
      width: 720,
      height: 420,
      background: c5.cream,
      borderRadius: 10,
      boxShadow: `0 20px 40px -18px ${c5.shadowDeep}`,
      backgroundImage: `repeating-linear-gradient(180deg, transparent 0 58px, ${c5.tealMist} 58px 60px)`,
      backgroundPosition: "0px 90px",
      position: "relative",
      padding: "34px 44px",
    }}
  >
    <div style={{ position: "absolute", left: 0, right: 0, top: 86, height: 3, background: c5.tealLight }} />
    <div style={{ display: "flex", justifyContent: "space-between", ...t5.label, fontSize: 22 }}>
      <span>ficha nº {String(n).padStart(3, "0")}</span>
      <span>aprender</span>
    </div>
    <div style={{ ...t5.type, fontSize: 56, marginTop: 70 }}>{title}</div>
    <div style={{ position: "absolute", right: 40, bottom: 40 }}>
      <Stamp text="novo" color={c5.teal} p={stampP} rotate={-10} size={32} />
    </div>
  </div>
);
