import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../kit/Kit";
import { M } from "../v21/cuts21";
import { C, IN, OUT } from "./theme22";

// Vídeo 22 · peças de vidro e tipografia. `to` = tempo da montagem; `at` = tempo ORIGINAL da palavra.
export const k = (to: number, at: number, d = 0.42, e = OUT) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: e, ...clamp });
export const kout = (to: number, at: number, d = 0.26) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: IN, ...clamp });
// janela: entra no início da palavra `a`, sai a partir do início da palavra `b`
export const win = (to: number, a: number, b: number, din = 0.42, dout = 0.26) => k(to, a, din) * (1 - kout(to, b, dout));

// ——— vidro VAZIO e transparente ———
// Sem cor, sem desfoque, sem brilhos: só o contorno fino do vidro, o fio de luz na aresta de cima e
// uma sombra discreta para o destacar do cenário. O cenário vê-se nítido através dele.
export const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  border: "1.5px solid rgba(255,255,255,0.30)",
  boxShadow: "0 40px 80px -44px rgba(0,0,0,0.7), inset 0 1.5px 0 rgba(255,255,255,0.40)",
};
export const Glass: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  r?: number;
  o?: number;
  p?: number;
  dim?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, w, h, r = 28, o = 1, p = 1, dim = 0, style, children }) => {
  const op = o * Math.min(1, p * 1.6);
  if (op <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: r,
        opacity: op * (1 - 0.45 * dim),
        transform: `translateY(${(1 - p) * 30}px) scale(${0.93 + 0.07 * p})`,
        ...GLASS,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ——— tipografia dinâmica ———
type Fill = string; // cor sólida (branco, azul, verde, vermelho)
const fillStyle = (f: Fill): React.CSSProperties => ({ color: f });

// palavra condensada (Bebas Neue) com três entradas: "slam" (cai de grande), "rise" (sobe por
// uma máscara), "wipe" (revela da esquerda)
export const Big: React.FC<{ text: string; size: number; fill?: Fill; p: number; mode?: "slam" | "rise" | "wipe"; style?: React.CSSProperties; strike?: number }> = ({
  text,
  size,
  fill = C.ink,
  p,
  mode = "rise",
  style,
  strike = 0,
}) => {
  if (p <= 0) return null;
  const inner: React.CSSProperties = {
    fontFamily: C.display,
    fontSize: size,
    lineHeight: 0.92,
    letterSpacing: mode === "slam" ? `${0.01 + (1 - p) * 0.08}em` : "0.01em",
    whiteSpace: "nowrap",
    paddingTop: size * 0.06,
    ...fillStyle(fill),
  };
  const strikeBar = strike > 0 && (
    <div style={{ position: "absolute", left: "-3%", right: "-3%", top: "50%", height: Math.max(6, size * 0.075), borderRadius: 6, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} />
  );
  if (mode === "slam")
    return (
      <div style={{ position: "relative", display: "inline-block", width: "max-content", opacity: Math.min(1, p * 2.2), transform: `scale(${1 + (1 - p) * 0.5})`, transformOrigin: "50% 60%", filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined, ...style }}>
        <div style={inner}>{text}</div>
        {strikeBar}
      </div>
    );
  if (mode === "wipe")
    return (
      <div style={{ position: "relative", display: "inline-block", width: "max-content", clipPath: `inset(-20% ${(1 - p) * 102}% -20% -2%)`, ...style }}>
        <div style={inner}>{text}</div>
        {strikeBar}
      </div>
    );
  return (
    <div style={{ position: "relative", display: "inline-block", width: "max-content", overflow: "hidden", paddingBottom: size * 0.02, ...style }}>
      <div style={{ ...inner, transform: `translateY(${(1 - p) * 105}%)` }}>{text}</div>
      {strikeBar}
    </div>
  );
};

export const Wide: React.FC<{ children: React.ReactNode; size?: number; color?: string; p?: number; style?: React.CSSProperties }> = ({ children, size = 28, color = C.ink, p = 1, style }) => (
  <div style={{ fontFamily: C.wide, fontWeight: 600, fontSize: size, letterSpacing: "0.04em", textTransform: "uppercase", color, whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 14}px)`, ...style }}>{children}</div>
);
export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; p?: number; style?: React.CSSProperties }> = ({ children, size = 18, color = C.mute, p = 1, style }) => (
  <div style={{ fontFamily: C.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color, whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -12}px)`, ...style }}>{children}</div>
);
// etiqueta com ponto de cor (dentro de um painel de vidro)
export const Tag: React.FC<{ color: string; text: string; p?: number; size?: number }> = ({ color, text, p = 1, size = 18 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 10}px)` }}>
    <div style={{ width: size * 0.6, height: size * 0.6, borderRadius: 99, background: color }} />
    <div style={{ fontFamily: C.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.18em", color: C.ink2 }}>{text}</div>
  </div>
);

// ——— ícones (traço) ———
const PATHS: Record<string, string> = {
  person: "M12 11.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2zM4.5 20.5c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7",
  building: "M4 21V5.5l8-3V21M12 21h8V9.5l-8-3M7 9h2M7 13h2M7 17h2M15 12.5h2M15 16.5h2",
  table: "M3 9h18M5 9l-1.5 9M19 9l1.5 9M8 9V6.5a1.5 1.5 0 0 1 3 0V9M13 9V6.5a1.5 1.5 0 0 1 3 0V9",
  tag: "M3.5 12.2V4.5h7.7l9.3 9.3-7.7 7.7zM8 8.5h.01",
  search: "M10.5 17.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM15.5 15.5 21 21",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9",
  euro: "M17 6.5a7 7 0 1 0 0 11M4 10h9M4 14h9",
  star: "M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z",
  tool: "M14.5 6.5a4 4 0 0 0 5 5L12 19l-3.5 1 1-3.5 7.5-7.5a4 4 0 0 0-2.5-2.5zM5 5l4 4",
  chat: "M4 5h16v11H9l-5 4z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  bookmark: "M6 3.5h12v17l-6-4-6 4z",
  arrow: "M4 12h15M13 6l6 6-6 6",
  down: "M12 4v15M6 13l6 6 6-6",
  bolt: "M13 2.5 5 13.5h6l-1 8 8-11h-6z",
  handshake: "M2.5 11.5 7 7l4 2 3-2 7.5 4.5M7 7l-4.5 4.5L8 17l2-1.5M14 7l-4 3.5a1.6 1.6 0 0 0 2.2 2.3L14 11.5l4.5 3.5-3 3M10 16l2 2",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.3a3.5 3.5 0 0 1 0 6.4M18.5 14.4c1.8.8 3 2.7 3 5.6",
};
export const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 24, color = C.ink, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, overflow: "visible" }}>
    <path d={PATHS[d] ?? d} />
  </svg>
);
// ícone num círculo de vidro vazio (só o traço do ícone tem cor)
export const Orb: React.FC<{ d: string; color: string; size?: number; p?: number }> = ({ d, color, size = 64, p = 1 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...GLASS,
      boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.40)",
      transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -40}deg)`,
      opacity: Math.min(1, p * 1.6),
    }}
  >
    <Ico d={d} size={size * 0.5} color={color} sw={2} />
  </div>
);
