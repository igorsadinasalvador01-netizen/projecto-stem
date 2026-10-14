import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, sceneThemes, springs } from "../theme2";
import { t2 } from "../type2";
import { SCENES2, W2, HITS2 } from "../timeline2";
import { clamp, Rise, SyncedWords, useAt, useBreath } from "../../components/Motion";
import { SceneShell } from "../components/Shell";
import { Avatar, Card, IconCheck, IconDoc, Pill } from "../components/Kit";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// ——— Cena 1: o melhor vendedor bate a meta todos os meses (anel de meta) ———
export const S01Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.hook.from);
  const th = sceneThemes.hook;
  const R = 250;
  const C = 2 * Math.PI * R;
  const prog = interpolate(frame, [at(W2.faz) - 6, at(W2.meta) + 2], [0, 1], { easing: ease.inOut, ...clamp });
  const done = spring({ frame: frame - at(W2.meta) - 2, fps, config: springs.bouncy });
  const breath = useBreath(1.2, 0.6);

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="none">
      <div style={{ position: "absolute", top: 250, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 70 }}
          gap={20}
          words={[
            { text: "O", at: at(W2.melhor) - 4 },
            { text: "melhor", at: at(W2.melhor) },
          ]}
        />
        <SyncedWords style={{ ...t2.hero, fontSize: 168 }} rise={60} words={[{ text: "vendedor", at: at(W2.vendedor) }]} />
        <SyncedWords
          style={{ ...t2.mono, fontSize: 24, marginTop: 18 }}
          words={[{ text: "da minha empresa", at: at(W2.empresa) - 6 }]}
        />
      </div>

      {/* Anel de meta */}
      <div
        style={{
          position: "absolute",
          left: 540 - R - 40,
          top: 990 - R - 40,
          width: 2 * R + 80,
          height: 2 * R + 80,
          transform: `scale(${breath.scale})`,
        }}
      >
        <Rise delay={at(W2.faz) - 10} y={60} from={0.85}>
          <svg width={2 * R + 80} height={2 * R + 80} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={R + 40} cy={R + 40} r={R} fill="none" stroke={c2.turqMist} strokeWidth={36} />
            <circle
              cx={R + 40}
              cy={R + 40}
              r={R}
              fill="none"
              stroke={th.accent}
              strokeWidth={36}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - prog)}
              style={{ filter: `drop-shadow(0 10px 24px ${c2.glowTurq})` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ ...t2.hero, fontSize: 150, fontVariantNumeric: "tabular-nums" }}>
              {Math.round(prog * 100)}
              <span style={{ ...t2.light, fontSize: 80 }}>%</span>
            </div>
            <div style={{ height: 90, display: "flex", alignItems: "center", marginTop: 6 }}>
              {done > 0.01 ? (
                <div style={{ transform: `scale(${done})`, opacity: Math.min(1, done * 1.5) }}>
                  <Pill kind="pos" icon="check" size={40}>
                    Meta batida
                  </Pill>
                </div>
              ) : (
                <SyncedWords style={{ ...t2.light, fontSize: 48 }} words={[{ text: "bater meta", at: at(W2.bater) }]} />
              )}
            </div>
          </div>
        </Rise>
      </div>

      {/* Todos os meses */}
      <div style={{ position: "absolute", top: 1360, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16 }}>
        {MONTHS.map((m, i) => {
          const p = spring({ frame: frame - at(W2.todos) - i * 1.6, fps, config: springs.snappy });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: p > 0.5 ? th.accent : c2.mist,
                  color: c2.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.7 + p * 0.3})`,
                  boxShadow: p > 0.5 ? `0 10px 20px -8px ${c2.glowTurq}` : "none",
                }}
              >
                {p > 0.5 && <IconCheck size={30} stroke={3} />}
              </div>
              <div style={{ ...t2.mono, fontSize: 20, letterSpacing: "0.06em" }}>{m}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1520, left: 60, right: 60 }}>
        <SyncedWords
          style={{ ...t2.head, fontSize: 84 }}
          gap={22}
          words={[
            { text: "todos", at: at(W2.todos) },
            { text: "os", at: at(W2.todos) + 4 },
            { text: "meses.", at: at(W2.meses), style: { color: th.accent } },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 2: o cara do time, contratos e conversão 2× ———
export const S02Time: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.time.from);
  const th = sceneThemes.time;
  const phase2 = at(W2.naVerdade) - 4;
  const out1 = interpolate(frame, [phase2, phase2 + 0.32 * fps], [0, 1], { easing: ease.in, ...clamp });
  const ding = at(HITS2.ding);
  const grow = spring({ frame: frame - ding, fps, config: springs.heavy });
  const base = spring({ frame: frame - at(W2.taxa), fps, config: springs.smooth });
  const two = spring({ frame: frame - ding, fps, config: springs.bouncy });
  const H = 300;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 990]}>
      {/* Fase 1 — o time */}
      <AbsoluteFill style={{ opacity: 1 - out1, transform: `translateY(${-out1 * 120}px)` }}>
        <div style={{ position: "absolute", top: 300, left: 60, right: 60 }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 70, color: c2.whiteDim }}
            gap={18}
            words={[
              { text: "Tem", at: at(W2.tem) },
              { text: "um", at: at(W2.tem) + 4 },
              { text: "cara", at: at(W2.cara), style: { color: c2.white, fontWeight: 600 } },
              { text: "no", at: at(W2.cara) + 3 },
              { text: "meu", at: at(W2.cara) + 5 },
              { text: "time", at: at(W2.time) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.head, fontSize: 104, color: c2.white, marginTop: 14 }}
            gap={26}
            words={[
              { text: "fecha", at: at(W2.fecha) },
              { text: "muito", at: at(W2.muito) },
              { text: "contrato.", at: at(W2.contrato), style: { ...t2.impact, color: c2.white, fontSize: 130 } },
            ]}
          />
        </div>
        <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = spring({ frame: frame - at(W2.tem) - Math.abs(i - 2) * 3, fps, config: springs.smooth });
            const hero = i === 2;
            const h = spring({ frame: frame - at(W2.cara), fps, config: springs.bouncy });
            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * (hero ? 1 : interpolate(h, [0, 1], [1, 0.55])),
                  transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) scale(${hero ? 1 + h * 0.35 : 1 - h * 0.08})`,
                }}
              >
                <Avatar size={130} tone={hero && h > 0.5 ? "white" : "glass"} ring={hero && h > 0.5} />
              </div>
            );
          })}
        </div>
        {/* contratos a sair do vendedor */}
        <div style={{ position: "absolute", top: 1100, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
          {[0, 1, 2].map((i) => {
            const p = spring({ frame: frame - at(W2.fecha) - i * 4, fps, config: springs.snappy });
            const ok = spring({ frame: frame - at(W2.contrato) - i * 3, fps, config: springs.bouncy });
            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
                  transform: `translateY(${interpolate(p, [0, 1], [-200, 0])}px) rotate(${(i - 1) * 6 * (1 - p) + (i - 1) * 3}deg) scale(${interpolate(p, [0, 1], [0.5, 1])})`,
                }}
              >
                <Card radius={34} style={{ width: 230, height: 290, padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ color: c2.turqDeep }}>
                    <IconDoc size={64} stroke={1.8} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ height: 12, width: "90%", borderRadius: 6, background: c2.mist }} />
                    <div style={{ height: 12, width: "70%", borderRadius: 6, background: c2.mist }} />
                  </div>
                  <div style={{ transform: `scale(${ok})`, transformOrigin: "0% 50%", opacity: Math.min(1, ok * 1.5) }}>
                    <Pill kind="pos" icon="check" size={26}>
                      Fechado
                    </Pill>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Fase 2 — taxa de conversão 2× */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [phase2 + 4, phase2 + 0.4 * fps], [0, 1], clamp) }}>
        <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords style={{ ...t2.mono, fontSize: 28, color: c2.whiteDim }} words={[{ text: "taxa de conversão", at: at(W2.taxa) }]} />
          <div
            style={{
              ...t2.hero,
              fontSize: 330,
              color: c2.white,
              marginTop: 10,
              opacity: interpolate(two, [0, 0.3], [0, 1], clamp),
              transform: `scale(${interpolate(two, [0, 1], [0.4, 1])})`,
              textShadow: `0 30px 80px ${c2.shadowTurq}`,
            }}
          >
            2×
          </div>
          <div style={{ marginTop: -10, height: 80 }}>
            <Rise delay={at(W2.vezes)} y={30} from={0.8} blur={0}>
              <Pill kind="pos" icon="arrow" size={38} style={{ transform: "rotate(0deg)" }}>
                maior
              </Pill>
            </Rise>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1520 - 2 * H - 20, height: 2 * H + 20, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 90 }}>
          {[0, 1].map((i) => {
            const h = i === 0 ? H * base : H * base + H * grow;
            return (
              <div
                key={i}
                style={{
                  width: 230,
                  height: Math.max(8, h),
                  borderRadius: 36,
                  background: i === 0 ? c2.glassOnTurqStrong : c2.white,
                  border: `2px solid ${i === 0 ? c2.strokeOnTurq : c2.white}`,
                  boxShadow: i === 1 ? `0 30px 80px -20px ${c2.shadowTurq}` : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 1550, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 90 }}>
          {["demais", "ele"].map((lbl, i) => {
            const active = i === 0 && frame >= at(W2.demais);
            return (
              <div
                key={lbl}
                style={{
                  width: 230,
                  textAlign: "center",
                  ...t2.mono,
                  fontSize: 24,
                  color: i === 1 || active ? c2.white : c2.whiteDim,
                  opacity: base,
                }}
              >
                {lbl === "ele" ? "ele" : "os demais"}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 1640, left: 60, right: 60 }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 52, color: c2.whiteDim }}
            gap={14}
            words={[
              { text: "do", at: at(W2.demais) - 10 },
              { text: "que", at: at(W2.demais) - 8 },
              { text: "todos", at: at(W2.demais) - 6 },
              { text: "os", at: at(W2.demais) - 3 },
              { text: "demais", at: at(W2.demais), style: { color: c2.white } },
              { text: "vendedores.", at: at(W2.vendedores), style: { color: c2.white } },
            ]}
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Cena 3: parar perto dele para estudar o que faz diferente (lupa) ———
export const S03Estudo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.estudo.from);
  const th = sceneThemes.estudo;
  const lens = spring({ frame: frame - at(W2.parei), fps, config: springs.heavy });
  const t = frame / fps;
  const lx = interpolate(lens, [0, 1], [900, 560]) + Math.sin(t * 2.2) * 18;
  const ly = interpolate(lens, [0, 1], [1400, 860]) + Math.cos(t * 1.8) * 14;
  const avatar = spring({ frame: frame - at(W2.parei) + 8, fps, config: springs.smooth });

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="wipeUp">
      <div style={{ position: "absolute", top: 270, left: 60, right: 60 }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 70 }}
          gap={18}
          words={[
            { text: "Parei", at: at(W2.parei) },
            { text: "perto", at: at(W2.perto) },
            { text: "dele", at: at(W2.perto) + 7 },
          ]}
        />
        <SyncedWords
          style={{ ...t2.hero, fontSize: 132, marginTop: 6 }}
          gap={30}
          rise={50}
          words={[
            { text: "pra", at: at(W2.estudar) - 4 },
            { text: "estudar.", at: at(W2.estudar) },
          ]}
        />
      </div>

      {/* avatar estudado + marcadores de observação */}
      <div
        style={{
          position: "absolute",
          left: 540 - 120,
          top: 860 - 120,
          opacity: avatar,
          transform: `scale(${0.8 + avatar * 0.2})`,
        }}
      >
        <Avatar size={240} tone="turq" />
      </div>
      {[
        { x: 250, y: 700, d: 0 },
        { x: 820, y: 760, d: 8 },
        { x: 300, y: 1060, d: 16 },
      ].map((m, i) => {
        const p = spring({ frame: frame - at(W2.estudar) - m.d, fps, config: springs.bouncy });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x - 18,
              top: m.y - 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `3px solid ${th.accent}`,
              background: c2.white,
              transform: `scale(${p})`,
              boxShadow: `0 0 0 ${10 * p}px ${c2.turqMist}`,
            }}
          />
        );
      })}

      {/* lupa */}
      <div style={{ position: "absolute", left: lx - 170, top: ly - 170, opacity: interpolate(lens, [0, 0.3], [0, 1], clamp) }}>
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: "50%",
            border: `22px solid ${c2.ink}`,
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75), rgba(214,242,242,0.35) 55%, rgba(18,181,186,0.12))`,
            boxShadow: `0 40px 80px -24px ${c2.shadowDeep}, inset 0 0 0 4px ${c2.white}`,
            backdropFilter: "blur(1.5px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 290,
            width: 46,
            height: 190,
            borderRadius: 23,
            background: c2.ink,
            transform: "rotate(-45deg)",
            transformOrigin: "50% 0%",
          }}
        />
      </div>

      <div style={{ position: "absolute", top: 1330, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 56 }}
          gap={14}
          words={[
            { text: "o", at: at(W2.estudar) + 7 },
            { text: "que", at: at(W2.estudar) + 12 },
            { text: "ele", at: at(W2.estudar) + 16 },
            { text: "tava", at: at(W2.fazendo) - 5 },
            { text: "fazendo", at: at(W2.fazendo) },
          ]}
        />
        <SyncedWords style={{ ...t2.impact, fontSize: 200, color: th.accent, marginTop: 4 }} rise={60} words={[{ text: "diferente.", at: at(W2.diferente) }]} />
      </div>
    </SceneShell>
  );
};
