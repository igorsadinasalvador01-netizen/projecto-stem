import React from "react";
import { AbsoluteFill } from "remotion";
import { Glass, useClock } from "../kit/Kit";
import { FONTS } from "../kit/fonts2";

// Vídeo 13 — "Vendedor herbívoro vs carnívoro" · SAVANA SÓBRIA (horizontal)
// Documentário ao entardecer em tons de areia e argila (paleta minimalista, sem cores
// exageradas): silhuetas em carvão, capim em paralaxe e
// fichas de campo em vidro. Fraunces (serifa de documentário) + Space Grotesk (dados).
export const T13 = {
  skyTop: "#24211F",
  skyMid: "#8A6B52",
  skyLow: "#D8BC92",
  sun: "#F6EBD6",
  gold: "#D9B26A",
  amber: "#C8874E",
  terra: "#A86450",
  olive: "#8E9A5B",
  oliveDeep: "#4F5734",
  red: "#C25A4E",
  ink: "#F6F1E8",
  dim: "rgba(246,241,232,0.72)",
  night: "#161311",
  sil: "#1B1816",
  glass: "rgba(28,24,21,0.52)",
  edge: "rgba(240,225,200,0.38)",
  serif: FONTS.fraunces,
  sans: FONTS.grotesk,
} as const;

// ——— céu, sol e horizonte (com "luz" de 0 = dia dourado a 1 = anoitecer) ———
export const Sky: React.FC<{ dusk?: number; sunY?: number; sunX?: number }> = ({ dusk = 0, sunY = 62, sunX = 62 }) => {
  const { t } = useClock();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${T13.skyTop} 0%, ${T13.skyMid} ${46 - dusk * 10}%, ${T13.skyLow} ${78 - dusk * 14}%, #EAD9BC 100%)` }}>
      <div style={{ position: "absolute", left: `${sunX}%`, top: `${sunY + dusk * 10}%`, width: 360, height: 360, marginLeft: -180, marginTop: -180, borderRadius: "50%", background: `radial-gradient(circle, ${T13.sun} 0%, #EAD3AA 40%, rgba(220,190,150,0) 70%)`, filter: "blur(2px)" }} />
      <div style={{ position: "absolute", left: `${sunX}%`, top: `${sunY + dusk * 10}%`, width: 1400, height: 1400, marginLeft: -700, marginTop: -700, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,220,190,0.35), transparent 60%)" }} />
      {/* poeira dourada no ar */}
      {Array.from({ length: 26 }).map((_, k) => (
        <div key={k} style={{ position: "absolute", left: `${(k * 37 + t * (4 + (k % 5))) % 100}%`, top: `${20 + ((k * 53) % 60)}%`, width: 4 + (k % 3) * 2, height: 4 + (k % 3) * 2, borderRadius: "50%", background: "rgba(245,235,215,0.55)", opacity: 0.3 + 0.4 * Math.sin(t * 1.3 + k), filter: "blur(1px)" }} />
      ))}
      <AbsoluteFill style={{ background: `rgba(24,21,19,${dusk * 0.55})` }} />
    </AbsoluteFill>
  );
};

// ——— terreno e capim em camadas (paralaxe): colinas ao longe na cor da atmosfera,
// chão próximo em silhueta. `y` = linha do chão onde os animais pousam as patas. ———
const blades = (t: number, seed: number, base: number, h: number, n: number, width: number) =>
  Array.from({ length: n })
    .map((_, i) => {
      const x = (i / n) * width - 30;
      const hh = h * (0.55 + (((i * 7919 + seed) % 97) / 97) * 0.9);
      const lean = Math.sin(t * 1.4 + i * 0.7 + seed) * 5;
      return `M${x} ${base} Q${x + 5 + lean / 2} ${base - hh / 2} ${x + 9 + lean} ${base - hh} Q${x + 11} ${base - hh / 2} ${x + 20} ${base}Z`;
    })
    .join(" ");
