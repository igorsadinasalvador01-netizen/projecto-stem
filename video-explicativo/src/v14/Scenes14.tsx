import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { clamp, Enter, EZ, Glass, Kinetic, KW, Mesh, SP, useClock } from "../kit/Kit";
import { Carousel3D, PRODUCT_AT, PRODUCTS } from "./Carousel3D";
import { T14 as T } from "./theme14";

// ——— peças do tema ———
export const Bg14: React.FC = () => (
  <Mesh
    base={`linear-gradient(180deg, ${T.paper}, #E7ECF0)`}
    grid="rgba(18,20,23,0.035)"
    gridSize={90}
    blobs={[
      { c: "rgba(143,167,188,0.28)", x: 18, y: 14, r: 900 },
      { c: "rgba(255,255,255,0.9)", x: 80, y: 40, r: 800, s: 0.2 },
      { c: "rgba(62,92,118,0.10)", x: 70, y: 86, r: 1000, s: 0.3 },
    ]}
  />
);
const G: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number; tint?: string; edge?: string }> = ({ style, children, radius = 36, tint = T.glass, edge = T.edge }) => (
  <Glass tint={tint} edge={edge} radius={radius} blur={22} style={{ boxShadow: `${T.shadow}, inset 0 1px 0 rgba(255,255,255,0.9)`, ...style }}>
    {children}
  </Glass>
);
type Row = Parameters<typeof Kinetic>[0]["rows"][number];
const row = (words: KW[], size = 76, color: string = T.ink): Row => ({ words, size, font: T.display, color, weight: 600, spacing: "-0.03em" });
const small = (words: KW[], size = 44, color: string = T.dim): Row => ({ words, size, font: T.body, color, weight: 600, spacing: "-0.01em" });
const Title: React.FC<{ rows: Row[]; out: number; offset: number; top?: number }> = ({ rows, out, offset, top = 220 }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top }}>
    <Kinetic offset={offset} out={out} rows={rows} />
  </div>
);
const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = T.steel }) => (
  <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color }}>{children}</div>
);
const Check: React.FC<{ on: number; size?: number }> = ({ on, size = 44 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: on > 0.5 ? T.sage : "rgba(18,20,23,0.06)", border: `2px solid ${on > 0.5 ? T.sage : T.line}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + on * 0.2})` }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - Math.min(1, on))} />
    </svg>
  </div>
);
const pin = (p: number) => ({ opacity: interpolate(p, [0, 0.35], [0, 1], clamp), transform: `translateY(${(1 - p) * 50}px) scale(${0.94 + p * 0.06})` });

// ——— 1 · gancho: "vende qualquer coisa?" + carrossel 3D a rodar ———
export const S1: React.FC = () => {
  const off = 0;
  const { sp } = useClock(off);
  const c = sp(0.15, SP.soft);
  const ok = sp(4.8, SP.pop);
  return (
    <Enter kind="none">
      <Bg14 />
      <div style={{ position: "absolute", left: 0, top: 560, opacity: interpolate(c, [0, 0.4], [0, 1], clamp), transform: `translateY(${(1 - c) * 120}px) scale(${0.9 + c * 0.1})` }}>
        <Carousel3D width={1080} height={900} offset={off} idle />
      </div>
      <Title offset={off} out={2.75} rows={[small([{ w: "O vendedor", at: 0.64 }], 46), row([{ w: "vende", at: 1.28 }, { w: "qualquer", at: 1.6, color: T.steel }, { w: "coisa?", at: 1.84, color: T.steel }], 84)]} />
      <Title offset={off} out={99} rows={[small([{ w: "O bom vendedor está", at: 2.96 }], 46), row([{ w: "preparado", at: 3.76, color: T.steel }, { w: "para vender", at: 4.08 }, { w: "qualquer coisa.", at: 4.48 }], 72)]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1440, display: "flex", justifyContent: "center", ...pin(ok) }}>
        <G radius={999} style={{ padding: "14px 30px 14px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <Check on={ok} size={48} />
          <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 34, color: T.ink }}>preparado</span>
        </G>
      </div>
    </Enter>
  );
};

