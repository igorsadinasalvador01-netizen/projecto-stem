import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, springs } from "../../v2/theme2";
import { HITS4, SCENES4, W4, d4, sceneThemes4 } from "../timeline4";
import { clamp, Rise, SyncedWords, useAt } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Badge } from "../../v2/components/Kit";
import { DarkCard, DarkPill, t4 } from "../DarkKit";

// ——— Cena 4: aprende errando, testando e melhorando (gráfico com quedas) ———
export const S4Aprende: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES4.aprende.from);
  const th = sceneThemes4.aprende;
  // pontos do percurso (x, y) num quadro 920 × 560
  const pts = [
    [0, 330],
    [150, 250],
    [270, 440], // erro
    [420, 300], // teste
    [560, 230], // melhoria
    [680, 170],
    [790, 90],
    [900, 20],
  ];
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const draw = interpolate(frame, [at(W4.aprende), at(W4.dias) + 0.5 * fps], [0, 1], { easing: ease.soft, ...clamp });
  const marks = [
    { i: 2, at: at(W4.errando), kind: "neg" as const, label: "erro" },
    { i: 3, at: at(W4.testando), kind: "turq" as const, label: "teste" },
    { i: 4, at: at(W4.melhorando), kind: "pos" as const, label: "melhoria" },
  ];
  const ox = 80;
  const oy = 820;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 1100]}>
      <div style={{ position: "absolute", top: 230, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 64 }}
          gap={16}
          words={[
            { text: "Você", at: at(W4.voce3) },
            { text: "aprende", at: at(W4.aprende), style: { color: d4.text, fontWeight: 600 } },
          ]}
        />
        <SyncedWords
          style={{ ...t4.hero, fontSize: 104 }}
          gap={24}
          rise={44}
          words={[
            { text: "errando,", at: at(W4.errando), style: { ...t4.impact, fontSize: 120, color: d4.red } },
            { text: "testando", at: at(W4.testando) },
          ]}
        />
        <SyncedWords
          style={{ ...t4.hero, fontSize: 104 }}
          gap={24}
          rise={44}
          words={[
            { text: "e", at: at(W4.e3) },
            { text: "melhorando", at: at(W4.melhorando), style: { ...t4.impact, fontSize: 124, color: d4.green } },
          ]}
        />
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* eixo */}
        <line x1={ox} y1={oy + 560} x2={ox + 920} y2={oy + 560} stroke={d4.stroke} strokeWidth={2} />
        {Array.from({ length: 12 }).map((_, i) => {
          const tick = interpolate(frame, [at(W4.todos) + i * 2, at(W4.todos) + i * 2 + 6], [0, 1], clamp);
          return <line key={i} x1={ox + 40 + i * 76} y1={oy + 560} x2={ox + 40 + i * 76} y2={oy + 560 - 18 * tick} stroke={d4.turq} strokeWidth={3} opacity={tick} />;
        })}
        <path
          d={d}
          transform={`translate(${ox} ${oy})`}
          stroke={d4.turq}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={`${draw} 1`}
          style={{ filter: `drop-shadow(0 0 14px ${d4.turqSoft})` }}
        />
      </svg>
      {marks.map((m) => {
        const p = spring({ frame: frame - m.at, fps, config: springs.bouncy });
        const [x, y] = pts[m.i];
        const color = m.kind === "neg" ? d4.red : m.kind === "pos" ? d4.green : d4.turq;
        return (
          <React.Fragment key={m.label}>
            <div
              style={{
                position: "absolute",
                left: ox + x - 22,
                top: oy + y - 22,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 0 ${10 * p}px ${d4.glass}, 0 0 30px ${color}`,
                transform: `scale(${p})`,
              }}
            />
            <div style={{ position: "absolute", left: ox + x - 90, top: oy + y + (m.kind === "neg" ? 46 : -110), width: 180, display: "flex", justifyContent: "center", transform: `scale(${p})`, opacity: Math.min(1, p * 1.4) }}>
              <DarkPill kind={m.kind} size={30}>
                {m.label}
              </DarkPill>
            </div>
          </React.Fragment>
        );
      })}

      <div style={{ position: "absolute", top: 1480, left: 50, right: 50 }}>
        <SyncedWords
          style={{ ...t4.impact, fontSize: 130 }}
          gap={26}
          rise={50}
          words={[
            { text: "todos", at: at(W4.todos) },
            { text: "os", at: at(W4.os) },
            { text: "dias.", at: at(W4.dias), style: { color: d4.turq } },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 5: não muda só a conta bancária — muda a mentalidade ———
export const S5Mentalidade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES4.mentalidade.from);
  const th = sceneThemes4.mentalidade;
  const t = frame / fps;
  const card = spring({ frame: frame - at(W4.sua) + 2, fps, config: springs.smooth });
  const plus = spring({ frame: frame - at(W4.bancaria), fps, config: springs.bouncy });
  const shrink = interpolate(frame, [at(W4.ela2) - 2, at(W4.ela2) + 0.5 * fps], [0, 1], { easing: ease.inOut, ...clamp });
  const orb = spring({ frame: frame - at(W4.muda2), fps, config: springs.heavy });

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="wipeUp">
      <div style={{ position: "absolute", top: 220, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 60 }}
          gap={14}
          words={[
            { text: "A", at: at(W4.a2) },
            { text: "primeira", at: at(W4.primeira2), style: { ...t4.impact, fontSize: 84, color: d4.turq } },
            { text: "venda", at: at(W4.venda2), style: { ...t4.impact, fontSize: 84, color: d4.turq } },
          ]}
        />
        <SyncedWords
          style={{ ...t4.head, fontSize: 84 }}
          gap={22}
          words={[
            { text: "não", at: at(W4.nao), style: { color: d4.red } },
            { text: "muda", at: at(W4.muda) },
            { text: "apenas", at: at(W4.apenas) },
          ]}
        />
      </div>

      {/* cartão bancário (estilo cartão premium) */}
      <div
        style={{
          position: "absolute",
          left: 540 - 420,
          top: 620,
          width: 840,
          perspective: 1600,
          opacity: card * (1 - shrink * 0.55),
          transform: `translate(${shrink * -250}px, ${(1 - card) * 160 + shrink * -60}px) scale(${1 - shrink * 0.55})`,
          transformOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            height: 520,
            borderRadius: 52,
            transform: `rotateY(${(1 - card) * -40 + Math.sin(t * 0.9) * 4}deg) rotateX(${8 + Math.cos(t * 0.7) * 2}deg)`,
            background: `linear-gradient(135deg, rgba(47,208,212,0.35) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.03) 60%, rgba(47,208,212,0.18) 100%)`,
            border: `1.5px solid ${d4.strokeStrong}`,
            boxShadow: `0 60px 120px -30px ${d4.black}, inset 0 2px 0 ${d4.strokeStrong}`,
            padding: "52px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ ...t4.mono, fontSize: 24, color: d4.dim }}>conta bancária</div>
            <div style={{ width: 90, height: 66, borderRadius: 14, background: `linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))` }} />
          </div>
          <div>
            <div style={{ ...t4.mono, fontSize: 22 }}>saldo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 10 }}>
              <div style={{ ...t4.hero, fontSize: 96, letterSpacing: "-0.04em" }}>R$</div>
              <div style={{ transform: `scale(${plus})`, opacity: Math.min(1, plus * 1.4), transformOrigin: "0% 50%" }}>
                <DarkPill kind="pos" icon="arrow" size={40}>
                  1ª venda
                </DarkPill>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ ...t4.mono, fontSize: 26, color: d4.faint, letterSpacing: "0.3em" }}>
                ••••
              </div>
            ))}
          </div>
          {/* reflexo */}
          <div style={{ position: "absolute", inset: -200, background: `linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.10) 48%, transparent 56%)`, transform: `translateX(${((t * 30) % 140) - 70}%)` }} />
        </div>
      </div>

      {/* esfera luminosa: a mentalidade */}
      <div style={{ position: "absolute", left: 540 - 260, top: 860 - 260 + 120, width: 520, height: 520, opacity: orb, transform: `scale(${0.4 + orb * 0.6})` }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 30 + i * 20,
              borderRadius: "50%",
              background: `conic-gradient(from ${t * (60 + i * 40) + i * 90}deg, ${d4.turq}, rgba(255,255,255,0.9), ${d4.turq}, rgba(47,208,212,0.1), ${d4.turq})`,
              filter: `blur(${28 + i * 10}px)`,
              opacity: 0.55 - i * 0.12,
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 150, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95), rgba(47,208,212,0.6) 45%, rgba(47,208,212,0) 75%)` }} />
      </div>
      <div style={{ position: "absolute", top: 1480, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 60 }}
          gap={14}
          words={[
            { text: "ela", at: at(W4.ela2) },
            { text: "muda", at: at(W4.muda2), style: { color: d4.text, fontWeight: 600 } },
            { text: "sua", at: at(W4.sua2) },
          ]}
        />
        <SyncedWords style={{ ...t4.impact, fontSize: 150, color: d4.turq }} rise={60} words={[{ text: "mentalidade.", at: at(W4.mentalidade) }]} />
      </div>
    </SceneShell>
  );
};

