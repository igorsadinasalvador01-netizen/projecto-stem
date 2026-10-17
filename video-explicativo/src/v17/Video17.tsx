import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import mixJson from "./mix17.json";
import { M, OUT_LEN } from "./cuts17";
import { GLITCHES, GlitchDefs, useFx17 } from "./Fx17";
import { Behind, CTA, CTA_CARD_AT, Front, HUD, Person, Plate } from "./Scenes17";
import { T17 as T } from "./theme17";
import wordsJson from "./words17.json";

loadFonts();
loadFonts2();

// Vídeo 17 — "Vender valor na construção" (vertical 1080×1920, filmagem do cliente).
// Fala original sem as pausas mortas (public/narracao17c.m4a, cortada nos mesmos fotogramas da
// filmagem) + 2 s finais com o perfil original. Todas as marcas abaixo estão no tempo ORIGINAL
// da fala e são convertidas com M() para o tempo da montagem.
export const AUDIO17 = OUT_LEN;
export const TOTAL17 = OUT_LEN + 2.0;
const WORDS = (wordsJson as Word[]).map((w) => ({ ...w, start: M(w.start), end: M(w.end) }));
const RED = ["perder", "pior.", "falham.", "esquecem-se", "apenas"];
const GREEN = ["excelentes,", "confiança.", "segurança,", "previsibilidade", "tranquilidade.", "valor", "transformar.", "controlar", "reduzir", "minimizar", "cumprir", "escolher-te."];
const tone = (w: string) => {
  const k = w.toLowerCase();
  if (RED.includes(k)) return T.red;
  if (GREEN.includes(k)) return T.green;
  return undefined;
};

const CUES_SRC: Cue[] = [
  { file: "swell.wav", at: 0, v: 0.35 },
  { file: "k_glass_med.wav", at: 0.6, v: 0.5 },
  { file: "yes.wav", at: 2.64, v: 0.45 },
  { file: "pop.wav", at: 6.0, v: 0.45 },
  { file: "swish.wav", at: 6.6, v: 0.35 },
  { file: "k_bong.wav", at: 7.04, v: 0.4 },
  { file: "k_error.wav", at: 9.2, v: 0.3 },
  { file: "pop.wav", at: 9.84, v: 0.45 },
  { file: "whoosh.wav", at: 12.62, v: 0.4 },
  { file: "yes.wav", at: 14.8, v: 0.45 },
  { file: "k_glass_light.wav", at: 15.7, v: 0.5 },
  { file: "swish.wav", at: 16.5, v: 0.4 },
  { file: "pop.wav", at: 17.04, v: 0.4 },
  { file: "pop.wav", at: 17.5, v: 0.4 },
  { file: "k_card_slide.wav", at: 20.0, v: 0.45 },
  { file: "tick.wav", at: 20.96, v: 0.45 },
  { file: "tick.wav", at: 22.56, v: 0.45 },
  { file: "k_card_slide.wav", at: 23.92, v: 0.45 },
  ...[26.24, 27.84, 29.92, 31.6].map((at) => ({ file: "k_select.wav", at, v: 0.5 })),
  ...seq("tick.wav", 34.24, 8, 0.12, 0.35),
  { file: "yes.wav", at: 35.36, v: 0.45 },
  { file: "swish.wav", at: 35.95, v: 0.35 },
  { file: "pop.wav", at: 37.4, v: 0.4 },
  { file: "k_error.wav", at: 38.2, v: 0.35 },
  ...[39.44, 40.16, 41.36].map((at) => ({ file: "k_glass_light.wav", at, v: 0.45 })),
  // efeitos: zoom digital (degraus), ui world (anel e clique), frame break (vidro a partir)
  { file: "k_switch.wav", at: 33.2, v: 0.25 },
  { file: "k_click.wav", at: 33.45, v: 0.35 },
  { file: "k_select.wav", at: 40.6, v: 0.35 },
  { file: "tap.wav", at: 41.95, v: 0.4 },
  { file: "k_glass_med.wav", at: 42.78, v: 0.2 },
  { file: "k_glass_med.wav", at: 44.95, v: 0.45 },
  { file: "pop.wav", at: 45.6, v: 0.4 },
  { file: "whoosh.wav", at: 48.4, v: 0.4 },
  ...seq("k_select.wav", 49.3, 4, 0.25, 0.45),
  { file: "k_card_fan.wav", at: 51.55, v: 0.3 },
  { file: "k_error.wav", at: 54.4, v: 0.3 },
  { file: "whoosh.wav", at: 55.12, v: 0.3 },
  { file: "shimmer.wav", at: 59.25, v: 0.3 },
  { file: "pop.wav", at: 60.4, v: 0.4 },
  { file: "whoosh.wav", at: 61.2, v: 0.45 },
  { file: "tap.wav", at: 61.95, v: 0.5 },
  { file: "yes.wav", at: 62.03, v: 0.5 },
  { file: "pop.wav", at: 62.64, v: 0.45 },
  { file: "swish.wav", at: 63.52, v: 0.45 },
];

