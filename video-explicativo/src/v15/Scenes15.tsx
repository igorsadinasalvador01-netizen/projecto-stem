import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, Enter, EZ, Glass, Kinetic, KW, SP, useClock } from "../kit/Kit";
import { T15 as T } from "./theme15";

// ——— página editorial: preto com foco de luz, filetes champanhe e grão de papel ———
export const Bg15: React.FC = () => {
  const { t } = useClock();
  return (
    <AbsoluteFill style={{ background: T.base }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 760px at ${38 + Math.sin(t * 0.2) * 3}% 42%, rgba(46,196,214,0.12), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(900px 700px at 85% 90%, rgba(244,247,250,0.05), transparent 70%)" }} />
      {[110, 1810].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: 60, bottom: 60, width: 1, background: T.rule }} />
      ))}
      <div style={{ position: "absolute", left: 110, right: 110, top: 60, height: 1, background: T.rule }} />
    </AbsoluteFill>
  );
};
type Row = Parameters<typeof Kinetic>[0]["rows"][number];
const serif = (words: KW[], size = 96, color: string = T.ink, italic = false): Row => ({ words, size, font: T.serif, color, weight: 700, italic, spacing: "-0.01em" });
const Title: React.FC<{ rows: Row[]; out: number; offset: number; x?: number; y?: number; w?: number }> = ({ rows, out, offset, x = 110, y = 110, w = 900 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <Kinetic offset={offset} out={out} rows={rows} align="flex-start" />
  </div>
);
const Caps: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = T.champagne, size = 22 }) => (
  <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: size, letterSpacing: "0.28em", color }}>{children}</div>
);
const pin = (p: number, d = 40) => ({ opacity: interpolate(p, [0, 0.35], [0, 1], clamp), transform: `translateY(${(1 - p) * d}px)` });
const wordSize = (w: string, big: number) => (w.length <= 9 ? big : w.length <= 14 ? big * 0.8 : big * 0.68);

