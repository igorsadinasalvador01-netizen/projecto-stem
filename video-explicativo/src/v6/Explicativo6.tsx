import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { c2 } from "../v2/theme2";
import { Finish2 } from "../v2/components/Shell";
import { SCENES6, W6 } from "./timeline6";
import { S1Confianca, S2Prova, S3Resistencia } from "./scenes/A_Conexao";
import { S4Restaurante, S5Produto, S6Coro, S7Venda } from "./scenes/B_Venda";
import mix from "./mix6.json";

loadFonts();

export type Explicativo6Props = { sfx: boolean; sfxGain: number };

// Sons emocionais: batimento nos momentos de confiança, "swell" por baixo das
// ligações, pops nas chegadas, "no"/alerta nos sinais negativos, ding na venda.
type Sfx = { file: string; at: number; kind: "entrada" | "destaque" | "positivo" | "negativo" | "emoção"; v?: number };
const SFX: Sfx[] = [
  // 1 · confiança
  { file: "swell.wav", at: 0.0, kind: "emoção", v: 0.7 },
  { file: "hit.wav", at: W6.truque - 0.04, kind: "destaque" },
  ...[0, 1, 2, 3].map((i): Sfx => ({ file: "tick.wav", at: W6.pessoas + i * 0.06, kind: "entrada" })),
  { file: "heartbeat.wav", at: W6.confiarem, kind: "emoção" },
  { file: "heartbeat.wav", at: W6.duas, kind: "emoção", v: 0.8 },
  // 2 · prova social
  { file: "swish.wav", at: SCENES6.prova.from, kind: "entrada" },
  { file: "hit.wav", at: W6.prova - 0.04, kind: "destaque" },
  { file: "shimmer.wav", at: W6.social, kind: "destaque" },
  ...[0, 1, 2, 3, 4].map((i): Sfx => ({ file: "tick.wav", at: W6.social + i * 0.1, kind: "entrada" })),
  // 3 · resistência
  { file: "whoosh.wav", at: SCENES6.resistencia.from - 0.05, kind: "entrada" },
  { file: "no.wav", at: W6.arriscar, kind: "negativo" },
  { file: "pop.wav", at: W6.compraram, kind: "entrada" },
  { file: "pop.wav", at: W6.elogiaram, kind: "entrada" },
  { file: "pop.wav", at: W6.recomendaram, kind: "entrada" },
  { file: "swell.wav", at: W6.compraram, kind: "emoção", v: 0.8 },
  { file: "alert.wav", at: W6.resistencia + 0.1, kind: "negativo", v: 0.6 },
  { file: "shimmer.wav", at: W6.some, kind: "destaque" },
  { file: "yes.wav", at: W6.some + 0.12, kind: "positivo" },
  // 4 · restaurante
  { file: "swish.wav", at: SCENES6.restaurante.from, kind: "entrada" },
  { file: "thud.wav", at: W6.restaurante, kind: "entrada" },
  { file: "no.wav", at: W6.vazio, kind: "negativo" },
  { file: "thud.wav", at: W6.outro, kind: "entrada" },
  ...[0, 1, 2, 3].map((i): Sfx => ({ file: "pop.wav", at: W6.fila + i * 0.1, kind: "entrada", v: 0.7 })),
  { file: "yes.wav", at: W6.porta, kind: "positivo" },
  { file: "pop.wav", at: W6.provar, kind: "entrada" },
  { file: "swell.wav", at: W6.acredita - 0.2, kind: "emoção", v: 0.7 },
  { file: "whoosh.wav", at: W6.daFila - 0.1, kind: "entrada", v: 0.6 },
  { file: "yes.wav", at: W6.melhor, kind: "positivo" },
  { file: "shimmer.wav", at: W6.melhor + 0.05, kind: "destaque", v: 0.8 },
  // 5 · produto
  { file: "whoosh.wav", at: SCENES6.produto.from - 0.05, kind: "entrada" },
  { file: "hit.wav", at: W6.produto - 0.04, kind: "destaque" },
  { file: "pop.wav", at: W6.comprou, kind: "entrada" },
  { file: "heartbeat.wav", at: W6.comprou + 0.27, kind: "emoção", v: 0.6 },
  { file: "pop.wav", at: W6.resultado, kind: "entrada" },
  { file: "pop.wav", at: W6.recomenda, kind: "entrada" },
  { file: "shimmer.wav", at: W6.recomenda + 0.3, kind: "destaque", v: 0.8 },
  // 6 · coro
  { file: "swish.wav", at: SCENES6.coro.from, kind: "entrada" },
  { file: "pop.wav", at: W6.falar, kind: "entrada" },
  { file: "no.wav", at: W6.bom + 0.06, kind: "negativo" },
  { file: "pop.wav", at: W6.deixa, kind: "entrada" },
  { file: "pop.wav", at: 26.4, kind: "entrada" },
  { file: "pop.wav", at: W6.outros2, kind: "entrada" },
  { file: "pop.wav", at: W6.falarem, kind: "entrada" },
  { file: "heartbeat.wav", at: W6.porVoce, kind: "emoção" },
  // 7 · a venda acontece
  { file: "whoosh.wav", at: SCENES6.venda.from - 0.05, kind: "entrada" },
  { file: "riser.wav", at: W6.venda - 1.0, kind: "destaque", v: 0.7 },
  // "venda" tem de se ouvir limpo: o clímax fica ~3 dB abaixo da voz
  { file: "hit.wav", at: W6.venda - 0.04, kind: "destaque", v: 0.5 },
  { file: "ding.wav", at: W6.venda, kind: "positivo", v: 0.3 },
  { file: "heartbeat.wav", at: W6.venda + 0.05, kind: "emoção", v: 0.45 },
  { file: "shimmer.wav", at: W6.acontece, kind: "destaque" },
];

