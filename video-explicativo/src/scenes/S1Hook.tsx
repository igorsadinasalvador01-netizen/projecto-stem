import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { HITS, SCENES, W } from "../timeline";
import { clamp, SyncedWords, useAt, useBreath } from "../components/Motion";
import { Padlock3D } from "../components/Padlock3D";
import { ContactShadow } from "../components/Glass";
import { Flash } from "../components/Layers";
import { type } from "../typography";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const HEIGHTS = [0.34, 0.46, 0.42, 0.6, 0.7, 0.82, 1];

// Barras de vendas dos 7 dias: sobem com "todos os dias".
const WeekBars: React.FC<{ startAt: number; per: number }> = ({ startAt, per }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxH = 196;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 26 }}>
      {DAYS.map((d, i) => {
        const p = spring({ frame: frame - startAt - i * per, fps, config: theme.spring.bouncy });
        const h = maxH * HEIGHTS[i] * p;
        const last = i === DAYS.length - 1;
        return (
          <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 86,
                height: maxH,
                display: "flex",
                alignItems: "flex-end",
                opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: Math.max(h, 10),
                  borderRadius: 22,
                  background: last
                    ? `linear-gradient(180deg, ${theme.colors.primaryLight}, ${theme.colors.primary} 40%, ${theme.colors.primaryDeep})`
                    : `linear-gradient(180deg, ${theme.colors.glassTop}, ${theme.colors.pieceTint})`,
                  border: `1.5px solid ${last ? theme.colors.primaryLight : theme.colors.stroke}`,
                  boxShadow: last
                    ? `0 0 50px ${theme.colors.glow}, inset 0 2px 0 ${theme.colors.strokeStrong}`
                    : `inset 0 2px 0 ${theme.colors.stroke}`,
                }}
              />
            </div>
            <div
              style={{
                ...type.mono,
                fontSize: 22,
                color: last ? theme.colors.text : theme.colors.textDim,
                opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
              }}
            >
              {d}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES.hook.from);
  const hit = at(HITS.hookImpact);
  const breath = useBreath(1.2);

  // Saída em "scale-through" ancorada no impacto do áudio original.
  const out = interpolate(frame, [hit + 2, hit + 0.42 * fps], [0, 1], { easing: theme.ease.in, ...clamp });
  const dim = { color: theme.colors.textDim, fontFamily: theme.fonts.body, fontWeight: 500 } as const;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${1 + out * 0.22})`,
        opacity: 1 - out,
        filter: `blur(${out * 14}px)`,
      }}
    >
      {/* Cadeado 3D */}
      <AbsoluteFill style={{ top: 70, height: 900 }}>
        <Padlock3D width={1080} height={900} dropAt={0} unlockAt={hit - 1} glowAt={at(W.segredo)} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 862, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ContactShadow width={520} opacity={interpolate(frame, [0, 0.5 * fps], [0, 0.9], clamp)} />
      </div>

      {/* Texto sincronizado com a voz */}
      <div
        style={{
          position: "absolute",
          top: 925,
          left: 70,
          right: 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${breath.float}px)`,
        }}
      >
        <SyncedWords
          style={{ ...dim, fontSize: 54 }}
          words={[
            { text: "Quer", at: at(W.quer) },
            { text: "saber", at: at(W.saber) },
            { text: "o", at: at(W.o) },
          ]}
        />
        <SyncedWords
          style={{ ...type.impact, fontSize: 214, lineHeight: 0.92, marginTop: 4 }}
          rise={60}
          words={[{ text: "segredo", at: at(W.segredo) }]}
        />
        <SyncedWords
          style={{ ...dim, fontSize: 50, marginTop: 18 }}
          gap={14}
          words={[
            { text: "de", at: at(W.de) },
            { text: "quem", at: at(W.quem) },
            { text: "faz", at: at(W.faz) },
            { text: "vendas", at: at(W.vendas), style: { color: theme.colors.text, fontWeight: 600 } },
          ]}
        />
        <SyncedWords
          style={{ ...type.impact, fontSize: 124, marginTop: 6 }}
          gap={26}
          rise={44}
          words={[
            { text: "todos", at: at(W.todos) },
            { text: "os", at: at(W.os) },
            { text: "dias?", at: at(W.dias) },
          ]}
        />
      </div>

      {/* Gráfico da semana */}
      <div style={{ position: "absolute", top: 1455, left: 0, right: 0 }}>
        <WeekBars startAt={at(W.todos) - 3} per={Math.round(0.09 * fps)} />
      </div>

      <Flash at={hit} strength={0.35} color={theme.colors.glow} />
    </AbsoluteFill>
  );
};
