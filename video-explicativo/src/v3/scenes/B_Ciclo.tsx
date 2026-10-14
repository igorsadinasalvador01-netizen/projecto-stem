import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, springs } from "../../v2/theme2";
import { t2 } from "../../v2/type2";
import { HITS3, SCENES3, W3, sceneThemes3 } from "../timeline3";
import { clamp, Rise, SyncedWords, useAt } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Card, IconCheck } from "../../v2/components/Kit";

// ——— Cena 4: aprenda, aplique e melhore todos os dias (ciclo) ———
export const S4Ciclo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES3.ciclo.from);
  const th = sceneThemes3.ciclo;
  const cx = 540;
  const cy = 1010;
  const R = 300;
  const nodes = [
    { label: "Aprenda", at: at(W3.aprenda), ang: -90 },
    { label: "Aplique", at: at(W3.aplique), ang: 30 },
    { label: "Melhore", at: at(W3.melhore), ang: 150 },
  ];
  const arc = interpolate(frame, [at(W3.aprenda), at(W3.melhore) + 0.5 * fps], [0, 1], { easing: ease.inOut, ...clamp });
  const speed = interpolate(frame, [at(W3.todos), at(W3.dias) + 0.4 * fps], [0, 1], { easing: ease.in, ...clamp });
  const rot = (frame / fps) * 6 + speed * speed * 140;
  const days = Math.round(interpolate(frame, [at(W3.todos), at(W3.dias) + 0.5 * fps], [1, 30], { easing: ease.in, ...clamp }));
  const counter = spring({ frame: frame - at(W3.todos), fps, config: springs.bouncy });
  const C = 2 * Math.PI * R;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 640]}>
      <div style={{ position: "absolute", top: 220, left: 50, right: 50 }}>
        <SyncedWords
          style={{ ...t2.hero, fontSize: 112, color: c2.white }}
          gap={26}
          rise={50}
          words={[
            { text: "Aprenda,", at: at(W3.aprenda) },
            { text: "aplique", at: at(W3.aplique) },
            { text: "e", at: at(W3.e2) },
            { text: "melhore", at: at(W3.melhore), style: { ...t2.impact, color: c2.white, fontSize: 132 } },
          ]}
        />
      </div>

      {/* anel do ciclo */}
      <div style={{ position: "absolute", left: cx - R - 20, top: cy - R - 20, width: 2 * R + 40, height: 2 * R + 40, transform: `rotate(${rot}deg)` }}>
        <svg width={2 * R + 40} height={2 * R + 40} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke={c2.strokeOnTurq} strokeWidth={4} strokeDasharray="2 16" strokeLinecap="round" />
          <circle
            cx={R + 20}
            cy={R + 20}
            r={R}
            fill="none"
            stroke={th.accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - arc)}
          />
        </svg>
      </div>
      {nodes.map((n, i) => {
        const a = ((n.ang + rot) * Math.PI) / 180;
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const p = spring({ frame: frame - n.at, fps, config: springs.bouncy });
        const on = frame >= n.at;
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: x - 110,
              top: y - 110,
              width: 220,
              height: 220,
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              background: on ? c2.white : c2.glassOnTurq,
              border: `2px solid ${on ? c2.white : c2.strokeOnTurq}`,
              boxShadow: on ? `0 30px 60px -20px ${c2.shadowTurq}, 0 0 0 ${14 * p}px ${c2.glassOnTurq}` : "none",
              transform: `scale(${0.82 + 0.18 * (on ? p : 0)})`,
            }}
          >
            <div style={{ ...t2.mono, fontSize: 20, color: on ? c2.turq : c2.whiteFaint }}>0{i + 1}</div>
            <div style={{ ...t2.head, fontSize: 42, color: on ? c2.turqDark : c2.whiteDim }}>{n.label}</div>
          </div>
        );
      })}

      {/* contador de dias no centro */}
      <div
        style={{
          position: "absolute",
          left: cx - 160,
          top: cy - 110,
          width: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: counter,
          transform: `scale(${0.6 + counter * 0.4})`,
        }}
      >
        <div style={{ ...t2.mono, fontSize: 22, color: c2.aqua }}>dia</div>
        <div style={{ ...t2.hero, fontSize: 150, color: c2.white, fontVariantNumeric: "tabular-nums" }}>{days}</div>
      </div>

      <div style={{ position: "absolute", top: 1500, left: 50, right: 50 }}>
        <SyncedWords
          style={{ ...t2.impact, fontSize: 130, color: c2.white }}
          gap={26}
          rise={50}
          words={[
            { text: "todos", at: at(W3.todos) },
            { text: "os", at: at(W3.os) },
            { text: "dias.", at: at(W3.dias) },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// Bandeira "1ª venda" (verde = positivo); ghost = posição imaginada (tracejada).
const Flag: React.FC<{ ghost?: boolean; label: string }> = ({ ghost = false, label }) => (
  <div style={{ position: "relative", width: 360, height: 300 }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: 10,
        height: 300,
        borderRadius: 5,
        background: ghost ? "transparent" : c2.ink,
        border: ghost ? `4px dashed ${c2.turqDeep}` : "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 10,
        top: 0,
        padding: "22px 40px",
        borderRadius: "0 30px 30px 0",
        background: ghost ? "transparent" : c2.green,
        border: ghost ? `4px dashed ${c2.turqDeep}` : "none",
        color: ghost ? c2.turqDeep : c2.white,
        fontFamily: t2.head.fontFamily,
        fontWeight: 700,
        fontSize: 56,
        whiteSpace: "nowrap",
        boxShadow: ghost ? "none" : `0 24px 50px -16px ${c2.glowGreen}`,
      }}
    >
      {label}
    </div>
  </div>
);

// ——— Cena 5: a primeira venda está mais perto do que imagina (+ boom) ———
export const S5Perto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES3.perto.from);
  const th = sceneThemes3.perto;
  const boom = at(HITS3.boom);
  const flagIn = spring({ frame: frame - at(W3.primeira2), fps, config: springs.smooth });
  const near = spring({ frame: frame - at(W3.mais), fps, config: springs.heavy });
  const ghost = spring({ frame: frame - at(W3.doQue), fps, config: springs.smooth });
  const plant = spring({ frame: frame - boom, fps, config: springs.bouncy });
  const textOut = interpolate(frame, [boom - 3, boom + 0.12 * fps], [0, 1], { easing: ease.in, ...clamp });
  const flash = interpolate(frame, [boom, boom + 2, boom + 0.45 * fps], [0, 0.8, 0], { easing: ease.out, ...clamp });
  const note = spring({ frame: frame - boom - 6, fps, config: springs.bouncy });
  // a bandeira parte do horizonte (longe) e vem para perto
  const fy = interpolate(near, [0, 1], [1080, 1330]);
  const fx = interpolate(near, [0, 1], [290, 540]);
  const fs = interpolate(near, [0, 1], [0.32, 1]) * (1 + (plant > 0 ? Math.sin(Math.min(1, plant) * Math.PI) * 0.12 : 0));
  const perto = frame >= at(W3.perto);

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="zoom">
      <AbsoluteFill style={{ opacity: 1 - textOut, transform: `translateY(${-textOut * 100}px)` }}>
        <div style={{ position: "absolute", top: 200, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 60 }}
            gap={16}
            words={[
              { text: "A", at: at(W3.a2) },
              { text: "sua", at: at(W3.sua2) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.impact, fontSize: 150, color: c2.green }}
            gap={28}
            rise={60}
            words={[
              { text: "primeira", at: at(W3.primeira2) },
              { text: "venda", at: at(W3.venda2) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.light, fontSize: 56, marginTop: 14 }}
            gap={14}
            words={[
              { text: "pode", at: at(W3.pode) },
              { text: "estar", at: at(W3.estar) },
              { text: "mais", at: at(W3.mais), style: { ...t2.hero, fontSize: 96, color: c2.ink } },
              { text: "perto", at: at(W3.perto), style: { ...t2.hero, fontSize: 96, color: th.accent } },
            ]}
          />
          <SyncedWords
            style={{ ...t2.light, fontSize: 56 }}
            gap={14}
            words={[
              { text: "do", at: at(W3.doQue) },
              { text: "que", at: at(W3.doQue) + 3 },
              { text: "você", at: at(W3.voce2) },
              { text: "imagina.", at: at(W3.imagina), style: { ...t2.impact, fontSize: 78, color: c2.inkSoft } },
            ]}
          />
        </div>
      </AbsoluteFill>

      {/* bandeira imaginada (longe, tracejada) */}
      <div
        style={{
          position: "absolute",
          left: 290 - 5,
          top: 1080 - 300,
          transformOrigin: "0% 100%",
          transform: `scale(0.5)`,
          opacity: ghost * 0.9 * (1 - textOut),
        }}
      >
        <Flag ghost label="imagina" />
      </div>
      {/* bandeira real */}
      <div
        style={{
          position: "absolute",
          left: fx - 5 * fs,
          top: fy - 300 * fs,
          transformOrigin: "0% 0%",
          transform: `scale(${fs})`,
          opacity: flagIn,
        }}
      >
        <Flag label="1ª venda" />
      </div>
      {/* ondas no chão quando a bandeira assenta (boom) */}
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame, [boom + i * 4, boom + i * 4 + 1.1 * fps], [0, 1], { easing: ease.out, ...clamp });
        if (p <= 0 || p >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 700 * p,
              top: 1330 - 160 * p,
              width: 1400 * p,
              height: 320 * p,
              borderRadius: "50%",
              border: `${5 - i}px solid ${c2.turq}`,
              opacity: 1 - p,
            }}
          />
        );
      })}
      {/* distância */}
      <div style={{ position: "absolute", left: 120, top: 1500, opacity: flagIn * (1 - textOut), display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ ...t2.mono, fontSize: 22 }}>distância</div>
        <div
          style={{
            padding: "8px 22px",
            borderRadius: 999,
            background: perto ? c2.greenSoft : c2.paper,
            color: perto ? c2.green : c2.inkSoft,
            fontFamily: t2.head.fontFamily,
            fontWeight: 700,
            fontSize: 34,
          }}
        >
          {perto ? "perto" : "longe"}
        </div>
      </div>

      {/* notificação no boom */}
      <div style={{ position: "absolute", top: 480, left: 80, right: 80, opacity: Math.min(1, note * 1.4), transform: `translateY(${(1 - note) * -160}px) scale(${0.9 + note * 0.1})` }}>
        <Card radius={48} style={{ display: "flex", alignItems: "center", gap: 28, padding: "34px 40px" }}>
          <div style={{ width: 104, height: 104, borderRadius: 30, background: c2.green, color: c2.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 16px 36px -14px ${c2.glowGreen}` }}>
            <IconCheck size={60} stroke={2.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ ...t2.head, fontSize: 54 }}>Nova venda</span>
              <span style={{ ...t2.mono, fontSize: 20 }}>agora</span>
            </div>
            <div style={{ ...t2.body, fontSize: 34, marginTop: 4 }}>A sua primeira venda chegou.</div>
          </div>
        </Card>
      </div>
      <AbsoluteFill style={{ background: c2.white, opacity: flash, pointerEvents: "none" }} />
    </SceneShell>
  );
};

// ——— Cena 6: fecho (silêncio final) ———
export const S6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const th = sceneThemes3.outro;
  const chips = ["Aprenda", "Aplique", "Melhore"];
  const start = Math.round(0.15 * fps);
  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 1330]}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Rise delay={start} y={50}>
          <div style={{ ...t2.hero, fontSize: 190, color: c2.white, textAlign: "center" }}>Comece</div>
        </Rise>
        <Rise delay={start + 5} y={50}>
          <div style={{ ...t2.impact, fontSize: 130, color: c2.white, textAlign: "center", marginTop: -6 }}>mesmo com medo.</div>
        </Rise>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 70 }}>
          {chips.map((ch, i) => {
            const p = spring({ frame: frame - start - 14 - i * 5, fps, config: springs.smooth });
            return (
              <div key={ch} style={{ opacity: p, transform: `translateX(${(1 - p) * 120}px)` }}>
                <Card onTurq radius={999} style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 44px 20px 22px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: c2.white, color: c2.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconCheck size={38} stroke={3} />
                  </div>
                  <div style={{ ...t2.head, fontSize: 56, color: c2.white }}>
                    <span style={{ ...t2.mono, fontSize: 24, color: c2.aqua, marginRight: 18 }}>0{i + 1}</span>
                    {ch}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
