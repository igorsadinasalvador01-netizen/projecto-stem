import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { BAR, F, Face, P, SceneIn } from "../Look";
import { SCENES9, t9 } from "../timeline9";
import { Icon } from "./Nostalgia";

const S = (id: string) => SCENES9.find((s) => s.id === id)!;
const C = P.cin;
const arrive = { damping: 15, stiffness: 110, mass: 0.9 };

// fundo de cinema: teal profundo, raios de luz volumétricos e pó a flutuar
const Stage: React.FC<{ glow?: string }> = ({ glow = "rgba(41,196,214,0.22)" }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 55% at 50% 45%, ${glow}, rgba(0,0,0,0) 70%), linear-gradient(180deg, ${C.top}, ${C.bottom})` }}>
      {[0, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 200 + k * 260 + Math.sin(t * 0.4 + k) * 40,
            top: -200,
            width: 160,
            height: 1600,
            background: "linear-gradient(180deg, rgba(255,220,170,0.10), rgba(255,220,170,0))",
            transform: `rotate(${12 - k * 9}deg)`,
            filter: "blur(18px)",
          }}
        />
      ))}
      {Array.from({ length: 40 }).map((_, i) => {
        const y = ((random(`dy${i}`) * 1920 - t * (10 + random(`dv${i}`) * 25)) % 1920 + 1920) % 1920;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`dx${i}`) * 1080 + Math.sin(t + i) * 12,
              top: y,
              width: 3 + random(`ds${i}`) * 5,
              height: 3 + random(`ds${i}`) * 5,
              borderRadius: "50%",
              background: "rgba(255,230,190,0.7)",
              opacity: 0.25 + random(`do${i}`) * 0.5,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// risco anamórfico (flare horizontal azul)
const Streak: React.FC<{ at: number; y: number; dur?: number }> = ({ at, y, dur = 26 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  const a = Math.sin(p * Math.PI);
  return (
    <>
      <div style={{ position: "absolute", left: -400 + p * 1400 - 700, width: 1400, top: y - 4, height: 8, background: "linear-gradient(90deg, transparent, rgba(110,220,255,0.95), transparent)", opacity: a, filter: "blur(2px)" }} />
      <div style={{ position: "absolute", left: -400 + p * 1400 - 120, width: 240, top: y - 60, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,250,235,0.95), rgba(120,220,255,0) 70%)", opacity: a }} />
    </>
  );
};

const Glass: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      borderRadius: 30,
      background: `linear-gradient(160deg, rgba(255,255,255,0.12), ${C.glass} 60%)`,
      border: `1.5px solid ${C.stroke}`,
      boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8), inset 0 1.5px 0 rgba(255,255,255,0.2)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ——— c1: "Até que pude perceber…" — rosto em cinemascope ———
export const C1: React.FC = () => {
  const at = useAt(S("c1").from);
  return (
    <SceneIn kind="slam">
      <Face sceneFrom={S("c1").from} look="cin" posY={28} zoom={1.04} />
      <Streak at={at(t9("perceber", 16.4))} y={640} />
    </SceneIn>
  );
};

// ——— c2: INTELIGÊNCIA ARTIFICIAL + o processo antigo funde-se num novo ———
export const C2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c2").from);
  const ti = at(t9("inteligência", 18.3));
  const title = interpolate(frame, [ti, ti + 0.9 * fps], [0, 1], { easing: theme.ease.out, ...clamp });
  const sweep = interpolate(frame, [ti + 6, ti + 30], [-0.3, 1.3], clamp);
  const icons = spring({ frame: frame - at(t9("mudar", 19.4)), fps, config: arrive });
  const fuse = interpolate(frame, [at(t9("completamente", 19.4)) + 4, at(t9("este", 20)) + 4], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const line = interpolate(frame, [at(t9("este", 20)), at(t9("processo", 20.2)) + 6], [0, 1], { easing: theme.ease.out, ...clamp });
  const neu = spring({ frame: frame - at(t9("processo", 20.2)), fps, config: arrive });
  const word = (txt: string, y: number, size: number) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        fontFamily: F.display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: `${0.42 - title * 0.3}em`,
        color: C.white,
        opacity: title,
        filter: `blur(${(1 - title) * 10}px)`,
        backgroundImage: `linear-gradient(100deg, ${C.white} ${(sweep - 0.12) * 100}%, ${C.gold} ${sweep * 100}%, ${C.white} ${(sweep + 0.12) * 100}%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "none",
      }}
    >
      {txt}
    </div>
  );
  return (
    <SceneIn kind="flare">
      <Stage />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: F.mono, fontSize: 30, letterSpacing: "0.3em", color: C.gold, opacity: title }}>
        A VIRADA
      </div>
      {word("INTELIGÊNCIA", 500, 112)}
      {word("ARTIFICIAL", 640, 112)}
      {/* o processo antigo (6 etapas) funde-se */}
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const x0 = 120 + k * 168;
        const x = x0 + (540 - 60 - x0) * fuse;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: 1010,
              width: 120,
              height: 120,
              borderRadius: 26,
              background: "rgba(255,255,255,0.08)",
              border: `1.5px solid ${C.stroke}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: icons * (1 - fuse * 0.9),
              transform: `scale(${(0.6 + icons * 0.4) * (1 - fuse * 0.5)})`,
            }}
          >
            <Icon k={k} color={C.dim} size={64} />
          </div>
        );
      })}
      {/* a linha nova */}
      <div style={{ position: "absolute", left: 540 - 420 * line, width: 840 * line, top: 1066, height: 8, borderRadius: 4, background: `linear-gradient(90deg, transparent, ${C.teal}, ${C.gold}, ${C.teal}, transparent)`, boxShadow: `0 0 40px ${C.teal}` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1180,
          textAlign: "center",
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: "0.14em",
          color: C.gold,
          opacity: interpolate(neu, [0, 0.3], [0, 1], clamp),
          transform: `translateY(${(1 - neu) * 40}px)`,
          textShadow: "0 0 40px rgba(246,195,95,0.45)",
        }}
      >
        NOVO PROCESSO
      </div>
      <Streak at={ti} y={720} dur={30} />
    </SceneIn>
  );
};

// ——— c3: conhecimento + ideias + aprendizado → IA → roteiro · prompts · vídeos ———
const Orb: React.FC<{ x: number; y: number; at: number; label: string }> = ({ x, y, at, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: arrive });
  const t = frame / fps;
  return (
    <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${0.5 + p * 0.5})` }}>
      <div style={{ width: 180, height: 180, borderRadius: 90, background: `radial-gradient(circle at 40% 35%, #FFF3D6, ${C.gold} 35%, rgba(242,154,56,0.25) 70%, rgba(242,154,56,0) 72%)`, boxShadow: "0 0 80px rgba(246,195,95,0.45)" }} />
      {[0, 1, 2, 3].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 90 + Math.cos(t * 2 + k * 1.57) * 110 - 5,
            top: 90 + Math.sin(t * 2 + k * 1.57) * 40 - 5,
            width: 10,
            height: 10,
            borderRadius: 5,
            background: "#FFE7B0",
          }}
        />
      ))}
      <div style={{ position: "absolute", left: -60, right: -60, top: 200, textAlign: "center", fontFamily: F.mono, fontSize: 28, letterSpacing: "0.12em", color: C.white, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
};

const Stream: React.FC<{ from: [number, number]; to: [number, number]; at: number; color: string }> = ({ from, to, at, color }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const p = (((frame - at) / 22 + i / 8) % 1 + 1) % 1;
        const x = from[0] + (to[0] - from[0]) * p;
        const y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 40;
        return <div key={i} style={{ position: "absolute", left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 16px ${color}`, opacity: Math.sin(p * Math.PI) }} />;
      })}
    </>
  );
};

export const C3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c3").from);
  const core = spring({ frame: frame - at(t9("hoje", 21)), fps, config: arrive });
  const charge = interpolate(frame, [at(t9("transformo", 24)), at(t9("transformo", 24)) + 10], [0, 1], clamp);
  const t = frame / fps;
  const orbs = [
    { x: 200, l: "conhecimento", at: at(t9("conhecimento", 21.5)) },
    { x: 540, l: "ideias", at: at(t9("ideias", 22.5)) },
    { x: 880, l: "aprendizado", at: at(t9("aprendo", 23.5)) },
  ];
  const outs = [
    { x: 200, l: "ROTEIRO", at: at(t9("roteiro", 24.5)), k: 0 },
    { x: 540, l: "PROMPTS", at: at(t9("prompts", 25)), k: 1 },
    { x: 880, l: "VÍDEOS", at: at(t9("vídeos", 25.5)), k: 2 },
  ];
  return (
    <SceneIn kind="zoom">
      <Stage />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: F.mono, fontSize: 30, letterSpacing: "0.3em", color: C.gold, opacity: core }}>
        HOJE
      </div>
      {orbs.map((o) => (
        <React.Fragment key={o.l}>
          <Stream from={[o.x, 500]} to={[540, 920]} at={o.at + 8} color="#FFD58A" />
          <Orb x={o.x} y={500} at={o.at} label={o.l} />
        </React.Fragment>
      ))}
      {/* núcleo IA */}
      <div style={{ position: "absolute", left: 540 - 130, top: 920 - 130, width: 260, height: 260, transform: `scale(${(0.5 + core * 0.5) * (1 + charge * 0.08 * Math.sin(t * 12))})`, opacity: core }}>
        <div style={{ position: "absolute", inset: -80, borderRadius: "50%", background: `radial-gradient(circle, rgba(41,196,214,${0.35 + charge * 0.4}), rgba(41,196,214,0) 70%)` }} />
        <svg width={260} height={260} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, transform: `rotate(${t * 40}deg)` }}>
          <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="rgba(11,74,85,0.85)" stroke={C.teal} strokeWidth={2.5} />
          <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="rgba(246,195,95,0.8)" strokeWidth={1.5} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontWeight: 800, fontSize: 76, color: C.white, letterSpacing: "0.04em" }}>IA</div>
      </div>
      {outs.map((o) => (
        <Stream key={`s${o.l}`} from={[540, 1010]} to={[o.x, 1260]} at={o.at - 4} color={C.teal} />
      ))}
      {outs.map((o) => {
        const p = spring({ frame: frame - o.at, fps, config: arrive }); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div key={o.l} style={{ position: "absolute", left: o.x - 150, top: 1240, width: 300, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * -120}px) scale(${0.7 + p * 0.3})` }}>
            <Glass style={{ height: 300, padding: 26, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ height: 170, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {o.k === 0 && (
                  <div style={{ width: 150, height: 170, background: "#F5F2EA", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontFamily: F.mono, fontSize: 13, color: "#222", marginBottom: 10 }}>INT. ESTÚDIO</div>
                    {[0.9, 0.7, 0.85, 0.5, 0.75].map((w, i) => (
                      <div key={i} style={{ height: 8, width: `${w * 100}%`, background: "rgba(0,0,0,0.25)", borderRadius: 4, marginBottom: 10 }} />
                    ))}
                  </div>
                )}
                {o.k === 1 && (
                  <div style={{ width: 210, height: 150, background: "#04191D", borderRadius: 14, border: `1.5px solid ${C.teal}`, padding: 16, fontFamily: F.mono, fontSize: 22, color: C.teal, lineHeight: 1.5 }}>
                    {">"} cria cenas
                    <br />
                    {">"} roteiro_
                  </div>
                )}
                {o.k === 2 && (
                  <div style={{ width: 120, height: 170, borderRadius: 14, background: `linear-gradient(160deg, ${C.orange}, ${C.tealDeep})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 0, height: 0, borderLeft: "40px solid white", borderTop: "26px solid transparent", borderBottom: "26px solid transparent", marginLeft: 10 }} />
                  </div>
                )}
              </div>
              <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: C.gold }}>{o.l}</div>
            </Glass>
          </div>
        );
      })}
    </SceneIn>
  );
};

// ——— c4: "A ideia continua a ser a minha." ———
export const C4: React.FC = () => {
  const frame = useCurrentFrame();
  const at = useAt(S("c4").from);
  const glow = interpolate(frame, [at(t9("minha", 27)), at(t9("minha", 27)) + 8, at(t9("minha", 27)) + 24], [0, 1, 0.3], clamp);
  return (
    <SceneIn kind="flare">
      <Face sceneFrom={S("c4").from} look="cin" posY={28} zoom={1.1} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 40%, rgba(246,195,95,${0.3 * glow}), rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />
      <Streak at={at(t9("minha", 27)) - 4} y={600} />
    </SceneIn>
  );
};

// ——— c5: a IA estrutura, melhora e constrói as cenas (storyboard) ———
export const C5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c5").from);
  const f1 = at(t9("estruturar", 28.5));
  const f2 = at(t9("melhorar", 30));
  const f3 = at(t9("construir", 31));
  const order = interpolate(frame, [f1, f1 + 0.7 * fps], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const pen = interpolate(frame, [f2 + 4, f2 + 16], [0, 1], clamp);
  const fix = spring({ frame: frame - f2 - 18, fps, config: arrive });
  const panel = (i: number, start: number) => spring({ frame: frame - start, fps, config: arrive });
  const p1 = panel(0, 2);
  const p2 = panel(1, 6);
  const p3 = panel(2, 10);
  const lit = (k: number) => interpolate(frame, [at(t9("cenas", 32)) - 14 + k * 4, at(t9("cenas", 32)) - 6 + k * 4], [0, 1], clamp);
  const Frame: React.FC<{ y: number; p: number; n: string; label: string; children: React.ReactNode }> = ({ y, p, n, label, children }) => (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, height: 380, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateX(${(1 - p) * 300}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "#0A0F10", border: `1.5px solid ${C.stroke}` }} />
      {[0, 1].map((s) => (
        <div key={s} style={{ position: "absolute", top: 18, bottom: 18, [s ? "right" : "left"]: 14, width: 22, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.22) 0 18px, transparent 18px 34px)", borderRadius: 4 }} />
      ))}
      <div style={{ position: "absolute", left: 60, top: 24, fontFamily: F.mono, fontSize: 26, letterSpacing: "0.2em", color: C.gold }}>
        {n} · {label}
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 76, bottom: 26 }}>{children}</div>
    </div>
  );
  const blocks = [3, 0, 2, 1];
  return (
    <SceneIn kind="zoom">
      <Stage glow="rgba(242,154,56,0.16)" />
      <Frame y={270} p={p1} n="01" label="ESTRUTURA">
        {blocks.map((b, i) => {
          const y = (i + (b - i) * order) * 64;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y, height: 46, width: `${[92, 74, 84, 60][b]}%`, borderRadius: 10, background: b === 0 ? C.gold : `rgba(41,196,214,${0.35 + b * 0.12})`, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: F.mono, fontSize: 22, color: "#04191D" }}>
              {["gancho", "problema", "virada", "mensagem"][b]}
            </div>
          );
        })}
      </Frame>
      <Frame y={680} p={p2} n="02" label="ROTEIRO">
        {[0.95, 0.8, 0.9, 0.7].map((w, i) => (
          <div key={i} style={{ position: "relative", height: 26, marginBottom: 30, width: `${w * 100}%` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 6, background: i === 2 && fix > 0.5 ? C.gold : "rgba(255,255,255,0.22)" }} />
            {i === 2 && <div style={{ position: "absolute", left: 0, top: 11, height: 5, width: `${pen * 100}%`, background: "#FF4D3D", opacity: 1 - fix }} />}
          </div>
        ))}
        {fix > 0.05 && (
          <div style={{ position: "absolute", right: 0, top: 70, width: 70, height: 70, borderRadius: 35, background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${fix})`, fontFamily: F.display, fontWeight: 900, fontSize: 44, color: "#04191D" }}>
            ✓
          </div>
        )}
      </Frame>
      <Frame y={1090} p={p3} n="03" label="CENAS">
        <div style={{ display: "flex", gap: 16, height: "100%" }}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div
              key={k}
              style={{
                flex: 1,
                borderRadius: 12,
                background: `linear-gradient(${160 + k * 20}deg, ${[C.orange, C.teal, C.gold, "#C8507A", C.teal, C.orange][k]}, #0A0F10)`,
                opacity: 0.15 + lit(k) * 0.85,
                transform: `scale(${0.9 + lit(k) * 0.1})`,
                border: `1.5px solid ${lit(k) > 0.5 ? C.gold : C.stroke}`,
              }}
            />
          ))}
        </div>
      </Frame>
    </SceneIn>
  );
};

