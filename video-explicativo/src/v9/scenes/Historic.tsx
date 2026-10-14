import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { F, Face, P, SceneIn } from "../Look";
import { SCENES9, t9, VOICE_END } from "../timeline9";

const S = (id: string) => SCENES9.find((s) => s.id === id)!;
const H = P.his;
const arrive = { damping: 15, stiffness: 110, mass: 0.9 };
const slam = { damping: 12, stiffness: 240, mass: 0.6 };

// pergaminho com manchas
const Parchment: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <AbsoluteFill
    style={{
      background: dark
        ? `radial-gradient(70% 50% at 50% 45%, #3A2C1C, ${H.black})`
        : `radial-gradient(80% 60% at 50% 40%, #F1E4C4, ${H.parchment} 60%, ${H.parchDark})`,
    }}
  >
    {!dark &&
      Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`pm${i}`) * 900,
            top: random(`pn${i}`) * 1700,
            width: 200 + random(`po${i}`) * 300,
            height: 160 + random(`pp${i}`) * 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(140,100,50,0.16), rgba(140,100,50,0) 70%)",
          }}
        />
      ))}
  </AbsoluteFill>
);

const Stamp: React.FC<{ at: number; x: number; y: number; rot?: number; size?: number; children: React.ReactNode; color?: string }> = ({
  at,
  x,
  y,
  rot = -8,
  size = 84,
  children,
  color = H.red,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: slam });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2.2 - s * 1.2})`,
        opacity: Math.min(1, s * 2) * 0.92,
        border: `9px solid ${color}`,
        borderRadius: 14,
        padding: "8px 30px",
        fontFamily: F.display,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "0.08em",
        color,
        mixBlendMode: "multiply",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// ——— h1: "E atenção." ———
export const H1: React.FC = () => {
  const at = useAt(S("h1").from);
  return (
    <SceneIn kind="burn">
      <Face sceneFrom={S("h1").from} look="his" posY={28} zoom={1.12} />
      <Stamp at={at(t9("atenção", 39.3))} x={540} y={360} rot={-7} size={110}>
        ATENÇÃO
      </Stamp>
    </SceneIn>
  );
};

// ——— h2: a sua imagem não é substituída (retrato oval de arquivo) ———
export const H2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("h2");
  const at = useAt(sc.from);
  const fr = spring({ frame: frame - 2, fps, config: arrive });
  const sub = at(t9("substituir", 40.5));
  const rej = at(t9("imagem", 41.3));
  const robotIn = spring({ frame: frame - sub, fps, config: arrive });
  const robotOut = interpolate(frame, [rej + 8, rej + 22], [0, 1], { easing: theme.ease.in, ...clamp });
  const plaque = spring({ frame: frame - rej, fps, config: arrive });
  const flash = interpolate(frame, [at(t9("aparecer", 42)), at(t9("aparecer", 42)) + 3, at(t9("aparecer", 42)) + 16], [0, 1, 0], clamp);
  const head = spring({ frame: frame - 4, fps, config: arrive });
  return (
    <SceneIn kind="iris" irisAt={[540, 900]}>
      <Parchment />
      {/* cabeçalho de jornal antigo */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 150, textAlign: "center", opacity: head, transform: `translateY(${(1 - head) * -30}px)` }}>
        <div style={{ borderTop: `4px solid ${H.ink}`, borderBottom: `2px solid ${H.ink}`, padding: "10px 0", fontFamily: F.serif, fontSize: 64, color: H.ink, letterSpacing: "0.04em" }}>Gazeta do Criador</div>
        <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 22, letterSpacing: "0.2em", color: H.sepia }}>EDIÇÃO ESPECIAL · ARQUIVO Nº 03</div>
      </div>
      {/* moldura oval dourada com o rosto */}
      <div style={{ position: "absolute", left: 540 - 270, top: 470, width: 540, height: 680, transform: `scale(${0.7 + fr * 0.3})`, opacity: fr }}>
        <div style={{ position: "absolute", inset: -26, borderRadius: "50%", background: `conic-gradient(from 0deg, ${H.gold}, #F3DD9A, #8A6A2C, ${H.gold}, #F3DD9A, #8A6A2C, ${H.gold})`, boxShadow: "0 40px 70px -20px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "#3A2A16" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
          <Face sceneFrom={sc.from} look="his" posY={40} zoom={1.2} />
        </div>
        <AbsoluteFill style={{ borderRadius: "50%", background: `rgba(255,250,235,${flash * 0.8})` }} />
      </div>
      {/* a "substituição" que chega e é recusada */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 640,
          width: 280,
          height: 350,
          transform: `translateX(${(1 - robotIn) * 400 + robotOut * 500}px) rotate(${robotOut * 25}deg)`,
          opacity: interpolate(robotIn, [0, 0.3], [0, 1], clamp) * (1 - robotOut),
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `8px dashed ${H.sepia}`, background: "rgba(90,65,40,0.12)" }} />
        <svg width={280} height={350} viewBox="0 0 100 125" style={{ position: "absolute", inset: 0 }}>
          <rect x={30} y={28} width={40} height={36} rx={8} fill="none" stroke={H.sepia} strokeWidth={3} />
          <circle cx={42} cy={44} r={4} fill={H.sepia} />
          <circle cx={58} cy={44} r={4} fill={H.sepia} />
          <path d="M50 28v-10M44 18h12M26 100c4-18 14-26 24-26s20 8 24 26" fill="none" stroke={H.sepia} strokeWidth={3} />
        </svg>
        {frame >= rej && (
          <svg width={280} height={350} viewBox="0 0 100 125" style={{ position: "absolute", inset: 0 }}>
            <path d="M18 22 L82 104 M82 22 L18 104" stroke={H.red} strokeWidth={9} strokeLinecap="round" />
          </svg>
        )}
      </div>
      {/* placa */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1210,
          transform: `translateX(-50%) scale(${plaque})`,
          padding: "16px 46px",
          borderRadius: 10,
          background: `linear-gradient(180deg, #F3DD9A, ${H.gold})`,
          boxShadow: "0 14px 24px -10px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.6)",
          fontFamily: F.serif,
          fontSize: 54,
          color: H.ink,
          letterSpacing: "0.12em",
          whiteSpace: "nowrap",
        }}
      >
        A SUA IMAGEM
      </div>
    </SceneIn>
  );
};

