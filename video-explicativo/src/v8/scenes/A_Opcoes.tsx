import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease } from "../../v2/theme2";
import { clamp, SyncedWords, useAt, useBreath, useCameraPush } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar } from "../../v2/components/Kit";
import { t4 } from "../../v4/DarkKit";
import { d4 } from "../../v4/timeline4";
import { Bokeh, emo, Ripple, Thread, useArrive, useHeartbeat } from "../../v6/Emotion";
import { useWindow } from "../../v7/Bond";
import { SCENES8, W8 } from "../timeline8";
import { Cupcake, PriceTag, Spotlight, Tag } from "../Sweet";

// Caixa de produto em vidro fumado com aresta turquesa.
const Box: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ overflow: "visible", filter: `drop-shadow(0 18px 30px rgba(0,0,0,0.5))` }}>
    <path d="M32 6 L56 18 L32 30 L8 18 Z" fill="rgba(166,238,238,0.55)" />
    <path d="M8 18 L32 30 L32 58 L8 46 Z" fill={c2.turq} />
    <path d="M56 18 L32 30 L32 58 L56 46 Z" fill={c2.turqDeep} />
    <path d="M20 12 L44 24 L44 32" stroke={c2.white} strokeWidth={3} fill="none" opacity={0.85} />
  </svg>
);

// ——— 1. Gancho: o cliente compra dois em vez de um ———
export const S1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.gancho.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const C = { x: 540, y: 1480 };
  const you = spring({ frame: frame - 2, fps, config: emo.spring });
  const one = spring({ frame: frame - at(W8.comprar), fps, config: emo.arrive });
  const split = spring({ frame: frame - at(W8.dois), fps, config: { damping: 13, stiffness: 120, mass: 0.8 } });
  const beat = useHeartbeat(at(W8.dois), 2);
  const strike = interpolate(frame, [at(W8.um) + 4, at(W8.um) + 10], [0, 1], { easing: ease.out, ...clamp });
  const bx = [540 - split * 170, 540 + split * 170];

  return (
    <SceneShell surface="night" pattern="dots" enter="none">
      <Bokeh seed="e1" count={12} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 220, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t4.light, fontSize: 60 }}
            gap={14}
            lead={0}
            words={[
              { text: "É", at: 1 },
              { text: "assim", at: at(W8.assim) },
              { text: "que", at: at(W8.que) },
              { text: "você", at: at(W8.voce) },
              { text: "faz", at: at(W8.faz) },
              { text: "o", at: at(W8.o) },
              { text: "cliente", at: at(W8.cliente), style: { color: d4.text, fontWeight: 600 } },
            ]}
          />
          <SyncedWords
            style={{ ...t4.head, fontSize: 88, marginTop: 10 }}
            gap={22}
            rise={44}
            words={[
              { text: "comprar", at: at(W8.comprar) },
              { text: "dois", at: at(W8.dois), style: { ...t4.impact, fontSize: 140, color: d4.turq } },
              { text: "produtos", at: at(W8.produtos) },
            ]}
          />
          <div style={{ position: "relative", marginTop: 6 }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 64 }}
              gap={16}
              words={[
                { text: "em", at: at(W8.em) },
                { text: "vez", at: at(W8.vez) },
                { text: "de", at: at(W8.de) },
                { text: "um.", at: at(W8.um), style: { ...t4.impact, fontSize: 92, color: d4.dim } },
              ]}
            />
            <div style={{ position: "absolute", right: -6, top: "56%", height: 6, width: 104 * strike, borderRadius: 3, background: d4.red, transformOrigin: "left" }} />
          </div>
        </div>

        {/* o cliente liga-se aos produtos */}
        {[0, 1].map((i) => (
          <Thread key={i} from={[C.x, C.y - 100]} to={[bx[i], 1090]} at={i ? at(W8.dois) + 2 : at(W8.comprar) + 2} bend={i ? -0.18 : 0.18} color={d4.turq} glow={c2.glowTurq} width={4} />
        ))}
        {[0, 1].map((i) => {
          const p = i ? split : one;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: bx[i] - 110,
                top: 880,
                opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (i === 1 || one > 0 ? 1 : 0),
                transform: `translateY(${(1 - one) * 120}px) scale(${0.8 + p * 0.2}) rotate(${(i ? 1 : -1) * split * 6}deg)`,
              }}
            >
              <Box size={220} />
            </div>
          );
        })}
        {frame >= at(W8.produtos) && (
          <div style={{ position: "absolute", left: 540, top: 820, transform: `translateX(-50%) scale(${spring({ frame: frame - at(W8.produtos), fps, config: emo.arrive })})` }}>
            <Tag kind="pos" size={40}>
              ×2
            </Tag>
          </div>
        )}
        <div style={{ position: "absolute", left: C.x - 90, top: C.y - 90, opacity: you, transform: `scale(${(0.8 + you * 0.2) * beat})` }}>
          <Avatar size={180} tone="white" ring />
        </div>
        <Ripple at={at(W8.dois) + 4} x={C.x} y={C.y} color={d4.turq} max={380} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 2. O cupcake a 5 reais, sob um foco de luz ———
