import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { clamp } from "../components/Motion";
import { c2, ease } from "./theme2";
import { HITS2, SCENES2, W2 } from "./timeline2";
import { Finish2 } from "./components/Shell";
import { S01Abertura, S02Time, S03Estudo } from "./scenes/A_Abertura";
import { S04Portas, S05Prioridade } from "./scenes/B_Portas";
import { S06Solucao, S07Investimento } from "./scenes/C_Solucao";
import { S08Confirma, S09Compara, S10Final } from "./scenes/D_Final";

loadFonts();

export type Explicativo2Props = { sfx: boolean; sfxGain: number };

// Efeitos sobre a mistura original (intacta). O "ding" dos 6,40 s e o "boom"
// dos 53,44 s já existem no áudio original, por isso não se duplicam.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "positivo" | "negativo" | "porta" };
const SFX: Sfx[] = [
  // transições de cena
  { file: "whoosh.wav", at: 0.0, kind: "entrada" },
  { file: "swish.wav", at: SCENES2.time.from, kind: "entrada" },
  { file: "swish.wav", at: SCENES2.estudo.from, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES2.portas.from - 0.05, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES2.p1.from - 0.05, kind: "entrada" },
  { file: "swish.wav", at: SCENES2.p2.from, kind: "entrada" },
  { file: "swish.wav", at: SCENES2.p3.from, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES2.confirma.from - 0.05, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES2.compara.from - 0.05, kind: "entrada" },
  { file: "swish.wav", at: SCENES2.final.from, kind: "entrada" },
  // 1
  { file: "yes.wav", at: W2.meta + 0.06, kind: "positivo" },
  ...[0, 2, 4, 6, 8, 10].map((i): Sfx => ({ file: "tick.wav", at: W2.todos + i * 0.053, kind: "entrada" })),
  // 2
  { file: "pop.wav", at: W2.cara - 0.04, kind: "destaque" },
  ...[0, 1, 2].map((i): Sfx => ({ file: "tick.wav", at: W2.fecha + i * 0.13, kind: "entrada" })),
  { file: "yes.wav", at: W2.contrato + 0.04, kind: "positivo" },
  // 3
  ...[0, 1, 2].map((i): Sfx => ({ file: "tick.wav", at: W2.estudar + i * 0.27, kind: "entrada" })),
  { file: "hit.wav", at: W2.diferente - 0.04, kind: "destaque" },
  // 4
  { file: "hit.wav", at: W2.tres - 0.04, kind: "destaque" },
  { file: "door.wav", at: W2.tres2 - 0.02, kind: "porta" },
  { file: "door.wav", at: W2.portas2 + 0.02, kind: "porta" },
  { file: "door.wav", at: W2.fechadas - 0.02, kind: "porta" },
  { file: "yes.wav", at: W2.venda - 0.02, kind: "positivo" },
  // 5
  { file: "hit.wav", at: W2.prioridade - 0.04, kind: "destaque" },
  { file: "pop.wav", at: W2.pergunta - 0.3, kind: "entrada" },
  { file: "no.wav", at: W2.nao - 0.04, kind: "negativo" },
  { file: "alert.wav", at: W2.acabou, kind: "negativo" },
  { file: "alert.wav", at: W2.acabou2, kind: "negativo" },
  { file: "swish.wav", at: W2.parte, kind: "entrada" },
  { file: "yes.wav", at: W2.sim - 0.04, kind: "positivo" },
  { file: "swish.wav", at: W2.avanca, kind: "entrada" },
  { file: "door.wav", at: W2.etapa - 0.02, kind: "porta" },
  // 6
  { file: "hit.wav", at: W2.solucao - 0.04, kind: "destaque" },
  ...[W2.mostra2, W2.exatamente, W2.fazer].map((a): Sfx => ({ file: "tick.wav", at: a - 0.04, kind: "entrada" })),
  { file: "swish.wav", at: W2.voceConsegue - 0.08, kind: "entrada" },
  { file: "thud.wav", at: W2.resolvido + 0.12, kind: "destaque" },
  { file: "yes.wav", at: W2.resolvido + 0.26, kind: "positivo" },
  // 7
  { file: "hit.wav", at: W2.investimento - 0.04, kind: "destaque" },
  { file: "whoosh.wav", at: W2.mostra3 - 0.1, kind: "entrada" },
  { file: "shimmer.wav", at: W2.custar, kind: "destaque" },
  { file: "pop.wav", at: W2.volta - 0.04, kind: "entrada" },
  // 8
  { file: "door.wav", at: W2.prioridade2 - 0.02, kind: "porta" },
  { file: "yes.wav", at: W2.prioridade2 + 0.12, kind: "positivo" },
  { file: "door.wav", at: W2.atende - 0.02, kind: "porta" },
  { file: "yes.wav", at: W2.atende + 0.12, kind: "positivo" },
  { file: "shimmer.wav", at: W2.investimento2, kind: "destaque" },
  // 9
  { file: "yes.wav", at: W2.investir, kind: "positivo" },
  { file: "hit.wav", at: W2.infinitamente - 0.04, kind: "destaque" },
  { file: "no.wav", at: W2.custando - 0.04, kind: "negativo" },
  // 10
  { file: "riser.wav", at: HITS2.boom - 1.02, kind: "destaque" },
  // o boom original já chega a ~0 dBFS: o brilho e o ding entram depois do corpo do boom
  { file: "shimmer.wav", at: HITS2.boom + 0.7, kind: "destaque" },
  { file: "ding.wav", at: HITS2.boom + 0.85, kind: "positivo" },
  ...[0, 1, 2].map((i): Sfx => ({ file: "pop.wav", at: HITS2.silenceFrom + 0.4 + i * 0.17, kind: "entrada" })),
];

