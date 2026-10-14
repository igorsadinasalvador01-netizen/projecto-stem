import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { c2, ease } from "../../v2/theme2";
import { t2 } from "../../v2/type2";
import { clamp, SyncedWords, useAt, useBreath, useCameraPush } from "../../components/Motion";
import { SceneShell } from "../../v2/components/Shell";
import { Avatar, Badge, Bubble, IconArrow, Pill } from "../../v2/components/Kit";
import { Bokeh, emo, Ripple, Star, Thread, useArrive, useHeartbeat } from "../Emotion";
import { SCENES6, W6 } from "../timeline6";
import { useWindow } from "./A_Conexao";

// ——— fachada de restaurante: fria e vazia, ou quente e cheia ———
const Store: React.FC<{ x: number; y: number; w: number; h: number; warm: number; awning: [string, string] }> = ({
  x,
  y,
  w,
  h,
  warm,
  awning,
}) => {
  const frame = useCurrentFrame();
  const flicker = 0.92 + Math.sin(frame * 0.9) * 0.04 + Math.sin(frame * 2.3) * 0.03;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* luz que sai da loja (só na quente) */}
      <div
        style={{
          position: "absolute",
          inset: -120,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 60%, ${emo.warm}, ${emo.warmClear} 65%)`,
          opacity: warm * flicker,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 34,
          background: c2.white,
          boxShadow: `0 40px 80px -30px ${c2.shadowDeep}, 0 0 0 2px ${c2.line}`,
          overflow: "hidden",
        }}
      >
        {/* toldo às riscas com recorte em ondas */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 96,
            background: `repeating-linear-gradient(90deg, ${awning[0]} 0 44px, ${awning[1]} 44px 88px)`,
            WebkitMaskImage: "radial-gradient(circle at 22px 96px, transparent 21px, #000 22px)",
            WebkitMaskSize: "44px 100%",
          }}
        />
        {/* montra */}
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 128,
            height: h * 0.42,
            borderRadius: 18,
            background: `linear-gradient(180deg, rgba(255,226,190,${0.25 + warm * 0.7}) 0%, rgba(214,242,242,${0.4 + warm * 0.4}) 100%)`,
            boxShadow: `inset 0 0 0 2px ${c2.line}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(150,170,176,${0.55 * (1 - warm)}), rgba(190,204,207,${0.4 * (1 - warm)}))`,
            }}
          />
          {/* mesas */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 24,
                left: 26 + i * ((w - 60 - 52) / 2) - 18,
                width: 52,
                height: 14,
                borderRadius: 7,
                background: warm > 0.5 ? c2.turqDeep : c2.inkFaint,
                opacity: 0.6,
              }}
            />
          ))}
          {/* reflexo */}
          <div style={{ position: "absolute", top: -40, left: 40, width: 60, height: 400, background: "rgba(255,255,255,0.45)", transform: "rotate(24deg)" }} />
        </div>
        {/* porta */}
        <div
          style={{
            position: "absolute",
            left: w / 2 - 62,
            bottom: 0,
            width: 124,
            height: h * 0.3,
            borderRadius: "18px 18px 0 0",
            background: warm > 0.5 ? `linear-gradient(180deg, rgba(255,214,170,0.9), ${c2.turqMist})` : c2.mist,
            boxShadow: `inset 0 0 0 2px ${c2.line}`,
          }}
        />
      </div>
    </div>
  );
};

// ——— Cena 4: o restaurante vazio vs. o da fila ———
export const S4Restaurante: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.restaurante.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const t = frame / fps;

  const left = useArrive(at(W6.restaurante), -300, 40);
  const right = useArrive(at(W6.outro), 300, 40);
  const warm = interpolate(frame, [at(W6.fila), at(W6.porta) + 0.4 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const coldDim = interpolate(frame, [at(W6.acredita), at(W6.melhor)], [0, 1], clamp);
  const plate = spring({ frame: frame - at(W6.provar), fps, config: emo.arrive });
  const plateOut = interpolate(frame, [at(W6.acredita) - 4, at(W6.acredita) + 0.3 * fps], [0, 1], { easing: ease.in, ...clamp });
  const lift = Math.max(0, Math.sin((frame - at(W6.comida)) / 5)) * interpolate(frame, [at(W6.comida), at(W6.comida) + 4], [0, 1], clamp);
  const meWalk = spring({ frame: frame - at(W6.daFila), fps, config: emo.spring });
  const melhor = spring({ frame: frame - at(W6.melhor), fps, config: emo.arrive });

  const queue = [655, 735, 815, 895];
  const meStep = spring({ frame: frame - at(W6.entra), fps, config: emo.spring });
  const me0 = { x: 540 - meStep * 110, y: 1700 };
  const me1 = { x: 975, y: 1300 };
  const meX = me0.x + (me1.x - me0.x) * meWalk;
  const meY = me0.y + (me1.y - me0.y) * meWalk - Math.sin(meWalk * Math.PI) * 120;
  const meIn = spring({ frame: frame - at(14.24), fps, config: emo.arrive });
  const street = interpolate(frame, [at(W6.exemplo), at(W6.exemplo) + 0.6 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const bob = (i: number) => Math.sin(t * 3 + i * 1.3) * 3;

  const capA = useWindow(at(W6.exemplo) - 6, at(16.0));
  const capB = useWindow(at(16.0), at(W6.mesmo) - 1);
  const capC = useWindow(at(W6.mesmo) - 1, at(18.48) - 1);
  const capD = useWindow(at(18.48) - 1, durationInFrames + 30);

  return (
    <SceneShell surface="white" pattern="grid" enter="wipeLeft">
      <Bokeh seed="c4" count={10} strength={0.55} color={warm > 0.5 ? emo.warm : c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 200, left: 50, right: 50 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 64 }}
              gap={16}
              words={[
                { text: "Por", at: at(13.68) },
                { text: "exemplo,", at: at(W6.exemplo) },
                { text: "você", at: at(14.24) },
                { text: "entra", at: at(W6.entra) },
                { text: "num", at: at(14.72) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.head, fontSize: 92, marginTop: 8 }}
              gap={22}
              rise={44}
              words={[
                { text: "restaurante", at: at(W6.restaurante) },
                { text: "vazio", at: at(W6.vazio), style: { ...t2.impact, fontSize: 112, color: c2.red } },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 64 }}
              gap={16}
              words={[
                { text: "e", at: at(15.76) },
                { text: "em", at: at(16.0) },
                { text: "outro", at: at(W6.outro), style: { color: c2.ink, fontWeight: 600 } },
                { text: "com", at: at(16.4) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.head, fontSize: 92, marginTop: 8 }}
              gap={22}
              rise={44}
              words={[
                { text: "fila", at: at(W6.fila), style: { ...t2.impact, fontSize: 116, color: c2.green } },
                { text: "na", at: at(16.88) },
                { text: "porta.", at: at(W6.porta) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capC }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 68 }}
              gap={16}
              words={[
                { text: "Mesmo", at: at(W6.mesmo) },
                { text: "sem", at: at(17.52) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.impact, fontSize: 120, color: c2.turqDeep, marginTop: 4 }}
              gap={26}
              rise={44}
              words={[
                { text: "provar", at: at(W6.provar) },
                { text: "a", at: at(18.0) },
                { text: "comida,", at: at(W6.comida) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capD }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 64 }}
              gap={16}
              words={[
                { text: "você", at: at(18.48) },
                { text: "já", at: at(18.64) },
                { text: "acredita", at: at(W6.acredita), style: { color: c2.ink, fontWeight: 600 } },
                { text: "que", at: at(19.12) },
                { text: "o", at: at(19.28) },
                { text: "da", at: at(19.36) },
                { text: "fila", at: at(W6.daFila), style: { color: c2.green, fontWeight: 600 } },
                { text: "é", at: at(19.84) },
              ]}
            />
            <SyncedWords style={{ ...t2.impact, fontSize: 150, color: c2.green, marginTop: 4 }} rise={56} words={[{ text: "melhor.", at: at(W6.melhor) }]} />
          </div>
        </div>

        {/* passeio */}
        <div
          style={{
            position: "absolute",
            left: 540 - 500 * street,
            width: 1000 * street,
            top: 1340,
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${c2.turqClear}, ${c2.lineStrong} 20%, ${c2.lineStrong} 80%, ${c2.turqClear})`,
          }}
        />

        {/* fachadas */}
        <div style={{ position: "absolute", inset: 0, ...left.style, filter: `saturate(${1 - coldDim * 0.6})`, opacity: (left.style.opacity as number) * (1 - coldDim * 0.35) }}>
          <Store x={60} y={690} w={440} h={560} warm={0} awning={[c2.lineStrong, c2.white]} />
          <div style={{ position: "absolute", left: 280, top: 660, transform: `translateX(-50%) scale(${spring({ frame: frame - at(W6.vazio), fps, config: emo.arrive })})` }}>
            <Pill kind="neg" icon="x" size={34}>
              vazio
            </Pill>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, ...right.style }}>
          <Store x={580} y={690} w={440} h={560} warm={warm} awning={[c2.turq, c2.white]} />
          <div style={{ position: "absolute", left: 800, top: 660, transform: `translateX(-50%) scale(${spring({ frame: frame - at(W6.porta), fps, config: emo.arrive })})` }}>
            <Pill kind="pos" icon="check" size={34}>
              fila
            </Pill>
          </div>
        </div>
        {/* a fila: chegam em arco, um a um */}
        {queue.map((qx, i) => {
          const a = useArrive(at(W6.fila) + i * 3, 160 + i * 40, 120); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: qx - 38, top: 1262 + bob(i), ...a.style }}>
              <Avatar size={76} tone={i % 2 ? "turq" : "mist"} />
            </div>
          );
        })}
        {melhor > 0 && (
          <>
            <Ripple at={at(W6.melhor)} x={800} y={935} color={c2.green} max={420} />
            <div style={{ position: "absolute", left: 800 - 48, top: 887, transform: `scale(${melhor})` }}>
              <Badge kind="pos" size={96} />
            </div>
          </>
        )}

        {/* prato tapado com "?" — ninguém provou */}
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            top: 1410,
            width: 300,
            opacity: interpolate(plate, [0, 0.4], [0, 1], clamp) * (1 - plateOut),
            transform: `translateY(${(1 - plate) * 80 + plateOut * 40}px) scale(${0.9 + plate * 0.1})`,
          }}
        >
          <div style={{ position: "relative", height: 210 }}>
            <div
              style={{
                position: "absolute",
                left: 30,
                right: 30,
                bottom: 22,
                height: 150,
                borderRadius: "150px 150px 12px 12px",
                background: `linear-gradient(160deg, ${c2.white}, ${c2.mist})`,
                boxShadow: `0 24px 50px -24px ${c2.shadowDeep}, inset 0 0 0 2px ${c2.line}`,
                transform: `translateY(${-lift * 14}px) rotate(${-lift * 4}deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...t2.impact,
                fontSize: 110,
                color: c2.turqDeep,
              }}
            >
              ?
            </div>
            <div style={{ position: "absolute", left: 136, right: 136, bottom: 168, height: 16, borderRadius: 8, background: c2.inkFaint, opacity: 0.5, transform: `translateY(${-lift * 14}px)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, borderRadius: 13, background: c2.white, boxShadow: `0 16px 30px -14px ${c2.shadowDeep}, inset 0 0 0 2px ${c2.line}` }} />
          </div>
        </div>

        {/* você: chega e escolhe a fila */}
        <Thread from={[me0.x, me0.y - 40]} to={[queue[3], 1300]} at={at(W6.daFila) - 6} bend={0.3} color={c2.green} glow={c2.glowGreen} width={3} />
        <div
          style={{
            position: "absolute",
            left: meX - 48,
            top: meY - 48,
            opacity: interpolate(meIn, [0, 0.3], [0, 1], clamp),
            transform: `scale(${(0.8 + meIn * 0.2) * (1 - meWalk * 0.2)})`,
          }}
        >
          <Avatar size={96} tone="turq" ring />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Cena 5: o seu produto recebe a prova (comprou · resultado · recomenda) ———
