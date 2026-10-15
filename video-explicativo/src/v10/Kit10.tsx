import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { EASE, F10, P10, Spr, SPR } from "./look10";

// Relógio em segundos absolutos do áudio (offset = início da cena).
export const useClock = (offset = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = offset + frame / fps;
  const sp = (at: number, cfg: Spr = SPR.soft) => spring({ frame: frame - Math.round((at - offset) * fps), fps, config: cfg });
  const ez = (a: number, b: number, from = 0, to = 1, easing = EASE.inOut) => interpolate(t, [a, b], [from, to], { easing, ...clamp });
  return { frame, fps, t, sp, ez };
};

// ——— fundo: papel branco premium, luz turquesa e cinza a respirar, grelha de pontos ———
export const Paper: React.FC<{ warm?: number }> = ({ warm = 0 }) => {
  const { t } = useClock();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1000px 760px at ${30 + Math.sin(t * 0.3) * 6}% ${14 + Math.cos(t * 0.25) * 3}%, rgba(0,167,181,${0.1 + warm * 0.06}), transparent 62%), radial-gradient(900px 900px at ${82 + Math.cos(t * 0.2) * 4}% 88%, rgba(138,148,162,0.18), transparent 60%), linear-gradient(180deg, #FFFFFF 0%, ${P10.paperCool} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(11,13,18,0.075) 1.3px, transparent 1.7px)",
          backgroundSize: "38px 38px",
          backgroundPosition: `${(t * 6) % 38}px ${(t * 3) % 38}px`,
          WebkitMaskImage: "radial-gradient(ellipse 72% 58% at 50% 46%, black 25%, transparent 85%)",
          maskImage: "radial-gradient(ellipse 72% 58% at 50% 46%, black 25%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;
// gradação + grão + vinheta cinza suave (por cima de tudo)
export const Finish10: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 88% 72% at 50% 46%, rgba(255,255,255,0) 55%, rgba(72,82,96,0.17) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "240px", backgroundPosition: `${(frame * 37) % 240}px ${(frame * 53) % 240}px`, opacity: 0.05, mixBlendMode: "multiply", pointerEvents: "none" }} />
    </>
  );
};

