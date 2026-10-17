import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, EZ, SP } from "../kit/Kit";
import { M, useClock17 as useClock } from "./cuts17";
import { Caps, Chip, ez, G, ICON, pin } from "./Scenes17";
import { T17 as T, ZONE } from "./theme17";

// Os 8 efeitos pedidos, cada um no momento da fala que lhe assenta (marcas no tempo ORIGINAL):
// 01 orbit · 02 quote wall · 03 ui world · 04 frame break · 05 digital zoom · 06 phone mockup ·
// 07 checklist (nas propostas, em Scenes17) · 08 headline wall
export const FX: { n: string; name: string; a: number; b: number }[] = [
  { n: "01", name: "ORBIT", a: 0.4, b: 4.4 },
  { n: "06", name: "PHONE MOCKUP", a: 16.64, b: 19.95 },
  { n: "07", name: "CHECKLIST", a: 23.92, b: 33.2 },
  { n: "05", name: "DIGITAL ZOOM", a: 33.2, b: 34.35 },
  { n: "03", name: "UI WORLD", a: 39.44, b: 42.35 },
  { n: "04", name: "FRAME BREAK", a: 42.47, b: 44.9 },
  { n: "02", name: "QUOTE WALL", a: 51.44, b: 55.05 },
  { n: "08", name: "HEADLINE WALL", a: 55.12, b: 59.85 },
];

