import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import { M, OUT_LEN, useClock18 } from "./cuts18";
import { activeFx, EffectsBehind, EffectsFront } from "./Effects18";
import { GlitchDefs, GLITCHES, useFx18 } from "./Fx18";
import mixJson from "./mix18.json";
import { Compare, Convince, CTA18, CTA_AT, ErrorCards, HUD18, Measure, Person, Plate } from "./Scenes18";
import { T18 as T } from "./theme18";
import wordsJson from "./words18.json";

loadFonts();
loadFonts2();

// Vídeo 18 — "Medir antes de vender" (vertical 1080×1920, segunda filmagem do cliente).
// Fala sem as pausas mortas (public/narracao18c.m4a) + 2 s finais com o perfil original.
// Todas as marcas estão no tempo ORIGINAL da fala e são convertidas com M().
export const AUDIO18 = OUT_LEN;
export const TOTAL18 = OUT_LEN + 2.0;
const WORDS = (wordsJson as Word[]).map((w) => ({ ...w, start: M(w.start), end: M(w.end) }));
const RED = ["perder", "dinheiro.", "inventar", "errado.", "erro", "falta"];
const GREEN = ["resolver.", "perfeita", "compreensão"];
// palavras-chave em itálico serifado maiúsculo (como na referência)
const SERIF = ["perder", "medir", "inventar", "mesma", "cliente", "problema", "errado.", "diagnóstico", "perguntas.", "resolver."];
const EMPH = [...SERIF, "medições", "vendas", "detalhes,", "interpretar", "decisão.", "perfeita", "negócio.", "convencer", "compreensão"];
const tone = (w: string) => {
  const k = w.toLowerCase();
  if (RED.includes(k)) return T.red;
  if (GREEN.includes(k)) return T.green;
  return undefined;
};

// sons no estilo da referência: "pop" em cada elemento, cliques e ticks nas listas, "shu"
// muito leve nas transições, graves suaves nas palavras-chave (nada de raspado nem sirene)
const CUES_SRC: Cue[] = [
  { file: "v17_shu.wav", at: 0.05, v: 0.08 },
  { file: "k_glass_light.wav", at: 0.6, v: 0.22 },
  ...[0.8, 1.6, 3.28, 4.48].map((at) => ({ file: "pop.wav", at, v: 0.22 })),
  { file: "v17_sub.wav", at: 7.36, v: 0.22 },
  { file: "k_error.wav", at: 7.4, v: 0.16 },
  { file: "v17_shu.wav", at: 8.3, v: 0.08 },
  { file: "k_click.wav", at: 9.28, v: 0.3 },
  { file: "pop.wav", at: 11.04, v: 0.2 },
  { file: "pop.wav", at: 12.99, v: 0.2 },
  ...seq("tick.wav", 13.05, 8, 0.09, 0.16),
  { file: "v17_shu.wav", at: 14.25, v: 0.08 },
  { file: "pop.wav", at: 14.32, v: 0.22 },
  ...[14.72, 15.84, 17.76, 20.4, 21.36, 24.32].map((at) => ({ file: "k_select.wav", at: at + 0.3, v: 0.32 })),
  { file: "pop.wav", at: 22.16, v: 0.18 },
  { file: "k_error.wav", at: 23.68, v: 0.16 },
  { file: "yes.wav", at: 26.51, v: 0.22 },
  { file: "v17_shu.wav", at: 27.25, v: 0.1 },
  ...[28.72, 30.72].map((at) => ({ file: "pop.wav", at, v: 0.22 })),
  { file: "k_bong.wav", at: 31.69, v: 0.25 },
  { file: "v17_shu.wav", at: 33.15, v: 0.08 },
  { file: "v17_shu.wav", at: 34.0, v: 0.1 },
  { file: "pop.wav", at: 34.48, v: 0.2 },
  ...[35.44, 40.13, 44.1].map((at) => ({ file: "pop.wav", at, v: 0.22 })),
  ...[37.52, 42.0].flatMap((at) => [...seq("typekey.wav", at - 0.4, 4, 0.08, 0.14), { file: "k_click.wav", at, v: 0.26 }]),
  ...[45.6, 46.88, 47.52, 47.94].map((at) => ({ file: "pop.wav", at, v: 0.18 })),
  { file: "v17_pb.wav", at: 49.43, v: 0.18 },
  { file: "v17_sub.wav", at: 49.45, v: 0.22 },
  { file: "yes.wav", at: 52.0, v: 0.2 },
  { file: "k_error.wav", at: 53.52, v: 0.18 },
  { file: "v17_sub.wav", at: 54.22, v: 0.2 },
  { file: "v17_cor.wav", at: 54.96, v: 0.22 },
  { file: "pop.wav", at: 56.01, v: 0.2 },
  { file: "k_error.wav", at: 58.22, v: 0.16 },
  { file: "pop.wav", at: 60.56, v: 0.2 },
  { file: "k_switch.wav", at: 61.0, v: 0.2 },
  { file: "k_click.wav", at: 61.3, v: 0.3 },
  { file: "k_error.wav", at: 62.73, v: 0.16 },
  { file: "v17_shu.wav", at: 63.6, v: 0.08 },
  { file: "pop.wav", at: 64.53, v: 0.2 },
  { file: "k_error.wav", at: 66.87, v: 0.16 },
  { file: "pop.wav", at: 68.24, v: 0.24 },
  ...seq("pop.wav", 68.6, 6, 0.15, 0.13),
  { file: "v17_shu.wav", at: 71.83, v: 0.1 },
  { file: "pop.wav", at: 73.52, v: 0.22 },
  { file: "yes.wav", at: 77.76, v: 0.24 },
  { file: "shimmer.wav", at: 77.8, v: 0.14 },
  { file: "v17_shu.wav", at: 78.88, v: 0.08 },
  { file: "v17_shu.wav", at: CTA_AT, v: 0.1 },
  ...[80.32, 81.75, 82.4].map((at) => ({ file: "pop.wav", at, v: 0.26 })),
  { file: "tap.wav", at: 81.85, v: 0.4 },
  { file: "yes.wav", at: 81.93, v: 0.3 },
  { file: "v17_sub.wav", at: 83.45, v: 0.26 },
];
const CUES: Cue[] = [...CUES_SRC.map((c) => ({ ...c, at: M(c.at) })), ...GLITCHES.map(([at, k]) => ({ file: "v17_glitch.wav", at: M(at), v: 0.08 + 0.05 * k }))].sort((a, b) => a.at - b.at);
// música de fundo própria (scripts/gen-v17-audio.py bed, secções do vídeo 18), com ducking à voz
const BED_VOL = 0.15;

