import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { theme } from "../theme";
import { CUTS, FPS9 } from "./timeline9";

// ——— paletas dos três modos (cores livres, contraste forte) ———
export const P = {
  nos: {
    cream: "#F3E4C6",
    paper: "#EAD5AE",
    ink: "#3A281B",
    orange: "#E8732F",
    mustard: "#E6B53B",
    teal: "#3F9C9E",
    red: "#D2412E",
    pink: "#E9A0A0",
    brown: "#6E4A30",
    wood: "#2B1D14",
    shadow: "rgba(58,40,27,0.38)",
  },
  cin: {
    top: "#071A20",
    bottom: "#010607",
    teal: "#29C4D6",
    tealDeep: "#0B4A55",
    orange: "#F29A38",
    gold: "#F6C35F",
    white: "#F5F2EA",
    dim: "rgba(245,242,234,0.62)",
    glass: "rgba(255,255,255,0.07)",
    stroke: "rgba(255,255,255,0.16)",
  },
  his: {
    parchment: "#E7D6B1",
    parchDark: "#C9B183",
    ink: "#18130D",
    sepia: "#5C4128",
    red: "#B3241C",
    gold: "#C29A45",
    cream: "#F4EBD7",
    black: "#0A0806",
  },
} as const;

export const F = {
  display: theme.fonts.display,
  serif: theme.fonts.serif,
  mono: theme.fonts.mono,
  hand: theme.fonts.hand,
  body: theme.fonts.body,
};

