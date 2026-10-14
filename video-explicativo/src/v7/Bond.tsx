import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, SyncedWords, SyncWord } from "../components/Motion";
import { c2, ease } from "../v2/theme2";
import { t2 } from "../v2/type2";
import { ChapterNumber, IconX } from "../v2/components/Kit";
import { emo } from "../v6/Emotion";

// Vídeo 7 — a mesma linguagem emocional do vídeo 6 (fios de ligação, batimento,
// luz quente/fria), agora com o "fio que se rompe": cada tipo de pessoa a evitar
// liga-se a você e, no fim do capítulo, o fio fica vermelho, treme e parte-se.

export const v7 = {
  bokehLight: "rgba(255,255,255,0.75)",
  ink: c2.ink,
  dimOnDark: "rgba(255,255,255,0.62)",
} as const;

// Legenda que entra e sai (frases que se substituem no mesmo sítio).
export const useWindow = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = interpolate(frame, [from, from + 0.3 * fps], [0, 1], { easing: ease.out, ...clamp });
  const o = interpolate(frame, [to - 0.25 * fps, to], [0, 1], { easing: ease.in, ...clamp });
  return { opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 30}px)` };
};

type Pt = [number, number];
const lerp = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

// Fio de ligação que se desenha (at), fica tenso e vermelho, e parte-se (snapAt):
// as duas metades recolhem para as pontas, caem com o peso e apagam-se.
export const SnapThread: React.FC<{
  from: Pt;
  to: Pt;
  at: number;
  snapAt: number;
  bend?: number;
  color?: string;
  glow?: string;
  width?: number;
}> = ({ from, to, at, snapAt, bend = 0.2, color = c2.inkFaint, glow = c2.line, width = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + emo.standard * fps], [0, 1], { easing: emo.ease, ...clamp });
  if (p <= 0) return null;
  const tension = interpolate(frame, [snapAt - 0.35 * fps, snapAt], [0, 1], { easing: ease.in, ...clamp });
  const k = interpolate(frame, [snapAt, snapAt + 0.55 * fps], [0, 1], { easing: ease.out, ...clamp });
  if (k >= 1) return null;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const tremble = frame < snapAt ? Math.sin(frame * 2.7) * 9 * tension : 0;
  const cp: Pt = [(from[0] + to[0]) / 2 - dy * bend + tremble, (from[1] + to[1]) / 2 + dx * bend + tremble];
  const stroke = tension > 0.5 || k > 0 ? c2.red : color;
  const halo = tension > 0.5 || k > 0 ? c2.glowRed : glow;

  if (frame < snapAt) {
    const d = `M ${from[0]} ${from[1]} Q ${cp[0]} ${cp[1]} ${to[0]} ${to[1]}`;
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        <path d={d} stroke={halo} strokeWidth={width * 4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.5} />
        <path d={d} stroke={stroke} strokeWidth={width + tension * 1.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      </svg>
    );
  }
  // de Casteljau a meio: duas metades, cada uma a recolher para a sua ponta
  const m01 = lerp(from, cp, 0.5);
  const m12 = lerp(cp, to, 0.5);
  const mid = lerp(m01, m12, 0.5);
  const sag = k * 110;
  const midA: Pt = [mid[0] - 20 * k, mid[1] + sag];
  const midB: Pt = [mid[0] + 20 * k, mid[1] + sag];
  const cA: Pt = [m01[0], m01[1] + sag * 0.6];
  const cB: Pt = [m12[0], m12[1] + sag * 0.6];
  const dA = `M ${from[0]} ${from[1]} Q ${cA[0]} ${cA[1]} ${midA[0]} ${midA[1]}`;
  const dB = `M ${to[0]} ${to[1]} Q ${cB[0]} ${cB[1]} ${midB[0]} ${midB[1]}`;
  const vis = 1 - k;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {[dA, dB].map((d, i) => (
        <path key={i} d={d} stroke={c2.red} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${vis} 1`} opacity={0.4 + vis * 0.6} />
      ))}
      {/* faíscas no ponto de rutura */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + random(`sp${i}`) * 0.5;
        const r = 10 + k * (50 + random(`sr${i}`) * 50);
        return <circle key={i} cx={mid[0] + Math.cos(a) * r} cy={mid[1] + Math.sin(a) * r + k * k * 40} r={4 * (1 - k) + 1} fill={i % 2 ? c2.red : c2.redLight} opacity={1 - k} />;
      })}
    </svg>
  );
};

// Progresso dos 5 tipos: os anteriores ficam vermelhos (evitados), o atual pulsa.
export const Progress: React.FC<{ current: number; dark?: boolean }> = ({ current, dark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inP = interpolate(frame, [4, 16], [0, 1], { easing: ease.out, ...clamp });
  return (
    <div style={{ position: "absolute", top: 92, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18, opacity: inP }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const past = i < current;
        const now = i === current;
        const pulse = now ? 1 + Math.max(0, Math.sin(t * 5)) * 0.08 : 1;
        return (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${pulse})`,
              background: past ? c2.red : now ? c2.turq : "transparent",
              border: `2px solid ${past ? c2.red : now ? c2.turq : dark ? "rgba(255,255,255,0.28)" : c2.lineStrong}`,
              boxShadow: now ? `0 0 0 8px ${c2.glowTurq}` : "none",
              ...t2.mono,
              color: c2.white,
              letterSpacing: 0,
              fontSize: 18,
            }}
          >
            {past ? <IconX size={22} stroke={3} /> : <span style={{ color: now ? c2.white : dark ? "rgba(255,255,255,0.5)" : c2.inkFaint }}>{i}</span>}
          </div>
        );
      })}
    </div>
  );
};

// Cabeçalho de capítulo: número em contorno que se enche + "tipo n/5 · evite" + título.
export const ChapterHead: React.FC<{ n: number; at: number; title: SyncWord[]; dark?: boolean; titleSize?: number }> = ({
  n,
  at,
  title,
  dark = false,
  titleSize = 104,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inN = spring({ frame: frame - (at - 3), fps, config: emo.arrive });
  const fill = interpolate(frame, [at, at + 0.5 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const col = dark ? c2.aqua : c2.turq;
  return (
    <div style={{ position: "absolute", top: 170, left: 64, right: 50, display: "flex", alignItems: "center", gap: 36 }}>
      <div style={{ opacity: interpolate(inN, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - inN) * 60}px) scale(${0.85 + inN * 0.15})` }}>
        <ChapterNumber n={String(n)} color={col} size={250} fill={fill} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...t2.mono, fontSize: 24, color: dark ? v7.dimOnDark : c2.inkFaint, opacity: interpolate(frame, [at, at + 8], [0, 1], clamp) }}>
          tipo {n}/5 · <span style={{ color: c2.red }}>evite</span>
        </div>
        <SyncedWords
          style={{ ...t2.impact, fontSize: titleSize, color: dark ? c2.white : c2.ink, justifyContent: "flex-start", lineHeight: 0.98 }}
          gap={22}
          rise={44}
          words={title}
        />
      </div>
    </div>
  );
};

// Legenda alinhada à esquerda (abaixo do cabeçalho).
export const Caption: React.FC<{ words: SyncWord[]; dark?: boolean; size?: number; top: number; style?: React.CSSProperties }> = ({
  words,
  dark = false,
  size = 60,
  top,
  style,
}) => (
  <div style={{ position: "absolute", top, left: 70, right: 70, ...style }}>
    <SyncedWords style={{ ...t2.light, fontSize: size, color: dark ? v7.dimOnDark : c2.inkSoft, justifyContent: "flex-start" }} gap={15} words={words} />
  </div>
);
