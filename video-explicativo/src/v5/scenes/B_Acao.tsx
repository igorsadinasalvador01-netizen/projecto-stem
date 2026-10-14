import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { IconCheck, IconPlay } from "../../components/Icons";
import { c5, ease5, springs5, t5 } from "../theme5";
import { HITS5, SCENES5, W5 } from "../timeline5";
import { FilmBurn, Scene5 } from "../Vintage";
import { Memory, Polaroid, SoftWords, Stamp, Typewriter } from "../Props5";

const XIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

// ——— Cena 5: começam, corrigem os erros e continuam melhorando (tira de película) ———
export const S5Filme: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES5.filme.from);
  const FW = 520;
  const GAP = 70;
  const targets = [at(W5.comecam), at(W5.corrigem), at(W5.continuam)];
  // deslocamento da tira para centrar o fotograma ativo
  let x = 0;
  targets.forEach((tg, i) => {
    const p = spring({ frame: frame - tg + 4, fps, config: springs5.settle });
    if (i > 0) x -= p * (FW + GAP);
  });
  const active = targets.reduce((acc, tg, i) => (frame >= tg - 4 ? i : acc), -1);
  const fixP = spring({ frame: frame - at(W5.erros) - 4, fps, config: springs5.drop });
  const growP = interpolate(frame, [at(W5.continuam), at(W5.melhorando) + 0.5 * fps], [0, 1], { easing: ease5.inOut, ...clamp });
  const stripIn = spring({ frame: frame - at(W5.sao2), fps, config: springs5.settle });

  const frames: React.ReactNode[] = [
    <div key="a" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, color: c5.green }}>
      <div style={{ width: 150, height: 150, borderRadius: "50%", border: `8px solid ${c5.green}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IconPlay size={80} stroke={2.4} />
      </div>
      <div style={{ ...t5.label, fontSize: 24, color: c5.green }}>começar</div>
    </div>,
    <div key="b" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <div style={{ position: "absolute", inset: 0, color: c5.red, opacity: 1 - fixP, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - fixP * 0.3})` }}>
          <XIcon size={150} />
        </div>
        <div style={{ position: "absolute", inset: 0, color: c5.green, opacity: fixP, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + fixP * 0.4})` }}>
          <IconCheck size={150} stroke={2.6} />
        </div>
      </div>
      <div style={{ ...t5.label, fontSize: 24, color: fixP > 0.5 ? c5.green : c5.red }}>{fixP > 0.5 ? "corrigido" : "erro"}</div>
    </div>,
    <div key="c" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <svg width={300} height={180} viewBox="0 0 300 180">
        <path d="M 10 160 L 80 120 L 130 135 L 190 80 L 240 60 L 290 15" stroke={c5.green} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${growP} 1`} />
      </svg>
      <div style={{ ...t5.label, fontSize: 24, color: c5.green }}>melhorando</div>
    </div>,
  ];

  return (
    <Scene5 surface="darkroom" enter="burn" origin={[540, 980]}>
      <div style={{ position: "absolute", top: 240, left: 60, right: 60 }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 92, color: c5.creamDim }}
          gap={20}
          words={[
            { text: "são", at: at(W5.sao2) },
            { text: "aquelas", at: at(W5.aquelas2) },
            { text: "que…", at: at(W5.aquelas2) + 8 },
          ]}
        />
      </div>

      {/* tira de película */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 600, opacity: stripIn, transform: `translateY(${(1 - stripIn) * 80}px)` }}>
        <div style={{ position: "absolute", left: -100, right: -100, top: 0, bottom: 0, background: c5.ink, boxShadow: `0 40px 80px ${c5.black}` }}>
          {[24, 600 - 24 - 30].map((top) => (
            <div key={top} style={{ position: "absolute", left: 0, right: 0, top, height: 30, backgroundImage: `repeating-linear-gradient(90deg, ${c5.darkroom} 0 26px, ${c5.paperDeep} 26px 56px, ${c5.darkroom} 56px 72px)`, backgroundPosition: `${x * 0.999}px 0`, opacity: 0.8 }} />
          ))}
        </div>
        {frames.map((fr, i) => {
          const on = i === active;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 - FW / 2 + i * (FW + GAP) + x,
                top: 80,
                width: FW,
                height: 440,
                borderRadius: 10,
                background: `radial-gradient(circle at 50% 45%, ${c5.cream}, ${c5.paperDeep})`,
                opacity: on ? 1 : 0.35,
                filter: on ? "none" : "sepia(0.8) brightness(0.6)",
                boxShadow: on ? `0 0 80px ${c5.darkroomGlow}` : "none",
              }}
            >
              {fr}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 1330, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <SoftWords style={{ ...t5.serifIt, fontSize: 104, color: c5.green }} words={[{ text: "começam,", at: at(W5.comecam) }]} />
        <SoftWords
          style={{ ...t5.serif, fontSize: 92, color: c5.cream }}
          gap={20}
          words={[
            { text: "corrigem", at: at(W5.corrigem) },
            { text: "os", at: at(W5.os) },
            { text: "erros", at: at(W5.erros), style: { ...t5.serifIt, color: c5.redLight } },
          ]}
        />
        <SoftWords
          style={{ ...t5.serif, fontSize: 92, color: c5.cream }}
          gap={20}
          words={[
            { text: "e", at: at(W5.e) },
            { text: "continuam", at: at(W5.continuam) },
            { text: "melhorando.", at: at(W5.melhorando), style: { ...t5.serifIt, color: c5.green } },
          ]}
        />
      </div>
    </Scene5>
  );
};

