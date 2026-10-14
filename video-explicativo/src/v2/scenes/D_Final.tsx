import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease, sceneThemes, springs } from "../theme2";
import { t2 } from "../type2";
import { HITS2, SCENES2, W2 } from "../timeline2";
import { clamp, Rise, SyncedWords, useAt } from "../../components/Motion";
import { SceneShell } from "../components/Shell";
import { Badge, Card, Door, IconCheck, Pill, useDoorClose } from "../components/Kit";

// ——— Cena 8: ele volta confirmando (as portas fecham uma a uma) ———
export const S08Confirma: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.confirma.from);
  const th = sceneThemes.confirma;
  const d1 = useDoorClose(at(W2.prioridade2));
  const d2 = useDoorClose(at(W2.atende));
  const pendingAt = at(W2.investimento2);
  const rows = [
    { label: "é prioridade", showAt: at(W2.falou) - 4, okAt: at(W2.prioridade2), kind: "pos" as const },
    { label: "a solução atende", showAt: at(W2.falou2) - 4, okAt: at(W2.atende), kind: "pos" as const },
    { label: "investimento", showAt: at(W2.ultima) - 4, okAt: pendingAt, kind: "turq" as const },
  ];

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="zoom">
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords style={{ ...t2.mono, fontSize: 28, color: th.accent }} words={[{ text: "confirmação", at: at(W2.umaVez) - 2 }]} />
        <SyncedWords
          style={{ ...t2.light, fontSize: 64, marginTop: 14 }}
          gap={16}
          words={[
            { text: "“Você", at: at(W2.umaVez) + 6 },
            { text: "me", at: at(W2.falou) - 2 },
            { text: "falou", at: at(W2.falou), style: { color: c2.ink, fontWeight: 600 } },
            { text: "que…”", at: at(W2.falou) + 6 },
          ]}
        />
      </div>

      <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 48 }}>
        {[0, 1, 2].map((i) => {
          const p = spring({ frame: frame - i * 3, fps, config: springs.smooth });
          const st = i === 0 ? d1 : i === 1 ? d2 : null;
          const pending = i === 2 && frame >= pendingAt;
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 120}px)` }}>
              <Door
                open={st ? st.open : 1}
                label={`porta ${i + 1}`}
                state={st && st.closed ? "closed" : pending ? "pending" : "idle"}
                stateP={st ? st.badge : 0}
              />
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 1130, left: 110, right: 110, display: "flex", flexDirection: "column", gap: 26 }}>
        {rows.map((r, i) => {
          const p = spring({ frame: frame - r.showAt, fps, config: springs.smooth });
          const ok = spring({ frame: frame - r.okAt, fps, config: springs.bouncy });
          const done = frame >= r.okAt;
          return (
            <div key={i} style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - p) * -100}px)` }}>
              <Card radius={36} style={{ display: "flex", alignItems: "center", gap: 28, padding: "24px 32px" }}>
                <div style={{ ...t2.hero, fontSize: 44, color: c2.inkFaint, width: 60 }}>0{i + 1}</div>
                <div style={{ ...t2.head, fontSize: 54, flex: 1, color: done && r.kind === "pos" ? c2.green : c2.ink }}>{r.label}</div>
                <div style={{ width: 84, height: 84, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? (
                    <div style={{ transform: `scale(${ok})` }}>
                      {r.kind === "pos" ? (
                        <Badge kind="pos" size={76} />
                      ) : (
                        <div style={{ width: 76, height: 76, borderRadius: "50%", border: `6px solid ${c2.turq}`, boxShadow: `0 0 ${20 + Math.sin(frame / 4) * 10}px ${c2.glowTurq}` }} />
                      )}
                    </div>
                  ) : (
                    <div style={{ width: 76, height: 76, borderRadius: "50%", border: `5px solid ${c2.mist}` }} />
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1620, left: 60, right: 60 }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 48 }}
          gap={12}
          words={[
            { text: "agora,", at: at(W2.agora) },
            { text: "a", at: at(W2.ultima) - 4 },
            { text: "última", at: at(W2.ultima), style: { color: c2.ink, fontWeight: 600 } },
            { text: "etapa.", at: at(W2.etapa2) },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 9: investir (verde) é infinitamente menor que continuar (vermelho) ———
export const S09Compara: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.compara.from);
  const th = sceneThemes.compara;
  const green = spring({ frame: frame - at(W2.investir), fps, config: springs.smooth });
  const redIn = spring({ frame: frame - at(W2.quanto2), fps, config: springs.smooth });
  const redGrow = interpolate(frame, [at(W2.custando), at(W2.encontra) + 10], [0, 1], { easing: ease.soft, ...clamp });
  const base = 1480;
  const gH = 150 * green;
  const rH = 150 * redIn + 660 * redGrow; // para abaixo do título; o topo esbate (sugere "infinito")

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="panel">
      <div style={{ position: "absolute", top: 220, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 56 }}
          gap={14}
          words={[
            { text: "Você", at: at(W2.concorda) - 5 },
            { text: "concorda", at: at(W2.concorda) },
            { text: "que", at: at(W2.valor) - 6 },
            { text: "o", at: at(W2.valor) - 3 },
            { text: "valor", at: at(W2.valor), style: { color: c2.green, fontWeight: 600 } },
            { text: "é", at: at(W2.infinitamente) - 3 },
          ]}
        />
        <SyncedWords style={{ ...t2.impact, fontSize: 150, color: th.accent, marginTop: 4 }} rise={60} words={[{ text: "infinitamente", at: at(W2.infinitamente) }]} />
        <SyncedWords style={{ ...t2.hero, fontSize: 132, color: c2.green, marginTop: -6 }} rise={50} words={[{ text: "menor?", at: at(W2.menor) }]} />
      </div>

      {/* barras */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: base, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 120 }}>
        <div style={{ width: 270, height: Math.max(6, gH), borderRadius: 40, background: `linear-gradient(180deg, ${c2.greenLight}, ${c2.green})`, boxShadow: `0 24px 50px -18px ${c2.glowGreen}`, opacity: interpolate(green, [0, 0.15], [0, 1], clamp) }} />
        <div
          style={{
            width: 270,
            height: Math.max(6, rH),
            borderRadius: 40,
            background: `linear-gradient(0deg, ${c2.red}, ${c2.redLight} 70%, ${c2.redFade})`,
            boxShadow: `0 24px 50px -18px ${c2.glowRed}`,
            opacity: interpolate(redIn, [0, 0.15], [0, 1], clamp),
          }}
        />
      </div>
      <div style={{ position: "absolute", top: base + 30, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 120 }}>
        <div style={{ width: 270, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: green }}>
          <div style={{ ...t2.head, fontSize: 48, color: c2.green }}>investir</div>
          <div style={{ ...t2.mono, fontSize: 18 }}>o valor</div>
        </div>
        <div style={{ width: 270, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: redIn }}>
          <div style={{ ...t2.head, fontSize: 48, color: c2.red }}>continuar</div>
          <div style={{ ...t2.mono, fontSize: 18 }}>como está</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: base + 190, left: 60, right: 60 }}>
        <SyncedWords
          style={{ ...t2.light, fontSize: 42 }}
          gap={12}
          words={[
            { text: "o", at: at(W2.quanto2) - 3 },
            { text: "quanto", at: at(W2.quanto2) },
            { text: "custa", at: at(W2.custando), style: { color: c2.red, fontWeight: 600 } },
            { text: "continuar", at: at(W2.continuar), style: { color: c2.red, fontWeight: 600 } },
            { text: "na", at: at(W2.situacao) - 4 },
            { text: "situação", at: at(W2.situacao) },
            { text: "atual", at: at(W2.encontra) },
          ]}
        />
      </div>
    </SceneShell>
  );
};