// ——— título cinético: cada palavra entra quando é dita; sai depressa para cima ———
export type HWord = { w: string; at: number; color?: string; serif?: boolean; pill?: string; icon?: React.ReactNode };
export type HRow = { words: HWord[]; size?: number; weight?: number; color?: string };
export const Headline: React.FC<{ rows: HRow[]; out: number; offset?: number; top?: number }> = ({ rows, out, offset = 0, top = 190 }) => {
  const { sp, ez } = useClock(offset);
  const gone = ez(out - 0.12, out + 0.14, 0, 1, EASE.in);
  if (gone >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 1 - gone, transform: `translateY(${-60 * gone}px)`, filter: `blur(${gone * 6}px)` }}>
      {rows.map((r, ri) => {
        const size = r.size ?? 88;
        return (
          <div key={ri} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: Math.round(size * 0.24) }}>
            {r.words.map((h, wi) => {
              const p = sp(h.at - 0.04, SPR.snap);
              const pill = sp(h.at + 0.1, SPR.soft);
              const fs = h.serif ? size * 1.16 : size;
              return (
                <span
                  key={wi}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 14,
                    fontFamily: h.serif ? F10.serif : F10.display,
                    fontStyle: h.serif ? "italic" : "normal",
                    fontWeight: h.serif ? 400 : r.weight ?? 800,
                    fontSize: fs,
                    lineHeight: 1.08,
                    letterSpacing: h.serif ? "-0.01em" : "-0.035em",
                    color: h.color ?? r.color ?? P10.ink,
                    opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
                    transform: `translateY(${(1 - p) * 44}px) scale(${0.94 + p * 0.06})`,
                    filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
                  }}
                >
                  {h.pill && (
                    <span style={{ position: "absolute", left: -10, right: -10, bottom: fs * 0.08, height: fs * 0.36, borderRadius: 10, background: h.pill, transform: `scaleX(${pill})`, transformOrigin: "left", zIndex: -1 }} />
                  )}
                  {h.icon}
                  {h.w}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ——— ícones desenhados (nunca emoji) ———
export const CheckIcon: React.FC<{ s: number; c?: string; w?: number }> = ({ s, c = "#fff", w = 3.2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const StarIcon: React.FC<{ s: number; c?: string }> = ({ s, c = P10.amber }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={c} />
  </svg>
);
export const BrainIcon: React.FC<{ s: number; c?: string; glow?: number; w?: number }> = ({ s, c = P10.violet, glow = 0, w = 2.4 }) => (
  <svg width={s} height={s} viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ filter: glow ? `drop-shadow(0 0 ${10 * glow}px ${c})` : undefined, overflow: "visible" }}>
    <path d="M24 8c-2.6-3-8-3-10 .6-4.2-.4-7.4 3.4-6.2 7.4-3.6 1.6-4.4 6.6-1.6 9.2-2 3.4.4 8 4.4 8.2.6 4 5.4 6 8.8 3.6 1.8 1.6 3.4 2 4.6 1.6z" fill={`${c}1A`} />
    <path d="M24 8c2.6-3 8-3 10 .6 4.2-.4 7.4 3.4 6.2 7.4 3.6 1.6 4.4 6.6 1.6 9.2 2 3.4-.4 8-4.4 8.2-.6 4-5.4 6-8.8 3.6-1.8 1.6-3.4 2-4.6 1.6z" fill={`${c}1A`} />
    <path d="M24 8v31M15 16c2.4.2 4 1.8 4.4 4M33 16c-2.4.2-4 1.8-4.4 4M12 26c2.6-.6 5 .4 6 2.6M36 26c-2.6-.6-5 .4-6 2.6" />
  </svg>
);
export const HookIcon: React.FC<{ s: number; c?: string; w?: number }> = ({ s, c = P10.ink, w = 3 }) => (
  <svg width={s} height={s * 1.5} viewBox="0 0 32 48" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: "visible" }}>
    <circle cx={20} cy={4} r={3} />
    <path d="M20 7v24a9 9 0 0 1-18 0v-5" />
    <path d="M2 26l5 4" />
  </svg>
);
export const TargetIcon: React.FC<{ s: number; c?: string }> = ({ s, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.4} strokeLinecap="round">
    <circle cx={12} cy={12} r={9} />
    <circle cx={12} cy={12} r={5} />
    <circle cx={12} cy={12} r={1.4} fill={c} />
  </svg>
);
export const GemIcon: React.FC<{ s: number; c?: string }> = ({ s, c = P10.amber }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 12L2 9z" fill={`${c}33`} />
    <path d="M2 9h20M9 3l3 18 3-18M6 3l3 6M18 3l-3 6" />
  </svg>
);

// brilho em estrela de quatro pontas (detalhe vivo)
export const Spark: React.FC<{ x: number; y: number; s: number; at: number; c?: string; offset?: number }> = ({ x, y, s, at, c = P10.amber, offset = 0 }) => {
  const { t, sp } = useClock(offset);
  const p = sp(at, SPR.pop);
  if (p <= 0.01) return null;
  const fade = interpolate(t - at, [0.5, 1.1], [1, 0.35], clamp);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={{ position: "absolute", left: x - s / 2, top: y - s / 2, transform: `scale(${p}) rotate(${(t - at) * 60}deg)`, opacity: fade }}>
      <path d="M12 0c.8 6 5.2 10.4 12 12-6.8 1.6-11.2 6-12 12-.8-6-5.2-10.4-12-12C6.8 10.4 11.2 6 12 0z" fill={c} />
    </svg>
  );
};

// pílula/etiqueta
export const Chip: React.FC<{ bg: string; color: string; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ bg, color, children, size = 28, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 999, background: bg, color, fontFamily: F10.display, fontWeight: 700, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);
