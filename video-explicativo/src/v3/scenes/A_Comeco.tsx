import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, springs } from "../../v2/theme2";
import { t2 } from "../../v2/type2";
import { SCENES3, W3, sceneThemes3 } from "../timeline3";
import { clamp, SyncedWords, useAt, useBreath } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar, Badge, Card, Pill } from "../../v2/components/Kit";

// ——— Cena 1: não precisa saber tudo para a primeira venda ———
export const S1Comeco: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES3.hook.from);
  const th = sceneThemes3.hook;
  const strike = interpolate(frame, [at(W3.tudo) + 4, at(W3.tudo) + 0.4 * fps], [0, 1], { easing: ease.out, ...clamp });
  const card = spring({ frame: frame - at(W3.sabendo) + 4, fps, config: springs.smooth });
  const fill = interpolate(frame, [at(W3.fazer) - 4, at(W3.primeira)], [0, 0.22], { easing: ease.inOut, ...clamp });
  const xMark = spring({ frame: frame - at(W3.tudo) - 6, fps, config: springs.bouncy });
  const flag = spring({ frame: frame - at(W3.primeira), fps, config: springs.bouncy });
  const breath = useBreath(1.2, 0.5);
  const TRACK = 820;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="none">
      <div style={{ position: "absolute", top: 250, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 64 }}
          gap={16}
          words={[
            { text: "Você", at: at(W3.voce) },
            { text: "não", at: at(W3.nao), style: { color: c2.red, fontWeight: 600 } },
            { text: "precisa", at: at(W3.precisa) },
            { text: "começar", at: at(W3.comecar) },
          ]}
        />
        <div style={{ position: "relative", marginTop: 6 }}>
          <SyncedWords
            style={{ ...t2.hero, fontSize: 150 }}
            gap={30}
            rise={60}
            words={[
              { text: "sabendo", at: at(W3.sabendo) },
              { text: "tudo.", at: at(W3.tudo) },
            ]}
          />
          {/* risco vermelho: sinal negativo */}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "54%",
              height: 14,
              borderRadius: 7,
              width: `calc(${strike * 100}% + 20px)`,
              background: c2.red,
              boxShadow: `0 8px 20px -6px ${c2.glowRed}`,
              opacity: strike > 0 ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* barra de conhecimento: a 1.ª venda chega muito antes dos 100% */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 70,
          right: 70,
          opacity: card,
          transform: `translateY(${(1 - card) * 90 + breath.float}px) scale(${0.95 + card * 0.05})`,
        }}
      >
        <Card radius={52} style={{ padding: "190px 50px 110px" }}>
          <div style={{ ...t2.mono, fontSize: 24, position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center" }}>nível de conhecimento</div>
          <div style={{ position: "relative", width: TRACK, height: 44, borderRadius: 22, background: c2.mist }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: TRACK * fill,
                borderRadius: 22,
                background: `linear-gradient(90deg, ${c2.turqLight}, ${c2.turq})`,
                boxShadow: `0 8px 20px -8px ${c2.glowTurq}`,
              }}
            />
            {/* 100% = "tudo" (não é preciso) */}
            <div style={{ position: "absolute", right: -8, top: -96, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ transform: `scale(${xMark})` }}>
                <Badge kind="neg" size={70} icon="x" />
              </div>
            </div>
            <div style={{ position: "absolute", right: -10, top: 60, ...t2.mono, fontSize: 24, color: c2.red, opacity: xMark }}>100%</div>
            {/* bandeira da 1.ª venda aos 22% */}
            <div
              style={{
                position: "absolute",
                left: TRACK * 0.22 - 6,
                bottom: 22,
                transformOrigin: "0% 100%",
                transform: `scale(${flag})`,
                opacity: Math.min(1, flag * 1.4),
              }}
            >
              <div style={{ width: 8, height: 150, borderRadius: 4, background: c2.green }} />
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  top: 0,
                  padding: "14px 30px",
                  borderRadius: "0 22px 22px 0",
                  background: c2.green,
                  color: c2.white,
                  fontFamily: t2.head.fontFamily,
                  fontWeight: 700,
                  fontSize: 42,
                  whiteSpace: "nowrap",
                  boxShadow: `0 12px 30px -10px ${c2.glowGreen}`,
                }}
              >
                1ª venda
              </div>
            </div>
            <div style={{ position: "absolute", left: TRACK * 0.22 - 30, top: 60, ...t2.mono, fontSize: 24, color: c2.green, opacity: flag }}>22%</div>
          </div>
        </Card>
      </div>

      <div style={{ position: "absolute", top: 1240, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 60 }}
          gap={14}
          words={[
            { text: "para", at: at(W3.para) },
            { text: "fazer", at: at(W3.fazer) },
            { text: "sua", at: at(W3.sua) },
          ]}
        />
        <SyncedWords
          style={{ ...t2.impact, fontSize: 150, color: c2.green }}
          gap={28}
          rise={60}
          words={[
            { text: "primeira", at: at(W3.primeira) },
            { text: "venda", at: at(W3.venda) },
          ]}
        />
        <SyncedWords
          style={{ ...t2.head, fontSize: 76, color: th.accent, marginTop: 4 }}
          gap={20}
          words={[
            { text: "no", at: at(W3.no) },
            { text: "digital.", at: at(W3.digital) },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 2: todo especialista já foi iniciante (escada) ———
export const S2Especialista: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES3.especialista.from);
  const th = sceneThemes3.especialista;
  const steps = 5;
  const stepW = 168;
  const stepH = 120;
  const x0 = 540 - (steps * stepW) / 2;
  const yBase = 1560;
  const top = spring({ frame: frame - at(W3.especialista), fps, config: springs.bouncy });
  const path = interpolate(frame, [at(W3.ja), at(W3.iniciante) + 4], [0, 1], { easing: ease.inOut, ...clamp });
  const low = spring({ frame: frame - at(W3.iniciante), fps, config: springs.bouncy });
  const dia = spring({ frame: frame - at(W3.um), fps, config: springs.smooth });

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540 - 410 + 0.22 * 820, 860]}>
      <div style={{ position: "absolute", top: 240, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 64, color: c2.whiteDim }}
          gap={16}
          words={[{ text: "Todo", at: at(W3.todo) }]}
        />
        <SyncedWords style={{ ...t2.hero, fontSize: 150, color: c2.white }} rise={60} words={[{ text: "especialista", at: at(W3.especialista) }]} />
        <SyncedWords
          style={{ ...t2.light, fontSize: 64, color: c2.whiteDim, marginTop: 10 }}
          gap={16}
          words={[
            { text: "já", at: at(W3.ja) },
            { text: "foi", at: at(W3.foi) },
            { text: "iniciante", at: at(W3.iniciante), style: { ...t2.impact, fontSize: 96, color: c2.white } },
            { text: "um", at: at(W3.um) },
            { text: "dia.", at: at(W3.dia) },
          ]}
        />
      </div>

      {/* escada */}
      {Array.from({ length: steps }).map((_, i) => {
        const p = spring({ frame: frame - at(W3.todo) - i * 3, fps, config: springs.smooth });
        const h = stepH * (i + 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + i * stepW,
              top: yBase - h,
              width: stepW - 12,
              height: h,
              borderRadius: 22,
              background: c2.glassOnTurq,
              border: `2px solid ${c2.strokeOnTurq}`,
              boxShadow: `inset 0 2px 0 ${c2.strokeOnTurq}`,
              transformOrigin: "50% 100%",
              transform: `scaleY(${p})`,
              opacity: p,
            }}
          />
        );
      })}
      {/* caminho tracejado a descer do topo até ao primeiro degrau */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d={`M ${x0 + 4.5 * stepW - 6} ${yBase - stepH * 5 - 30} C ${x0 + 3 * stepW} ${yBase - stepH * 5 - 80}, ${x0 + 1.5 * stepW} ${yBase - stepH * 2}, ${x0 + 0.5 * stepW - 6} ${yBase - stepH - 30}`}
          stroke={c2.white}
          strokeWidth={5}
          strokeDasharray="4 18"
          strokeLinecap="round"
          fill="none"
          opacity={0.8}
          pathLength={1}
          style={{ strokeDasharray: `${path} 1` }}
        />
      </svg>
      {/* especialista no topo */}
      <div style={{ position: "absolute", left: x0 + 4.5 * stepW - 6 - 80, top: yBase - stepH * 5 - 190, transform: `scale(${top})`, opacity: Math.min(1, top * 1.4) }}>
        <div style={{ position: "relative" }}>
          <Avatar size={160} tone="white" ring />
          <div style={{ position: "absolute", right: -14, top: -10 }}>
            <Badge kind="pos" size={60} />
          </div>
        </div>
      </div>
      {/* iniciante no primeiro degrau */}
      <div style={{ position: "absolute", left: x0 + 0.5 * stepW - 6 - 60, top: yBase - stepH - 150, transform: `scale(${low})`, opacity: Math.min(1, low * 1.4) }}>
        <Avatar size={120} tone="glass" />
      </div>
      <div style={{ position: "absolute", left: x0 - 10, top: yBase + 26, opacity: low, ...t2.mono, fontSize: 24, color: c2.white }}>iniciante</div>
      <div style={{ position: "absolute", right: x0 - 10, top: yBase + 26, opacity: top, ...t2.mono, fontSize: 24, color: c2.white }}>especialista</div>
      <div style={{ position: "absolute", left: x0 + 0.5 * stepW - 90, top: yBase - stepH + 30, opacity: dia, transform: `translateY(${(1 - dia) * 20}px)` }}>
        <Pill kind="white" size={28}>
          dia 1
        </Pill>
      </div>
    </SceneShell>
  );
};

