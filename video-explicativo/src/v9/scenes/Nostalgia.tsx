import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { F, Face, P, SceneIn } from "../Look";
import { SCENES9, t9 } from "../timeline9";

const S = (id: string) => SCENES9.find((s) => s.id === id)!;
const bounce = { damping: 11, stiffness: 150, mass: 0.7 };
const soft = { damping: 16, stiffness: 90, mass: 1 };

// papel de caderno: linhas azuis e margem vermelha
const Notebook: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 30%, #F7EBD2, ${P.nos.paper})` }}>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(90,140,170,0.28) 62px 64px)" }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 118, width: 3, background: "rgba(210,65,46,0.45)" }} />
  </AbsoluteFill>
);

const Bulb: React.FC<{ size: number; on?: number }> = ({ size, on = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={P.nos.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M32 8a17 17 0 0 0-10 30.8c2 1.6 3 3.6 3 6.2h14c0-2.6 1-4.6 3-6.2A17 17 0 0 0 32 8z" fill={`rgba(255,214,90,${0.25 + on * 0.75})`} />
    <path d="M26 51h12M27 57h10" />
    {on > 0.5 && <path d="M32 1v3M8 14l3 2M56 14l-3 2M4 32h4M60 32h-4" stroke={P.nos.orange} />}
  </svg>
);

const Note: React.FC<{ x: number; y: number; w?: number; rot: number; color: string; at: number; children: React.ReactNode; pin?: boolean }> = ({
  x,
  y,
  w = 260,
  rot,
  color,
  at,
  children,
  pin = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: bounce });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "26px 24px",
        background: color,
        boxShadow: `0 18px 30px -12px ${P.nos.shadow}`,
        transform: `rotate(${rot + (1 - p) * 14}deg) scale(${0.6 + p * 0.4}) translateY(${(1 - p) * -80}px)`,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        fontFamily: F.hand,
        fontSize: 64,
        color: P.nos.ink,
        textAlign: "center",
        lineHeight: 1,
      }}
    >
      {pin ? (
        <div style={{ position: "absolute", left: "50%", top: -14, width: 34, height: 34, marginLeft: -17, borderRadius: 17, background: `radial-gradient(circle at 35% 35%, #FF8A7A, ${P.nos.red})`, boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
      ) : (
        <div style={{ position: "absolute", left: "50%", top: -18, width: 110, height: 36, marginLeft: -55, background: "rgba(255,250,235,0.6)", transform: "rotate(-3deg)" }} />
      )}
      {children}
    </div>
  );
};

// ——— n1: gancho com o rosto (camcorder) ———
export const N1: React.FC = () => (
  <SceneIn kind="none">
    <Face sceneFrom={S("n1").from} look="nos" posY={30} />
  </SceneIn>
);

