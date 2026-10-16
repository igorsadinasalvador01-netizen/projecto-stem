import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { Captions, Cue, Finish, Mix, ProfileOutro, seq, SfxTrack, Word } from "../kit/Kit";
import { loadFonts2 } from "../kit/fonts2";
import mixJson from "./mix15.json";
import { Bg15, Conclusion, Intro, PAIRS, PairScene, Social } from "./Scenes15";
import { T15 as T } from "./theme15";
import wordsJson from "./words15.json";

loadFonts();
loadFonts2();

// Vídeo 15 — "5 palavras proibidas" (horizontal 1920×1080). Narração original intacta
// (public/narracao15.m4a, 56,31 s). A própria narração pede "siga o meu perfil" (50,6 s):
// o fecho com o perfil original entra aí e ocupa o silêncio final.
export const TOTAL15 = 56.31;
const OUTRO15 = 50.45;
const WORDS = wordsJson as Word[];
const SCENES: [React.FC, number, number][] = [
  [Intro, 0, 3.3],
  ...PAIRS.map((P, i): [React.FC, number, number] => [() => <PairScene pair={P} />, P.from, PAIRS[i + 1]?.from ?? 40.7]),
  [Conclusion, 40.7, 46.0],
  [Social, 46.0, OUTRO15],
];
const NEG = ["desconto.", "barato!", "promoção", "agora,", "melhor,", "genérico", "desvaloriza", "saturada", "agressivo", "afastar"];
const POS = ["exclusiva,", "acessível,", "oportunidade", "limitada", "experimente,", "reconhecido", "milhares,", "convencem.", "decolar.", "premium."];
const tone = (w: string) => {
  const k = w.toLowerCase();
  if (NEG.includes(k)) return "#D9877D";
  if (POS.includes(k)) return T.champagne;
  return undefined;
};

const CUES: Cue[] = [
  { file: "swell.wav", at: 0, v: 0.4 },
  ...seq("k_card_slide.wav", 0.1, 5, 0.09, 0.35),
  { file: "stamp.wav", at: 1.92, v: 0.6 },
  ...PAIRS.flatMap((P) => [
    { file: "k_card_slide.wav", at: P.from + 0.02, v: 0.5 },
    { file: "k_card_place.wav", at: P.from + 0.4, v: 0.45 },
    ...P.why.map(([, at]) => ({ file: "k_error.wav", at, v: 0.3 })),
    { file: "swish.wav", at: P.flip, v: 0.5 },
    { file: "k_card_place.wav", at: P.flip + 0.5, v: 0.45 },
    { file: "shimmer.wav", at: P.flip + 0.45, v: 0.3 },
    ...P.gain.map(([, at]) => ({ file: "k_select.wav", at, v: 0.5 })),
  ]),
  { file: "k_card_fan.wav", at: 40.85, v: 0.5 },
  { file: "k_glass_light.wav", at: 43.44, v: 0.5 },
  { file: "riser.wav", at: 44.9, v: 0.35 },
  { file: "yes.wav", at: 45.52, v: 0.45 },
  { file: "whoosh.wav", at: 46.0, v: 0.45 },
  { file: "pop.wav", at: 46.88, v: 0.5 },
  { file: "swish.wav", at: 47.36, v: 0.45 },
  ...[48.48, 48.88, 49.52].map((at) => ({ file: "k_select.wav", at, v: 0.45 })),
  { file: "whoosh.wav", at: OUTRO15, v: 0.5 },
  { file: "tap.wav", at: 51.3, v: 0.5 },
  { file: "yes.wav", at: 51.38, v: 0.55 },
  { file: "ding.wav", at: 53.0, v: 0.3 },
];

export type Video15Props = { sfx: boolean; sfxGain: number };
export const Video15: React.FC<Video15Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: T.base }}>
      {SCENES.map(([C, a, b], i) => (
        <Sequence key={i} from={Math.round(a * fps)} durationInFrames={Math.round((b + 0.6) * fps) - Math.round(a * fps)} name={`cena ${i + 1}`}>
          <C />
        </Sequence>
      ))}
      <Sequence durationInFrames={Math.round(OUTRO15 * fps)} name="acabamento">
        <Finish vignette="rgba(0,0,0,0.6)" grain={0.06} />
      </Sequence>
      <Captions words={WORDS} maxChars={40} until={OUTRO15} st={{ font: T.body, size: 38, weight: 800, color: T.ink, active: T.champagne, y: 1000, maxWidth: 1500, pill: { bg: "rgba(11,11,12,0.7)", edge: T.edge }, tone }} />
      <Sequence from={Math.round(OUTRO15 * fps)} name="fecho · perfil">
        <ProfileOutro from={OUTRO15} tap={51.3} bg={<Bg15 />} title={[{ w: "Siga", at: 50.64 }, { w: "o perfil.", at: 50.96, color: T.champagne }]} titleSize={92} sub="dicas de vendas, empreendedorismo e carreira" font={T.serif} subFont={T.body} ink={T.ink} dim={T.dim} accent={T.champagneDeep} />
      </Sequence>
      <Audio src={staticFile("narracao15.m4a")} />
      {sfx && <SfxTrack cues={CUES} mix={mixJson as Mix} gain={sfxGain} />}
    </AbsoluteFill>
  );
};
