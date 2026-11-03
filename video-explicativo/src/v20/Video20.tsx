import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFonts } from "../fonts";
import { FADES, FPS20, fxFrame, opacityAt, Shot20, TITLE, visibleAt, zoomAt } from "./edit20";

loadFonts();

// ——— Vídeo 20 "A Moment of Silence": curta contemplativa (filmagem fixa, 4K, som original) ———
const W = 2160;
const H = 3840;
const T = { ink: "#050506", paper: "#E8E2D6", ui: "Inter Tight" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ondulação de película (gate weave) e cintilação: lentas, sub-píxel, quase invisíveis
const weave = (t: number) => ({
  x: 1.3 * Math.sin(t * 2 * Math.PI * 0.37 + 0.4) + 0.7 * Math.sin(t * 2 * Math.PI * 1.13 + 1.9),
  y: 1.0 * Math.sin(t * 2 * Math.PI * 0.29 + 2.2) + 0.5 * Math.sin(t * 2 * Math.PI * 0.91 + 0.7),
});
const flicker = (t: number) => 1 + 0.005 * Math.sin(t * 2 * Math.PI * 1.7) + 0.003 * Math.sin(t * 2 * Math.PI * 4.3 + 1.1);

const frameStyle = (sh: Shot20, t: number): React.CSSProperties => {
  const z = zoomAt(sh, t) * 1.004; // margem para a ondulação
  const mx = ((z - 1) * W) / 2;
  const my = ((z - 1) * H) / 2;
  const w = weave(t);
  const tx = Math.max(-mx, Math.min(mx, (0.5 - sh.c[0]) * W * z)) + w.x;
  const ty = Math.max(-my, Math.min(my, (0.5 - sh.c[1]) * H * z)) + w.y;
  return { transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "50% 50%" };
};

const Footage: React.FC<{ sh: Shot20; t: number; frame: number }> = ({ sh, t, frame }) => (
  <AbsoluteFill style={frameStyle(sh, t)}>
    <Img src={staticFile(fxFrame(sh, frame))} style={{ width: W, height: H }} />
  </AbsoluteFill>
);

const Plate: React.FC<{ sh: Shot20; t: number }> = ({ sh, t }) => (
  <AbsoluteFill style={frameStyle(sh, t)}>
    <Img src={staticFile("v20/empty4k.png")} style={{ width: W, height: H }} />
  </AbsoluteFill>
);

// grão de película: texturas pré-geradas com a mesma média (scripts/grain-v20.py), a meia
// resolução e ampliadas ×2 → grãos de ~2 px em 4K, sem "clarões" de um fotograma
const GRAINS = 48;
const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <Img
    src={staticFile(`v20/grain/g${String((frame * 17) % GRAINS).padStart(2, "0")}.png`)}
    style={{ position: "absolute", left: 0, top: 0, width: W, height: H, mixBlendMode: "overlay", opacity: 0.17 }}
  />
);

const Title: React.FC<{ t: number }> = ({ t }) => {
  const [a, b] = TITLE.span;
  if (t < a || t > b) return null;
  const inP = interpolate(t, [a, a + 1.1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const out = interpolate(t, [b - 1.0, b], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: T.ui,
          fontWeight: 300,
          fontSize: 84,
          letterSpacing: "0.52em",
          marginRight: "-0.52em",
          color: T.paper,
          opacity: inP * out * 0.92,
          filter: inP < 0.99 ? `blur(${(1 - inP) * 6}px)` : undefined,
          transform: `translateY(${(1 - inP) * 10}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {TITLE.txt}
      </div>
    </AbsoluteFill>
  );
};

export type Video20Props = { music: boolean };

export const Video20: React.FC<Video20Props> = ({ music }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS20;
  const shots = visibleAt(t);
  const fromBlack = interpolate(t, FADES.fromBlack, [1, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const toBlack = interpolate(t, FADES.toBlack, [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const black = Math.max(fromBlack, toBlack);
  return (
    <AbsoluteFill style={{ background: T.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `brightness(${flicker(t)})` }}>
        {shots.map((sh) => (
          // nunca opacidade 1 nem 0 exatos: o Chrome muda de caminho de composição nesses extremos
          // (passo de ~1 nível de brilho no fim de cada dissolução); 0,995 (254/255) é imperceptível
          <AbsoluteFill key={sh.id} style={{ opacity: Math.min(0.995, opacityAt(sh, t)) }}>
            {sh.kind === "plate" ? <Plate sh={sh} t={t} /> : <Footage sh={sh} t={t} frame={frame} />}
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
      {/* vinheta muito suave (a luz da janela continua a ser o centro) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 66% at 56% 44%, rgba(0,0,0,0) 60%, rgba(4,3,2,0.30) 100%)" }} />
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(0.002, black) }} />
      <Title t={t} />
      {music && <Audio src={staticFile("audio20.m4a")} />}
    </AbsoluteFill>
  );
};
