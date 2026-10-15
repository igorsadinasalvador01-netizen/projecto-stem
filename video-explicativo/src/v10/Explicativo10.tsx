import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { Finish10 } from "./Kit10";
import { Efeito10, Psico10, Siga10, Truque10 } from "./Finale10";
import { P10 } from "./look10";
import { Stage10 } from "./Stage10";
import { SCENES10, TOTAL10, W10 as W } from "./timeline10";
import mix from "./mix10.json";

loadFonts();

export type Explicativo10Props = { sfx: boolean; sfxGain: number };

// Sons de entrada nas chegadas, ticks no preço a descer, "no" nos benefícios retirados,
// carimbo na isca; o grave dos 20,35 s é do próprio áudio e fica sozinho.
type Sfx = { file: string; at: number; v?: number };
const seq = (file: string, at: number, n: number, step: number, v?: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ file, at: at + i * step, v }));
const SFX: Sfx[] = [
  // 1 · gancho
  { file: "whoosh.wav", at: 0.02, v: 0.6 },
  { file: "pop.wav", at: W.produto, v: 0.6 },
  { file: "tick.wav", at: W.parecer, v: 0.7 },
  { file: "swish.wav", at: W.barato - 0.05, v: 0.6 },
  { file: "yes.wav", at: W.barato + 0.2, v: 0.5 },
  { file: "shimmer.wav", at: W.psicologia, v: 0.45 },
  // 2 · segunda opção
  { file: "whoosh.wav", at: W.crie - 0.05, v: 0.6 },
  { file: "pop.wav", at: W.segunda, v: 0.7 },
  { file: "thud.wav", at: W.opcao, v: 0.6 },
  ...seq("tick.wav", W.pouco, 8, 0.07, 0.6),
  { file: "pop.wav", at: W.menor + 0.1, v: 0.6 },
  { file: "shimmer.wav", at: W.realmente, v: 0.45 },
  { file: "pop.wav", at: W.realmente + 0.02, v: 0.6 },
  // pausa 8,8–9,3 s: respiração com sopro suave e o tique do cabeçalho
  { file: "swell.wav", at: 8.55, v: 0.45 },
  { file: "swish.wav", at: 9.18, v: 0.45 },
  // 3 · benefícios
  { file: "tick.wav", at: W.beneficios, v: 0.7 },
  ...seq("pop.wav", W.principais, 3, 0.11, 0.55),
  ...seq("tick.wav", W.secundarios, 3, 0.11, 0.6),
  { file: "yes.wav", at: W.cada, v: 0.45 },
  // 4 · o truque (iris preta)
  { file: "whoosh.wav", at: W.aqui - 0.1, v: 0.6 },
  { file: "hit.wav", at: W.truque - 0.04, v: 0.5 },
  { file: "shimmer.wav", at: W.truque + 0.02, v: 0.45 },
  { file: "swish.wav", at: W.retire - 0.22, v: 0.4 },
  // 5 · retirar
  ...[14.5, 14.88, 15.26].flatMap((r): Sfx[] => [
    { file: "no.wav", at: r, v: 0.4 },
    { file: "swish.wav", at: r + 0.22, v: 0.5 },
  ]),
  { file: "alert.wav", at: W.barata, v: 0.35 },
  // 6 · isca
  { file: "whoosh.wav", at: W.vira - 0.12, v: 0.5 },
  { file: "stamp.wav", at: W.isca, v: 0.7 },
  { file: "pop.wav", at: W.ruim, v: 0.55 },
  // 7 · comparar (o grave é do áudio)
  { file: "pop.wav", at: W.cliente - 0.05, v: 0.6 },
  { file: "thud.wav", at: W.comparar, v: 0.5 },
  { file: "pop.wav", at: W.pensar, v: 0.55 },
  // 8 · por um pouco mais
  { file: "pop.wav", at: W.pouco2, v: 0.7 },
  { file: "yes.wav", at: W.muito, v: 0.7 },
  { file: "shimmer.wav", at: W.muito + 0.05, v: 0.4 },
  { file: "heartbeat.wav", at: W.beneficios3, v: 0.5 },
  { file: "ding.wav", at: W.beneficios3 + 0.05, v: 0.25 },
  // 9 · efeito isca
  { file: "whoosh.wav", at: SCENES10.efeito.from - 0.05, v: 0.6 },
  { file: "thud.wav", at: W.efeito, v: 0.5 },
  { file: "hit.wav", at: W.isca2 - 0.03, v: 0.45 },
  // 10 · psicologia
  { file: "swish.wav", at: SCENES10.psico.from - 0.03, v: 0.55 },
  { file: "shimmer.wav", at: W.pura, v: 0.45 },
  { file: "swish.wav", at: W.aplicada, v: 0.45 },
  ...seq("pop.wav", W.vendas - 0.15, 5, 0.07, 0.5),
  { file: "yes.wav", at: W.vendas + 0.25, v: 0.35 },
  // 11 · siga
  { file: "whoosh.wav", at: SCENES10.siga.from - 0.05, v: 0.4 },
  { file: "tap.wav", at: W.para, v: 0.5 },
  { file: "yes.wav", at: W.para + 0.08, v: 0.7 },
  ...seq("pop.wav", W.dicas, 3, 0.09, 0.55),
  { file: "shimmer.wav", at: W.valiosas + 0.05, v: 0.4 },
  { file: "ding.wav", at: 29.3, v: 0.25 },
];
const SFX_SECONDS: Record<string, number> = {
  "alert.wav": 0.32, "ding.wav": 1.3, "heartbeat.wav": 0.9, "hit.wav": 0.9, "no.wav": 0.6, "pop.wav": 0.16, "shimmer.wav": 1.4,
  "stamp.wav": 0.3, "swell.wav": 2.2, "swish.wav": 0.28, "tap.wav": 0.07, "thud.wav": 0.28, "tick.wav": 0.04, "whoosh.wav": 0.55, "yes.wav": 0.7,
};

