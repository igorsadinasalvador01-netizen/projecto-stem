import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { c2 } from "../v2/theme2";
import { Finish4 } from "../v4/DarkKit";
import { SCENES8, W8 } from "./timeline8";
import { S1Gancho, S2Cupcake, S3Opcoes } from "./scenes/A_Opcoes";
import { S4Escolhas, S5Compara, S6Truque, S7Siga } from "./scenes/B_Escolha";
import mix from "./mix8.json";

loadFonts();

export type Explicativo8Props = { sfx: boolean; sfxGain: number };

// Mesma dinâmica sonora dos vídeos 6 e 7: pops nas chegadas, etiquetas de preço,
// batimento quando o cliente se decide, "no" nos fios que se partem.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "positivo" | "negativo" | "emoção"; v?: number };
const SFX: Sfx[] = [
  // 1 · gancho
  { file: "swell.wav", at: 0.0, kind: "emoção", v: 0.6 },
  { file: "pop.wav", at: W8.comprar, kind: "entrada" },
  { file: "pop.wav", at: W8.dois, kind: "entrada" },
  { file: "heartbeat.wav", at: W8.dois, kind: "emoção", v: 0.6 },
  { file: "yes.wav", at: W8.produtos, kind: "positivo", v: 0.6 },
  { file: "swish.wav", at: W8.um + 0.12, kind: "negativo", v: 0.6 },
  // 2 · cupcake a 5
  { file: "whoosh.wav", at: SCENES8.cupcake.from - 0.05, kind: "entrada", v: 0.7 },
  { file: "shimmer.wav", at: W8.cupcakes, kind: "destaque", v: 0.5 },
  { file: "pop.wav", at: W8.cupcakes + 0.05, kind: "entrada" },
  { file: "tick.wav", at: W8.cinco, kind: "entrada" },
  { file: "pop.wav", at: W8.cinco + 0.05, kind: "entrada", v: 0.7 },
  // 3 · novas opções
  { file: "swish.wav", at: SCENES8.opcoes.from, kind: "entrada" },
  { file: "pop.wav", at: W8.adiciona, kind: "entrada", v: 0.6 },
  { file: "thud.wav", at: W8.maior, kind: "entrada" },
  { file: "tick.wav", at: W8.nove, kind: "entrada" },
  { file: "pop.wav", at: W8.dois2, kind: "entrada" },
  { file: "pop.wav", at: W8.pequenos, kind: "entrada" },
  { file: "tick.wav", at: W8.dez, kind: "entrada" },
  // 4 · três escolhas
  { file: "whoosh.wav", at: SCENES8.escolhas.from - 0.05, kind: "entrada", v: 0.7 },
  ...[0, 1, 2].map((i): Sfx => ({ file: "pop.wav", at: W8.tres + i * 0.1, kind: "entrada", v: 0.7 })),
  { file: "tick.wav", at: W8.um2, kind: "entrada" },
  { file: "tick.wav", at: W8.um3, kind: "entrada" },
  { file: "tick.wav", at: W8.dois3, kind: "entrada" },
  // 5 · comparação
  { file: "swish.wav", at: SCENES8.compara.from, kind: "entrada", v: 0.7 },
  { file: "no.wav", at: W8.pouco + 0.12, kind: "negativo", v: 0.7 },
  { file: "no.wav", at: W8.tanto + 0.12, kind: "negativo", v: 0.7 },
  { file: "pop.wav", at: W8.um4, kind: "entrada" },
  { file: "yes.wav", at: W8.melhor, kind: "positivo", v: 0.8 },
  { file: "heartbeat.wav", at: W8.melhor + 0.05, kind: "emoção", v: 0.6 },
  { file: "shimmer.wav", at: W8.negocio, kind: "destaque", v: 0.5 },
  // 6 · o truque
  { file: "whoosh.wav", at: SCENES8.truque.from - 0.05, kind: "entrada", v: 0.7 },
  { file: "hit.wav", at: W8.truque - 0.04, kind: "destaque", v: 0.55 },
  { file: "stamp.wav", at: W8.existe, kind: "entrada", v: 0.6 },
  { file: "swish.wav", at: W8.fazer, kind: "entrada", v: 0.7 },
  { file: "no.wav", at: W8.escolher + 0.06, kind: "negativo", v: 0.5 },
  { file: "yes.wav", at: W8.escolher + 0.1, kind: "positivo" },
  { file: "heartbeat.wav", at: W8.quer, kind: "emoção", v: 0.6 },
  // 7 · siga
  { file: "swish.wav", at: SCENES8.siga.from, kind: "entrada", v: 0.7 },
  { file: "pop.wav", at: W8.siga, kind: "entrada" },
  { file: "typekey.wav", at: W8.para2 - 0.05, kind: "entrada" },
  { file: "yes.wav", at: W8.para2 + 0.08, kind: "positivo", v: 0.8 },
  { file: "shimmer.wav", at: W8.estrategias, kind: "destaque", v: 0.4 },
];

// Ducking automático: cada efeito só ocupa a margem livre do original
// naquele fotograma (src/v8/mix8.json) — a voz nunca é alterada.
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

export const Explicativo8: React.FC<Explicativo8Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: c2.nightBottom }}>
      <Sequence {...span(SCENES8.gancho.from, SCENES8.gancho.to, fps)} name="1 · Dois em vez de um">
        <S1Gancho />
      </Sequence>
      <Sequence {...span(SCENES8.cupcake.from, SCENES8.cupcake.to, fps)} name="2 · Cupcake a 5">
        <S2Cupcake />
      </Sequence>
      <Sequence {...span(SCENES8.opcoes.from, SCENES8.opcoes.to, fps)} name="3 · Grande a 9, dois a 10">
        <S3Opcoes />
      </Sequence>
      <Sequence {...span(SCENES8.escolhas.from, SCENES8.escolhas.to, fps)} name="4 · Três escolhas">
        <S4Escolhas />
      </Sequence>
      <Sequence {...span(SCENES8.compara.from, SCENES8.compara.to, fps)} name="5 · Melhor negócio">
        <S5Compara />
      </Sequence>
      <Sequence {...span(SCENES8.truque.from, SCENES8.truque.to, fps)} name="6 · O truque (isca)">
        <S6Truque />
      </Sequence>
      <Sequence from={Math.round(SCENES8.siga.from * fps)} name="7 · Siga">
        <S7Siga />
      </Sequence>

      <Finish4 />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao8.m4a")} />
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