// ——— c6: Remotion → vários vídeos dinâmicos ———
const CODE = ['<Composition', '  id="video-01"', "  fps={30}", "  width={1080}", "  height={1920}", "/>"];
const Thumb: React.FC<{ k: number; p: number }> = ({ k, p }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 18,
      background: `linear-gradient(${140 + k * 25}deg, ${[C.orange, C.teal, "#C8507A", C.gold, "#6C5CE7", C.teal, C.orange, "#2EC27E", C.gold][k % 9]}, #061014 85%)`,
      border: `1.5px solid ${C.stroke}`,
      opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
      transform: `scale(${0.4 + p * 0.6})`,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: "50%", top: "45%", width: 0, height: 0, marginLeft: -12, marginTop: -20, borderLeft: "34px solid rgba(255,255,255,0.9)", borderTop: "20px solid transparent", borderBottom: "20px solid transparent" }} />
    <div style={{ position: "absolute", left: 16, right: 40, bottom: 20, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.5)" }} />
  </div>
);

export const C6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c6").from);
  const rem = spring({ frame: frame - at(t9("remotion", 34)), fps, config: arrive });
  const chars = Math.floor(Math.max(0, frame - at(33.3)) * 1.6);
  const prog = interpolate(frame, [at(t9("preparar", 34.5)), at(t9("vários", 35.8))], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const many = at(t9("vários", 35.8));
  const codeOut = interpolate(frame, [many - 4, many + 8], [0, 1], { easing: theme.ease.in, ...clamp });
  let left = chars;
  return (
    <SceneIn kind="flare">
      <Stage />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 280,
          textAlign: "center",
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: `${0.4 - rem * 0.22}em`,
          color: C.gold,
          opacity: rem,
          textShadow: "0 0 50px rgba(246,195,95,0.4)",
        }}
      >
        REMOTION
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 450, opacity: 1 - codeOut, transform: `scale(${1 - codeOut * 0.2}) translateY(${-codeOut * 80}px)` }}>
        <Glass style={{ padding: "34px 40px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
          </div>
          {CODE.map((line, i) => {
            const show = line.slice(0, Math.max(0, left));
            left -= line.length;
            return (
              <div key={i} style={{ fontFamily: F.mono, fontSize: 38, lineHeight: 1.45, color: i === 0 || i === 5 ? C.teal : C.white, whiteSpace: "pre", minHeight: 55 }}>
                {show}
                {left < 0 && left > -line.length - 1 && Math.floor(frame / 8) % 2 === 0 ? "▍" : ""}
              </div>
            );
          })}
          <div style={{ marginTop: 26, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ width: `${prog * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.teal}, ${C.gold})` }} />
          </div>
          <div style={{ marginTop: 12, fontFamily: F.mono, fontSize: 24, color: C.dim }}>render {Math.round(prog * 100)}%</div>
        </Glass>
      </div>
      {/* vários vídeos */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 470, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 360px)", gap: 24 }}>
        {Array.from({ length: 9 }).map((_, k) => {
          const d = Math.abs((k % 3) - 1) + Math.abs(Math.floor(k / 3) - 1);
          const p = spring({ frame: frame - many - d * 3, fps, config: { damping: 12, stiffness: 140, mass: 0.7 } }); // eslint-disable-line react-hooks/rules-of-hooks
          return frame >= many - 2 ? <Thumb key={k} k={k} p={p} /> : <div key={k} />;
        })}
      </div>
    </SceneIn>
  );
};

