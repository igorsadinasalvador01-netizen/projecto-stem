import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, ProfileOutro, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import mixJson from "./mix12.json";
import { Bg12, S1, S10, S11, S2, S3, S4, S5, S6, S7, S8, S9 } from "./Scenes12";
import { T12 as T } from "./theme12";
import wordsJson from "./words12.json";

loadFonts();
loadFonts2();

// Vídeo 12 — "O que você não quer?" (vertical 1080×1920). Narração original intacta
// (public/narracao12.m4a, 65,85 s) + 3,6 s de fecho com o perfil original.
export const AUDIO12 = 65.85;
export const TOTAL12 = 69.45;
const WORDS = wordsJson as Word[];
const SCENES: [React.FC, number, number][] = [
  [S1, 0, 7.2],
  [S2, 7.2, 13.8],
  [S3, 13.8, 16.3],
  [S4, 16.3, 22.2],
  [S5, 22.2, 25.8],
  [S6, 25.8, 28.8],
  [S7, 28.8, 34.4],
  [S8, 34.4, 38.7],
  [S9, 38.7, 49.5],
  [S10, 49.5, 57.1],
  [S11, 57.1, AUDIO12],
];
const NEG = ["erro", "erro.", "tagarelando,", "dor", "desconforto.", "medos", "não"];
const POS = ["simples.", "poderosíssima,", "consultor,", "solução", "fácil", "eficiente", "sentido"];
const tone = (w: string) => {
  const k = w.toLowerCase();
  if (NEG.includes(k)) return T.coral;
  if (POS.includes(k)) return T.mint;
  return undefined;
};

const CUES: Cue[] = [
  { file: "swell.wav", at: 0, v: 0.5 },
  { file: "k_glass_med.wav", at: 0.12, v: 0.7 },
  { file: "k_bong.wav", at: 1.92, v: 0.6 },
  { file: "whoosh.wav", at: 5.1, v: 0.5 },
  { file: "yes.wav", at: 5.92, v: 0.45 },
  { file: "pop.wav", at: 7.04, v: 0.6 },
  { file: "whoosh.wav", at: 7.12, v: 0.55 },
  { file: "k_error.wav", at: 8.64, v: 0.5 },
  ...seq("k_drop.wav", 9.3, 18, 0.08, 0.2),
  ...seq("tick.wav", 9.7, 10, 0.11, 0.25),
  { file: "k_glass_light.wav", at: 12.15, v: 0.6 },
  { file: "shimmer.wav", at: 12.24, v: 0.4 },
  { file: "swish.wav", at: 13.75, v: 0.5 },
  { file: "k_select.wav", at: 15.6, v: 0.32 },
  { file: "yes.wav", at: 15.65, v: 0.2 },
  { file: "swish.wav", at: 16.25, v: 0.5 },
  ...seq("tick.wav", 16.8, 12, 0.13, 0.45),
  { file: "pop.wav", at: 18.1, v: 0.5 },
  { file: "k_error.wav", at: 19.04, v: 0.45 },
  { file: "k_impact_soft.wav", at: 20.97, v: 0.35 },
  { file: "stamp.wav", at: 21.9, v: 0.6 },
  { file: "whoosh.wav", at: 22.15, v: 0.5 },
  ...seq("pop.wav", 22.5, 8, 0.22, 0.4),
  { file: "k_switch.wav", at: 24.6, v: 0.55 },
  { file: "yes.wav", at: 25.04, v: 0.5 },
  { file: "swell.wav", at: 25.7, v: 0.4 },
  { file: "paper.wav", at: 26.9, v: 0.5 },
  ...seq("k_key.wav", 27.62, 14, 0.05, 0.4),
  { file: "k_bong.wav", at: 28.4, v: 0.6 },
  { file: "whoosh.wav", at: 28.75, v: 0.5 },
  { file: "shimmer.wav", at: 30.08, v: 0.4 },
  ...seq("pop.wav", 31.6, 5, 0.32, 0.45),
  { file: "swish.wav", at: 34.35, v: 0.5 },
  ...seq("tick.wav", 35.4, 8, 0.1, 0.5),
  { file: "k_glass_light.wav", at: 37.52, v: 0.6 },
  { file: "k_glass_light.wav", at: 38.08, v: 0.6 },
  { file: "whoosh.wav", at: 38.65, v: 0.5 },
  { file: "pop.wav", at: 40.9, v: 0.45 },
  { file: "k_impact_soft.wav", at: 43.04, v: 0.6 },
  { file: "yes.wav", at: 43.1, v: 0.45 },
  { file: "swish.wav", at: 43.85, v: 0.45 },
  { file: "shimmer.wav", at: 44.56, v: 0.4 },
  { file: "no.wav", at: 46.48, v: 0.35 },
  { file: "k_glass_med.wav", at: 48.6, v: 0.16 },
  { file: "swish.wav", at: 49.45, v: 0.5 },
  { file: "alert.wav", at: 53.6, v: 0.3 },
  { file: "pop.wav", at: 55.1, v: 0.45 },
  { file: "whoosh.wav", at: 57.05, v: 0.5 },
  { file: "k_bong.wav", at: 59.36, v: 0.6 },
  { file: "pop.wav", at: 60.72, v: 0.5 },
  { file: "pop.wav", at: 61.2, v: 0.5 },
  { file: "yes.wav", at: 63.2, v: 0.45 },
  { file: "yes.wav", at: 63.92, v: 0.45 },
  { file: "whoosh.wav", at: 65.85, v: 0.5 },
  { file: "tap.wav", at: 67.2, v: 0.5 },
  { file: "yes.wav", at: 67.28, v: 0.55 },
  { file: "ding.wav", at: 68.8, v: 0.25 },
];

export type Video12Props = { sfx: boolean; sfxGain: number };
export const Video12: React.FC<Video12Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: T.base }}>
      {SCENES.map(([C, a, b], i) => (
        <Sequence key={i} from={Math.round(a * fps)} durationInFrames={Math.round((b + 0.6) * fps) - Math.round(a * fps)} name={`cena ${i + 1}`}>
          <C />
        </Sequence>
      ))}
      <Finish vignette="rgba(4,4,5,0.7)" grain={0.07} />
      <Captions words={WORDS} maxChars={26} until={AUDIO12 + 0.1} st={{ font: T.body, size: 50, weight: 800, color: T.ink, active: "#E3D3B3", y: 1600, pill: { bg: "rgba(23,25,28,0.6)", edge: T.edge }, tone }} />
      <Sequence from={Math.round(AUDIO12 * fps)} name="fecho · perfil">
        <ProfileOutro from={AUDIO12} tap={67.2} bg={<Bg12 />} title={[{ w: "Siga", at: AUDIO12 + 0.1 }, { w: "o perfil", at: AUDIO12 + 0.3, color: "#E3D3B3" }]} sub="mais perguntas que vendem" font={T.display} subFont={T.body} ink={T.ink} dim={T.dim} accent={T.violetDeep} />
      </Sequence>
      <Audio src={staticFile("narracao12.m4a")} />
      {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
    </AbsoluteFill>
  );
};
