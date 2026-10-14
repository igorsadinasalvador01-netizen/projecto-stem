import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ease, springs } from "../../v2/theme2";
import { SCENES4, W4, d4, sceneThemes4 } from "../timeline4";
import { clamp, Rise, SyncedWords, useAt, useBreath } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Badge, ChapterNumber, IconDoc } from "../../v2/components/Kit";
import { DarkCard, DarkPill, t4 } from "../DarkKit";

// ——— Cena 1: porque é que a primeira venda é tão importante? ———
export const S1Pergunta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES4.hook.from);
  const th = sceneThemes4.hook;
  const fill = interpolate(frame, [at(W4.e), at(W4.importante) + 6], [0, 1], { easing: ease.inOut, ...clamp });
  const num = spring({ frame: frame - at(W4.primeira), fps, config: springs.smooth });
  const breath = useBreath(1.1, 0.8);
  const t = frame / fps;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="none">
      <div style={{ position: "absolute", top: 220, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 62 }}
          gap={16}
          words={[
            { text: "Você", at: at(W4.voce) },
            { text: "sabe", at: at(W4.sabe) },
            { text: "por", at: at(W4.porQue) },
            { text: "que", at: at(W4.porQue) + 4 },
            { text: "a", at: at(W4.a) },
          ]}
        />
        <SyncedWords
          style={{ ...t4.impact, fontSize: 150, color: d4.turq }}
          gap={28}
          rise={60}
          words={[
            { text: "primeira", at: at(W4.primeira) },
            { text: "venda", at: at(W4.venda) },
          ]}
        />
      </div>

      {/* anéis a pulsar */}
      {[0, 1, 2].map((i) => {
        const p = ((t * 0.55 + i / 3) % 1 + 1) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - (260 + p * 300),
              top: 860 - (260 + p * 300),
              width: 2 * (260 + p * 300),
              height: 2 * (260 + p * 300),
              borderRadius: "50%",
              border: `2px solid ${d4.turq}`,
              opacity: (1 - p) * 0.35 * num,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: num,
          transform: `translateY(${(1 - num) * 80 + breath.float}px) scale(${0.9 + num * 0.1})`,
          filter: `drop-shadow(0 0 ${30 + fill * 40}px ${d4.turqSoft})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <ChapterNumber n="1" color={d4.turq} size={460} fill={fill} />
          <div style={{ marginLeft: -8, marginTop: 28 }}>
            <ChapterNumber n="ª" color={d4.turq} size={210} fill={fill} />
          </div>
        </div>
        <div style={{ ...t4.mono, fontSize: 26, color: d4.turq, marginTop: 24 }}>primeira venda</div>
      </div>

      <div style={{ position: "absolute", top: 1330, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.hero, fontSize: 116 }}
          gap={26}
          rise={50}
          words={[
            { text: "é", at: at(W4.e) },
            { text: "tão", at: at(W4.tao) },
            { text: "importante", at: at(W4.importante), style: { color: d4.turq } },
          ]}
        />
        <SyncedWords
          style={{ ...t4.light, fontSize: 60, marginTop: 10 }}
          gap={16}
          words={[
            { text: "no", at: at(W4.no) },
            { text: "marketing", at: at(W4.marketing) },
            { text: "digital?", at: at(W4.digital), style: { color: d4.text, fontWeight: 600 } },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 2: ela prova que é possível (IMpossível → possível) ———
export const S2Possivel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES4.prova.from);
  const th = sceneThemes4.prova;
  const word = spring({ frame: frame - at(W4.que), fps, config: springs.smooth });
  const drop = spring({ frame: frame - at(W4.possivel), fps, config: springs.heavy });
  const ok = spring({ frame: frame - at(W4.possivel) - 6, fps, config: springs.bouncy });
  const imW = 210;

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 860]}>
      <div style={{ position: "absolute", top: 260, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 64 }}
          gap={16}
          words={[
            { text: "Porque", at: at(W4.porque) },
            { text: "ela", at: at(W4.ela) },
          ]}
        />
        <SyncedWords style={{ ...t4.hero, fontSize: 170 }} rise={60} words={[{ text: "prova", at: at(W4.prova) }]} />
        <SyncedWords
          style={{ ...t4.light, fontSize: 64 }}
          gap={16}
          words={[
            { text: "para", at: at(W4.para) },
            { text: "você", at: at(W4.voce2) },
            { text: "mesmo", at: at(W4.mesmo), style: { color: d4.text, fontWeight: 600 } },
          ]}
        />
      </div>

      {/* IM + POSSÍVEL */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          opacity: word,
          transform: `translateX(${-drop * imW * 0.5}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            ...t4.hero,
            fontSize: 150,
            color: interpolate(drop, [0, 0.1], [0, 1], clamp) > 0.5 ? d4.red : d4.text,
            transform: `translateY(${drop * drop * 420}px) rotate(${drop * -28}deg)`,
            opacity: 1 - interpolate(drop, [0.5, 1], [0, 1], clamp),
            width: imW,
            textAlign: "right",
          }}
        >
          im
          <div style={{ position: "absolute", left: 10, right: -6, top: "55%", height: 12, borderRadius: 6, background: d4.red, transform: `scaleX(${interpolate(drop, [0, 0.25], [0, 1], clamp)})`, transformOrigin: "0% 50%" }} />
        </div>
        <div style={{ ...t4.hero, fontSize: 150, color: drop > 0.4 ? d4.green : d4.text, textShadow: drop > 0.4 ? `0 0 60px ${d4.greenGlow}` : "none" }}>
          possível
        </div>
      </div>
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity: Math.min(1, ok * 1.4), transform: `scale(${0.7 + ok * 0.3})` }}>
        <Badge kind="pos" size={84} />
        <SyncedWords style={{ ...t4.light, fontSize: 56 }} gap={14} words={[{ text: "é", at: at(W4.e2) }, { text: "possível.", at: at(W4.possivel), style: { color: d4.green, fontWeight: 600 } }]} />
      </div>
    </SceneShell>
  );
};

