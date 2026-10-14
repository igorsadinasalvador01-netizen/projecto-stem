import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SCENES, W } from "../timeline";
import { clamp, Rise, SyncedWords, useAt } from "../components/Motion";
import { Phone } from "../components/Phone";
import { Glass } from "../components/Glass";
import { IconEye } from "../components/Icons";
import { type } from "../typography";

export const S3Diferenca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES.diferenca.from);
  const exitAt = durationInFrames - Math.round((theme.exitSeconds + 0.08) * fps);

  // Fase A: tipografia ao centro. Fase B ("quando..."): sobe e dá lugar ao telemóvel.
  const moveAt = at(W.quando) - Math.round(0.12 * fps);
  const move = interpolate(frame, [moveAt, moveAt + 0.6 * fps], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const exitP = interpolate(frame, [exitAt, exitAt + theme.exitSeconds * fps], [0, 1], {
    easing: theme.ease.in,
    ...clamp,
  });
  const underline = interpolate(frame, [at(W.nao) - 2, at(W.desistiram) + 0.5 * fps], [0, 1], {
    easing: theme.ease.out,
    ...clamp,
  });

  // Um vídeo publicado atrás do outro, enquanto a narração continua.
  const first = at(W.ninguem);
  const step = Math.round(0.13 * fps);
  const tilesAt = Array.from({ length: 12 }, (_, i) => first + i * step);

  return (
    <AbsoluteFill>
      {/* Tipografia principal */}
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: interpolate(move, [0, 1], [700, 170]),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${interpolate(move, [0, 1], [1, 0.6])})`,
          transformOrigin: "50% 0%",
          opacity: 1 - exitP,
        }}
      >
        <SyncedWords
          style={{ ...type.display, fontSize: 150, letterSpacing: "-0.05em", lineHeight: 1 }}
          gap={30}
          rise={70}
          words={[
            { text: "A", at: at(W.a1) },
            { text: "diferença", at: at(W.diferenca) },
          ]}
        />
        <SyncedWords
          style={{ ...type.body, fontSize: 58, marginTop: 40 }}
          gap={16}
          words={[
            { text: "é", at: at(W.e) },
            { text: "que", at: at(W.que) },
            { text: "eles", at: at(W.eles2) },
          ]}
        />
        <div style={{ position: "relative", marginTop: 14, padding: "6px 30px 14px" }}>
          {/* marcador turquesa a varrer por trás da frase */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              borderRadius: 26,
              width: `${underline * 100}%`,
              background: `linear-gradient(100deg, ${theme.colors.primaryDeep}, ${theme.colors.primary})`,
              boxShadow: `0 24px 60px -18px ${theme.colors.glow}, inset 0 2px 0 ${theme.colors.strokeStrong}`,
            }}
          />
          <SyncedWords
            style={{ ...type.impact, fontSize: 156, position: "relative" }}
            gap={34}
            rise={56}
            words={[
              { text: "não", at: at(W.nao) },
              { text: "desistiram.", at: at(W.desistiram) },
            ]}
          />
        </div>
        {/* Legenda da fase B */}
        <div style={{ marginTop: 34 }}>
          <SyncedWords
            style={{ ...type.body, fontSize: 66, color: theme.colors.textSoft }}
            gap={18}
            words={[
              { text: "quando", at: at(W.quando) },
              { text: "ninguém", at: at(W.ninguem), style: { ...type.impact, fontSize: 92 } },
              { text: "assistia", at: at(W.assistia) },
              { text: "aos", at: at(W.aos) },
              { text: "vídeos", at: at(W.videos) },
              { text: "deles.", at: at(W.deles) },
            ]}
          />
        </div>
      </div>

      {/* Telemóvel 3D com publicações e zero visualizações */}
      <div style={{ position: "absolute", left: (1080 - 560) / 2 + 30, top: 640 }}>
        <Phone enterAt={moveAt + 2} tilesAt={tilesAt} exitAt={exitAt} />
      </div>

      {/* Etiqueta flutuante: 0 visualizações */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 1180,
          opacity: 1 - exitP,
          transform: `translateY(${Math.sin(frame / fps / 0.7) * 6 - exitP * 80}px)`,
        }}
      >
        <Rise delay={at(W.assistia)} y={40} from={0.8}>
          <Glass radius={32} strong style={{ padding: "22px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, color: theme.colors.text }}>
              <IconEye size={44} stroke={2} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: theme.fonts.display,
                    fontWeight: 700,
                    fontSize: 54,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  0
                </span>
                <span style={{ ...type.mono, fontSize: 18, color: theme.colors.textDim }}>visualizações</span>
              </div>
            </div>
          </Glass>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