// ——— Cena 6: a experiência vem depois da ação (carimbos 1 → 2) + boom ———
export const S6Acao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES5.acao.from);
  const boom = at(HITS5.boom);
  const expGhost = spring({ frame: frame - at(W5.experiencia), fps, config: springs5.settle });
  const arrow = interpolate(frame, [at(W5.depois), at(W5.acao) + 4], [0, 1], { easing: ease5.inOut, ...clamp });
  const act = spring({ frame: frame - at(W5.acao), fps, config: springs5.drop });
  const solid = spring({ frame: frame - boom, fps, config: springs5.drop });

  const Card: React.FC<{ n: string; label: string; color: string; solidP: number; dashed?: boolean }> = ({ n, label, color, solidP, dashed }) => (
    <div
      style={{
        width: 400,
        height: 300,
        borderRadius: 18,
        border: `5px ${dashed && solidP < 0.5 ? "dashed" : "solid"} ${color}`,
        background: solidP > 0.5 ? color : c5.cream,
        color: solidP > 0.5 ? c5.cream : color,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: `0 24px 40px -18px ${c5.shadowDeep}`,
      }}
    >
      <div style={{ ...t5.serif, fontSize: 110, color: "inherit" }}>{n}</div>
      <div style={{ ...t5.label, fontSize: 28, color: "inherit", letterSpacing: "0.2em" }}>{label}</div>
    </div>
  );

  return (
    <Scene5 surface="paper" enter="flicker">
      <div style={{ position: "absolute", top: 230, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 110 }}
          gap={24}
          words={[
            { text: "A", at: at(W5.a2) },
            { text: "experiência", at: at(W5.experiencia) },
          ]}
        />
        <SoftWords
          style={{ ...t5.serif, fontSize: 96, color: c5.inkSoft }}
          gap={22}
          words={[
            { text: "vem", at: at(W5.vem) },
            { text: "depois", at: at(W5.depois), style: { ...t5.serifIt } },
          ]}
        />
        <SoftWords
          style={{ ...t5.serifIt, fontSize: 170, color: c5.tealDeep }}
          gap={26}
          words={[
            { text: "da", at: at(W5.da) },
            { text: "ação.", at: at(W5.acao) },
          ]}
        />
      </div>

      <div style={{ position: "absolute", top: 1020, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div style={{ opacity: interpolate(act, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(act, [0, 1], [1.6, 1])}) rotate(-3deg)` }}>
          <Card n="1" label="ação" color={c5.teal} solidP={1} />
        </div>
        <svg width={120} height={60} viewBox="0 0 120 60" style={{ flexShrink: 0 }}>
          <path d="M 4 30 L 100 30" stroke={c5.inkSoft} strokeWidth={6} strokeDasharray="10 10" pathLength={1} style={{ strokeDasharray: `${arrow} 1` }} fill="none" />
          <path d="M 88 14 L 112 30 L 88 46" stroke={c5.inkSoft} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
        <div style={{ opacity: expGhost * (solid > 0.5 ? 1 : 0.7), transform: `scale(${1 + (solid > 0 ? Math.sin(Math.min(1, solid) * Math.PI) * 0.08 : 0)}) rotate(2deg)` }}>
          <Card n="2" label="experiência" color={c5.green} solidP={solid} dashed />
        </div>
      </div>
      <div style={{ position: "absolute", top: 1420, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Stamp text="primeiro agir" color={c5.tealDeep} p={act} rotate={-4} size={34} />
      </div>
      <FilmBurn at={boom} />
    </Scene5>
  );
};

// ——— Cena 7: fecho — polaroide a revelar-se ———
export const S7Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const develop = interpolate(frame, [0.2 * fps, 1.9 * fps], [0, 1], { easing: ease5.inOut, ...clamp });
  const pol = spring({ frame: frame - 2, fps, config: springs5.drop });
  const head = spring({ frame: frame - 0.35 * fps, fps, config: springs5.settle });
  return (
    <Scene5 surface="paper" enter="burn" origin={[540, 1000]}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 230 }}>
        <div style={{ ...t5.serifIt, fontSize: 200, opacity: head, transform: `translateY(${(1 - head) * 40}px)`, filter: `blur(${(1 - head) * 8}px)` }}>Comece.</div>
        <div style={{ marginTop: 40, opacity: interpolate(pol, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - pol) * -300}px) rotate(${3 + (1 - pol) * 12}deg)` }}>
          <Polaroid caption="dia 1" width={600} develop={develop}>
            <Memory sun={develop} />
          </Polaroid>
        </div>
        <div style={{ marginTop: 50 }}>
          <Typewriter text="a experiência vem depois da ação." from={Math.round(0.8 * fps)} to={Math.round(2.2 * fps)} style={{ fontSize: 34, color: c5.inkSoft }} />
        </div>
      </AbsoluteFill>
      {/* fim de bobine */}
      <AbsoluteFill style={{ background: c5.darkroom, opacity: interpolate(frame, [durationInFrames - 0.5 * fps, durationInFrames - 1], [0, 1], { easing: ease5.in, ...clamp }) }} />
    </Scene5>
  );
};
