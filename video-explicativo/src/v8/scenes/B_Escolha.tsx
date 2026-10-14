import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2 } from "../../v2/theme2";
import { clamp, SyncedWords, useAt, useBreath, useCameraPush } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar, Badge, IconCheck } from "../../v2/components/Kit";
import { DarkCard, t4 } from "../../v4/DarkKit";
import { d4 } from "../../v4/timeline4";
import { Bokeh, emo, Ripple, Thread, useArrive, useHeartbeat } from "../../v6/Emotion";
import { SnapThread, useWindow } from "../../v7/Bond";
import { SCENES8, W8 } from "../timeline8";
import { Cupcake, Tag } from "../Sweet";

const OPTIONS = [
  { name: "pequeno", price: "R$ 5", pair: false },
  { name: "grande", price: "R$ 9", pair: false },
  { name: "2 pequenos", price: "R$ 10", pair: true },
];

const Treat: React.FC<{ pair: boolean; big?: boolean; size: number; id: string }> = ({ pair, big, size, id }) =>
  pair ? (
    <div style={{ display: "flex" }}>
      <Cupcake size={size * 0.8} id={`${id}a`} />
      <div style={{ marginLeft: -size * 0.28 }}>
        <Cupcake size={size * 0.8} id={`${id}b`} />
      </div>
    </div>
  ) : (
    <Cupcake size={big ? size * 1.15 : size * 0.85} id={id} />
  );