// ——— 01 · ORBIT: etiquetas a girar à volta do capacete (atrás e à frente da pessoa) ———
const ORB = { cx: 470, cy: 585, rx: 300, ry: 70, tilt: -7 };
const ORBIT_ITEMS = [
  { l: "OBRA EXCELENTE", ic: "shield", c: T.green },
  { l: "QUALIDADE", ic: "tool", c: T.turq },
  { l: "ACABAMENTO", ic: "brick", c: T.white },
  { l: "TÉCNICA", ic: "clock", c: T.blueLight },
];
const Orbit: React.FC<{ front: boolean }> = ({ front }) => {
  const { t, to, sp } = useClock();
  if (t < 0.3 || t > 5.2) return null;
  const inK = sp(0.5, SP.soft);
  const fall = ez(t, 4.4, 5.0, EZ.in); // em "perder" a órbita cai
  const okPulse = sp(2.64, SP.pop) * (1 - ez(t, 4.3, 4.5));
  const rad = (ORB.tilt * Math.PI) / 180;
  const ring = (half: "back" | "front") => {
    // meia elipse: atrás = metade de cima; à frente = metade de baixo
    const d = half === "back" ? `M ${-ORB.rx} 0 A ${ORB.rx} ${ORB.ry} 0 0 1 ${ORB.rx} 0` : `M ${ORB.rx} 0 A ${ORB.rx} ${ORB.ry} 0 0 1 ${-ORB.rx} 0`;
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: inK * (1 - fall) }}>
        <g transform={`translate(${ORB.cx} ${ORB.cy}) rotate(${ORB.tilt})`}>
          <path d={d} fill="none" stroke="rgba(46,196,214,0.75)" strokeWidth={half === "front" ? 3 : 2} strokeDasharray={half === "front" ? "0" : "10 10"} strokeDashoffset={-to * 40} />
        </g>
      </svg>
    );
  };
  return (
    <AbsoluteFill>
      {ring(front ? "front" : "back")}
      {ORBIT_ITEMS.map((it, i) => {
        const th = to * 1.05 + (i * Math.PI) / 2 + 0.6;
        const depth = Math.sin(th); // > 0 = à frente
        if (front !== depth > 0) return null;
        const ex = ORB.rx * Math.cos(th) * inK;
        const ey = ORB.ry * Math.sin(th) * inK;
        const x = ORB.cx + ex * Math.cos(rad) - ey * Math.sin(rad);
        const y = ORB.cy + ex * Math.sin(rad) + ey * Math.cos(rad) + fall * (300 + i * 60);
        const k = (depth + 1) / 2;
        const ok = i === 0 ? okPulse : 0;
        return (
          <div key={it.l} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${(0.72 + 0.34 * k) * (1 + 0.12 * ok)}) rotate(${fall * (i % 2 ? 30 : -30)}deg)`, opacity: interpolate(inK, [0, 0.3], [0, 1], clamp) * (0.5 + 0.5 * k) * (1 - fall), filter: depth < -0.3 ? "blur(1.2px)" : undefined }}>
            <Chip color={i === 0 && ok > 0.3 ? T.green : it.c} svg={it.ic} size={26}>
              {it.l}
            </Chip>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ——— 06 · PHONE MOCKUP: telemóvel 3D com o concurso e as duas propostas a chegar ———
const PhoneMockup: React.FC = () => {
  const { t, to, sp } = useClock();
  if (t < 16.4 || t > 20.1) return null;
  const inK = sp(16.64, SP.soft);
  const out = ez(t, 19.6, 19.95, EZ.in);
  const notes = [
    { n: "A", at: 17.04, c: T.gray, l: "Empreendedor A", s: "Proposta enviada · agora" },
    { n: "B", at: 17.5, c: T.blueLight, l: "Empreendedor B", s: "Proposta enviada · agora" },
  ];
  const W = 330;
  const H = 680;
  return (
    <div style={{ position: "absolute", left: 708, top: 330, perspective: 1400, opacity: interpolate(inK, [0, 0.3], [0, 1], clamp) * (1 - out) }}>
      <div style={{ transform: `translateX(${(1 - inK) * 260 + out * 200}px) rotateY(${-20 + (1 - inK) * -30 + Math.sin(to * 1.1) * 3}deg) rotateX(${5 + Math.cos(to * 0.9) * 2}deg) translateY(${Math.sin(to * 1.4) * 8}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "relative", width: W, height: H, borderRadius: 54, background: "#0B1220", padding: 12, boxShadow: "0 60px 120px -30px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.14), 0 0 0 1.5px rgba(143,230,240,0.35)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 44, overflow: "hidden", background: `linear-gradient(180deg, ${T.navy2}, ${T.navy})` }}>
            {/* ilha + barra de estado */}
            <div style={{ position: "absolute", left: "50%", top: 12, width: 92, height: 26, marginLeft: -46, borderRadius: 13, background: "#000" }} />
            <div style={{ position: "absolute", left: 26, top: 16, fontFamily: T.ui, fontWeight: 700, fontSize: 16, color: T.white }}>9:41</div>
            <div style={{ position: "absolute", left: 22, right: 22, top: 62 }}>
              <Caps color={T.turq} size={14}>
                CONCURSO · OBRA Nº 214
              </Caps>
              <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 27, lineHeight: 1.1, color: T.white, marginTop: 6 }}>Edifício residencial</div>
              <div style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 15, color: T.gray, marginTop: 4 }}>a mesma obra · 2 concorrentes</div>
              <div style={{ height: 1, background: T.line, margin: "16px 0" }} />
              {notes.map((x) => {
                const p = sp(x.at, SP.pop);
                return (
                  <div key={x.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", marginBottom: 10, borderRadius: 18, background: "rgba(255,255,255,0.07)", border: `1px solid ${T.line}`, ...pin(p, 24) }}>
                    <div style={{ width: 42, height: 42, borderRadius: 21, background: x.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontSize: 26, color: T.navy, paddingTop: 2, flexShrink: 0 }}>{x.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 17, color: T.white }}>{x.l}</div>
                      <div style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 13, color: T.gray }}>{x.s}</div>
                    </div>
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={T.turq} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
                    </svg>
                  </div>
                );
              })}
              <div style={{ marginTop: 14, ...pin(sp(18.72, SP.pop), 16) }}>
                <div style={{ padding: "13px 0", borderRadius: 16, background: T.turq, textAlign: "center", fontFamily: T.ui, fontWeight: 800, fontSize: 17, color: T.navy }}>Comparar propostas</div>
              </div>
            </div>
            {/* reflexo no vidro do ecrã */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.14), transparent 40%)", pointerEvents: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ——— 05 · DIGITAL ZOOM: zoom digital em degraus no rosto, com visor de câmara ———
