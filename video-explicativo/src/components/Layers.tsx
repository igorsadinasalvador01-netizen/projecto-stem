import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

// Camada 1 — malha de fundo escura com luz a derivar (nunca fundo chapado).
export const BgMesh: React.FC<{ tint?: number }> = ({ tint = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const d1 = Math.sin(t / 1.8) * 60;
  const d2 = Math.cos(t / 2.3) * 50;
  const d3 = Math.sin(t / 2.9 + 1) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 0%, ${theme.colors.bgAlt} 0%, ${theme.colors.bg} 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -520,
          left: -420 + d1,
          background: `radial-gradient(circle, ${theme.colors.glowSoft}, transparent 62%)`,
          opacity: tint,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          bottom: -560,
          right: -460 - d2,
          background: `radial-gradient(circle, ${theme.colors.glowFaint}, transparent 64%)`,
          opacity: tint,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: 640 + d3,
          left: 90,
          background: `radial-gradient(circle, ${theme.colors.whiteMist}, transparent 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Chão de estúdio: horizonte subtil que dá profundidade aos objetos 3D.
export const StudioFloor: React.FC<{ y?: number; opacity?: number }> = ({ y = 1480, opacity = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
    <div
      style={{
        position: "absolute",
        left: -200,
        right: -200,
        top: y,
        height: 900,
        background: `linear-gradient(180deg, ${theme.colors.whiteMist}, transparent 60%)`,
        borderTop: `1px solid ${theme.colors.stroke}`,
        transform: "perspective(900px) rotateX(58deg)",
        transformOrigin: "50% 0%",
      }}
    />
  </AbsoluteFill>
);

// Camada 4 — grade de cor (acima do conteúdo, abaixo do grão).
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primaryDeep, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill
      style={{
        background:
          `linear-gradient(180deg, ${theme.colors.shade}, transparent 22%, transparent 76%, ${theme.colors.shadeStrong})`,
      }}
    />
  </AbsoluteFill>
);

// Camada 5a — grão procedimental (sem ficheiros).
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "240px",
        backgroundPosition: `${(frame * 37) % 240}px ${(frame * 53) % 240}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Camada 5b — vinheta (topo).
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 85% 70% at 50% 48%, transparent 55%, ${theme.colors.shadeStrong} 100%)`,
    }}
  />
);

// Clarão de luz em momentos de impacto.
export const Flash: React.FC<{ at: number; strength?: number; color?: string }> = ({
  at,
  strength = 0.55,
  color = theme.colors.white,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame, [at, at + 0.07 * fps, at + 0.5 * fps], [0, strength, 0], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: o,
        background: `radial-gradient(circle at 50% 46%, ${color}, transparent 70%)`,
        mixBlendMode: "screen",
      }}
    />
  );
};
