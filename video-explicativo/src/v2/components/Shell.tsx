import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, Pattern, Surface } from "../theme2";
import { clamp } from "../../components/Motion";

const surfaceBg: Record<Surface, string> = {
  white: `radial-gradient(120% 60% at 50% 0%, ${c2.paper} 0%, ${c2.white} 55%)`,
  mist: `linear-gradient(180deg, ${c2.paper} 0%, ${c2.mist} 100%)`,
  turq: `linear-gradient(160deg, ${c2.turqLight} -25%, ${c2.turq} 38%, ${c2.turqDeep} 100%)`,
  deep: `linear-gradient(170deg, ${c2.turqDeep} 0%, ${c2.turqDark} 100%)`,
};

const onDark = (s: Surface) => s === "turq" || s === "deep";

// Padrões de fundo — um por cena, a derivar devagar.
const PatternLayer: React.FC<{ pattern: Pattern; surface: Surface }> = ({ pattern, surface }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ln = onDark(surface) ? "rgba(255,255,255,0.10)" : c2.line;
  const lnStrong = onDark(surface) ? "rgba(255,255,255,0.16)" : c2.lineStrong;
  const drift = t * 6;
  switch (pattern) {
    case "dots":
      return (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle, ${lnStrong} 2px, transparent 2.6px)`,
            backgroundSize: "44px 44px",
            backgroundPosition: `${drift}px ${drift * 0.5}px`,
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 30%, transparent 100%)",
          }}
        />
      );
    case "grid":
      return (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${ln} 1.5px, transparent 1.5px), linear-gradient(90deg, ${ln} 1.5px, transparent 1.5px)`,
            backgroundSize: "72px 72px",
            backgroundPosition: `${drift}px 0px`,
          }}
        />
      );
    case "diagonal":
      return (
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, ${ln} 0 1.5px, transparent 1.5px 38px)`,
            backgroundPosition: `${drift}px 0px`,
            maskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        />
      );
    case "rings":
      return (
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 50% 46%, ${ln} 0 2px, transparent 2px ${78 + Math.sin(t) * 2}px)`,
            transform: `scale(${1 + t * 0.006})`,
          }}
        />
      );
    case "ledger":
      return (
        <AbsoluteFill>
          <AbsoluteFill
            style={{
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0 63px, ${ln} 63px 65px)`,
              backgroundPosition: `0px ${drift}px`,
            }}
          />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 120, width: 2, background: c2.turqMist }} />
        </AbsoluteFill>
      );
    case "floor":
      return (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: -600,
              right: -600,
              top: 1180,
              height: 1400,
              backgroundImage: `linear-gradient(${lnStrong} 2px, transparent 2px), linear-gradient(90deg, ${lnStrong} 2px, transparent 2px)`,
              backgroundSize: "120px 120px",
              backgroundPosition: `0px ${drift * 3}px`,
              transform: "perspective(700px) rotateX(64deg)",
              transformOrigin: "50% 0%",
              maskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
              WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1080,
              height: 200,
              background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${c2.glowTurq}, transparent 70%)`,
              opacity: 0.5,
            }}
          />
        </AbsoluteFill>
      );
    default:
      return null;
  }
};

export type Enter = "iris" | "wipeUp" | "wipeLeft" | "panel" | "zoom" | "none";

// Moldura de cena: fundo + padrão + transição de entrada própria.
export const SceneShell: React.FC<{
  surface: Surface;
  pattern: Pattern;
  enter: Enter;
  irisAt?: [number, number];
  children: React.ReactNode;
}> = ({ surface, pattern, enter, irisAt = [540, 960], children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round(0.5 * fps);
  const p = interpolate(frame, [0, len], [0, 1], { easing: ease.inOut, ...clamp });

  let wrap: React.CSSProperties = {};
  if (enter === "iris") wrap = { clipPath: `circle(${p * 125}% at ${irisAt[0]}px ${irisAt[1]}px)` };
  if (enter === "wipeUp") wrap = { clipPath: `inset(${(1 - p) * 100}% 0 0 0)` };
  if (enter === "wipeLeft") wrap = { clipPath: `inset(0 0 0 ${(1 - p) * 100}%)` };
  if (enter === "panel")
    wrap = {
      transform: `translateY(${(1 - p) * 100}%) scale(${0.9 + p * 0.1})`,
      borderRadius: (1 - p) * 90,
      overflow: "hidden",
      boxShadow: `0 -40px 120px ${c2.shadowDeep}`,
    };
  if (enter === "zoom") wrap = { opacity: p, transform: `scale(${1.12 - p * 0.12})`, filter: `blur(${(1 - p) * 18}px)` };

  return (
    <AbsoluteFill style={wrap}>
      <AbsoluteFill style={{ background: surfaceBg[surface] }} />
      <PatternLayer pattern={pattern} surface={surface} />
      {children}
    </AbsoluteFill>
  );
};

// Grão muito subtil + vinheta suave (acabamento sobre tudo).
export const Finish2: React.FC = () => {
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
          opacity: 0.035,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse 90% 75% at 50% 48%, transparent 60%, ${c2.shadow} 100%)`,
        }}
      />
    </>
  );
};