const DZ_A = 33.2;
const DZ_B = 34.05;
export const digitalZoomAt = (to: number) => {
  const a = M(DZ_A);
  const b = M(DZ_B);
  if (to < a || to > b + 0.45) return 1;
  // degraus de 3 fotogramas: 1,00 → 1,18 → 1,36, depois volta suave
  const step = (at: number, from: number, z: number) => from + (z - from) * interpolate(to, [at, at + 0.1], [0, 1], clamp);
  const up = step(a + 0.25, step(a, 1, 1.18), 1.36);
  const back = interpolate(to, [b, b + 0.4], [0, 1], { easing: EZ.inOut, ...clamp });
  return up + (1 - up) * back;
};
const DigitalZoomHud: React.FC = () => {
  const { to, frame } = useClock();
  const z = digitalZoomAt(to);
  if (z < 1.01) return null;
  const k = (z - 1) / 0.36;
  const cx = 432;
  const cy = 860;
  const bw = 600;
  const bh = 660;
  const corner = (sx: number, sy: number) => (
    <path d={`M ${cx + (sx * bw) / 2} ${cy + (sy * bh) / 2 - sy * 70} L ${cx + (sx * bw) / 2} ${cy + (sy * bh) / 2} L ${cx + (sx * bw) / 2 - sx * 70} ${cy + (sy * bh) / 2}`} stroke={T.white} strokeWidth={5} fill="none" strokeLinecap="round" />
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, k * 1.6) }}>
      {/* linhas de varrimento só dentro do visor */}
      <div style={{ position: "absolute", left: cx - bw / 2, top: cy - bh / 2, width: bw, height: bh, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 6px)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {corner(-1, -1)}
        {corner(1, -1)}
        {corner(-1, 1)}
        {corner(1, 1)}
        <path d={`M ${cx - 22} ${cy} H ${cx + 22} M ${cx} ${cy - 22} V ${cy + 22}`} stroke={T.turq} strokeWidth={3} />
        <rect x={cx - 120} y={cy - 210} width={240} height={190} rx={8} fill="none" stroke={frame % 10 < 6 ? T.green : "rgba(54,211,153,0.3)"} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", left: cx - bw / 2, top: cy - bh / 2 - 52, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 26, color: T.turq, background: "rgba(8,20,38,0.66)", padding: "4px 12px", borderRadius: 8 }}>ZOOM {(1 + k).toFixed(1)}×</span>
        <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 22, color: T.green, background: "rgba(8,20,38,0.66)", padding: "4px 10px", borderRadius: 8 }}>AF ●</span>
      </div>
    </AbsoluteFill>
  );
};

