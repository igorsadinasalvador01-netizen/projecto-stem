import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { clamp } from "../components/Motion";
import { c2, ease } from "../v2/theme2";
import { Finish2 } from "../v2/components/Shell";
import { HITS3, SCENES3, W3 } from "./timeline3";
import { S1Comeco, S2Especialista, S3Diferenca } from "./scenes/A_Comeco";
import { S4Ciclo, S5Perto, S6Outro } from "./scenes/B_Ciclo";

loadFonts();

export type Explicativo3Props = { sfx: boolean; sfxGain: number };

// Efeitos sobre a mistura original (intacta); o "boom" dos 18,63 s já existe.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "positivo" | "negativo" };
const SFX: Sfx[] = [
  // transições
  { file: "whoosh.wav", at: 0.0, kind: "entrada" },
  { file: "swish.wav", at: SCENES3.especialista.from, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES3.diferenca.from - 0.05, kind: "entrada" },
  { file: "swish.wav", at: SCENES3.ciclo.from, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES3.perto.from - 0.05, kind: "entrada" },
  { file: "swish.wav", at: SCENES3.outro.from, kind: "entrada" },
  // 1
  { file: "alert.wav", at: W3.tudo + 0.14, kind: "negativo" },
  { file: "swish.wav", at: W3.fazer - 0.1, kind: "entrada" },
  { file: "yes.wav", at: W3.primeira, kind: "positivo" },
  { file: "tick.wav", at: W3.digital - 0.04, kind: "entrada" },
  // 2
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({ file: "tick.wav", at: W3.todo + i * 0.1, kind: "entrada" })),
  { file: "hit.wav", at: W3.especialista - 0.04, kind: "destaque" },
  { file: "pop.wav", at: W3.iniciante - 0.04, kind: "entrada" },
  // 3
  { file: "hit.wav", at: W3.diferenca - 0.04, kind: "destaque" },
  { file: "yes.wav", at: W3.comecaram, kind: "positivo" },
  { file: "no.wav", at: W3.medo - 0.02, kind: "negativo" },
  // 4
  { file: "pop.wav", at: W3.aprenda - 0.04, kind: "destaque" },
  { file: "pop.wav", at: W3.aplique - 0.04, kind: "destaque" },
  { file: "pop.wav", at: W3.melhore - 0.04, kind: "destaque" },
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i): Sfx => ({ file: "tick.wav", at: W3.todos + i * 0.13, kind: "entrada" })),
  // 5
  { file: "hit.wav", at: W3.primeira2 - 0.04, kind: "destaque" },
  { file: "whoosh.wav", at: W3.mais - 0.08, kind: "entrada" },
  { file: "yes.wav", at: W3.perto, kind: "positivo" },
  { file: "riser.wav", at: HITS3.boom - 1.02, kind: "destaque" },
  { file: "shimmer.wav", at: HITS3.boom + 0.08, kind: "destaque" },
  { file: "ding.wav", at: HITS3.boom + 0.3, kind: "positivo" },
  // 6
  ...[0, 1, 2].map((i): Sfx => ({ file: "pop.wav", at: SCENES3.outro.from + 0.62 + i * 0.17, kind: "entrada" })),
];

const span = (from: number, to: number, fps: number) => ({
  from: Math.round(from * fps),
  durationInFrames: Math.round(to * fps) - Math.round(from * fps),
});

export const Explicativo3: React.FC<Explicativo3Props> = ({ sfx, sfxGain }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const endFade = interpolate(frame, [durationInFrames - Math.round(0.6 * fps), durationInFrames - 1], [0, 1], {
    easing: ease.in,
    ...clamp,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: c2.white }}>
      <Sequence {...span(SCENES3.hook.from, SCENES3.hook.to, fps)} name="1 · Não precisa saber tudo">
        <S1Comeco />
      </Sequence>
      <Sequence {...span(SCENES3.especialista.from, SCENES3.especialista.to, fps)} name="2 · Especialista já foi iniciante">
        <S2Especialista />
      </Sequence>
      <Sequence {...span(SCENES3.diferenca.from, SCENES3.diferenca.to, fps)} name="3 · Começaram com medo">
        <S3Diferenca />
      </Sequence>
      <Sequence {...span(SCENES3.ciclo.from, SCENES3.ciclo.to, fps)} name="4 · Aprenda, aplique, melhore">
        <S4Ciclo />
      </Sequence>
      <Sequence {...span(SCENES3.perto.from, SCENES3.perto.to, fps)} name="5 · Mais perto (boom)">
        <S5Perto />
      </Sequence>
      <Sequence from={Math.round(SCENES3.outro.from * fps)} name="6 · Fecho">
        <S6Outro />
      </Sequence>

      <Finish2 />
      <AbsoluteFill style={{ backgroundColor: c2.white, opacity: endFade }} />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao3.m4a")} />
      {sfx &&
        SFX.map((s, i) => (
          <Sequence key={i} from={Math.max(0, Math.round(s.at * fps))} name={`sfx ${s.kind} · ${s.file}`}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={sfxGain} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