// ——— carta 3D: frente escura (evite) → verso marfim (use) ———
const Card: React.FC<{ bad: string; good: string; flip: number; strike: number; w?: number; h?: number }> = ({ bad, good, flip, strike, w = 820, h = 520 }) => (
  <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 28, background: `linear-gradient(150deg, #16335A, ${T.card} 60%)`, border: `1.5px solid ${T.edge}`, boxShadow: "0 50px 100px -40px rgba(0,0,0,0.9)", padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Caps color={T.brick}>EVITE</Caps>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={T.brick} strokeWidth={2} strokeLinecap="round">
          <circle cx={12} cy={12} r={9} />
          <path d="M5.6 18.4 18.4 5.6" />
        </svg>
      </div>
      <div style={{ position: "relative", alignSelf: "flex-start" }}>
        <span style={{ fontFamily: T.serif, fontWeight: 900, fontSize: wordSize(bad, 150), lineHeight: 1, letterSpacing: "-0.02em", color: T.ink }}>{bad}</span>
        <div style={{ position: "absolute", left: -10, right: -10, top: "54%", height: 10, borderRadius: 5, background: T.brick, transform: `scaleX(${strike})`, transformOrigin: "left" }} />
      </div>
      <div style={{ height: 1, background: T.rule }} />
    </div>
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 28, background: `linear-gradient(150deg, #FFFFFF, ${T.ivory} 60%, #DCE6EF)`, boxShadow: "0 50px 100px -40px rgba(0,0,0,0.9)", padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Caps color={T.champagneDeep}>USE</Caps>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={T.champagneDeep} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={9} />
          <path d="M7.5 12.5l3 3 6-6.5" />
        </svg>
      </div>
      <div style={{ fontFamily: T.serif, fontWeight: 700, fontStyle: "italic", fontSize: wordSize(good, 128), lineHeight: 1.02, letterSpacing: "-0.01em", color: T.inkDark }}>{good}</div>
      <div style={{ height: 1, background: "rgba(10,26,47,0.15)" }} />
    </div>
  </div>
);
const Reason: React.FC<{ text: string; ok: boolean; p: number; out?: number }> = ({ text, ok, p, out = 0 }) => (
  <div style={{ opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (1 - out), transform: `translateX(${(1 - p) * 60 - out * 60}px)` }}>
    <Glass tint={T.glass} edge={T.edge} radius={22} blur={18} style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: ok ? T.green : "rgba(242,92,92,0.18)", border: ok ? "none" : `2px solid ${T.brick}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={ok ? T.inkDark : T.brick} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {ok ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 6l12 12M18 6 6 18" />}
        </svg>
      </div>
      <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 44, color: T.ink }}>{text}</span>
    </Glass>
  </div>
);

// ——— 0 · capa: "jamais use estas 5 palavras" + baralho 3D ———
export const Intro: React.FC = () => {
  const { t, sp } = useClock(0);
  const stamp = sp(1.92, SP.pop);
  return (
    <Enter kind="none">
      <Bg15 />
      <div style={{ position: "absolute", left: 110, top: 150 }}>
        <Caps>GUIA DE MARKETING · Nº 15</Caps>
      </div>
      <Title offset={0} out={99} y={230} w={860} rows={[serif([{ w: "Jamais use", at: 0.24 }], 110), serif([{ w: "essas", at: 1.28 }, { w: "5", at: 1.52, color: T.champagne }, { w: "palavras", at: 1.92, color: T.champagne, italic: true }], 110), serif([{ w: "no seu marketing.", at: 2.4 }], 72, T.dim)]} />
      {/* baralho de cinco cartas viradas para baixo */}
      <div style={{ position: "absolute", left: 1130, top: 250, perspective: 2000 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const p = sp(0.1 + i * 0.09, SP.snap);
          return (
            <div key={i} style={{ position: "absolute", left: i * 14, top: -i * 12, width: 560, height: 360, borderRadius: 24, background: `linear-gradient(150deg, #16335A, ${T.card})`, border: `1.5px solid ${T.edge}`, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `rotateX(${48 - p * 20}deg) rotateZ(${-8 + i * 1.5 + Math.sin(t + i) * 0.4}deg) translateY(${(1 - p) * -200}px)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: T.serif, fontWeight: 900, fontStyle: "italic", fontSize: 120, color: "rgba(46,196,214,0.22)" }}>{i === 4 ? "5" : ""}</span>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 120, top: 80, padding: "10px 34px", border: `6px solid ${T.brick}`, borderRadius: 14, fontFamily: T.body, fontWeight: 800, fontSize: 56, letterSpacing: "0.14em", color: T.brick, opacity: stamp, transform: `rotate(-10deg) scale(${2.2 - stamp * 1.2})` }}>PROIBIDAS</div>
      </div>
    </Enter>
  );
};