// ——— 03 · UI WORLD: widgets de app a flutuar à volta (segurança, previsibilidade, tranquilidade) ———
const Widget: React.FC<{ at: number; x: number; y: number; w: number; depth: number; children: React.ReactNode }> = ({ at, x, y, w, depth, children }) => {
  const { t, to, sp } = useClock();
  const p = sp(at, SP.pop);
  const out = ez(t, 42.05, 42.35, EZ.in);
  const drift = Math.sin(to * 0.9 + depth * 2) * 10 * depth;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, perspective: 1200, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (1 - out) }}>
      <div style={{ transform: `translateY(${(1 - p) * 70 + drift}px) translateX(${-(to - M(at)) * 8 * depth}px) rotateY(${(x > 540 ? -14 : 14) + Math.sin(to + depth) * 4}deg) rotateX(${6 + Math.cos(to * 1.1) * 3}deg) scale(${(0.7 + 0.3 * p) * (1 - out * 0.15)})` }}>{children}</div>
    </div>
  );
};
const UIWorld: React.FC<{ front: boolean }> = ({ front }) => {
  const { t, to, sp } = useClock();
  if (t < 39.3 || t > 42.4) return null;
  const riskBar = 0.18 * ez(t, 39.7, 40.3, EZ.out);
  const gantt = ez(t, 40.3, 41.2, EZ.out);
  const cursorK = ez(t, 41.55, 41.9, EZ.inOut);
  const click = sp(41.95, SP.pop);
  if (front)
    return (
      <AbsoluteFill>
        {/* previsibilidade: cronograma (gantt) */}
        <Widget at={40.16} x={736} y={730} w={310} depth={1}>
          <G radius={24} tint="rgba(10,26,47,0.74)" edge="rgba(143,230,240,0.55)" shine={ez(t, 40.2, 40.9)} style={{ padding: "18px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={T.turq} strokeWidth={2} strokeLinecap="round">
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
              </svg>
              <Caps color={T.white} size={17}>
                PREVISIBILIDADE
              </Caps>
            </div>
            <div style={{ marginTop: 12 }}>
              {[
                [0, 0.38, "Fundações"],
                [0.3, 0.62, "Estrutura"],
                [0.55, 0.85, "Acabamentos"],
                [0.8, 1, "Entrega"],
              ].map(([a, b, l], i) => (
                <div key={String(l)} style={{ position: "relative", height: 26, marginBottom: 6 }}>
                  <div style={{ position: "absolute", left: `${Number(a) * 100}%`, width: `${(Number(b) - Number(a)) * 100 * interpolate(gantt * 4 - i, [0, 1], [0, 1], clamp)}%`, top: 4, height: 18, borderRadius: 9, background: i === 3 ? T.green : `linear-gradient(90deg, ${T.blue}, ${T.turq})` }} />
                  <span style={{ position: "absolute", left: `${Number(a) * 100}%`, top: 3, paddingLeft: 8, fontFamily: T.ui, fontWeight: 700, fontSize: 12, color: T.navy, whiteSpace: "nowrap", opacity: gantt }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 6, fontFamily: T.ui, fontWeight: 700, fontSize: 16, color: T.green }}>✓ Prazo no plano · 120 dias</div>
          </G>
        </Widget>
        {/* cursor a aprovar a notificação */}
        {t > 41.4 && (
          <div style={{ position: "absolute", left: interpolate(cursorK, [0, 1], [990, 960]), top: interpolate(cursorK, [0, 1], [1100, 290]), transform: `scale(${1 - 0.15 * Math.sin(Math.min(1, click) * Math.PI)})` }}>
            <svg width={44} height={44} viewBox="0 0 24 24">
              <path d="M5 3l14 8-6 1.5L10 19z" fill={T.white} stroke={T.navy} strokeWidth={1.4} strokeLinejoin="round" />
            </svg>
            {click > 0.02 && click < 0.98 && <div style={{ position: "absolute", left: -30 + 6, top: -30 + 6, width: 60, height: 60, borderRadius: 30, border: `3px solid ${T.turq}`, transform: `scale(${0.3 + click})`, opacity: 1 - click }} />}
          </div>
        )}
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill>
      {/* segurança: risco baixo + seguro ativo */}
      <Widget at={39.44} x={56} y={190} w={390} depth={0.5}>
        <G radius={24} tint="rgba(10,26,47,0.74)" edge="rgba(143,230,240,0.55)" shine={ez(t, 39.5, 40.2)} style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={ICON.shield} />
            </svg>
            <Caps color={T.white} size={17}>
              SEGURANÇA
            </Caps>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: T.ui, fontWeight: 700, fontSize: 16, color: T.gray }}>
            <span>Risco da obra</span>
            <span style={{ color: T.green }}>baixo</span>
          </div>
          <div style={{ marginTop: 6, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.12)" }}>
            <div style={{ width: `${riskBar * 100}%`, height: "100%", borderRadius: 6, background: T.green }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontFamily: T.ui, fontWeight: 700, fontSize: 16, color: T.gray }}>
            <span>Seguro de obra</span>
            <span style={{ width: 46, height: 26, borderRadius: 13, background: T.green, position: "relative" }}>
              <span style={{ position: "absolute", top: 3, left: 3 + 20 * ez(t, 39.8, 40.0), width: 20, height: 20, borderRadius: 10, background: T.white }} />
            </span>
          </div>
        </G>
      </Widget>
      {/* tranquilidade: notificação com aprovação */}
      <Widget at={41.36} x={470} y={190} w={570} depth={0.3}>
        <G radius={24} tint="rgba(10,26,47,0.76)" edge="rgba(54,211,153,0.6)" glow={click > 0.5 ? "rgba(54,211,153,0.35)" : undefined} style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: T.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <Caps color={T.green} size={14}>
              TRANQUILIDADE · AGORA
            </Caps>
            <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 20, color: T.white, lineHeight: 1.2, marginTop: 2 }}>Obra dentro do prazo e do orçamento</div>
          </div>
          <div style={{ padding: "8px 14px", borderRadius: 12, background: click > 0.5 ? T.green : "rgba(255,255,255,0.12)", fontFamily: T.ui, fontWeight: 800, fontSize: 15, color: click > 0.5 ? T.navy : T.white }}>{click > 0.5 ? "✓" : "Ver"}</div>
        </G>
      </Widget>
      {/* anel de progresso */}
      <Widget at={40.6} x={60} y={420} w={150} depth={0.8}>
        <G radius={75} tint="rgba(10,26,47,0.7)" edge="rgba(143,230,240,0.5)" style={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={120} height={120} viewBox="0 0 120 120" style={{ position: "absolute" }}>
            <circle cx={60} cy={60} r={48} stroke="rgba(255,255,255,0.12)" strokeWidth={10} fill="none" />
            <circle cx={60} cy={60} r={48} stroke={T.turq} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={`${301.6 * ez(t, 40.7, 41.6, EZ.out)} 302`} transform="rotate(-90 60 60)" />
          </svg>
          <span style={{ fontFamily: T.display, fontSize: 40, color: T.white, paddingTop: 4 }}>{Math.round(100 * ez(t, 40.7, 41.6, EZ.out))}%</span>
        </G>
      </Widget>
    </AbsoluteFill>
  );
};

// ——— 04 · FRAME BREAK: moldura vermelha atrás de ti; a cabeça "parte" a moldura ———
const FB = { x: 120, y: 640, w: 840, h: 900 };
const FrameBreak: React.FC<{ front: boolean }> = ({ front }) => {
  const { t, to } = useClock();
  if (t < 42.4 || t > 45.0) return null;
  const draw = ez(t, 42.47, 42.8, EZ.out);
  const out = ez(t, 44.55, 44.9, EZ.in);
  const per = 2 * (FB.w + FB.h);
  if (!front)
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - out }}>
        <rect x={FB.x} y={FB.y} width={FB.w} height={FB.h} rx={18} fill="none" stroke={T.red} strokeWidth={12} strokeDasharray={`${per * draw} ${per}`} style={{ filter: "drop-shadow(0 0 14px rgba(242,92,92,0.6))" }} />
        {/* fissuras no topo, onde a cabeça "sai" */}
        {draw > 0.6 &&
          [-1, 1].map((s) => <path key={s} d={`M ${430 + s * 250} ${FB.y} l ${s * 22} -26 l ${s * 14} 18 l ${s * 26} -30`} stroke={T.red} strokeWidth={4} fill="none" opacity={ez(t, 42.6, 42.75)} />)}
      </svg>
    );
  // estilhaços a saltar do topo da moldura
  const p = interpolate(to - M(42.6), [0, 0.8], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - p }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = -Math.PI * (0.15 + 0.7 * ((i * 37) % 14) / 13);
        const v = 260 + ((i * 53) % 7) * 60;
        const x = 250 + ((i * 71) % 14) * 26 + Math.cos(a) * v * p;
        const y = FB.y + Math.sin(a) * v * p + 500 * p * p;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 10 + (i % 4) * 5, height: 6 + (i % 3) * 5, background: i % 3 ? T.red : "rgba(255,255,255,0.85)", transform: `rotate(${i * 47 + p * 400}deg)`, clipPath: "polygon(0 0, 100% 30%, 40% 100%)" }} />;
      })}
    </AbsoluteFill>
  );
};