// Cada cena fica mais 0,6 s por baixo da seguinte, até a transição de entrada
// desta (0,5–0,55 s) a cobrir por completo — nunca há fundo vazio a meio.
const TRANSITION_HOLD = 0.6;
const span = (from: number, to: number, fps: number) => ({
  from: Math.round(from * fps),
  durationInFrames: Math.round((to + TRANSITION_HOLD) * fps) - Math.round(from * fps),
});

export const Explicativo2: React.FC<Explicativo2Props> = ({ sfx, sfxGain }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const endFade = interpolate(frame, [durationInFrames - Math.round(0.6 * fps), durationInFrames - 1], [0, 1], {
    easing: ease.in,
    ...clamp,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: c2.white }}>
      <Sequence {...span(SCENES2.hook.from, SCENES2.hook.to, fps)} name="01 · Abertura">
        <S01Abertura />
      </Sequence>
      <Sequence {...span(SCENES2.time.from, SCENES2.time.to, fps)} name="02 · O time (2×)">
        <S02Time />
      </Sequence>
      <Sequence {...span(SCENES2.estudo.from, SCENES2.estudo.to, fps)} name="03 · Estudo">
        <S03Estudo />
      </Sequence>
      <Sequence {...span(SCENES2.portas.from, SCENES2.portas.to, fps)} name="04 · 3 portas">
        <S04Portas />
      </Sequence>
      <Sequence {...span(SCENES2.p1.from, SCENES2.p1.to, fps)} name="05 · Porta 1 Prioridade">
        <S05Prioridade />
      </Sequence>
      <Sequence {...span(SCENES2.p2.from, SCENES2.p2.to, fps)} name="06 · Porta 2 Solução">
        <S06Solucao />
      </Sequence>
      <Sequence {...span(SCENES2.p3.from, SCENES2.p3.to, fps)} name="07 · Porta 3 Investimento">
        <S07Investimento />
      </Sequence>
      <Sequence {...span(SCENES2.confirma.from, SCENES2.confirma.to, fps)} name="08 · Confirmação">
        <S08Confirma />
      </Sequence>
      <Sequence {...span(SCENES2.compara.from, SCENES2.compara.to, fps)} name="09 · Comparação">
        <S09Compara />
      </Sequence>
      <Sequence from={Math.round(SCENES2.final.from * fps)} name="10 · Final">
        <S10Final />
      </Sequence>

      <Finish2 />
      <AbsoluteFill style={{ backgroundColor: c2.white, opacity: endFade }} />

      {/* Áudio original intacto: voz, música, ding e boom */}
      <Audio src={staticFile("narracao2.m4a")} />
      {sfx &&
        SFX.map((s, i) => (
          <Sequence key={i} from={Math.max(0, Math.round(s.at * fps))} name={`sfx ${s.kind} · ${s.file}`}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={sfxGain} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