// ——— 4. Três escolhas: o cliente liga-se ao menu ———
export const S4Escolhas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.escolhas.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const cust = useArrive(at(W8.cliente2), 0, -120);
  const starts = [at(W8.um2), at(W8.um3), at(W8.dois3)];
  const active = frame >= starts[2] ? 2 : frame >= starts[1] ? 1 : frame >= starts[0] ? 0 : -1;
  const C = { x: 540, y: 680 };
  const rowY = [920, 1160, 1400];

  return (
    <SceneShell surface="abyss" pattern="grid" enter="iris" irisAt={[540, 680]}>
      <Bokeh seed="e4" count={10} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 200, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t4.light, fontSize: 62 }}
            gap={15}
            words={[
              { text: "O", at: at(W8.o2) },
              { text: "cliente", at: at(W8.cliente2), style: { color: d4.text, fontWeight: 600 } },
              { text: "passa", at: at(W8.passa) },
              { text: "a", at: at(W8.a2) },
              { text: "ter", at: at(W8.ter) },
            ]}
          />
          <SyncedWords
            style={{ ...t4.head, fontSize: 100, marginTop: 4 }}
            gap={24}
            rise={44}
            words={[
              { text: "três", at: at(W8.tres), style: { ...t4.impact, fontSize: 130, color: d4.turq } },
              { text: "escolhas.", at: at(W8.escolhas) },
            ]}
          />
        </div>

        {OPTIONS.map((o, i) => (
          <Thread key={`t${i}`} from={[C.x - 60, C.y + 40]} to={[96, rowY[i] + 95]} at={at(W8.tres) + i * 3} bend={0.22 + i * 0.04} color={active === i ? d4.turq : "rgba(255,255,255,0.4)"} glow={active === i ? c2.glowTurq : "rgba(255,255,255,0.06)"} width={active === i ? 5 : 3} />
        ))}
        <div style={{ position: "absolute", left: C.x - 75, top: C.y - 75, ...cust.style }}>
          <Avatar size={150} tone="white" ring />
        </div>

        {OPTIONS.map((o, i) => {
          const a = useArrive(at(W8.tres) + i * 3, 260, 0); // eslint-disable-line react-hooks/rules-of-hooks
          const on = active === i;
          const lit = spring({ frame: frame - starts[i], fps, config: emo.arrive }); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: 96, right: 96, top: rowY[i], ...a.style }}>
              <DarkCard
                radius={38}
                style={{
                  height: 190,
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  padding: "0 44px",
                  opacity: active >= 0 && !on ? 0.55 : 1,
                  transform: `scale(${on ? 1 + lit * 0.035 : 1})`,
                  border: `2px solid ${on ? d4.turq : d4.stroke}`,
                  boxShadow: on ? `0 0 60px -10px ${c2.glowTurq}, inset 0 1.5px 0 ${d4.strokeStrong}` : undefined,
                }}
              >
                <div style={{ width: 190, display: "flex", justifyContent: "center", marginTop: -20 }}>
                  <Treat pair={o.pair} big={i === 1} size={150} id={`r4${i}`} />
                </div>
                <div style={{ flex: 1, ...t4.head, fontSize: 56 }}>{o.name}</div>
                <div style={{ ...t4.head, fontSize: 66, color: on ? d4.turq : d4.text }}>{o.price}</div>
              </DarkCard>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 5. A comparação: pouco · não vale tanto · +R$ 1 = melhor negócio ———
export const S5Compara: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.compara.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const breath = useBreath(1.1, 0.7);
  const colX = [195, 540, 885];
  const top = 640;
  const H = 470;
  const dim0 = interpolate(frame, [at(W8.pouco), at(W8.pouco) + 8], [0, 1], clamp);
  const dim1 = interpolate(frame, [at(W8.tanto), at(W8.tanto) + 8], [0, 1], clamp);
  const best = spring({ frame: frame - at(W8.melhor), fps, config: emo.arrive });
  const bracket = interpolate(frame, [at(W8.apenas), at(W8.apenas) + 0.5 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const plus = spring({ frame: frame - at(W8.um4), fps, config: emo.arrive });
  const beat = useHeartbeat(at(W8.melhor), 2);
  const warm = interpolate(frame, [at(W8.melhor), at(W8.negocio) + 6], [0, 1], { easing: emo.ease, ...clamp });
  const Cu = { x: 540, y: 1620 };
  const capA = useWindow(at(W8.o3) - 2, at(W8.o4) - 1);
  const capB = useWindow(at(W8.o4) - 1, at(W8.mas) - 1);
  const capC = useWindow(at(W8.mas) - 1, at(W8.parecem) - 1);
  const capD = useWindow(at(W8.parecem) - 1, durationInFrames + 30);

  return (
    <SceneShell surface="night" pattern="diagonal" enter="zoom">
      <Bokeh seed="e5" count={10} color={warm > 0.5 ? d4.greenSoft : c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 220, left: 60, right: 60 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t4.head, fontSize: 92 }}
              gap={22}
              words={[
                { text: "O", at: at(W8.o3), style: { ...t4.light, fontSize: 92 } },
                { text: "pequeno", at: at(W8.pequeno2) },
                { text: "parece", at: at(W8.parece), style: { ...t4.light, fontSize: 92 } },
                { text: "pouco.", at: at(W8.pouco), style: { ...t4.impact, fontSize: 120, color: d4.red } },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t4.head, fontSize: 92 }}
              gap={22}
              words={[
                { text: "O", at: at(W8.o4), style: { ...t4.light, fontSize: 92 } },
                { text: "grande", at: at(W8.grande2) },
                { text: "não", at: at(W8.nao), style: { ...t4.impact, fontSize: 120, color: d4.red } },
                { text: "vale", at: at(W8.vale), style: { ...t4.impact, fontSize: 120, color: d4.red } },
                { text: "tanto,", at: at(W8.tanto), style: { ...t4.impact, fontSize: 120, color: d4.red } },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capC }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 60 }}
              gap={15}
              words={[
                { text: "mas", at: at(W8.mas) },
                { text: "dois", at: at(W8.dois4), style: { color: d4.text, fontWeight: 600 } },
                { text: "pequenos", at: at(W8.pequenos3), style: { color: d4.text, fontWeight: 600 } },
                { text: "por", at: at(W8.por6) },
                { text: "apenas", at: at(W8.apenas) },
                { text: "um", at: at(W8.um4), style: { color: d4.green, fontWeight: 700 } },
                { text: "real", at: at(W8.real), style: { color: d4.green, fontWeight: 700 } },
                { text: "a", at: at(W8.a3), style: { color: d4.green, fontWeight: 700 } },
                { text: "mais", at: at(W8.mais), style: { color: d4.green, fontWeight: 700 } },
                { text: "que", at: at(W8.que3) },
                { text: "o", at: at(W8.o5) },
                { text: "grande", at: at(W8.grande3) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capD }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 70 }}
              gap={16}
              words={[
                { text: "parecem", at: at(W8.parecem) },
                { text: "o", at: at(W8.o6) },
              ]}
            />
            <SyncedWords
              style={{ ...t4.impact, fontSize: 132, color: d4.green }}
              gap={26}
              rise={50}
              words={[
                { text: "melhor", at: at(W8.melhor) },
                { text: "negócio.", at: at(W8.negocio) },
              ]}
            />
          </div>
        </div>

        {/* o cliente pesa as três opções: dois fios partem-se, um fica e aquece */}
        <SnapThread from={[Cu.x - 40, Cu.y - 70]} to={[colX[0], top + H + 10]} at={at(W8.o3)} snapAt={at(W8.pouco) + 4} bend={0.12} color="rgba(255,255,255,0.45)" glow="rgba(255,255,255,0.06)" />
        <SnapThread from={[Cu.x, Cu.y - 80]} to={[colX[1], top + H + 10]} at={at(W8.o3) + 3} snapAt={at(W8.tanto) + 4} bend={0} color="rgba(255,255,255,0.45)" glow="rgba(255,255,255,0.06)" />
        <Thread from={[Cu.x + 40, Cu.y - 70]} to={[colX[2], top + H + 10]} at={at(W8.o3) + 6} bend={-0.12} color="rgba(255,255,255,0.45)" glow="rgba(255,255,255,0.06)" width={3} />
        <Thread from={[Cu.x + 40, Cu.y - 70]} to={[colX[2], top + H + 10]} at={at(W8.melhor)} bend={-0.12} color={d4.green} glow={d4.greenGlow} width={6} />

        {OPTIONS.map((o, i) => {
          const a = useArrive(4 + i * 3, 0, 120); // eslint-disable-line react-hooks/rules-of-hooks
          const dim = i === 0 ? dim0 : i === 1 ? dim1 : 0;
          const isBest = i === 2;
          return (
            <div key={i} style={{ position: "absolute", left: colX[i] - 150, top: top + (isBest ? breath.float * best : 0), width: 300, ...a.style }}>
              <DarkCard
                radius={40}
                style={{
                  height: H,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 40,
                  gap: 10,
                  opacity: 1 - dim * 0.55,
                  filter: `saturate(${1 - dim * 0.8})`,
                  transform: `scale(${isBest ? 1 + best * 0.07 : 1 - dim * 0.04})`,
                  border: `2px solid ${isBest && best > 0.1 ? d4.green : d4.stroke}`,
                  boxShadow: isBest && best > 0.1 ? `0 0 80px -10px ${d4.greenGlow}, inset 0 1.5px 0 ${d4.strokeStrong}` : undefined,
                }}
              >
                <div style={{ height: 210, display: "flex", alignItems: "flex-end" }}>
                  <Treat pair={o.pair} big={i === 1} size={160} id={`r5${i}`} />
                </div>
                <div style={{ ...t4.mono, fontSize: 22 }}>{o.name}</div>
                <div style={{ ...t4.head, fontSize: 76, color: isBest && best > 0.1 ? d4.green : d4.text }}>{o.price}</div>
              </DarkCard>
              {i < 2 && dim > 0 && (
                <div style={{ position: "absolute", left: 150, top: -28, transform: `translateX(-50%) scale(${spring({ frame: frame - at(i ? W8.tanto : W8.pouco), fps, config: emo.arrive })})` }}>
                  <Tag kind="neg" size={i ? 26 : 30}>
                    {i ? "não vale tanto" : "pouco"}
                  </Tag>
                </div>
              )}
              {isBest && best > 0.01 && (
                <div style={{ position: "absolute", left: 150, top: -30, transform: `translateX(-50%) scale(${best})` }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 999, background: d4.green, ...t4.head, color: c2.white, fontSize: 26, whiteSpace: "nowrap", boxShadow: `0 0 40px -6px ${d4.greenGlow}` }}>
                    <IconCheck size={28} stroke={3} />
                    melhor negócio
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* a diferença: só +R$ 1 entre o grande e os dois pequenos */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={`M ${colX[1] + 60} ${top + H + 24} Q ${(colX[1] + colX[2]) / 2} ${top + H + 150} ${colX[2] - 60} ${top + H + 24}`}
            stroke={d4.green}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${bracket} 1`}
            opacity={bracket > 0 ? 1 : 0}
          />
        </svg>
        {plus > 0.01 && (
          <div style={{ position: "absolute", left: (colX[1] + colX[2]) / 2, top: top + H + 100, transform: `translateX(-50%) scale(${plus})` }}>
            <Tag kind="pos" size={40}>
              + R$ 1
            </Tag>
          </div>
        )}

        {/* o cliente */}
        <div
          style={{
            position: "absolute",
            left: Cu.x - 220,
            top: Cu.y - 220,
            width: 440,
            height: 440,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${d4.greenGlow}, rgba(61,220,132,0) 65%)`,
            opacity: warm,
          }}
        />
        <div style={{ position: "absolute", left: Cu.x - 80, top: Cu.y - 80, transform: `scale(${beat})` }}>
          <Avatar size={160} tone="white" ring />
        </div>
        <Ripple at={at(W8.melhor) + 4} x={colX[2]} y={top + H / 2} color={d4.green} max={360} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 6. O truque: uma opção-isca que empurra para a escolha que você quer ———
export const S6Truque: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.truque.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const capA = useWindow(at(W8.esse) - 4, at(W8.criar) - 1);
  const capB = useWindow(at(W8.criar) - 1, durationInFrames + 30);
  const decoyIn = useArrive(at(W8.truque), -200, 60);
  const targetIn = useArrive(at(W8.truque) + 4, 200, 60);
  const isca = spring({ frame: frame - at(W8.existe), fps, config: emo.arrive });
  const arrow = interpolate(frame, [at(W8.fazer), at(W8.fazer) + 0.5 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const chosen = spring({ frame: frame - at(W8.escolher), fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const beat = useHeartbeat(at(W8.quer), 1);
  const Cu = { x: 540, y: 1640 };
  const D = { x: 280, y: 1130 };
  const T = { x: 800, y: 1130 };

  return (
    <SceneShell surface="abyss" pattern="rings" enter="iris" irisAt={[540, 1130]}>
      <Bokeh seed="e6" count={12} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 72 }}
              gap={16}
              words={[
                { text: "Esse", at: at(W8.esse) },
                { text: "é", at: at(W8.e3) },
                { text: "o", at: at(W8.o7) },
              ]}
            />
            <SyncedWords style={{ ...t4.impact, fontSize: 210, color: d4.turq }} rise={60} words={[{ text: "truque.", at: at(W8.truque) }]} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t4.light, fontSize: 62 }}
              gap={15}
              words={[
                { text: "Criar", at: at(W8.criar), style: { color: d4.text, fontWeight: 600 } },
                { text: "uma", at: at(W8.uma2) },
                { text: "opção", at: at(W8.opcao3), style: { color: d4.turq, fontWeight: 600 } },
                { text: "que", at: at(W8.que4) },
                { text: "existe", at: at(W8.existe) },
                { text: "só", at: at(W8.so), style: { color: d4.text, fontWeight: 600 } },
                { text: "para", at: at(W8.para) },
                { text: "fazer", at: at(W8.fazer) },
                { text: "o", at: at(W8.o8) },
                { text: "cliente", at: at(W8.cliente3) },
                { text: "escolher", at: at(W8.escolher), style: { color: d4.text, fontWeight: 600 } },
                { text: "o", at: at(W8.o9) },
                { text: "que", at: at(W8.que5) },
                { text: "você", at: at(W8.voce4), style: { color: d4.green, fontWeight: 700 } },
                { text: "quer.", at: at(W8.quer), style: { color: d4.green, fontWeight: 700 } },
              ]}
            />
          </div>
        </div>

        {/* a isca empurra para o alvo */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: arrow > 0 ? 1 : 0 }}>
          <path d={`M ${D.x + 40} ${D.y - 230} Q 540 ${D.y - 420} ${T.x - 40} ${T.y - 230}`} stroke={d4.turq} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${arrow} 1`} pathLength={1} />
          {arrow > 0.95 && <path d={`M ${T.x - 40} ${T.y - 230} l -34 -10 M ${T.x - 40} ${T.y - 230} l -14 -32`} stroke={d4.turq} strokeWidth={6} strokeLinecap="round" fill="none" />}
        </svg>

        {/* isca (o grande) */}
        <div style={{ position: "absolute", left: D.x - 160, top: D.y - 200, width: 320, ...decoyIn.style }}>
          <div
            style={{
              height: 400,
              borderRadius: 40,
              border: `3px dashed ${isca > 0.3 ? d4.turq : d4.strokeStrong}`,
              background: d4.glass,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: 34,
              gap: 8,
              opacity: 1 - chosen * 0.4,
            }}
          >
            <Cupcake size={190} id="d6" />
            <div style={{ ...t4.mono, fontSize: 22 }}>grande</div>
            <div style={{ ...t4.head, fontSize: 68 }}>R$ 9</div>
          </div>
          {isca > 0.01 && (
            <div style={{ position: "absolute", left: 160, top: -26, transform: `translateX(-50%) scale(${isca}) rotate(-4deg)` }}>
              <Tag kind="turq" size={30}>
                isca
              </Tag>
            </div>
          )}
        </div>
        {/* o alvo (dois pequenos) */}
        <div style={{ position: "absolute", left: T.x - 160, top: T.y - 200, width: 320, ...targetIn.style }}>
          <DarkCard
            radius={40}
            style={{
              height: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: 34,
              gap: 8,
              transform: `scale(${1 + chosen * 0.07})`,
              border: `2px solid ${chosen > 0.1 ? d4.green : d4.stroke}`,
              boxShadow: chosen > 0.1 ? `0 0 80px -10px ${d4.greenGlow}` : undefined,
            }}
          >
            <Treat pair size={170} id="t6" />
            <div style={{ ...t4.mono, fontSize: 22 }}>2 pequenos</div>
            <div style={{ ...t4.head, fontSize: 68, color: chosen > 0.1 ? d4.green : d4.text }}>R$ 10</div>
          </DarkCard>
          {chosen > 0.01 && (
            <div style={{ position: "absolute", right: -20, top: -24, transform: `scale(${chosen})` }}>
              <Badge kind="pos" size={84} />
            </div>
          )}
        </div>

        {/* o cliente: larga a isca, liga-se ao alvo */}
        <SnapThread from={[Cu.x - 50, Cu.y - 70]} to={[D.x, D.y + 210]} at={at(W8.criar)} snapAt={at(W8.escolher) + 2} bend={0.15} color="rgba(255,255,255,0.5)" glow="rgba(255,255,255,0.06)" />
        <Thread from={[Cu.x + 50, Cu.y - 70]} to={[T.x, T.y + 210]} at={at(W8.escolher)} bend={-0.15} color={d4.green} glow={d4.greenGlow} width={6} />
        <div style={{ position: "absolute", left: Cu.x - 80, top: Cu.y - 80, transform: `scale(${beat})` }}>
          <Avatar size={160} tone="white" ring />
        </div>
        <Ripple at={at(W8.escolher) + 2} x={T.x} y={T.y} color={d4.green} max={380} />
        <Ripple at={at(W8.quer)} x={Cu.x} y={Cu.y} color={d4.green} max={300} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— 7. Siga para mais estratégias ———
export const S7Siga: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES8.siga.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const btnIn = spring({ frame: frame - at(W8.siga), fps, config: emo.arrive });
  const pressAt = at(W8.para2) - 2;
  const press = interpolate(frame, [pressAt, pressAt + 3, pressAt + 9], [0, 1, 0], clamp);
  const followed = frame >= pressAt + 4;
  const cup = spring({ frame: frame - at(W8.estrategias), fps, config: emo.arrive });
  const B = { x: 540, y: 1300 };

  return (
    <SceneShell surface="night" pattern="none" enter="iris" irisAt={[540, 1300]}>
      <Bokeh seed="e7" count={14} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 250, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords style={{ ...t4.hero, fontSize: 190 }} rise={60} words={[{ text: "Siga", at: at(W8.siga) }]} />
          <SyncedWords
            style={{ ...t4.light, fontSize: 64, marginTop: 10 }}
            gap={16}
            words={[
              { text: "para", at: at(W8.para2) },
              { text: "mais", at: at(W8.mais2) },
            ]}
          />
          <SyncedWords
            style={{ ...t4.head, fontSize: 84, marginTop: 4 }}
            gap={20}
            rise={44}
            words={[
              { text: "estratégias", at: at(W8.estrategias), style: { ...t4.impact, fontSize: 116, color: d4.turq } },
              { text: "de", at: at(W8.de3), style: { ...t4.light, fontSize: 84 } },
              { text: "marketing.", at: at(W8.marketing) },
            ]}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: B.x - 260,
            top: B.y - 70,
            width: 520,
            height: 140,
            borderRadius: 70,
            background: followed ? c2.white : c2.turq,
            boxShadow: `0 0 80px -16px ${c2.glowTurq}, inset 0 0 0 3px ${followed ? d4.turq : "rgba(255,255,255,0.25)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            ...t4.head,
            color: followed ? c2.turqDeep : c2.white,
            fontSize: 60,
            opacity: interpolate(btnIn, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - btnIn) * 100}px) scale(${(0.85 + btnIn * 0.15) * (1 - press * 0.07)})`,
          }}
        >
          {followed ? <IconCheck size={60} stroke={3} /> : <span style={{ fontSize: 72, fontWeight: 400, marginTop: -6 }}>+</span>}
          {followed ? "Seguindo" : "Seguir"}
        </div>
        <Ripple at={pressAt + 3} x={B.x} y={B.y} color={d4.turq} max={440} />
        <div
          style={{
            position: "absolute",
            left: B.x - 90,
            top: B.y + 130,
            opacity: interpolate(cup, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - cup) * 80}px) scale(${0.8 + cup * 0.2}) rotate(${Math.sin(frame / 8) * 3}deg)`,
          }}
        >
          <Cupcake size={180} glow={cup} id="s7" />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
