import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, EZ, SP } from "../kit/Kit";
import { M, useClock18 as useClock } from "./cuts18";
import { digitalZoomAt } from "./Scenes18";
import { T18 as T, ZONE18 as Z } from "./theme18";
import { AppIcon, Card, Dark, ez, Icon, Label, Pill, pop, Serif, Tag } from "./ui18";

// Os 8 efeitos (marcas no tempo ORIGINAL da fala), cada um no momento que lhe assenta:
export const FX18: { n: string; name: string; a: number; b: number }[] = [
  { n: "01", name: "ORBIT", a: 0.4, b: 8.3 },
  { n: "07", name: "CHECKLIST", a: 14.3, b: 27.1 },
  { n: "06", name: "PHONE MOCKUP", a: 34.0, b: 44.95 },
  { n: "03", name: "UI WORLD", a: 45.5, b: 49.3 },
  { n: "04", name: "FRAME BREAK", a: 49.4, b: 54.95 },
  { n: "05", name: "DIGITAL ZOOM", a: 60.9, b: 63.3 },
  { n: "02", name: "QUOTE WALL", a: 68.2, b: 71.8 },
  { n: "08", name: "HEADLINE WALL", a: 71.8, b: 78.7 },
];

// ——— 01 · ORBIT + gancho: título da referência (forte + pill azul + itálico) e etiquetas a girar
//     à volta do boné; em "perder" a etiqueta do dinheiro fica vermelha e a órbita cai ———
const ORB = { cx: 455, cy: 660, rx: 330, ry: 62, tilt: -6 };
const ORBIT_ITEMS = [
  { l: "medições", ic: "ruler", c: T.blue },
  { l: "obra", ic: "helmet", c: T.navy },
  { l: "vendas", ic: "handshake", c: T.blue },
  { l: "dinheiro", ic: "coin", c: T.green },
];
const Orbit: React.FC<{ front: boolean }> = ({ front }) => {
  const { t, to, sp } = useClock();
  if (t < 0.3 || t > 8.6) return null;
  const inK = sp(0.6, SP.soft);
  const lose = sp(7.36, SP.pop);
  const fall = ez(t, 7.7, 8.3, EZ.in);
  const rad = (ORB.tilt * Math.PI) / 180;
  const ring = (half: "back" | "front") => {
    const d = half === "back" ? `M ${-ORB.rx} 0 A ${ORB.rx} ${ORB.ry} 0 0 1 ${ORB.rx} 0` : `M ${ORB.rx} 0 A ${ORB.rx} ${ORB.ry} 0 0 1 ${-ORB.rx} 0`;
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: inK * (1 - fall) }}>
        <g transform={`translate(${ORB.cx} ${ORB.cy}) rotate(${ORB.tilt})`}>
          <path d={d} fill="none" stroke={half === "front" ? T.blue : "rgba(31,107,255,0.55)"} strokeWidth={half === "front" ? 3 : 2} strokeDasharray={half === "front" ? "0" : "8 10"} strokeDashoffset={-to * 40} />
        </g>
      </svg>
    );
  };
  return (
    <AbsoluteFill>
      {ring(front ? "front" : "back")}
      {ORBIT_ITEMS.map((it, i) => {
        const th = to * 1.0 + (i * Math.PI) / 2 + 0.4;
        const depth = Math.sin(th);
        if (front !== depth > 0) return null;
        const ex = ORB.rx * Math.cos(th) * inK;
        const ey = ORB.ry * Math.sin(th) * inK;
        const x = ORB.cx + ex * Math.cos(rad) - ey * Math.sin(rad);
        const y = ORB.cy + ex * Math.sin(rad) + ey * Math.cos(rad) + fall * (320 + i * 70);
        const k = (depth + 1) / 2;
        const lost = i === 3 ? lose : 0;
        return (
          <div key={it.l} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.72 + 0.32 * k}) rotate(${fall * (i % 2 ? 28 : -28)}deg)`, opacity: interpolate(inK, [0, 0.3], [0, 1], clamp) * (0.55 + 0.45 * k) * (1 - fall), filter: depth < -0.35 ? "blur(1.2px)" : undefined }}>
            <Tag size={28} icon={lost > 0.5 ? "x" : it.ic} color={lost > 0.5 ? T.red : it.c} style={lost > 0.5 ? { border: `2px solid ${T.red}`, color: T.red } : undefined}>
              {it.l}
            </Tag>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const Hook: React.FC = () => {
  const { t, sp } = useClock();
  if (t > 8.6) return null;
  const a = sp(0.8, SP.snap);
  const b = sp(1.6, SP.pop);
  const c = sp(3.28, SP.snap);
  const d = sp(4.48, SP.pop);
  const out = ez(t, 8.2, 8.5, EZ.in);
  const glow = "0 0 22px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.9)";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: Z.top + 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 1 - out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: T.ui, fontWeight: 900, fontSize: 92, letterSpacing: "-0.03em", color: T.ink, textShadow: glow, ...pop(a) }}>Medições</span>
        <div style={pop(b)}>
          <Pill size={34}>na obra</Pill>
        </div>
      </div>
      <div style={{ ...pop(c), textShadow: glow }}>
        <Serif size={64}>uma lição sobre </Serif>
        <Serif size={64} color={T.blue} style={{ ...pop(d) }}>
          vendas…
        </Serif>
      </div>
    </div>
  );
};

// ——— 07 · CHECKLIST: como medir uma obra (cada passo marca-se no verbo certo) ———
const STEPS: { at: number; l: string; ic: string }[] = [
  { at: 14.72, l: "Pegar o projeto", ic: "doc" },
  { at: 15.84, l: "Estudar todo o projeto", ic: "plan" },
  { at: 17.76, l: "Analisar todos os detalhes", ic: "search" },
  { at: 20.4, l: "Saber interpretar", ic: "bulb" },
  { at: 21.36, l: "O que está incluído e o que falta", ic: "eye" },
  { at: 24.32, l: "Conferir as medidas", ic: "ruler" },
];
const Checklist: React.FC = () => {
  const { t, sp } = useClock();
  if (t < 14.1 || t > 27.3) return null;
  const p = sp(14.32, SP.snap);
  const out = ez(t, 26.95, 27.25, EZ.in);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: Z.top, opacity: 1 - out, ...pop(p) }}>
      <Card style={{ padding: "18px 24px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Label color={T.blue}>ANTES DE MEDIR A OBRA</Label>
          <span style={{ fontFamily: T.mono, fontSize: 16, color: T.gray }}>{STEPS.filter((s) => t >= s.at + 0.3).length}/6</span>
        </div>
        <div style={{ marginTop: 8 }}>
          {STEPS.map((s, i) => {
            const r = sp(s.at, SP.pop);
            const ok = sp(s.at + 0.3, SP.pop);
            return (
              <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 0", borderTop: i ? `1px solid ${T.line}` : undefined, opacity: 0.3 + 0.7 * Math.min(1, r * 1.5) }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, border: `2.5px solid ${ok > 0.3 ? T.green : "rgba(10,26,47,0.2)"}`, background: `rgba(34,176,125,${0.95 * Math.min(1, ok)})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, ok)} />
                  </svg>
                </span>
                <Icon d={s.ic} size={28} color={T.blue} />
                <span style={{ flex: 1, fontFamily: T.ui, fontWeight: 700, fontSize: 28, color: T.ink }}>{s.l}</span>
                {i === 4 && (
                  <span style={{ display: "flex", gap: 8 }}>
                    <span style={pop(sp(22.16, SP.pop), 8)}>
                      <Pill color={T.green} size={18} icon="check">
                        incluído
                      </Pill>
                    </span>
                    <span style={pop(sp(23.68, SP.pop), 8)}>
                      <Pill color={T.red} size={18} icon="x">
                        em falta
                      </Pill>
                    </span>
                  </span>
                )}
                {i === 5 && (
                  <span style={pop(sp(26.51, SP.pop), 8)}>
                    <Pill color={T.green} size={18} icon="check">
                      faz sentido
                    </Pill>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ——— 06 · PHONE MOCKUP: a conversa com o cliente (entender antes de vender) ———
const MSGS: { at: number; me: boolean; text: string }[] = [
  { at: 35.44, me: false, text: "Olá! Quero um orçamento." },
  { at: 37.52, me: true, text: "Claro. O que precisa exatamente?" },
  { at: 40.13, me: false, text: "Preciso de reduzir custos." },
  { at: 42.0, me: true, text: "E qual é o problema que quer resolver?" },
  { at: 44.1, me: false, text: "As obras saem sempre acima do orçamento." },
];
const Phone: React.FC = () => {
  const { t, to, sp } = useClock();
  if (t < 33.8 || t > 45.2) return null;
  const inK = sp(34.0, SP.soft);
  const out = ez(t, 44.7, 45.0, EZ.in);
  const typing = t > 43.3 && t < 44.1;
  const head = sp(34.48, SP.snap);
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: Z.top + 10, width: 560, opacity: 1 - out, ...pop(head) }}>
        <Label color={T.ink} size={18} glow>ANTES DE VENDER</Label>
        <div style={{ marginTop: 6, textShadow: "0 0 20px rgba(255,255,255,0.95)" }}>
          <span style={{ fontFamily: T.ui, fontWeight: 900, fontSize: 64, letterSpacing: "-0.03em", color: T.ink }}>entende o </span>
          <Serif size={70} color={T.blue}>
            cliente
          </Serif>
        </div>
      </div>
      <div style={{ position: "absolute", left: 690, top: 300, perspective: 1400, opacity: interpolate(inK, [0, 0.3], [0, 1], clamp) * (1 - out) }}>
        <div style={{ transform: `translateX(${(1 - inK) * 240 + out * 200}px) rotateY(${-16 + (1 - inK) * -26 + Math.sin(to * 1.1) * 2.5}deg) rotateX(${4 + Math.cos(to * 0.9) * 2}deg) translateY(${Math.sin(to * 1.4) * 7}px)` }}>
          <div style={{ width: 350, height: 720, borderRadius: 56, background: "#0B1220", padding: 12, boxShadow: "0 60px 120px -30px rgba(10,26,47,0.7), inset 0 0 0 2px rgba(255,255,255,0.14)" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: T.paper }}>
              <div style={{ position: "absolute", left: "50%", top: 12, width: 92, height: 26, marginLeft: -46, borderRadius: 13, background: "#000" }} />
              {/* cabeçalho da conversa */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 48, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.line}`, background: T.white }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d="user" size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 18, color: T.ink }}>Cliente</div>
                  <div style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 13, color: T.green }}>{typing ? "a escrever…" : "online"}</div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 12, right: 12, top: 118, display: "flex", flexDirection: "column", gap: 10 }}>
                {MSGS.map((m) => {
                  const p = sp(m.at, SP.pop);
                  if (p < 0.01) return null;
                  return (
                    <div key={m.text} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "82%", ...pop(p, 14) }}>
                      <div style={{ padding: "10px 14px", borderRadius: 18, borderBottomRightRadius: m.me ? 6 : 18, borderBottomLeftRadius: m.me ? 18 : 6, background: m.me ? T.blue : T.white, color: m.me ? "#fff" : T.ink, fontFamily: T.ui, fontWeight: 600, fontSize: 17, lineHeight: 1.25, boxShadow: "0 6px 14px -8px rgba(10,26,47,0.4)" }}>{m.text}</div>
                    </div>
                  );
                })}
                {typing && (
                  <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: 18, background: T.white, display: "flex", gap: 6 }}>
                    {[0, 1, 2].map((d) => (
                      <span key={d} style={{ width: 8, height: 8, borderRadius: 4, background: T.gray, opacity: 0.4 + 0.6 * Math.abs(Math.sin(to * 6 + d)) }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 40%)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ——— 03 · UI WORLD: o que impede a decisão (widgets a flutuar à tua volta) ———
const Float: React.FC<{ at: number; x: number; y: number; w: number; depth: number; children: React.ReactNode }> = ({ at, x, y, w, depth, children }) => {
  const { t, to, sp } = useClock();
  const p = sp(at, SP.snap);
  const out = ez(t, 49.0, 49.3, EZ.in);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, perspective: 1200, opacity: 1 - out, ...pop(p, 40) }}>
      <div style={{ transform: `translateY(${Math.sin(to * 1.1 + depth * 3) * 8 * depth}px) rotateY(${(x > 540 ? -12 : 12) + Math.sin(to + depth) * 3}deg) rotateX(${5 + Math.cos(to * 1.2) * 2}deg)` }}>{children}</div>
    </div>
  );
};
const UIWorld: React.FC<{ front: boolean }> = ({ front }) => {
  const { t, to } = useClock();
  if (t < 45.4 || t > 49.4) return null;
  if (front)
    return (
      <AbsoluteFill>
        <Float at={46.88} x={780} y={700} w={270} depth={1}>
          <Card style={{ padding: "14px 16px" }}>
            <Label color={T.gray} size={13}>
              PRAZO
            </Label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <Icon d="clock" size={30} color={T.red} />
              <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 30, color: T.ink }}>incerto</span>
            </div>
          </Card>
        </Float>
        <Float at={47.52} x={30} y={720} w={250} depth={0.9}>
          <Card style={{ padding: "14px 16px" }}>
            <Label color={T.gray} size={13}>
              CONFIANÇA
            </Label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              <Icon d="lock" size={30} color={T.red} />
              <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 30, color: T.ink }}>baixa</span>
            </div>
            <div style={{ marginTop: 8, height: 10, borderRadius: 5, background: T.line }}>
              <div style={{ width: `${30 * ez(t, 47.6, 48.2)}%`, height: "100%", borderRadius: 5, background: T.red }} />
            </div>
          </Card>
        </Float>
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      <Float at={45.6} x={40} y={Z.top + 10} w={420} depth={0.5}>
        <Card style={{ padding: "16px 18px" }}>
          <Label color={T.gray} size={13}>
            ORÇAMENTO
          </Label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
            <AppIcon d="coin" color={T.red} size={46} />
            <div>
              <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 30, color: T.ink }}>acima do previsto</div>
              <div style={{ fontFamily: T.mono, fontSize: 16, color: T.red }}>+18%</div>
            </div>
          </div>
        </Card>
      </Float>
      <Float at={47.94} x={500} y={Z.top + 40} w={540} depth={0.3}>
        <Dark style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={36} height={36} viewBox="0 0 24 24" style={{ transform: `rotate(${to * 220}deg)` }}>
            <circle cx={12} cy={12} r={9} stroke={T.blueLight} strokeWidth={3} fill="none" strokeDasharray="34 20" />
          </svg>
          <div>
            <Label color={T.blueLight} size={13}>
              DECISÃO DO CLIENTE
            </Label>
            <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 34, color: "#fff" }}>pendente…</div>
          </div>
        </Dark>
      </Float>
    </AbsoluteFill>
  );
};

// ——— 04 · FRAME BREAK: moldura vermelha atrás de ti, a cabeça a sair dela; solução ≠ problema ———
const FB = { x: 110, y: 700, w: 860, h: 980 };
const FrameBreak: React.FC<{ front: boolean }> = ({ front }) => {
  const { t, to, sp } = useClock();
  if (t < 49.3 || t > 55.1) return null;
  const draw = ez(t, 49.43, 49.8, EZ.out);
  const out = ez(t, 54.7, 55.0, EZ.in);
  const per = 2 * (FB.w + FB.h);
  if (!front)
    return (
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={FB.x} y={FB.y} width={FB.w} height={FB.h} rx={20} fill="none" stroke={T.red} strokeWidth={12} strokeDasharray={`${per * draw} ${per}`} style={{ filter: "drop-shadow(0 0 14px rgba(242,92,92,0.6))" }} />
          {draw > 0.6 && [-1, 1].map((s) => <path key={s} d={`M ${455 + s * 230} ${FB.y} l ${s * 20} -24 l ${s * 14} 16 l ${s * 24} -28`} stroke={T.red} strokeWidth={4} fill="none" opacity={ez(t, 49.6, 49.8)} />)}
        </svg>
        <div style={{ position: "absolute", left: 40, right: 40, top: Z.top + 20, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, ...pop(sp(52.0, SP.snap)) }}>
            <Card style={{ padding: "16px 18px" }} edge={T.green}>
              <Label color={T.green} size={13}>
                SOLUÇÃO
              </Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <Icon d="check" size={32} color={T.green} sw={3} />
                <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 32, color: T.ink }}>perfeita</span>
              </div>
            </Card>
          </div>
          <div style={{ flex: 1, ...pop(sp(53.52, SP.snap)) }}>
            <Card style={{ padding: "16px 18px" }} edge={T.red}>
              <Label color={T.red} size={13}>
                PROBLEMA
              </Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <Icon d="x" size={32} color={T.red} sw={3} />
                <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 32, color: T.ink }}>errado</span>
              </div>
            </Card>
          </div>
        </div>
      </AbsoluteFill>
    );
  const p = interpolate(to - M(49.6), [0, 0.8], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - p }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = -Math.PI * (0.15 + (0.7 * ((i * 37) % 12)) / 11);
        const v = 240 + ((i * 53) % 7) * 55;
        const x = 280 + ((i * 71) % 12) * 30 + Math.cos(a) * v * p;
        const y = FB.y + Math.sin(a) * v * p + 480 * p * p;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 10 + (i % 4) * 5, height: 6 + (i % 3) * 5, background: i % 3 ? T.red : "rgba(255,255,255,0.9)", transform: `rotate(${i * 47 + p * 400}deg)`, clipPath: "polygon(0 0, 100% 30%, 40% 100%)" }} />;
      })}
    </AbsoluteFill>
  );
};

// ——— 05 · DIGITAL ZOOM: diagnóstico (visor de câmara, linha de varrimento, foco) ———
const DigitalZoomHud: React.FC = () => {
  const { to, frame } = useClock();
  const z = digitalZoomAt(to);
  if (z < 1.01) return null;
  const k = (z - 1) / 0.32;
  const cx = 455;
  const cy = 860;
  const bw = 600;
  const bh = 640;
  const scan = (to * 0.9) % 1;
  const corner = (sx: number, sy: number) => <path d={`M ${cx + (sx * bw) / 2} ${cy + (sy * bh) / 2 - sy * 70} L ${cx + (sx * bw) / 2} ${cy + (sy * bh) / 2} L ${cx + (sx * bw) / 2 - sx * 70} ${cy + (sy * bh) / 2}`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 4px rgba(10,26,47,0.6))" }} />;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, k * 1.6) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {corner(-1, -1)}
        {corner(1, -1)}
        {corner(-1, 1)}
        {corner(1, 1)}
        <line x1={cx - bw / 2 + 10} x2={cx + bw / 2 - 10} y1={cy - bh / 2 + scan * bh} y2={cy - bh / 2 + scan * bh} stroke={T.blue} strokeWidth={3} opacity={0.8} />
        <path d={`M ${cx - 22} ${cy} H ${cx + 22} M ${cx} ${cy - 22} V ${cy + 22}`} stroke={T.blue} strokeWidth={3} />
        <rect x={cx - 120} y={cy - 200} width={240} height={180} rx={10} fill="none" stroke={frame % 10 < 6 ? T.green : "rgba(34,176,125,0.3)"} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: cx - bw / 2, top: cy - bh / 2 - 56, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 22, color: "#fff", background: T.blue, padding: "5px 12px", borderRadius: 8 }}>DIAGNÓSTICO</span>
        <span style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 22, color: T.ink, background: "rgba(255,255,255,0.9)", padding: "5px 12px", borderRadius: 8 }}>ZOOM {(1 + k).toFixed(1)}×</span>
      </div>
    </AbsoluteFill>
  );
};

// ——— 02 · QUOTE WALL: parede de perguntas (fazer as melhores perguntas) ———
const QS: { q: string; x: number; y: number; r: number; at: number }[] = [
  { q: "Qual é o problema real?", x: 30, y: 440, r: -4, at: 68.6 },
  { q: "O que já tentou?", x: 780, y: 470, r: 4, at: 68.75 },
  { q: "Quem decide?", x: 40, y: 640, r: 3, at: 68.9 },
  { q: "Qual é o prazo?", x: 780, y: 680, r: -3, at: 69.05 },
  { q: "Qual é o orçamento?", x: 30, y: 830, r: -2, at: 69.2 },
  { q: "O que o impede?", x: 780, y: 890, r: 3, at: 69.35 },
]
const QuoteWall: React.FC = () => {
  const { t, to, sp } = useClock();
  if (t < 68.0 || t > 72.0) return null;
  const main = sp(68.24, SP.snap);
  const out = ez(t, 71.5, 71.8, EZ.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {QS.map((x, i) => {
        const p = sp(x.at, SP.pop);
        return (
          <div key={x.q} style={{ position: "absolute", left: x.x, top: x.y + Math.sin(to * 0.8 + i) * 6, width: 270, transform: `rotate(${x.r}deg)`, ...pop(p) }}>
            <Card radius={18} style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Icon d="question" size={26} color={T.blue} />
                <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 25, color: T.ink, lineHeight: 1.2 }}>{x.q}</span>
              </div>
            </Card>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 40, right: 40, top: Z.top + 10, ...pop(main) }}>
        <Card style={{ padding: "20px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 90, lineHeight: 0.6, color: T.blue, height: 40 }}>“</span>
            <Label color={T.blue}>PREOCUPA-TE EM</Label>
          </div>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontFamily: T.ui, fontWeight: 900, fontSize: 52, letterSpacing: "-0.02em", color: T.ink }}>fazer as melhores </span>
            <Serif size={60} color={T.blue}>
              perguntas.
            </Serif>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ——— 08 · HEADLINE WALL: linhas de títulos a correr por trás de ti ———
const ROWS = ["COMPREENDER", "RESOLVER", "PERGUNTAR", "COMPREENDER", "RESOLVER", "PERGUNTAR", "COMPREENDER"];
const HeadlineWall: React.FC = () => {
  const { t, to, sp } = useClock();
  if (t < 71.6 || t > 78.9) return null;
  const out = ez(t, 78.3, 78.7, EZ.in);
  const green = ez(t, 77.76, 78.0);
  const head = sp(73.52, SP.snap);
  const res = sp(77.76, SP.pop);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {ROWS.map((w, i) => {
        const p = ez(t, 71.83 + i * 0.06, 72.2 + i * 0.06, EZ.out);
        const dir = i % 2 ? 1 : -1;
        const filled = i % 2 === 1;
        const shift = dir * (to - M(71.83)) * 100 + (1 - p) * dir * -500;
        const text = Array.from({ length: 6 }, () => `${w} •`).join(" ");
        return (
          <div key={i} style={{ position: "absolute", left: -500 + shift, top: 200 + i * 150, whiteSpace: "nowrap", opacity: p, fontFamily: T.ui, fontWeight: 900, fontSize: 130, lineHeight: 1, letterSpacing: "-0.03em", color: filled ? (green > 0.5 ? "rgba(34,176,125,0.42)" : "rgba(31,107,255,0.3)") : "transparent", WebkitTextStroke: filled ? undefined : `2px rgba(10,26,47,${0.32 + 0.1 * green})` }}>
            {text}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 40, right: 40, top: Z.top + 20, ...pop(head) }}>
        <Card style={{ padding: "18px 26px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: T.ui, fontWeight: 900, fontSize: 48, letterSpacing: "-0.02em", color: T.ink }}>quem compreende o problema</span>
          <span style={{ ...pop(res, 10) }}>
            <Pill color={T.green} icon="check" size={36}>
              resolve
            </Pill>
          </span>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const EffectsBehind: React.FC = () => (
  <>
    <Orbit front={false} />
    <Hook />
    <Checklist />
    <Phone />
    <UIWorld front={false} />
    <FrameBreak front={false} />
    <QuoteWall />
    <HeadlineWall />
  </>
);
export const EffectsFront: React.FC = () => (
  <>
    <Orbit front />
    <UIWorld front />
    <FrameBreak front />
    <DigitalZoomHud />
  </>
);
export const activeFx = (t: number) => FX18.find((f) => t >= f.a && t < f.b);
