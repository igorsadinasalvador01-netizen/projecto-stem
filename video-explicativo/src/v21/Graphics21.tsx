import React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "../kit/Kit";
import { M } from "./cuts21";
import { T21 as T } from "./theme21";

// Vídeo 21 · gráficos explicativos. Todas as marcas em tempo ORIGINAL da fala (palavras de
// words21.json); M() converte para a montagem. Linhas finas, branco + azul elétrico, vidro escuro.
const E = Easing.bezier(0.22, 1, 0.36, 1); // entrada: rápida e assenta
const EI = Easing.bezier(0.55, 0, 0.75, 0.2); // saída
export const k = (to: number, at: number, d = 0.5, e = E) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: e, ...clamp });
// janela de um grupo: entra em `a`, sai em `b` (saída mais rápida que a entrada)
export const win = (to: number, a: number, b: number, din = 0.55, dout = 0.32) => k(to, a, din) * (1 - interpolate(to, [M(b) - dout, M(b)], [0, 1], { easing: EI, ...clamp }));
const rise = (p: number, d = 24): React.CSSProperties => ({ opacity: p, transform: `translateY(${(1 - p) * d}px)`, filter: p < 0.98 ? `blur(${(1 - p) * 8}px)` : undefined });

export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = T.gray, size = 17, style }) => (
  <div style={{ fontFamily: T.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.24em", textTransform: "uppercase", color, ...style }}>{children}</div>
);
const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; edge?: string }> = ({ style, children, edge }) => (
  <div style={{ position: "absolute", background: T.glass, border: `1.5px solid ${edge ?? T.glassEdge}`, borderRadius: 22, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)", backdropFilter: "blur(14px)", ...style }}>{children}</div>
);
const ICON: Record<string, string> = {
  person: "M12 11.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zM4.5 20.5c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7",
  briefcase: "M3.5 8h17v11.5h-17zM9 8V5.2h6V8M3.5 13h17M11 13v2h2v-2",
  building: "M4 21V5.5l8-3V21M12 21h8V9.5l-8-3M7 9h2M7 13h2M7 17h2M15 12.5h2M15 16.5h2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  arrow: "M3 12h17M14 6l6 6-6 6",
};
export const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number; draw?: number }> = ({ d, size = 40, color = T.white, sw = 1.6, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, overflow: "visible" }}>
    <path d={ICON[d] ?? d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

// ——— A · gancho: dois vendedores, a mesma sala, vender vs compreender, só um conquista ———
export const Hook: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 0.24, 9.75);
  if (g <= 0) return null;
  const room = k(to, 2.08, 0.9);
  const side = (i: 0 | 1) => {
    const x = i === 0 ? 300 : 1420;
    const p = k(to, i === 0 ? 0.24 : 0.56, 0.6);
    const card = k(to, i === 0 ? 4.0 : 6.08, 0.55);
    const win1 = k(to, 8.08, 0.5); // "conquistou"
    const lose = i === 0 ? 1 - 0.62 * k(to, 7.52, 0.6) : 1;
    const active = i === 1 ? win1 : 0;
    const col = i === 1 ? T.blue : T.white;
    return (
      <div key={i} style={{ position: "absolute", left: x, top: 250, width: 200, display: "flex", flexDirection: "column", alignItems: "center", opacity: lose, ...rise(p) }}>
        <div style={{ width: 132, height: 132, borderRadius: 66, display: "flex", alignItems: "center", justifyContent: "center", background: T.glass, border: `1.5px solid ${active ? T.blue : T.glassEdge}`, boxShadow: active ? `0 0 ${50 * active}px ${T.glow}` : "0 30px 60px -30px rgba(0,0,0,0.8)" }}>
          <Icon d="person" size={66} color={active ? T.blueHi : T.white} draw={k(to, i === 0 ? 0.3 : 0.62, 0.7)} />
        </div>
        <Label style={{ marginTop: 22 }} color={active ? T.blueHi : T.gray}>{`Vendedor ${i + 1}`}</Label>
        <div style={{ marginTop: 26, ...rise(card, 18) }}>
          <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 24, color: T.dim, textAlign: "center" }}>tenta</div>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 40, letterSpacing: "-0.01em", color: col, textAlign: "center", textShadow: i === 1 ? `0 0 ${24 * (0.4 + active)}px ${T.glow}` : undefined }}>{i === 0 ? "VENDER" : "COMPREENDER"}</div>
        </div>
        {i === 1 && (
          <div style={{ marginTop: 24, width: 64, height: 64, borderRadius: 32, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", opacity: win1, transform: `scale(${0.6 + 0.4 * win1})`, boxShadow: `0 0 40px ${T.glow}` }}>
            <Icon d="check" size={38} color="#fff" sw={2.4} draw={k(to, 8.2, 0.45)} />
          </div>
        )}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: g }}>
      {/* a sala de reunião: um contorno fino que se desenha à volta de tudo */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={150} y={150} width={1620} height={800} rx={26} fill="none" stroke={T.blue} strokeOpacity={0.55} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - room} />
      </svg>
      <Label color={T.blueHi} style={{ position: "absolute", left: 186, top: 176, opacity: room }}>Sala de reunião</Label>
      {side(0)}
      {side(1)}
    </div>
  );
};

