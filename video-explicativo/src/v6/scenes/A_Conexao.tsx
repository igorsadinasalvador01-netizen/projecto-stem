import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease } from "../../v2/theme2";
import { t2 } from "../../v2/type2";
import { clamp, SyncedWords, useAt, useCameraPush } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar, Badge, IconX, Pill } from "../../v2/components/Kit";
import { Bokeh, emo, Ripple, Star, Thread, useArrive, useHeartbeat } from "../Emotion";
import { SCENES6, W6 } from "../timeline6";

// Janela de legenda que entra e sai (para frases que se substituem).
export const useWindow = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = interpolate(frame, [from, from + 0.3 * fps], [0, 1], { easing: ease.out, ...clamp });
  const o = interpolate(frame, [to - 0.25 * fps, to], [0, 1], { easing: ease.in, ...clamp });
  return { opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 30}px)` };
};

// ——— Cena 1: as pessoas confiam em você (constelação + fios + coração) ———
export const S1Confianca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.confianca.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const beat = Math.max(useHeartbeat(at(W6.confiarem), 2), useHeartbeat(at(W6.duas), 1));
  const you = spring({ frame: frame - 4, fps, config: emo.spring });
  const cx = 540;
  const cy = 1010;
  const N = 9;
  const people = Array.from({ length: N }).map((_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2 + (random(`a${i}`) - 0.5) * 0.3;
    const r = 330 + random(`r${i}`) * 70;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.92, s: 70 + random(`s${i}`) * 26 };
  });
  const pull = spring({ frame: frame - at(W6.duas), fps, config: emo.arrive });

  return (
    <SceneShell surface="white" pattern="dots" enter="none">
      <Bokeh seed="c1" strength={0.5} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 210, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 62 }}
            gap={14}
            words={[
              { text: "Você", at: at(W6.voce) },
              { text: "sabe", at: at(W6.sabe) },
              { text: "qual", at: at(W6.qual) },
              { text: "é", at: at(0.64) },
              { text: "o", at: at(0.8) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.impact, fontSize: 132, color: c2.turqDeep }}
            gap={26}
            rise={50}
            words={[
              { text: "truque", at: at(W6.truque) },
              { text: "psicológico", at: at(W6.psicologico) },
            ]}
          />
        </div>

        {/* fios de confiança: cada pessoa liga-se a você */}
        {people.map((p, i) => (
          <Thread key={`t${i}`} from={[p.x + (cx - p.x) * 0.08 * pull, p.y + (cy - p.y) * 0.08 * pull]} to={[cx, cy]} at={at(W6.confiarem) + i * 2} bend={i % 2 ? 0.18 : -0.18} width={3} />
        ))}
        {people.map((p, i) => {
          const arr = useArrive(at(W6.pessoas) + i * 1.5, (p.x - cx) * 0.5, (p.y - cy) * 0.5); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: p.x - p.s / 2 + (cx - p.x) * 0.08 * pull, top: p.y - p.s / 2 + (cy - p.y) * 0.08 * pull, ...arr.style }}>
              <Avatar size={p.s} tone="mist" />
            </div>
          );
        })}
        {/* você, ao centro, com batimento */}
        <div style={{ position: "absolute", left: cx - 120, top: cy - 120, width: 240, height: 240, transform: `scale(${(0.7 + you * 0.3) * beat})`, opacity: you }}>
          <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: `radial-gradient(circle, ${emo.warm}, ${emo.warmClear} 70%)`, opacity: interpolate(frame, [at(W6.confiarem), at(W6.confiarem) + 0.8 * fps], [0, 1], clamp) }} />
          <Avatar size={240} tone="turq" ring />
        </div>
        <Ripple at={at(W6.confiarem) + 6} x={cx} y={cy} />
        <Ripple at={at(W6.duas)} x={cx} y={cy} max={520} />

        <div style={{ position: "absolute", top: 1480, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 58 }}
            gap={14}
            words={[
              { text: "que", at: at(1.76) },
              { text: "faz", at: at(W6.faz) },
              { text: "as", at: at(2.08) },
              { text: "pessoas", at: at(W6.pessoas) },
              { text: "confiarem", at: at(W6.confiarem), style: { ...t2.head, fontSize: 70, color: c2.turqDeep } },
              { text: "em", at: at(W6.em) },
              { text: "você", at: at(W6.voce2), style: { ...t2.head, fontSize: 70 } },
            ]}
          />
          <SyncedWords
            style={{ ...t2.light, fontSize: 58, marginTop: 10 }}
            gap={14}
            words={[
              { text: "sem", at: at(W6.sem) },
              { text: "pensar", at: at(W6.pensar) },
              { text: "duas", at: at(W6.duas), style: { color: c2.ink, fontWeight: 600 } },
              { text: "vezes?", at: at(W6.vezes), style: { color: c2.ink, fontWeight: 600 } },
            ]}
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Cena 2: se chama prova social (avatares + 5 estrelas + coração) ———
export const S2Prova: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.prova.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const beat = useHeartbeat(at(W6.social), 2);

  return (
    <SceneShell surface="turq" pattern="rings" enter="iris" irisAt={[540, 1010]}>
      <Bokeh seed="c2" color={c2.whiteFaint} count={12} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 300, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 70, color: c2.whiteDim }}
            gap={18}
            words={[
              { text: "Se", at: at(W6.se) },
              { text: "chama", at: at(W6.chama) },
            ]}
          />
          <SyncedWords style={{ ...t2.hero, fontSize: 200, color: c2.white }} rise={70} words={[{ text: "prova", at: at(W6.prova) }]} />
          <SyncedWords style={{ ...t2.impact, fontSize: 210, color: c2.white, marginTop: -20 }} rise={70} words={[{ text: "social.", at: at(W6.social) }]} />
        </div>
        {/* avatares que se juntam */}
        <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${beat})` }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const side = i < 2 ? -1 : i > 2 ? 1 : 0;
            const arr = useArrive(at(W6.prova) + Math.abs(i - 2) * 3, side * 360, 120); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div key={i} style={{ marginLeft: i ? -34 : 0, zIndex: 5 - Math.abs(i - 2), ...arr.style }}>
                <Avatar size={i === 2 ? 170 : 140} tone="white" ring={i === 2} />
              </div>
            );
          })}
        </div>
        {/* 5 estrelas que acendem */}
        <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18, opacity: interpolate(frame, [at(W6.prova), at(W6.prova) + 8], [0, 1], clamp) }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const f = interpolate(frame, [at(W6.social) + i * 3, at(W6.social) + i * 3 + 6], [0, 1], clamp);
            const pop = spring({ frame: frame - at(W6.social) - i * 3, fps, config: emo.arrive });
            return (
              <div key={i} style={{ transform: `scale(${0.8 + pop * 0.2})`, filter: f > 0.9 ? `drop-shadow(0 0 18px ${c2.whiteDim})` : "none" }}>
                <Star size={104} fill={f} />
              </div>
            );
          })}
        </div>
        <Ripple at={at(W6.social)} x={540} y={1145} color={c2.white} max={560} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Cena 3: odeia ser o primeiro (frio, barreira) → outros chegam (quente) → a resistência some ———
