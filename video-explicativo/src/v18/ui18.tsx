import React from "react";
import { interpolate } from "remotion";
import { clamp, EZ } from "../kit/Kit";
import { M } from "./cuts18";
import { T18 as T } from "./theme18";

// ——— tempo: marcas no tempo ORIGINAL da fala, interpoladas no tempo da montagem ———
export const ez = (t: number, a: number, b: number, e = EZ.inOut) => {
  const A = M(a);
  const B = Math.max(M(b), A + Math.min(b - a, 0.12));
  return interpolate(M(t), [A, B], [0, 1], { easing: e, ...clamp });
};

// entrada "pop" da referência: escala + desfoque + opacidade (p = mola 0→1)
export const pop = (p: number, d = 18): React.CSSProperties => ({
  opacity: interpolate(p, [0, 0.35], [0, 1], clamp),
  transform: `translateY(${(1 - p) * d}px) scale(${0.86 + 0.14 * p})`,
  filter: p < 0.98 ? `blur(${(1 - Math.min(1, p)) * 10}px)` : undefined,
});

// cartão branco de app (sombra suave, cantos generosos)
export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number; edge?: string }> = ({ style, children, radius = 24, edge }) => (
  <div style={{ position: "relative", background: T.white, borderRadius: radius, border: `1.5px solid ${edge ?? "rgba(10,26,47,0.06)"}`, boxShadow: "0 26px 50px -22px rgba(10,26,47,0.45), 0 3px 10px rgba(10,26,47,0.10)", overflow: "hidden", ...style }}>{children}</div>
);
// cartão escuro (azul-marinho vidrado)
export const Dark: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number; edge?: string }> = ({ style, children, radius = 22, edge }) => (
  <div style={{ position: "relative", background: "linear-gradient(160deg, rgba(15,36,64,0.92), rgba(10,26,47,0.9))", borderRadius: radius, border: `1.5px solid ${edge ?? "rgba(255,255,255,0.12)"}`, boxShadow: "0 30px 60px -26px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", overflow: "hidden", ...style }}>{children}</div>
);
// etiqueta mono em maiúsculas (micro-título por cima dos cartões)
export const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; glow?: boolean; style?: React.CSSProperties }> = ({ children, color = T.gray, size = 15, glow, style }) => (
  <div style={{ fontFamily: T.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.26em", textTransform: "uppercase", color, textShadow: glow ? "0 0 12px rgba(255,255,255,1), 0 0 4px rgba(255,255,255,1)" : undefined, ...style }}>{children}</div>
);
export const Serif: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = T.ink, style }) => (
  <span style={{ fontFamily: T.serif, fontStyle: "italic", fontWeight: 400, fontSize: size, color, letterSpacing: "-0.01em", ...style }}>{children}</span>
);
// pill azul (destaque da referência)
export const Pill: React.FC<{ children: React.ReactNode; color?: string; text?: string; size?: number; icon?: string; style?: React.CSSProperties }> = ({ children, color = T.blue, text = "#fff", size = 22, icon, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.3}px ${size * 0.62}px`, borderRadius: size * 0.5, background: color, color: text, fontFamily: T.ui, fontWeight: 800, fontSize: size, whiteSpace: "nowrap", boxShadow: "0 14px 28px -14px rgba(10,26,47,0.55)", ...style }}>
    {icon && <Icon d={icon} size={size * 0.95} color={text} />}
    {children}
  </div>
);
// chip branco com ícone (as etiquetas da órbita, tags)
export const Tag: React.FC<{ children: React.ReactNode; icon?: string; color?: string; size?: number; bg?: string; style?: React.CSSProperties }> = ({ children, icon, color = T.blue, size = 22, bg = T.white, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.34}px ${size * 0.66}px`, borderRadius: 999, background: bg, border: "1.5px solid rgba(10,26,47,0.06)", boxShadow: "0 16px 30px -16px rgba(10,26,47,0.5)", fontFamily: T.ui, fontWeight: 800, fontSize: size, color: T.ink, whiteSpace: "nowrap", ...style }}>
    {icon && <Icon d={icon} size={size * 1.05} color={color} />}
    {children}
  </div>
);

export const I: Record<string, string> = {
  ruler: "M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2",
  plan: "M3 4h18v16H3zM3 9h7v11M10 4v5h11M14 13h7",
  helmet: "M4 16a8 8 0 0 1 16 0zM2 16h20v3H2zM12 6v4M9 8.5l1.5 2.5M15 8.5 13.5 11",
  chat: "M4 5h16v11H9l-5 4z",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.6-1.6M12 6.5V8M12 16v1.5",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6 6 18",
  alert: "M12 3 2 20h20L12 3zM12 10v4M12 17h.01",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-7 8-7s8 3 8 7",
  handshake: "M2 12l4-4 4 2 3-2 5 1 4 3M6 8l-2 9 3 1M18 9l2 8-3 1M9 14l2 2M12 13l2 2M15 12l2 2",
  question: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.6 2.6 0 0 1 5 1c0 2-2.5 2.2-2.5 4M12 17h.01",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  calc: "M5 3h14v18H5zM8 7h8M8 12h2M12 12h2M16 12h.01M8 16h2M12 16h2M16 16h.01",
  heart: "M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z",
  follow: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c0-3.9 3.1-6.5 7-6.5 1.5 0 2.9.4 4 1M18 15v6M15 18h6",
  share: "M4 12.5 20 4l-5 16-3.5-6.5L4 12.5zm7.5 1L20 4",
};
export const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number; fill?: string }> = ({ d, size = 24, color = T.blue, sw = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={I[d] ?? d} />
  </svg>
);
// caixa de ícone (como os ícones de app da referência)
export const AppIcon: React.FC<{ d: string; color?: string; size?: number }> = ({ d, color = T.blue, size = 54 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 20px -10px ${color}` }}>
    <Icon d={d} size={size * 0.58} color="#fff" />
  </div>
);
// texto a ser escrito (máquina de escrever) com cursor
export const Typed: React.FC<{ text: string; k: number; cursor?: boolean; color?: string }> = ({ text, k, cursor = true, color = T.blue }) => {
  const n = Math.round(text.length * Math.max(0, Math.min(1, k)));
  return (
    <span>
      {text.slice(0, n)}
      {cursor && <span style={{ display: "inline-block", width: 3, height: "1em", marginLeft: 2, background: color, verticalAlign: "-0.12em", opacity: k < 1 || Math.floor(n / 3) % 2 === 0 ? 1 : 0.2 }} />}
    </span>
  );
};
