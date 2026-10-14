import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease } from "../../v2/theme2";
import { t2 } from "../../v2/type2";
import { clamp, SyncedWords, useAt, useCameraPush } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar, Bubble, IconDoc, Pill } from "../../v2/components/Kit";
import { Bokeh, emo, Ripple, Thread, useArrive, useHeartbeat } from "../../v6/Emotion";
import { SCENES7, W7 } from "../timeline7";
import { Caption, ChapterHead, Progress, SnapThread, v7 } from "../Bond";

// ——— Abertura: evite estes 5 tipos de pessoas ———
export const S0Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.abertura.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const beat = useHeartbeat(at(W7.pessoas), 2);
  const you = spring({ frame: frame - 2, fps, config: emo.spring });
  const C = { x: 540, y: 1430 };
  const people = [0, 1, 2, 3, 4].map((i) => {
    const a = ((-160 + i * 35) * Math.PI) / 180;
    return { x: C.x + Math.cos(a) * 390, y: C.y + Math.sin(a) * 390 * 0.92 };
  });
  const warn = interpolate(frame, [at(W7.pessoas), at(W7.pessoas) + 8], [0, 1], clamp);

  return (
    <SceneShell surface="fog" pattern="dots" enter="none">
      <Bokeh seed="d0" count={12} color={v7.bokehLight} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 200, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords style={{ ...t2.hero, fontSize: 200, color: c2.red }} rise={70} lead={0} words={[{ text: "Evite", at: 1 }]} />
          <SyncedWords
            style={{ ...t2.light, fontSize: 64, marginTop: 14 }}
            gap={16}
            words={[
              { text: "fazer", at: at(W7.fazer) },
              { text: "negócios", at: at(W7.negocios), style: { color: c2.ink, fontWeight: 600 } },
              { text: "com", at: at(W7.com) },
              { text: "esses", at: at(W7.esses) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.head, fontSize: 90, marginTop: 8 }}
            gap={22}
            rise={44}
            words={[
              { text: "cinco", at: at(W7.cinco), style: { ...t2.impact, fontSize: 116, color: c2.turqDeep } },
              { text: "tipos", at: at(W7.tipos) },
              { text: "de", at: at(W7.de), style: { ...t2.light, fontSize: 90 } },
              { text: "pessoas.", at: at(W7.pessoas) },
            ]}
          />
        </div>

        {/* cinco pessoas ligam-se a você — fios cinzentos, ainda neutros */}
        {people.map((p, i) => (
          <Thread key={`t${i}`} from={[p.x, p.y]} to={[C.x, C.y]} at={at(W7.pessoas) + i * 2} bend={i < 2 ? 0.16 : i > 2 ? -0.16 : 0} color={c2.inkFaint} glow={c2.line} width={3} />
        ))}
        {people.map((p, i) => {
          const a = useArrive(at(W7.cinco) + i * 2, (C.x - p.x) * 0.6, (C.y - p.y) * 0.6); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: p.x - 58, top: p.y - 58, ...a.style }}>
              <Avatar size={116} tone="white" />
              <div
                style={{
                  position: "absolute",
                  right: -8,
                  top: -8,
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  background: warn > 0.5 ? c2.red : c2.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...t2.mono,
                  color: c2.white,
                  letterSpacing: 0,
                  fontSize: 22,
                  boxShadow: `0 8px 20px -6px ${warn > 0.5 ? c2.glowRed : c2.shadowDeep}`,
                  transform: `scale(${1 + Math.sin(warn * Math.PI) * 0.25})`,
                }}
              >
                {i + 1}
              </div>
            </div>
          );
        })}
        {/* você ao centro: o coração acelera */}
        <div style={{ position: "absolute", left: C.x - 95, top: C.y - 95, transform: `scale(${(0.7 + you * 0.3) * beat})`, opacity: you }}>
          <Avatar size={190} tone="turq" ring />
        </div>
        <Ripple at={1} x={C.x} y={C.y} color={c2.red} max={300} />
        <Ripple at={at(W7.pessoas) + 4} x={C.x} y={C.y} color={c2.red} max={520} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 1. Os desesperados: pressa, coração acelerado, empurrão, acordo ruim ———
