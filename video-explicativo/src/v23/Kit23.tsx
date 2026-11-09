import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../kit/Kit";
import { C, IN, OUT } from "../v22/theme22";
import { M } from "./cuts23";

// Vídeo 23 · peças de vidro e tipografia (evolução do vídeo 22). `to` = tempo da montagem;
// `at` = tempo ORIGINAL da palavra (src/v23/words23.json, inícios acertados ao som real).
export const k = (to: number, at: number, d = 0.42, e = OUT) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: e, ...clamp });
export const kout = (to: number, at: number, d = 0.26) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: IN, ...clamp });
export const win = (to: number, a: number, b: number, din = 0.42, dout = 0.26) => k(to, a, din) * (1 - kout(to, b, dout));

// ——— vidro VAZIO e transparente (sem cor, sem desfoque, sem brilhos) ———
export const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  border: "1.5px solid rgba(255,255,255,0.30)",
  boxShadow: "0 40px 80px -44px rgba(0,0,0,0.7), inset 0 1.5px 0 rgba(255,255,255,0.40)",
};
// entrada em 3D: o painel roda ligeiramente sobre si e assenta (perspetiva real, sem distorção no fim)
export const Glass: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  r?: number;
  o?: number;
  p?: number;
  dim?: number;
  from?: "left" | "right" | "below";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, w, h, r = 28, o = 1, p = 1, dim = 0, from = "below", style, children }) => {
  const op = o * Math.min(1, p * 1.6);
  if (op <= 0.001) return null;
  const q = 1 - p;
  const rot = from === "left" ? `rotateY(${q * 22}deg) translateX(${-q * 60}px)` : from === "right" ? `rotateY(${-q * 22}deg) translateX(${q * 60}px)` : `rotateX(${q * 16}deg) translateY(${q * 40}px)`;
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
        transform: `perspective(1600px) ${rot} scale(${0.94 + 0.06 * p})`,
        transformOrigin: from === "left" ? "0% 50%" : from === "right" ? "100% 50%" : "50% 100%",
        ...GLASS,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ——— tipografia dinâmica ———
// Bebas Neue com quatro entradas: "slam" (cai de grande, com desfoque de movimento), "rise" (sobe
// por uma máscara), "wipe" (revela da esquerda) e "letters" (letra a letra em cascata)
export const Big: React.FC<{ text: string; size: number; fill?: string; p: number; mode?: "slam" | "rise" | "wipe" | "letters"; style?: React.CSSProperties; strike?: number }> = ({
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
    color: fill,
  };
  const strikeBar = strike > 0 && <div style={{ position: "absolute", left: "-3%", right: "-3%", top: "50%", height: Math.max(6, size * 0.075), borderRadius: 6, background: C.red, transformOrigin: "0 50%", transform: `scaleX(${strike})` }} />;
  const box: React.CSSProperties = { position: "relative", display: "inline-block", width: "max-content" };
  if (mode === "letters") {
    const ch = [...text];
    const n = ch.length;
    const s = Math.min(0.07, 0.55 / Math.max(1, n));
    return (
      <div style={{ ...box, ...style }}>
        <div style={{ ...inner, display: "flex" }}>
          {ch.map((c, i) => {
            const pl = Math.min(1, Math.max(0, (p - i * s) / Math.max(0.2, 1 - (n - 1) * s)));
            const e = OUT(pl);
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, e * 1.8), transform: `translateY(${(1 - e) * 0.5}em) scale(${1 + (1 - e) * 0.35})`, filter: e < 0.97 ? `blur(${(1 - e) * 6}px)` : undefined }}>
                {c}
              </span>
            );
          })}
        </div>
        {strikeBar}
      </div>
    );
  }
  if (mode === "slam")
    return (
      <div style={{ ...box, opacity: Math.min(1, p * 2.2), transform: `scale(${1 + (1 - p) * 0.5})`, transformOrigin: "50% 60%", filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined, ...style }}>
        <div style={inner}>{text}</div>
        {strikeBar}
      </div>
    );
  if (mode === "wipe")
    return (
      <div style={{ ...box, clipPath: `inset(-20% ${(1 - p) * 102}% -20% -2%)`, ...style }}>
        <div style={inner}>{text}</div>
        {strikeBar}
      </div>
    );
  return (
    <div style={{ ...box, overflow: "hidden", paddingBottom: size * 0.02, ...style }}>
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
export const Tag: React.FC<{ color: string; text: string; p?: number; size?: number }> = ({ color, text, p = 1, size = 18 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 10}px)` }}>
    <div style={{ width: size * 0.6, height: size * 0.6, borderRadius: 99, background: color }} />
    <div style={{ fontFamily: C.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.18em", color: C.ink2 }}>{text}</div>
  </div>
);

const PATHS: Record<string, string> = {
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.3a3.5 3.5 0 0 1 0 6.4M18.5 14.4c1.8.8 3 2.7 3 5.6",
  ruler: "M3 16.5 16.5 3 21 7.5 7.5 21zM7 12.5l1.5 1.5M9.5 10l2 2M12 7.5l1.5 1.5M14.5 5l2 2",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6 6 18",
  cut: "M6 6.5a2.5 2.5 0 1 0 0 .01M6 17.5a2.5 2.5 0 1 0 0 .01M8.2 7.8 20 18M8.2 16.2 20 6",
  tool: "M14.5 6.5a4 4 0 0 0 5 5L12 19l-3.5 1 1-3.5 7.5-7.5a4 4 0 0 0-2.5-2.5zM5 5l4 4",
  cart: "M3 4h2.5l2.2 11h10.6l2.2-8H7M10 20a1 1 0 1 0 0 .01M17 20a1 1 0 1 0 0 .01",
  redo: "M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.3 0-2.4-.5-3-1.5M12 6.5v11",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9",
  bookmark: "M6 3.5h12v17l-6-4-6 4z",
  arrow: "M4 12h15M13 6l6 6-6 6",
  down: "M12 4v15M6 13l6 6 6-6",
  helmet: "M3.5 17h17M5 17v-3a7 7 0 0 1 14 0v3M10 7.5V5.5h4v2M12 7v4",
  bolt: "M13 2.5 5 13.5h6l-1 8 8-11h-6z",
  alert: "M12 3.5 2.5 20h19zM12 10v4.5M12 17.5v.01",
};
export const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 24, color = C.ink, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, overflow: "visible" }}>
    <path d={PATHS[d] ?? d} />
  </svg>
);
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
