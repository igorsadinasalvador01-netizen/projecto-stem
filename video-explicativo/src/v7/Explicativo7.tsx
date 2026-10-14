import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { c2 } from "../v2/theme2";
import { Finish2 } from "../v2/components/Shell";
import { SCENES7, W7 } from "./timeline7";
import { S0Abertura, S1Desesperados, S2Discutem, S3Amigos } from "./scenes/A_Evite";
import { S4Respeito, S5Atrasados, S6Certas, S7Siga } from "./scenes/B_Certas";
import mix from "./mix7.json";

loadFonts();

export type Explicativo7Props = { sfx: boolean; sfxGain: number };

// Mesma dinâmica sonora do vídeo 6: batimento nos momentos de emoção, pops nas
// chegadas, alerta/"no" nos sinais negativos, e o fio que se parte em cada tipo.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "positivo" | "negativo" | "emoção"; v?: number };
const SFX: Sfx[] = [
  // abertura
  { file: "swell.wav", at: 0.0, kind: "emoção", v: 0.7 },
  { file: "alert.wav", at: 0.03, kind: "negativo", v: 0.6 },
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({ file: "pop.wav", at: W7.cinco + i * 0.07, kind: "entrada", v: 0.7 })),
  { file: "heartbeat.wav", at: W7.pessoas, kind: "emoção", v: 0.8 },
  // 1 · desesperados
  { file: "whoosh.wav", at: SCENES7.desesperados.from - 0.05, kind: "entrada", v: 0.7 },
  { file: "hit.wav", at: W7.um - 0.04, kind: "destaque", v: 0.55 },
  ...[0, 1, 2].map((i): Sfx => ({ file: "heartbeat.wav", at: W7.desesperados + i * 0.45, kind: "emoção", v: 0.7 })),
  ...Array.from({ length: 9 }, (_, i): Sfx => ({ file: "tick.wav", at: W7.forcam + i * 0.15, kind: "entrada" })),
  { file: "alert.wav", at: W7.rapidas + 0.05, kind: "negativo", v: 0.6 },
  { file: "thud.wav", at: W7.empurram, kind: "entrada" },
  { file: "stamp.wav", at: W7.ruins, kind: "negativo" },
  { file: "no.wav", at: W7.ruins + 0.27, kind: "negativo" },
  // 2 · discutem tudo
  { file: "swish.wav", at: SCENES7.discutem.from, kind: "entrada" },
  { file: "hit.wav", at: W7.segundo - 0.04, kind: "destaque", v: 0.55 },
  { file: "pop.wav", at: W7.discutem, kind: "entrada" },
  { file: "pop.wav", at: W7.conversa, kind: "entrada" },
  ...[0, 1, 2].map((i): Sfx => ({ file: "alert.wav", at: W7.debate + i * 0.17, kind: "negativo", v: 0.5 })),
  { file: "riser.wav", at: W7.nunca - 0.3, kind: "destaque", v: 0.4 },
  { file: "no.wav", at: W7.nada + 0.05, kind: "negativo", v: 0.6 },
  // 3 · amigos e família
  { file: "whoosh.wav", at: SCENES7.amigos.from - 0.05, kind: "entrada" },
  { file: "hit.wav", at: W7.tres - 0.04, kind: "destaque", v: 0.55 },
  { file: "heartbeat.wav", at: W7.amigos, kind: "emoção", v: 0.7 },
  { file: "heartbeat.wav", at: W7.familia, kind: "emoção", v: 0.6 },
  { file: "swell.wav", at: W7.familia + 0.2, kind: "emoção", v: 0.6 },
  { file: "tick.wav", at: W7.misturar, kind: "entrada" },
  { file: "pop.wav", at: W7.relacao, kind: "entrada" },
  { file: "thud.wav", at: W7.dinheiro + 0.2, kind: "entrada" },
  { file: "thud.wav", at: W7.problema, kind: "negativo" },
  { file: "no.wav", at: W7.problema + 0.04, kind: "negativo" },
  // 4 · quem não te respeita
  { file: "whoosh.wav", at: SCENES7.respeito.from - 0.05, kind: "entrada" },
  { file: "hit.wav", at: W7.quatro - 0.04, kind: "destaque", v: 0.55 },
  { file: "pop.wav", at: W7.pessoa, kind: "entrada" },
  { file: "alert.wav", at: W7.ignora + 0.3, kind: "negativo" },
  { file: "no.wav", at: W7.limites, kind: "negativo", v: 0.7 },
  ...Array.from({ length: 6 }, (_, i): Sfx => ({ file: "tick.wav", at: W7.desvalorizar + i * 0.13, kind: "entrada" })),
  { file: "no.wav", at: W7.negociacao + 0.2, kind: "negativo", v: 0.7 },
  // 5 · atrasados crónicos
  { file: "swish.wav", at: SCENES7.atrasados.from, kind: "entrada", v: 0.7 },
  { file: "hit.wav", at: W7.cinco2 - 0.04, kind: "destaque", v: 0.55 },
  ...Array.from({ length: 10 }, (_, i): Sfx => ({ file: "tick.wav", at: W7.atrasados + i * 0.27, kind: "entrada", v: 0.8 })),
  { file: "alert.wav", at: W7.tempo + 0.05, kind: "negativo" },
  { file: "pop.wav", at: W7.respeitar, kind: "entrada" },
  { file: "stamp.wav", at: W7.trabalho, kind: "negativo" },
  { file: "no.wav", at: W7.trabalho + 0.27, kind: "negativo" },
  // pessoas certas
  { file: "whoosh.wav", at: SCENES7.certas.from - 0.05, kind: "entrada" },
  { file: "swell.wav", at: W7.negocios2, kind: "emoção", v: 0.8 },
  ...[0, 1, 2, 3].map((i): Sfx => ({ file: "pop.wav", at: W7.certos + i * 0.1, kind: "entrada", v: 0.55 })),
  { file: "shimmer.wav", at: W7.certos, kind: "destaque", v: 0.45 },
  { file: "yes.wav", at: W7.pessoas2 + 0.2, kind: "positivo" },
  { file: "heartbeat.wav", at: W7.certas, kind: "emoção", v: 0.6 },
  // siga
  { file: "swish.wav", at: SCENES7.siga.from, kind: "entrada" },
  { file: "pop.wav", at: W7.siga, kind: "entrada" },
  { file: "typekey.wav", at: W7.para2 - 0.05, kind: "entrada" },
  { file: "yes.wav", at: W7.para2 + 0.08, kind: "positivo" },
  ...[0, 1, 2].map((i): Sfx => ({ file: "pop.wav", at: W7.insights + i * 0.1, kind: "entrada", v: 0.7 })),
  { file: "shimmer.wav", at: W7.vender, kind: "destaque", v: 0.6 },
];