// ——— 1–5 · cada palavra: evite → (vira a carta) → use ———
export type Pair = { n: number; bad: string; badAt: number; why: [string, number][]; flip: number; good: string; goodAt: number; gain: [string, number][]; from: number };
export const PAIRS: Pair[] = [
  { n: 1, from: 3.3, bad: "Desconto", badAt: 3.44, why: [["soa genérico", 4.8], ["desvaloriza a marca", 5.44]], flip: 6.6, good: "Oferta exclusiva", goodAt: 7.2, gain: [["mais valor", 9.12], ["percepção premium", 9.84]] },
  { n: 2, from: 10.8, bad: "Barato", badAt: 10.96, why: [["parece baixa qualidade", 12.24]], flip: 13.6, good: "Acessível", goodAt: 14.48, gain: [["cabe no bolso", 16.0], ["valor percebido intacto", 17.6]] },
  { n: 3, from: 18.6, bad: "Promoção", badAt: 18.72, why: [["palavra saturada", 20.24], ["pouco eficaz hoje", 21.04]], flip: 22.3, good: "Oportunidade limitada", goodAt: 22.96, gain: [["urgência", 25.12], ["desejo real", 25.76]] },
  { n: 4, from: 26.4, bad: "Compre agora", badAt: 26.56, why: [["soa agressivo", 27.76], ["afasta o cliente", 28.48]], flip: 29.2, good: "Experimente, só hoje", goodAt: 29.44, gain: [["mais sutil", 31.04], ["senso de urgência", 32.56]] },
  { n: 5, from: 33.3, bad: "O melhor", badAt: 33.6, why: [["ninguém acredita", 34.88]], flip: 36.2, good: "Reconhecido por milhares", goodAt: 36.8, gain: [["confiança", 39.28], ["prova social", 40.0]] },
];
export const PairScene: React.FC<{ pair: Pair }> = ({ pair: P }) => {
  const { t, sp, ez } = useClock(P.from);
  const deal = sp(P.from + 0.05, SP.heavy);
  const flip = ez(P.flip - 0.05, P.flip + 0.55, 0, 1, EZ.inOut);
  const strike = ez(P.why[0][1], P.why[0][1] + 0.4, 0, 1, EZ.out);
  const lift = Math.sin(flip * Math.PI);
  const dimWhy = ez(P.flip, P.flip + 0.4);
  return (
    <Enter kind="none">
      <Bg15 />
      {/* cabeçalho: número e progresso */}
      <div style={{ position: "absolute", left: 110, top: 96, display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ fontFamily: T.serif, fontWeight: 700, fontStyle: "italic", fontSize: 64, color: T.champagne }}>Nº {String(P.n).padStart(2, "0")}</span>
        <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 28, color: T.dim }}>/ 05</span>
      </div>
      <div style={{ position: "absolute", right: 110, top: 130, display: "flex", gap: 10 }}>
        {[1, 2, 3, 4, 5].map((k) => (
          <div key={k} style={{ width: 64, height: 6, borderRadius: 3, background: k < P.n ? T.champagne : k === P.n ? (flip > 0.5 ? T.champagne : T.brick) : "rgba(244,247,250,0.14)" }} />
        ))}
      </div>
      {/* a carta é dada do baralho e vira */}
      <div style={{ position: "absolute", left: 110, top: 240, perspective: 2400 }}>
        <div style={{ opacity: interpolate(deal, [0, 0.25], [0, 1], clamp), transform: `translateX(${(1 - deal) * 900}px) translateY(${(1 - deal) * -120}px) rotateZ(${(1 - deal) * 14}deg) translateZ(${lift * 160}px) rotateX(${Math.sin(t * 0.9) * 2}deg)` }}>
          <Card bad={P.bad} good={P.good} flip={flip} strike={strike} />
        </div>
      </div>
      {/* coluna da direita: porque evitar (fica, esbatido) + porque funciona */}
      <div style={{ position: "absolute", left: 1020, top: 240, width: 790, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ opacity: 1 - dimWhy * 0.45 }}>
          <Caps color={T.brick}>PORQUE EVITAR</Caps>
        </div>
        {P.why.map(([w, at]) => (
          <div key={w} style={{ opacity: 1 - dimWhy * 0.55 }}>
            <Reason text={w} ok={false} p={sp(at, SP.snap)} />
          </div>
        ))}
        <div style={{ marginTop: 22, ...pin(sp(P.flip + 0.25, SP.soft), 20) }}>
          <Caps color={T.green}>PORQUE FUNCIONA</Caps>
        </div>
        {P.gain.map(([w, at]) => (
          <Reason key={w} text={w} ok p={sp(at, SP.snap)} />
        ))}
      </div>
    </Enter>
  );
};

