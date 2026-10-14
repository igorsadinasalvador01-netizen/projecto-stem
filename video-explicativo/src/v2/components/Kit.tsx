import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, springs } from "../theme2";
import { t2 } from "../type2";
import { clamp } from "../../components/Motion";
import { IconArrow, IconCheck } from "../../components/Icons";

// ——— ícones extra (linha, herdam currentColor) ———
const Svg: React.FC<{ size?: number; stroke?: number; children: React.ReactNode }> = ({
  size = 48,
  stroke = 2.2,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const IconX: React.FC<{ size?: number; stroke?: number }> = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconDoc: React.FC<{ size?: number; stroke?: number }> = (p) => (
  <Svg {...p}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </Svg>
);
export const IconSearch: React.FC<{ size?: number; stroke?: number }> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Svg>
);
export const IconUser: React.FC<{ size?: number; stroke?: number }> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20c.8-3.8 3.9-6 7.5-6s6.7 2.2 7.5 6" />
  </Svg>
);
export { IconArrow, IconCheck };

// ——— cartão branco premium ———
export const Card: React.FC<{
  children?: React.ReactNode;
  radius?: number;
  style?: React.CSSProperties;
  onTurq?: boolean;
}> = ({ children, radius = 44, style, onTurq = false }) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      background: onTurq ? c2.glassOnTurq : c2.white,
      border: `1.5px solid ${onTurq ? c2.strokeOnTurq : c2.line}`,
      boxShadow: onTurq
        ? `0 30px 70px -20px ${c2.shadowTurq}, inset 0 1.5px 0 ${c2.strokeOnTurq}`
        : `0 30px 80px -24px ${c2.shadowDeep}, 0 6px 18px -8px ${c2.shadow}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// ——— pílula de sinal: verde = positivo, vermelho = negativo ———
export type Signal = "pos" | "neg" | "turq" | "neutral" | "white";
const sig: Record<Signal, { bg: string; fg: string; ring: string }> = {
  pos: { bg: c2.greenSoft, fg: c2.green, ring: c2.glowGreen },
  neg: { bg: c2.redSoft, fg: c2.red, ring: c2.glowRed },
  turq: { bg: c2.turqMist, fg: c2.turqDeep, ring: c2.glowTurq },
  neutral: { bg: c2.paper, fg: c2.inkSoft, ring: c2.line },
  white: { bg: c2.white, fg: c2.turqDeep, ring: c2.shadow },
};

export const Pill: React.FC<{
  kind: Signal;
  icon?: "check" | "x" | "arrow" | null;
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ kind, icon = null, children, size = 44, style }) => {
  const s = sig[kind];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.32,
        padding: `${size * 0.28}px ${size * 0.62}px`,
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        fontFamily: t2.head.fontFamily,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "-0.02em",
        boxShadow: `0 14px 34px -14px ${s.ring}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon === "check" && <IconCheck size={size * 1.05} stroke={2.8} />}
      {icon === "x" && <IconX size={size * 1.0} stroke={2.8} />}
      {icon === "arrow" && <IconArrow size={size * 1.0} stroke={2.6} />}
      {children}
    </div>
  );
};

