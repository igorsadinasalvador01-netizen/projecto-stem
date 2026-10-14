import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { c5, ease5 } from "./theme5";

export type Surface5 = "paper" | "ruled" | "teal" | "darkroom";
export type Enter5 = "none" | "film" | "burn" | "page" | "slide" | "flicker";

const fiber = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.36 0 0 0 0 0.24 0 0 0 0.10 0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23p)'/%3E%3C/svg%3E")`;

const Surface: React.FC<{ s: Surface5 }> = ({ s }) => {
  if (s === "teal")
    return (
      <AbsoluteFill style={{ background: `linear-gradient(165deg, ${c5.tealLight} -20%, ${c5.teal} 40%, ${c5.tealDeep} 100%)` }}>
        <AbsoluteFill style={{ backgroundImage: fiber, backgroundSize: "400px", opacity: 0.5, mixBlendMode: "multiply" }} />
      </AbsoluteFill>
    );
  if (s === "darkroom")
    return (
      <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 45%, ${c5.darkroomGlow}, ${c5.clear} 70%), ${c5.darkroom}` }} />
    );
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 40%, ${c5.paperLight}, ${c5.paper} 55%, ${c5.paperDeep} 100%)` }}>
      <AbsoluteFill style={{ backgroundImage: fiber, backgroundSize: "400px" }} />
      {s === "ruled" && (
        <>
          <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(180deg, transparent 0 69px, ${c5.tealMist} 69px 72px)`, backgroundPosition: "0px 30px" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 130, width: 3, background: c5.tealLight, opacity: 0.7 }} />
        </>
      )}
    </AbsoluteFill>
  );
};

// Moldura de cena com transições de cinema antigo.
export const Scene5: React.FC<{
  surface: Surface5;
  enter: Enter5;
  origin?: [number, number];
  children: React.ReactNode;
}> = ({ surface, enter, origin = [540, 960], children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round(0.55 * fps);
  const p = interpolate(frame, [0, len], [0, 1], { easing: ease5.inOut, ...clamp });
  let wrap: React.CSSProperties = {};
  let overlay: React.ReactNode = null;

  if (enter === "film") {
    // tira de película sobe e revela a cena por trás
    const y = 1920 * (1 - p);
    wrap = { clipPath: `inset(${Math.max(0, y)}px 0 0 0)` };
    overlay =
      p < 1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y - 150, height: 180, background: c5.darkroom }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 18, height: 26, backgroundImage: `repeating-linear-gradient(90deg, ${c5.paperLight} 0 34px, transparent 34px 70px)`, borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, height: 26, backgroundImage: `repeating-linear-gradient(90deg, ${c5.paperLight} 0 34px, transparent 34px 70px)`, borderRadius: 6 }} />
        </div>
      ) : null;
  }
  if (enter === "burn") {
    const r = p * 135;
    wrap = { clipPath: `circle(${r}% at ${origin[0]}px ${origin[1]}px)` };
    overlay =
      p < 1 ? (
        <div
          style={{
            position: "absolute",
            left: origin[0] - 2200 * p,
            top: origin[1] - 2200 * p,
            width: 4400 * p,
            height: 4400 * p,
            borderRadius: "50%",
            boxShadow: `0 0 120px 60px ${c5.leakWarm}, inset 0 0 160px 40px ${c5.burn}`,
            opacity: 1 - p,
          }}
        />
      ) : null;
  }
  if (enter === "page") {
    wrap = {
      transform: `perspective(2400px) rotateY(${(1 - p) * -100}deg)`,
      transformOrigin: "0% 50%",
      boxShadow: `-40px 0 80px ${c5.shadowDeep}`,
    };
  }
  if (enter === "slide") {
    wrap = { transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${(1 - p) * 14}px)` };
  }
  if (enter === "flicker") {
    const steps = [0, 0.3, 0.1, 0.6, 0.4, 0.9, 0.7, 1];
    wrap = { opacity: p >= 1 ? 1 : steps[Math.min(steps.length - 1, Math.floor(p * steps.length))] };
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={wrap}>
        <Surface s={surface} />
        {children}
      </AbsoluteFill>
      {overlay}
    </AbsoluteFill>
  );
};

