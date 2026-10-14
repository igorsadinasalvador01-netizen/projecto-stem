import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { clamp } from "../components/Motion";
import { c2, ease } from "../v2/theme2";
import { HITS4, SCENES4, W4 } from "./timeline4";
import { Finish4 } from "./DarkKit";
import { S1Pergunta, S2Possivel, S3Comeco } from "./scenes/A_Prova";
import { S4Aprende, S5Mentalidade, S6Cresce, S7Fecho } from "./scenes/B_Cresce";

loadFonts();

export type Explicativo4Props = { sfx: boolean; sfxGain: number };

// A voz deste vídeo está ~8 dB acima dos anteriores: o ganho global compensa
// (Explicativo4Props.sfxGain). "v" ajusta cues junto ao boom para não saturar.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "positivo" | "negativo"; v?: number };
const SFX: Sfx[] = [
  // transições
  { file: "whoosh.wav", at: 0.0, kind: "entrada" },
  { file: "swish.wav", at: SCENES4.prova.from, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES4.comeco.from - 0.05, kind: "entrada" },
  { file: "swish.wav", at: SCENES4.aprende.from, kind: "entrada" },
  { file: "swish.wav", at: SCENES4.mentalidade.from, kind: "entrada" },
  { file: "whoosh.wav", at: SCENES4.cresce.from - 0.05, kind: "entrada" },
  { file: "swish.wav", at: SCENES4.outro.from, kind: "entrada", v: 0.5 },
  // 1
  { file: "hit.wav", at: W4.primeira - 0.04, kind: "destaque" },
  { file: "shimmer.wav", at: W4.importante, kind: "destaque" },
  // 2
  { file: "hit.wav", at: W4.prova - 0.04, kind: "destaque" },
  { file: "no.wav", at: W4.possivel - 0.02, kind: "negativo" },
  { file: "yes.wav", at: W4.possivel + 0.22, kind: "positivo" },
  // 3
  { file: "hit.wav", at: W4.ninguem - 0.04, kind: "destaque" },
  { file: "swish.wav", at: W4.criar - 0.08, kind: "entrada" },
  { file: "alert.wav", at: W4.perfeito + 0.14, kind: "negativo" },
  { file: "swish.wav", at: W4.entender - 0.08, kind: "entrada" },
  { file: "alert.wav", at: W4.tudo + 0.14, kind: "negativo" },
  { file: "pop.wav", at: W4.vendas + 0.2, kind: "entrada" },
  // 4
  { file: "no.wav", at: W4.errando - 0.02, kind: "negativo" },
  { file: "pop.wav", at: W4.testando - 0.04, kind: "entrada" },
  { file: "yes.wav", at: W4.melhorando - 0.02, kind: "positivo" },
  ...Array.from({ length: 6 }, (_, i): Sfx => ({ file: "tick.wav", at: W4.todos + i * 0.13, kind: "entrada" })),
  // 5
  { file: "hit.wav", at: W4.primeira2 - 0.04, kind: "destaque" },
  { file: "whoosh.wav", at: W4.sua - 0.1, kind: "entrada" },
  { file: "yes.wav", at: W4.bancaria, kind: "positivo" },
  { file: "shimmer.wav", at: W4.muda2, kind: "destaque" },
  { file: "hit.wav", at: W4.mentalidade - 0.04, kind: "destaque" },
  // 6
  { file: "hit.wav", at: W4.esforco - 0.04, kind: "destaque" },
  { file: "yes.wav", at: W4.valeu, kind: "positivo" },
  ...[0, 1, 2, 3, 4, 5].map((i): Sfx => ({ file: "tick.wav", at: W4.continuar + i * 0.1, kind: "entrada" })),
  { file: "riser.wav", at: HITS4.boom - 1.02, kind: "destaque" },
  // o boom original já chega a ~0 dBFS: o brilho e o ding entram depois do corpo do boom
  { file: "shimmer.wav", at: HITS4.boom + 0.7, kind: "destaque", v: 0.5 },
  { file: "ding.wav", at: HITS4.boom + 0.85, kind: "positivo", v: 0.4 },
  // 7
  { file: "pop.wav", at: SCENES4.outro.from + 0.62, kind: "entrada" },
];

// Cada cena fica mais 0,6 s por baixo da seguinte, até a transição de entrada
// desta (0,5–0,55 s) a cobrir por completo — nunca há fundo vazio a meio.
const TRANSITION_HOLD = 0.6;
const span = (from: number, to: number, fps: number) => ({
  from: Math.round(from * fps),
  durationInFrames: Math.round((to + TRANSITION_HOLD) * fps) - Math.round(from * fps),
});

export const Explicativo4: React.FC<Explicativo4Props> = ({ sfx, sfxGain }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const endFade = interpolate(frame, [durationInFrames - Math.round(0.6 * fps), durationInFrames - 1], [0, 1], {
    easing: ease.in,
    ...clamp,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: c2.nightBottom }}>
      <Sequence {...span(SCENES4.hook.from, SCENES4.hook.to, fps)} name="1 · Porque a 1.ª venda importa">
        <S1Pergunta />
      </Sequence>
      <Sequence {...span(SCENES4.prova.from, SCENES4.prova.to, fps)} name="2 · Prova que é possível">
        <S2Possivel />
      </Sequence>
      <Sequence {...span(SCENES4.comeco.from, SCENES4.comeco.to, fps)} name="3 · Ninguém começa sabendo">
        <S3Comeco />
      </Sequence>
      <Sequence {...span(SCENES4.aprende.from, SCENES4.aprende.to, fps)} name="4 · Errando, testando, melhorando">
        <S4Aprende />
      </Sequence>
      <Sequence {...span(SCENES4.mentalidade.from, SCENES4.mentalidade.to, fps)} name="5 · Conta bancária → mentalidade">
        <S5Mentalidade />
      </Sequence>
      <Sequence {...span(SCENES4.cresce.from, SCENES4.cresce.to, fps)} name="6 · Valeu a pena (boom)">
        <S6Cresce />
      </Sequence>
      <Sequence from={Math.round(SCENES4.outro.from * fps)} name="7 · Fecho">
        <S7Fecho />
      </Sequence>

      <Finish4 />
      <AbsoluteFill style={{ backgroundColor: c2.nightBottom, opacity: endFade }} />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao4.m4a")} />
      {sfx &&
        SFX.map((s, i) => (
          <Sequence key={i} from={Math.max(0, Math.round(s.at * fps))} name={`sfx ${s.kind} · ${s.file}`}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={sfxGain * (s.v ?? 1)} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