// ——— selo circular (check / x) ———
export const Badge: React.FC<{ kind: "pos" | "neg" | "turq"; size?: number; icon?: "check" | "x" }> = ({
  kind,
  size = 96,
  icon = "check",
}) => {
  const color = kind === "pos" ? c2.green : kind === "neg" ? c2.red : c2.turq;
  const ring = kind === "pos" ? c2.glowGreen : kind === "neg" ? c2.glowRed : c2.glowTurq;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: c2.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 16px 40px -10px ${ring}, inset 0 2px 0 rgba(255,255,255,0.35)`,
      }}
    >
      {icon === "check" ? <IconCheck size={size * 0.56} stroke={3} /> : <IconX size={size * 0.5} stroke={3} />}
    </div>
  );
};

// ——— avatar minimalista ———
export const Avatar: React.FC<{ size?: number; tone: "white" | "glass" | "turq"; ring?: boolean }> = ({
  size = 140,
  tone,
  ring = false,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: tone === "white" ? c2.white : tone === "turq" ? c2.turq : c2.glassOnTurq,
      color: tone === "white" ? c2.turqDeep : c2.white,
      border: `2px solid ${tone === "glass" ? c2.strokeOnTurq : "transparent"}`,
      boxShadow: ring
        ? `0 0 0 10px ${c2.glassOnTurqStrong}, 0 30px 60px -16px ${c2.shadowTurq}`
        : `0 18px 40px -18px ${c2.shadowTurq}`,
    }}
  >
    <IconUser size={size * 0.52} stroke={1.8} />
  </div>
);

// ——— balão de conversa ———
export const Bubble: React.FC<{
  side: "left" | "right";
  tone: "turq" | "gray" | "pos" | "neg";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ side, tone, children, style }) => {
  const bg = tone === "turq" ? c2.turq : tone === "gray" ? c2.mist : tone === "pos" ? c2.greenSoft : c2.redSoft;
  const fg = tone === "turq" ? c2.white : tone === "gray" ? c2.ink : tone === "pos" ? c2.green : c2.red;
  return (
    <div
      style={{
        alignSelf: side === "left" ? "flex-start" : "flex-end",
        maxWidth: 820,
        padding: "30px 40px",
        borderRadius: 46,
        borderBottomLeftRadius: side === "left" ? 14 : 46,
        borderBottomRightRadius: side === "right" ? 14 : 46,
        background: bg,
        color: fg,
        boxShadow: `0 18px 44px -20px ${c2.shadowDeep}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ——— número de capítulo em contorno ———
export const ChapterNumber: React.FC<{ n: string; color: string; size?: number; fill?: number }> = ({
  n,
  color,
  size = 420,
  fill = 0,
}) => (
  <div
    style={{
      ...t2.hero,
      fontSize: size,
      lineHeight: 0.8,
      color: "transparent",
      WebkitTextStroke: `4px ${color}`,
      backgroundImage: `linear-gradient(0deg, ${color} ${fill * 100}%, transparent ${fill * 100}%)`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {n}
  </div>
);

// ——— porta 3D (CSS) ———
// open: 0 = fechada, 1 = aberta. state: "idle" | "closed" (check verde) | "pending" (pulso turquesa)
export const Door: React.FC<{
  open: number;
  label: string;
  state?: "idle" | "closed" | "pending";
  stateP?: number;
  width?: number;
  height?: number;
}> = ({ open, label, state = "idle", stateP = 0, width = 250, height = 470 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = state === "pending" ? 0.5 + Math.sin((frame / fps) * 7) * 0.5 : 0;
  const angle = -open * 74;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ perspective: 1400, width, height, position: "relative" }}>
        {/* vão iluminado por trás da porta */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 26,
            background: `linear-gradient(180deg, ${c2.aqua}, ${c2.turqLight})`,
            boxShadow: `inset 0 0 0 10px ${c2.white}, 0 30px 60px -24px ${c2.shadowDeep}`,
            opacity: 0.35 + open * 0.65,
          }}
        />
        {/* folha da porta */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: 18,
            transformOrigin: "0% 50%",
            transform: `rotateY(${angle}deg)`,
            background: `linear-gradient(100deg, ${c2.white} 0%, ${c2.paper} 60%, ${c2.mist} 100%)`,
            border: `1.5px solid ${c2.lineStrong}`,
            boxShadow:
              state === "pending"
                ? `0 0 ${30 + pulse * 40}px ${c2.glowTurq}, 0 24px 50px -20px ${c2.shadowDeep}`
                : `0 24px 50px -20px ${c2.shadowDeep}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 28,
          }}
        >
          {/* almofadas da porta */}
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 36,
              height: "38%",
              borderRadius: 12,
              border: `1.5px solid ${c2.line}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              bottom: 36,
              height: "38%",
              borderRadius: 12,
              border: `1.5px solid ${c2.line}`,
            }}
          />
          {/* puxador */}
          <div
            style={{
              width: 14,
              height: 64,
              borderRadius: 7,
              background: state === "closed" ? c2.green : c2.turq,
              boxShadow: `0 4px 10px ${c2.shadow}`,
            }}
          />
          {/* estado */}
          {state === "closed" && stateP > 0 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) scale(${stateP})`,
                opacity: Math.min(1, stateP * 1.4),
              }}
            >
              <Badge kind="pos" size={width * 0.42} />
            </div>
          )}
        </div>
      </div>
      <div style={{ ...t2.mono, fontSize: 24, color: c2.inkSoft }}>{label}</div>
    </div>
  );
};

// Utilitário: progresso de fecho de uma porta (abre → fecha num instante dado).
export const useDoorClose = (closeAt: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - closeAt, fps, config: springs.snappy });
  const badge = spring({ frame: frame - closeAt - 4, fps, config: springs.bouncy });
  return { open: 1 - p, badge: interpolate(badge, [0, 1], [0, 1], clamp), closed: p > 0.5 };
};
