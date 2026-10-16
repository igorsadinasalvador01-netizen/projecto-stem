import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, ProfileOutro, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import { PRODUCT_AT } from "./Carousel3D";
import mixJson from "./mix14.json";
import { Bg14, S1, S2, S3, S4, S5, S6, S7, S8 } from "./Scenes14";
import { T14 as T } from "./theme14";
import wordsJson from "./words14.json";

loadFonts();
loadFonts2();

// Vídeo 14 — "Vender qualquer coisa" (vertical 1080×1920). Narração original intacta
// (public/narracao14.m4a, 57,96 s) + 3,6 s de fecho com o perfil original.
export const AUDIO14 = 57.96;
export const TOTAL14 = 61.56;
const WORDS = wordsJson as Word[];
const SCENES: [React.FC, number, number][] = [
  [S1, 0, 5.2],
  [S2, 5.2, 10.2],
  [S3, 10.2, 15.6],
  [S4, 15.6, 28.9],
  [S5, 28.9, 41.3],
  [S6, 41.3, 45.6],
  [S7, 45.6, 53.4],
  [S8, 53.4, AUDIO14],
];
const POS = ["preparado", "mentalidade", "roteiro", "assertiva.", "benefício", "vantagens"];
const tone = (w: string) => (POS.includes(w.toLowerCase()) ? T.sage : undefined);
const ITEM_SFX = ["k_metal_light.wav", "k_click.wav", "paper.wav", "k_wood.wav", "k_switch.wav", "k_key.wav", "k_impact_soft.wav", "k_chips.wav"];

const CUES: Cue[] = [
  { file: "swell.wav", at: 0, v: 0.4 },
  { file: "whoosh.wav", at: 0.15, v: 0.5 },
  { file: "k_select.wav", at: 1.84, v: 0.5 },
  { file: "swish.wav", at: 2.9, v: 0.45 },
  { file: "k_switch.wav", at: 3.76, v: 0.4 },
  { file: "yes.wav", at: 4.8, v: 0.5 },
  { file: "whoosh.wav", at: 5.2, v: 0.45 },
  { file: "k_bong.wav", at: 5.68, v: 0.4 },
  { file: "k_metal_light.wav", at: 7.55, v: 0.6 },
  { file: "k_switch.wav", at: 7.6, v: 0.45 },
  { file: "shimmer.wav", at: 8.6, v: 0.4 },
  { file: "k_glass_light.wav", at: 9.92, v: 0.5 },
  { file: "swish.wav", at: 10.2, v: 0.45 },
  ...seq("k_click.wav", 10.9, 5, 0.28, 0.5),
  ...seq("pop.wav", 13.6, 7, 0.13, 0.4),
  { file: "k_select.wav", at: 14.88, v: 0.5 },
  { file: "whoosh.wav", at: 15.6, v: 0.5 },
  { file: "swell.wav", at: 15.8, v: 0.3 },
  ...PRODUCT_AT.slice(1).map((a) => ({ file: "k_card_slide.wav", at: a - 0.32, v: 0.4 })),
  ...PRODUCT_AT.map((a, i) => ({ file: ITEM_SFX[i], at: a, v: 0.55 })),
  { file: "riser.wav", at: 27.3, v: 0.4 },
  { file: "whoosh.wav", at: 28.4, v: 0.45 },
  { file: "swish.wav", at: 28.85, v: 0.45 },
  ...[31.28, 32.48, 35.44, 37.28].map((a) => ({ file: "yes.wav", at: a + 0.1, v: 0.4 })),
  { file: "k_glass_light.wav", at: 37.95, v: 0.5 },
  { file: "ding.wav", at: 39.76, v: 0.3 },
  { file: "swish.wav", at: 41.3, v: 0.45 },
  ...seq("tick.wav", 41.4, 6, 0.1, 0.4),
  { file: "k_select.wav", at: 42.2, v: 0.5 },
  { file: "k_glass_med.wav", at: 43.1, v: 0.3 },
  { file: "whoosh.wav", at: 43.44, v: 0.45 },
  { file: "k_impact_heavy.wav", at: 43.9, v: 0.4 },
  { file: "yes.wav", at: 44.64, v: 0.45 },
  { file: "swish.wav", at: 45.55, v: 0.45 },
  ...[48.4, 50.48, 52.24].map((a) => ({ file: "k_card_place.wav", at: a - 0.1, v: 0.55 })),
  { file: "whoosh.wav", at: 53.4, v: 0.45 },
  ...seq("k_click.wav", 54.0, 3, 0.18, 0.5),
  { file: "ding.wav", at: 55.84, v: 0.3 },
  { file: "whoosh.wav", at: AUDIO14, v: 0.5 },
  { file: "tap.wav", at: AUDIO14 + 1.4, v: 0.5 },
  { file: "yes.wav", at: AUDIO14 + 1.48, v: 0.55 },
  { file: "ding.wav", at: AUDIO14 + 3.0, v: 0.25 },
];

export type Video14Props = { sfx: boolean; sfxGain: number };
export const Video14: React.FC<Video14Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: T.base }}>
      {SCENES.map(([C, a, b], i) => (
        <Sequence key={i} from={Math.round(a * fps)} durationInFrames={Math.round((b + 0.6) * fps) - Math.round(a * fps)} name={`cena ${i + 1}`}>
          <C />
        </Sequence>
      ))}
      <Sequence durationInFrames={Math.round(AUDIO14 * fps)} name="acabamento">
        <Finish vignette="rgba(2,8,18,0.55)" grain={0.05} />
      </Sequence>
      <Captions words={WORDS} maxChars={26} until={AUDIO14 + 0.1} st={{ font: T.body, size: 50, weight: 800, color: T.ink, active: T.steel, y: 1600, pill: { bg: "rgba(10,26,47,0.72)", edge: "rgba(255,255,255,0.16)" }, tone }} />
      <Sequence from={Math.round(AUDIO14 * fps)} name="fecho · perfil">
        <ProfileOutro from={AUDIO14} tap={AUDIO14 + 1.4} bg={<Bg14 />} title={[{ w: "Siga", at: AUDIO14 + 0.1 }, { w: "o perfil", at: AUDIO14 + 0.3, color: T.steel }]} sub="roteiro de vendas para qualquer produto" font={T.display} subFont={T.body} ink={T.ink} dim={T.dim} accent="#147A88" />
      </Sequence>
      <Audio src={staticFile("narracao14.m4a")} />
      {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
    </AbsoluteFill>
  );
};