const Layers: React.FC = () => {
  const fx = useFx18();
  const { t } = useClock18();
  const sx = fx.shake * 8 * Math.sin(fx.frame * 2.7);
  const sy = fx.shake * 5 * Math.cos(fx.frame * 3.3);
  const f = activeFx(t);
  return (
    <AbsoluteFill>
      <GlitchDefs g={fx.glitch} frame={fx.frame} />
      <AbsoluteFill style={{ filter: fx.glitch > 0.02 ? "url(#glitch18)" : undefined, transform: fx.shake > 0.01 ? `translate(${sx}px, ${sy}px) scale(${1 + 0.02 * fx.shake})` : undefined }}>
        <Plate />
        <AbsoluteFill>
          <Measure />
          <Compare />
          <ErrorCards />
          <Convince />
          <EffectsBehind />
        </AbsoluteFill>
        <Person />
        <EffectsFront />
        {fx.reveal > 0 && fx.reveal < 1 && <div style={{ position: "absolute", left: 455 - fx.reveal * 1947, top: 800 - fx.reveal * 1947, width: fx.reveal * 3894, height: fx.reveal * 3894, borderRadius: "50%", border: `6px solid rgba(31,107,255,${1 - fx.reveal})`, boxShadow: `0 0 40px rgba(31,107,255,${0.5 * (1 - fx.reveal)})` }} />}
        <Finish vignette="rgba(2,8,18,0.18)" grain={0.03} />
      </AbsoluteFill>
      <HUD18 fx={f} />
    </AbsoluteFill>
  );
};

export type Video18Props = { sfx: boolean; sfxGain: number };
export const Video18: React.FC<Video18Props> = ({ sfx, sfxGain }) => (
  <AbsoluteFill style={{ background: T.navy }}>
    <Layers />
    <Captions words={WORDS} maxChars={16} until={AUDIO18 + 0.1} hide={[[M(CTA_AT), 99]]} st={{ font: T.ui, size: 64, weight: 900, color: "#fff", active: "#fff", activeBg: "rgba(31,107,255,0.92)", emph: (w) => EMPH.includes(w), emphStyle: (w) => (SERIF.includes(w) ? { fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, textTransform: "uppercase", fontSize: "1.12em" } : undefined), y: 1500, shadow: "0 4px 16px rgba(10,26,47,0.75), 0 0 2px rgba(10,26,47,0.9)", tone }} />
    <CTA18 />
    <Audio src={staticFile("narracao18c.m4a")} />
    <Audio src={staticFile("bed18.m4a")} volume={BED_VOL} />
    {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
  </AbsoluteFill>
);

// só o áudio, para refazer a mistura sem renderizar a imagem
export type Video18AudioProps = { sfxGain: number; master: number };
export const Video18Audio: React.FC<Video18AudioProps> = ({ sfxGain, master }) => (
  <AbsoluteFill>
    <Audio src={staticFile("narracao18c.m4a")} volume={master} />
    <Audio src={staticFile("bed18.m4a")} volume={BED_VOL * master} />
    <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} master={master} />
  </AbsoluteFill>
);