// ——— 02 · QUOTE WALL: parede de citações; a principal no topo ———
const QUOTES: { q: string; x: number; y: number; r: number; at: number }[] = [
  { q: "Confiança fecha negócios.", x: 40, y: 560, r: -4, at: 51.6 },
  { q: "Valor > preço.", x: 760, y: 540, r: 5, at: 51.7 },
  { q: "Vende o resultado.", x: 60, y: 780, r: 3, at: 51.8 },
  { q: "Prazo é promessa.", x: 790, y: 760, r: -3, at: 51.9 },
  { q: "Clareza vende.", x: 360, y: 600, r: 2, at: 52.0 },
  { q: "Segurança é valor.", x: 40, y: 1000, r: -2, at: 52.1 },
  { q: "Promete e cumpre.", x: 800, y: 980, r: 4, at: 52.2 },
];
const QuoteWall: React.FC = () => {
  const { t, to, sp } = useClock();
  if (t < 51.3 || t > 55.2) return null;
  const main = sp(51.44, SP.soft);
  const out = ez(t, 54.8, 55.1, EZ.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {QUOTES.map((x, i) => {
        const p = sp(x.at, SP.pop);
        return (
          <div key={x.q} style={{ position: "absolute", left: x.x, top: x.y + Math.sin(to * 0.8 + i) * 6, width: 260, opacity: interpolate(p, [0, 0.3], [0, 0.82], clamp), transform: `rotate(${x.r}deg) scale(${0.8 + 0.2 * p})` }}>
            <G radius={18} tint="rgba(10,26,47,0.64)" edge="rgba(255,255,255,0.2)" style={{ padding: "14px 16px" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 40, lineHeight: 0.6, color: T.turq, height: 18 }}>“</div>
              <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 21, color: T.white, lineHeight: 1.2 }}>{x.q}</div>
            </G>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 40, right: 40, top: ZONE.top, ...pin(main, 60) }}>
        <G radius={32} tint="rgba(10,26,47,0.78)" edge="rgba(143,230,240,0.55)" shine={ez(t, 51.5, 52.4)} style={{ padding: "22px 34px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 92, lineHeight: 0.7, color: T.turq, height: 46 }}>“</div>
            <Caps color={T.turq} size={22}>
              GUARDA ISTO
            </Caps>
          </div>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 50, lineHeight: 1.12, color: T.white, marginTop: 6 }}>
            O cliente não compra apenas o teu{" "}
            <span style={{ position: "relative", color: T.gray }}>
              serviço.
              <span style={{ position: "absolute", left: -4, right: -4, top: "55%", height: 5, background: T.red, transform: `scaleX(${ez(t, 54.4, 54.8)})`, transformOrigin: "left" }} />
            </span>
          </div>
        </G>
      </div>
    </AbsoluteFill>
  );
};