// ——— 2 · o segredo: cadeado abre → mentalidade de vendas ———
const Padlock: React.FC<{ open: number }> = ({ open }) => (
  <svg width={400} height={480} viewBox="0 0 100 120" style={{ overflow: "visible" }}>
    <path d={`M28 ${54 - open * 22} V36 a22 22 0 0 1 44 0 V${54 - open * 0}`} stroke="#2B3036" strokeWidth={9} fill="none" strokeLinecap="round" transform={`rotate(${open * -24} 72 ${54})`} />
    <rect x={14} y={52} width={72} height={60} rx={14} fill="#2B3036" />
    <rect x={14} y={52} width={72} height={22} rx={10} fill="rgba(255,255,255,0.08)" />
    <circle cx={50} cy={78} r={7} fill={open > 0.5 ? T.sage : "#C9CED3"} />
    <rect x={47} y={82} width={6} height={14} rx={3} fill={open > 0.5 ? T.sage : "#C9CED3"} />
  </svg>
);
const Mind: React.FC<{ t: number }> = ({ t }) => (
  <svg width={480} height={480} viewBox="0 0 120 120">
    <path d="M70 108 V92 h12 a8 8 0 0 0 8-8 V72 l8-3 -8-14 c0-26-18-42-40-42 C27 13 14 31 14 52 c0 14 7 24 16 31 V108" stroke={T.ink} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <g transform={`rotate(${t * 60} 52 50)`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={49} y={29} width={6} height={9} rx={2} fill={T.steel} transform={`rotate(${i * 45} 52 50)`} />
      ))}
      <circle cx={52} cy={50} r={15} fill="none" stroke={T.steel} strokeWidth={6} />
      <circle cx={52} cy={50} r={5} fill={T.steel} />
    </g>
  </svg>
);
export const S2: React.FC = () => {
  const off = 5.2;
  const { t, sp, ez } = useClock(off);
  const card = sp(5.3, SP.soft);
  const open = ez(7.5, 7.95, 0, 1, EZ.out);
  const swap = ez(8.4, 8.8);
  const mind = sp(8.6, SP.pop);
  return (
    <Enter kind="rise">
      <Bg14 />
      <Title offset={off} out={6.72} rows={[small([{ w: "Qual é o", at: 5.28 }], 46), row([{ w: "segredo", at: 5.68, color: T.steel }, { w: "disso?", at: 6.0 }], 92)]} />
      <Title offset={off} out={99} rows={[small([{ w: "O segredo é criar", at: 6.96 }], 46), row([{ w: "uma mentalidade", at: 8.64 }, { w: "de vendas.", at: 9.76, color: T.steel }], 76)]} />
      <div style={{ position: "absolute", left: 140, top: 560, width: 800, height: 800, ...pin(card) }}>
        <G radius={56} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 40, top: 36 }}>
            <Label>{swap > 0.5 ? "MENTALIDADE" : "SEGREDO"}</Label>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - swap, transform: `scale(${1 - swap * 0.3}) translateY(${Math.sin(t * 2) * 4}px)` }}>
            <Padlock open={open} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(mind, [0, 0.3], [0, 1], clamp), transform: `scale(${0.7 + mind * 0.3})` }}>
            <Mind t={t} />
          </div>
          {/* brilho ao abrir */}
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 700, height: 700, marginLeft: -350, marginTop: -350, borderRadius: "50%", background: "radial-gradient(circle, rgba(143,167,188,0.45), transparent 60%)", opacity: ez(7.6, 8.0) * (1 - ez(8.6, 9.6)) }} />
        </G>
      </div>
    </Enter>
  );
};