export const S2Cupcake: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.cupcake.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const breath = useBreath(1.2, 1);
  const cup = spring({ frame: frame - at(W8.cupcakes), fps, config: emo.arrive });
  const pulse = 1 + Math.exp(-(((frame - at(W8.cada)) / fps - 0.1) ** 2) / 0.01) * 0.08;

  return (
    <SceneShell surface="abyss" pattern="rings" enter="iris" irisAt={[540, 1250]}>
      <Bokeh seed="e2" count={12} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t4.light, fontSize: 64 }}
            gap={16}
            words={[
              { text: "Imagina", at: at(W8.imagina) },
              { text: "que", at: at(W8.que2) },
              { text: "você", at: at(W8.voce2) },
              { text: "vende", at: at(W8.vende), style: { color: d4.text, fontWeight: 600 } },
            ]}
          />
          <SyncedWords style={{ ...t4.impact, fontSize: 170, color: d4.text, marginTop: 4 }} rise={60} words={[{ text: "cupcakes", at: at(W8.cupcakes) }]} />
          <SyncedWords
            style={{ ...t4.head, fontSize: 80, marginTop: 8 }}
            gap={20}
            words={[
              { text: "a", at: at(W8.a), style: { ...t4.light, fontSize: 80 } },
              { text: "5", at: at(W8.cinco), style: { color: d4.turq } },
              { text: "reais", at: at(W8.reais), style: { color: d4.turq } },
              { text: "cada.", at: at(W8.cada), style: { ...t4.light, fontSize: 80 } },
            ]}
          />
        </div>

        <Spotlight x={540} floorY={1560} at={at(W8.imagina)} width={420} />
        <div
          style={{
            position: "absolute",
            left: 540 - 230,
            top: 1040 + breath.float,
            opacity: interpolate(cup, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - cup) * 160}px) scale(${0.7 + cup * 0.3}) rotate(${breath.tilt}deg)`,
          }}
        >
          <Cupcake size={460} glow={cup} id="c2" />
        </div>
        <div style={{ transform: `scale(${pulse})`, transformOrigin: "830px 980px", position: "absolute", inset: 0 }}>
          <PriceTag at={at(W8.cinco)} label="R$ 5" x={830} y={990} />
        </div>
        <Ripple at={at(W8.cinco) + 2} x={830} y={1030} color={d4.turq} max={200} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 3. Novas opções: o grande a 9 e dois pequenos a 10 ———
export const S3Opcoes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.opcoes.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const floor = 1520;
  const small = useArrive(4, -120, 40);
  const big = spring({ frame: frame - at(W8.maior), fps, config: emo.arrive });
  const pairA = useArrive(at(W8.dois2), 160, 80);
  const pairB = useArrive(at(W8.pequenos), 220, 80);
  const plus = interpolate(frame, [at(W8.adiciona), at(W8.adiciona) + 0.5 * fps, at(W8.maior)], [0, 1, 0], clamp);
  const capA = useWindow(at(W8.agora) - 4, at(W8.e2) - 1);
  const capB = useWindow(at(W8.e2) - 1, durationInFrames + 30);

  return (
    <SceneShell surface="night" pattern="floor" enter="panel">
      <Bokeh seed="e3" count={10} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 62 }}
              gap={15}
              words={[
                { text: "Agora", at: at(W8.agora) },
                { text: "você", at: at(W8.voce3) },
                { text: "adiciona", at: at(W8.adiciona), style: { color: d4.text, fontWeight: 600 } },
                { text: "uma", at: at(W8.uma) },
                { text: "opção", at: at(W8.opcao) },
              ]}
            />
            <SyncedWords
              style={{ ...t4.head, fontSize: 92, marginTop: 8 }}
              gap={22}
              rise={44}
              words={[
                { text: "maior", at: at(W8.maior), style: { ...t4.impact, fontSize: 130, color: d4.turq } },
                { text: "por", at: at(W8.por), style: { ...t4.light, fontSize: 92 } },
                { text: "9", at: at(W8.nove) },
                { text: "reais.", at: at(W8.reais2) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 62 }}
              gap={15}
              words={[
                { text: "E", at: at(W8.e2) },
                { text: "outra", at: at(W8.outra), style: { color: d4.text, fontWeight: 600 } },
                { text: "opção", at: at(W8.opcao2) },
                { text: "de", at: at(W8.de2) },
              ]}
            />
            <SyncedWords
              style={{ ...t4.head, fontSize: 92, marginTop: 8 }}
              gap={22}
              rise={44}
              words={[
                { text: "dois", at: at(W8.dois2), style: { ...t4.impact, fontSize: 130, color: d4.turq } },
                { text: "pequenos", at: at(W8.pequenos), style: { ...t4.impact, fontSize: 130, color: d4.turq } },
                { text: "por", at: at(W8.por2), style: { ...t4.light, fontSize: 92 } },
                { text: "10", at: at(W8.dez) },
                { text: "reais.", at: at(W8.reais3) },
              ]}
            />
          </div>
        </div>

        {/* três lugares no palco */}
        <Spotlight x={180} floorY={floor} at={2} width={270} />
        <Spotlight x={530} floorY={floor} at={at(W8.maior) - 4} width={380} />
        <Spotlight x={895} floorY={floor} at={at(W8.dois2) - 4} width={330} />

        {/* + nova opção */}
        <div
          style={{
            position: "absolute",
            left: 540 - 70,
            top: 1260,
            width: 140,
            height: 140,
            borderRadius: 70,
            border: `3px dashed ${d4.turq}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...t4.light,
            fontSize: 100,
            color: d4.turq,
            opacity: plus,
            transform: `scale(${0.8 + plus * 0.2})`,
          }}
        >
          +
        </div>

        <div style={{ position: "absolute", left: 180 - 125, top: floor - 274, ...small.style }}>
          <Cupcake size={250} id="s3a" />
        </div>
        <PriceTag at={10} label="R$ 5" x={180} y={floor - 380} size={0.85} />

        <div
          style={{
            position: "absolute",
            left: 530 - 195,
            top: floor - 430,
            opacity: interpolate(big, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - big) * 140}px) scale(${0.6 + big * 0.4})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Cupcake size={390} glow={big} id="s3b" />
        </div>
        <PriceTag at={at(W8.nove)} label="R$ 9" x={530} y={floor - 545} />

        <div style={{ position: "absolute", left: 895 - 185, top: floor - 220, ...pairA.style }}>
          <Cupcake size={200} id="s3c" />
        </div>
        <div style={{ position: "absolute", left: 895 - 15, top: floor - 220, ...pairB.style }}>
          <Cupcake size={200} id="s3d" />
        </div>
        <PriceTag at={at(W8.dez)} label="R$ 10" x={895} y={floor - 330} size={0.9} />
      </AbsoluteFill>
    </SceneShell>
  );
};