const ProofCard: React.FC<{ at: number; side: -1 | 1; y: number; children: React.ReactNode }> = ({ at, side, y, children }) => {
  const a = useArrive(at, side * 420, 60);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: y,
        height: 150,
        borderRadius: 36,
        background: c2.glassOnTurq,
        border: `2px solid ${c2.strokeOnTurq}`,
        boxShadow: `0 30px 60px -30px ${c2.shadowTurq}`,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "0 40px",
        ...a.style,
      }}
    >
      {children}
    </div>
  );
};

export const S5Produto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.produto.from);
  const push = useCameraPush(durationInFrames, 1.04);
  const breath = useBreath(1.2, 0.8);
  const prod = spring({ frame: frame - at(W6.produto), fps, config: emo.arrive });
  const beat = Math.max(useHeartbeat(at(W6.comprou) + 8, 1), useHeartbeat(at(W6.resultado) + 8, 1), useHeartbeat(at(W6.recomenda) + 8, 1));
  const trust = interpolate(
    frame,
    [at(W6.comprou), at(W6.comprou) + 10, at(W6.resultado), at(W6.resultado) + 10, at(W6.recomenda), at(W6.recomenda) + 12],
    [0, 0.34, 0.34, 0.67, 0.67, 1],
    { easing: emo.ease, ...clamp },
  );
  const count = Math.round(interpolate(frame, [at(W6.comprou), at(W6.comprou) + 0.9 * fps], [0, 1248], { easing: ease.out, ...clamp }));
  const spark = interpolate(frame, [at(W6.resultado) + 4, at(W6.resultado) + 0.7 * fps], [0, 1], { easing: emo.ease, ...clamp });
  const capA = useWindow(at(20.24) - 6, at(W6.mostra) - 1);
  const capB = useWindow(at(W6.mostra) - 1, durationInFrames + 30);
  const P = { x: 540, y: 790 };

  return (
    <SceneShell surface="deep" pattern="rings" enter="iris" irisAt={[540, 790]}>
      <Bokeh seed="c5" count={12} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 210, left: 60, right: 60 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 68, color: c2.whiteDim }}
              gap={16}
              words={[
                { text: "É", at: at(20.24) },
                { text: "o", at: at(20.32) },
                { text: "mesmo", at: at(W6.mesmo2) },
                { text: "com", at: at(20.64) },
                { text: "o", at: at(20.8) },
                { text: "seu", at: at(20.88) },
              ]}
            />
            <SyncedWords style={{ ...t2.impact, fontSize: 150, color: c2.aqua, marginTop: 4 }} rise={56} words={[{ text: "produto.", at: at(W6.produto) }]} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t2.hero, fontSize: 104, color: c2.white }}
              gap={24}
              rise={44}
              words={[
                { text: "Mostra", at: at(W6.mostra) },
                { text: "quem", at: at(21.84), style: { ...t2.light, fontSize: 104, color: c2.whiteDim } },
                { text: "já…", at: at(22.08), style: { ...t2.light, fontSize: 104, color: c2.whiteDim } },
              ]}
            />
          </div>
        </div>

        {/* fios: cada prova liga-se ao produto */}
        <Thread from={[90, 1100]} to={[P.x - 170, P.y + 20]} at={at(W6.comprou) + 4} bend={-0.35} color={c2.aqua} glow={c2.glowTurq} />
        <Thread from={[990, 1280]} to={[P.x + 170, P.y + 40]} at={at(W6.resultado) + 4} bend={-0.35} color={c2.aqua} glow={c2.glowTurq} />
        <Thread from={[90, 1460]} to={[P.x - 120, P.y + 150]} at={at(W6.recomenda) + 4} bend={-0.3} color={c2.aqua} glow={c2.glowTurq} />

        {/* o produto */}
        <div
          style={{
            position: "absolute",
            left: P.x - 160,
            top: P.y - 160 + breath.float,
            width: 320,
            height: 320,
            opacity: interpolate(prod, [0, 0.3], [0, 1], clamp),
            transform: `translateY(${(1 - prod) * 120}px) scale(${(0.8 + prod * 0.2) * beat}) rotate(${breath.tilt}deg)`,
          }}
        >
          <div style={{ position: "absolute", inset: -90, borderRadius: "50%", background: `radial-gradient(circle, rgba(166,238,238,${0.15 + trust * 0.35}), ${c2.turqClear} 70%)` }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 64,
              background: `linear-gradient(150deg, ${c2.white}, ${c2.turqMist})`,
              boxShadow: `0 50px 90px -30px ${c2.shadowTurq}, inset 0 2px 0 rgba(255,255,255,0.9)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            {/* caixa em perspetiva */}
            <svg width={150} height={150} viewBox="0 0 64 64">
              <path d="M32 6 L56 18 L32 30 L8 18 Z" fill={c2.turqLight} />
              <path d="M8 18 L32 30 L32 58 L8 46 Z" fill={c2.turq} />
              <path d="M56 18 L32 30 L32 58 L56 46 Z" fill={c2.turqDeep} />
              <path d="M20 12 L44 24 L44 32" stroke={c2.white} strokeWidth={3} fill="none" opacity={0.85} />
            </svg>
            <div style={{ ...t2.mono, fontSize: 24, color: c2.turqDeep }}>seu produto</div>
          </div>
        </div>

        {/* provas */}
        <ProofCard at={at(W6.comprou)} side={-1} y={1030}>
          <div style={{ display: "flex" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ marginLeft: i ? -26 : 0 }}>
                <Avatar size={74} tone={i === 1 ? "white" : "glass"} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...t2.head, fontSize: 52, color: c2.white }}>comprou</div>
            <div style={{ ...t2.mono, fontSize: 22, color: c2.whiteDim }}>{count.toLocaleString("pt-BR")} clientes</div>
          </div>
          <Badge kind="pos" size={70} />
        </ProofCard>
        <ProofCard at={at(W6.resultado)} side={1} y={1210}>
          <svg width={150} height={84} viewBox="0 0 150 84" style={{ overflow: "visible" }}>
            <path d="M4 76 L40 60 L70 66 L104 34 L146 8" stroke={c2.greenLight} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${spark} 1`} />
            {spark > 0.95 && <circle cx={146} cy={8} r={9} fill={c2.white} />}
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ ...t2.head, fontSize: 52, color: c2.white }}>teve resultado</div>
            <div style={{ ...t2.mono, fontSize: 22, color: c2.whiteDim }}>antes → depois</div>
          </div>
          <div style={{ color: c2.greenLight, transform: "rotate(-45deg)" }}>
            <IconArrow size={56} stroke={3} />
          </div>
        </ProofCard>
        <ProofCard at={at(W6.recomenda)} side={-1} y={1390}>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={40} fill={interpolate(frame, [at(W6.recomenda) + 4 + i * 2, at(W6.recomenda) + 8 + i * 2], [0, 1], clamp)} />
            ))}
          </div>
          <div style={{ flex: 1, ...t2.impact, fontSize: 60, color: c2.white }}>“recomendo!”</div>
        </ProofCard>

        {/* medidor de confiança */}
        <div style={{ position: "absolute", left: 90, right: 90, top: 1640, opacity: interpolate(frame, [at(W6.comprou), at(W6.comprou) + 8], [0, 1], clamp) }}>
          <div style={{ display: "flex", justifyContent: "space-between", ...t2.mono, fontSize: 24, color: c2.whiteDim }}>
            <span>confiança</span>
            <span style={{ color: trust > 0.99 ? c2.greenLight : c2.whiteDim }}>{Math.round(trust * 100)}%</span>
          </div>
          <div style={{ marginTop: 16, height: 18, borderRadius: 9, background: c2.glassOnTurq, overflow: "hidden" }}>
            <div
              style={{
                width: `${trust * 100}%`,
                height: "100%",
                borderRadius: 9,
                background: `linear-gradient(90deg, ${c2.turqLight}, ${c2.greenLight})`,
                boxShadow: `0 0 24px ${c2.glowGreen}`,
              }}
            />
          </div>
        </div>
        <Ripple at={at(W6.recomenda) + 12} x={P.x} y={P.y} color={c2.aqua} max={460} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Cena 6: não precisa ser você a dizer — deixa o coro falar ———