// Ducking automático: cada efeito só ocupa a margem livre do original
// naquele fotograma (src/v7/mix7.json) — a voz nunca é alterada.
const headroomAt = (absFrame: number) => {
  const h = mix.headroom;
  const i = Math.max(0, Math.min(h.length - 1, absFrame));
  const a = h[Math.max(0, i - 1)];
  const b = h[i];
  const c = h[Math.min(h.length - 1, i + 1)];
  return Math.max(0.02, (a + b + c) / 3);
};
// Volume quantizado (16 degraus, sempre para baixo): a expressão do ffmpeg fica curta.
const duck = (file: string, desired: number, startFrame: number) => (f: number) => {
  const peak = (mix.peaks as Record<string, number>)[file] ?? 1;
  const v = Math.min(desired, headroomAt(startFrame + f) / peak);
  const step = desired / 16;
  return Math.floor(v / step + 1e-6) * step;
};

// Duração de cada efeito (s): a sequência acaba com o som, não com o vídeo.
const SFX_SECONDS: Record<string, number> = {
  "alert.wav": 0.32, "ding.wav": 1.3, "heartbeat.wav": 0.9, "hit.wav": 0.9, "no.wav": 0.6, "pop.wav": 0.16,
  "riser.wav": 1.0, "shimmer.wav": 1.4, "stamp.wav": 0.3, "swell.wav": 2.2, "swish.wav": 0.28, "thud.wav": 0.28,
  "tick.wav": 0.04, "typekey.wav": 0.09, "whoosh.wav": 0.55, "yes.wav": 0.7,
};

// Cada cena fica mais 0,6 s por baixo da seguinte, até a transição de entrada
// desta (0,5 s) a cobrir por completo — nunca há fundo vazio a meio.
const TRANSITION_HOLD = 0.6;
const span = (from: number, to: number, fps: number) => ({
  from: Math.round(from * fps),
  durationInFrames: Math.round((to + TRANSITION_HOLD) * fps) - Math.round(from * fps),
});

export const Explicativo7: React.FC<Explicativo7Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: c2.fogBottom }}>
      <Sequence {...span(SCENES7.abertura.from, SCENES7.abertura.to, fps)} name="0 · Evite 5 tipos de pessoas">
        <S0Abertura />
      </Sequence>
      <Sequence {...span(SCENES7.desesperados.from, SCENES7.desesperados.to, fps)} name="1 · Os desesperados">
        <S1Desesperados />
      </Sequence>
      <Sequence {...span(SCENES7.discutem.from, SCENES7.discutem.to, fps)} name="2 · Os que discutem tudo">
        <S2Discutem />
      </Sequence>
      <Sequence {...span(SCENES7.amigos.from, SCENES7.amigos.to, fps)} name="3 · Amigos e família">
        <S3Amigos />
      </Sequence>
      <Sequence {...span(SCENES7.respeito.from, SCENES7.respeito.to, fps)} name="4 · Quem não te respeita">
        <S4Respeito />
      </Sequence>
      <Sequence {...span(SCENES7.atrasados.from, SCENES7.atrasados.to, fps)} name="5 · Os atrasados crônicos">
        <S5Atrasados />
      </Sequence>
      <Sequence {...span(SCENES7.certas.from, SCENES7.certas.to, fps)} name="Pessoas certas">
        <S6Certas />
      </Sequence>
      <Sequence from={Math.round(SCENES7.siga.from * fps)} name="Siga">
        <S7Siga />
      </Sequence>

      <Finish2 />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao7.m4a")} />
      {sfx &&
        SFX.map((s, i) => {
          const start = Math.max(0, Math.round(s.at * fps));
          const len = Math.ceil((SFX_SECONDS[s.file] ?? 2) * fps) + 1;
          return (
            <Sequence key={i} from={start} durationInFrames={len} name={`sfx ${s.kind} · ${s.file}`}>
              <Audio src={staticFile(`sfx/${s.file}`)} volume={duck(s.file, sfxGain * (s.v ?? 1), start)} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