// ——— C · capítulo ———
export const Chapter: React.FC<{ to: number; at: number; until: number; n: string; title: string }> = ({ to, at, until, n, title }) => {
  const g = win(to, at, until, 0.6, 0.4);
  if (g <= 0) return null;
  const line = k(to, at + 0.1, 0.8);
  return (
    <div style={{ position: "absolute", left: 120, top: 104, display: "flex", alignItems: "center", gap: 18, opacity: g }}>
      <Label color={T.blueHi}>{n}</Label>
      <div style={{ width: 70 * line, height: 1.5, background: T.blue }} />
      <Label color={T.white} style={rise(k(to, at + 0.2, 0.5), 10)}>{title}</Label>
    </div>
  );
};

// ——— D · empresário → empresa → remodelação do espaço (planta a desenhar-se) ———
export const Brief: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 11.53, 15.85);
  if (g <= 0) return null;
  const node = (at: number, icon: string, label: string, x: number) => {
    const p = k(to, at, 0.55);
    return (
      <div style={{ position: "absolute", left: x, top: 190, display: "flex", alignItems: "center", gap: 18, ...rise(p) }}>
        <div style={{ width: 84, height: 84, borderRadius: 20, background: T.glass, border: `1.5px solid ${T.glassEdge}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={icon} size={44} draw={k(to, at + 0.05, 0.7)} />
        </div>
        <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 34, color: T.white }}>{label}</div>
      </div>
    );
  };
  const arrow = k(to, 12.48, 0.7);
  const plan = k(to, 13.84, 1.6, Easing.inOut(Easing.cubic));
  const P = (d: string, at = 0, len = 1) => <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, (plan - at) / len))} />;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: g }}>
      {node(11.92, "briefcase", "Empresário", 150)}
      <div style={{ position: "absolute", left: 560, top: 218, opacity: arrow, transform: `translateX(${(1 - arrow) * -20}px)` }}>
        <svg width={170} height={30}>
          <path d="M2 15h150M140 5l12 10-12 10" fill="none" stroke={T.blue} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
        </svg>
      </div>
      {node(13.2, "building", "Empresa", 760)}
      {/* planta do espaço a remodelar */}
      <svg width={1120} height={470} viewBox="0 0 1120 470" style={{ position: "absolute", left: 150, top: 350, opacity: Math.min(1, plan * 3) }} fill="none" stroke={T.white} strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {P("M10 10H1110V460H10Z", 0, 0.45)}
        {P("M420 10V200M420 290V460", 0.25, 0.3)}
        {P("M420 200a90 90 0 0 1 90 90", 0.4, 0.2)}
        {P("M760 10V160M760 250V460M760 250H1110", 0.35, 0.3)}
        <g stroke={T.blue} strokeOpacity={0.9}>
          {[70, 200, 70, 200].map((x, i) => P(`M${x} ${i < 2 ? 70 : 300}h100v60h-100z`, 0.5 + i * 0.07, 0.25))}
          {[520, 620].map((x, i) => P(`M${x} 330h70v70h-70z`, 0.6 + i * 0.07, 0.25))}
          {P("M840 330h200v80h-200z", 0.75, 0.25)}
        </g>
      </svg>
      <Label color={T.blueHi} style={{ position: "absolute", left: 150, top: 840, ...rise(k(to, 14.0, 0.5), 10) }}>Remodelação do espaço</Label>
    </div>
  );
};

// ——— E · o primeiro vendedor: apresenta logo tudo ———
export const Pitch: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 15.92, 23.1);
  if (g <= 0) return null;
  const items: [number, string][] = [
    [19.52, "Materiais"],
    [20.48, "Preço"],
    [21.28, "Vantagens"],
    [22.32, "Serviço"],
  ];
  return (
    <div style={{ position: "absolute", left: 1080, top: 190, width: 700, opacity: g }}>
      <div style={rise(k(to, 16.16, 0.5))}>
        <Label>Vendedor 1</Label>
        <div style={{ marginTop: 14, fontFamily: T.ui, fontWeight: 800, fontSize: 52, color: T.white, letterSpacing: "-0.015em", lineHeight: 1.05 }}>chega e apresenta</div>
        <div style={{ fontFamily: T.ui, fontWeight: 300, fontSize: 52, color: T.dim, letterSpacing: "-0.015em", lineHeight: 1.1, ...rise(k(to, 17.76, 0.5), 12) }}>imediatamente</div>
      </div>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map(([at, txt], i) => {
          const p = k(to, at, 0.4);
          return (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 24px", borderRadius: 16, background: T.glass, border: `1.5px solid ${T.glassEdge}`, ...rise(p, 16), transform: `translateX(${(1 - p) * 40}px)` }}>
              <Label color={T.gray} size={16}>{`0${i + 1}`}</Label>
              <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 36, color: T.white }}>{txt}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ——— F · a pergunta do segundo vendedor (tipografia grande) ———
export const Question: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 26.88, 30.4);
  if (g <= 0) return null;
  const words: [number, string, boolean?][] = [
    [26.88, "O"],
    [27.04, "que"],
    [27.13, "atualmente"],
    [28.24, "mais"],
    [28.56, "te"],
    [28.72, "incomoda", true],
    [29.52, "neste"],
    [29.92, "espaço?"],
  ];
  return (
    <div style={{ position: "absolute", left: 140, top: 250, width: 860, opacity: g }}>
      <Label style={rise(k(to, 26.5, 0.5), 10)}>Vendedor 2 · pergunta</Label>
      <div style={{ marginTop: 10, fontFamily: T.ui, fontWeight: 300, fontSize: 150, lineHeight: 0.8, color: T.blue, opacity: k(to, 26.7, 0.5) }}>“</div>
      <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 76, lineHeight: 1.08, letterSpacing: "-0.02em", color: T.white, display: "flex", flexWrap: "wrap", columnGap: 22 }}>
        {words.map(([at, w, hi]) => {
          const p = k(to, at, 0.45);
          return (
            <span key={w} style={{ display: "inline-block", color: hi ? T.blueHi : T.white, textShadow: hi ? `0 0 30px ${T.glow}` : undefined, ...rise(p, 20) }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ——— G · a resposta do cliente: tempo perdido, espaço mal organizado ———
const bez = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
  const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};
const ROUTES = [
  [[90, 330], [420, 40], [260, 420], [640, 120]],
  [[640, 380], [300, 120], [820, 60], [960, 330]],
  [[150, 120], [700, 400], [380, 30], [900, 140]],
  [[960, 120], [520, 440], [760, 200], [120, 380]],
];
export const Answer: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 31.0, 37.75);
  if (g <= 0) return null;
  const head = k(to, 31.0, 0.5);
  const plan = k(to, 32.64, 1.0, Easing.inOut(Easing.cubic));
  const people = k(to, 33.2, 0.6);
  const clock = k(to, 34.4, 0.6);
  const bad = k(to, 36.8, 0.5);
  const tt = to - M(33.2);
  return (
    <div style={{ position: "absolute", left: 720, top: 120, width: 1080, opacity: g }}>
      <div style={rise(head)}>
        <Label>O cliente responde</Label>
      </div>
      <Glass style={{ left: 0, top: 60, width: 1080, height: 520, overflow: "hidden" }}>
        <svg width={1080} height={520} viewBox="0 0 1080 520" style={{ position: "absolute", inset: 0 }}>
          <g fill="none" stroke={T.white} strokeOpacity={0.35} strokeWidth={2} opacity={plan}>
            <rect x={40} y={30} width={1000} height={460} rx={8} />
            <path d="M380 30v150M380 260v230M720 30v120M720 230v260" />
            {[[90, 80], [210, 80], [90, 380], [210, 380], [470, 120], [580, 340], [800, 90], [900, 330]].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width={80} height={46} rx={4} opacity={Math.min(1, Math.max(0, plan * 3 - i * 0.25))} />
            ))}
          </g>
          {/* percursos emaranhados dos funcionários (tempo perdido) */}
          <g fill="none" stroke={T.blue} strokeWidth={2.2} strokeDasharray="10 12" strokeLinecap="round" opacity={people}>
            {ROUTES.map((r, i) => (
              <path key={i} d={`M${r[0][0]} ${r[0][1]}C${r[1][0]} ${r[1][1]} ${r[2][0]} ${r[2][1]} ${r[3][0]} ${r[3][1]}`} strokeDashoffset={-tt * 60} strokeOpacity={0.75} />
            ))}
          </g>
          {ROUTES.map((r, i) => {
            const u = ((tt * 0.22 + i * 0.27) % 1 + 1) % 1;
            const [x, y] = bez(r[0], r[1], r[2], r[3], u);
            return <circle key={i} cx={x} cy={y} r={9} fill={T.blueHi} opacity={people} style={{ filter: `drop-shadow(0 0 8px ${T.glow})` }} />;
          })}
        </svg>
        <Label color={T.blueHi} style={{ position: "absolute", left: 40, bottom: 26, opacity: people }}>Funcionários</Label>
      </Glass>
      {/* relógio: tempo perdido */}
      <div style={{ position: "absolute", left: 0, top: 620, display: "flex", alignItems: "center", gap: 26, ...rise(clock) }}>
        <svg width={92} height={92} viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth={1.5} strokeLinecap="round">
          <circle cx={12} cy={12} r={9.5} />
          <path d={`M12 12L${12 + 6.5 * Math.sin(tt * 3.4)} ${12 - 6.5 * Math.cos(tt * 3.4)}`} stroke={T.blueHi} strokeWidth={1.8} />
          <path d={`M12 12L${12 + 4 * Math.sin(tt * 0.3)} ${12 - 4 * Math.cos(tt * 0.3)}`} />
        </svg>
        <div>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 48, color: T.white, letterSpacing: "-0.01em" }}>Muito tempo perdido</div>
          <div style={{ fontFamily: T.ui, fontWeight: 500, fontSize: 30, color: T.dim, marginTop: 4, ...rise(bad, 10) }}>
            porque o espaço está <span style={{ color: T.blueHi, fontWeight: 700 }}>mal organizado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ——— H · revelação ———
export const Reveal: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 38.56, 40.72, 0.4, 0.3);
  if (g <= 0) return null;
  const words: [number, string, boolean?][] = [
    [38.86, "Percebes"],
    [39.92, "a"],
    [40.08, "diferença?", true],
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", columnGap: 26, opacity: g }}>
      {words.map(([at, w, hi]) => {
        const p = k(to, at, 0.35);
        return (
          <span key={w} style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 104, letterSpacing: "-0.025em", color: hi ? T.blueHi : T.white, textShadow: hi ? `0 0 40px ${T.glow}` : "0 10px 40px rgba(0,0,0,0.6)", display: "inline-block", ...rise(p, 26), transform: `translateY(${(1 - p) * 26}px) scale(${hi ? 0.92 + 0.08 * p : 1})` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ——— I · split screen: o que cada vendedor viu ———
export const Split: React.FC<{ to: number }> = ({ to }) => {
  const open = k(to, 40.6, 0.7, Easing.bezier(0.65, 0, 0.35, 1)) * (1 - interpolate(to, [M(53.45), M(53.45) + 0.6], [0, 1], { easing: Easing.bezier(0.65, 0, 0.35, 1), ...clamp }));
  if (open <= 0) return null;
  const r1 = k(to, 40.78, 0.5);
  const v1 = k(to, 43.31, 0.5);
  const r2 = k(to, 44.83, 0.5);
  const prob = k(to, 47.36, 0.5);
  const obra = k(to, 49.31, 0.4);
  const strike = k(to, 49.81, 0.35);
  const sol = k(to, 50.95, 0.5);
  const chart = k(to, 51.57, 1.2, Easing.inOut(Easing.cubic));
  const dim1 = 1 - 0.55 * k(to, 44.83, 0.6);
  const pts = [[0, 150], [90, 138], [180, 126], [260, 96], [340, 70], [420, 30], [500, 6]];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
  return (
    <>
      {/* painel direito (metade do ecrã) */}
      <div style={{ position: "absolute", left: 960 + (1 - open) * 960, top: 0, width: 960, height: 1080, background: "linear-gradient(180deg, rgba(8,11,17,0.94), rgba(5,7,11,0.97))", borderLeft: `2px solid ${T.blue}`, boxShadow: `-30px 0 80px rgba(0,0,0,0.6), -1px 0 24px ${T.glow}` }}>
        <div style={{ position: "absolute", left: 90, top: 120, width: 780 }}>
          <div style={{ opacity: dim1, ...rise(r1) }}>
            <Label>Vendedor 1</Label>
            <div style={{ marginTop: 12, fontFamily: T.ui, fontWeight: 300, fontSize: 36, color: T.dim }}>estava apenas preocupado em</div>
            <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 54, color: T.white, letterSpacing: "-0.015em", ...rise(v1, 14) }}>vender a remodelação</div>
          </div>
          <div style={{ height: 1.5, background: T.line, margin: "46px 0", width: 780 * r2 }} />
          <div style={rise(r2)}>
            <Label color={T.blueHi}>Vendedor 2</Label>
            <div style={{ marginTop: 12, fontFamily: T.ui, fontWeight: 300, fontSize: 36, color: T.dim }}>percebeu que o problema era</div>
            <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 64, color: T.blueHi, letterSpacing: "-0.02em", textShadow: `0 0 34px ${T.glow}`, ...rise(prob, 14) }}>a produtividade</div>
          </div>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ position: "relative", padding: "12px 26px", borderRadius: 999, border: `1.5px solid ${T.line}`, fontFamily: T.ui, fontWeight: 700, fontSize: 30, color: T.gray, ...rise(obra, 12) }}>
              obra
              <div style={{ position: "absolute", left: 14, right: 14, top: "50%", height: 3, background: T.white, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} />
            </div>
            <svg width={60} height={24} style={{ opacity: sol }}>
              <path d="M2 12h44M36 4l10 8-10 8" fill="none" stroke={T.blue} strokeWidth={2} strokeLinecap="round" />
            </svg>
            <div style={{ padding: "12px 26px", borderRadius: 999, background: T.blue, fontFamily: T.ui, fontWeight: 800, fontSize: 30, color: "#fff", boxShadow: `0 0 30px ${T.glow}`, ...rise(sol, 12) }}>solução para o negócio</div>
          </div>
          {/* o negócio melhora */}
          <svg width={520} height={170} viewBox="-10 -10 520 170" style={{ marginTop: 34, opacity: Math.min(1, chart * 4), overflow: "visible" }}>
            <path d="M0 150H500" stroke={T.line} strokeWidth={1.5} />
            <path d={`${d}L500 150L0 150Z`} fill="url(#g21)" opacity={chart} />
            <path d={d} fill="none" stroke={T.blueHi} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} />
            <defs>
              <linearGradient id="g21" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={T.blue} stopOpacity={0.35} />
                <stop offset="1" stopColor={T.blue} stopOpacity={0} />
              </linearGradient>
            </defs>
          </svg>
          <Label color={T.blueHi} style={{ marginTop: 10, opacity: chart }}>O negócio melhora</Label>
        </div>
      </div>
    </>
  );
};

// ——— J · clímax: o que separa um vendedor comum de um profissional estratégico ———
export const Climax: React.FC<{ to: number; layer: "behind" | "front" }> = ({ to, layer }) => {
  const g = win(to, 53.68, 57.82, 0.5, 0.35);
  if (g <= 0) return null;
  const line = k(to, 54.56, 0.6);
  const l = k(to, 55.12, 0.5);
  const r = k(to, 56.34, 0.5);
  const hit = k(to, 56.96, 0.25);
  if (layer === "behind")
    return (
      <div style={{ position: "absolute", inset: 0, opacity: g }}>
        <div style={{ position: "absolute", left: 958, top: 540 - 470 * line, width: 4, height: 940 * line, background: T.blue, boxShadow: `0 0 30px ${T.glow}` }} />
      </div>
    );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: g }}>
      <Label color={T.white} style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", ...rise(k(to, 53.84, 0.5), 10) }}>O que separa</Label>
      <div style={{ position: "absolute", left: 90, top: 380, width: 600, textAlign: "right", ...rise(l, 20), opacity: l * (1 - 0.45 * r) }}>
        <div style={{ fontFamily: T.ui, fontWeight: 300, fontSize: 40, color: T.gray }}>um vendedor</div>
        <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 92, letterSpacing: "-0.025em", color: T.gray }}>comum</div>
      </div>
      <div style={{ position: "absolute", left: 1230, top: 380, width: 620, ...rise(r, 20) }}>
        <div style={{ fontFamily: T.ui, fontWeight: 300, fontSize: 40, color: T.white }}>um profissional</div>
        <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 92, letterSpacing: "-0.025em", color: T.blueHi, textShadow: `0 0 ${30 + 30 * hit}px ${T.glow}`, transform: `scale(${1 + 0.04 * hit * (1 - k(to, 57.2, 0.5))})`, transformOrigin: "0 50%" }}>estratégico</div>
      </div>
    </div>
  );
};

// ——— K · frase-chave ———
export const KeyLine: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 57.92, 61.95, 0.45, 0.35);
  if (g <= 0) return null;
  const rows: [number, string, boolean?][][] = [
    [[57.92, "Não"], [58.24, "vendas"], [58.96, "soluções"]],
    [[59.68, "antes"], [60.0, "de"], [60.16, "compreenderes"]],
    [[60.49, "o"], [61.04, "real"], [61.36, "problema.", true]],
  ];
  return (
    <div style={{ position: "absolute", left: 130, top: 270, width: 980, opacity: g }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", columnGap: 24, fontFamily: T.ui, fontWeight: i === 1 ? 300 : 800, fontSize: i === 2 ? 108 : 92, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
          {row.map(([at, w, hi]) => {
            const p = k(to, at, 0.4);
            return (
              <span key={w} style={{ display: "inline-block", color: hi ? T.blueHi : i === 1 ? T.dim : T.white, textShadow: hi ? `0 0 44px ${T.glow}` : undefined, ...rise(p, 24) }}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
