import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { clamp } from "./Motion";
import { IconEye, IconPlay } from "./Icons";

const W = 560;
const H = 1140;
const R = 84;
const BEZEL = 16;

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div
      style={{
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: 34,
        color: theme.colors.text,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    <div style={{ fontFamily: theme.fonts.body, fontSize: 17, color: theme.colors.textDim }}>{label}</div>
  </div>
);

const Tile: React.FC<{ at: number; index: number }> = ({ at, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  const hue = [0.1, 0.16, 0.07, 0.13][index % 4];
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "3 / 4",
        borderRadius: 14,
        overflow: "hidden",
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        background: `linear-gradient(${150 + index * 23}deg, rgba(255,255,255,${hue}), ${theme.colors.glass} 55%, ${theme.colors.pieceDark})`,
        border: `1px solid ${theme.colors.stroke}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 90,
          height: 90,
          borderRadius: "50%",
          left: 20 + ((index * 37) % 60),
          top: 18 + ((index * 53) % 70),
          background: `radial-gradient(circle, ${theme.colors.whiteMist}, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textSoft,
        }}
      >
        <IconPlay size={30} stroke={2} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 10,
          bottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: theme.colors.textSoft,
          fontFamily: theme.fonts.body,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        <IconEye size={18} stroke={2.2} />0
      </div>
    </div>
  );
};

// Telemóvel em CSS 3D (perspetiva real, espessura em camadas, reflexo a deslizar).
export const Phone: React.FC<{
  enterAt: number;
  tilesAt: number[];
  exitAt: number;
}> = ({ enterAt, tilesAt, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = spring({ frame: frame - enterAt, fps, config: theme.spring.heavy });
  const exitP = interpolate(frame, [exitAt, exitAt + theme.exitSeconds * fps], [0, 1], {
    easing: theme.ease.in,
    ...clamp,
  });
  const ry = interpolate(p, [0, 1], [-34, -12]) + Math.sin(t * 0.9) * 2.5;
  const rx = interpolate(p, [0, 1], [24, 7]) + Math.cos(t * 0.7) * 1.2;
  const ty = interpolate(p, [0, 1], [1300, 0]) + exitP * 1400;
  const posted = tilesAt.filter((a) => frame >= a).length;
  const sweep = interpolate(frame, [enterAt + 0.4 * fps, enterAt + 2.2 * fps], [-120, 140], {
    easing: theme.ease.inOut,
    ...clamp,
  });

  const edge = (z: number, shade: string) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: R,
        transform: `translateZ(${z}px)`,
        background: shade,
      }}
    />
  );

  return (
    <div style={{ perspective: 2200, width: W, height: H }}>
      <div
        style={{
          position: "relative",
          width: W,
          height: H,
          transformStyle: "preserve-3d",
          opacity: interpolate(p, [0, 0.08], [0, 1], clamp),
          transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${interpolate(p, [0, 1], [6, 1.5])}deg)`,
        }}
      >
        {/* espessura */}
        {edge(-22, theme.colors.pieceDeep)}
        {edge(-16, theme.colors.metalDark)}
        {edge(-10, theme.colors.piece)}
        {edge(-4, theme.colors.metalDark)}
        {/* moldura metálica */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: R,
            background: `linear-gradient(135deg, ${theme.colors.chrome} 0%, ${theme.colors.metalDark} 18%, ${theme.colors.piece} 50%, ${theme.colors.metalDark} 82%, ${theme.colors.textDim} 100%)`,
            boxShadow: `0 80px 120px -30px ${theme.colors.shadowDeep}`,
          }}
        />
        {/* ecrã */}
        <div
          style={{
            position: "absolute",
            inset: BEZEL,
            borderRadius: R - BEZEL,
            overflow: "hidden",
            background: `linear-gradient(180deg, ${theme.colors.piece}, ${theme.colors.pieceDark} 40%)`,
          }}
        >
          {/* ilha dinâmica */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: "50%",
              width: 150,
              height: 42,
              marginLeft: -75,
              borderRadius: 22,
              background: theme.colors.pieceDeep,
              border: `1px solid ${theme.colors.whiteMist}`,
            }}
          />
          <div style={{ position: "absolute", top: 92, left: 28, right: 28 }}>
            {/* cabeçalho do perfil */}
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: `linear-gradient(140deg, ${theme.colors.glassTop}, ${theme.colors.glass})`,
                  border: `2px solid ${theme.colors.strokeStrong}`,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ width: 210, height: 18, borderRadius: 9, background: theme.colors.glassTop }} />
                <div style={{ width: 140, height: 14, borderRadius: 7, background: theme.colors.glassStrong }} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 34,
                padding: "20px 18px",
                borderRadius: 22,
                background: theme.colors.glass,
                border: `1px solid ${theme.colors.stroke}`,
              }}
            >
              <Stat value={String(posted)} label="publicações" />
              <Stat value="0" label="seguidores" />
              <Stat value="0" label="visualizações" />
            </div>
            {/* grelha de vídeos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                marginTop: 28,
              }}
            >
              {tilesAt.map((a, i) => (
                <Tile key={i} at={a} index={i} />
              ))}
            </div>
          </div>
          {/* reflexo de vidro a deslizar */}
          <div
            style={{
              position: "absolute",
              inset: -200,
              background: `linear-gradient(115deg, transparent 42%, ${theme.colors.glass} 48%, ${theme.colors.glassStrong} 50%, transparent 56%)`,
              transform: `translateX(${sweep}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const PHONE_SIZE = { width: W, height: H };