export const S1Desesperados: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.desesperados.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const t = (frame - at(W7.desesperados)) / fps;
  // batimento acelerado (≈ 2,2 por segundo) enquanto está desesperado
  const ph = t > 0 ? t % 0.45 : -1;
  const fast = ph >= 0 ? 1 + Math.exp(-((ph - 0.04) ** 2) / 0.0012) * 0.08 + Math.exp(-((ph - 0.17) ** 2) / 0.0012) * 0.04 : 1;
  const dIn = spring({ frame: frame - at(W7.desesperados), fps, config: emo.arrive });
  const yIn = spring({ frame: frame - at(W7.os), fps, config: emo.arrive });
  const shove = spring({ frame: frame - at(W7.empurram), fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  const lunge = interpolate(frame, [at(W7.empurram) - 3, at(W7.empurram) + 3, at(W7.empurram) + 16], [0, 1, 0.55], { easing: ease.out, ...clamp });
  const D = { x: 290 + lunge * 200, y: 1170 };
  const Y = { x: 790 + shove * 70, y: 1330 + shove * 40 };
  const timer = interpolate(frame, [at(W7.forcam), at(W7.rapidas) + 0.4 * fps], [1, 0], clamp);
  const secs = Math.ceil(timer * 9);
  const timerIn = spring({ frame: frame - at(W7.forcam), fps, config: emo.arrive });
  const card = spring({ frame: frame - at(W7.acordos), fps, config: emo.arrive });
  const stamp = spring({ frame: frame - at(W7.ruins), fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const R = 92;
  const circ = 2 * Math.PI * R;

  return (
    <SceneShell surface="graphite" pattern="diagonal" enter="iris" irisAt={[540, 1250]}>
      <Bokeh seed="d1" count={10} color={c2.glowRed} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Progress current={1} dark />
        <ChapterHead
          n={1}
          at={at(W7.um)}
          dark
          title={[
            { text: "os", at: at(W7.os) },
            { text: "desesperados", at: at(W7.desesperados) },
          ]}
        />
        <Caption
          top={480}
          dark
          words={[
            { text: "Forçam", at: at(W7.forcam), style: { color: c2.white, fontWeight: 600 } },
            { text: "decisões", at: at(W7.decisoes) },
            { text: "rápidas", at: at(W7.rapidas), style: { color: c2.redLight, fontWeight: 600 } },
            { text: "e", at: at(W7.e) },
            { text: "te", at: at(W7.te) },
            { text: "empurram", at: at(W7.empurram), style: { color: c2.white, fontWeight: 600 } },
            { text: "para", at: at(W7.para) },
            { text: "acordos", at: at(W7.acordos) },
            { text: "ruins.", at: at(W7.ruins), style: { color: c2.redLight, fontWeight: 600 } },
          ]}
        />

        {/* o fio entre vocês: tenso desde o início, parte-se no "ruins" */}
        <SnapThread from={[D.x + 60, D.y]} to={[Y.x - 60, Y.y - 10]} at={at(W7.desesperados) + 6} snapAt={at(W7.ruins) + 8} bend={0.18} color={v7.dimOnDark} glow="rgba(255,255,255,0.08)" />

        {/* cronómetro a contar depressa */}
        <div
          style={{
            position: "absolute",
            left: 790 - 120,
            top: 820,
            width: 240,
            height: 240,
            opacity: interpolate(timerIn, [0, 0.3], [0, 1], clamp) * interpolate(frame, [at(W7.e), at(W7.e) + 8], [1, 0.35], clamp),
            transform: `scale(${0.8 + timerIn * 0.2})`,
          }}
        >
          <svg width={240} height={240} viewBox="0 0 240 240">
            <circle cx={120} cy={120} r={R} stroke="rgba(255,255,255,0.14)" strokeWidth={14} fill="none" />
            <circle
              cx={120}
              cy={120}
              r={R}
              stroke={timer < 0.35 ? c2.red : c2.aqua}
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circ * timer} ${circ}`}
              transform="rotate(-90 120 120)"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...t2.mono, letterSpacing: 0, fontSize: 52, color: timer < 0.35 ? c2.redLight : c2.white }}>
            00:0{secs}
          </div>
        </div>
        {frame >= at(W7.rapidas) && (
          <div style={{ position: "absolute", left: 790, top: 1080, transform: `translateX(-50%) scale(${spring({ frame: frame - at(W7.rapidas), fps, config: emo.arrive })})` }}>
            <Pill kind="neg" icon="x" size={34}>
              decide já!
            </Pill>
          </div>
        )}

        {/* o desesperado: coração a mil e ondas de pressão */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <Ripple key={k} at={at(W7.desesperados) + k * 14} x={D.x} y={D.y} color={c2.red} max={190} />
        ))}
        <div
          style={{
            position: "absolute",
            left: D.x - 80,
            top: D.y - 80,
            opacity: interpolate(dIn, [0, 0.3], [0, 1], clamp),
            transform: `translateX(${(1 - dIn) * -200}px) scale(${(0.85 + dIn * 0.15) * fast}) rotate(${lunge * 10}deg)`,
          }}
        >
          <Avatar size={160} tone="mist" />
        </div>
        {/* você: é empurrado */}
        <div
          style={{
            position: "absolute",
            left: Y.x - 80,
            top: Y.y - 80,
            opacity: interpolate(yIn, [0, 0.3], [0, 1], clamp),
            transform: `translateX(${(1 - yIn) * 200}px) rotate(${shove * 8 - Math.sin(shove * Math.PI) * 4}deg) scale(${1 - Math.sin(shove * Math.PI) * 0.06}, ${1 + Math.sin(shove * Math.PI) * 0.04})`,
          }}
        >
          <Avatar size={160} tone="turq" ring />
        </div>

        {/* o acordo ruim */}
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 1530,
            width: 520,
            height: 170,
            borderRadius: 34,
            background: "rgba(255,255,255,0.10)",
            border: "2px solid rgba(255,255,255,0.22)",
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "0 36px",
            color: c2.white,
            opacity: interpolate(card, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - card) * 120}px)`,
          }}
        >
          <IconDoc size={70} stroke={1.8} />
          <div style={{ flex: 1 }}>
            <div style={{ ...t2.head, fontSize: 46, color: c2.white }}>acordo</div>
            <div style={{ marginTop: 12, height: 8, width: "80%", borderRadius: 4, background: "rgba(255,255,255,0.22)" }} />
            <div style={{ marginTop: 10, height: 8, width: "55%", borderRadius: 4, background: "rgba(255,255,255,0.16)" }} />
          </div>
          {stamp > 0.01 && (
            <div style={{ position: "absolute", right: -26, top: -30, transform: `scale(${2 - stamp}) rotate(-10deg)`, opacity: Math.min(1, stamp * 2) }}>
              <Pill kind="neg" icon="x" size={40}>
                ruim
              </Pill>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 2. Os que discutem tudo: conversa vira debate, o fecho nunca chega ———
export const S2Discutem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.discutem.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const A = { x: 250, y: 900 };
  const Y = { x: 830, y: 900 };
  const aIn = useArrive(at(W7.discutem), -220, 40);
  const yIn = useArrive(at(W7.os2), 220, 40);
  const mine = useArrive(at(W7.conversa), 160, 60);
  const bar = interpolate(
    frame,
    [at(W7.nunca), at(W7.fecham), at(W7.fecham) + 6, at(13.24), at(W7.nada) - 2, at(W7.nada) + 3],
    [0, 0.62, 0.08, 0.4, 0.4, 0],
    { easing: ease.inOut, ...clamp },
  );
  const failed = frame >= at(W7.nada);
  const angry = interpolate(frame, [at(W7.debate), at(W7.debate) + 4, at(W7.debate) + 20], [0, 1, 0], clamp);
  const ARGS = [
    { text: "Mas…", at: at(W7.debate), y: 1170 },
    { text: "Discordo.", at: at(W7.debate) + 5, y: 1300 },
    { text: "E se…?", at: at(W7.debate) + 10, y: 1430 },
  ];

  return (
    <SceneShell surface="fog" pattern="grid" enter="panel">
      <Bokeh seed="d2" count={10} color={v7.bokehLight} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Progress current={2} />
        <ChapterHead
          n={2}
          at={at(W7.segundo)}
          title={[
            { text: "os", at: at(W7.os2) },
            { text: "que", at: at(W7.que) },
            { text: "discutem", at: at(W7.discutem) },
            { text: "tudo", at: at(W7.tudo), style: { color: c2.red } },
          ]}
        />
        <Caption
          top={500}
          words={[
            { text: "transformam", at: at(W7.transformam) },
            { text: "qualquer", at: at(W7.qualquer) },
            { text: "conversa", at: at(W7.conversa), style: { color: c2.ink, fontWeight: 600 } },
            { text: "em", at: at(W7.em) },
            { text: "debate", at: at(W7.debate), style: { color: c2.red, fontWeight: 600 } },
            { text: "e", at: at(W7.e2) },
            { text: "nunca", at: at(W7.nunca), style: { color: c2.red, fontWeight: 600 } },
            { text: "fecham", at: at(W7.fecham), style: { color: c2.red, fontWeight: 600 } },
            { text: "nada.", at: at(W7.nada), style: { color: c2.ink, fontWeight: 600 } },
          ]}
        />

        <SnapThread from={[A.x + 80, A.y]} to={[Y.x - 80, Y.y]} at={at(W7.discutem) + 6} snapAt={at(W7.nada) + 1} bend={-0.12} />

        <div style={{ position: "absolute", left: A.x - 80, top: A.y - 80, ...aIn.style }}>
          <div style={{ transform: `translateX(${Math.sin(frame * 2.2) * 6 * angry}px)` }}>
            <Avatar size={160} tone="mist" />
          </div>
        </div>
        <div style={{ position: "absolute", left: Y.x - 80, top: Y.y - 80, ...yIn.style }}>
          <Avatar size={160} tone="turq" ring />
        </div>

        {/* a sua proposta, calma */}
        <div style={{ position: "absolute", right: 70, top: 1040, ...mine.style }}>
          <Bubble side="right" tone="turq" style={{ ...t2.head, fontSize: 50, padding: "24px 38px" }}>
            Vamos fechar?
          </Bubble>
        </div>
        {/* a resposta: debate */}
        {ARGS.map((g, i) => {
          const a = useArrive(g.at, -180, 30); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: 70 + i * 34, top: g.y, ...a.style }}>
              <Bubble side="left" tone="neg" style={{ ...t2.head, fontSize: 50, padding: "24px 38px" }}>
                {g.text}
              </Bubble>
            </div>
          );
        })}

        {/* o fecho que nunca chega */}
        <div style={{ position: "absolute", left: 70, right: 70, top: 1640, opacity: interpolate(frame, [at(W7.e2), at(W7.e2) + 8], [0, 1], clamp) }}>
          <div style={{ display: "flex", justifyContent: "space-between", ...t2.mono, fontSize: 26 }}>
            <span>fechamento</span>
            <span style={{ color: failed ? c2.red : c2.inkSoft }}>{Math.round(bar * 100)}%</span>
          </div>
          <div style={{ marginTop: 16, height: 20, borderRadius: 10, background: c2.line, overflow: "hidden" }}>
            <div style={{ width: `${bar * 100}%`, height: "100%", borderRadius: 10, background: failed ? c2.red : c2.turq }} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 3. Amigos e família: o coração aquece, o dinheiro cai, o coração racha ———
const HEART = "M100 172 C 42 124, 2 92, 2 52 C 2 22, 26 2, 56 2 C 76 2, 92 14, 100 30 C 108 14, 124 2, 144 2 C 174 2, 198 22, 198 52 C 198 92, 158 124, 100 172 Z";
const CRACK_L = "polygon(0 0, 52% 0, 46% 22%, 55% 40%, 45% 58%, 54% 76%, 50% 100%, 0 100%)";
const CRACK_R = "polygon(52% 0, 100% 0, 100% 100%, 50% 100%, 54% 76%, 45% 58%, 55% 40%, 46% 22%)";

export const S3Amigos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.amigos.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const H = { x: 540, y: 1250 };
  const Y = { x: 200, y: 1330 };
  const F = { x: 880, y: 1330 };
  const yIn = useArrive(at(W7.amigos), -200, 60);
  const fIn = useArrive(at(W7.familia), 200, 60);
  const heartIn = spring({ frame: frame - at(W7.amigos), fps, config: emo.arrive });
  const beat = Math.max(useHeartbeat(at(W7.amigos), 1), useHeartbeat(at(W7.familia), 2));
  const warm = interpolate(frame, [at(W7.amigos), at(W7.familia) + 10], [0, 1], { easing: emo.ease, ...clamp });
  const coinIn = spring({ frame: frame - at(W7.misturar), fps, config: emo.arrive });
  const drop = interpolate(frame, [at(W7.dinheiro) - 4, at(W7.dinheiro) + 6], [0, 1], { easing: ease.in, ...clamp });
  const land = spring({ frame: frame - (at(W7.dinheiro) + 6), fps, config: { damping: 8, stiffness: 180, mass: 0.6 } });
  const tremble = interpolate(frame, [at(W7.sempre), at(W7.problema)], [0, 1], clamp);
  const crack = spring({ frame: frame - at(W7.problema), fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const cold = interpolate(frame, [at(W7.problema), at(W7.problema) + 0.6 * fps], [0, 1], clamp);
  const shake = frame < at(W7.problema) ? Math.sin(frame * 3.1) * 5 * tremble : 0;
  const coinY = 860 + drop * 330 - Math.sin(land * Math.PI) * 30 * (drop >= 1 ? 1 : 0) + Math.sin(frame / 7) * 6 * (1 - drop);

  return (
    <SceneShell surface="stone" pattern="rings" enter="wipeLeft">
      <Bokeh seed="d3" count={12} color={cold > 0.5 ? v7.bokehLight : emo.warm} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Progress current={3} />
        <ChapterHead
          n={3}
          at={at(W7.tres)}
          title={[
            { text: "amigos", at: at(W7.amigos) },
            { text: "e", at: at(W7.e3) },
            { text: "família", at: at(W7.familia) },
          ]}
        />
        <Caption
          top={480}
          words={[
            { text: "Misturar", at: at(W7.misturar), style: { color: c2.ink, fontWeight: 600 } },
            { text: "relação", at: at(W7.relacao), style: { color: c2.turqDeep, fontWeight: 600 } },
            { text: "pessoal", at: at(W7.pessoal), style: { color: c2.turqDeep, fontWeight: 600 } },
            { text: "com", at: at(W7.com2) },
            { text: "dinheiro", at: at(W7.dinheiro), style: { color: c2.ink, fontWeight: 600 } },
            { text: "quase", at: at(W7.quase) },
            { text: "sempre", at: at(W7.sempre) },
            { text: "dá", at: at(W7.da) },
            { text: "problema.", at: at(W7.problema), style: { color: c2.red, fontWeight: 600 } },
          ]}
        />

        {/* luz quente que esfria quando o coração racha */}
        <div
          style={{
            position: "absolute",
            left: H.x - 480,
            top: H.y - 380,
            width: 960,
            height: 760,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${emo.warm}, ${emo.warmClear} 65%)`,
            opacity: warm * (1 - cold),
          }}
        />
        <SnapThread from={[Y.x + 80, Y.y]} to={[H.x - 120, H.y]} at={at(W7.amigos) + 8} snapAt={at(W7.problema) + 4} bend={0.12} color={c2.turq} glow={c2.glowTurq} />
        <SnapThread from={[F.x - 80, F.y]} to={[H.x + 120, H.y]} at={at(W7.familia) + 4} snapAt={at(W7.problema) + 4} bend={-0.12} color={c2.turq} glow={c2.glowTurq} />

        <div style={{ position: "absolute", left: Y.x - 80, top: Y.y - 80, ...yIn.style }}>
          <Avatar size={160} tone="turq" ring />
        </div>
        <div style={{ position: "absolute", left: F.x - 80, top: F.y - 80, ...fIn.style }}>
          <Avatar size={160} tone="white" />
        </div>

        {/* o coração (relação) */}
        <div
          style={{
            position: "absolute",
            left: H.x - 140,
            top: H.y - 124,
            width: 280,
            height: 247,
            opacity: interpolate(heartIn, [0, 0.3], [0, 1], clamp),
            transform: `translateX(${shake}px) scale(${(0.6 + heartIn * 0.4) * beat * (1 + (drop >= 1 ? Math.sin(land * Math.PI) * 0.06 : 0))})`,
          }}
        >
          {[CRACK_L, CRACK_R].map((clip, i) => (
            <svg
              key={i}
              width={280}
              height={247}
              viewBox="0 0 200 176"
              style={{
                position: "absolute",
                inset: 0,
                clipPath: crack > 0.01 ? clip : undefined,
                transform: `translate(${(i ? 1 : -1) * crack * 34}px, ${crack * 26}px) rotate(${(i ? 1 : -1) * crack * 14}deg)`,
                filter: `drop-shadow(0 18px 30px ${cold > 0.5 ? c2.glowRed : c2.glowTurq})`,
              }}
            >
              <defs>
                <linearGradient id={`hg${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={cold > 0.5 ? c2.redLight : c2.turqLight} />
                  <stop offset="1" stopColor={cold > 0.5 ? c2.red : c2.turqDeep} />
                </linearGradient>
              </defs>
              <path d={HEART} fill={`url(#hg${i})`} />
              <path d="M58 40 C 46 42, 36 52, 36 64" stroke="rgba(255,255,255,0.6)" strokeWidth={8} fill="none" strokeLinecap="round" />
            </svg>
          ))}
        </div>
        {frame >= at(W7.relacao) && (
          <div style={{ position: "absolute", left: H.x, top: H.y + 150, transform: `translateX(-50%) scale(${spring({ frame: frame - at(W7.relacao), fps, config: emo.arrive })})` }}>
            <Pill kind={cold > 0.5 ? "neg" : "turq"} icon={cold > 0.5 ? "x" : null} size={34}>
              relação pessoal
            </Pill>
          </div>
        )}
        {/* a moeda: paira e cai no coração */}
        <div
          style={{
            position: "absolute",
            left: H.x - 62,
            top: coinY - 62,
            width: 124,
            height: 124,
            borderRadius: "50%",
            background: `linear-gradient(150deg, ${c2.white}, ${c2.fogBottom})`,
            boxShadow: `0 20px 40px -14px ${c2.shadowDeep}, inset 0 0 0 6px ${c2.turqMist}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...t2.head,
            fontSize: 46,
            color: c2.turqDeep,
            opacity: interpolate(coinIn, [0, 0.3], [0, 1], clamp) * (1 - interpolate(frame, [at(W7.dinheiro) + 8, at(W7.dinheiro) + 14], [0, 1], clamp)),
            transform: `scale(${0.7 + coinIn * 0.3}) perspective(400px) rotateY(${Math.sin(frame / 6) * 35}deg)`,
          }}
        >
          R$
        </div>
        <Ripple at={at(W7.dinheiro) + 8} x={H.x} y={H.y} color={c2.turq} max={260} />
        <Ripple at={at(W7.problema)} x={H.x} y={H.y} color={c2.red} max={420} />
      </AbsoluteFill>
    </SceneShell>
  );
};
