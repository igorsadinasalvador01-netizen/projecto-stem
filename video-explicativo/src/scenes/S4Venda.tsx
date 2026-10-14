import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { HITS, SCENES, W } from "../timeline";
import { clamp, Rise, SyncedWords, useAt, useBreath } from "../components/Motion";
import { Glass } from "../components/Glass";
import { IconArrow, IconCheck } from "../components/Icons";
import { Seal3D } from "../components/Seal3D";
import { Flash } from "../components/Layers";
import { type } from "../typography";

const CARD_W = 800;
const CARD_H = 460;
const STRIP = 96; // quanto de cada carta de trás fica à vista
const CARDS = [
  { title: "Próxima tentativa", n: "04" },
  { title: "Tentativa 3", n: "03" },
  { title: "Tentativa 2", n: "02" },
  { title: "Tentativa 1", n: "01" },
];

// Baralho de tentativas em 3D. A venda está escondida atrás da carta da frente.
const Deck: React.FC<{
  enterAt: number;
  hideAt: number;
  peekAt: number;
  focusAt: number;
  boomAt: number;
}> = ({ enterAt, hideAt, peekAt, focusAt, boomAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const hidden = interpolate(frame, [hideAt, boomAt], [0, 1], { easing: theme.ease.soft, ...clamp });
  const pulse = 0.85 + Math.sin(t * 9) * 0.15 * interpolate(frame, [focusAt, boomAt], [0, 1], clamp);
  const peek = interpolate(frame, [peekAt, boomAt - 2], [0, 1], { easing: theme.ease.inOut, ...clamp });
  // Reação ao impacto: arranque explosivo (ease-out), não um fade lento.
  const fly = interpolate(frame, [boomAt, boomAt + 0.3 * fps], [0, 1], { easing: theme.ease.out, ...clamp });
  const focus = spring({ frame: frame - focusAt, fps, config: theme.spring.settle });

  return (
    <div style={{ perspective: 1900, perspectiveOrigin: "50% 20%", width: CARD_W, height: CARD_H }}>
      <div
        style={{
          position: "relative",
          width: CARD_W,
          height: CARD_H,
          transformStyle: "preserve-3d",
          transform: `rotateX(14deg) rotateY(${-7 + Math.sin(t * 0.8) * 2}deg)`,
        }}
      >
        {/* a luz da venda escondida: entre a carta da frente e as outras, vaza pelas margens */}
        <div
          style={{
            position: "absolute",
            inset: -70,
            borderRadius: 110,
            transform: "translateZ(-60px)",
            background: `radial-gradient(ellipse at center, ${theme.colors.primaryLight} 0%, ${theme.colors.primary} 34%, ${theme.colors.glowSoft} 58%, transparent 74%)`,
            opacity: hidden * pulse * (1 - fly),
            filter: "blur(22px)",
          }}
        />
        {CARDS.map((c, i) => {
          const order = CARDS.length - 1 - i; // as de trás entram primeiro
          const p = spring({ frame: frame - enterAt - order * 4, fps, config: theme.spring.smooth });
          const front = i === 0;
          const scatter = interpolate(frame, [boomAt + i, boomAt + i + 0.36 * fps], [0, 1], {
            easing: theme.ease.out,
            ...clamp,
          });
          const dir = i % 2 === 0 ? 1 : -1;
          const enterY = interpolate(p, [0, 1], [700, 0]);
          const enterRX = interpolate(p, [0, 1], [50, 0]);
          const transform = front
            ? `translateY(${enterY - peek * 30 - fly * 1300}px) translateZ(${fly * 380}px) rotateX(${enterRX - peek * 12 - fly * 95}deg)`
            : `translateY(${-STRIP * i + enterY}px) translateZ(${-110 * i - scatter * 300}px) translateX(${scatter * dir * (420 + i * 80)}px) rotateX(${enterRX}deg) rotateZ(${scatter * dir * 18}deg)`;
          const opacity =
            interpolate(p, [0, 0.35], [0, 1], clamp) *
            (front ? 1 - interpolate(fly, [0.4, 1], [0, 1], clamp) : (1 - 0.16 * i) * (1 - scatter));
          return (
            <div
              key={c.n}
              style={{
                position: "absolute",
                inset: 0,
                transform,
                opacity,
                filter: front && fly > 0 ? `blur(${fly * 16}px)` : undefined,
              }}
            >
              <Glass
                radius={48}
                strong={front}
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  background: `linear-gradient(165deg, ${front ? theme.colors.glassTop : theme.colors.glassStrong} 0%, ${theme.colors.panel} 38%)`,
                  border: `1.5px solid ${front && focus > 0.5 ? theme.colors.strokeStrong : theme.colors.stroke}`,
                }}
              >
                {/* faixa superior: número + título (é o que se vê das cartas de trás) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: STRIP,
                    padding: "0 40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                    <span style={{ ...type.mono, fontSize: 22 }}>#{c.n}</span>
                    {!front && (
                      <span
                        style={{
                          fontFamily: theme.fonts.display,
                          fontWeight: 600,
                          fontSize: 34,
                          letterSpacing: "-0.02em",
                          color: theme.colors.textDim,
                        }}
                      >
                        {c.title}
                      </span>
                    )}
                  </div>
                  {!front && (
                    <span style={{ ...type.mono, fontSize: 19 }}>0 vendas</span>
                  )}
                </div>
                {front && (
                  <div
                    style={{
                      position: "absolute",
                      left: 46,
                      right: 46,
                      bottom: 44,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: theme.fonts.display,
                        fontWeight: 700,
                        fontSize: 84,
                        letterSpacing: "-0.04em",
                        lineHeight: 0.98,
                        color: theme.colors.text,
                        width: 520,
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        width: 104,
                        height: 104,
                        borderRadius: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.colors.text,
                        background: theme.colors.glassStrong,
                        border: `1.5px solid ${theme.colors.strokeStrong}`,
                        transform: `translateX(${interpolate(focus, [0, 1], [-10, 0]) + Math.sin(t * 6) * 4 * focus}px)`,
                      }}
                    >
                      <IconArrow size={52} stroke={2.2} />
                    </div>
                  </div>
                )}
              </Glass>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Faíscas no "boom": partículas determinísticas a partir do centro do selo.
const Sparks: React.FC<{ at: number; cx: number; cy: number }> = ({ at, cx, cy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = 30;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = interpolate(frame, [at, at + (0.8 + random(`d${i}`) * 0.5) * fps], [0, 1], {
          easing: theme.ease.out,
          ...clamp,
        });
        if (p <= 0 || p >= 1) return null;
        const a = (i / n) * Math.PI * 2 + random(`a${i}`) * 0.4;
        const dist = 240 + random(`r${i}`) * 360;
        const size = 5 + random(`s${i}`) * 9;
        const turq = i % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(a) * dist * p - size / 2,
              top: cy + Math.sin(a) * dist * p - size / 2 + p * p * 60,
              width: size,
              height: size,
              borderRadius: "50%",
              background: turq ? theme.colors.primaryLight : theme.colors.text,
              boxShadow: `0 0 ${size * 2}px ${turq ? theme.colors.glow : theme.colors.strokeStrong}`,
              opacity: 1 - p,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Rays: React.FC<{ at: number; cx: number; cy: number }> = ({ at, cx, cy }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame, [at, at + 0.5 * fps], [0, 1], { easing: theme.ease.out, ...clamp });
  const rot = (frame / fps) * 9;
  const size = 1500;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        opacity: o * 0.5,
        transform: `rotate(${rot}deg) scale(${0.7 + o * 0.3})`,
        background: `repeating-conic-gradient(from 0deg, ${theme.colors.whiteMist} 0deg 4deg, transparent 4deg 18deg)`,
        maskImage: "radial-gradient(circle, black 0%, transparent 62%)",
        WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 62%)",
      }}
    />
  );
};

const Notification: React.FC<{ at: number }> = ({ at }) => {
  const breath = useBreath(1.1, 0.7);
  return (
    <Rise delay={at} y={120} from={0.86} blur={14} config={theme.spring.bouncy}>
      <div style={{ transform: `translateY(${breath.float}px)` }}>
        <Glass radius={46} strong style={{ width: 900, padding: "34px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: 32,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.text,
                background: `linear-gradient(150deg, ${theme.colors.glassTop}, ${theme.colors.glass})`,
                border: `1.5px solid ${theme.colors.strokeStrong}`,
              }}
            >
              <IconCheck size={60} stroke={2.6} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: theme.fonts.display,
                    fontWeight: 700,
                    fontSize: 52,
                    letterSpacing: "-0.03em",
                    color: theme.colors.text,
                  }}
                >
                  Nova venda
                </span>
                <span style={{ ...type.mono, fontSize: 19 }}>agora</span>
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontWeight: 500,
                  fontSize: 34,
                  color: theme.colors.textDim,
                  marginTop: 6,
                }}
              >
                A sua primeira venda chegou.
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </Rise>
  );
};

export const S4Venda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES.venda.from);
  const boom = at(HITS.boom);
  const capOut = interpolate(frame, [boom - 1, boom - 1 + theme.exitSeconds * fps], [0, 1], {
    easing: theme.ease.in,
    ...clamp,
  });
  const sealCx = 540;
  const sealCy = 830;
  const finalAt = at(HITS.silenceFrom) + Math.round(0.5 * fps);

  return (
    <AbsoluteFill>
      {/* Título */}
      <div style={{ position: "absolute", top: 210, left: 60, right: 60 }}>
        <SyncedWords
          style={{ ...type.body, fontSize: 58 }}
          gap={16}
          words={[
            { text: "A", at: at(W.a2) },
            { text: "sua", at: at(W.sua1) },
          ]}
        />
        <SyncedWords
          style={{ ...type.impact, fontSize: 158, lineHeight: 0.96 }}
          gap={30}
          rise={56}
          words={[
            { text: "primeira", at: at(W.primeira) },
            { text: "venda", at: at(W.venda) },
          ]}
        />
      </div>

      {/* Revelação no boom */}
      <Rays at={boom} cx={sealCx} cy={sealCy} />

      <div style={{ position: "absolute", left: (1080 - CARD_W) / 2, top: 760 }}>
        <Deck
          enterAt={at(W.pode) - 2}
          hideAt={at(W.escondida)}
          peekAt={at(W.atras)}
          focusAt={at(W.proxima)}
          boomAt={boom}
        />
      </div>

      <AbsoluteFill style={{ top: sealCy - 380, height: 760, pointerEvents: "none" }}>
        <Seal3D width={1080} height={760} at={boom + 3} />
      </AbsoluteFill>
      <Sparks at={boom} cx={sealCx} cy={sealCy} />

      <div style={{ position: "absolute", left: 90, top: 1250 }}>
        <Notification at={boom + Math.round(0.22 * fps)} />
      </div>

      {/* Legenda sincronizada antes do boom */}
      <div
        style={{
          position: "absolute",
          top: 1330,
          left: 50,
          right: 50,
          opacity: 1 - capOut,
          transform: `translateY(${capOut * 70}px)`,
        }}
      >
        <SyncedWords
          style={{ ...type.body, fontSize: 56 }}
          gap={16}
          words={[
            { text: "pode", at: at(W.pode) },
            { text: "estar", at: at(W.estar) },
            { text: "escondida", at: at(W.escondida), style: { ...type.impact, fontSize: 80 } },
          ]}
        />
        <SyncedWords
          style={{ ...type.display, fontSize: 70, letterSpacing: "-0.035em", marginTop: 10 }}
          gap={20}
          words={[
            { text: "atrás", at: at(W.atras) },
            { text: "da", at: at(W.da) },
            { text: "sua", at: at(W.sua2) },
            { text: "próxima", at: at(W.proxima), style: { ...type.impact, fontSize: 96 } },
            { text: "tentativa.", at: at(W.tentativa), style: { ...type.impact, fontSize: 96 } },
          ]}
        />
      </div>

      {/* Fecho no silêncio final */}
      <div style={{ position: "absolute", top: 1560, left: 50, right: 50 }}>
        <SyncedWords
          style={{ ...type.display, fontSize: 76, letterSpacing: "-0.035em", color: theme.colors.textSoft }}
          gap={20}
          lead={0}
          words={[
            { text: "Poste", at: finalAt },
            { text: "o", at: finalAt + 3 },
            { text: "próximo", at: finalAt + 6, style: { ...type.impact, fontSize: 108 } },
            { text: "vídeo.", at: finalAt + 9 },
          ]}
        />
      </div>

      <Flash at={boom} strength={0.6} />
    </AbsoluteFill>
  );
};
