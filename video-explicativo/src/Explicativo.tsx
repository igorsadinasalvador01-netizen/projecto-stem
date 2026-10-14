import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { HITS, SCENES, W, sec } from "./timeline";
import { loadFonts } from "./fonts";
import { BgMesh, Grade, Grain, StudioFloor, Vignette } from "./components/Layers";
import { clamp } from "./components/Motion";
import { S1Hook } from "./scenes/S1Hook";
import { S2Zero } from "./scenes/S2Zero";
import { S3Diferenca } from "./scenes/S3Diferenca";
import { S4Venda } from "./scenes/S4Venda";

loadFonts();

export type ExplicativoProps = { sfx: boolean; sfxGain: number };

// Efeitos sonoros por cima da mistura original (que fica intacta).
// Os WAV já vêm calibrados abaixo da voz (scripts/gen-sfx.mjs); aqui só se posicionam.
// Entram 2–3 fotogramas antes do visual para soarem sincronizados.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "alerta" };
const SFX: Sfx[] = [
  // Cena 1 — gancho
  { file: "whoosh.wav", at: 0.0, kind: "entrada" },
  { file: "hit.wav", at: W.segredo - 0.04, kind: "destaque" },
  ...[0, 1, 2, 3, 4, 5, 6].map((i): Sfx => ({ file: "tick.wav", at: W.todos - 0.1 + i * 0.09, kind: "entrada" })),
  // Cena 2 — começo do zero
  { file: "swish.wav", at: W.eles - 0.08, kind: "entrada" },
  { file: "thud.wav", at: W.sem1 - 0.06, kind: "entrada" },
  { file: "alert.wav", at: W.experiencia + 0.12, kind: "alerta" },
  { file: "thud.wav", at: W.sem2 - 0.06, kind: "entrada" },
  { file: "alert.wav", at: W.seguidores + 0.12, kind: "alerta" },
  { file: "thud.wav", at: W.sem3 - 0.06, kind: "entrada" },
  { file: "alert.wav", at: W.dinheiro + 0.12, kind: "alerta" },
  // Cena 3 — a diferença
  { file: "swish.wav", at: W.a1 - 0.08, kind: "entrada" },
  { file: "hit.wav", at: W.nao - 0.04, kind: "destaque" },
  { file: "whoosh.wav", at: W.quando - 0.2, kind: "entrada" },
  { file: "alert.wav", at: W.assistia - 0.02, kind: "alerta" },
  ...Array.from({ length: 12 }, (_, i): Sfx => ({ file: "tick.wav", at: W.ninguem - 0.08 + i * 0.13, kind: "entrada" })),
  // Cena 4 — a primeira venda
  { file: "hit.wav", at: W.primeira - 0.04, kind: "destaque" },
  { file: "swish.wav", at: W.pode - 0.1, kind: "entrada" },
  { file: "riser.wav", at: HITS.boom - 1.02, kind: "destaque" },
  // o boom original já chega a ~0 dBFS: o brilho e o ding entram depois do corpo do boom
  { file: "shimmer.wav", at: HITS.boom + 0.7, kind: "destaque" },
  { file: "ding.wav", at: HITS.boom + 0.85, kind: "alerta" },
  { file: "pop.wav", at: HITS.silenceFrom + 0.46, kind: "entrada" },
  { file: "shimmer.wav", at: HITS.silenceFrom + 0.66, kind: "destaque" },
];

const span = (from: number, to: number, fps: number) => ({
  from: sec(from, fps),
  durationInFrames: sec(to, fps) - sec(from, fps),
});

export const Explicativo: React.FC<ExplicativoProps> = ({ sfx, sfxGain }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeLen = Math.round(0.5 * fps);
  const endFade = interpolate(frame, [durationInFrames - fadeLen, durationInFrames - 1], [0, 1], {
    easing: theme.ease.in,
    ...clamp,
  });
  const startFade = interpolate(frame, [0, Math.round(0.2 * fps)], [1, 0], { easing: theme.ease.out, ...clamp });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body }}>
      {/* 1 — fundo */}
      <BgMesh />
      <StudioFloor y={1500} opacity={0.8} />

      {/* 2/3 — cenas (assets + gráficos + tipografia) */}
      <Sequence {...span(SCENES.hook.from, SCENES.hook.to, fps)} name="1 · Gancho">
        <S1Hook />
      </Sequence>
      <Sequence {...span(SCENES.zero.from, SCENES.zero.to, fps)} name="2 · Começo do zero">
        <S2Zero />
      </Sequence>
      <Sequence {...span(SCENES.diferenca.from, SCENES.diferenca.to, fps)} name="3 · A diferença">
        <S3Diferenca />
      </Sequence>
      <Sequence from={sec(SCENES.venda.from, fps)} name="4 · Primeira venda">
        <S4Venda />
      </Sequence>

      {/* 4 — grade de cor */}
      <Grade />
      {/* 5 — grão + vinheta */}
      <Grain />
      <Vignette />

      {/* entrada e saída a cinza */}
      <AbsoluteFill style={{ backgroundColor: theme.colors.bgDeep, opacity: Math.max(startFade, endFade) }} />

      {/* Áudio original: voz, música e impactos exatamente como estavam */}
      <Audio src={staticFile("narracao.m4a")} />
      {sfx &&
        SFX.map((s, i) => (
          <Sequence key={i} from={Math.max(0, sec(s.at, fps))} name={`sfx ${s.kind} · ${s.file}`}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={sfxGain} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