// ——— Cena 10: ele não perde nenhuma venda (boom) + fecho ———
export const S10Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES2.final.from);
  const th = sceneThemes.final;
  const boom = at(HITS2.boom);
  const punch = spring({ frame: frame - boom, fps, config: springs.bouncy });
  const flash = interpolate(frame, [boom, boom + 2, boom + 0.5 * fps], [0, 0.85, 0], { easing: ease.out, ...clamp });
  const outroAt = at(HITS2.silenceFrom) + 4;
  const outP = interpolate(frame, [outroAt - 6, outroAt + 6], [0, 1], { easing: ease.in, ...clamp });
  const toOutro = interpolate(frame, [outroAt + 4, outroAt + 0.6 * fps], [0, 1], { easing: ease.out, ...clamp });
  const chips = ["Prioridade", "Solução", "Investimento"];

  return (
    <SceneShell surface={th.surface} pattern={th.pattern} enter="iris" irisAt={[540, 1100]}>
      {/* ondas a partir do boom */}
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame, [boom + i * 4, boom + i * 4 + 1.2 * fps], [0, 1], { easing: ease.out, ...clamp });
        if (p <= 0 || p >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 1300 * p,
              top: 1060 - 1300 * p,
              width: 2600 * p,
              height: 2600 * p,
              borderRadius: "50%",
              border: `${6 - i * 1.5}px solid ${c2.whiteDim}`,
              opacity: 1 - p,
            }}
          />
        );
      })}

      {/* frase final */}
      <AbsoluteFill style={{ opacity: 1 - outP, transform: `translateY(${-outP * 120}px)`, filter: `blur(${outP * 12}px)` }}>
        <div style={{ position: "absolute", top: 330, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 64, color: c2.whiteDim }}
            gap={16}
            words={[
              { text: "Dessa", at: at(W2.dessa) },
              { text: "maneira,", at: at(W2.maneira) },
              { text: "ele", at: at(W2.naoPerde) - 3 },
              { text: "não", at: at(W2.naoPerde) },
              { text: "perde", at: at(W2.perde) },
            ]}
          />
          <SyncedWords
            style={{ ...t2.hero, fontSize: 158, color: c2.white, marginTop: 10, textShadow: `0 30px 80px ${c2.shadowTurq}` }}
            gap={30}
            rise={60}
            words={[
              { text: "nenhuma", at: at(W2.nenhuma) },
              { text: "venda.", at: at(W2.venda2) },
            ]}
          />
        </div>
        <div style={{ position: "absolute", top: 930, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40, transform: `scale(${1 + (punch > 0 ? Math.sin(Math.min(1, punch) * Math.PI) * 0.12 : 0)})` }}>
          {[0, 1, 2].map((i) => {
            const p = spring({ frame: frame - at(W2.dessa) - i * 4, fps, config: springs.smooth });
            return (
              <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 120}px) scale(0.8)` }}>
                <Door open={0} label="" state="closed" stateP={1} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Rise delay={boom + 3} y={60} from={0.6} config={springs.bouncy}>
            <Pill kind="white" icon="check" size={56} style={{ color: c2.green }}>
              0 vendas perdidas
            </Pill>
          </Rise>
        </div>
      </AbsoluteFill>

      {/* fecho no silêncio */}
      <AbsoluteFill style={{ opacity: toOutro, transform: `translateY(${(1 - toOutro) * 120}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...t2.mono, fontSize: 30, color: c2.whiteDim }}>o método das</div>
        <div style={{ ...t2.hero, fontSize: 250, color: c2.white, marginTop: 6 }}>3 portas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 50 }}>
          {chips.map((ch, i) => {
            const p = spring({ frame: frame - outroAt - 8 - i * 5, fps, config: springs.smooth });
            return (
              <div key={ch} style={{ opacity: p, transform: `translateX(${(1 - p) * 120}px)` }}>
                <Card onTurq radius={999} style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 40px 20px 22px" }}>
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

      <AbsoluteFill style={{ background: c2.white, opacity: flash, pointerEvents: "none" }} />
    </SceneShell>
  );
};