// ——— o rosto, com os cortes de pausa e "punch-in" alternado para esconder os saltos ———
export type FaceLook = "nos" | "cin" | "his" | "color";
export const Face: React.FC<{
  sceneFrom: number; // s (início global da cena)
  look: FaceLook;
  colorizeAt?: number; // fotograma local em que passa de P&B a cor
  posY?: number; // object-position vertical (%)
  zoom?: number;
  style?: React.CSSProperties;
}> = ({ sceneFrom, look, colorizeAt, posY = 30, zoom = 1, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const g0 = Math.round(sceneFrom * FPS9);
  const gNow = g0 + frame;
  const idx = CUTS.findIndex((c, i) => gNow >= c.dstFrom && (i === CUTS.length - 1 || gNow < CUTS[i + 1].dstFrom));
  const punch = idx % 2 === 1 ? 1.08 : 1;
  const push = interpolate(frame, [0, durationInFrames], [1, 1.05], clamp);
  const col = colorizeAt === undefined ? 0 : interpolate(frame, [colorizeAt, colorizeAt + 18], [0, 1], clamp);
  const filter =
    look === "nos"
      ? "sepia(0.38) saturate(0.85) contrast(1.06) brightness(1.04) hue-rotate(-6deg)"
      : look === "cin"
        ? "contrast(1.2) saturate(1.18) brightness(0.92)"
        : look === "his"
          ? `grayscale(${1 - col}) sepia(${0.18 * (1 - col)}) contrast(${1.45 - 0.37 * col}) brightness(${0.94 + 0.06 * col}) saturate(${1 + 0.08 * col})`
          : "contrast(1.07) saturate(1.1)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", ...style }}>
      <AbsoluteFill style={{ transform: `scale(${punch * push * zoom})`, transformOrigin: `50% ${posY}%`, filter }}>
        {CUTS.map((c, i) => {
          const from = c.dstFrom - g0;
          const len = i === CUTS.length - 1 ? 9999 : CUTS[i + 1].dstFrom - c.dstFrom;
          if (from + len < -2 || from > durationInFrames + 2) return null;
          return (
            <Sequence key={i} from={from} durationInFrames={len} layout="none">
              <OffthreadVideo
                src={staticFile("v9/rosto.mp4")}
                trimBefore={c.srcFrom}
                muted
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${posY}%` }}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {look === "cin" && (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(160deg, rgba(10,90,110,0.55), rgba(0,0,0,0) 55%)", mixBlendMode: "soft-light" }} />
          <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 38%, rgba(255,150,60,0.32), rgba(0,0,0,0) 70%)", mixBlendMode: "soft-light" }} />
        </>
      )}
      {look === "nos" && <AbsoluteFill style={{ background: "rgba(255,170,90,0.10)", mixBlendMode: "multiply" }} />}
    </AbsoluteFill>
  );
};

// ——— grão animado ———
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;
export const Grain: React.FC<{ opacity: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ opacity, blend = "overlay" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: NOISE,
        backgroundSize: "260px",
        backgroundPosition: `${(frame * 47) % 260}px ${(frame * 71) % 260}px`,
        opacity,
        mixBlendMode: blend,
      }}
    />
  );
};

// ——— camada VHS (nostálgico) ———
export const VHSOverlay: React.FC<{ t: number; rec?: boolean }> = ({ t, rec = true }) => {
  const frame = useCurrentFrame();
  const band = (t * 0.33) % 1;
  const showBand = Math.sin(t * 1.7) > 0.55;
  const ss = Math.floor(t);
  const ff = Math.floor((t % 1) * 30);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.13) 0 2px, transparent 2px 5px)" }} />
      <Grain opacity={0.16} />
      {showBand && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${band * 100}%`,
            height: 46,
            background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent)",
            backgroundImage: NOISE,
            opacity: 0.55,
            transform: `translateX(${Math.sin(frame) * 14}px)`,
          }}
        />
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(30,15,5,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 64, top: 70, fontFamily: F.mono, fontSize: 40, color: "#F8F1E0", letterSpacing: "0.08em", textShadow: "3px 0 rgba(255,0,60,0.6), -3px 0 rgba(0,220,255,0.6)" }}>
        PLAY ▶
      </div>
      {rec && (
        <div style={{ position: "absolute", right: 64, top: 70, display: "flex", alignItems: "center", gap: 14, fontFamily: F.mono, fontSize: 40, color: "#F8F1E0", textShadow: "3px 0 rgba(255,0,60,0.6), -3px 0 rgba(0,220,255,0.6)" }}>
          <div style={{ width: 26, height: 26, borderRadius: 13, background: "#FF3B30", opacity: Math.floor(frame / 15) % 2 ? 1 : 0.2 }} />
          REC
        </div>
      )}
      <div style={{ position: "absolute", right: 64, bottom: 70, fontFamily: F.mono, fontSize: 36, color: "#F8F1E0", letterSpacing: "0.06em", textShadow: "3px 0 rgba(255,0,60,0.6), -3px 0 rgba(0,220,255,0.6)" }}>
        SP 0:00:{String(ss).padStart(2, "0")}:{String(ff).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

// ——— camada cinema: barras 2.39:1, grão fino, vinheta ———
export const BAR = 230;
export const CinemaOverlay: React.FC<{ barsIn: number }> = ({ barsIn }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Grain opacity={0.08} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR * barsIn, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR * barsIn, background: "#000" }} />
  </AbsoluteFill>
);

