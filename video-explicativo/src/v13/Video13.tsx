import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, ProfileOutro, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import mixJson from "./mix13.json";
import { Bg13, Inbox, Market, Reaction, S1, S11, S6, Territory } from "./Scenes13";
import { T13 as T } from "./theme13";
import { S10, S8, S9 } from "./Scenes13b";
import wordsJson from "./words13.json";

loadFonts();
loadFonts2();

// Vídeo 13 — "Vendedor herbívoro vs carnívoro" (horizontal 1920×1080). Narração original
// intacta (public/narracao13.m4a, 70,13 s) + 3,6 s de fecho com o perfil original.
export const AUDIO13 = 70.13;
export const TOTAL13 = 73.7;
const WORDS = wordsJson as Word[];
const SCENES: [React.FC, number, number][] = [
  [S1, 0, 3.0],
  [Inbox, 3.0, 16.4],
  [Market, 16.4, 22.9],
  [Territory, 22.9, 30.4],
  [S6, 30.4, 35.2],
  [Reaction, 35.2, 41.4],
  [S8, 41.4, 45.5],
  [S9, 45.5, 54.8],
  [S10, 54.8, 64.5],
  [S11, 64.5, AUDIO13],
];
const NEG = ["acaba,", "emagrece", "morre", "errar", "fome", "cai.", "tirador", "pedido.", "atendente", "bar."];
const POS = ["escolhe.", "escolhe", "decide", "caçar", "prospectar.", "prospectar,", "high", "ticket.", "carnívoro.", "carnívoro"];
const tone = (w: string) => {
  const k = w.toLowerCase();
  if (NEG.includes(k)) return T.miss;
  if (POS.includes(k)) return T.carn;
  return undefined;
};

const CUES: Cue[] = [
  { file: "swell.wav", at: 0, v: 0.5 },
  { file: "k_wood.wav", at: 0.1, v: 0.6 },
  { file: "k_grass.wav", at: 1.76, v: 0.7 },
  { file: "k_impact_soft.wav", at: 2.48, v: 0.6 },
  { file: "whoosh.wav", at: 2.95, v: 0.45 },
  { file: "k_grass.wav", at: 4.4, v: 0.55 },
  { file: "k_grass.wav", at: 6.1, v: 0.5 },
  { file: "k_wood.wav", at: 7.36, v: 0.6 },
  { file: "k_wood.wav", at: 7.6, v: 0.55 },
  { file: "k_error.wav", at: 8.3, v: 0.45 },
  ...seq("k_grass.wav", 10.16, 4, 0.12, 0.4),
  { file: "swish.wav", at: 10.75, v: 0.45 },
  { file: "no.wav", at: 11.4, v: 0.3 },
  { file: "k_bong.wav", at: 14.56, v: 0.45 },
  { file: "whoosh.wav", at: 16.35, v: 0.5 },
  { file: "k_impact_heavy.wav", at: 17.12, v: 0.55 },
  { file: "shimmer.wav", at: 19.36, v: 0.35 },
  ...seq("tick.wav", 20.0, 8, 0.12, 0.45),
  { file: "k_select.wav", at: 21.04, v: 0.6 },
  { file: "whoosh.wav", at: 22.85, v: 0.45 },
  { file: "k_punch.wav", at: 25.06, v: 0.2 },
  { file: "pop.wav", at: 26.6, v: 0.4 },
  { file: "pop.wav", at: 26.9, v: 0.4 },
  { file: "whoosh.wav", at: 28.0, v: 0.45 },
  { file: "k_impact_soft.wav", at: 29.68, v: 0.55 },
  { file: "swish.wav", at: 30.35, v: 0.45 },
  ...seq("k_error.wav", 30.7, 5, 0.4, 0.3),
  { file: "yes.wav", at: 32.7, v: 0.45 },
  { file: "k_metal_light.wav", at: 34.4, v: 0.55 },
  { file: "whoosh.wav", at: 35.15, v: 0.45 },
  { file: "k_impact_heavy.wav", at: 36.16, v: 0.6 },
  { file: "alert.wav", at: 37.6, v: 0.25 },
  ...seq("k_grass.wav", 37.7, 5, 0.1, 0.4),
  { file: "k_bong.wav", at: 40.96, v: 0.35 },
  { file: "swish.wav", at: 41.35, v: 0.45 },
  { file: "k_card_place.wav", at: 43.68, v: 0.6 },
  { file: "k_card_place.wav", at: 44.96, v: 0.6 },
  { file: "whoosh.wav", at: 45.45, v: 0.45 },
  { file: "pop.wav", at: 48.48, v: 0.45 },
  { file: "pop.wav", at: 49.28, v: 0.45 },
  { file: "pop.wav", at: 50.08, v: 0.45 },
  { file: "no.wav", at: 52.56, v: 0.3 },
  { file: "k_drop.wav", at: 54.24, v: 0.5 },
  { file: "swish.wav", at: 54.75, v: 0.45 },
  { file: "k_select.wav", at: 56.32, v: 0.6 },
  { file: "paper.wav", at: 57.28, v: 0.45 },
  { file: "k_error.wav", at: 58.88, v: 0.35 },
  { file: "k_switch.wav", at: 59.2, v: 0.5 },
  { file: "shimmer.wav", at: 60.32, v: 0.35 },
  { file: "whoosh.wav", at: 62.4, v: 0.4 },
  { file: "whoosh.wav", at: 64.45, v: 0.45 },
  { file: "k_chips.wav", at: 66.08, v: 0.55 },
  { file: "k_metal_light.wav", at: 66.1, v: 0.45 },
  { file: "k_error.wav", at: 67.4, v: 0.35 },
  { file: "k_error.wav", at: 69.3, v: 0.35 },
  { file: "whoosh.wav", at: 70.13, v: 0.5 },
  { file: "tap.wav", at: 71.5, v: 0.5 },
  { file: "yes.wav", at: 71.58, v: 0.55 },
  { file: "ding.wav", at: 73.0, v: 0.25 },
];

export type Video13Props = { sfx: boolean; sfxGain: number };
export const Video13: React.FC<Video13Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: T.paper }}>
      {SCENES.map(([C, a, b], i) => (
        <Sequence key={i} from={Math.round(a * fps)} durationInFrames={Math.round((b + 0.6) * fps) - Math.round(a * fps)} name={`cena ${i + 1}`}>
          <C />
        </Sequence>
      ))}
      <Sequence durationInFrames={Math.round(AUDIO13 * fps)} name="acabamento">
        <Finish vignette="rgba(2,8,18,0.55)" grain={0.05} />
      </Sequence>
      <Captions words={WORDS} maxChars={40} until={AUDIO13 + 0.1} st={{ font: T.sans, size: 40, weight: 700, color: T.ink, active: T.carn, y: 1000, maxWidth: 1500, pill: { bg: "rgba(10,26,47,0.72)", edge: T.edge }, tone }} />
      <Sequence from={Math.round(AUDIO13 * fps)} name="fecho · perfil">
        <ProfileOutro from={AUDIO13} tap={71.5} bg={<Bg13 />} title={[{ w: "Seja", at: AUDIO13 + 0.1 }, { w: "carnívoro.", at: AUDIO13 + 0.3, color: T.carn, italic: true }]} sub="Siga para mais estratégia de vendas" font={T.serif} subFont={T.sans} ink={T.ink} dim={T.dim} accent={T.turqDeep} titleSize={100} />
      </Sequence>
      <Audio src={staticFile("narracao13.m4a")} />
      {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
    </AbsoluteFill>
  );
};