// ——— Cena 3: ninguém começa sabendo (conteúdo perfeito ✕, tudo sobre vendas ✕) ———
export const S3Comeco: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES4.comeco.from);
  const th = sceneThemes4.comeco;
  const cards = [
    {
      at: at(W4.criar),
      xAt: at(W4.perfeito) + 4,
      x: "perfeito",
      lines: [
        { text: "criar o", at: at(W4.criar) },
        { text: "conteúdo", at: at(W4.conteudo) },
      ],
      big: { text: "perfeito", at: at(W4.perfeito) },
    },
    {
      at: at(W4.entender),
      xAt: at(W4.tudo) + 4,
      x: "tudo",
      lines: [
        { text: "entender", at: at(W4.entender) },
        { text: "tudo", at: at(W4.tudo) },
      ],
      big: { text: "sobre vendas", at: at(W4.vendas) },
    },
  ];

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="panel">
      <div style={{ position: "absolute", top: 240, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t4.light, fontSize: 62 }}
          gap={16}
          words={[
            { text: "No", at: at(W4.noComeco) },
            { text: "começo,", at: at(W4.comeco) },
          ]}
        />
        <SyncedWords
          style={{ ...t4.hero, fontSize: 130 }}
          gap={28}
          rise={56}
          words={[
            { text: "ninguém", at: at(W4.ninguem) },
            { text: "começa", at: at(W4.comeca) },
          ]}
        />
        <SyncedWords style={{ ...t4.impact, fontSize: 104, color: d4.turq }} rise={40} words={[{ text: "sabendo", at: at(W4.sabendo) }]} />
      </div>

      <div style={{ position: "absolute", top: 780, left: 80, right: 80, display: "flex", flexDirection: "column", gap: 44 }}>
        {cards.map((c, i) => {
          const p = spring({ frame: frame - c.at + 2, fps, config: springs.smooth });
          const xp = spring({ frame: frame - c.xAt, fps, config: springs.bouncy });
          const strike = interpolate(frame, [c.xAt, c.xAt + 0.3 * fps], [0, 1], { easing: ease.out, ...clamp });
          return (
            <div key={i} style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - p) * (i === 0 ? -140 : 140)}px)` }}>
              <DarkCard radius={50} style={{ padding: "54px 48px", display: "flex", alignItems: "center", gap: 36 }}>
                <div style={{ width: 110, height: 110, borderRadius: 30, background: d4.glassStrong, border: `1.5px solid ${d4.stroke}`, color: d4.turq, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i === 0 ? (
                    <IconDoc size={60} stroke={1.8} />
                  ) : (
                    <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <SyncedWords style={{ ...t4.light, fontSize: 52, justifyContent: "flex-start" }} gap={12} rise={18} words={c.lines} />
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <SyncedWords style={{ ...t4.head, fontSize: 82, justifyContent: "flex-start" }} rise={24} words={[c.big]} />
                    <div style={{ position: "absolute", left: -6, top: "52%", height: 8, borderRadius: 4, width: `calc(${strike * 100}% + 12px)`, background: d4.red, opacity: strike > 0 ? 0.9 : 0 }} />
                  </div>
                </div>
                <div style={{ transform: `scale(${xp})`, opacity: Math.min(1, xp * 1.4) }}>
                  <Badge kind="neg" size={76} icon="x" />
                </div>
              </DarkCard>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1520, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Rise delay={at(W4.vendas) + 6} y={30} from={0.85}>
          <DarkPill kind="turq" size={38}>
            ninguém começa pronto
          </DarkPill>
        </Rise>
      </div>
    </SceneShell>
  );
};