export const S3Resistencia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.resistencia.from);
  const push = useCameraPush(durationInFrames, 1.06);
  const t = frame / fps;
  const me = { x: 540, y: 1330 };
  const wallIn = spring({ frame: frame - at(W6.arriscar), fps, config: emo.spring });
  const dissolve = interpolate(frame, [at(W6.some) - 2, at(W6.some) + 0.9 * fps], [0, 1], { easing: ease.out, ...clamp });
  const warm = interpolate(frame, [at(W6.compraram), at(W6.recomendaram) + 0.5 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const step = spring({ frame: frame - at(W6.some), fps, config: emo.spring });
  const labelSwap = interpolate(frame, [at(W6.resistencia), at(W6.resistencia) + 6], [0, 1], clamp);
  const shiver = (1 - warm) * Math.sin(t * 38) * 2.5 * interpolate(frame, [at(W6.primeiro), at(W6.primeiro) + 6], [0, 1], clamp);
  const others = [
    { x: 250, y: 720, at: at(W6.compraram), label: "comprou" },
    { x: 540, y: 640, at: at(W6.elogiaram), label: "elogiou" },
    { x: 830, y: 720, at: at(W6.recomendaram), label: "recomendou" },
  ];
  const capA = useWindow(at(W6.cerebro) - 4, at(W6.mas));
  const capB = useWindow(at(W6.mas), at(W6.resistencia) - 2);
  const capC = useWindow(at(W6.resistencia) - 2, durationInFrames + 30);

  return (
    <SceneShell surface="mist" pattern="floor" enter="panel">
      <Bokeh seed="c3" count={10} strength={0.6} color={warm > 0.5 ? emo.warm : c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* textos que se substituem */}
        <div style={{ position: "absolute", top: 210, left: 60, right: 60 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 64 }}
              gap={16}
              words={[
                { text: "O", at: at(6.64) },
                { text: "cérebro", at: at(W6.cerebro) },
                { text: "humano", at: at(W6.humano) },
                { text: "odeia", at: at(W6.odeia), style: { color: c2.ink, fontWeight: 600 } },
                { text: "ser", at: at(8.0) },
                { text: "o", at: at(8.16) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.hero, fontSize: 110, color: c2.red, marginTop: 6 }}
              gap={24}
              rise={44}
              words={[
                { text: "primeiro", at: at(W6.primeiro) },
                { text: "a", at: at(8.48) },
                { text: "arriscar,", at: at(W6.arriscar) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 64 }}
              gap={16}
              words={[
                { text: "mas", at: at(W6.mas) },
                { text: "quando", at: at(W6.quando) },
                { text: "ele", at: at(9.44) },
                { text: "vê", at: at(W6.ve) },
                { text: "que", at: at(9.76) },
                { text: "outros", at: at(W6.outros), style: { color: c2.ink, fontWeight: 600 } },
                { text: "já", at: at(W6.ja) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.head, fontSize: 70, color: c2.green, marginTop: 10 }}
              gap={18}
              words={[
                { text: "compraram,", at: at(W6.compraram) },
                { text: "elogiaram", at: at(W6.elogiaram) },
                { text: "ou", at: at(11.52) },
                { text: "recomendaram,", at: at(W6.recomendaram) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capC }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 70 }}
              gap={16}
              words={[
                { text: "a", at: at(12.32) },
                { text: "resistência", at: at(W6.resistencia), style: { color: c2.red, fontWeight: 600 } },
              ]}
            />
            <SyncedWords style={{ ...t2.impact, fontSize: 190, color: c2.green }} rise={60} words={[{ text: "some.", at: at(W6.some) }]} />
          </div>
        </div>

        {/* quem já foi: chegam em arco e ligam-se a você */}
        {others.map((o, i) => (
          <Thread key={`th${i}`} from={[o.x, o.y + 60]} to={[me.x, me.y - 40 - step * 120]} at={o.at + 6} bend={i === 1 ? 0 : i === 0 ? 0.2 : -0.2} color={c2.green} glow={c2.glowGreen} width={4} />
        ))}
        {others.map((o, i) => {
          const arr = useArrive(o.at, (i - 1) * 260, -260); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={o.label} style={{ position: "absolute", left: o.x - 200, width: 400, top: o.y - 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...arr.style }}>
              <Avatar size={140} tone="turq" />
              <Pill kind="pos" icon="check" size={34}>
                {o.label}
              </Pill>
            </div>
          );
        })}

        {/* barreira da resistência (vermelho) que se desfaz em partículas */}
        <div
          style={{
            position: "absolute",
            left: 170,
            right: 170,
            top: 1010,
            height: 150,
            borderRadius: 30,
            background: `linear-gradient(180deg, ${c2.redSoft}, ${c2.glowRed})`,
            border: `3px solid ${c2.red}`,
            opacity: wallIn * (1 - dissolve),
            transform: `translateY(${(1 - wallIn) * 60}px) scaleX(${1 + dissolve * 0.15})`,
            filter: `blur(${dissolve * 12}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: c2.red, opacity: interpolate(frame, [at(W6.arriscar) + 4, at(W6.arriscar) + 12], [0, 1], clamp) }}>
            <IconX size={40} stroke={3} />
            <div style={{ position: "relative", ...t2.mono, fontSize: 30, color: c2.red }}>
              <span style={{ opacity: 1 - labelSwap }}>risco</span>
              <span style={{ position: "absolute", left: 0, top: 0, opacity: labelSwap }}>resistência</span>
            </div>
          </div>
        </div>
        {dissolve > 0 &&
          dissolve < 1 &&
          Array.from({ length: 26 }).map((_, i) => {
            const x0 = 170 + random(`px${i}`) * 740;
            const y0 = 1010 + random(`py${i}`) * 150;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x0 + (random(`pv${i}`) - 0.5) * 200 * dissolve,
                  top: y0 - 320 * dissolve * (0.5 + random(`pu${i}`)),
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  background: c2.redLight,
                  opacity: 1 - dissolve,
                }}
              />
            );
          })}

        {/* você: frio e hesitante → aquecido, dá o passo */}
        <div style={{ position: "absolute", left: me.x - 95 + shiver, top: me.y - 95 - step * 120, transform: `scale(${1 + step * 0.12})` }}>
          <div style={{ position: "absolute", inset: -90, borderRadius: "50%", background: `radial-gradient(circle, ${emo.cold}, ${emo.coldClear} 70%)`, opacity: 1 - warm }} />
          <div style={{ position: "absolute", inset: -110, borderRadius: "50%", background: `radial-gradient(circle, ${emo.warm}, ${emo.warmClear} 70%)`, opacity: warm }} />
          <Avatar size={190} tone={warm > 0.6 ? "turq" : "mist"} />
          {step > 0.3 && (
            <div style={{ position: "absolute", right: -16, top: -16, transform: `scale(${step})` }}>
              <Badge kind="pos" size={64} />
            </div>
          )}
        </div>
        <Ripple at={at(W6.some) + 4} x={me.x} y={me.y - 120} color={c2.green} max={480} />
      </AbsoluteFill>
    </SceneShell>
  );
};
