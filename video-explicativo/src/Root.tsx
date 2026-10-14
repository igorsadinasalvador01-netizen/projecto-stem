import React from "react";
import { Composition } from "remotion";
import { Explicativo, ExplicativoProps } from "./Explicativo";
import { AUDIO_SECONDS } from "./timeline";
import { Explicativo2, Explicativo2Props } from "./v2/Explicativo2";
import { AUDIO2_SECONDS } from "./v2/timeline2";
import { Explicativo3, Explicativo3Props } from "./v3/Explicativo3";
import { AUDIO3_SECONDS } from "./v3/timeline3";
import { Explicativo4, Explicativo4Props } from "./v4/Explicativo4";
import { AUDIO4_SECONDS } from "./v4/timeline4";
import { Explicativo5, Explicativo5Props } from "./v5/Explicativo5";
import { AUDIO5_SECONDS } from "./v5/timeline5";
import { Explicativo6, Explicativo6Props } from "./v6/Explicativo6";
import { AUDIO6_SECONDS } from "./v6/timeline6";
import { Explicativo7, Explicativo7Props } from "./v7/Explicativo7";
import { AUDIO7_SECONDS } from "./v7/timeline7";
import { Explicativo8, Explicativo8Props } from "./v8/Explicativo8";
import { AUDIO8_SECONDS } from "./v8/timeline8";
import { Conteudo9, Conteudo9Props } from "./v9/Conteudo9";
import { TOTAL9 } from "./v9/timeline9";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Explicativo"
    component={Explicativo}
    durationInFrames={Math.round(AUDIO_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 1 } satisfies ExplicativoProps}
  />
  <Composition
    id="Explicativo2"
    component={Explicativo2}
    durationInFrames={Math.round(AUDIO2_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 0.75 } satisfies Explicativo2Props}
  />
  <Composition
    id="Explicativo3"
    component={Explicativo3}
    durationInFrames={Math.round(AUDIO3_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 0.85 } satisfies Explicativo3Props}
  />
  <Composition
    id="Explicativo4"
    component={Explicativo4}
    durationInFrames={Math.round(AUDIO4_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 2.2 } satisfies Explicativo4Props}
  />
  <Composition
    id="Explicativo5"
    component={Explicativo5}
    durationInFrames={Math.round(AUDIO5_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 5 } satisfies Explicativo5Props}
  />
  <Composition
    id="Explicativo6"
    component={Explicativo6}
    durationInFrames={Math.round(AUDIO6_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 3.8 } satisfies Explicativo6Props}
  />
  <Composition
    id="Explicativo7"
    component={Explicativo7}
    durationInFrames={Math.round(AUDIO7_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 3.8 } satisfies Explicativo7Props}
  />
  <Composition
    id="Explicativo8"
    component={Explicativo8}
    durationInFrames={Math.round(AUDIO8_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 3.8 } satisfies Explicativo8Props}
  />
  <Composition
    id="Conteudo9"
    component={Conteudo9}
    durationInFrames={Math.round(TOTAL9 * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 4 } satisfies Conteudo9Props}
  />
  </>
);
