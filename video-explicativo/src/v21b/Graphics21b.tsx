import React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "../kit/Kit";
import { M } from "../v21/cuts21";
import { L } from "./theme21b";

// Vídeo 21 v2 · gráficos no estilo claro da referência. Marcas no tempo ORIGINAL de cada palavra
// (src/v21/words21.json): cada elemento entra no início EXATO da palavra a que corresponde.
const OUT = Easing.bezier(0.16, 1, 0.3, 1); // entrada rápida que assenta
const IN = Easing.bezier(0.5, 0, 0.75, 0);
export const k = (to: number, at: number, d = 0.38, e = OUT) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: e, ...clamp });
export const win = (to: number, a: number, b: number, din = 0.38, dout = 0.22) => k(to, a, din) * (1 - interpolate(to, [M(b) - dout, M(b)], [0, 1], { easing: IN, ...clamp }));
// "pop" da referência: sobe, cresce de 0,94 e perde o desfoque
export const pop = (p: number, dy = 16): React.CSSProperties => ({ opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * dy}px) scale(${0.94 + 0.06 * p})`, filter: p < 0.97 ? `blur(${(1 - p) * 6}px)` : undefined });

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; edge?: string }> = ({ style, children, edge }) => (
  <div style={{ position: "absolute", background: L.card, borderRadius: 22, border: `1.5px solid ${edge ?? L.line}`, boxShadow: L.shadow, ...style }}>{children}</div>
);
export const Mono: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = L.gray, size = 16, style }) => (
  <span style={{ fontFamily: L.mono, fontSize: size, letterSpacing: "0.06em", color, ...style }}>{children}</span>
);
export const PillTag: React.FC<{ children: React.ReactNode; tone: "blue" | "red" | "green" | "ink"; size?: number; style?: React.CSSProperties }> = ({ children, tone, size = 24, style }) => {
  const c = { blue: [L.blue, L.blueSoft], red: [L.red, L.redSoft], green: [L.green, L.greenSoft], ink: [L.ink2, "rgba(14,17,22,0.06)"] }[tone];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: c[1], color: c[0], fontFamily: L.ui, fontWeight: 700, fontSize: size, whiteSpace: "nowrap", ...style }}>{children}</span>;
};
const PATHS: Record<string, string> = {
  person: "M12 11.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zM4.5 20.5c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7",
  briefcase: "M3.5 8h17v11.5h-17zM9 8V5.2h6V8M3.5 13h17",
  building: "M4 21V5.5l8-3V21M12 21h8V9.5l-8-3M7 9h2M7 13h2M7 17h2M15 12.5h2M15 16.5h2",
  door: "M6 21V3h12v18M3 21h18M14 12h.01",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9",
  euro: "M17 6.5a7 7 0 1 0 0 11M4 10h9M4 14h9",
  star: "M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z",
  tool: "M14.5 6.5a4 4 0 0 0 5 5L12 19l-3.5 1 1-3.5 7.5-7.5a4 4 0 0 0-2.5-2.5zM5 5l4 4",
  chat: "M4 5h16v11H9l-5 4z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  bookmark: "M6 3.5h12v17l-6-4-6 4z",
  arrow: "M4 12h15M13 6l6 6-6 6",
};
export const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 24, color = L.ink, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={PATHS[d] ?? d} />
  </svg>
);
const Bubble: React.FC<{ d: string; color?: string; bg?: string; size?: number }> = ({ d, color = L.blue, bg = L.blueSoft, size = 46 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Ico d={d} size={size * 0.52} color={color} />
  </div>
);

// ——— texto GRANDE por trás da pessoa (destaques) ———
export const BigWord: React.FC<{ to: number; at: number; until: number; text: string; size: number; y?: number; tone?: "grad" | "gray"; strikeAt?: number; exitUp?: boolean }> = ({ to, at, until, text, size, y = 300, tone = "grad", strikeAt, exitUp }) => {
  const p = k(to, at, 0.55);
  const out = interpolate(to, [M(until) - 0.3, M(until)], [0, 1], { easing: IN, ...clamp });
  if (p <= 0 || out >= 1) return null;
  const strike = strikeAt !== undefined ? k(to, strikeAt, 0.35) : 0;
  const style: React.CSSProperties =
    tone === "grad"
      ? { backgroundImage: L.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
      : { color: "rgba(14,17,22,0.16)" };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out), transform: `translateY(${(1 - p) * 30 - (exitUp ? out * 60 : 0)}px) scale(${1.08 - 0.08 * p})`, filter: p < 0.97 || out > 0.03 ? `blur(${(1 - p) * 14 + out * 10}px)` : undefined }}>
      <div style={{ position: "relative", fontFamily: L.ui, fontWeight: 800, fontSize: size, letterSpacing: "-0.045em", lineHeight: 1, whiteSpace: "nowrap", ...style }}>
        {text}
        {strike > 0 && <div style={{ position: "absolute", left: "-2%", right: "-2%", top: "54%", height: size * 0.06, borderRadius: 8, background: L.red, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} />}
      </div>
    </div>
  );
};

// ——— A/B · os dois vendedores ———
export const Sellers: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 0.24, 6.42);
  if (g <= 0) return null;
  const side = (i: 0 | 1) => {
    const p = k(to, i === 0 ? 0.24 : 0.56);
    const tag = k(to, i === 0 ? 4.4 : 6.08);
    return (
      <Card key={i} style={{ left: i === 0 ? 150 : 1380, top: 300, width: 390, padding: 26, ...pop(p) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Bubble d="person" color={i === 0 ? L.ink2 : L.blue} bg={i === 0 ? "rgba(14,17,22,0.06)" : L.blueSoft} size={56} />
          <div>
            <div style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 30, color: L.ink }}>{`Vendedor ${i + 1}`}</div>
            <Mono>reunião · 10:00</Mono>
          </div>
        </div>
        <div style={{ marginTop: 20, height: 1.5, background: L.line }} />
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, ...pop(tag, 10) }}>
          <span style={{ fontFamily: L.ui, fontSize: 24, color: L.gray }}>tenta</span>
          <PillTag tone={i === 0 ? "red" : "green"}>{i === 0 ? "vender" : "compreender"}</PillTag>
        </div>
      </Card>
    );
  };
  const room = k(to, 2.08);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: g }}>
      {side(0)}
      {side(1)}
      <Card style={{ left: 760, top: 66, padding: "12px 22px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12, ...pop(room, 10) }}>
        <Ico d="door" size={24} color={L.blue} />
        <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 24, color: L.ink }}>Sala de reunião</span>
      </Card>
    </div>
  );
};

// destaque "conquistou o cliente"
export const WinBadge: React.FC<{ to: number }> = ({ to }) => {
  const p = k(to, 8.08, 0.4) * (1 - interpolate(to, [M(9.6) - 0.22, M(9.6)], [0, 1], clamp));
  if (p <= 0) return null;
  return (
    <Card style={{ left: 1290, top: 720, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14, borderRadius: 18, ...pop(p) }} edge="rgba(22,160,90,0.35)">
      <div style={{ width: 40, height: 40, borderRadius: 20, background: L.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ico d="check" size={24} color="#fff" sw={2.6} />
      </div>
      <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 28, color: L.ink }}>
        conquistou <span style={{ color: L.green }}>o cliente</span>
      </span>
    </Card>
  );
};

// ——— E · o pedido do empresário (planta a desenhar-se) ———
export const Brief: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 11.53, 15.85);
  if (g <= 0) return null;
  const r1 = k(to, 11.92);
  const r2 = k(to, 13.2);
  const tag = k(to, 14.0);
  const plan = k(to, 14.0, 1.3, Easing.inOut(Easing.cubic));
  const P = (d: string, at = 0, len = 1) => <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, (plan - at) / len))} />;
  return (
    <Card style={{ left: 150, top: 200, width: 900, padding: 34, opacity: g, ...pop(k(to, 11.53)) }}>
      <Mono>Pedido de orçamento</Mono>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...pop(r1, 10) }}>
          <Bubble d="briefcase" />
          <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 32, color: L.ink }}>Empresário</span>
        </div>
        <div style={{ opacity: r2 }}>
          <Ico d="arrow" size={34} color={L.gray} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...pop(r2, 10) }}>
          <Bubble d="building" />
          <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 32, color: L.ink }}>Empresa</span>
        </div>
      </div>
      <div style={{ marginTop: 26, height: 1.5, background: L.line }} />
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14, ...pop(tag, 10) }}>
        <span style={{ fontFamily: L.ui, fontSize: 26, color: L.gray }}>para</span>
        <PillTag tone="blue">remodelação do espaço</PillTag>
      </div>
      <svg width={830} height={300} viewBox="0 0 830 300" style={{ marginTop: 24, display: "block" }} fill="none" stroke={L.ink2} strokeOpacity={0.55} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        {P("M6 6H824V294H6Z", 0, 0.45)}
        {P("M300 6V130M300 190V294", 0.25, 0.3)}
        {P("M560 6V100M560 160V294M560 160H824", 0.35, 0.3)}
        <g stroke={L.blue} strokeOpacity={0.85}>
          {[40, 150, 40, 150].map((x, i) => P(`M${x} ${i < 2 ? 40 : 200}h80v46h-80z`, 0.5 + i * 0.07, 0.25))}
          {P("M360 210h70v50h-70z", 0.65, 0.25)}
          {P("M620 200h160v60h-160z", 0.72, 0.25)}
        </g>
      </svg>
    </Card>
  );
};

// ——— F · o primeiro vendedor apresenta logo tudo ———
export const Pitch: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 15.92, 23.1);
  if (g <= 0) return null;
  const rows: [number, string, string][] = [
    [19.52, "Materiais", "box"],
    [20.48, "Preço", "euro"],
    [21.28, "Vantagens", "star"],
    [22.32, "Serviço", "tool"],
  ];
  return (
    <Card style={{ left: 870, top: 150, width: 900, padding: 36, opacity: g, ...pop(k(to, 16.16)) }}>
      <Mono>Vendedor 1</Mono>
      <div style={{ marginTop: 10, fontFamily: L.ui, fontWeight: 800, fontSize: 46, color: L.ink, letterSpacing: "-0.02em" }}>
        chega e apresenta <span style={{ fontFamily: L.serif, fontStyle: "italic", fontWeight: 400, color: L.blue, ...pop(k(to, 17.76), 8), display: "inline-block" }}>imediatamente</span>
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map(([at, txt, ic], i) => {
          const p = k(to, at, 0.32);
          return (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 18px", borderRadius: 16, background: i === rows.length - 1 && p > 0 ? L.blueSoft : "rgba(14,17,22,0.03)", ...pop(p, 12) }}>
              <Bubble d={ic} size={46} />
              <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 32, color: L.ink }}>{txt}</span>
              <span style={{ marginLeft: "auto" }}>
                <Mono>{`0${i + 1}`}</Mono>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ——— G · o segundo vendedor pergunta, calmo ———
export const Calm: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 23.38, 26.75);
  if (g <= 0) return null;
  return (
    <Card style={{ left: 150, top: 330, width: 420, padding: 28, opacity: g, ...pop(k(to, 23.38)) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Bubble d="chat" size={52} />
        <div>
          <div style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 30, color: L.ink }}>Vendedor 2</div>
          <Mono>apenas pergunta</Mono>
        </div>
      </div>
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <span style={pop(k(to, 25.44), 8)}>
          <PillTag tone="blue">calma</PillTag>
        </span>
        <span style={pop(k(to, 26.0), 8)}>
          <PillTag tone="blue">friamente</PillTag>
        </span>
      </div>
    </Card>
  );
};

// ——— blocos de texto à moda da referência ("A ideia continua a ser *a minha.*") ———
type TW = [number, string, ("serif" | "light" | "bold")?];
export const TextBlock: React.FC<{ to: number; a: number; b: number; rows: TW[][]; left?: number; top?: number; size?: number; label?: string }> = ({ to, a, b, rows, left = 130, top = 260, size = 84, label }) => {
  const g = win(to, a, b, 0.3, 0.25);
  if (g <= 0) return null;
  return (
    <div style={{ position: "absolute", left, top, width: 980, opacity: g }}>
      {label && <Mono style={{ display: "block", marginBottom: 18, ...pop(k(to, a - 0.15), 8) }}>{label}</Mono>}
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, alignItems: "baseline", lineHeight: 1.12 }}>
          {row.map(([at, w, st]) => {
            const p = k(to, at, 0.42);
            const serif = st === "serif";
            return (
              <span key={w + at} style={{ display: "inline-block", fontFamily: serif ? L.serif : L.ui, fontStyle: serif ? "italic" : "normal", fontWeight: serif ? 400 : st === "bold" ? 800 : 300, fontSize: serif ? size * 1.28 : size, letterSpacing: serif ? "-0.01em" : "-0.03em", color: serif ? L.blue : st === "bold" ? L.ink : L.ink2, ...pop(p, 18) }}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ——— I · a resposta do cliente (conversa a escrever-se ao ritmo da fala) ———
const ANSWER: [number, string][] = [
  [32.64, "Os"], [32.8, "meus"], [33.2, "funcionários"], [33.84, "perdem"], [34.4, "muito"], [34.8, "tempo"], [35.36, "porque"], [35.84, "o"], [36.0, "espaço"], [36.56, "está"], [36.8, "mal"], [37.12, "organizado."],
];
export const Chat: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 30.88, 38.5);
  if (g <= 0) return null;
  const typing = k(to, 31.52, 0.25) * (1 - k(to, 32.64, 0.15));
  const stat = k(to, 34.8);
  const bad = k(to, 36.8);
  const dots = (M(31.52) - to) * 6;
  return (
    <div style={{ position: "absolute", left: 880, top: 170, width: 900, opacity: g }}>
      <Card style={{ position: "relative", padding: 30, ...pop(k(to, 30.88)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Bubble d="person" size={52} />
          <div>
            <div style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 30, color: L.ink }}>Cliente</div>
            <Mono>responde</Mono>
          </div>
        </div>
        <div style={{ marginTop: 22, padding: "22px 26px", borderRadius: "22px 22px 22px 6px", background: "rgba(14,17,22,0.045)", minHeight: 70 }}>
          {typing > 0.05 && (
            <div style={{ display: "flex", gap: 8, opacity: typing }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: L.gray, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(dots + i * 1.2)) }} />
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 11, fontFamily: L.ui, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: L.ink }}>
            {ANSWER.map(([at, w]) => {
              const p = k(to, at, 0.18);
              const neg = ["perdem", "tempo", "mal", "organizado."].includes(w);
              return (
                <span key={w} style={{ opacity: p, color: neg && p > 0.5 ? L.red : L.ink }}>
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </Card>
      <div style={{ marginTop: 24, display: "flex", gap: 18 }}>
        <Card style={{ position: "relative", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, ...pop(stat) }} edge="rgba(214,69,69,0.3)">
          <Bubble d="clock" color={L.red} bg={L.redSoft} />
          <div>
            <div style={{ fontFamily: L.ui, fontWeight: 800, fontSize: 30, color: L.ink }}>Tempo perdido</div>
            <Mono>funcionários</Mono>
          </div>
        </Card>
        <Card style={{ position: "relative", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, ...pop(bad) }} edge="rgba(214,69,69,0.3)">
          <Bubble d="building" color={L.red} bg={L.redSoft} />
          <div>
            <div style={{ fontFamily: L.ui, fontWeight: 800, fontSize: 30, color: L.ink }}>Espaço mal organizado</div>
            <Mono>segundo o cliente</Mono>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ——— K · o que cada um viu ———
export const Focus: React.FC<{ to: number }> = ({ to }) => {
  const g1 = win(to, 41.04, 47.0);
  const g2 = win(to, 44.88, 47.0);
  if (g1 <= 0 && g2 <= 0) return null;
  const v = k(to, 43.31);
  return (
    <>
      {g1 > 0 && (
        <Card style={{ left: 120, top: 330, width: 470, padding: 28, opacity: g1, ...pop(k(to, 41.04)) }}>
          <Mono>Vendedor 1</Mono>
          <div style={{ marginTop: 8, fontFamily: L.ui, fontSize: 26, color: L.gray }}>preocupado apenas em</div>
          <div style={{ marginTop: 10, ...pop(v, 10) }}>
            <PillTag tone="red" size={28}>vender a remodelação</PillTag>
          </div>
        </Card>
      )}
      {g2 > 0 && (
        <Card style={{ left: 1330, top: 330, width: 470, padding: 28, opacity: g2, ...pop(k(to, 44.88)) }} edge="rgba(22,160,90,0.35)">
          <Mono color={L.green}>Vendedor 2</Mono>
          <div style={{ marginTop: 8, fontFamily: L.ui, fontSize: 26, color: L.gray }}>percebeu que o problema era…</div>
        </Card>
      )}
    </>
  );
};

// ——— M · em vez da obra, a solução para o negócio ———
export const Solution: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 48.51, 53.45);
  if (g <= 0) return null;
  const obra = k(to, 49.81);
  const strike = k(to, 50.27, 0.3);
  const sol = k(to, 50.95);
  const chart = k(to, 51.57, 1.1, Easing.inOut(Easing.cubic));
  const pts = [[0, 170], [110, 158], [210, 140], [310, 110], [410, 78], [510, 40], [620, 8]];
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
  return (
    <div style={{ position: "absolute", left: 130, top: 200, width: 900, opacity: g }}>
      <Mono style={pop(k(to, 48.51), 8)}>Em vez de vender apenas</Mono>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ position: "relative", ...pop(obra, 10) }}>
          <PillTag tone="ink" size={34}>a obra</PillTag>
          <span style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 4, borderRadius: 2, background: L.red, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} />
        </span>
        <span style={{ opacity: sol }}>
          <Ico d="arrow" size={40} color={L.gray} />
        </span>
        <span style={pop(sol, 10)}>
          <PillTag tone="green" size={34}>a solução</PillTag>
        </span>
      </div>
      <Card style={{ position: "relative", marginTop: 34, width: 720, padding: 30, ...pop(k(to, 51.39)) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: L.ui, fontWeight: 800, fontSize: 34, color: L.ink }}>Negócio</span>
          <span style={{ fontFamily: L.ui, fontWeight: 700, fontSize: 26, color: L.green, opacity: chart }}>a melhorar</span>
        </div>
        <svg width={660} height={200} viewBox="-10 -10 660 200" style={{ marginTop: 14, overflow: "visible" }}>
          <path d="M0 180H640" stroke={L.line} strokeWidth={2} />
          <path d={`${d}L620 180L0 180Z`} fill="url(#g21b)" opacity={chart} />
          <path d={d} fill="none" stroke={L.green} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} />
          <defs>
            <linearGradient id="g21b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={L.green} stopOpacity={0.22} />
              <stop offset="1" stopColor={L.green} stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
      </Card>
    </div>
  );
};

// ——— P · "guarda isto" ———
export const Keep: React.FC<{ to: number }> = ({ to }) => {
  const g = win(to, 62.32, 65.2);
  if (g <= 0) return null;
  return (
    <Card style={{ left: 150, top: 360, padding: "22px 28px", display: "flex", alignItems: "center", gap: 16, opacity: g, ...pop(k(to, 62.32)) }}>
      <Bubble d="bookmark" />
      <span style={{ fontFamily: L.ui, fontWeight: 800, fontSize: 34, color: L.ink }}>Guarda isto</span>
    </Card>
  );
};