// ——— camada histórica: grão forte, riscos, pó, cintilação, vinheta ———
export const HistoricOverlay: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const frame = useCurrentFrame();
  const flick = 0.06 + random(`fl${Math.floor(frame / 2)}`) * 0.06;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: strength }}>
      <Grain opacity={0.22} blend="multiply" />
      <Grain opacity={0.12} />
      {[0, 1, 2].map((k) => {
        const life = Math.floor(frame / (9 + k * 5));
        const on = random(`sc${k}-${life}`) > 0.45;
        return on ? (
          <div key={k} style={{ position: "absolute", top: 0, bottom: 0, left: `${random(`sx${k}-${life}`) * 100}%`, width: 2, background: "rgba(255,248,230,0.45)", opacity: 0.6 }} />
        ) : null;
      })}
      {Array.from({ length: 6 }).map((_, k) => {
        const life = Math.floor(frame / 3);
        return random(`du${k}-${life}`) > 0.6 ? (
          <div
            key={k}
            style={{
              position: "absolute",
              left: `${random(`dx${k}-${life}`) * 100}%`,
              top: `${random(`dy${k}-${life}`) * 100}%`,
              width: 4 + random(`ds${k}-${life}`) * 8,
              height: 4 + random(`dt${k}-${life}`) * 8,
              borderRadius: "50%",
              background: "rgba(20,14,8,0.6)",
            }}
          />
        ) : null;
      })}
      <AbsoluteFill style={{ background: `rgba(255,240,210,${flick})`, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 66% at 50% 48%, transparent 50%, rgba(10,6,2,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

// ——— transições de entrada de cena (0,45 s) ———
export type Enter9 = "vhs" | "flare" | "zoom" | "iris" | "burn" | "slam" | "none";
export const SceneIn: React.FC<{ kind: Enter9; children: React.ReactNode; irisAt?: [number, number] }> = ({ kind, children, irisAt = [540, 960] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round(0.45 * fps);
  const p = interpolate(frame, [0, len], [0, 1], { easing: theme.ease.inOut, ...clamp });
  if (kind === "none" || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (kind === "vhs") {
    const j = (1 - p) * 40;
    return (
      <AbsoluteFill
        style={{
          clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`,
          transform: `translateX(${Math.sin(frame * 9) * j}px)`,
          filter: `drop-shadow(${10 * (1 - p)}px 0 0 rgba(255,0,60,0.65)) drop-shadow(${-10 * (1 - p)}px 0 0 rgba(0,220,255,0.65))`,
        }}
      >
        {children}
        <div style={{ position: "absolute", left: 0, right: 0, top: `${p * 100}%`, height: 60, marginTop: -60, backgroundImage: NOISE, opacity: 0.9 }} />
      </AbsoluteFill>
    );
  }
  if (kind === "flare") {
    const x = p * 1080;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{children}</AbsoluteFill>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: x - 60, width: 120, background: "linear-gradient(90deg, transparent, rgba(255,230,190,0.9), transparent)", filter: "blur(6px)" }} />
        <div style={{ position: "absolute", left: x - 900, width: 1800, top: 940, height: 10, background: "linear-gradient(90deg, transparent, rgba(80,210,255,0.85), transparent)", filter: "blur(3px)" }} />
      </AbsoluteFill>
    );
  }
  if (kind === "zoom") {
    return <AbsoluteFill style={{ opacity: p, transform: `scale(${1.25 - 0.25 * p})`, filter: `blur(${(1 - p) * 16}px)` }}>{children}</AbsoluteFill>;
  }
  if (kind === "slam") {
    const s = spring({ frame, fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
    return <AbsoluteFill style={{ opacity: Math.min(1, frame / 2), transform: `scale(${1.12 - 0.12 * s})` }}>{children}</AbsoluteFill>;
  }
  if (kind === "iris") {
    const r = p * 1500;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `circle(${r}px at ${irisAt[0]}px ${irisAt[1]}px)` }}>{children}</AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: irisAt[0] - r,
            top: irisAt[1] - r,
            width: 2 * r,
            height: 2 * r,
            borderRadius: "50%",
            boxShadow: `0 0 0 ${30 * (1 - p)}px ${P.his.black}`,
          }}
        />
      </AbsoluteFill>
    );
  }
  // burn: queima de película laranja que revela a cena
  const b = interpolate(frame, [0, len * 0.5, len], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: interpolate(p, [0.35, 0.6], [0, 1], clamp) }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 45%, rgba(255,250,235,1) 0%, rgba(255,170,60,0.95) 30%, rgba(170,50,10,0.7) 55%, rgba(0,0,0,0) 75%)", opacity: b, transform: `scale(${0.6 + p * 1.4})` }} />
    </AbsoluteFill>
  );
};