// ——— 6 · palavras que convencem: leque 3D das cartas "use" + vendas a decolar ———
export const Conclusion: React.FC = () => {
  const off = 40.7;
  const { t, sp, ez } = useClock(off);
  const chart = sp(44.9, SP.soft);
  const rise = ez(45.2, 46.0, 0, 1, EZ.out);
  return (
    <Enter kind="blur">
      <Bg15 />
      <Title offset={off} out={99} y={150} w={820} rows={[serif([{ w: "As palavras", at: 40.8 }, { w: "que você usa", at: 41.28 }], 76), serif([{ w: "não só comunicam,", at: 42.0 }], 76, T.dim), serif([{ w: "convencem.", at: 43.44, color: T.champagne, italic: true }], 104)]} />
      <div style={{ position: "absolute", left: 1370, top: 960, perspective: 2200 }}>
        {PAIRS.map((P, i) => {
          const p = sp(40.85 + i * 0.12, SP.snap);
          const a = (i - 2) * 11;
          return (
            <div key={P.n} style={{ position: "absolute", left: -230, top: -560, width: 460, height: 300, borderRadius: 22, background: `linear-gradient(150deg, #FFFFFF, ${T.ivory} 60%, #DCE6EF)`, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)", transformOrigin: "50% 160%", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `rotateY(-14deg) rotateZ(${a * p + Math.sin(t * 0.8 + i) * 0.6}deg) translateY(${(1 - p) * 140}px)`, padding: "30px 34px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Caps color={T.champagneDeep} size={18}>USE · Nº {String(P.n).padStart(2, "0")}</Caps>
              <div style={{ fontFamily: T.serif, fontWeight: 700, fontStyle: "italic", fontSize: wordSize(P.good, 60), lineHeight: 1.04, color: T.inkDark }}>{P.good}</div>
            </div>
          );
        })}
      </div>
      {/* escolha bem → vendas a decolar */}
      <div style={{ position: "absolute", left: 110, top: 640, width: 760, ...pin(chart) }}>
        <Glass tint={T.glass} edge={T.edge} radius={26} style={{ padding: "26px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Caps>VENDAS</Caps>
            <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 28, color: T.green }}>+{Math.round(rise * 68)}%</span>
          </div>
          <svg width={696} height={180} viewBox="0 0 696 180" style={{ marginTop: 10 }}>
            <path d="M0 150 L120 140 L240 146 L360 120" stroke="rgba(244,247,250,0.35)" strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M360 120 C 480 100, 560 60, 690 10" stroke={T.green} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${rise} 1`} />
          </svg>
        </Glass>
      </div>
    </Enter>
  );
};

// ——— 7 · gostou? curta, partilhe e siga para mais dicas ———
export const Social: React.FC = () => {
  const off = 46.0;
  const { sp } = useClock(off);
  const heart = sp(46.88, SP.pop);
  const share = sp(47.36, SP.pop);
  const chips: [string, number][] = [
    ["Vendas", 48.48],
    ["Empreendedorismo", 48.88],
    ["Desenvolvimento profissional", 49.52],
  ];
  return (
    <Enter kind="rise">
      <Bg15 />
      <Title offset={off} out={99} y={170} w={1700} rows={[serif([{ w: "Gostou?", at: 46.16, color: T.champagne, italic: true }], 120)]} />
      <div style={{ position: "absolute", left: 110, top: 380, display: "flex", gap: 40 }}>
        {[
          { p: heart, l: "Curta", d: "M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" },
          { p: share, l: "Compartilhe", d: "M4 12.5 20 4l-5 16-3.5-6.5L4 12.5zm7.5 1L20 4" },
        ].map((x) => (
          <div key={x.l} style={{ ...pin(x.p, 60) }}>
            <Glass tint={T.glass} edge={T.edge} radius={30} style={{ padding: "30px 44px", display: "flex", alignItems: "center", gap: 26 }}>
              <svg width={84} height={84} viewBox="0 0 24 24" fill={x.p > 0.6 ? T.champagne : "none"} stroke={T.champagne} strokeWidth={1.6} strokeLinejoin="round" style={{ transform: `scale(${0.8 + x.p * 0.2})` }}>
                <path d={x.d} />
              </svg>
              <span style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 64, color: T.ink }}>{x.l}</span>
            </Glass>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 110, top: 640 }}>
        <Caps color={T.dim}>MAIS DICAS DE</Caps>
      </div>
      <div style={{ position: "absolute", left: 110, top: 700, display: "flex", gap: 20 }}>
        {chips.map(([c, at]) => (
          <div key={c} style={{ ...pin(sp(at, SP.pop)) }}>
            <div style={{ padding: "16px 30px", borderRadius: 999, border: `1.5px solid ${T.champagne}`, fontFamily: T.body, fontWeight: 800, fontSize: 36, color: T.ink }}>{c}</div>
          </div>
        ))}
      </div>
    </Enter>
  );
};