// ——— h3: mapa antigo — partilhar, conectar, agregar ———
const PINS: [number, number][] = [
  [210, 620],
  [860, 600],
  [150, 1060],
  [930, 1040],
  [330, 1420],
  [780, 1410],
];
export const H3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("h3").from);
  const seal = spring({ frame: frame - at(t9("ferramenta", 44)), fps, config: slam });
  const share = at(t9("partilhar", 45.3));
  const link = at(t9("conectar", 46.8));
  const group = at(t9("agregar", 47.4));
  const C0: [number, number] = [540, 1000];
  const route = (i: number) => interpolate(frame, [share + i * 3, share + i * 3 + 14], [0, 1], clamp);
  const net = (i: number) => interpolate(frame, [link + i * 2, link + i * 2 + 12], [0, 1], clamp);
  const people = (i: number) => spring({ frame: frame - group - i * 2, fps, config: arrive });
  const title = spring({ frame: frame - 2, fps, config: arrive });
  return (
    <SceneIn kind="iris" irisAt={[540, 1000]}>
      <Parchment />
      {/* costas e grelha do mapa */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <path key={`la${k}`} d={`M 0 ${380 + k * 190} Q 540 ${360 + k * 190} 1080 ${380 + k * 190}`} stroke={H.sepia} strokeWidth={1.5} fill="none" strokeDasharray="6 10" />
        ))}
        {[0, 1, 2, 3, 4].map((k) => (
          <path key={`lo${k}`} d={`M ${140 + k * 200} 300 Q ${160 + k * 200} 960 ${140 + k * 200} 1700`} stroke={H.sepia} strokeWidth={1.5} fill="none" strokeDasharray="6 10" />
        ))}
        <path d="M 40 520 C 160 470 260 560 360 520 S 520 430 600 500 S 760 560 900 470 S 1040 520 1080 500" stroke={H.sepia} strokeWidth={4} fill="none" />
        <path d="M 0 1560 C 120 1500 220 1600 380 1540 S 560 1480 700 1560 S 900 1620 1080 1540" stroke={H.sepia} strokeWidth={4} fill="none" />
      </svg>
      {/* rosa dos ventos */}
      <svg width={180} height={180} viewBox="-50 -50 100 100" style={{ position: "absolute", left: 60, top: 1500, opacity: 0.8, transform: `rotate(${frame * 0.3}deg)` }}>
        <polygon points="0,-46 7,0 0,46 -7,0" fill={H.ink} />
        <polygon points="-46,0 0,-7 46,0 0,7" fill={H.sepia} />
        <circle r={10} fill="none" stroke={H.ink} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: 140, right: 140, top: 250, padding: "18px 0", textAlign: "center", border: `3px double ${H.ink}`, fontFamily: F.serif, fontSize: 60, color: H.ink, background: "rgba(255,248,230,0.5)", opacity: title }}>
        Mapa do Conhecimento
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {PINS.map((p, i) => (
          <path key={`r${i}`} d={`M ${C0[0]} ${C0[1]} Q ${(C0[0] + p[0]) / 2 + (i % 2 ? 80 : -80)} ${(C0[1] + p[1]) / 2 - 60} ${p[0]} ${p[1]}`} stroke={H.red} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${route(i)} 1`} />
        ))}
        {PINS.map((p, i) => {
          const q = PINS[(i + 1) % PINS.length];
          const order = [0, 1, 3, 5, 4, 2];
          const a = PINS[order[i]];
          const b = PINS[order[(i + 1) % 6]];
          return <path key={`n${i}`} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={H.gold} strokeWidth={4} fill="none" strokeDasharray={`${net(i) * 2000} 2000`} opacity={q ? 0.9 : 0} />;
        })}
      </svg>
      {PINS.map((p, i) => {
        const on = route(i) > 0.95;
        const g = people(i);
        return (
          <div key={i} style={{ position: "absolute", left: p[0] - 26, top: p[1] - 70, opacity: on ? 1 : 0 }}>
            <svg width={52} height={70} viewBox="0 0 26 35">
              <path d="M13 34 C 4 22 1 17 1 12 a12 12 0 0 1 24 0 c0 5 -3 10 -12 22 z" fill={H.red} stroke={H.ink} strokeWidth={1.5} />
              <circle cx={13} cy={12} r={4.5} fill={H.cream} />
            </svg>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ position: "absolute", left: -40 + k * 40, top: 76, opacity: g, transform: `translateY(${(1 - g) * 20}px) scale(${g})` }}>
                <svg width={36} height={44} viewBox="0 0 18 22">
                  <circle cx={9} cy={6} r={5} fill={H.ink} />
                  <path d="M1 22 c1-7 4-10 8-10 s7 3 8 10 z" fill={H.ink} />
                </svg>
              </div>
            ))}
          </div>
        );
      })}
      {/* selo de cera: você */}
      <div style={{ position: "absolute", left: C0[0] - 90, top: C0[1] - 90, width: 180, height: 180, transform: `scale(${seal ? 2.2 - seal * 1.2 : 0}) rotate(${-10 + seal * 10}deg)`, opacity: Math.min(1, seal * 2) }}>
        <svg width={180} height={180} viewBox="-50 -50 100 100">
          <path d="M0 -46 C 14 -48 22 -40 32 -34 C 44 -26 48 -14 46 0 C 48 14 42 26 32 34 C 22 42 12 48 0 46 C -14 48 -26 42 -34 32 C -44 22 -48 12 -46 0 C -48 -14 -42 -26 -32 -34 C -22 -42 -12 -46 0 -46 Z" fill="#9E1B14" />
          <circle r={32} fill="none" stroke="#C7463B" strokeWidth={3} />
          <path d="M-14 16 L 14 -18 M 6 -22 L 18 -10" stroke="#F0C8B0" strokeWidth={5} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: C0[1] + 110, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 50, color: H.ink, opacity: interpolate(frame, [share, share + 10], [0, 1], clamp) }}>
        o seu conhecimento
      </div>
    </SceneIn>
  );
};

// ——— h4: sem tempo para estar diante das câmeras ———
export const H4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("h4").from);
  const cam = spring({ frame: frame - 2, fps, config: arrive });
  const fast = at(t9("não", 49));
  const spin = frame < fast ? frame * 2 : fast * 2 + (frame - fast) * 28;
  const fl = at(t9("câmeras", 50));
  const flash = interpolate(frame, [fl, fl + 2, fl + 14], [0, 1, 0], clamp);
  const smoke = interpolate(frame, [fl, fl + 30], [0, 1], clamp);
  const tag = spring({ frame: frame - at(t9("tempo", 49.2)), fps, config: arrive });
  return (
    <SceneIn kind="iris" irisAt={[380, 1000]}>
      <Parchment dark />
      <div style={{ position: "absolute", left: 120, top: 260, width: 840, height: 1300, background: "radial-gradient(ellipse at 60% 45%, rgba(255,235,190,0.22), rgba(0,0,0,0) 65%)" }} />
      {/* câmara de fole no tripé */}
      <div style={{ position: "absolute", left: 120, top: 760, width: 460, transform: `translateX(${(1 - cam) * -300}px)`, opacity: cam }}>
        <svg width={460} height={820} viewBox="0 0 230 410">
          <path d="M70 200 L40 410 M115 200 L115 410 M160 200 L190 410" stroke="#7A5B36" strokeWidth={7} strokeLinecap="round" />
          <rect x={30} y={70} width={70} height={120} rx={6} fill="#2A1E12" stroke={H.gold} strokeWidth={3} />
          <path d="M100 82 L170 100 L170 160 L100 178 Z" fill="#1A120A" stroke="#4A3620" strokeWidth={2} />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${112 + k * 15} ${86 + k * 4} L${112 + k * 15} ${174 - k * 4}`} stroke="#4A3620" strokeWidth={2} />
          ))}
          <rect x={170} y={108} width={34} height={44} rx={5} fill="#2A1E12" stroke={H.gold} strokeWidth={3} />
          <circle cx={204} cy={130} r={16} fill="#0A0806" stroke={H.gold} strokeWidth={3} />
          <path d="M40 70 L40 40 L80 40" stroke="#7A5B36" strokeWidth={5} fill="none" />
          <path d="M70 40 L95 18 L110 40 Z" fill="#C9B07A" />
        </svg>
        {/* pó de magnésio */}
        <div style={{ position: "absolute", left: 160, top: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,240,${flash}), rgba(255,240,200,0) 70%)`, transform: `scale(${1 + flash * 2})` }} />
        <div style={{ position: "absolute", left: 150, top: -120 - smoke * 120, width: 220, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,190,170,0.5), rgba(200,190,170,0) 70%)", opacity: smoke * (1 - smoke) * 4 }} />
      </div>
      {/* cadeira vazia */}
      <div style={{ position: "absolute", left: 660, top: 1050, opacity: cam }}>
        <svg width={300} height={460} viewBox="0 0 150 230">
          <path d="M30 20 L30 120 M120 20 L120 120" stroke="#8A6A40" strokeWidth={8} strokeLinecap="round" />
          <path d="M30 30 Q75 10 120 30" stroke="#8A6A40" strokeWidth={8} fill="none" />
          <rect x={18} y={118} width={114} height={18} rx={6} fill="#6E4F2E" />
          <path d="M28 136 L22 226 M122 136 L128 226 M48 136 L52 210 M102 136 L98 210" stroke="#8A6A40" strokeWidth={7} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 40, top: 150, padding: "10px 20px", background: H.cream, fontFamily: F.serif, fontStyle: "italic", fontSize: 42, color: H.red, transform: `rotate(-6deg) scale(${tag})`, boxShadow: "0 8px 16px rgba(0,0,0,0.4)" }}>
          sem tempo
        </div>
      </div>
      {/* relógio de bolso */}
      <div style={{ position: "absolute", left: 700, top: 330, width: 260, height: 260, opacity: cam }}>
        <div style={{ position: "absolute", left: 118, top: -40, width: 24, height: 50, borderRadius: 12, border: `6px solid ${H.gold}` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: H.cream, border: `12px solid ${H.gold}`, boxShadow: "0 20px 30px rgba(0,0,0,0.5)" }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 127, top: 24, width: 6, height: 18, background: H.ink, transformOrigin: "3px 106px", transform: `rotate(${i * 30}deg)` }} />
        ))}
        <div style={{ position: "absolute", left: 126, top: 50, width: 8, height: 80, borderRadius: 4, background: H.ink, transformOrigin: "4px 80px", transform: `rotate(${spin / 12}deg)` }} />
        <div style={{ position: "absolute", left: 128, top: 30, width: 4, height: 100, borderRadius: 2, background: H.red, transformOrigin: "2px 100px", transform: `rotate(${spin}deg)` }} />
      </div>
      <AbsoluteFill style={{ background: `rgba(255,252,240,${flash * 0.85})` }} />
    </SceneIn>
  );
};

// ——— h5: livro-razão — trabalhar mais? não. ———
const Typed: React.FC<{ text: string; at: number; speed?: number; style?: React.CSSProperties }> = ({ text, at, speed = 1.4, style }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - at) * speed)));
  if (frame < at) return null;
  return (
    <div style={{ fontFamily: F.mono, whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      {n < text.length && Math.floor(frame / 6) % 2 === 0 ? "▌" : ""}
    </div>
  );
};

export const H5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("h5").from);
  const book = spring({ frame: frame - 2, fps, config: arrive });
  const l1 = at(t9("conhecimento", 50.9));
  const l2 = at(t9("tempo", 52));
  const l3 = at(t9("tens", 54.3));
  const strike = interpolate(frame, [at(t9("mais", 54.9)), at(t9("mais", 54.9)) + 8], [0, 1], { easing: theme.ease.out, ...clamp });
  const check = spring({ frame: frame - l1 - 20, fps, config: slam });
  const lim = spring({ frame: frame - at(t9("limita", 52.6)), fps, config: slam });
  return (
    <SceneIn kind="iris" irisAt={[540, 960]}>
      <Parchment dark />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 280,
          height: 1240,
          background: `linear-gradient(90deg, ${H.parchDark}, ${H.parchment} 8%, ${H.parchment} 92%, ${H.parchDark})`,
          boxShadow: "0 50px 80px -30px rgba(0,0,0,0.8)",
          transform: `translateY(${(1 - book) * 300}px) rotate(${(1 - book) * 4}deg)`,
          opacity: book,
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0 78px, rgba(92,65,40,0.35) 78px 80px)`,
          backgroundColor: H.parchment,
          padding: "60px 70px",
        }}
      >
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 120, width: 3, background: "rgba(179,36,28,0.5)" }} />
        <div style={{ fontFamily: F.serif, fontSize: 64, color: H.ink, marginLeft: 70, marginBottom: 40 }}>Livro de contas</div>
        <div style={{ marginLeft: 70, display: "flex", flexDirection: "column", gap: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Typed text="Conhecimento p/ partilhar" at={l1} style={{ fontSize: 40, color: H.ink }} />
            {check > 0.01 && <div style={{ fontSize: 60, color: "#2F5D3A", transform: `scale(${check})`, fontFamily: F.display, fontWeight: 900 }}>✓</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Typed text="Tempo disponível" at={l2} style={{ fontSize: 40, color: H.ink }} />
            {lim > 0.01 && (
              <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 56, color: H.red, transform: `scale(${lim}) rotate(-4deg)` }}>limitado</div>
            )}
          </div>
          <div style={{ position: "relative", marginTop: 80 }}>
            <Typed text="TRABALHAR MAIS" at={l3} speed={2} style={{ fontSize: 74, fontWeight: 700, color: H.ink, letterSpacing: "0.02em" }} />
            <div style={{ position: "absolute", left: -10, top: 52, height: 12, width: `${strike * 104}%`, background: H.red, borderRadius: 6, transform: "rotate(-3deg)" }} />
          </div>
          {strike > 0.9 && (
            <div style={{ fontFamily: F.hand, fontSize: 90, color: H.red, transform: "rotate(-6deg)", marginLeft: 320 }}>não!</div>
          )}
        </div>
      </div>
    </SceneIn>
  );
};