// ——— c7: vários conteúdos em um só dia — grelha + rosto ———
export const C7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("c7");
  const at = useAt(sc.from);
  const card = spring({ frame: frame - 2, fps, config: arrive });
  const count = Math.min(9, Math.floor(interpolate(frame, [at(t9("produzir", 37)), at(t9("conteúdos", 37.5)) + 10], [1, 9], clamp)));
  const day = spring({ frame: frame - at(t9("dia", 38.8)), fps, config: { damping: 11, stiffness: 200, mass: 0.6 } });
  return (
    <SceneIn kind="zoom">
      <Stage />
      <div style={{ position: "absolute", left: 120, right: 120, top: BAR + 30, display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 10 }}>
        {Array.from({ length: 9 }).map((_, k) => (
          <div key={k} style={{ height: 150 }}>
            <Thumb k={k} p={k < count ? 1 : 0.15} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: BAR + 210, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 150, color: C.gold, lineHeight: 1, textShadow: "0 0 50px rgba(246,195,95,0.4)" }}>{count}</span>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 56, letterSpacing: "0.16em", color: C.white }}>VÍDEOS</span>
        {day > 0.01 && (
          <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 56, letterSpacing: "0.12em", color: "#04191D", background: C.gold, padding: "6px 22px", borderRadius: 12, transform: `scale(${2 - day}) rotate(-4deg)`, display: "inline-block", opacity: Math.min(1, day * 2) }}>
            1 DIA
          </span>
        )}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1040, bottom: BAR + 10, borderRadius: 34, overflow: "hidden", border: `2px solid ${C.stroke}`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)", transform: `translateY(${(1 - card) * 500}px)` }}>
        <Face sceneFrom={sc.from} look="cin" posY={44} zoom={1.08} />
      </div>
    </SceneIn>
  );
};
