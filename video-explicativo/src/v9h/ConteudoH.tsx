import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { CaptionsH, ChapterTag } from "./Premium";
import { ACT2H, ACT3H, SCENESH, t9, TOTALH, VOICE_END } from "./timelineH";
import { A1, A2, A3, A4, A5 } from "./scenes/ActOne";
import { B1, B2, B3, B4, B5, B6, B7 } from "./scenes/ActTwo";
import { C1, C2, C3, C4, C5, C6, C7 } from "./scenes/ActThree";
import mix from "./mixH.json";

loadFonts();

export type ConteudoHProps = { sfx: boolean; sfxGain: number };

const COMP: Record<string, React.FC> = { a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, b1: B1, b2: B2, b3: B3, b4: B4, b5: B5, b6: B6, b7: B7, c1: C1, c2: C2, c3: C3, c4: C4, c5: C5, c6: C6, c7: C7 };

// sons de interface discretos (premium): cliques, pops, sopros e brilhos
type Sfx = { file: string; at: number; v?: number };
const seq = (file: string, at: number, n: number, step: number, v?: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ file, at: at + i * step, v }));
const SFX: Sfx[] = [
  // noite
  { file: "pop.wav", at: 0.13, v: 0.45 },
  { file: "alert.wav", at: t9("problemas", 0.4), v: 0.15 },
  { file: "pop.wav", at: t9("ideias", 1.8), v: 0.55 },
  { file: "swish.wav", at: 2.38, v: 0.6 },
  { file: "pop.wav", at: t9("tempo", 2.4), v: 0.7 },
  ...seq("tick.wav", t9("essas", 3.9), 6, 0.06, 0.6),
  { file: "no.wav", at: t9("conteúdo", 4.5) + 0.05, v: 0.4 },
  { file: "whoosh.wav", at: 5.42, v: 0.6 },
  ...["parar", "gravar", "repetir", "editar", "legendas", "publicar"].map((w): Sfx => ({ file: "tick.wav", at: t9(w, 5.5) })),
  { file: "rec.wav", at: t9("gravar", 5.5) + 0.04, v: 0.3 },
  ...["editar", "colocar", "publicar"].map((w): Sfx => ({ file: "tap.wav", at: t9(w, 7.5), v: 0.4 })),
  { file: "swish.wav", at: 10.32, v: 0.6 },
  ...["trabalho", "responsabilidades", "prioridades"].map((w): Sfx => ({ file: "pop.wav", at: t9(w, 10.4), v: 0.7 })),
  { file: "pop.wav", at: t9("produzir", 13), v: 0.7 },
  { file: "alert.wav", at: t9("conteúdo", 13.6) + 0.05, v: 0.45 },
  { file: "swish.wav", at: 14.22, v: 0.6 },
  ...seq("tick.wav", t9("constantemente", 14), 7, 0.133, 0.7),
  { file: "heartbeat.wav", at: t9("complicado", 15), v: 0.5 },
  // nascer do sol
  { file: "shimmer.wav", at: ACT2H + 0.02, v: 0.45 },
  { file: "ding.wav", at: ACT2H + 8 / 30, v: 0.08 },
  { file: "pop.wav", at: t9("pude", 16.9), v: 0.5 },
  { file: "pop.wav", at: t9("perceber", 17.2), v: 0.5 },
  { file: "swish.wav", at: 18.36, v: 0.6 },
  { file: "shimmer.wav", at: t9("inteligência", 18.3), v: 0.5 },
  ...seq("tick.wav", t9("completamente", 19.4), 6, 0.08, 0.6),
  { file: "yes.wav", at: t9("processo", 20.2), v: 0.55 },
  { file: "whoosh.wav", at: 20.9, v: 0.6 },
  ...["conhecimento", "ideias", "aprendo"].map((w, i): Sfx => ({ file: "pop.wav", at: t9(w, [21.5, 22.5, 23.5][i]), v: 0.7 })),
  { file: "click.wav", at: t9("transformo", 24) - 0.1, v: 0.4 },
  { file: "click.wav", at: t9("roteiro", 24.5) - 0.1, v: 0.4 },
  ...seq("typekey.wav", t9("transformo", 24), 12, 0.05, 0.6),
  ...["roteiro", "prompts", "vídeos"].map((w, i): Sfx => ({ file: "pop.wav", at: t9(w, [24.5, 25, 25.5][i]), v: 0.7 })),
  { file: "swish.wav", at: 26.32, v: 0.55 },
  { file: "shimmer.wav", at: t9("minha", 27) - 0.05, v: 0.5 },
  { file: "whoosh.wav", at: 27.55, v: 0.6 },
  ...seq("tick.wav", t9("estruturar", 28.5), 4, 0.12, 0.7),
  { file: "swish.wav", at: t9("melhorar", 30) + 0.1, v: 0.5 },
  { file: "yes.wav", at: t9("melhorar", 30) + 0.5, v: 0.5 },
  ...seq("tick.wav", t9("cenas", 32) - 0.5, 6, 0.13, 0.7),
  { file: "swish.wav", at: 33.02, v: 0.55 },
  ...seq("typekey.wav", 33.3, 14, 0.07, 0.6),
  { file: "click.wav", at: t9("preparar", 34.5) - 2 / 30, v: 0.4 },
  { file: "whoosh.wav", at: t9("vários", 35.8) - 0.05, v: 0.6 },
  ...seq("pop.wav", t9("vários", 35.8), 5, 0.05, 0.55),
  { file: "swish.wav", at: 36.96, v: 0.55 },
  ...seq("tick.wav", t9("produzir", 37), 9, 0.08, 0.6),
  { file: "ding.wav", at: t9("dia", 38.8), v: 0.3 },
  // dia
  { file: "whoosh.wav", at: ACT3H - 0.05, v: 0.55 },
  { file: "shimmer.wav", at: ACT3H, v: 0.4 },
  { file: "alert.wav", at: t9("atenção", 39.4) - 0.1, v: 0.3 },
  { file: "pop.wav", at: t9("atenção", 39.4) + 5 / 30, v: 0.5 },
  { file: "swish.wav", at: 39.96, v: 0.55 },
  { file: "whoosh.wav", at: t9("substituir", 40.5), v: 0.45 },
  { file: "no.wav", at: t9("imagem", 41.3), v: 0.45 },
  { file: "yes.wav", at: t9("aparecer", 42), v: 0.55 },
  ...[1, 2].map((k): Sfx => ({ file: "pop.wav", at: t9("aparecer", 42) + (k * 5) / 30, v: 0.45 })),
  { file: "whoosh.wav", at: 43.02, v: 0.55 },
  { file: "swell.wav", at: t9("partilhar", 45.3) - 0.4, v: 0.6 },
  ...seq("tick.wav", t9("partilhar", 45.3), 8, 0.067, 0.6),
  ...seq("pop.wav", t9("agregar", 47.4), 4, 0.133, 0.65),
  { file: "swish.wav", at: 48.43, v: 0.55 },
  ...seq("tick.wav", t9("não", 49), 8, 0.08, 0.5),
  { file: "ding.wav", at: t9("câmeras", 50), v: 0.3 },
  { file: "swish.wav", at: 50.76, v: 0.55 },
  { file: "yes.wav", at: t9("conhecimento", 50.9) + 0.1, v: 0.45 },
  { file: "pop.wav", at: t9("tempo", 52), v: 0.6 },
  { file: "alert.wav", at: t9("limita", 52.6), v: 0.4 },
  { file: "no.wav", at: t9("mais", 54.9) + 0.05, v: 0.45 },
  { file: "swish.wav", at: 55.26, v: 0.5 },
  { file: "swell.wav", at: t9("mudar", 56.8) - 0.6, v: 0.5 },
  { file: "shimmer.wav", at: t9("mudar", 56.8), v: 0.55 },
  { file: "pop.wav", at: t9("mudar", 56.8) - 2 / 30, v: 0.5 },
  { file: "whoosh.wav", at: 58.05, v: 0.55 },
  { file: "pop.wav", at: t9("siga", 58.5), v: 0.7 },
  { file: "tap.wav", at: t9("perfil", 58.9) + 2 / 30, v: 0.45 },
  { file: "yes.wav", at: t9("perfil", 58.9) + 0.15, v: 0.6 },
  ...seq("tick.wav", t9("todos", 60.3), 9, 0.067, 0.6),
  { file: "pop.wav", at: t9("like", 61.5), v: 0.8 },
  { file: "tap.wav", at: t9("like", 61.5), v: 0.35 },
  { file: "pop.wav", at: t9("curte", 61.8), v: 0.8 },
  { file: "whoosh.wav", at: t9("compartilhe", 62.2) + 0.2, v: 0.5 },
  { file: "ding.wav", at: VOICE_END + 0.1, v: 0.3 },
];
const SFX_SECONDS: Record<string, number> = {
  "alert.wav": 0.32, "click.wav": 0.09, "ding.wav": 1.3, "heartbeat.wav": 0.9, "no.wav": 0.6, "pop.wav": 0.16, "rec.wav": 0.32, "shimmer.wav": 1.4,
  "swell.wav": 2.2, "swish.wav": 0.28, "tap.wav": 0.07, "tick.wav": 0.04, "typekey.wav": 0.09, "whoosh.wav": 0.55, "yes.wav": 0.7,
};

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

export const ConteudoH: React.FC<ConteudoHProps> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070D" }}>
      {SCENESH.map((s, i) => {
        const Comp = COMP[s.id];
        const from = Math.round(s.from * fps);
        const last = i === SCENESH.length - 1;
        const dur = last ? Math.round(TOTALH * fps) - from : Math.round((s.to + TRANSITION_HOLD) * fps) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={`${s.id} · ${s.layout}`}>
            <Comp />
          </Sequence>
        );
      })}
      <ChapterTag />
      <CaptionsH />

      <Audio src={staticFile("v9/voz.wav")} />
      <Audio src={staticFile("v9/trilhaH.wav")} />
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
