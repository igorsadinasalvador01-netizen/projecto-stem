import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "../components/Motion";
import { BAR, F, P } from "./Look";
import { CHUNKS, modeAt, sceneAt, VOICE_END } from "./timeline9";

// Legendas como no EXEMPLO (blocos de 1–3 palavras, palavra ativa destacada),
// com um "skin" por modo: VHS quente, legenda de cinema na barra, serifa de arquivo.
export const Captions9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t > VOICE_END + 0.2) return null;
  const ci = CHUNKS.findIndex((c) => t >= c.start - 0.06 && t < c.end);
  if (ci < 0) return null;
  const c = CHUNKS[ci];
  const mode = modeAt(c.start);
  const sc = sceneAt(c.start);
  const pop = spring({ frame: frame - Math.round((c.start - 0.06) * fps), fps, config: { damping: 14, stiffness: 260, mass: 0.5 } });
  const y =
    mode === "cin" && sc.cap !== "mid"
      ? 1920 - BAR / 2 - 6
      : sc.cap === "low"
        ? 1430
        : sc.cap === "mid"
          ? 975
          : 1650;

  const base: React.CSSProperties =
    mode === "nos"
      ? { fontFamily: F.display, fontWeight: 800, fontSize: 76, letterSpacing: "-0.02em", color: "#FFF4DF", textShadow: "0 5px 0 rgba(58,40,27,0.55), 3px 0 rgba(255,0,60,0.35), -3px 0 rgba(0,220,255,0.35)" }
      : mode === "cin"
        ? { fontFamily: F.display, fontWeight: 700, fontSize: 54, letterSpacing: "0.1em", textTransform: "uppercase", color: P.cin.white, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }
        : { fontFamily: F.serif, fontWeight: 400, fontSize: 88, letterSpacing: "-0.01em", color: P.his.cream, textShadow: "0 4px 18px rgba(0,0,0,0.85)" };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: y,
          transform: `translateY(-50%) translateY(${(1 - pop) * 18}px) scale(${0.92 + pop * 0.08})`,
          opacity: interpolate(pop, [0, 0.4], [0, 1], clamp),
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: mode === "cin" ? "0 22px" : "0 16px",
          ...base,
        }}
      >
        {c.words.map((w, i) => {
          const active = t >= w.start - 0.04 && (i === c.words.length - 1 || t < c.words[i + 1].start - 0.04);
          const said = t >= w.start - 0.04;
          if (mode === "nos")
            return (
              <span
                key={i}
                style={{
                  padding: "2px 14px 6px",
                  borderRadius: 12,
                  background: active ? P.nos.orange : "transparent",
                  transform: active ? "rotate(-2deg)" : "none",
                  opacity: said ? 1 : 0.55,
                }}
              >
                {w.text}
              </span>
            );
          if (mode === "cin")
            return (
              <span key={i} style={{ color: active ? P.cin.gold : said ? P.cin.white : P.cin.dim, textShadow: active ? `0 0 24px rgba(246,195,95,0.7)` : undefined }}>
                {w.text}
              </span>
            );
          return (
            <span
              key={i}
              style={{
                padding: "0 14px 6px",
                background: active ? P.his.red : "transparent",
                fontStyle: active ? "italic" : "normal",
                opacity: said ? 1 : 0.5,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
