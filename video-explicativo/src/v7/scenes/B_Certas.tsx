import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease } from "../../v2/theme2";
import { t2 } from "../../v2/type2";
import { clamp, SyncedWords, useAt, useBreath, useCameraPush } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar, Badge, IconCheck, IconDoc, Pill } from "../../v2/components/Kit";
import { Bokeh, emo, Ripple, Thread, useArrive, useHeartbeat } from "../../v6/Emotion";
import { SCENES7, W7 } from "../timeline7";
import { Caption, ChapterHead, Progress, SnapThread, v7 } from "../Bond";

// ——— 4. Quem não te respeita: atravessa os seus limites e o seu valor cai ———
export const S4Respeito: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.respeito.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const B = { x: 540, y: 1150, r: 220 };
  const yIn = spring({ frame: frame - at(W7.quem), fps, config: emo.arrive });
  const ringIn = interpolate(frame, [at(W7.quem), at(W7.quem) + 0.6 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const pIn = useArrive(at(W7.pessoa), 160, -120);
  const walk = interpolate(frame, [at(W7.ignora), at(W7.seus)], [0, 1], { easing: ease.inOut, ...clamp });
  const P = { x: 900 - walk * 230, y: 860 + walk * 170 };
  const crossAt = at(W7.ignora) + Math.round(0.3 * fps);
  const breached = frame >= crossAt;
  const flash = interpolate(frame, [crossAt, crossAt + 3, crossAt + 12], [0, 1, 0.6], clamp);
  const devalue = interpolate(frame, [at(W7.desvalorizar), at(W7.em2)], [0, 1], { easing: emo.ease, ...clamp });
  const value = Math.round(1000 - devalue * 650);
  const card = spring({ frame: frame - at(W7.ela), fps, config: emo.arrive });
  const t = frame / fps;

  return (
    <SceneShell surface="graphite" pattern="floor" enter="iris" irisAt={[540, 1150]}>
      <Bokeh seed="d4" count={10} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Progress current={4} dark />
        <ChapterHead
          n={4}
          at={at(W7.quatro)}
          dark
          title={[
            { text: "quem", at: at(W7.quem) },
            { text: "não", at: at(W7.nao), style: { color: c2.redLight } },
            { text: "te", at: at(W7.te2) },
            { text: "respeita", at: at(W7.respeita) },
          ]}
        />
        <Caption
          top={510}
          dark
          words={[
            { text: "Se", at: at(W7.se) },
            { text: "a", at: at(W7.a) },
            { text: "pessoa", at: at(W7.pessoa) },
            { text: "ignora", at: at(W7.ignora), style: { color: c2.white, fontWeight: 600 } },
            { text: "seus", at: at(W7.seus) },
            { text: "limites,", at: at(W7.limites), style: { color: c2.aqua, fontWeight: 600 } },
            { text: "ela", at: at(W7.ela) },
            { text: "vai", at: at(W7.vai) },
            { text: "te", at: at(W7.te3) },
            { text: "desvalorizar", at: at(W7.desvalorizar), style: { color: c2.redLight, fontWeight: 600 } },
            { text: "em", at: at(W7.em2) },
            { text: "qualquer", at: at(W7.qualquer2) },
            { text: "negociação.", at: at(W7.negociacao), style: { color: c2.white, fontWeight: 600 } },
          ]}
        />

        {/* o seu limite: círculo tracejado que fica vermelho quando é atravessado */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle
            cx={B.x}
            cy={B.y}
            r={B.r}
            fill={breached ? "rgba(229,72,77,0.06)" : "rgba(95,214,217,0.06)"}
            stroke={breached ? c2.red : c2.aqua}
            strokeWidth={4 + flash * 4}
            strokeDasharray="18 16"
            pathLength={1000}
            strokeDashoffset={-t * 30}
            opacity={ringIn}
            style={{ transform: `rotate(${breached ? Math.sin(frame * 2) * 2 * (1 - Math.min(1, (frame - crossAt) / 20)) : 0}deg)`, transformOrigin: `${B.x}px ${B.y}px` }}
          />
        </svg>
        {frame >= at(W7.limites) && (
          <div style={{ position: "absolute", left: B.x, top: B.y + B.r + 18, transform: `translateX(-50%) scale(${spring({ frame: frame - at(W7.limites), fps, config: emo.arrive })})` }}>
            <Pill kind="neg" icon="x" size={32}>
              limite ignorado
            </Pill>
          </div>
        )}
        <Ripple at={crossAt} x={B.x + 150} y={B.y - 160} color={c2.red} max={200} />

        <SnapThread from={[P.x - 50, P.y + 50]} to={[B.x + 50, B.y - 50]} at={at(W7.pessoa) + 6} snapAt={at(W7.negociacao) + 6} bend={0.3} color={v7.dimOnDark} glow="rgba(255,255,255,0.08)" />

        {/* você: encolhe quando é desvalorizado */}
        <div
          style={{
            position: "absolute",
            left: B.x - 80,
            top: B.y - 80,
            opacity: interpolate(yIn, [0, 0.3], [0, 1], clamp),
            transform: `scale(${(0.85 + yIn * 0.15) * (1 - devalue * 0.16)}) translateY(${devalue * 20}px)`,
            filter: `saturate(${1 - devalue * 0.6})`,
          }}
        >
          <Avatar size={160} tone="turq" ring />
        </div>
        {/* quem invade */}
        <div style={{ position: "absolute", left: P.x - 70, top: P.y - 70, ...pIn.style }}>
          <Avatar size={140} tone="mist" />
        </div>

        {/* o seu valor a cair */}
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 1530,
            padding: "30px 40px",
            borderRadius: 34,
            background: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.18)",
            opacity: interpolate(card, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - card) * 100}px)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ ...t2.mono, fontSize: 24, color: v7.dimOnDark }}>o seu valor</span>
            <span style={{ ...t2.head, fontSize: 64, color: devalue > 0.3 ? c2.redLight : c2.white, fontVariantNumeric: "tabular-nums" }}>
              R$ {value.toLocaleString("pt-BR")}
            </span>
          </div>
          <div style={{ marginTop: 18, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
            <div style={{ width: `${(1 - devalue * 0.65) * 100}%`, height: "100%", borderRadius: 8, background: devalue > 0.3 ? c2.red : c2.aqua }} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 5. Os atrasados crónicos: o relógio come o seu tempo, e depois o seu trabalho ———
export const S5Atrasados: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.atrasados.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const C = { x: 540, y: 1110, r: 190 };
  const clockIn = spring({ frame: frame - at(W7.atrasados), fps, config: emo.arrive });
  const spin = Math.max(0, (frame - at(W7.atrasados)) / fps);
  const minute = spin * 300;
  const hour = 60 + spin * 25;
  const lost = interpolate(frame, [at(W7.atrasados), at(W7.tempo) + 6], [0, 210], { easing: ease.inOut, ...clamp });
  const yIn = useArrive(at(W7.cronicos), -180, 60);
  const ghostIn = interpolate(frame, [at(W7.cronicos), at(W7.cronicos) + 10], [0, 1], clamp);
  const work = spring({ frame: frame - at(W7.respeitar), fps, config: emo.arrive });
  const killed = spring({ frame: frame - at(W7.trabalho), fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const tap = Math.abs(Math.sin(frame / 4)) * 8;
  const Y = { x: 260, y: 1500 };
  const G = { x: 820, y: 1500 };

  return (
    <SceneShell surface="fog" pattern="ledger" enter="panel">
      <Bokeh seed="d5" count={10} color={v7.bokehLight} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Progress current={5} />
        <ChapterHead
          n={5}
          at={at(W7.cinco2)}
          title={[
            { text: "os", at: at(W7.os3) },
            { text: "atrasados", at: at(W7.atrasados) },
            { text: "crônicos", at: at(W7.cronicos), style: { color: c2.red } },
          ]}
        />
        <Caption
          top={500}
          words={[
            { text: "Se", at: at(W7.se2) },
            { text: "a", at: at(W7.a2) },
            { text: "pessoa", at: at(W7.pessoa2) },
            { text: "não", at: at(W7.nao2), style: { color: c2.red, fontWeight: 600 } },
            { text: "respeita", at: at(W7.respeita2) },
            { text: "o", at: at(W7.o) },
            { text: "seu", at: at(W7.seu) },
            { text: "tempo,", at: at(W7.tempo), style: { color: c2.turqDeep, fontWeight: 600 } },
            { text: "também", at: at(W7.tambem) },
            { text: "não", at: at(W7.nao3), style: { color: c2.red, fontWeight: 600 } },
            { text: "vai", at: at(W7.vai2) },
            { text: "respeitar", at: at(W7.respeitar) },
            { text: "seu", at: at(W7.seu2) },
            { text: "trabalho.", at: at(W7.trabalho), style: { color: c2.ink, fontWeight: 600 } },
          ]}
        />

        {/* relógio: o tempo perdido enche-se a vermelho */}
        <div
          style={{
            position: "absolute",
            left: C.x - C.r,
            top: C.y - C.r,
            width: C.r * 2,
            height: C.r * 2,
            borderRadius: "50%",
            background: c2.white,
            boxShadow: `0 40px 80px -30px ${c2.shadowDeep}, inset 0 0 0 2px ${c2.line}`,
            opacity: interpolate(clockIn, [0, 0.3], [0, 1], clamp),
            transform: `scale(${0.8 + clockIn * 0.2})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 16,
              borderRadius: "50%",
              background: `conic-gradient(from 60deg, ${c2.glowRed} 0deg, ${c2.glowRed} ${lost}deg, transparent ${lost}deg)`,
            }}
          />
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: C.r - 3,
                top: 18,
                width: 6,
                height: i % 3 ? 16 : 28,
                borderRadius: 3,
                background: i % 3 ? c2.inkFaint : c2.ink,
                transformOrigin: `3px ${C.r - 18}px`,
                transform: `rotate(${i * 30}deg)`,
              }}
            />
          ))}
          <div style={{ position: "absolute", left: C.r - 5, top: C.r - 100, width: 10, height: 100, borderRadius: 5, background: c2.ink, transformOrigin: "5px 100px", transform: `rotate(${hour}deg)` }} />
          <div style={{ position: "absolute", left: C.r - 3, top: C.r - 150, width: 6, height: 150, borderRadius: 3, background: c2.red, transformOrigin: "3px 150px", transform: `rotate(${minute}deg)` }} />
          <div style={{ position: "absolute", left: C.r - 12, top: C.r - 12, width: 24, height: 24, borderRadius: 12, background: c2.ink }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: C.y - C.r - 56, textAlign: "center", ...t2.mono, fontSize: 24, opacity: interpolate(clockIn, [0, 0.4], [0, 1], clamp) }}>
          reunião · 14:00
        </div>
        {frame >= at(W7.tempo) && (
          <div style={{ position: "absolute", left: C.x + 150, top: C.y - C.r - 10, transform: `scale(${spring({ frame: frame - at(W7.tempo), fps, config: emo.arrive })})` }}>
            <Pill kind="neg" size={36}>
              +40 min
            </Pill>
          </div>
        )}

        <SnapThread from={[Y.x + 75, Y.y]} to={[G.x - 75, G.y]} at={at(W7.cronicos) + 6} snapAt={at(W7.trabalho) + 2} bend={0.12} />

        {/* você à espera (bate o pé) */}
        <div style={{ position: "absolute", left: Y.x - 75, top: Y.y - 75, ...yIn.style }}>
          <div style={{ transform: `translateY(${-tap}px)` }}>
            <Avatar size={150} tone="turq" ring />
          </div>
          <div
            style={{
              position: "absolute",
              left: 120,
              top: -60,
              padding: "12px 22px",
              borderRadius: 30,
              background: c2.white,
              boxShadow: `0 10px 24px -12px ${c2.shadowDeep}`,
              ...t2.head,
              fontSize: 36,
              color: c2.inkSoft,
              letterSpacing: "0.1em",
            }}
          >
            {".".repeat(1 + (Math.floor(frame / 8) % 3))}
          </div>
        </div>
        {/* o lugar vazio de quem não chegou */}
        <div
          style={{
            position: "absolute",
            left: G.x - 75,
            top: G.y - 75,
            width: 150,
            height: 150,
            borderRadius: 75,
            border: `4px dashed ${c2.inkFaint}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...t2.impact,
            fontSize: 90,
            color: c2.inkFaint,
            opacity: ghostIn * (0.6 + Math.sin(frame / 6) * 0.25),
          }}
        >
          ?
        </div>

        {/* o seu trabalho, desrespeitado */}
        <div
          style={{
            position: "absolute",
            left: 250,
            right: 250,
            top: 1660,
            height: 130,
            borderRadius: 30,
            background: c2.white,
            boxShadow: `0 24px 50px -24px ${c2.shadowDeep}`,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "0 34px",
            color: killed > 0.3 ? c2.inkFaint : c2.turqDeep,
            opacity: interpolate(work, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - work) * 80}px)`,
          }}
        >
          <IconDoc size={60} stroke={1.8} />
          <div style={{ ...t2.head, fontSize: 44, color: killed > 0.3 ? c2.inkFaint : c2.ink, textDecoration: killed > 0.3 ? "line-through" : "none", textDecorationColor: c2.red }}>
            seu trabalho
          </div>
          {killed > 0.01 && (
            <div style={{ position: "absolute", right: -24, top: -28, transform: `scale(${2 - killed}) rotate(-8deg)`, opacity: Math.min(1, killed * 2) }}>
              <Badge kind="neg" icon="x" size={72} />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Negócios certos começam com as pessoas certas: as ligações boas ———
const RIGHT = [
  { x: 210, y: 1120, i: 0 },
  { x: 870, y: 1120, i: 1 },
  { x: 260, y: 1580, i: 2 },
  { x: 820, y: 1580, i: 3 },
];

export const S6Certas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.certas.from);
  const push = useCameraPush(durationInFrames, 1.06);
  const breath = useBreath(1.1, 0.8);
  const C = { x: 540, y: 1350 };
  const beat = useHeartbeat(at(W7.certas), 2);
  const warm = interpolate(frame, [at(W7.certos), at(W7.certas) + 0.4 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const you = spring({ frame: frame - 6, fps, config: emo.spring });

  return (
    <SceneShell surface="fog" pattern="dots" enter="zoom">
      <Bokeh seed="d6" count={14} color={emo.warm} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <Progress current={6} />
        <div style={{ position: "absolute", top: 220, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.head, fontSize: 100 }}
            gap={24}
            rise={44}
            words={[
              { text: "Negócios", at: at(W7.negocios2) },
              { text: "certos", at: at(W7.certos), style: { ...t2.impact, fontSize: 124, color: c2.green } },
            ]}
          />
          <SyncedWords
            style={{ ...t2.light, fontSize: 66, marginTop: 10 }}
            gap={16}
            words={[
              { text: "começam", at: at(W7.comecam) },
              { text: "com", at: at(W7.com3) },
              { text: "as", at: at(W7.as) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.head, fontSize: 100, marginTop: 6 }}
            gap={24}
            rise={44}
            words={[
              { text: "pessoas", at: at(W7.pessoas2) },
              { text: "certas.", at: at(W7.certas), style: { ...t2.impact, fontSize: 124, color: c2.green } },
            ]}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: C.x - 520,
            top: C.y - 460,
            width: 1040,
            height: 920,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${emo.warm}, ${emo.warmClear} 65%)`,
            opacity: warm,
          }}
        />
        {RIGHT.map((p) => (
          <Thread key={`t${p.i}`} from={[p.x, p.y]} to={[C.x, C.y]} at={at(W7.pessoas2) + p.i * 2} bend={p.i % 2 ? -0.15 : 0.15} color={c2.green} glow={c2.glowGreen} width={4} />
        ))}
        {RIGHT.map((p) => {
          const a = useArrive(at(W7.certos) + p.i * 3, (p.x - C.x) * 0.5, 160); // eslint-disable-line react-hooks/rules-of-hooks
          const ok = spring({ frame: frame - (at(W7.pessoas2) + 6 + p.i * 2), fps, config: emo.arrive }); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={p.i} style={{ position: "absolute", left: p.x - 70, top: p.y - 70 + breath.float * (p.i % 2 ? 1 : -1), ...a.style }}>
              <Avatar size={140} tone="white" />
              <div style={{ position: "absolute", right: -10, top: -10, transform: `scale(${ok})` }}>
                <Badge kind="pos" size={56} />
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: C.x - 100, top: C.y - 100, opacity: you, transform: `scale(${(0.8 + you * 0.2) * beat})` }}>
          <Avatar size={200} tone="turq" ring />
        </div>
        <Ripple at={at(W7.certas)} x={C.x} y={C.y} color={c2.green} max={460} />
        <Ripple at={at(W7.certas) + 12} x={C.x} y={C.y} color={c2.turq} max={620} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Fecho: siga para mais insights que te fazem vender melhor ———
const InsightIcon: React.FC<{ kind: number }> = ({ kind }) => (
  <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {kind === 0 && <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />}
    {kind === 1 && <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />}
    {kind === 2 && (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="0.8" fill="currentColor" />
      </>
    )}
  </svg>
);

export const S7Siga: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES7.siga.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const Bt = { x: 540, y: 1270 };
  const btnIn = spring({ frame: frame - at(W7.siga), fps, config: emo.arrive });
  const pressAt = at(W7.para2) - 2;
  const press = interpolate(frame, [pressAt, pressAt + 3, pressAt + 9], [0, 1, 0], clamp);
  const followed = frame >= pressAt + 4;
  const chart = interpolate(frame, [at(W7.vender) - 2, at(W7.melhor) + 4], [0, 1], { easing: emo.ease, ...clamp });
  const cards = [
    { x: 220, y: 980, k: 0 },
    { x: 540, y: 900, k: 1 },
    { x: 860, y: 980, k: 2 },
  ];

  return (
    <SceneShell surface="stone" pattern="rings" enter="iris" irisAt={[540, 1270]}>
      <Bokeh seed="d7" count={12} color={v7.bokehLight} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords style={{ ...t2.hero, fontSize: 180 }} rise={60} words={[{ text: "Siga", at: at(W7.siga) }]} />
          <SyncedWords
            style={{ ...t2.light, fontSize: 64, marginTop: 10 }}
            gap={16}
            words={[
              { text: "para", at: at(W7.para2) },
              { text: "mais", at: at(W7.mais) },
              { text: "insights", at: at(W7.insights), style: { color: c2.turqDeep, fontWeight: 600 } },
              { text: "que", at: at(W7.que2) },
              { text: "te", at: at(W7.te4) },
              { text: "fazem", at: at(W7.fazem) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.head, fontSize: 96, marginTop: 6 }}
            gap={24}
            rise={44}
            words={[
              { text: "vender", at: at(W7.vender) },
              { text: "melhor.", at: at(W7.melhor), style: { ...t2.impact, fontSize: 120, color: c2.green } },
            ]}
          />
        </div>

        {/* insights que saem do botão, ligados a ele */}
        {cards.map((c) => (
          <Thread key={`t${c.k}`} from={[Bt.x, Bt.y - 60]} to={[c.x, c.y + 50]} at={at(W7.insights) + c.k * 3} bend={c.k === 1 ? 0 : c.k === 0 ? 0.2 : -0.2} width={3} />
        ))}
        {cards.map((c) => {
          const a = useArrive(at(W7.insights) + c.k * 3, Bt.x - c.x, Bt.y - c.y); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div
              key={c.k}
              style={{
                position: "absolute",
                left: c.x - 60,
                top: c.y - 60,
                width: 120,
                height: 120,
                borderRadius: 32,
                background: c2.white,
                color: c2.turqDeep,
                boxShadow: `0 24px 50px -24px ${c2.shadowDeep}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...a.style,
              }}
            >
              <InsightIcon kind={c.k} />
            </div>
          );
        })}

        {/* botão seguir → seguindo */}
        <div
          style={{
            position: "absolute",
            left: Bt.x - 260,
            top: Bt.y - 70,
            width: 520,
            height: 140,
            borderRadius: 70,
            background: followed ? c2.white : c2.turq,
            boxShadow: `0 30px 60px -24px ${c2.shadowTurq}, inset 0 0 0 3px ${followed ? c2.turq : "rgba(255,255,255,0.25)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            ...t2.head,
            color: followed ? c2.turqDeep : c2.white,
            fontSize: 60,
            opacity: interpolate(btnIn, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - btnIn) * 100}px) scale(${(0.85 + btnIn * 0.15) * (1 - press * 0.07)})`,
          }}
        >
          {followed ? <IconCheck size={60} stroke={3} /> : <span style={{ fontSize: 72, fontWeight: 400, marginTop: -6 }}>+</span>}
          {followed ? "Seguindo" : "Seguir"}
        </div>
        <Ripple at={pressAt + 3} x={Bt.x} y={Bt.y} color={c2.turq} max={420} />

        {/* vendas a subir */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: chart > 0 ? 1 : 0 }}>
          <path
            d="M 180 1720 L 360 1650 L 520 1680 L 700 1560 L 900 1440"
            stroke={c2.green}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${chart} 1`}
          />
          {chart > 0.97 && <circle cx={900} cy={1440} r={18} fill={c2.green} />}
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
};
