import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { c2, ease } from "../v2/theme2";

// Personalidade "Premium emocional": uma curva-assinatura para quase tudo,
// três durações (rápida / padrão / lenta) e entradas em arco.
export const emo = {
  ease: ease.soft,
  quick: 0.3,
  standard: 0.55,
  slow: 1.1,
  spring: { damping: 20, stiffness: 70, mass: 1 },
  arrive: { damping: 15, stiffness: 95, mass: 0.9 },
  warm: "rgba(255,214,170,0.35)", // luz quente para momentos de ligação
  warmClear: "rgba(255,214,170,0)",
  cold: "rgba(120,150,170,0.30)",
  coldClear: "rgba(120,150,170,0)",
} as const;

// Camada ambiente: bokeh suave a subir devagar (vida de fundo).
export const Bokeh: React.FC<{ color?: string; count?: number; seed?: string; strength?: number }> = ({
  color = c2.glowTurq,
  count = 14,
  seed = "b",
  strength = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const speed = 18 + random(`${seed}s${i}`) * 30;
        const y = ((random(`${seed}y${i}`) * 2200 - t * speed) % 2200 + 2200) % 2200 - 140;
        const r = 30 + random(`${seed}r${i}`) * 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(t * 0.6 + i) * 20 - r,
              top: y - r,
              width: 2 * r,
              height: 2 * r,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color}, ${c2.turqClear} 70%)`,
              opacity: (0.35 + random(`${seed}o${i}`) * 0.35) * strength,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Fio de ligação em arco (bezier quadrática) que se desenha e leva uma faísca.
export const Thread: React.FC<{
  from: [number, number];
  to: [number, number];
  at: number;
  bend?: number;
  color?: string;
  width?: number;
  dur?: number;
  glow?: string;
}> = ({ from, to, at, bend = 0.25, color = c2.turq, width = 4, dur = emo.standard, glow = c2.glowTurq }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + dur * fps], [0, 1], { easing: emo.ease, ...clamp });
  if (p <= 0) return null;
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const d = `M ${from[0]} ${from[1]} Q ${cx} ${cy} ${to[0]} ${to[1]}`;
  // faísca: percorre o fio em loop depois de desenhado
  const loop = ((frame - at) / fps) * 0.7;
  const s = p < 1 ? p : loop % 1;
  const bx = (1 - s) * (1 - s) * from[0] + 2 * (1 - s) * s * cx + s * s * to[0];
  const by = (1 - s) * (1 - s) * from[1] + 2 * (1 - s) * s * cy + s * s * to[1];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} stroke={glow} strokeWidth={width * 4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.5} />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      <circle cx={bx} cy={by} r={width * 2.2} fill={c2.white} opacity={0.95} />
      <circle cx={bx} cy={by} r={width * 5} fill={glow} opacity={0.6} />
    </svg>
  );
};

// Pulso cardíaco: devolve escala (lub-dub) a partir de um instante.
export const useHeartbeat = (at: number, beats = 2) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame - at) / fps;
  if (t < 0 || t > beats * 0.9) return 1;
  const ph = t % 0.9;
  const lub = Math.exp(-((ph - 0.05) ** 2) / 0.002) * 0.06;
  const dub = Math.exp(-((ph - 0.27) ** 2) / 0.002) * 0.035;
  return 1 + lub + dub;
};

// Anel que se expande (eco de um batimento / de uma ligação).
export const Ripple: React.FC<{ at: number; x: number; y: number; color?: string; max?: number }> = ({
  at,
  x,
  y,
  color = c2.turq,
  max = 420,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + emo.slow * fps], [0, 1], { easing: ease.out, ...clamp });
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - max * p,
        top: y - max * p,
        width: 2 * max * p,
        height: 2 * max * p,
        borderRadius: "50%",
        border: `${4 * (1 - p) + 1}px solid ${color}`,
        opacity: 1 - p,
        pointerEvents: "none",
      }}
    />
  );
};

// Estrela (avaliação).
export const Star: React.FC<{ size: number; fill: number; color?: string; empty?: string }> = ({
  size,
  fill,
  color = c2.white,
  empty = c2.glassOnTurq,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id={`sf${Math.round(fill * 100)}`} x1="0" x2="1">
        <stop offset={fill} stopColor={color} />
        <stop offset={fill} stopColor={empty} />
      </linearGradient>
    </defs>
    <path
      d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
      fill={`url(#sf${Math.round(fill * 100)})`}
      strokeLinejoin="round"
    />
  </svg>
);

// Entrada em arco (Disney "arcs"): chega por uma curva, não em linha reta.
export const useArrive = (at: number, fromX: number, fromY: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: emo.arrive });
  const x = fromX * (1 - p);
  const y = fromY * (1 - p) - Math.sin(p * Math.PI) * 60;
  return { p, style: { opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translate(${x}px, ${y}px) scale(${0.85 + p * 0.15})` } };
};
