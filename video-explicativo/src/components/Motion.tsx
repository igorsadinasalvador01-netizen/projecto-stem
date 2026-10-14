import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Converte instantes absolutos (s, do áudio) em fotogramas locais da cena.
export const useAt = (sceneFromSec: number) => {
  const { fps } = useVideoConfig();
  return (absSec: number) => Math.round((absSec - sceneFromSec) * fps);
};

export const useSpringAt = (delay: number, config: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

// Saída: mais rápida que a entrada, curva "in".
export const useExit = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = Math.round(theme.exitSeconds * fps);
  const p = interpolate(frame, [start, start + len], [0, 1], { easing: theme.ease.in, ...clamp });
  return p;
};

// Entrada premium: opacidade + subida + escala (+ desfoque opcional).
export const Rise: React.FC<{
  delay: number;
  children: React.ReactNode;
  y?: number;
  from?: number;
  blur?: number;
  config?: SpringCfg;
  style?: React.CSSProperties;
}> = ({ delay, children, y = 46, from = 0.94, blur = 10, config = theme.spring.smooth, style }) => {
  const p = useSpringAt(delay, config);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
        transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [from, 1])})`,
        filter: blur ? `blur(${interpolate(p, [0, 1], [blur, 0], clamp)}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Palavras sincronizadas com a voz: cada palavra entra quando é dita.
export type SyncWord = { text: string; at: number; style?: React.CSSProperties };

export const SyncedWords: React.FC<{
  words: SyncWord[];
  style?: React.CSSProperties;
  gap?: number;
  rise?: number;
  lead?: number; // antecipação em fotogramas (o olho gosta de ver a palavra um pouco antes)
}> = ({ words, style, gap = 18, rise = 34, lead = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: gap,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - (w.at - lead), fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
              filter: `blur(${interpolate(p, [0, 1], [8, 0], clamp)}px)`,
              ...w.style,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// Respiração: micro-movimento para tudo o que fica >2 s no ecrã.
export const useBreath = (period = 1.1, amp = 1) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return {
    scale: 1 + Math.sin(t / period) * 0.012 * amp,
    float: Math.sin(t / (period * 1.35)) * 5 * amp,
    tilt: Math.sin(t / (period * 1.7)) * 1.2 * amp,
  };
};

// Empurrão lento de câmara em cada cena.
export const useCameraPush = (durationFrames: number, to = 1.04) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, durationFrames], [1, to], { easing: theme.ease.inOut, ...clamp });
};