// ——— 3 · roteiro de vendas pronto que atende qualquer segmento ———
export const STEPS = ["Abertura", "Diagnóstico", "Apresentação", "Objeções", "Fechamento"];
export const Roteiro: React.FC<{ from: number; gap?: number; sp: (a: number, c?: (typeof SP)[keyof typeof SP]) => number; slot?: React.ReactNode; slotOpen?: number }> = ({ from, gap = 0.28, sp, slot, slotOpen = 0 }) => (
  <G radius={44} style={{ padding: "40px 46px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Label>ROTEIRO DE VENDAS</Label>
      <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 24, color: T.dim }}>mental · pronto</span>
    </div>
    <div style={{ position: "relative", marginTop: 26 }}>
      <div style={{ position: "absolute", left: 27, top: 30, bottom: 30, width: 3, background: T.line }} />
      {STEPS.map((s, i) => {
        const p = sp(from + i * gap, SP.snap);
        return (
          <div key={s} style={{ ...pin(p) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "16px 0" }}>
              <div style={{ width: 58, height: 58, borderRadius: 29, background: p > 0.5 ? T.steel : T.mist, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontWeight: 600, fontSize: 26, position: "relative" }}>{i + 1}</div>
              <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 44, color: T.ink }}>{s}</span>
            </div>
            {i === 2 && slot && <div style={{ height: slotOpen * 150, overflow: "hidden", marginLeft: 84 }}>{slot}</div>}
          </div>
        );
      })}
    </div>
  </G>
);
export const S3: React.FC = () => {
  const off = 10.2;
  const { sp } = useClock(off);
  const segs = ["Varejo", "Imóveis", "Agro", "Tecnologia", "Automotivo", "Saúde", "Serviços"];
  return (
    <Enter kind="wipe">
      <Bg14 />
      <Title offset={off} out={12.7} rows={[small([{ w: "Eu tenho", at: 10.32 }], 46), row([{ w: "um roteiro", at: 10.8 }, { w: "de vendas", at: 11.28, color: T.steel }, { w: "pronto.", at: 11.76 }], 76)]} />
      <Title offset={off} out={99} rows={[small([{ w: "E ele atende", at: 13.12 }], 46), row([{ w: "qualquer", at: 14.08, color: T.steel }, { w: "segmento.", at: 14.88, color: T.steel }], 80)]} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 520, ...pin(sp(10.5, SP.soft)) }}>
        <Roteiro from={10.9} sp={sp} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1290, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {segs.map((s, k) => {
          const p = sp(13.6 + k * 0.13, SP.pop);
          return (
            <div key={s} style={{ ...pin(p) }}>
              <G radius={999} style={{ padding: "12px 26px" }}>
                <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 30, color: T.steel }}>{s}</span>
              </G>
            </div>
          );
        })}
      </div>
    </Enter>
  );
};

// ——— 4 · "eu vendo…" — carrossel 3D de produtos ———
export const S4: React.FC = () => {
  const off = 15.6;
  const { t, sp } = useClock(off);
  const all = t >= 27.4;
  let cur = 0;
  PRODUCT_AT.forEach((a, i) => {
    if (t >= a - 0.2) cur = i;
  });
  const p = sp(all ? 27.44 : PRODUCT_AT[cur] - 0.2, SP.snap);
  return (
    <Enter kind="zoom">
      <Bg14 />
      <Title offset={off} out={99} top={200} rows={[row([{ w: "Eu vendo", at: 16.0 }], 92)]} />
      <div style={{ position: "absolute", left: 0, top: 360, ...pin(sp(15.7, SP.soft)) }}>
        <Carousel3D width={1080} height={980} offset={off} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1300, textAlign: "center" }}>
        <div key={all ? "all" : cur} style={{ ...pin(p) }}>
          <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.26em", color: T.steel }}>{all ? "∞" : `${String(cur + 1).padStart(2, "0")} / 08`}</div>
          <div style={{ fontFamily: T.display, fontWeight: 600, fontSize: all ? 58 : 68, letterSpacing: "-0.03em", color: all ? T.steel : T.ink, marginTop: 6 }}>{all ? "tudo que você imagina." : PRODUCTS[cur]}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1478, display: "flex", justifyContent: "center", gap: 14 }}>
        {PRODUCTS.map((_, i) => (
          <div key={i} style={{ width: i === cur && !all ? 40 : 12, height: 12, borderRadius: 6, background: all || i <= cur ? T.steel : T.mist }} />
        ))}
      </div>
    </Enter>
  );
};