export const Ground: React.FC<{ y?: number; drift?: number; color?: string; far?: string }> = ({ y = 870, drift = 1, color = T13.sil, far = "#5E5248" }) => {
  const { t } = useClock();
  return (
    <>
      <svg width={1980} height={170} viewBox="0 0 1980 170" style={{ position: "absolute", left: -((t * 5 * drift) % 30), top: y - 150 }}>
        <path d="M0 100 C 280 62, 560 128, 880 92 S 1480 120, 1980 78 L1980 170 L0 170Z" fill={far} opacity={0.62} />
        <path d={blades(t, 3, 152, 22, 150, 1980)} fill={far} opacity={0.8} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(180deg, ${color}, #11100E)` }} />
      <svg width={1980} height={90} viewBox="0 0 1980 90" style={{ position: "absolute", left: -((t * 12 * drift) % 30), top: y - 70 }}>
        <path d={blades(t * 1.1, 11, 74, 42, 170, 1980)} fill={color} />
      </svg>
    </>
  );
};
// posição "top" para um animal de largura w pousar as patas no chão y (vista lateral)
export const feet = (kind: "cow" | "lion", w: number, y: number) => y + 10 - (kind === "cow" ? w * 0.6 * (132 / 144) : w * 0.62 * (152 / 162));

// ——— silhuetas ———
export const Cow: React.FC<{ w: number; color?: string; graze?: number; thin?: number; style?: React.CSSProperties }> = ({ w, color = T13.sil, graze = 0, thin = 0, style }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 240 144" style={{ overflow: "visible", ...style }}>
    <g transform={`scale(1, ${1 - thin * 0.12}) translate(0, ${thin * 14})`}>
      <path d="M22 50 C 22 38, 34 30, 48 30 L 150 28 C 168 28, 178 36, 182 46 L 184 56 L 170 96 L 172 132 L 160 132 L 157 98 L 142 98 L 141 132 L 129 132 L 127 96 L 72 96 L 70 132 L 58 132 L 56 96 L 46 94 L 44 132 L 32 132 L 31 90 C 22 84, 18 68, 22 50 Z" fill={color} />
      <path d="M22 52 C 10 62, 8 82, 13 98" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
      <circle cx={13} cy={100} r={5} fill={color} />
    </g>
    {/* pescoço e cabeça (a pastar) */}
    <g transform={`rotate(${graze * 14} 178 46)`}>
      <path d="M176 40 C 190 44, 198 60, 204 74 C 210 88, 220 100, 222 110 C 224 120, 214 126, 204 120 C 196 114, 190 104, 184 92 C 178 80, 170 64, 168 52Z" fill={color} />
      <path d="M190 52 L 202 42 L 198 56Z" fill={color} />
      <path d="M184 44 L 186 32" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);
const MANE: [number, number, number][] = [
  [64, 60, 30], [60, 36, 20], [70, 106, 15], [54, 102, 15], [42, 46, 20], [36, 66, 19], [46, 86, 20], [66, 94, 20], [86, 82, 19], [88, 58, 20], [78, 38, 18],
];
export const Lion: React.FC<{ w: number; color?: string; roar?: number; style?: React.CSSProperties }> = ({ w, color = T13.sil, roar = 0, style }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 260 162" style={{ overflow: "visible", ...style }}>
    <path d="M90 48 C 120 40, 190 38, 222 50 C 236 56, 240 72, 236 88 C 234 98, 230 104, 226 108 L 230 146 C 231 150, 226 152, 218 152 L 214 150 L 210 112 L 200 112 L 202 146 C 203 150, 198 152, 190 152 L 188 150 L 184 110 C 160 112, 130 112, 112 108 L 110 146 C 111 150, 106 152, 98 152 L 96 150 L 92 106 L 86 104 L 84 146 C 85 150, 80 152, 72 152 L 70 150 L 68 100 C 60 90, 62 64, 90 48 Z" fill={color} />
    <path d="M232 60 C 252 66, 258 92, 250 114" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
    <ellipse cx={250} cy={120} rx={6} ry={9} fill={color} />
    <g transform={`rotate(${-roar * 6} 64 62)`}>
      {MANE.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} />
      ))}
      <path d="M58 30 C 54 20, 64 16, 68 26 Z" fill={color} />
      <path d="M46 52 C 32 52, 18 58, 12 68 C 9 74, 12 78, 20 78 L 44 76 Z" fill={color} />
      <path d={`M42 74 L 16 ${78 + roar * 10} C 14 ${82 + roar * 12}, 22 ${86 + roar * 12}, 30 ${84 + roar * 8} L 48 80 Z`} fill={color} />
    </g>
  </svg>
);
// rochedo (kopje) onde o leão observa
export const Rock: React.FC<{ w: number; color?: string; style?: React.CSSProperties }> = ({ w, color = T13.sil, style }) => (
  <svg width={w} height={(w * 200) / 420} viewBox="0 0 420 200" style={style}>
    <path d="M0 200 L 18 132 C 30 96, 70 70, 126 64 L 290 58 C 330 58, 362 76, 384 108 L 420 200 Z" fill={color} />
    <path d="M150 64 L 168 80 L 200 76 M300 60 L 320 86" stroke="rgba(235,220,195,0.12)" strokeWidth={3} fill="none" />
  </svg>
);
export const Acacia: React.FC<{ w: number; color?: string; style?: React.CSSProperties }> = ({ w, color = T13.sil, style }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 300 210" style={style}>
    <path d="M146 210 L 150 120 L 120 90 M150 120 L 186 86 M150 140 L 150 210" stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" />
    <ellipse cx={150} cy={74} rx={140} ry={26} fill={color} />
    <ellipse cx={110} cy={62} rx={70} ry={18} fill={color} />
    <ellipse cx={196} cy={60} rx={74} ry={18} fill={color} />
  </svg>
);
export const Fence: React.FC<{ x: number; y: number; w: number; glow?: number }> = ({ x, y, w, glow = 0 }) => (
  <svg width={w} height={120} viewBox={`0 0 ${w} 120`} style={{ position: "absolute", left: x, top: y, overflow: "visible", filter: glow ? `drop-shadow(0 0 ${12 * glow}px rgba(217,178,106,${glow}))` : undefined }}>
    {Array.from({ length: Math.floor(w / 90) + 1 }).map((_, i) => (
      <rect key={i} x={i * 90} y={0} width={10} height={120} rx={3} fill={glow ? `rgba(217,178,106,${0.4 + glow * 0.6})` : T13.sil} />
    ))}
    <rect x={0} y={24} width={w} height={8} fill={glow ? `rgba(217,178,106,${0.4 + glow * 0.6})` : T13.sil} />
    <rect x={0} y={64} width={w} height={8} fill={glow ? `rgba(217,178,106,${0.4 + glow * 0.6})` : T13.sil} />
  </svg>
);

// ——— ficha de campo em vidro (o "lower third" do documentário) ———
export const FieldCard: React.FC<{ title: string; rows: [string, string, string?][]; p: number; x: number; y: number; w?: number; accent?: string }> = ({ title, rows, p, x, y, w = 520, accent = T13.gold }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
    <Glass tint={T13.glass} edge={T13.edge} radius={26} style={{ padding: "24px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: T13.sans, fontWeight: 700, fontSize: 18, letterSpacing: "0.22em", color: accent }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: accent }} />
        {title}
      </div>
      {rows.map(([k, v, c], i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginTop: i ? 10 : 16, paddingTop: i ? 10 : 0, borderTop: i ? "1px solid rgba(240,225,200,0.18)" : "none", fontFamily: T13.sans, fontSize: 24 }}>
          <span style={{ color: T13.dim }}>{k}</span>
          <span style={{ color: c ?? T13.ink, fontWeight: 700, textAlign: "right" }}>{v}</span>
        </div>
      ))}
    </Glass>
  </div>
);
