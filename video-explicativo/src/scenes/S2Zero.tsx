import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SCENES, W } from "../timeline";
import { clamp, SyncedWords, useAt, useBreath } from "../components/Motion";
import { Glass } from "../components/Glass";
import { IconBriefcase, IconUsers, IconWallet } from "../components/Icons";
import { type } from "../typography";

type Row = {
  semAt: number;
  wordAt: number;
  word: string;
  value: string;
  unit: string;
  Icon: React.FC<{ size?: number; stroke?: number }>;
};

// Contador que "tenta" subir e volta a assentar em zero.
const ZeroValue: React.FC<{ at: number; value: string }> = ({ at, value }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  return (
    <div style={{ overflow: "hidden", height: 110, display: "flex", alignItems: "center" }}>
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 96,
          letterSpacing: "-0.04em",
          color: theme.colors.text,
          fontVariantNumeric: "tabular-nums",
          transform: `translateY(${interpolate(p, [0, 1], [-110, 0])}px)`,
          opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        }}
      >
        {value}
      </div>
    </div>
  );
};

const Card: React.FC<{ row: Row; index: number; active: boolean; exitAt: number }> = ({
  row,
  index,
  active,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - row.semAt, fps, config: theme.spring.smooth });
  const act = spring({ frame: frame - row.semAt, fps, config: theme.spring.settle });
  const exitP = interpolate(frame, [exitAt + index * 2, exitAt + index * 2 + theme.exitSeconds * fps], [0, 1], {
    easing: theme.ease.in,
    ...clamp,
  });
  const highlight = active ? interpolate(act, [0, 1], [0, 1]) : 0;
  const { Icon } = row;
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${interpolate(p, [0, 1], [-520, 0])}px) translateY(${interpolate(p, [0, 1], [90, 0]) + exitP * 260}px) rotateX(${interpolate(p, [0, 1], [-62, 0]) - exitP * 40}deg)`,
        opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (1 - exitP),
      }}
    >
      <Glass radius={46} strong={active} style={{ width: 900, height: 240 }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 44px", gap: 34 }}>
          <div
            style={{
              width: 124,
              height: 124,
              borderRadius: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active ? theme.colors.text : theme.colors.textSoft,
              background: active
                ? `linear-gradient(150deg, ${theme.colors.primaryLight}, ${theme.colors.primary} 45%, ${theme.colors.primaryDeep})`
                : theme.colors.glassStrong,
              border: `1.5px solid ${active ? theme.colors.primaryLight : theme.colors.stroke}`,
              boxShadow: active ? `0 0 ${46 * highlight}px ${theme.colors.glow}` : "none",
            }}
          >
            <Icon size={60} stroke={2} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <SyncedWords
              style={{ justifyContent: "flex-start" }}
              rise={20}
              words={[
                {
                  text: "sem",
                  at: row.semAt,
                  style: { ...type.mono, fontSize: 26, color: theme.colors.textDim },
                },
              ]}
            />
            <SyncedWords
              style={{ justifyContent: "flex-start" }}
              rise={26}
              words={[
                {
                  text: row.word,
                  at: row.wordAt,
                  style: { ...type.impact, fontSize: 84, lineHeight: 1.02 },
                },
              ]}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <ZeroValue at={row.wordAt + 4} value={row.value} />
            <div
              style={{ ...type.mono, fontSize: 19, marginTop: -4 }}
            >
              {row.unit}
            </div>
          </div>
        </div>
      </Glass>
    </div>
  );
};

export const S2Zero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES.zero.from);
  const breath = useBreath(1.3, 0.8);
  const exitAt = durationInFrames - Math.round((theme.exitSeconds + 0.1) * fps);

  const rows: Row[] = [
    { semAt: at(W.sem1), wordAt: at(W.experiencia), word: "experiência", value: "0", unit: "anos", Icon: IconBriefcase },
    { semAt: at(W.sem2), wordAt: at(W.seguidores), word: "seguidores", value: "0", unit: "seguidores", Icon: IconUsers },
    { semAt: at(W.sem3), wordAt: at(W.dinheiro), word: "dinheiro", value: "0,00", unit: "saldo", Icon: IconWallet },
  ];
  const activeIndex = rows.reduce((acc, r, i) => (frame >= r.semAt ? i : acc), -1);

  const titleOut = interpolate(frame, [exitAt, exitAt + theme.exitSeconds * fps], [0, 1], {
    easing: theme.ease.in,
    ...clamp,
  });
  // Rotação lenta da pilha: dá profundidade 3D real aos cartões.
  const ry = interpolate(frame, [0, durationInFrames], [-13, -6], { easing: theme.ease.inOut, ...clamp });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 60,
          right: 60,
          opacity: 1 - titleOut,
          transform: `translateY(${-titleOut * 60}px)`,
        }}
      >
        <SyncedWords
          style={{ ...type.display, fontSize: 104 }}
          gap={26}
          rise={50}
          words={[
            { text: "Eles", at: at(W.eles) },
            { text: "começaram", at: at(W.comecaram) },
          ]}
        />
      </div>

      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 40%" }}>
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 90,
            width: 900,
            display: "flex",
            flexDirection: "column",
            gap: 54,
            transformStyle: "preserve-3d",
            transform: `rotateX(12deg) rotateY(${ry}deg) rotateZ(-1.5deg) translateY(${breath.float}px)`,
          }}
        >
          {rows.map((r, i) => (
            <Card key={r.word} row={r} index={i} active={i === activeIndex} exitAt={exitAt} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
