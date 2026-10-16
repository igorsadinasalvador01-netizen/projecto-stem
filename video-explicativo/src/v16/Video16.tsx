import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, ProfileOutro, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import mixJson from "./mix16.json";
import { Bg16, Pitch, S1, S2, S3 } from "./Scenes16";
import { KICKS } from "./Stadium3D";
import { T16 as T } from "./theme16";
import wordsJson from "./words16.json";

loadFonts();
loadFonts2();

// Vídeo 16 — "Chutar pro gol" (vertical 1080×1920). Narração original intacta
// (public/narracao16.m4a, 19,77 s) + 3,6 s de fecho com o perfil original.
export const AUDIO16 = 19.77;
export const TOTAL16 = 23.37;
const WORDS = wordsJson as Word[];
const SCENES: [React.FC, number, number][] = [
  [S1, 0, 3.7],
  [S2, 3.7, 5.1],
  [S3, 5.1, 7.7],
  [Pitch, 7.7, AUDIO16],
];
const POS = ["meta.", "vende.", "treina,", "aumenta.", "gol.", "gol,", "proficiente"];
const tone = (w: string) => (POS.includes(w.toLowerCase()) ? T.green : undefined);

const CUES: Cue[] = [
  { file: "swell.wav", at: 0, v: 0.35 },
  ...seq("tick.wav", 1.5, 16, 0.11, 0.4),
  { file: "yes.wav", at: 3.36, v: 0.5 },
  { file: "whoosh.wav", at: 3.65, v: 0.45 },
  { file: "k_bong.wav", at: 4.08, v: 0.45 },
  { file: "swish.wav", at: 5.05, v: 0.45 },
  ...seq("pop.wav", 5.5, 6, 0.28, 0.4),
  { file: "k_select.wav", at: 6.8, v: 0.5 },
  { file: "whoosh.wav", at: 7.65, v: 0.5 },
  { file: "k_grass.wav", at: 8.2, v: 0.4 },
  ...KICKS.flatMap((k) => [
    { file: "k_punch.wav", at: k.at, v: 0.45 },
    k.kind === "goal" ? { file: "clap.wav", at: k.at + 0.45, v: 0.45 } : k.kind === "post" ? { file: "k_metal_light.wav", at: k.at + 0.48, v: 0.6 } : { file: "swish.wav", at: k.at + 0.2, v: 0.35 },
  ]),
  { file: "k_grass.wav", at: 13.45, v: 0.45 },
  { file: "stamp.wav", at: 16.72, v: 0.55 },
  { file: "ding.wav", at: 18.4, v: 0.3 },
  { file: "whoosh.wav", at: AUDIO16, v: 0.5 },
  { file: "tap.wav", at: AUDIO16 + 1.4, v: 0.5 },
  { file: "yes.wav", at: AUDIO16 + 1.48, v: 0.55 },
  { file: "ding.wav", at: AUDIO16 + 3.0, v: 0.25 },
];

export type Video16Props = { sfx: boolean; sfxGain: number };
export const Video16: React.FC<Video16Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: T.night }}>
      {SCENES.map(([C, a, b], i) => (
        <Sequence key={i} from={Math.round(a * fps)} durationInFrames={Math.round((b + 0.6) * fps) - Math.round(a * fps)} name={`cena ${i + 1}`}>
          <C />
        </Sequence>
      ))}
      <Sequence durationInFrames={Math.round(AUDIO16 * fps)} name="acabamento">
        <Finish vignette="rgba(0,0,0,0.55)" grain={0.06} />
      </Sequence>
      <Captions words={WORDS} maxChars={26} until={AUDIO16 + 0.1} st={{ font: T.body, size: 48, weight: 800, color: T.chalk, active: T.green, y: 1600, pill: { bg: "rgba(10,15,13,0.66)", edge: T.edge }, tone }} />
      <Sequence from={Math.round(AUDIO16 * fps)} name="fecho · perfil">
        <ProfileOutro from={AUDIO16} tap={AUDIO16 + 1.4} bg={<Bg16 />} title={[{ w: "Siga", at: AUDIO16 + 0.1 }, { w: "o perfil", at: AUDIO16 + 0.3, color: T.green }]} sub="treino de vendas todos os dias" font={T.display} subFont={T.body} ink={T.chalk} dim={T.dim} accent={T.pitch} titleSize={150} />
      </Sequence>
      <Audio src={staticFile("narracao16.m4a")} />
      {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
    </AbsoluteFill>
  );
};