// Ducking automático: cada efeito só ocupa a margem livre do original
// naquele fotograma (src/v6/mix6.json) — a voz nunca é alterada.
const headroomAt = (absFrame: number) => {
  const h = mix.headroom;
  const i = Math.max(0, Math.min(h.length - 1, absFrame));
  const a = h[Math.max(0, i - 1)];
  const b = h[i];
  const c = h[Math.min(h.length - 1, i + 1)];
  return Math.max(0.02, (a + b + c) / 3);
};
// O volume é quantizado (16 degraus, sempre para baixo) para a expressão de
// volume que o ffmpeg recebe continuar curta.
const duck = (file: string, desired: number, startFrame: number) => (f: number) => {
  const peak = (mix.peaks as Record<string, number>)[file] ?? 1;
  const v = Math.min(desired, headroomAt(startFrame + f) / peak);
  const step = desired / 16;
  return Math.floor(v / step + 1e-6) * step;
};

// Duração de cada efeito (s): a sequência acaba com o som, não com o vídeo.
const SFX_SECONDS: Record<string, number> = {
  "alert.wav": 0.32, "ding.wav": 1.3, "heartbeat.wav": 0.9, "hit.wav": 0.9, "no.wav": 0.6, "pop.wav": 0.16,
  "riser.wav": 1.0, "shimmer.wav": 1.4, "swell.wav": 2.2, "swish.wav": 0.28, "thud.wav": 0.28, "tick.wav": 0.04,
  "whoosh.wav": 0.55, "yes.wav": 0.7,
};

// Cada cena fica mais 0,6 s por baixo da seguinte, até a transição de entrada
// desta (0,5 s) a cobrir por completo — nunca há fundo vazio a meio.
const TRANSITION_HOLD = 0.6;
const span = (from: number, to: number, fps: number) => ({
  from: Math.round(from * fps),
  durationInFrames: Math.round((to + TRANSITION_HOLD) * fps) - Math.round(from * fps),
});

export const Explicativo6: React.FC<Explicativo6Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: c2.white }}>
      <Sequence {...span(SCENES6.confianca.from, SCENES6.confianca.to, fps)} name="1 · Confiarem em você">
        <S1Confianca />
      </Sequence>
      <Sequence {...span(SCENES6.prova.from, SCENES6.prova.to, fps)} name="2 · Prova social">
        <S2Prova />
      </Sequence>
      <Sequence {...span(SCENES6.resistencia.from, SCENES6.resistencia.to, fps)} name="3 · A resistência some">
        <S3Resistencia />
      </Sequence>
      <Sequence {...span(SCENES6.restaurante.from, SCENES6.restaurante.to, fps)} name="4 · Restaurante vazio vs fila">
        <S4Restaurante />
      </Sequence>
      <Sequence {...span(SCENES6.produto.from, SCENES6.produto.to, fps)} name="5 · O seu produto">
        <S5Produto />
      </Sequence>
      <Sequence {...span(SCENES6.coro.from, SCENES6.coro.to, fps)} name="6 · Os outros falam por você">
        <S6Coro />
      </Sequence>
      <Sequence from={Math.round(SCENES6.venda.from * fps)} name="7 · A venda acontece">
        <S7Venda />
      </Sequence>

      <Finish2 />

      {/* Áudio original intacto */}
      <Audio src={staticFile("narracao6.m4a")} />
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