// ——— Cena 6: o esforço valeu a pena — continuar crescendo (+ boom) ———
export const S6Cresce: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES4.cresce.from);
  const th = sceneThemes4.cresce;
  const boom = at(HITS4.boom);
  const effort = interpolate(frame, [at(W4.esforco), at(W4.valeu) + 6], [0, 1], { easing: ease.inOut, ...clamp });
  const valeu = spring({ frame: frame - at(W4.valeu), fps, config: springs.bouncy });
  const cardIn = spring({ frame: frame - at(W4.todo) + 4, fps, config: springs.smooth });
  const phase2 = at(W4.voce5) - 4;
  const out1 = interpolate(frame, [phase2, phase2 + 0.3 * fps], [0, 1], { easing: ease.in, ...clamp });
  const punch = spring({ frame: frame - boom, fps, config: springs.bouncy });
  const flash = interpolate(frame, [boom, boom + 2, boom + 0.45 * fps], [0, 0.55, 0], { easing: ease.out, ...clamp });
  const bars = [0.25, 0.38, 0.5, 0.64, 0.8, 1];
  const shoot = interpolate(frame, [boom, boom + 0.8 * fps], [0, 1], { easing: ease.out, ...clamp });

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="zoom">
      <div style={{ position: "absolute", top: 220, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - out1, transform: `translateY(${-out1 * 80}px)` }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 62 }}
          gap={16}
          words={[
            { text: "Você", at: at(W4.voce4) },
            { text: "percebe", at: at(W4.percebe) },
            { text: "que", at: at(W4.percebe) + 8 },
          ]}
        />
        <SyncedWords
          style={{ ...t4.hero, fontSize: 124 }}
          gap={26}
          rise={50}
          words={[
            { text: "todo", at: at(W4.todo) },
            { text: "o", at: at(W4.todo) + 3 },
            { text: "esforço", at: at(W4.esforco) },
          ]}
        />
        <SyncedWords
          style={{ ...t4.impact, fontSize: 140, color: d4.green }}
          gap={26}
          rise={50}
          words={[
            { text: "valeu", at: at(W4.valeu) },
            { text: "a", at: at(W4.pena) - 2 },
            { text: "pena.", at: at(W4.pena) },
          ]}
        />
      </div>

      {/* barra de esforço */}
      <div style={{ position: "absolute", top: 860, left: 90, right: 90, opacity: cardIn * (1 - out1), transform: `translateY(${(1 - cardIn) * 80 - out1 * 80}px)` }}>
        <DarkCard radius={46} style={{ padding: "44px 48px", display: "flex", alignItems: "center", gap: 34 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...t4.mono, fontSize: 24, marginBottom: 22 }}>esforço</div>
            <div style={{ height: 30, borderRadius: 15, background: d4.glassStrong, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${effort * 100}%`, borderRadius: 15, background: valeu > 0.5 ? d4.green : d4.turq, boxShadow: `0 0 30px ${valeu > 0.5 ? d4.greenGlow : d4.turqSoft}` }} />
            </div>
          </div>
          <div style={{ transform: `scale(${valeu})`, opacity: Math.min(1, valeu * 1.4) }}>
            <Badge kind="pos" size={90} />
          </div>
        </DarkCard>
      </div>

      {/* crescimento contínuo */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [phase2 + 4, phase2 + 0.35 * fps], [0, 1], clamp) }}>
        <div style={{ position: "absolute", top: 240, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t4.light, fontSize: 64 }}
            gap={16}
            words={[
              { text: "e", at: at(W4.voce5) - 4 },
              { text: "você", at: at(W4.voce5) },
              { text: "pode", at: at(W4.pode) },
            ]}
          />
          <SyncedWords
            style={{ ...t4.hero, fontSize: 132 }}
            gap={26}
            rise={56}
            words={[
              { text: "continuar", at: at(W4.continuar) },
              { text: "crescendo.", at: at(W4.crescendo), style: { color: d4.turq } },
            ]}
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 820, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 26, transform: `scale(${1 + (punch > 0 ? Math.sin(Math.min(1, punch) * Math.PI) * 0.06 : 0)})`, transformOrigin: "50% 100%" }}>
          {bars.map((h, i) => {
            const p = spring({ frame: frame - at(W4.continuar) - i * 3, fps, config: springs.smooth });
            const last = i === bars.length - 1;
            return (
              <div
                key={i}
                style={{
                  width: 118,
                  height: Math.max(4, 700 * h * p + (last ? shoot * 120 : 0)),
                  borderRadius: 30,
                  background: last ? `linear-gradient(180deg, ${d4.turq}, rgba(47,208,212,0.35))` : `linear-gradient(180deg, ${d4.glassStrong}, ${d4.glass})`,
                  border: `1.5px solid ${last ? d4.turq : d4.stroke}`,
                  boxShadow: last ? `0 0 ${40 + punch * 40}px ${d4.turqSoft}` : "none",
                  opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
                }}
              />
            );
          })}
        </div>
        {/* ondas no boom */}
        {[0, 1, 2].map((i) => {
          const p = interpolate(frame, [boom + i * 4, boom + i * 4 + 1.1 * fps], [0, 1], { easing: ease.out, ...clamp });
          if (p <= 0 || p >= 1) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 - 760 * p,
                top: 1460 - 170 * p,
                width: 1520 * p,
                height: 340 * p,
                borderRadius: "50%",
                border: `${5 - i}px solid ${d4.turq}`,
                opacity: 1 - p,
              }}
            />
          );
        })}
        <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Rise delay={boom + 3} y={50} from={0.6} config={springs.bouncy}>
            <DarkPill kind="pos" icon="arrow" size={50}>
              crescendo
            </DarkPill>
          </Rise>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: d4.text, opacity: flash, pointerEvents: "none" }} />
    </SceneShell>
  );
};

// ——— Cena 7: fecho no silêncio ———
export const S7Fecho: React.FC = () => {
  const { fps } = useVideoConfig();
  const th = sceneThemes4.outro;
  const start = Math.round(0.15 * fps);
  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 1460]}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Rise delay={start} y={40}>
          <div style={{ ...t4.mono, fontSize: 30, color: d4.dim, textAlign: "center" }}>a primeira venda prova que</div>
        </Rise>
        <Rise delay={start + 5} y={60}>
          <div style={{ ...t4.hero, fontSize: 200, textAlign: "center", marginTop: 14 }}>é possível.</div>
        </Rise>
        <div style={{ marginTop: 60 }}>
          <Rise delay={start + 14} y={40} from={0.6} config={springs.bouncy}>
            <Badge kind="pos" size={130} />
          </Rise>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