// sons de entrada: acabam mesmo antes da frase seguinte (cobrem as pausas que ficaram)
const ENTRY: [number, "s" | "l"][] = [
  [6.88, "s"],
  [8.24, "l"],
  [11.6, "s"],
  [16.64, "s"],
  [23.92, "l"],
  [33.2, "l"],
  [36.24, "s"],
  [45.28, "s"],
  [51.44, "l"],
  [55.12, "s"],
  [59.84, "s"],
];
// gatilhos: graves, falhas, PB e volta da cor, subidas e impactos
const TRIGGERS: Cue[] = [
  // todos no arranque real da palavra (nunca antes), mais baixos: a voz fica sempre à frente
  { file: "v17_pb.wav", at: 4.4, v: 0.26 },
  { file: "v17_sub.wav", at: 4.42, v: 0.3 },
  { file: "v17_cor.wav", at: 7.02, v: 0.3 },
  { file: "v17_sub.wav", at: 12.72, v: 0.22 },
  { file: "v17_hit.wav", at: 15.98, v: 0.18 },
  { file: "v17_sub.wav", at: 35.37, v: 0.28 },
  { file: "v17_pb.wav", at: 37.37, v: 0.26 },
  { file: "v17_cor.wav", at: 39.44, v: 0.3 },
  { file: "v17_pb.wav", at: 42.47, v: 0.24 },
  { file: "v17_sub.wav", at: 44.7, v: 0.3 },
  { file: "v17_cor.wav", at: 49.1, v: 0.3 },
  { file: "v17_hit.wav", at: 59.23, v: 0.3 },
  ...GLITCHES.map(([at, k]) => ({ file: "v17_glitch.wav", at, v: 0.1 + 0.06 * k })),
];
// risers (2 s): o pico cai na palavra
const RISERS = [15.91, 59.23];
const CUES: Cue[] = [
  ...CUES_SRC.map((c) => ({ ...c, at: M(c.at) })),
  ...TRIGGERS.map((c) => ({ ...c, at: M(c.at) })),
  ...ENTRY.map(([at, k]) => ({ file: k === "s" ? "v17_entry.wav" : "v17_entry_long.wav", at: Math.max(0, M(at) - (k === "s" ? 0.44 : 0.92)), v: k === "s" ? 0.3 : 0.32 })),
  // o pico do riser acaba 0,12 s antes da palavra (na pausa), para não pisar a voz
  ...RISERS.map((at) => ({ file: "v17_riser.wav", at: Math.max(0, M(at) - 2.06), v: 0.2 })),
].sort((a, b) => a.at - b.at);

// música de fundo própria (scripts/gen-v17-audio.py), com o ducking à voz já aplicado
const BED_VOL = 0.15;

export type Video17Props = { sfx: boolean; sfxGain: number };

// só o áudio (voz + música + efeitos), para refazer a mistura sem voltar a renderizar a imagem;
// `master` baixa tudo por igual (o limitador final repõe o nível sem saturar)
export type Video17AudioProps = { sfxGain: number; master: number };
export const Video17Audio: React.FC<Video17AudioProps> = ({ sfxGain, master }) => (
  <AbsoluteFill>
    <Audio src={staticFile("narracao17c.m4a")} volume={master} />
    <Audio src={staticFile("bed17.m4a")} volume={BED_VOL * master} />
    <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} master={master} />
  </AbsoluteFill>
);
// palavras-chave das legendas (ficam maiores)
const EMPH = ["perder", "pior.", "porquê?", "demonstrar", "escolher-te.", "Exemplo.", "confiança.", "segurança,", "previsibilidade", "tranquilidade.", "falham.", "valor", "transformar."];

export const Video17: React.FC<Video17Props> = ({ sfx, sfxGain }) => {
  const fx = useFx17();
  // tremor de impacto (com uma pequena ampliação para nunca mostrar as bordas)
  const sx = fx.shake * 9 * Math.sin(fx.frame * 2.7);
  const sy = fx.shake * 6 * Math.cos(fx.frame * 3.3);
  return (
    <AbsoluteFill style={{ background: T.navy }}>
      <GlitchDefs g={fx.glitch} frame={fx.frame} />
      <AbsoluteFill style={{ filter: fx.glitch > 0.02 ? "url(#glitch17)" : undefined, transform: fx.shake > 0.01 ? `translate(${sx}px, ${sy}px) scale(${1 + 0.02 * fx.shake})` : undefined }}>
        <Plate />
        <Behind />
        <Person />
        <Front />
        <Finish vignette="rgba(2,8,18,0.26)" grain={0.035} />
      </AbsoluteFill>
      <HUD />
      <Captions words={WORDS} maxChars={24} until={AUDIO17 + 0.1} hide={[[M(CTA_CARD_AT), 99]]} st={{ font: T.ui, size: 54, weight: 800, color: T.white, active: T.white, activeBg: "rgba(46,196,214,0.34)", emph: (w) => EMPH.includes(w), y: 1610, pill: { bg: "rgba(10,26,47,0.55)", edge: "rgba(255,255,255,0.14)" }, shadow: "0 4px 18px rgba(0,0,0,0.55)", tone }} />
      <CTA />
      <Audio src={staticFile("narracao17c.m4a")} />
      <Audio src={staticFile("bed17.m4a")} volume={BED_VOL} />
      {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
    </AbsoluteFill>
  );
};