// Ducking automático: cada efeito só ocupa a margem livre do original naquele
// fotograma (src/v10/mix10.json) — a voz nunca é alterada.
const headroomAt = (f: number) => {
  const h = mix.headroom;
  const i = Math.max(0, Math.min(h.length - 1, f));
  return Math.max(0.02, (h[Math.max(0, i - 1)] + h[i] + h[Math.min(h.length - 1, i + 1)]) / 3);
};
const duck = (file: string, desired: number, start: number) => (f: number) => {
  const peak = (mix.peaks as Record<string, number>)[file] ?? 1;
  const v = Math.min(desired, headroomAt(start + f) / peak);
  const step = desired / 16;
  return Math.floor(v / step + 1e-6) * step;
};

const TRANSITION_HOLD = 0.6;

export const Explicativo10: React.FC<Explicativo10Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  const span = (from: number, to: number) => ({ from: Math.round(from * fps), durationInFrames: Math.round((to + TRANSITION_HOLD) * fps) - Math.round(from * fps) });
  return (
    <AbsoluteFill style={{ backgroundColor: P10.paper }}>
      <Sequence {...span(SCENES10.palco.from, SCENES10.palco.to)} name="1–8 · Palco: opções, benefícios, isca, escolha">
        <Stage10 />
      </Sequence>
      <Sequence {...span(SCENES10.efeito.from, SCENES10.efeito.to)} name="9 · Efeito isca">
        <Efeito10 />
      </Sequence>
      <Sequence {...span(SCENES10.psico.from, SCENES10.psico.to)} name="10 · Psicologia pura">
        <Psico10 />
      </Sequence>
      <Sequence from={Math.round(SCENES10.siga.from * fps)} durationInFrames={Math.round((TOTAL10 - SCENES10.siga.from) * fps)} name="11 · Siga">
        <Siga10 />
      </Sequence>
      <Truque10 />
      <Finish10 />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao10.m4a")} />
      {sfx &&
        SFX.map((s, i) => {
          const start = Math.max(0, Math.round(s.at * fps));
          const len = Math.ceil((SFX_SECONDS[s.file] ?? 2) * fps) + 1;
          return (
            <Sequence key={i} from={start} durationInFrames={len} name={`sfx · ${s.file}`}>
              <Audio src={staticFile(`sfx/${s.file}`)} volume={duck(s.file, sfxGain * (s.v ?? 1), start)} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