// ——— 5 · os parâmetros: produto, necessidade, perfil, concorrência ———
const ICONS: Record<string, React.ReactNode> = {
  produto: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v18M4 7.5l8 4.5 8-4.5" />,
  necessidade: <path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z" />,
  perfil: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />,
  concorrencia: <path d="M5 20V10m7 10V4m7 16v-7M3 20h18" />,
};
export const S5: React.FC = () => {
  const off = 28.9;
  const { t, sp, ez } = useClock(off);
  const cards = [
    { k: "produto", l: "Produto", s: "o que você vende", at: 31.28 },
    { k: "necessidade", l: "Necessidade", s: "a dor real do cliente", at: 32.48 },
    { k: "perfil", l: "Perfil", s: "quem é e quem decide", at: 35.44 },
    { k: "concorrencia", l: "Concorrência", s: "com quem você disputa", at: 37.28 },
  ];
  const talk = ez(37.9, 38.3) * (1 - ez(39.35, 39.7));
  const done = sp(39.76, SP.pop);
  return (
    <Enter kind="slide">
      <Bg14 />
      <Title offset={off} out={99} rows={[small([{ w: "Agora, claro…", at: 29.04 }], 46), row([{ w: "eu tenho que", at: 29.84 }, { w: "entender:", at: 30.48, color: T.steel }], 76)]} />
      <div style={{ position: "absolute", left: 70, top: 540, width: 940, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, opacity: 1 - talk * 0.75, transform: `scale(${1 - talk * 0.06})` }}>
        {cards.map((c, i) => {
          const p = sp(29.4 + i * 0.12, SP.snap);
          const on = sp(c.at + 0.1, SP.pop);
          const lit = interpolate(on, [0, 0.6], [0.45, 1], clamp);
          return (
            <div key={c.k} style={{ ...pin(p), opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * lit }}>
              <G radius={36} style={{ height: 330, padding: "34px 34px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: 86, height: 86, borderRadius: 24, background: T.steelSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={T.steel} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      {ICONS[c.k]}
                    </svg>
                  </div>
                  <Check on={on} />
                </div>
                <div style={{ fontFamily: T.display, fontWeight: 600, fontSize: 40, letterSpacing: "-0.03em", color: T.ink, marginTop: 36 }}>{c.l}</div>
                <div style={{ fontFamily: T.body, fontWeight: 600, fontSize: 28, color: T.dim, marginTop: 8 }}>{c.s}</div>
              </G>
            </div>
          );
        })}
      </div>
      {/* com quem você está falando? */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 760, opacity: talk, transform: `translateY(${(1 - talk) * 40}px) scale(${0.92 + talk * 0.08})` }}>
        <G radius={44} style={{ padding: "40px 44px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 65, background: "linear-gradient(145deg, #8FA7BC, #3E5C76)" }} />
            <div style={{ position: "absolute", inset: -10, borderRadius: 75, border: `3px solid ${T.ice}`, opacity: 0.5 + 0.5 * Math.sin(t * 6) }} />
            <svg width={130} height={130} viewBox="0 0 24 24" style={{ position: "absolute", inset: 0 }} fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round">
              {ICONS.perfil}
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: T.display, fontWeight: 600, fontSize: 46, letterSpacing: "-0.03em", color: T.ink, lineHeight: 1.1 }}>Com quem você está falando?</div>
          </div>
        </G>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", ...pin(done) }}>
        <G radius={999} style={{ padding: "14px 34px 14px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <Check on={done} size={48} />
          <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.12em", color: T.ink }}>PARÂMETROS 4/4</span>
        </G>
      </div>
    </Enter>
  );
};

// ——— 6 · saiba quem é o seu público: atinja com precisão ———
export const S6: React.FC = () => {
  const off = 41.3;
  const { sp, ez } = useClock(off);
  const focus = ez(42.2, 42.8);
  const rings = sp(43.1, SP.soft);
  const hit = ez(43.44, 43.9, 0, 1, EZ.in);
  const impact = sp(43.9, SP.pop);
  const cx = 540, cy = 930;
  const cols = 9, rowsN = 9, gap = 96;
  return (
    <Enter kind="iris">
      <Bg14 />
      <Title offset={off} out={99} rows={[small([{ w: "Saiba quem é", at: 41.44 }], 46), row([{ w: "o seu público.", at: 42.16, color: T.steel }], 84)]} />
      {Array.from({ length: cols * rowsN }).map((_, i) => {
        const x = 156 + (i % cols) * gap;
        const y = 560 + Math.floor(i / cols) * gap * 0.82;
        const d = Math.hypot(x - cx, y - cy);
        const inTarget = d < 170;
        const p = sp(41.4 + random(`p${i}`) * 0.6, SP.snap);
        return (
          <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: inTarget ? (focus > 0.5 ? T.steel : T.ice) : T.mist, opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * (inTarget ? 1 : 1 - focus * 0.55), transform: `scale(${p * (inTarget ? 1 + focus * 0.25 : 1 - focus * 0.2)})` }} />
        );
      })}
      {[230, 160, 90].map((r, k) => (
        <div key={r} style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: r, border: `${k === 2 ? 6 : 3}px solid ${T.steel}`, opacity: rings * (0.35 + k * 0.25), transform: `scale(${0.6 + rings * 0.4})` }} />
      ))}
      {/* seta que acerta o centro */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: hit > 0 ? 1 : 0 }}>
        <g transform={`translate(${interpolate(hit, [0, 1], [1100, cx])} ${interpolate(hit, [0, 1], [380, cy])}) rotate(141)`}>
          <path d="M0 0 L120 0" stroke={T.ink} strokeWidth={6} strokeLinecap="round" />
          <path d="M0 0 L22 -12 L22 12 Z" fill={T.ink} />
          <path d="M104 0 l16 -14 M104 0 l16 14" stroke={T.ink} strokeWidth={5} strokeLinecap="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: cx - 60, top: cy - 60, width: 120, height: 120, borderRadius: 60, border: `4px solid ${T.sage}`, opacity: impact * (1 - ez(44.3, 44.9)), transform: `scale(${1 + impact * 1.4})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", ...pin(sp(44.64, SP.pop)) }}>
        <G radius={999} style={{ padding: "14px 34px" }}>
          <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 34, color: T.ink }}>
            mais <span style={{ color: T.sage }}>assertivo</span>
          </span>
        </G>
      </div>
    </Enter>
  );
};

