import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { c5 } from "./theme5";
import { HITS5, SCENES5, W5 } from "./timeline5";
import { FilmFinish, GateWeave } from "./Vintage";
import mix from "./mix5.json";
import { S1Segredo, S2Pronto, S3Aprender, S4Venda } from "./scenes/A_Memoria";
import { S5Filme, S6Acao, S7Fecho } from "./scenes/B_Acao";

loadFonts();

export type Explicativo5Props = { sfx: boolean; sfxGain: number };

// Mistura original intacta (voz ~-13 dB, música alta, boom aos 20,04 s).
// Sons nostálgicos discretos por baixo; nada em cima do corpo do boom.
type Sfx = { file: string; at: number; kind: string; v?: number };
const typing = (from: number, to: number, step = 0.085): Sfx[] =>
  Array.from({ length: Math.max(1, Math.floor((to - from) / step)) }, (_, i) => ({ file: "typekey.wav", at: from + i * step, kind: "entrada", v: 0.8 }));

const SFX: Sfx[] = [
  { file: "projector.wav", at: 0.0, kind: "ambiente" },
  ...typing(0.0, 0.76),
  { file: "hit.wav", at: W5.segredo - 0.04, kind: "destaque", v: 0.7 },
  { file: "paper.wav", at: W5.um, kind: "entrada" },
  { file: "stamp.wav", at: W5.sobre, kind: "destaque", v: 0.7 },
  { file: "paper.wav", at: W5.comecar, kind: "entrada" },
  ...typing(W5.no + 0.13, W5.digital + 0.7),
  // 2
  { file: "projector.wav", at: SCENES5.pronto.from, kind: "entrada", v: 0.8 },
  { file: "no.wav", at: W5.nunca, kind: "negativo" },
  ...[0, 1, 2, 3, 4, 5].map((i): Sfx => ({ file: "tick.wav", at: W5.vai + i * 0.12, kind: "entrada" })),
  { file: "stamp.wav", at: W5.cem + 0.12, kind: "negativo" },
  { file: "alert.wav", at: W5.cem + 0.2, kind: "negativo", v: 0.7 },
  // 3
  { file: "paper.wav", at: SCENES5.aprender.from + 0.05, kind: "entrada" },
  ...[W5.algo, W5.novo, W5.para, W5.aprender, W5.aprender + 0.2, W5.aprender + 0.4].map((a): Sfx => ({ file: "paper.wav", at: a - 0.04, kind: "entrada", v: 0.7 })),
  ...[W5.algo, W5.novo, W5.para].map((a): Sfx => ({ file: "stamp.wav", at: a + 0.16, kind: "destaque", v: 0.5 })),
  // 4
  { file: "swish.wav", at: SCENES5.venda.from, kind: "entrada" },
  { file: "shutter.wav", at: W5.pessoas - 0.1, kind: "destaque" },
  { file: "yes.wav", at: W5.venda, kind: "positivo" },
  { file: "stamp.wav", at: W5.tudo, kind: "negativo" },
  { file: "no.wav", at: W5.tudo + 0.08, kind: "negativo", v: 0.8 },
  // 5
  { file: "projector.wav", at: SCENES5.filme.from, kind: "entrada" },
  { file: "yes.wav", at: W5.comecam, kind: "positivo" },
  { file: "no.wav", at: W5.corrigem, kind: "negativo", v: 0.8 },
  { file: "yes.wav", at: W5.erros + 0.14, kind: "positivo" },
  { file: "yes.wav", at: W5.melhorando, kind: "positivo" },
  // 6
  { file: "paper.wav", at: SCENES5.acao.from + 0.05, kind: "entrada" },
  { file: "stamp.wav", at: W5.acao, kind: "destaque" },
  { file: "riser.wav", at: HITS5.boom - 1.02, kind: "destaque", v: 0.8 },
  // 7 (depois do corpo do boom)
  { file: "shutter.wav", at: HITS5.boom + 0.75, kind: "destaque", v: 0.8 },
  ...typing(SCENES5.outro.from + 0.8, SCENES5.outro.from + 2.2, 0.1),
  { file: "projector.wav", at: 22.3, kind: "ambiente", v: 0.8 },
];

// Ducking automático: a mistura original está no limite (~0 dBFS) em muitas sílabas.
// Cada efeito só ocupa a margem livre medida fotograma a fotograma (scripts → mix5.json),
// com um piso pequeno; a voz nunca é alterada.
const headroomAt = (absFrame: number) => {
  const h = mix.headroom;
  const i = Math.max(0, Math.min(h.length - 1, absFrame));
  const a = h[Math.max(0, i - 1)];
  const b = h[i];
  const c = h[Math.min(h.length - 1, i + 1)];
  return Math.max(0.02, (a + b + c) / 3);
};
const duck = (file: string, desired: number, startFrame: number) => (f: number) => {
  const peak = (mix.peaks as Record<string, number>)[file] ?? 1;
  return Math.min(desired, headroomAt(startFrame + f) / peak);
};

// Cada cena fica mais 0,6 s por baixo da seguinte, até a transição de entrada
// desta (0,5–0,55 s) a cobrir por completo — nunca há fundo vazio a meio.
const TRANSITION_HOLD = 0.6;
const span = (from: number, to: number, fps: number) => ({
  from: Math.round(from * fps),
  durationInFrames: Math.round((to + TRANSITION_HOLD) * fps) - Math.round(from * fps),
});

export const Explicativo5: React.FC<Explicativo5Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: c5.darkroom }}>
      <GateWeave>
        <Sequence {...span(SCENES5.segredo.from, SCENES5.segredo.to, fps)} name="1 · Um segredo (envelope)">
          <S1Segredo />
        </Sequence>
        <Sequence {...span(SCENES5.pronto.from, SCENES5.pronto.to, fps)} name="2 · Nunca 100% pronto">
          <S2Pronto />
        </Sequence>
        <Sequence {...span(SCENES5.aprender.from, SCENES5.aprender.to, fps)} name="3 · Algo novo para aprender">
          <S3Aprender />
        </Sequence>
        <Sequence {...span(SCENES5.venda.from, SCENES5.venda.to, fps)} name="4 · Primeira venda ≠ saber tudo">
          <S4Venda />
        </Sequence>
        <Sequence {...span(SCENES5.filme.from, SCENES5.filme.to, fps)} name="5 · Começam, corrigem, melhoram">
          <S5Filme />
        </Sequence>
        <Sequence {...span(SCENES5.acao.from, SCENES5.acao.to, fps)} name="6 · Ação → experiência (boom)">
          <S6Acao />
        </Sequence>
        <Sequence from={Math.round(SCENES5.outro.from * fps)} name="7 · Fecho (polaroide)">
          <S7Fecho />
        </Sequence>
      </GateWeave>
      <FilmFinish />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao5.m4a")} />
      {sfx &&
        SFX.map((s, i) => {
          const start = Math.max(0, Math.round(s.at * fps));
          return (
            <Sequence key={i} from={start} name={`sfx ${s.kind} · ${s.file}`}>
              <Audio src={staticFile(`sfx/${s.file}`)} volume={duck(s.file, sfxGain * (s.v ?? 1), start)} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