// ——— n2: muitas ideias, pouco tempo, nenhum conteúdo ———
export const N2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("n2").from);
  const glass = spring({ frame: frame - at(t9("tempo", 2.4)), fps, config: bounce });
  const sand = interpolate(frame, [at(t9("tempo", 2.4)), at(5.4)], [1, 0], clamp);
  const arrow = interpolate(frame, [at(t9("transformar", 3)), at(t9("transformar", 3)) + 0.6 * fps], [0, 1], { easing: theme.ease.out, ...clamp });
  const tv = spring({ frame: frame - at(t9("conteúdo", 4.5)), fps, config: bounce });
  const ideasOn = interpolate(frame, [at(t9("ideias", 4)), at(t9("ideias", 4)) + 6], [0, 1], clamp);
  const flick = random(`tv${frame}`);
  return (
    <SceneIn kind="vhs">
      <Notebook />
      {/* ideias: notas com lâmpadas */}
      {[
        { x: 130, y: 250, r: -7, c: "#F2D06B", d: 0 },
        { x: 420, y: 200, r: 5, c: P.nos.pink, d: 3 },
        { x: 700, y: 280, r: -4, c: "#9ED2C8", d: 6 },
      ].map((n, i) => (
        <Note key={i} x={n.x} y={n.y} rot={n.r} color={n.c} at={n.d} w={240}>
          <Bulb size={120} on={ideasOn} />
        </Note>
      ))}
      <div style={{ position: "absolute", left: 140, top: 640, fontFamily: F.hand, fontSize: 70, color: P.nos.brown, transform: "rotate(-3deg)", opacity: interpolate(frame, [4, 12], [0, 1], clamp) }}>
        ideias: muitas ✓
      </div>
      {/* ampulheta: o tempo a acabar */}
      <div style={{ position: "absolute", left: 110, top: 780, transform: `scale(${glass}) rotate(${(1 - glass) * -20}deg)`, transformOrigin: "50% 100%" }}>
        <svg width={300} height={460} viewBox="0 0 150 230">
          <rect x={10} y={4} width={130} height={14} rx={4} fill={P.nos.brown} />
          <rect x={10} y={212} width={130} height={14} rx={4} fill={P.nos.brown} />
          <path d="M25 18 C25 70 70 95 72 115 C70 135 25 160 25 212 L125 212 C125 160 80 135 78 115 C80 95 125 70 125 18 Z" fill="rgba(255,255,255,0.45)" stroke={P.nos.ink} strokeWidth={3} />
          {/* areia de cima */}
          <clipPath id="top9">
            <path d="M25 18 C25 70 70 95 72 115 L78 115 C80 95 125 70 125 18 Z" />
          </clipPath>
          <rect x={20} y={18 + (1 - sand) * 97} width={110} height={97} fill={P.nos.mustard} clipPath="url(#top9)" />
          {/* areia de baixo */}
          <clipPath id="bot9">
            <path d="M72 115 C70 135 25 160 25 212 L125 212 C125 160 80 135 78 115 Z" />
          </clipPath>
          <rect x={20} y={212 - (1 - sand) * 80} width={110} height={100} fill={P.nos.mustard} clipPath="url(#bot9)" />
          {sand > 0.02 && glass > 0.5 && <rect x={73.5} y={112} width={3} height={100 - (1 - sand) * 78} fill={P.nos.mustard} />}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: F.hand, fontSize: 72, color: P.nos.red }}>tempo</div>
      </div>
      {/* seta desenhada à mão */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M 600 610 C 720 640 800 700 770 800" stroke={P.nos.ink} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${arrow} 1`} />
        {arrow > 0.95 && <path d="M 752 772 L 770 805 L 795 778" stroke={P.nos.ink} strokeWidth={6} fill="none" strokeLinecap="round" />}
      </svg>
      {/* TV antiga sem nada para mostrar */}
      <div style={{ position: "absolute", left: 520, top: 830, width: 470, transform: `scale(${0.5 + tv * 0.5}) translateY(${(1 - tv) * 120}px)`, opacity: interpolate(tv, [0, 0.3], [0, 1], clamp) }}>
        <div style={{ height: 360, borderRadius: 36, background: "linear-gradient(160deg, #8A6141, #5B3B25)", boxShadow: `0 30px 50px -20px ${P.nos.shadow}`, padding: 26, display: "flex", gap: 22 }}>
          <div style={{ flex: 1, borderRadius: 40, overflow: "hidden", background: "#888", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' seed='${Math.floor(flick * 50)}'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "120px",
                filter: "grayscale(1) contrast(1.6)",
              }}
            />
            <AbsoluteFill style={{ background: "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.5))" }} />
          </div>
          <div style={{ width: 70, display: "flex", flexDirection: "column", gap: 18, alignItems: "center", paddingTop: 20 }}>
            {[0, 1].map((k) => (
              <div key={k} style={{ width: 46, height: 46, borderRadius: 23, background: "#3A2618", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.5)" }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", fontFamily: F.hand, fontSize: 76, color: P.nos.ink, marginTop: 12 }}>conteúdo?</div>
      </div>
    </SceneIn>
  );
};

// ——— n3: o processo antigo, uma cassete VHS por etapa ———
export const Icon: React.FC<{ k: number; color?: string; size?: number }> = ({ k, color, size = 74 }) => {
  const c = color ?? P.nos.ink;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      {k === 0 && <path d="M8 5v14M16 5v14" />}
      {k === 1 && <circle cx={12} cy={12} r={7} fill={P.nos.red} stroke="none" />}
      {k === 2 && <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" />}
      {k === 3 && (
        <>
          <circle cx={6} cy={6} r={3} />
          <circle cx={6} cy={18} r={3} />
          <path d="M8.5 7.5L20 18M8.5 16.5L20 6" />
        </>
      )}
      {k === 4 && (
        <>
          <rect x={2.5} y={5} width={19} height={14} rx={2.5} />
          <path d="M10 10.2a2.6 2.6 0 1 0 0 3.6M17 10.2a2.6 2.6 0 1 0 0 3.6" />
        </>
      )}
      {k === 5 && <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />}
    </svg>
  );
};

export const N3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("n3").from);
  const steps = [
    { w: "parar", t: t9("parar", 5.5) },
    { w: "gravar", t: t9("gravar", 5.5) },
    { w: "repetir", t: t9("repetir", 5.5), extra: "take 3" },
    { w: "editar", t: t9("editar", 5.5) },
    { w: "legendas", t: t9("legendas", 5.5) },
    { w: "publicar", t: t9("publicar", 5.5) },
  ];
  const base = 1490;
  const H = 150;
  const last = spring({ frame: frame - at(steps[5].t) - 6, fps, config: { damping: 6, stiffness: 120, mass: 0.8 } });
  const wobble = Math.sin((frame - at(steps[5].t)) / 3) * 3 * (frame > at(steps[5].t) ? Math.exp(-(frame - at(steps[5].t)) / 20) : 0);
  const title = spring({ frame: frame - at(t9("tenho", 5.4)), fps, config: soft });
  return (
    <SceneIn kind="vhs">
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #3A2719, ${P.nos.wood})` }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 41px)" }} />
      <div style={{ position: "absolute", left: 90, top: 210, fontFamily: F.hand, fontSize: 96, color: P.nos.cream, transform: `rotate(-3deg) translateY(${(1 - title) * 40}px)`, opacity: title }}>
        o meu processo:
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${wobble}deg)`, transformOrigin: `540px ${base}px` }}>
        {steps.map((s, i) => {
          const p = spring({ frame: frame - at(s.t), fps, config: bounce }); // eslint-disable-line react-hooks/rules-of-hooks
          const top = base - (i + 1) * (H + 8);
          return (
            <div
              key={s.w}
              style={{
                position: "absolute",
                left: 120 + (i % 2 ? 22 : -10),
                top,
                width: 840,
                height: H,
                borderRadius: 14,
                background: "linear-gradient(180deg, #2A2420, #141110)",
                boxShadow: "0 16px 26px -10px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.08)",
                transform: `translateX(${(1 - p) * 900}px) rotate(${(1 - p) * 8 + (i % 2 ? 0.8 : -0.6)}deg)`,
                opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                gap: 22,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 96,
                  borderRadius: 8,
                  background: "#F6EEDC",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "0 22px",
                  backgroundImage: "repeating-linear-gradient(180deg, transparent 0 30px, rgba(90,140,170,0.25) 30px 32px)",
                }}
              >
                <Icon k={i} />
                <span style={{ fontFamily: F.hand, fontSize: 80, color: P.nos.ink, lineHeight: 1 }}>{s.w}</span>
                {s.extra && <span style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 26, color: P.nos.red }}>{s.extra}</span>}
              </div>
              <div style={{ width: 120, height: 80, borderRadius: 10, background: "#0B0908", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                {[0, 1].map((k) => (
                  <div key={k} style={{ width: 34, height: 34, borderRadius: 17, border: "6px solid #6E6258", transform: `rotate(${frame * 12}deg)`, borderTopColor: "#2A2420" }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 360,
          fontFamily: F.mono,
          fontSize: 30,
          color: P.nos.mustard,
          letterSpacing: "0.08em",
          opacity: interpolate(last, [0, 0.4], [0, 1], clamp),
          transform: `scale(${0.8 + last * 0.2})`,
        }}
      >
        6 etapas · 1 vídeo
      </div>
    </SceneIn>
  );
};

// ——— n4: a vida cheia de prioridades (quadro de cortiça) + o rosto numa polaroide ———
export const N4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("n4");
  const at = useAt(sc.from);
  const pol = spring({ frame: frame - 2, fps, config: soft });
  const fall = interpolate(frame, [at(t9("conteúdo", 13.6)) + 4, at(t9("conteúdo", 13.6)) + 0.7 * fps], [0, 1], { easing: theme.ease.in, ...clamp });
  return (
    <SceneIn kind="vhs">
      <AbsoluteFill style={{ background: P.nos.wood }} />
      {/* quadro de cortiça */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 110, height: 830, borderRadius: 18, border: "22px solid #6B4A2E", background: "#B98450", boxShadow: "inset 0 0 60px rgba(60,30,10,0.5)", overflow: "hidden" }}>
        {Array.from({ length: 260 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: `${random(`ck${i}`) * 100}%`, top: `${random(`cy${i}`) * 100}%`, width: 5, height: 4, borderRadius: 2, background: random(`cc${i}`) > 0.5 ? "rgba(80,45,15,0.45)" : "rgba(240,200,150,0.35)" }} />
        ))}
      </div>
      <Note x={110} y={210} rot={-5} color="#F2D06B" at={at(t9("trabalho", 10.4))} pin w={360}>
        trabalho
      </Note>
      <Note x={480} y={190} rot={4} color={P.nos.pink} at={at(t9("responsabilidades", 10.4))} pin w={500}>
        responsabilidades
      </Note>
      <Note x={170} y={480} rot={3} color="#9ED2C8" at={at(t9("prioridades", 10.4))} pin w={520}>
        outras prioridades
      </Note>
      {/* o conteúdo não cabe e cai */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${fall * 900}px) rotate(${fall * 38}deg)`, transformOrigin: "820px 600px", opacity: 1 - fall * 0.6 }}>
        <Note x={700} y={520} rot={-8} color={P.nos.orange} at={at(t9("produzir", 13))} pin w={300}>
          <span style={{ color: "#FFF4DF" }}>conteúdo</span>
        </Note>
      </div>
      {/* polaroide com o rosto */}
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 1070,
          width: 820,
          height: 800,
          background: "#FBF6EA",
          boxShadow: "0 40px 60px -20px rgba(0,0,0,0.7)",
          transform: `rotate(${-2.5 + (1 - pol) * 6}deg) translateY(${(1 - pol) * 500}px)`,
          padding: "30px 30px 120px",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000" }}>
          <Face sceneFrom={sc.from} look="nos" posY={44} zoom={1.05} />
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 30, fontFamily: F.hand, fontSize: 60, color: P.nos.ink }}>sem tempo…</div>
        <div style={{ position: "absolute", left: -30, top: -16, width: 160, height: 44, background: "rgba(255,250,235,0.7)", transform: "rotate(-30deg)" }} />
        <div style={{ position: "absolute", right: -30, top: -16, width: 160, height: 44, background: "rgba(255,250,235,0.7)", transform: "rotate(30deg)" }} />
      </div>
    </SceneIn>
  );
};