// ——— h6: "Significa que talvez precisas mudar o seu processo." — P&B que ganha cor ———
export const H6: React.FC = () => {
  const frame = useCurrentFrame();
  const at = useAt(S("h6").from);
  const c = at(t9("mudar", 56.8));
  const sweep = interpolate(frame, [c, c + 20], [-0.2, 1.2], clamp);
  return (
    <SceneIn kind="iris" irisAt={[540, 700]}>
      <Face sceneFrom={S("h6").from} look="his" colorizeAt={c} posY={28} zoom={1.06} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(110deg, transparent ${(sweep - 0.1) * 100}%, rgba(255,215,140,0.55) ${sweep * 100}%, transparent ${(sweep + 0.1) * 100}%)`,
          mixBlendMode: "screen",
          opacity: sweep > -0.2 && sweep < 1.2 ? 1 : 0,
        }}
      />
    </SceneIn>
  );
};

// ——— h7: apelo final — siga, like, curte, compartilhe + cartão ———
const Heart: React.FC<{ size: number; color?: string }> = ({ size, color = "#FF3B5C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-10-9.3C.3 8.3 2 4 6 4c2.3 0 3.6 1.3 4.5 2.6.4.6 1.6.6 2 0C13.4 5.3 14.7 4 17 4c4 0 5.7 4.3 4 7.7C19.5 16.4 12 21 12 21z" fill={color} />
  </svg>
);
const Thumb: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
    <path d="M7 10v11H3V10zM7 10l4-7c1.6 0 2.6 1.2 2.3 2.7L12.6 9H19c1.2 0 2.1 1.1 1.9 2.3l-1.4 7.5c-.2 1.3-1.3 2.2-2.6 2.2H7" fill="rgba(255,255,255,0.2)" />
  </svg>
);
const Plane: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" fill="rgba(255,255,255,0.2)" />
  </svg>
);

export const H7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("h7");
  const at = useAt(sc.from);
  const fol = spring({ frame: frame - at(t9("siga", 58.5)), fps, config: arrive });
  const tap = at(t9("perfil", 58.9)) + 2;
  const press = interpolate(frame, [tap, tap + 3, tap + 9], [0, 1, 0], clamp);
  const following = frame >= tap + 4;
  const days = (k: number) => interpolate(frame, [at(t9("todos", 60.3)) + k * 2, at(t9("todos", 60.3)) + k * 2 + 6], [0, 1], clamp);
  const heart = spring({ frame: frame - at(t9("like", 61.5)), fps, config: slam });
  const thumb = spring({ frame: frame - at(t9("curte", 61.8)), fps, config: slam });
  const share = spring({ frame: frame - at(t9("compartilhe", 62.2)), fps, config: arrive });
  const fly = interpolate(frame, [at(t9("compartilhe", 62.2)) + 10, at(t9("compartilhe", 62.2)) + 26], [0, 1], { easing: theme.ease.in, ...clamp });
  const endAt = at(VOICE_END);
  const end = interpolate(frame, [endAt, endAt + 10], [0, 1], { easing: theme.ease.out, ...clamp });
  const endCard = spring({ frame: frame - endAt - 3, fps, config: arrive });
  const uiOut = 1 - interpolate(frame, [endAt - 2, endAt + 8], [0, 1], clamp);
  const icon = (p: number, x: number, y: number, child: React.ReactNode, bg: string) => (
    <div style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 70, background: bg, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p * uiOut})`, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.6)" }}>
      {child}
    </div>
  );
  return (
    <SceneIn kind="zoom">
      <Face sceneFrom={sc.from} look="color" posY={28} />
      {/* todos os dias */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", gap: 18, opacity: uiOut }}>
        {["S", "T", "Q", "Q", "S", "S", "D"].map((d, k) => (
          <div
            key={k}
            style={{
              width: 92,
              height: 92,
              borderRadius: 24,
              background: days(k) > 0.5 ? H.gold : "rgba(0,0,0,0.35)",
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 40,
              color: days(k) > 0.5 ? H.ink : "#fff",
              opacity: days(k) > 0 ? 1 : 0,
              transform: `scale(${0.7 + days(k) * 0.3})`,
            }}
          >
            {days(k) > 0.5 ? "✓" : d}
          </div>
        ))}
      </div>
      {/* like · curte · compartilhe */}
      {icon(heart, 900, 1000, <Heart size={80} />, "rgba(255,255,255,0.95)")}
      {heart > 0.5 &&
        [0, 1, 2].map((k) => {
          const u = interpolate(frame, [at(t9("like", 61.5)) + k * 3, at(t9("like", 61.5)) + k * 3 + 24], [0, 1], clamp);
          return (
            <div key={k} style={{ position: "absolute", left: 870 + (k - 1) * 40, top: 900 - u * 220, opacity: 1 - u, transform: `scale(${0.5 + u * 0.3})` }}>
              <Heart size={50} />
            </div>
          );
        })}
      {icon(thumb, 900, 1180, <Thumb size={74} />, "#2E6BFF")}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${fly * 400}px, ${-fly * 700}px) rotate(${-fly * 20}deg)`, opacity: 1 - fly }}>{icon(share, 180, 1100, <Plane size={70} />, H.red)}</div>
      {/* botão seguir */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 1560,
          height: 140,
          borderRadius: 70,
          background: "rgba(255,255,255,0.96)",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 24,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
          opacity: interpolate(fol, [0, 0.3], [0, 1], clamp) * uiOut,
          transform: `translateY(${(1 - fol) * 120}px) scale(${1 - press * 0.05})`,
        }}
      >
        <div style={{ width: 96, height: 96, borderRadius: 48, background: `linear-gradient(135deg, ${H.gold}, ${H.red})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={56} height={56} viewBox="0 0 24 24" fill="#fff">
            <circle cx={12} cy={8} r={4.5} />
            <path d="M3 21c1-5 4.5-7.5 9-7.5s8 2.5 9 7.5z" />
          </svg>
        </div>
        <div style={{ flex: 1, fontFamily: F.display, fontWeight: 700, fontSize: 44, color: "#111" }}>o meu perfil</div>
        <div style={{ padding: "18px 34px", borderRadius: 40, background: following ? "#E9E9E9" : "#2E6BFF", color: following ? "#111" : "#fff", fontFamily: F.display, fontWeight: 800, fontSize: 40 }}>
          {following ? "A seguir ✓" : "Seguir"}
        </div>
      </div>
      {/* cartão final: escurece como no EXEMPLO */}
      <AbsoluteFill style={{ background: `rgba(6,4,2,${end * 0.72})` }} />
      {end > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, opacity: interpolate(endCard, [0, 0.3], [0, 1], clamp), transform: `scale(${0.9 + endCard * 0.1})` }}>
          <div style={{ display: "flex", gap: 30 }}>
            <Heart size={90} color="#FF3B5C" />
            <Thumb size={90} />
            <Plane size={90} />
          </div>
          <div style={{ fontFamily: F.serif, fontSize: 110, color: H.cream, letterSpacing: "0.02em" }}>Siga o perfil</div>
          <div style={{ fontFamily: F.mono, fontSize: 30, letterSpacing: "0.28em", color: H.gold }}>CONTEÚDO TODOS OS DIAS</div>
        </AbsoluteFill>
      )}
    </SceneIn>
  );
};