// ——— 7 · característica → benefício → vantagem ———
export const CBV = [
  { k: "C", l: "CARACTERÍSTICA", v: "Fundo triplo de aço", at: 48.4 },
  { k: "B", l: "BENEFÍCIO", v: "Cozinha por igual, sem queimar", at: 50.48 },
  { k: "V", l: "VANTAGEM", v: "Economiza gás e tempo", at: 52.24 },
];
export const S7: React.FC = () => {
  const off = 45.6;
  const { sp } = useClock(off);
  return (
    <Enter kind="flip">
      <Bg14 />
      <Title offset={off} out={99} rows={[small([{ w: "E tenho que", at: 45.76 }], 46), row([{ w: "entender", at: 46.96 }, { w: "o produto.", at: 49.52, color: T.steel }], 76)]} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 500, display: "flex", alignItems: "center", gap: 14, ...pin(sp(46.2, SP.soft)) }}>
        <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 28, color: T.dim }}>exemplo:</span>
        <G radius={999} style={{ padding: "8px 22px" }}>
          <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 28, color: T.ink }}>panela</span>
        </G>
      </div>
      {CBV.map((c, i) => {
        const p = sp(46.3 + i * 0.14, SP.snap);
        const fill = sp(c.at - 0.1, SP.pop);
        return (
          <div key={c.k} style={{ position: "absolute", left: 90, right: 90, top: 600 + i * 270, opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * interpolate(fill, [0, 0.5], [0.5, 1], clamp), transform: `perspective(1600px) rotateX(${(1 - p) * 40}deg) translateY(${(1 - p) * 60}px) scale(${0.97 + fill * 0.03})`, transformOrigin: "50% 0%" }}>
            <G radius={36} style={{ padding: "30px 36px", display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ width: 120, height: 120, borderRadius: 30, background: i === 2 ? T.steel : T.steelSoft, color: i === 2 ? "#fff" : T.steel, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontWeight: 800, fontSize: 60, flexShrink: 0 }}>{c.k}</div>
              <div>
                <Label color={i === 2 ? T.steel : T.dim}>{c.l}</Label>
                <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: 42, color: T.ink, marginTop: 8, lineHeight: 1.15, opacity: interpolate(fill, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - fill) * 30}px)` }}>{c.v}</div>
              </div>
            </G>
          </div>
        );
      })}
    </Enter>
  );
};

// ——— 8 · encaixa tudo no roteiro mental de vendas ———
export const S8: React.FC = () => {
  const off = 53.4;
  const { sp, ez } = useClock(off);
  const slotOpen = ez(53.8, 54.3);
  const slot = (
    <div style={{ display: "flex", gap: 12, paddingBottom: 18 }}>
      {CBV.map((c, i) => {
        const p = sp(54.0 + i * 0.18, SP.pop);
        return (
          <div key={c.k} style={{ ...pin(p) }}>
            <div style={{ padding: "12px 20px", borderRadius: 18, background: i === 2 ? T.steel : T.steelSoft, color: i === 2 ? "#fff" : T.steel, fontFamily: T.body, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap" }}>
              {c.k} · {c.l.charAt(0) + c.l.slice(1).toLowerCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
  return (
    <Enter kind="zoom">
      <Bg14 />
      <Title offset={off} out={99} rows={[small([{ w: "E aí eu vou encaixando", at: 53.44 }], 46), row([{ w: "no meu roteiro", at: 54.48 }, { w: "mental de vendas.", at: 55.2, color: T.steel }], 70)]} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 520, ...pin(sp(53.5, SP.soft)) }}>
        <Roteiro from={53.45} gap={0.05} sp={sp} slot={slot} slotOpen={slotOpen} />
      </div>
    </Enter>
  );
};