// ——— Cena 3: a diferença — alguns começaram mesmo com medo ———
export const S3Diferenca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES3.diferenca.from);
  const th = sceneThemes3.diferenca;
  const pick = spring({ frame: frame - at(W3.alguns), fps, config: springs.smooth });
  const go = spring({ frame: frame - at(W3.comecaram), fps, config: springs.heavy });
  const gauge = spring({ frame: frame - at(W3.mesmo) + 2, fps, config: springs.smooth });
  const needle = interpolate(spring({ frame: frame - at(W3.medo) + 4, fps, config: springs.bouncy }), [0, 1], [-70, 62]);
  const movers = [1, 3];

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="panel">
      <div style={{ position: "absolute", top: 230, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.hero, fontSize: 150 }}
          gap={30}
          rise={60}
          words={[
            { text: "A", at: at(W3.a) },
            { text: "diferença", at: at(W3.diferenca) },
          ]}
        />
        <SyncedWords
          style={{ ...t2.light, fontSize: 62, marginTop: 10 }}
          gap={16}
          words={[
            { text: "é", at: at(W3.e) },
            { text: "que", at: at(W3.que) },
            { text: "alguns", at: at(W3.alguns), style: { color: c2.ink, fontWeight: 600 } },
            { text: "começaram", at: at(W3.comecaram), style: { color: c2.green, fontWeight: 600 } },
          ]}
        />
      </div>

      {/* fila de pessoas: algumas avançam */}
      <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const p = spring({ frame: frame - at(W3.a) - i * 3, fps, config: springs.smooth });
          const mover = movers.includes(i);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
                opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * (mover ? 1 : 1 - pick * 0.55),
                transform: `translateY(${(1 - p) * 80 + (mover ? go * 150 : 0)}px) scale(${mover ? 1 + go * 0.18 : 1 - pick * 0.06})`,
              }}
            >
              <Avatar size={140} tone={mover && pick > 0.5 ? "turq" : "mist"} />
              {mover && (
                <div style={{ transform: `scale(${go})`, opacity: go }}>
                  <Pill kind="pos" icon="check" size={26}>
                    começou
                  </Pill>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* medidor de medo (vermelho) */}
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: gauge, transform: `translateY(${(1 - gauge) * 80}px)` }}>
        <div style={{ position: "relative", width: 420, height: 230 }}>
          <svg width={420} height={230}>
            <defs>
              <linearGradient id="g3" x1="0" x2="1">
                <stop offset="0" stopColor={c2.mist} />
                <stop offset="0.55" stopColor={c2.redSoft} />
                <stop offset="1" stopColor={c2.red} />
              </linearGradient>
            </defs>
            <path d="M 30 210 A 180 180 0 0 1 390 210" stroke="url(#g3)" strokeWidth={34} fill="none" strokeLinecap="round" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 210 - 5,
              top: 50,
              width: 10,
              height: 160,
              borderRadius: 5,
              background: c2.ink,
              transformOrigin: "50% 100%",
              transform: `rotate(${needle}deg)`,
            }}
          />
          <div style={{ position: "absolute", left: 210 - 20, top: 190, width: 40, height: 40, borderRadius: 20, background: c2.ink }} />
        </div>
        <SyncedWords
          style={{ ...t2.light, fontSize: 62, marginTop: 30 }}
          gap={16}
          words={[
            { text: "mesmo", at: at(W3.mesmo) },
            { text: "com", at: at(W3.com) },
            { text: "medo.", at: at(W3.medo), style: { ...t2.impact, fontSize: 110, color: c2.red } },
          ]}
        />
      </div>
    </SceneShell>
  );
};
