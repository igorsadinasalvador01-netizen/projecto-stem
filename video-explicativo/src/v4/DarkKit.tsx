import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { t2 } from "../v2/type2";
import { IconArrow, IconCheck, IconX } from "../v2/components/Kit";
import { d4 } from "./timeline4";

// Tipografia em branco para fundos escuros (mesmos papéis do vídeo 2/3).
export const t4 = {
  hero: { ...t2.hero, color: d4.text },
  head: { ...t2.head, color: d4.text },
  light: { ...t2.light, color: d4.dim },
  impact: { ...t2.impact, color: d4.text },
  body: { ...t2.body, color: d4.dim },
  mono: { ...t2.mono, color: d4.faint },
};

// Cartão de vidro fumado.
export const DarkCard: React.FC<{ children?: React.ReactNode; radius?: number; style?: React.CSSProperties }> = ({
  children,
  radius = 44,
  style,
}) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      background: `linear-gradient(160deg, ${d4.glassStrong}, ${d4.glass} 55%)`,
      border: `1.5px solid ${d4.stroke}`,
      boxShadow: `inset 0 1.5px 0 ${d4.strokeStrong}, 0 40px 80px -24px ${d4.black}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export type DarkSignal = "pos" | "neg" | "turq" | "neutral";
const sig: Record<DarkSignal, { bg: string; fg: string; glow: string }> = {
  pos: { bg: d4.greenSoft, fg: d4.green, glow: d4.greenGlow },
  neg: { bg: d4.redSoft, fg: d4.red, glow: d4.redGlow },
  turq: { bg: d4.turqSoft, fg: d4.turq, glow: d4.turqSoft },
  neutral: { bg: d4.glassStrong, fg: d4.dim, glow: d4.glass },
};

export const DarkPill: React.FC<{
  kind: DarkSignal;
  icon?: "check" | "x" | "arrow" | null;
  size?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ kind, icon = null, size = 40, children, style }) => {
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
        border: `1.5px solid ${s.glow}`,
        fontFamily: t2.head.fontFamily,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        boxShadow: `0 0 40px -10px ${s.glow}`,
        ...style,
      }}
    >
      {icon === "check" && <IconCheck size={size * 1.05} stroke={2.8} />}
      {icon === "x" && <IconX size={size} stroke={2.8} />}
      {icon === "arrow" && <IconArrow size={size} stroke={2.6} />}
      {children}
    </div>
  );
};

// Acabamento escuro: grão em overlay + vinheta preta (contraste).
export const Finish4: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: noise,
          backgroundSize: "240px",
          backgroundPosition: `${(frame * 37) % 240}px ${(frame * 53) % 240}px`,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse 90% 75% at 50% 48%, transparent 55%, ${d4.black} 100%)`,
        }}
      />
    </>
  );
};
