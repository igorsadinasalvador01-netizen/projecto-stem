import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import mixJson from "./mix17.json";
import { M, OUT_LEN } from "./cuts17";
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
  { file: "k_error.wav", at: 4.48, v: 0.4 },
  { file: "alert.wav", at: 4.5, v: 0.25 },
  { file: "pop.wav", at: 6.0, v: 0.45 },
  { file: "swish.wav", at: 6.6, v: 0.35 },
  { file: "k_bong.wav", at: 6.85, v: 0.45 },
  { file: "k_error.wav", at: 9.2, v: 0.3 },
  { file: "pop.wav", at: 9.84, v: 0.45 },
  { file: "whoosh.wav", at: 12.35, v: 0.45 },
  { file: "yes.wav", at: 14.8, v: 0.45 },
  { file: "whoosh.wav", at: 15.5, v: 0.5 },
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
  ...[39.44, 40.16, 41.36].map((at) => ({ file: "k_glass_light.wav", at, v: 0.5 })),
  { file: "k_impact_heavy.wav", at: 42.32, v: 0.35 },
  { file: "k_glass_med.wav", at: 44.95, v: 0.45 },
  { file: "pop.wav", at: 45.6, v: 0.4 },
  { file: "k_error.wav", at: 47.36, v: 0.3 },
  { file: "whoosh.wav", at: 48.4, v: 0.4 },
  ...seq("k_select.wav", 49.3, 4, 0.25, 0.45),
  { file: "paper.wav", at: 51.6, v: 0.45 },
  { file: "k_error.wav", at: 54.4, v: 0.3 },
  { file: "k_glass_med.wav", at: 55.3, v: 0.45 },
  { file: "pop.wav", at: 56.56, v: 0.4 },
  { file: "yes.wav", at: 59.04, v: 0.45 },
  { file: "shimmer.wav", at: 59.1, v: 0.35 },
  { file: "pop.wav", at: 60.4, v: 0.4 },
  { file: "whoosh.wav", at: 61.2, v: 0.45 },
  { file: "tap.wav", at: 61.95, v: 0.5 },
  { file: "yes.wav", at: 62.03, v: 0.5 },
  { file: "pop.wav", at: 62.64, v: 0.45 },
  { file: "swish.wav", at: 63.52, v: 0.45 },
];

const CUES: Cue[] = CUES_SRC.map((c) => ({ ...c, at: M(c.at) }));

export type Video17Props = { sfx: boolean; sfxGain: number };
export const Video17: React.FC<Video17Props> = ({ sfx, sfxGain }) => (
  <AbsoluteFill style={{ background: T.navy }}>
    <Plate />
    <Behind />
    <Person />
    <Front />
    <Finish vignette="rgba(2,8,18,0.26)" grain={0.035} />
    <HUD />
    <Captions words={WORDS} maxChars={24} until={AUDIO17 + 0.1} hide={[[M(CTA_CARD_AT), 99]]} st={{ font: T.ui, size: 54, weight: 800, color: T.white, active: T.turq, y: 1610, pill: { bg: "rgba(10,26,47,0.55)", edge: "rgba(255,255,255,0.14)" }, shadow: "0 4px 18px rgba(0,0,0,0.55)", tone }} />
    <CTA />
    <Audio src={staticFile("narracao17c.m4a")} />
    {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
  </AbsoluteFill>
);
