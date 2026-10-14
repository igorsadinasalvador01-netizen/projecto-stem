import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, sceneThemes, springs } from "../theme2";
import { t2 } from "../type2";
import { SCENES2, W2 } from "../timeline2";
import { clamp, Rise, SyncedWords, useAt } from "../../components/Motion";
import { SceneShell } from "../components/Shell";
import { Avatar, Badge, Bubble, Card, ChapterNumber, Door, Pill, useDoorClose } from "../components/Kit";

// Janela de visibilidade com entrada/saída suaves (para legendas que se substituem).
const useWindow = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = interpolate(frame, [from, from + 0.25 * fps], [0, 1], { easing: ease.out, ...clamp });
  const outP = interpolate(frame, [to - 0.22 * fps, to], [0, 1], { easing: ease.in, ...clamp });
  return { opacity: inP * (1 - outP), y: (1 - inP) * 30 - outP * 30 };
};

// ——— Cena 4: ele fecha 3 portas → venda ———
export const S04Portas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES2.portas.from);
  const th = sceneThemes.portas;
  const closes = [at(W2.tres2), at(W2.portas2), at(W2.fechadas)];
  const doors = closes.map((c) => useDoorClose(c)); // eslint-disable-line react-hooks/rules-of-hooks
  const capA = useWindow(at(W2.diferente2) - 2, at(W2.toda) - 1);
  const capB = useWindow(at(W2.toda) - 1, at(W2.consequencia) - 1);
  const capC = useWindow(at(W2.consequencia) - 1, durationInFrames + 30);
  const lift = interpolate(frame, [at(W2.consequencia) - 4, at(W2.consequencia) + 0.5 * fps], [0, 1], { easing: ease.inOut, ...clamp });

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="zoom">
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 58 }}
          gap={14}
          words={[
            { text: "O", at: at(W2.percebi) - 6 },
            { text: "que", at: at(W2.percebi) - 4 },
            { text: "eu", at: at(W2.percebi) - 2 },
            { text: "percebi:", at: at(W2.percebi) },
            { text: "ele", at: at(W2.fecha2) - 4 },
            { text: "fecha", at: at(W2.fecha2), style: { color: c2.ink, fontWeight: 600 } },
          ]}
        />
        <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 4 }}>
          <SyncedWords style={{ ...t2.hero, fontSize: 210, color: th.accent }} rise={70} words={[{ text: "3", at: at(W2.tres) }]} />
          <SyncedWords style={{ ...t2.hero, fontSize: 150 }} rise={60} words={[{ text: "portas", at: at(W2.portas) }]} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 680,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 48,
          transform: `translateY(${-lift * 50}px) scale(${1 - lift * 0.06})`,
        }}
      >
        {[0, 1, 2].map((i) => {
          const p = spring({ frame: frame - at(W2.tres) - i * 4, fps, config: springs.smooth });
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
                transform: `translateY(${interpolate(p, [0, 1], [260, 0])}px)`,
              }}
            >
              <Door open={doors[i].open} label={`porta ${i + 1}`} state={doors[i].closed ? "closed" : "idle"} stateP={doors[i].badge} />
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 1330, left: 60, right: 60 }}>
        <div style={{ position: "absolute", left: 0, right: 0, opacity: capA.opacity, transform: `translateY(${capA.y}px)` }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 54 }}
            gap={14}
            words={[
              { text: "diferente", at: at(W2.diferente2), style: { ...t2.impact, fontSize: 76, color: th.accent } },
              { text: "da", at: at(W2.diferente2) + 8 },
              { text: "maior", at: at(W2.maiorParte) - 2 },
              { text: "parte", at: at(W2.maiorParte) + 3 },
              { text: "dos", at: at(W2.maiorParte) + 8 },
              { text: "vendedores.", at: at(W2.vendedores2) },
            ]}
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, opacity: capB.opacity, transform: `translateY(${capB.y}px)` }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 54 }}
            gap={14}
            words={[
              { text: "Toda", at: at(W2.toda) },
              { text: "vez", at: at(W2.toda) + 4 },
              { text: "que", at: at(W2.toda) + 7 },
              { text: "as", at: at(W2.tres2) - 4 },
              { text: "3", at: at(W2.tres2) },
              { text: "portas", at: at(W2.portas2) },
              { text: "estão", at: at(W2.estao) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.head, fontSize: 104, color: c2.green, marginTop: 4 }}
            rise={44}
            words={[{ text: "fechadas", at: at(W2.fechadas) }]}
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, opacity: capC.opacity, transform: `translateY(${capC.y}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 54 }}
            gap={14}
            words={[
              { text: "por", at: at(W2.consequencia) - 2 },
              { text: "consequência,", at: at(W2.consequencia) },
              { text: "ele", at: at(W2.consegue) - 2 },
              { text: "consegue", at: at(W2.consegue) },
              { text: "trazer", at: at(W2.trazer) },
            ]}
          />
          <Rise delay={at(W2.venda) - 2} y={40} from={0.7} config={springs.bouncy}>
            <Pill kind="pos" icon="check" size={64}>
              uma venda
            </Pill>
          </Rise>
        </div>
      </div>
    </SceneShell>
  );
};

// ——— Cabeçalho de capítulo que encolhe para o topo ———
export const Chapter: React.FC<{
  n: string;
  label: string;
  title: string;
  labelAt: number;
  titleAt: number;
  fillFrom: number;
  shrinkAt: number;
  color: string;
  ink: string;
  sub?: React.ReactNode;
}> = ({ n, label, title, labelAt, titleAt, fillFrom, shrinkAt, color, ink, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fill = interpolate(frame, [fillFrom, titleAt], [0, 1], { easing: ease.inOut, ...clamp });
  const k = interpolate(frame, [shrinkAt, shrinkAt + 0.55 * fps], [0, 1], { easing: ease.inOut, ...clamp });
  const numIn = spring({ frame: frame - fillFrom + 6, fps, config: springs.smooth });
  return (
    <>
      {/* versão grande, ao centro */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1 - k,
          transform: `translateY(${-k * 260}px) scale(${1 - k * 0.5})`,
        }}
      >
        <div style={{ opacity: numIn, transform: `translateY(${(1 - numIn) * 80}px)` }}>
          <ChapterNumber n={n} color={color} size={440} fill={fill} />
        </div>
        <SyncedWords style={{ ...t2.mono, fontSize: 30, color, marginTop: 30 }} words={[{ text: label, at: labelAt }]} />
        <SyncedWords style={{ ...t2.hero, fontSize: 150, color: ink, marginTop: 8 }} rise={60} words={[{ text: title, at: titleAt }]} />
        {sub}
      </div>
      {/* versão compacta, no topo */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 70,
          right: 70,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: k,
          transform: `translateY(${(1 - k) * 40}px)`,
        }}
      >
        <div
          style={{
            ...t2.hero,
            fontSize: 64,
            color: ink === c2.white ? c2.turqDeep : c2.white,
            background: color,
            borderRadius: 24,
            padding: "10px 22px",
            letterSpacing: "-0.04em",
          }}
        >
          {n}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ ...t2.mono, fontSize: 22, color: ink === c2.white ? c2.whiteDim : c2.inkFaint }}>{label}</div>
          <div style={{ ...t2.head, fontSize: 64, color: ink }}>{title}</div>
        </div>
      </div>
    </>
  );
};

// ——— Cena 5: Porta 1 — Prioridade (pergunta + bifurcação não/sim) ———
export const S05Prioridade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.p1.from);
  const th = sceneThemes.p1;
  const shrink = at(W2.pergunta) - 10;
  const card = spring({ frame: frame - shrink - 6, fps, config: springs.smooth });
  const typing = frame >= at(W2.pergunta) && frame < at(W2.q_e) - 2;
  const qShow = frame >= at(W2.q_e) - 3;
  const fork = spring({ frame: frame - at(W2.seNao), fps, config: springs.smooth });
  const yesFocus = interpolate(frame, [at(W2.seSim) - 4, at(W2.seSim) + 0.4 * fps], [0, 1], { easing: ease.inOut, ...clamp });
  const door = useDoorClose(at(W2.etapa));
  const t = frame / fps;

  const q = [
    { text: "É", at: at(W2.q_e) },
    { text: "uma", at: at(W2.q_uma) },
    { text: "prioridade", at: at(W2.q_prioridade), style: { fontWeight: 800 } },
    { text: "pra", at: at(W2.q_pra) },
    { text: "você", at: at(W2.q_voce) },
    { text: "resolver", at: at(W2.q_resolver) },
    { text: "esse", at: at(W2.q_esse) },
    { text: "problema?", at: at(W2.q_problema) },
  ];

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="panel">
      <Chapter
        n="01"
        label="porta 1"
        title="Prioridade"
        labelAt={at(W2.porta) - 4}
        titleAt={at(W2.prioridade)}
        fillFrom={at(W2.primeira)}
        shrinkAt={shrink}
        color={th.accent}
        ink={c2.ink}
      />

      {/* cartão da conversa */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 70,
          right: 70,
          opacity: card,
          transform: `translateY(${(1 - card) * 120}px) scale(${0.94 + card * 0.06})`,
        }}
      >
        <Card radius={52} style={{ padding: "40px 44px", display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Avatar size={74} tone="turq" />
            <SyncedWords
              style={{ ...t2.light, fontSize: 42, justifyContent: "flex-start" }}
              gap={12}
              words={[
                { text: "Ele", at: at(W2.pergunta) - 6 },
                { text: "pergunta", at: at(W2.pergunta), style: { color: c2.ink, fontWeight: 600 } },
                { text: "claramente:", at: at(W2.claramente) },
              ]}
            />
          </div>
          <div style={{ minHeight: 230, display: "flex", flexDirection: "column" }}>
            {typing && (
              <Bubble side="left" tone="turq" style={{ padding: "26px 34px" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        background: c2.white,
                        opacity: 0.4 + 0.6 * Math.max(0, Math.sin(t * 8 - i * 0.9)),
                      }}
                    />
                  ))}
                </div>
              </Bubble>
            )}
            {qShow && (
              <Bubble side="left" tone="turq">
                <SyncedWords style={{ ...t2.head, fontSize: 56, color: c2.white, justifyContent: "flex-start", lineHeight: 1.15 }} gap={14} rise={18} words={q} />
              </Bubble>
            )}
          </div>
        </Card>
      </div>

      {/* bifurcação */}
      <div style={{ position: "absolute", top: 840, left: 60, right: 60, opacity: fork }}>
        <svg width={960} height={120} style={{ position: "absolute", top: 0, left: 0 }}>
          <path
            d="M480 0 C480 60, 240 40, 240 110"
            stroke={c2.red}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={300}
            strokeDashoffset={300 * (1 - fork)}
            opacity={1 - yesFocus * 0.6}
          />
          <path
            d="M480 0 C480 60, 720 40, 720 110"
            stroke={c2.green}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={300}
            strokeDashoffset={300 * (1 - spring({ frame: frame - at(W2.seSim), fps, config: springs.smooth }))}
          />
        </svg>
        <div style={{ position: "absolute", top: 130, left: 0, width: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, opacity: 1 - yesFocus * 0.6, transform: `scale(${1 - yesFocus * 0.06})` }}>
          <Rise delay={at(W2.nao) - 2} y={30} from={0.7} config={springs.bouncy}>
            <Bubble side="right" tone="neg" style={{ padding: "18px 40px" }}>
              <span style={{ ...t2.hero, fontSize: 76, color: c2.red }}>Não</span>
            </Bubble>
          </Rise>
          <Rise delay={at(W2.acabou)} y={24} from={0.85}>
            <Pill kind="neg" icon="x" size={36}>
              acabou a venda
            </Pill>
          </Rise>
          <Rise delay={at(W2.acabou2)} y={24} from={0.85}>
            <Pill kind="neg" icon="x" size={34}>
              acabou o atendimento
            </Pill>
          </Rise>
          <Rise delay={at(W2.parte)} y={24} from={0.85}>
            <Pill kind="neutral" icon="arrow" size={36}>
              próximo cliente
            </Pill>
          </Rise>
        </div>
        <div style={{ position: "absolute", top: 130, left: 480, width: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, transform: `scale(${1 + yesFocus * 0.04})` }}>
          <Rise delay={at(W2.sim) - 2} y={30} from={0.7} config={springs.bouncy}>
            <Bubble side="right" tone="pos" style={{ padding: "18px 40px" }}>
              <span style={{ ...t2.hero, fontSize: 76, color: c2.green }}>Sim</span>
            </Bubble>
          </Rise>
          <Rise delay={at(W2.avanca)} y={24} from={0.85}>
            <Pill kind="pos" icon="arrow" size={40}>
              avança
            </Pill>
          </Rise>
          <Rise delay={at(W2.proximaEtapa) - 2} y={24} from={0.85}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Pill kind="turq" size={36}>
                próxima etapa
              </Pill>
              <div style={{ transform: `scale(${door.badge})`, width: 64, height: 64 }}>
                <Badge kind="pos" size={64} />
              </div>
            </div>
          </Rise>
        </div>
      </div>
      <AbsoluteFill style={{ pointerEvents: "none" }} />
    </SceneShell>
  );
};