// ——— 08 · HEADLINE WALL: linhas de títulos a correr por trás de ti ———
const ROWS = ["ACREDITA", "TRANSFORMA", "VALOR", "ACREDITA", "TRANSFORMA", "VALOR", "ACREDITA"];
const HeadlineWall: React.FC = () => {
  const { t, to } = useClock();
  if (t < 55.0 || t > 59.95) return null;
  const out = ez(t, 59.55, 59.85, EZ.in);
  const green = ez(t, 59.23, 59.45);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {ROWS.map((w, i) => {
        const p = ez(t, 55.12 + i * 0.06, 55.5 + i * 0.06, EZ.out);
        const dir = i % 2 ? 1 : -1;
        const filled = i % 2 === 1;
        const shift = dir * (to - M(55.12)) * 110 + (1 - p) * dir * -500;
        const text = Array.from({ length: 6 }, () => `${w} •`).join(" ");
        return (
          <div key={i} style={{ position: "absolute", left: -400 + shift, top: 186 + i * 142, whiteSpace: "nowrap", opacity: p, fontFamily: T.display, fontSize: 150, lineHeight: 1, letterSpacing: "0.02em", color: filled ? (green > 0.5 ? "rgba(54,211,153,0.42)" : "rgba(46,196,214,0.26)") : "transparent", WebkitTextStroke: filled ? undefined : `2px rgba(244,247,250,${0.42 + 0.2 * green})` }}>
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// camadas: atrás da pessoa e à frente dela
export const EffectsBehind: React.FC = () => (
  <>
    <Orbit front={false} />
    <PhoneMockup />
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

// etiqueta do efeito ativo no HUD ("FX 04 · FRAME BREAK")
export const FxTag: React.FC = () => {
  const { t } = useClock();
  const fx = FX.find((f) => t >= f.a && t < f.b);
  if (!fx) return null;
  const p = interpolate(t - fx.a, [0, 0.25], [0, 1], { easing: EZ.out, ...clamp }) * (1 - interpolate(t - fx.b, [-0.2, 0], [0, 1], clamp));
  return (
    <div style={{ position: "absolute", right: 36, top: 100, opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: "rgba(8,20,38,0.7)", border: `1.5px solid ${T.turq}88`, fontFamily: T.mono, fontWeight: 600, fontSize: 18, color: T.turq }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: T.turq }} />
        FX {fx.n} · {fx.name}
      </div>
    </div>
  );
};
