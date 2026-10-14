import React from "react";
import { Composition } from "remotion";
import { Explicativo, ExplicativoProps } from "./Explicativo";
import { AUDIO_SECONDS } from "./timeline";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Explicativo"
    component={Explicativo}
    durationInFrames={Math.round(AUDIO_SECONDS * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sfx: true, sfxGain: 1 } satisfies ExplicativoProps}
  />
);