// ——— n5: constantemente… complicado (calendário + fita emaranhada) → STOP ———
export const N5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("n5").from);
  const t0 = at(t9("constantemente", 14));
  const day = Math.min(31, 1 + Math.floor(Math.max(0, frame - t0) / 1.6));
  const tangle = interpolate(frame, [at(14.5), at(15.7)], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const stamp = spring({ frame: frame - at(t9("complicado", 15)), fps, config: { damping: 12, stiffness: 240, mass: 0.6 } });
  const stopAt = at(15.92);
  const stop = interpolate(frame, [stopAt, stopAt + 0.42 * fps], [0, 1], clamp);
  const cal = spring({ frame, fps, config: bounce });
  // fita: rabisco longo pseudo-aleatório
  let d = "M 470 1040";
  for (let i = 0; i < 90; i++) {
    const a = i * 0.9 + random(`ta${i}`) * 1.4;
    const r = 60 + random(`tr${i}`) * 220;
    const cx = 540 + Math.sin(i * 0.37) * 220 + (random(`tx${i}`) - 0.5) * 160;
    const cy = 1250 + Math.cos(i * 0.23) * 170 + (random(`ty${i}`) - 0.5) * 120;
    d += ` Q ${cx + Math.cos(a + 1.3) * r} ${cy + Math.sin(a + 1.3) * r} ${cx + Math.cos(a) * r * 0.6} ${cy + Math.sin(a) * r * 0.6}`;
  }
  return (
    <SceneIn kind="vhs">
      <Notebook />
      {/* calendário de mesa a virar folhas */}
      <div style={{ position: "absolute", left: 120, top: 240, width: 360, transform: `scale(${cal}) rotate(-4deg)` }}>
        <div style={{ height: 70, background: P.nos.red, borderRadius: "18px 18px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 800, fontSize: 40, color: "#FFF4DF", letterSpacing: "0.12em" }}>
          OUT
        </div>
        <div style={{ height: 300, background: "#FFFBF2", borderRadius: "0 0 18px 18px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 900, fontSize: 210, color: P.nos.ink, boxShadow: `0 20px 30px -14px ${P.nos.shadow}` }}>
          {day}
        </div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 300, fontFamily: F.hand, fontSize: 84, color: P.nos.brown, transform: "rotate(3deg)", opacity: interpolate(frame, [t0, t0 + 8], [0, 1], clamp) }}>
        todos os dias…
      </div>
      {/* cassete */}
      <div style={{ position: "absolute", left: 290, top: 760, width: 500, height: 310, borderRadius: 22, background: "linear-gradient(180deg, #3B302A, #1D1714)", boxShadow: "0 30px 40px -18px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: 120, borderRadius: 10, background: "#F6EEDC", fontFamily: F.hand, fontSize: 64, color: P.nos.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
          conteúdo
        </div>
        <div style={{ position: "absolute", left: 110, right: 110, bottom: 40, height: 90, borderRadius: 45, background: "#0B0908", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ width: 56, height: 56, borderRadius: 28, border: "9px solid #776A5E", borderTopColor: "#1D1714", transform: `rotate(${frame * 14}deg)` }} />
          ))}
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={d} stroke="#3B2216" strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${tangle} 1`} />
        <path d={d} stroke="#6B4630" strokeWidth={3} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${tangle} 1`} transform="translate(3 -3)" />
      </svg>
      {stamp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 1330,
            transform: `translate(-50%, -50%) rotate(-9deg) scale(${2.2 - stamp * 1.2})`,
            opacity: Math.min(1, stamp * 2),
            border: `10px solid ${P.nos.red}`,
            borderRadius: 18,
            padding: "10px 34px",
            fontFamily: F.display,
            fontWeight: 900,
            fontSize: 96,
            letterSpacing: "0.06em",
            color: P.nos.red,
            background: "rgba(255,244,223,0.5)",
          }}
        >
          COMPLICADO
        </div>
      )}
      {/* STOP: a fita para e a imagem apaga */}
      {stop > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${stop * 0.92})` }}>
          <div style={{ position: "absolute", left: 64, top: 70, fontFamily: F.mono, fontSize: 52, color: "#F8F1E0", textShadow: "3px 0 rgba(255,0,60,0.6), -3px 0 rgba(0,220,255,0.6)" }}>■ STOP</div>
        </AbsoluteFill>
      )}
    </SceneIn>
  );
};
