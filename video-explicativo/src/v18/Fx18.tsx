import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, EZ } from "../kit/Kit";
import { M, Minv } from "./cuts18";

// Vídeo 18 · destaques da fala (marcas no tempo ORIGINAL da fala):
// · PB só na cena de atenção (a solução perfeita para o problema errado), com a cor a voltar num
//   círculo a partir do rosto; · duas falhas suaves nessa cena; · zoom de impacto nas palavras-chave.

const ez = (to: number, a: number, b: number, e = EZ.inOut) => interpolate(to, [M(a), Math.max(M(b), M(a) + 0.06)], [0, 1], { easing: e, ...clamp });

// [entra, sai] no tempo original; a 3.ª janela sai com revelação circular
// (arranques medidos no áudio da fala, não na estimativa da transcrição)
export const PB_WIN: [number, number][] = [[49.43, 54.96]];
export const REVEAL_AT = 54.96;
export const pbAt = (to: number) => {
  let k = 0;
  PB_WIN.forEach(([a]) => {
    k = Math.max(k, ez(to, a, a + 0.14, EZ.out));
  });
  return to >= M(REVEAL_AT) + 0.55 ? 0 : k;
};
// raio da revelação da cor (0 → 1) na volta do valor
export const revealAt = (to: number) => (to < M(REVEAL_AT) ? 0 : interpolate(to - M(REVEAL_AT), [0, 0.55], [0, 1], { easing: EZ.inOut, ...clamp }));

// falhas: [instante, intensidade, duração]
export const GLITCHES: [number, number, number][] = [
  [49.43, 0.7, 0.2],
  [54.22, 0.8, 0.22],
];
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const glitchAt = (to: number, frame: number) => {
  let g = 0;
  for (const [at, k, d] of GLITCHES) {
    const a = M(at);
    if (to >= a && to < a + d) {
      // picotado: liga/desliga por fotograma, mais forte no início
      const p = (to - a) / d;
      const on = hash(frame * 3.1 + at) > 0.28 ? 1 : 0.25;
      g = Math.max(g, k * on * (1 - p * 0.6));
    }
  }
  return g;
};

// impacto: [palavra no tempo original, força]
export const IMPACTS: [number, number][] = [
  [0.8, 0.5],
  [7.36, 1],
  [9.28, 0.6],
  [12.99, 0.7],
  [32.71, 0.7],
  [39.36, 0.6],
  [43.12, 0.8],
  [49.43, 0.8],
  [54.22, 1],
  [61.04, 0.9],
  [70.88, 0.8],
  [73.52, 0.7],
  [77.76, 0.8],
];
export const impactAt = (to: number) => {
  let z = 0;
  let shake = 0;
  for (const [at, k] of IMPACTS) {
    const d = to - M(at);
    if (d >= 0 && d < 0.6) {
      z = Math.max(z, k * Math.exp(-d / 0.16) * Math.min(1, d / 0.04));
      shake = Math.max(shake, k * Math.exp(-d / 0.07));
    }
  }
  return { z, shake };
};
export const useFx18 = () => {
  const frame = useCurrentFrame();
  const to = frame / 30;
  const im = impactAt(to);
  return { to, t: Minv(to), pb: pbAt(to), reveal: revealAt(to), glitch: glitchAt(to, frame), zoom: 1 + 0.05 * im.z, shake: im.shake, frame };
};

// filtro SVG das falhas: bandas horizontais deslocadas + separação R/G/B
export const GlitchDefs: React.FC<{ g: number; frame: number }> = ({ g, frame }) => {
  const off = 5 + 12 * g;
  const seed = (frame * 7) % 97;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="glitch18" x="-4%" y="0%" width="108%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={`0.00001 ${0.012 + 0.03 * hash(frame)}`} numOctaves={1} seed={seed} result="n" />
        <feComponentTransfer in="n" result="bands">
          <feFuncR type="discrete" tableValues="0.5 0.5 0.15 0.5 0.85 0.5 0.5 0.3 0.5" />
          <feFuncG type="discrete" tableValues="0.5" />
        </feComponentTransfer>
        <feDisplacementMap in="SourceGraphic" in2="bands" scale={100 * g} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feColorMatrix in="d" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={off} dy={0} result="r2" />
        <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gg" />
        <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={-off} dy={0} result="b2" />
        <feBlend in="r2" in2="gg" mode="screen" result="rg" />
        <feBlend in="rg" in2="b2" mode="screen" />
      </filter>
    </svg>
  );
};