const CHORUS = [
  { x: 70, y: 620, side: "left" as const, text: "Recomendo!", at: W6.deixa, stars: false },
  { x: 330, y: 820, side: "right" as const, text: "Funciona mesmo", at: 26.4, stars: false },
  { x: 70, y: 1020, side: "left" as const, text: "Amei", at: W6.outros2, stars: true },
  { x: 380, y: 1220, side: "right" as const, text: "Valeu a pena", at: W6.falarem, stars: false },
];

export const S6Coro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.coro.from);
  const push = useCameraPush(durationInFrames, 1.05);
  const beat = useHeartbeat(at(W6.porVoce), 2);
  const mine = spring({ frame: frame - at(W6.falar), fps, config: emo.arrive });
  const strike = interpolate(frame, [at(W6.bom) + 2, at(W6.bom) + 9], [0, 1], { easing: ease.out, ...clamp });
  const mineOut = interpolate(frame, [at(W6.deixa), at(W6.deixa) + 0.3 * fps], [0, 1], { easing: ease.in, ...clamp });
  const shake = Math.sin((frame - at(W6.bom)) * 1.6) * 8 * interpolate(frame, [at(W6.bom) + 2, at(W6.bom) + 6, at(W6.bom) + 14], [0, 1, 0], clamp);
  const me = { x: 540, y: 1560 };
  const capA = useWindow(at(W6.nao) - 6, at(W6.deixa) - 1);
  const capB = useWindow(at(W6.deixa) - 1, durationInFrames + 30);

  return (
    <SceneShell surface="white" pattern="dots" enter="panel">
      <Bokeh seed="c6" count={12} strength={0.55} color={c2.glowTurq} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 200, left: 60, right: 60 }}>
          <div style={{ position: "absolute", left: 0, right: 0, ...capA }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 70 }}
              gap={16}
              words={[
                { text: "Não", at: at(W6.nao), style: { color: c2.red, fontWeight: 600 } },
                { text: "precisa", at: at(W6.precisa) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.head, fontSize: 104, marginTop: 6 }}
              gap={22}
              rise={44}
              words={[
                { text: "falar", at: at(W6.falar) },
                { text: "que", at: at(25.44), style: { ...t2.light, fontSize: 104 } },
                { text: "é", at: at(25.68), style: { ...t2.light, fontSize: 104 } },
                { text: "bom,", at: at(W6.bom) },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, ...capB }}>
            <SyncedWords
              style={{ ...t2.light, fontSize: 70 }}
              gap={16}
              words={[
                { text: "deixa", at: at(W6.deixa) },
                { text: "os", at: at(26.48) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.impact, fontSize: 132, color: c2.green, marginTop: 2 }}
              gap={26}
              rise={50}
              words={[
                { text: "outros", at: at(W6.outros2) },
                { text: "falarem", at: at(W6.falarem) },
              ]}
            />
            <SyncedWords
              style={{ ...t2.head, fontSize: 70, marginTop: 6 }}
              gap={16}
              words={[
                { text: "por", at: at(27.12) },
                { text: "você.", at: at(W6.porVoce), style: { color: c2.turqDeep } },
              ]}
            />
          </div>
        </div>

        {/* o seu próprio balão: "é bom!" — riscado */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1240,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(mine, [0, 0.3], [0, 1], clamp) * (1 - mineOut),
            transform: `translate(${shake}px, ${(1 - mine) * 60 + mineOut * 40}px) scale(${(0.9 + mine * 0.1) * (1 - mineOut * 0.15)})`,
          }}
        >
          <div style={{ position: "relative" }}>
            <Bubble side="right" tone={strike > 0.5 ? "neg" : "turq"} style={{ ...t2.head, fontSize: 56, padding: "26px 44px" }}>
              O meu é bom!
            </Bubble>
            <div
              style={{
                position: "absolute",
                left: 30,
                top: "50%",
                height: 7,
                width: `calc(${strike} * (100% - 60px))`,
                borderRadius: 4,
                background: c2.red,
              }}
            />
          </div>
        </div>

        {/* o coro: outros falam por você */}
        {CHORUS.map((c, i) => (
          <Thread
            key={`th${i}`}
            from={[c.side === "left" ? c.x + 120 : c.x + 520, c.y + 130]}
            to={[me.x, me.y - 70]}
            at={at(W6.porVoce) + i * 2}
            bend={c.side === "left" ? 0.22 : -0.22}
            color={c2.green}
            glow={c2.glowGreen}
            width={3}
          />
        ))}
        {CHORUS.map((c, i) => {
          const a = useArrive(at(c.at), c.side === "left" ? -200 : 200, 80); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                display: "flex",
                flexDirection: c.side === "left" ? "row" : "row-reverse",
                alignItems: "flex-end",
                gap: 18,
                ...a.style,
              }}
            >
              <Avatar size={92} tone={i % 2 ? "turq" : "mist"} />
              <Bubble side={c.side} tone="pos" style={{ ...t2.head, fontSize: 52, padding: "24px 38px", display: "flex", alignItems: "center", gap: 14 }}>
                {c.text}
                {c.stars && (
                  <span style={{ display: "inline-flex", gap: 2 }}>
                    {[0, 1, 2, 3, 4].map((k) => (
                      <Star key={k} size={34} fill={1} color={c2.green} empty={c2.greenSoft} />
                    ))}
                  </span>
                )}
              </Bubble>
            </div>
          );
        })}

        {/* você recebe a confiança */}
        <div style={{ position: "absolute", left: me.x - 80, top: me.y - 80, transform: `scale(${beat})` }}>
          <div
            style={{
              position: "absolute",
              inset: -90,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${emo.warm}, ${emo.warmClear} 70%)`,
              opacity: interpolate(frame, [at(W6.porVoce), at(W6.porVoce) + 0.5 * fps], [0, 1], clamp),
            }}
          />
          <Avatar size={160} tone="turq" ring />
        </div>
        <Ripple at={at(W6.porVoce) + 6} x={me.x} y={me.y} color={c2.green} max={380} />
      </AbsoluteFill>
    </SceneShell>
  );
};

// ——— Cena 7: tudo converge — e é aí que a venda acontece ———
export const S7Venda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = useAt(SCENES6.venda.from);
  const push = useCameraPush(durationInFrames, 1.06);
  const t = frame / fps;
  const C = { x: 540, y: 1270 };
  const N = 10;
  const ring = Array.from({ length: N }).map((_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2 + t * 0.12;
    const r = 330 + Math.sin(t * 1.4 + i) * 10;
    return { x: C.x + Math.cos(a) * r, y: C.y + Math.sin(a) * r * 0.86 };
  });
  const sale = spring({ frame: frame - at(W6.venda), fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const beat = useHeartbeat(at(W6.venda), 2);
  const burst = interpolate(frame, [at(W6.acontece), at(W6.acontece) + 0.8 * fps], [0, 1], { easing: ease.out, ...clamp });

  return (
    <SceneShell surface="turq" pattern="none" enter="iris" irisAt={[540, 1270]}>
      <Bokeh seed="c7" count={16} color={c2.whiteFaint} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", top: 250, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SyncedWords
            style={{ ...t2.light, fontSize: 72, color: c2.whiteDim }}
            gap={16}
            words={[
              { text: "E", at: at(W6.e) },
              { text: "é", at: at(27.76) },
              { text: "aí", at: at(W6.ai), style: { color: c2.white, fontWeight: 600 } },
              { text: "que", at: at(28.08) },
              { text: "a", at: at(28.24) },
            ]}
          />
          <SyncedWords style={{ ...t2.hero, fontSize: 230, color: c2.white, marginTop: 4 }} rise={70} words={[{ text: "venda", at: at(W6.venda) }]} />
          <SyncedWords style={{ ...t2.impact, fontSize: 170, color: c2.white, marginTop: -6 }} rise={60} words={[{ text: "acontece.", at: at(W6.acontece) }]} />
        </div>

        {/* constelação: cada pessoa liga-se ao centro */}
        {ring.map((p, i) => (
          <Thread key={`t${i}`} from={[p.x, p.y]} to={[C.x, C.y]} at={at(W6.ai) + i} bend={i % 2 ? 0.2 : -0.2} color={c2.white} glow={c2.whiteFaint} width={3} dur={0.4} />
        ))}
        {ring.map((p, i) => {
          const a = useArrive(at(W6.e) + i, (p.x - C.x) * 0.6, (p.y - C.y) * 0.6); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: p.x - 40, top: p.y - 40, ...a.style }}>
              <Avatar size={80} tone={i % 3 ? "glass" : "white"} />
            </div>
          );
        })}

        {/* a venda: selo verde que bate como um coração */}
        <div style={{ position: "absolute", left: C.x - 110, top: C.y - 110, width: 220, height: 220, transform: `scale(${sale * beat})`, opacity: interpolate(sale, [0, 0.2], [0, 1], clamp) }}>
          <div style={{ position: "absolute", inset: -120, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)` }} />
          <Badge kind="pos" size={220} />
        </div>
        <Ripple at={at(W6.venda)} x={C.x} y={C.y} color={c2.white} max={520} />
        <Ripple at={at(W6.acontece)} x={C.x} y={C.y} color={c2.white} max={680} />
        {/* faíscas que se espalham */}
        {burst > 0 &&
          burst < 1 &&
          Array.from({ length: 22 }).map((_, i) => {
            const a = (i / 22) * Math.PI * 2 + random(`ba${i}`) * 0.3;
            const r = 140 + burst * (260 + random(`br${i}`) * 220);
            const s = 8 + random(`bs${i}`) * 10;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: C.x + Math.cos(a) * r - s / 2,
                  top: C.y + Math.sin(a) * r - s / 2,
                  width: s,
                  height: s,
                  borderRadius: "50%",
                  background: i % 3 ? c2.white : c2.aqua,
                  opacity: 1 - burst,
                }}
              />
            );
          })}
      </AbsoluteFill>
    </SceneShell>
  );
};