// Trepidação de projetor (gate weave) — envolve o conteúdo.
export const GateWeave: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const x = (random(`wx${Math.floor(frame / 2)}`) - 0.5) * 3;
  const y = (random(`wy${Math.floor(frame / 2)}`) - 0.5) * 3;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px)` }}>{children}</AbsoluteFill>;
};

// Acabamento de película: sépia, fugas de luz, pó, riscos, cintilação, grão, vinheta.
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const flick = (random(`f${frame}`) - 0.5) * 0.06;
  const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;
  const specks = Array.from({ length: 10 }).map((_, i) => ({
    x: random(`dx${frame}-${i}`) * 1080,
    y: random(`dy${frame}-${i}`) * 1920,
    r: 1.5 + random(`dr${frame}-${i}`) * 3.5,
    on: random(`do${frame}-${i}`) > 0.55,
  }));
  const scratch = random(`s${Math.floor(frame / 3)}`) > 0.72;
  const sx = random(`sx${Math.floor(frame / 3)}`) * 1080;
  return (
    <>
      {/* grade sépia */}
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: c5.sepia, mixBlendMode: "soft-light", opacity: 0.32 }} />
      {/* fugas de luz */}
      <div
        style={{
          position: "absolute",
          left: -380 + Math.sin(t * 0.6) * 120,
          top: -260 + Math.cos(t * 0.4) * 100,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c5.leakWarm}, ${c5.clear} 65%)`,
          mixBlendMode: "screen",
          opacity: 0.55 + Math.sin(t * 1.3) * 0.2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -420 + Math.cos(t * 0.5) * 120,
          bottom: -300 + Math.sin(t * 0.7) * 120,
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c5.leakTeal}, ${c5.clear} 65%)`,
          mixBlendMode: "screen",
          opacity: 0.5 + Math.cos(t * 1.1) * 0.2,
          pointerEvents: "none",
        }}
      />
      {/* pó */}
      {specks.map((s, i) =>
        s.on ? (
          <div
            key={i}
            style={{ position: "absolute", left: s.x, top: s.y, width: s.r, height: s.r * (i % 3 === 0 ? 5 : 1), borderRadius: s.r, background: c5.ink, opacity: 0.35, pointerEvents: "none", transform: `rotate(${i * 37}deg)` }}
          />
        ) : null,
      )}
      {/* risco vertical ocasional */}
      {scratch && <div style={{ position: "absolute", top: 0, bottom: 0, left: sx, width: 1.5, background: c5.paperLight, opacity: 0.35, pointerEvents: "none" }} />}
      {/* cintilação */}
      <AbsoluteFill style={{ pointerEvents: "none", background: flick > 0 ? c5.paperLight : c5.ink, opacity: Math.abs(flick) }} />
      {/* grão */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: grain,
          backgroundSize: "260px",
          backgroundPosition: `${(frame * 41) % 260}px ${(frame * 67) % 260}px`,
          opacity: 0.14,
          mixBlendMode: "overlay",
        }}
      />
      {/* vinheta quente */}
      <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 85% 70% at 50% 47%, ${c5.clear} 50%, ${c5.shadowDeep} 85%, ${c5.black} 100%)` }} />
    </>
  );
};

// Queima de película (para o boom).
export const FilmBurn: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + 0.9 * fps], [0, 1], { easing: ease5.out, ...clamp });
  if (p <= 0 || p >= 1) return null;
  const o = interpolate(p, [0, 0.12, 1], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: o }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 45%, ${c5.burn} 0%, ${c5.leakWarm} 35%, ${c5.clear} 75%)`, transform: `scale(${0.6 + p * 1.2})` }} />
    </AbsoluteFill>
  );
};
