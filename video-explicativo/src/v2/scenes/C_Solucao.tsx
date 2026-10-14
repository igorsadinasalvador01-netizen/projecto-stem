import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, sceneThemes, springs } from "../theme2";
import { t2 } from "../type2";
import { SCENES2, W2 } from "../timeline2";
import { clamp, Rise, SyncedWords, useAt } from "../../components/Motion";
import { SceneShell } from "../components/Shell";
import { Card, IconCheck, IconDoc, IconSearch, Pill } from "../components/Kit";
import { Chapter } from "./B_Portas";

// ——— Cena 6: Porta 2 — Solução (plano em 3 passos + puzzle problema/solução) ———
export const S06Solucao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.p2.from);
  const th = sceneThemes.p2;
  const shrink = at(W2.mostra2) - 10;
  const planOut = interpolate(frame, [at(W2.voceConsegue) - 8, at(W2.voceConsegue) + 0.2 * fps], [0, 1], { easing: ease.in, ...clamp });
  const piecesIn = spring({ frame: frame - at(W2.voceConsegue) + 2, fps, config: springs.smooth });
  const merge = spring({ frame: frame - at(W2.resolvido), fps, config: springs.heavy });
  const solved = spring({ frame: frame - at(W2.resolvido) - 8, fps, config: springs.bouncy });
  const steps = [
    { at: at(W2.mostra2), icon: <IconSearch size={48} stroke={2} /> },
    { at: at(W2.exatamente), icon: <IconDoc size={48} stroke={2} /> },
    { at: at(W2.fazer), icon: <IconCheck size={48} stroke={2.4} /> },
  ];
  const gap = interpolate(merge, [0, 1], [70, -2]);

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 300]}>
      <Chapter
        n="02"
        label="porta 2"
        title="Solução"
        labelAt={at(W2.segundo)}
        titleAt={at(W2.solucao)}
        fillFrom={at(W2.segundo)}
        shrinkAt={shrink}
        color={th.accent}
        ink={c2.white}
        sub={
          <SyncedWords
            style={{ ...t2.light, fontSize: 64, color: c2.whiteDim, marginTop: 10 }}
            gap={16}
            words={[
              { text: "como", at: at(W2.solucao) - 4 },
              { text: "funciona", at: at(W2.funciona), style: { ...t2.impact, color: c2.white, fontSize: 84 } },
            ]}
          />
        }
      />

      {/* Plano: o que ele vai fazer */}
      <div style={{ position: "absolute", top: 360, left: 90, right: 90, opacity: 1 - planOut, transform: `translateY(${-planOut * 80}px)` }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 56, color: c2.whiteDim, justifyContent: "flex-start" }}
          gap={14}
          words={[
            { text: "Ele", at: at(W2.mostra2) - 4 },
            { text: "mostra", at: at(W2.mostra2), style: { color: c2.white } },
            { text: "exatamente", at: at(W2.exatamente), style: { ...t2.impact, fontSize: 78, color: c2.white } },
            { text: "o", at: at(W2.fazer) - 8 },
            { text: "que", at: at(W2.fazer) - 6 },
            { text: "vai", at: at(W2.fazer) - 3 },
            { text: "fazer.", at: at(W2.fazer) },
          ]}
        />
        <div style={{ position: "relative", marginTop: 60, display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ position: "absolute", left: 58, top: 40, bottom: 40, width: 4, borderRadius: 2, background: c2.strokeOnTurq, opacity: spring({ frame: frame - steps[0].at, fps, config: springs.smooth }) }} />
          {steps.map((s, i) => {
            const p = spring({ frame: frame - s.at, fps, config: springs.smooth });
            return (
              <div key={i} style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - p) * 120}px)` }}>
                <Card onTurq radius={40} style={{ display: "flex", alignItems: "center", gap: 34, padding: "26px 34px" }}>
                  <div style={{ width: 52, height: 52, color: c2.white }}>{s.icon}</div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ ...t2.mono, fontSize: 22, color: c2.aqua }}>passo {i + 1}</div>
                    <div style={{ height: 14, width: `${80 - i * 12}%`, borderRadius: 7, background: c2.glassOnTurqStrong }} />
                    <div style={{ height: 14, width: `${55 - i * 8}%`, borderRadius: 7, background: c2.glassOnTurq }} />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pergunta + puzzle */}
      <div style={{ position: "absolute", top: 360, left: 70, right: 70, opacity: piecesIn, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 60, color: c2.whiteDim }}
          gap={14}
          words={[
            { text: "Você", at: at(W2.voceConsegue) },
            { text: "consegue", at: at(W2.voceConsegue) + 5 },
            { text: "ver", at: at(W2.ver), style: { color: c2.white } },
            { text: "o", at: at(W2.ver) + 4 },
            { text: "seu", at: at(W2.ver) + 7 },
            { text: "problema", at: at(W2.problema2), style: { color: c2.white, fontWeight: 600 } },
          ]}
        />
        <SyncedWords
          style={{ ...t2.hero, fontSize: 116, color: c2.white, marginTop: 6 }}
          gap={26}
          rise={50}
          words={[
            { text: "sendo", at: at(W2.sendo) },
            { text: "resolvido?", at: at(W2.resolvido) },
          ]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 860,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap,
          opacity: piecesIn,
        }}
      >
        {/* peça "problema" */}
        <div style={{ transform: `translateX(${(1 - piecesIn) * -200}px) rotate(${(1 - merge) * -6}deg)` }}>
          <Card radius={44} style={{ width: 400, height: 400, borderTopRightRadius: merge > 0.9 ? 0 : 44, borderBottomRightRadius: merge > 0.9 ? 0 : 44, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ opacity: 1 - solved * 0.65, filter: `grayscale(${solved})` }}>
              <Pill kind="neg" icon="x" size={36}>
                problema
              </Pill>
            </div>
            {/* encaixe */}
            <div style={{ position: "absolute", right: -46, top: 160, width: 92, height: 92, borderRadius: "50%", background: c2.white }} />
          </Card>
        </div>
        {/* peça "solução" */}
        <div style={{ transform: `translateX(${(1 - piecesIn) * 200}px) rotate(${(1 - merge) * 6}deg)` }}>
          <Card radius={44} style={{ width: 400, height: 400, borderTopLeftRadius: merge > 0.9 ? 0 : 44, borderBottomLeftRadius: merge > 0.9 ? 0 : 44, display: "flex", alignItems: "center", justifyContent: "center", background: c2.turqMist }}>
            <Pill kind="turq" size={36}>
              solução
            </Pill>
          </Card>
        </div>
      </div>
      {/* resultado: resolvido (verde) */}
      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ transform: `scale(${solved})`, opacity: Math.min(1, solved * 1.5) }}>
          <Pill kind="pos" icon="check" size={66}>
            resolvido
          </Pill>
        </div>
        <SyncedWords
          style={{ ...t2.light, fontSize: 52, color: c2.whiteDim }}
          gap={14}
          words={[
            { text: "por", at: at(W2.solucao2) - 7 },
            { text: "essa", at: at(W2.solucao2) - 4 },
            { text: "solução.", at: at(W2.solucao2), style: { color: c2.white, fontWeight: 600 } },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 7: Porta 3 — Investimento (etiqueta de preço) ———
export const S07Investimento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.p3.from);
  const th = sceneThemes.p3;
  const shrink = at(W2.mostra3) - 10;
  const tagIn = spring({ frame: frame - at(W2.mostra3), fps, config: springs.smooth });
  const tt = Math.max(0, (frame - at(W2.mostra3)) / fps);
  const swing = 16 * Math.exp(-tt * 1.6) * Math.cos(tt * 5.2) + Math.sin(tt * 1.3) * 1.2;
  const reveal = interpolate(frame, [at(W2.quanto), at(W2.custar) + 4], [0, 1], { easing: ease.out, ...clamp });
  const conf = spring({ frame: frame - at(W2.volta), fps, config: springs.smooth });
  const t = frame / fps;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="wipeLeft">
      <Chapter
        n="03"
        label="terceiro e último"
        title="Investimento"
        labelAt={at(W2.terceiro)}
        titleAt={at(W2.investimento)}
        fillFrom={at(W2.terceiro)}
        shrinkAt={shrink}
        color={th.accent}
        ink={c2.ink}
      />

      {/* etiqueta de preço a balançar */}
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 340,
          width: 500,
          transformOrigin: "50% 0%",
          transform: `translateY(${(1 - tagIn) * -700}px) rotate(${swing}deg)`,
          opacity: tagIn,
          filter: `drop-shadow(0 40px 50px ${c2.shadowDeep}) drop-shadow(0 4px 8px ${c2.shadow})`,
        }}
      >
        <svg width={500} height={150} style={{ display: "block" }}>
          <path d="M250 0 L250 70" stroke={c2.inkFaint} strokeWidth={4} strokeLinecap="round" />
          <circle cx={250} cy={6} r={8} fill={c2.inkFaint} />
        </svg>
        <div
          style={{
            position: "relative",
            marginTop: -80,
            height: 640,
            borderRadius: 60,
            clipPath: "polygon(50% 0%, 100% 13%, 100% 100%, 0% 100%, 0% 13%)",
            background: `linear-gradient(170deg, ${c2.white}, ${c2.paper})`,
            boxShadow: `0 50px 100px -30px ${c2.shadowDeep}`,
            border: `2px solid ${c2.lineStrong}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            paddingTop: 70,
          }}
        >
          <div style={{ position: "absolute", top: 72, width: 46, height: 46, borderRadius: "50%", border: `6px solid ${c2.lineStrong}`, background: c2.paper }} />
          <div style={{ ...t2.mono, fontSize: 26, color: th.accent }}>investimento</div>
          <div style={{ ...t2.hero, fontSize: 210, color: c2.ink, filter: `blur(${(1 - reveal) * 16}px)`, opacity: 0.3 + reveal * 0.7 }}>R$</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 300, alignItems: "center" }}>
            <div style={{ height: 14, width: `${30 + reveal * 70}%`, borderRadius: 7, background: c2.turqMist }} />
            <div style={{ height: 14, width: `${20 + reveal * 50}%`, borderRadius: 7, background: c2.mist }} />
          </div>
          <div style={{ marginTop: 10, opacity: reveal, transform: `scale(${0.8 + reveal * 0.2})` }}>
            <Pill kind="turq" icon="check" size={30}>
              valor exato
            </Pill>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1170, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 60 }}
          gap={16}
          words={[
            { text: "Ele", at: at(W2.mostra3) - 4 },
            { text: "mostra", at: at(W2.mostra3) },
            { text: "exatamente", at: at(W2.exatamente2), style: { ...t2.impact, fontSize: 84, color: c2.ink } },
          ]}
        />
        <SyncedWords
          style={{ ...t2.hero, fontSize: 120, marginTop: 6 }}
          gap={26}
          rise={50}
          words={[
            { text: "quanto", at: at(W2.quanto) },
            { text: "vai", at: at(W2.custar) - 4 },
            { text: "custar", at: at(W2.custar), style: { color: th.accent } },
          ]}
        />
        <SyncedWords
          style={{ ...t2.light, fontSize: 50, marginTop: 14 }}
          gap={12}
          words={[
            { text: "pra", at: at(W2.resolver3) - 12 },
            { text: "o", at: at(W2.resolver3) - 9 },
            { text: "cliente", at: at(W2.resolver3) - 6 },
            { text: "resolver", at: at(W2.resolver3) },
            { text: "o", at: at(W2.resolver3) + 6 },
            { text: "problema.", at: at(W2.resolver3) + 10 },
          ]}
        />
      </div>

      {/* volta confirmando */}
      <div
        style={{
          position: "absolute",
          top: 1600,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: conf,
          transform: `translateY(${(1 - conf) * 40}px)`,
        }}
      >
        <Rise delay={at(W2.volta)} y={0} from={0.9} blur={0}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 36px", borderRadius: 999, background: c2.turq, color: c2.white, boxShadow: `0 20px 40px -16px ${c2.glowTurq}` }}>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" style={{ transform: `rotate(${t * 220}deg)` }}>
              <path d="M20 12a8 8 0 1 1-2.3-5.6" />
              <path d="M20 4v4.5h-4.5" />
            </svg>
            <span style={{ ...t2.head, fontSize: 44, color: c2.white }}>volta confirmando</span>
          </div>
        </Rise>
      </div>
    </SceneShell>
  );
};
