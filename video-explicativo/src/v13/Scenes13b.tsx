import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { clamp, Enter, EZ, SP, useClock } from "../kit/Kit";
import { FONTS } from "../kit/fonts2";
import { Bg13, Caps, G, Icon, IconBadge, label, pin, serif, Title } from "./Scenes13";
import { T13 as T } from "./theme13";

type Clk = Pick<ReturnType<typeof useClock>, "t" | "sp" | "ez">;

// ——— 8 · o mesmo com os vendedores: duas fichas que viram ao serem ditas ———
const Badge: React.FC<{ p: number; flip: number; title: string; color: string; kind: "herb" | "carn"; x: number; rows: [string, string][] }> = ({ p, flip, title, color, kind, x, rows }) => {
  const front = flip >= 0.5;
  const sx = Math.max(0.02, Math.abs(Math.cos(flip * Math.PI)));
  return (
    <div style={{ position: "absolute", left: x, top: 230, width: 780, opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateY(${(1 - p) * 70}px) scaleX(${sx})` }}>
      <G radius={34} tint={front ? T.glass : "rgba(255,255,255,0.03)"} style={{ padding: "34px 40px", height: 620 }}>
        {front ? (
          <>
            <Caps color={color} size={22}>PERFIL DE VENDEDOR</Caps>
            <div style={{ fontFamily: T.serif, fontWeight: 600, fontStyle: "italic", fontSize: 100, color: T.ink, lineHeight: 1.05, marginTop: 6 }}>{title}</div>
            <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBadge kind={kind === "herb" ? "inbox" : "target"} size={210} color={color} soft={kind === "herb" ? T.herbSoft : T.carnSoft} />
            </div>
            {rows.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${T.line}`, fontFamily: T.sans, fontSize: 28 }}>
                <span style={{ color: T.dim }}>{k}</span>
                <span style={{ color, fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </>
        ) : (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontFamily: T.serif, fontWeight: 600, fontStyle: "italic", fontSize: 260, lineHeight: 1, color: T.faint }}>?</div>
            <Caps size={22}>PERFIL DE VENDEDOR</Caps>
          </div>
        )}
      </G>
    </div>
  );
};
export const S8: React.FC = () => {
  const off = 41.4;
  const { sp, ez } = useClock(off);
  return (
    <Enter kind="flip">
      <Bg13 />
      <Title offset={off} out={99} x={0} w={1920} y={80} align="center" rows={[serif([{ w: "Mesma coisa com os", at: 41.52 }, { w: "vendedores.", at: 42.4, color: T.carn, italic: true }], 76)]} />
      <Badge p={sp(41.9, SP.soft)} flip={ez(43.6, 44.0)} x={150} title="herbívoro" color={T.herb} kind="herb" rows={[["Caça?", "não"], ["Espera", "o que chega"]]} />
      <Badge p={sp(42.1, SP.soft)} flip={ez(44.88, 45.28)} x={990} title="carnívoro" color={T.carn} kind="carn" rows={[["Caça?", "sempre"], ["Escolhe", "a presa"]]} />
    </Enter>
  );
};

// ——— 9 · herbívoro: come o que o marketing planta (telemóvel real) e passa fome amanhã ———
const APPS = {
  meta: { name: "META ADS", color: "#0866FF", glyph: <path d="M5 15c0-4 2-8 4.5-8S13 11 14.5 13 17 17 19 17s2.5-2 2.5-4.5S20 7 18 7s-4 4-5.5 6S9 17 7.5 17 5 16 5 15z" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinejoin="round" /> },
  whats: { name: "WHATSAPP", color: "#25D366", glyph: <path d="M12 4a8 8 0 0 0-6.9 12l-1.1 4 4.1-1.1A8 8 0 1 0 12 4z" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinejoin="round" /> },
  ref: { name: "INDICAÇÃO", color: "#5E7C8C", glyph: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8c0-3.5 3-6 7-6s7 2.5 7 6" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" /> },
};
const Notif: React.FC<{ app: keyof typeof APPS; title: string; body: string; p: number; y: number; dim?: number }> = ({ app, title, body, p, y, dim = 0 }) => {
  const a = APPS[app];
  return (
    <div style={{ position: "absolute", left: 22, right: 22, top: y, opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (1 - dim), transform: `translateY(${(1 - p) * -70}px) scale(${0.9 + p * 0.1 - dim * 0.06})` }}>
      <div style={{ borderRadius: 26, padding: "16px 18px", background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px) saturate(170%)", boxShadow: "0 18px 40px -20px rgba(0,0,0,0.45)", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={30} height={30} viewBox="0 0 24 24">{a.glyph}</svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.manrope, fontWeight: 600, fontSize: 17, letterSpacing: "0.06em", color: "rgba(20,18,16,0.55)" }}>
            <span>{a.name}</span>
            <span>agora</span>
          </div>
          <div style={{ fontFamily: FONTS.manrope, fontWeight: 800, fontSize: 25, color: "#14181F", marginTop: 2 }}>{title}</div>
          <div style={{ fontFamily: FONTS.manrope, fontWeight: 600, fontSize: 22, color: "rgba(20,18,16,0.75)", lineHeight: 1.22 }}>{body}</div>
        </div>
      </div>
    </div>
  );
};
export const S9: React.FC = () => {
  const off = 45.5;
  const { t, sp, ez } = useClock(off);
  const phone = sp(46.0, SP.soft);
  const night = ez(51.9, 52.9);
  const clear = ez(52.0, 52.5);
  const busy = ez(50.9, 51.3);
  const budgetIn = sp(53.6, SP.soft);
  const budget = interpolate(t, [54.2, 54.75], [500, 0], { easing: EZ.in, ...clamp });
  const day = night > 0.5 ? "quarta-feira, 15 de outubro" : "terça-feira, 14 de outubro";
  const notes: { app: keyof typeof APPS; title: string; body: string; at: number; tag: string }[] = [
    { app: "meta", title: "Novo lead · Formulário", body: "Carla M. preencheu o formulário do anúncio", at: 48.48, tag: "lead" },
    { app: "whats", title: "Rafael", body: "Oi! Vi o anúncio, quanto custa?", at: 49.28, tag: "WhatsApp" },
    { app: "ref", title: "Indicação recebida", body: "João indicou você para a Clínica Prime", at: 50.08, tag: "indicação" },
  ];
  return (
    <Enter kind="wipe">
      <Bg13 dusk={night * 0.9} />
      <Title offset={off} out={99} rows={[label([{ w: "VENDEDOR HERBÍVORO", at: 45.6 }], 24, T.herb), serif([{ w: "Come as plantas", at: 46.8 }], 84), serif([{ w: "do marketing.", at: 47.76, color: T.herb, italic: true }], 84)]} />
      {/* a peça herbívora e o que o marketing plantou à volta dela */}
      <div style={{ position: "absolute", left: 140, top: 640, width: 940, height: 330 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 40, border: `3px dashed ${T.faint}`, background: T.herbSoft }} />
        <div style={{ position: "absolute", left: 40, top: 14, transform: `translateY(${Math.abs(Math.sin(t * (busy > 0.5 && night < 0.5 ? 8 : 3))) * -8}px)`, opacity: 1 - night * 0.45, filter: `grayscale(${night})` }}>
          <IconBadge kind="inbox" size={200} color={T.herb} soft={T.herbSoft} />
        </div>
        {notes.map((n, k) => {
          const p = sp(n.at, SP.pop);
          const gone = Math.max(ez(n.at + 0.9, n.at + 1.5), clear);
          return (
            <div key={n.tag} style={{ position: "absolute", left: 340 + k * 190, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (1 - gone), transform: `scale(${p * (1 - gone * 0.6)})`, transformOrigin: "50% 100%" }}>
              <G radius={999} style={{ padding: "8px 18px" }}>
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: T.ink, whiteSpace: "nowrap" }}>{n.tag}</span>
              </G>
              <svg width={110} height={90} viewBox="0 0 60 45">
                <path d="M8 45 Q12 18 16 4 Q18 24 22 45 M22 45 Q28 12 34 0 Q34 26 38 45 M38 45 Q42 20 48 8 Q48 30 52 45Z" fill={T.good} />
              </svg>
            </div>
          );
        })}
      </div>
      <Title offset={off} out={99} x={140} y={420} w={1000} rows={[serif([{ w: "Vive ocupado…", at: 50.96 }], 56), serif([{ w: "e passa fome", at: 52.08, color: T.miss, italic: true }, { w: "no dia seguinte.", at: 53.04, color: T.dim }], 56)]} />
      {/* telemóvel */}
      <div style={{ position: "absolute", left: 1290, top: 70, width: 440, height: 900, opacity: interpolate(phone, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - phone) * 120}px) rotate(${(1 - phone) * 6 + Math.sin(t * 0.8) * 0.6}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "linear-gradient(145deg, #3A3733, #121110)", boxShadow: "0 60px 120px -40px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.25)" }} />
        <div style={{ position: "absolute", inset: 14, borderRadius: 52, overflow: "hidden", background: night > 0.5 ? "linear-gradient(180deg, #050B14, #0A1424 55%, #0F1D33)" : "linear-gradient(180deg, #1F4C77, #3A78A8 55%, #78B3D6)" }}>
          <div style={{ position: "absolute", left: "50%", top: 14, width: 120, height: 34, marginLeft: -60, borderRadius: 20, background: "#000" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: FONTS.manrope, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,0.85)" }}>{day}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center", fontFamily: FONTS.manrope, fontWeight: 800, fontSize: 104, letterSpacing: "-0.03em", color: night > 0.5 ? "rgba(255,255,255,0.95)" : T.ink }}>{night > 0.5 ? "9:41" : "18:20"}</div>
          {notes.map((n, k) => {
            const pushed = notes.slice(k + 1).reduce((acc, m) => acc + sp(m.at, SP.snap), 0);
            return <Notif key={n.title} app={n.app} title={n.title} body={n.body} p={sp(n.at, SP.snap)} y={250 + pushed * 150} dim={clear} />;
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center", opacity: busy * (1 - clear) }}>
            <div style={{ padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.85)", fontFamily: FONTS.manrope, fontWeight: 800, fontSize: 22, color: "#14181F" }}>
              +{Math.round(interpolate(t, [50.96, 51.9], [3, 27], { easing: EZ.out, ...clamp }))} notificações
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONTS.manrope, fontWeight: 600, fontSize: 24, color: "rgba(255,255,255,0.6)", opacity: ez(52.5, 52.9) * (1 - budgetIn) }}>Nenhuma notificação</div>
        </div>
      </div>
      {/* verba de anúncios a cair */}
      <div style={{ position: "absolute", left: 1150, top: 560, width: 560, ...pin(budgetIn, 60) }}>
        <G radius={28} tint="rgba(10,26,47,0.88)" edge={budget < 250 ? "rgba(242,92,92,0.6)" : T.edge} style={{ padding: "26px 30px" }}>
          <Caps color={T.dim}>VERBA DE ANÚNCIOS · DIA</Caps>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 8 }}>
            <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 72, color: budget < 250 ? T.miss : T.ink }}>R$ {Math.round(budget)}</span>
            <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 28, color: T.miss, opacity: budget < 480 ? 1 : 0 }}>▼ {Math.round(100 - budget / 5)}%</span>
          </div>
          <svg width={500} height={110} viewBox="0 0 500 110" style={{ marginTop: 8 }}>
            <path d={`M0 30 L100 22 L200 34 L300 18 L380 ${30 + (1 - budget / 500) * 20} L500 ${30 + (1 - budget / 500) * 78}`} stroke={budget < 250 ? T.miss : T.ink} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </G>
      </div>
    </Enter>
  );
};

// ——— 10 · carnívoro: a caçada em quatro painéis (alvo → dossiê e chamada → radar → sair da zona) ———
const COMPANIES = [
  { n: "Construtora Alfa", s: "Construção", c: "#3E6A93" },
  { n: "Rede Sol", s: "Varejo", c: "#5C7A99" },
  { n: "Grupo Vale", s: "Indústria", c: "#2EC4D6" },
  { n: "Clínica Prime", s: "Saúde", c: "#4F87A8" },
  { n: "Agro Norte", s: "Agronegócio", c: "#6B7E92" },
];
const Mono: React.FC<{ n: string; c: string; size?: number }> = ({ n, c, size = 84 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.serif, fontWeight: 600, fontSize: size * 0.42, color: "#fff" }}>
    {n
      .split(" ")
      .map((w) => w[0])
      .join("")}
  </div>
);
const Reticle: React.FC<{ lock: number; size?: number }> = ({ lock, size = 300 }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" style={{ transform: `scale(${1 + (1 - lock) * 0.25}) rotate(${(1 - lock) * 60}deg)` }}>
    <circle cx={55} cy={55} r={46} fill="none" stroke={lock > 0.5 ? T.carn : T.ink} strokeWidth={2.4} />
    <path d="M55 2v18M55 90v18M2 55h18M90 55h18" stroke={lock > 0.5 ? T.carn : T.ink} strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);
const PanelA: React.FC<Clk> = ({ t, sp, ez }) => {
  const lock = sp(56.32, SP.pop);
  const scan = ez(55.1, 56.2);
  const target = 2;
  const rx = 160 + (lock > 0.5 ? target : interpolate(scan, [0, 1], [0, 4], { easing: EZ.inOut, ...clamp })) * 330;
  return (
    <>
      <Title offset={54.8} out={99} rows={[label([{ w: "VENDEDOR CARNÍVORO", at: 54.9 }], 24, T.carn), serif([{ w: "Escolhe", at: 55.84, color: T.carn, italic: true }, { w: "a empresa", at: 56.24 }, { w: "que ele quer.", at: 56.64 }], 84)]} w={1700} />
      {COMPANIES.map((c, k) => {
        const p = sp(54.95 + k * 0.08, SP.snap);
        const chosen = k === target && lock > 0.5;
        return (
          <div key={c.n} style={{ position: "absolute", left: 160 + k * 330, top: 400, width: 270, opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * (lock > 0.5 && !chosen ? 0.45 : 1), transform: `translateY(${(1 - p) * 60 + Math.sin(t * 1.4 + k) * 4}px) scale(${chosen ? 1 + lock * 0.06 : 1})` }}>
            <G radius={28} tint={chosen ? T.carnSoft : T.glass} edge={chosen ? T.carn : T.edge} style={{ height: 330, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <Mono n={c.n} c={c.c} />
              <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 30, color: T.ink, textAlign: "center", lineHeight: 1.1 }}>{c.n}</div>
              <div style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 22, color: T.dim }}>{c.s}</div>
            </G>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: rx - 15, top: 415, opacity: scan > 0 ? 1 : 0 }}>
        <Reticle lock={lock} />
      </div>
      <div style={{ position: "absolute", left: 160 + target * 330, top: 760, width: 270, display: "flex", justifyContent: "center", ...pin(lock, 20) }}>
        <div style={{ padding: "10px 24px", borderRadius: 999, background: T.carn, fontFamily: T.sans, fontWeight: 700, fontSize: 24, letterSpacing: "0.16em", color: T.paper, whiteSpace: "nowrap" }}>ALVO ESCOLHIDO</div>
      </div>
    </>
  );
};
const PanelB: React.FC<Clk> = ({ t, sp, ez }) => {
  const rows: [string, string][] = [
    ["Decisor", "Ana Ribeiro · Dir. Comercial"],
    ["Dor", "vendas sem previsibilidade"],
    ["Hoje usa", "planilha + CRM antigo"],
    ["Melhor horário", "8h às 9h"],
  ];
  const no = sp(58.88, SP.pop);
  const again = sp(59.2, SP.pop);
  const ring = (t * 1.4) % 1;
  return (
    <>
      <Title offset={54.8} out={99} rows={[serif([{ w: "Estuda", at: 57.28, color: T.carn, italic: true }, { w: "antes de ligar.", at: 57.76 }], 72), serif([{ w: "Toma não", at: 58.48, color: T.miss, italic: true }, { w: "e liga de novo.", at: 59.12 }], 72)]} w={1700} />
      <div style={{ position: "absolute", left: 110, top: 340, width: 780 }}>
        <G radius={30} style={{ padding: "30px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Mono n="Grupo Vale" c="#2EC4D6" size={64} />
            <div>
              <Caps color={T.carn}>DOSSIÊ</Caps>
              <div style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 44, color: T.ink }}>Grupo Vale</div>
            </div>
          </div>
          {rows.map(([k, v], i) => {
            const p = sp(57.4 + i * 0.22, SP.snap);
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.line}`, opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - p) * -30}px)` }}>
                <span style={{ width: 30, height: 30, borderRadius: 15, background: T.good, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, fontWeight: 700, fontSize: 18, color: "#fff" }}>✓</span>
                <span style={{ fontFamily: T.sans, fontSize: 26, color: T.dim, width: 210 }}>{k}</span>
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 26, color: T.ink }}>{v}</span>
              </div>
            );
          })}
        </G>
      </div>
      <div style={{ position: "absolute", left: 1010, top: 340, width: 800 }}>
        <G radius={30} edge={no > 0.5 && again < 0.5 ? "rgba(242,92,92,0.7)" : T.edge} style={{ padding: "34px 36px", height: 470 }}>
          <div style={{ position: "relative", height: 210, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[0, 0.5].map((d) => {
              const r = (ring + d) % 1;
              return <div key={d} style={{ position: "absolute", width: 130 + r * 200, height: 130 + r * 200, borderRadius: "50%", border: `3px solid ${again > 0.5 ? T.good : no > 0.5 ? "transparent" : T.carn}`, opacity: 1 - r }} />;
            })}
            <div style={{ width: 130, height: 130, borderRadius: 65, background: "#3E6A93", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.serif, fontWeight: 600, fontSize: 52, color: "#fff" }}>AR</div>
          </div>
          <div style={{ textAlign: "center", fontFamily: T.sans, fontWeight: 700, fontSize: 36, color: T.ink }}>Ana Ribeiro</div>
          <div style={{ textAlign: "center", fontFamily: T.sans, fontWeight: 500, fontSize: 26, color: T.dim }}>Grupo Vale · Diretora Comercial</div>
          <div style={{ marginTop: 20, textAlign: "center", fontFamily: T.sans, fontWeight: 700, fontSize: 30, color: again > 0.5 ? T.good : T.carn }}>{again > 0.5 ? "↻ Ligando de novo…  · tentativa 2" : no > 0.5 ? " " : "Chamando…"}</div>
          <div style={{ position: "absolute", left: "50%", top: 150, transform: `translate(-50%, -50%) rotate(-12deg) scale(${(2 - no) * (1 - ez(59.15, 59.4))})`, opacity: no * (1 - ez(59.15, 59.4)), padding: "8px 34px", border: `6px solid ${T.miss}`, borderRadius: 16, fontFamily: T.sans, fontWeight: 700, fontSize: 84, letterSpacing: "0.1em", color: T.miss, background: "rgba(10,26,47,0.88)" }}>NÃO</div>
        </G>
      </div>
    </>
  );
};
const PanelC: React.FC<Clk> = ({ t, sp }) => {
  const blips = [
    { n: "Rede Sol", a: 0.6, r: 0.55 },
    { n: "Agro Norte", a: 2.2, r: 0.8 },
    { n: "Clínica Prime", a: 3.6, r: 0.4 },
    { n: "Metal Sul", a: 4.6, r: 0.75 },
    { n: "Hotel Mar", a: 5.5, r: 0.62 },
  ];
  const R = 330;
  const n = blips.filter((_, i) => t >= 60.3 + i * 0.22).length;
  return (
    <>
      <Title offset={54.8} out={99} rows={[serif([{ w: "Se precisar prospectar,", at: 59.92 }], 72), serif([{ w: "vai prospectar.", at: 60.88, color: T.carn, italic: true }], 72)]} w={1700} />
      <div style={{ position: "absolute", left: 1140 - R, top: 560 - R, width: R * 2, height: R * 2 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,36,64,0.92), rgba(16,36,64,0.6))", border: `2px solid ${T.line}`, boxShadow: T.shadow }} />
        {[0.33, 0.66].map((k) => (
          <div key={k} style={{ position: "absolute", left: R - R * k, top: R - R * k, width: R * 2 * k, height: R * 2 * k, borderRadius: "50%", border: `1.5px solid ${T.line}` }} />
        ))}
        <div style={{ position: "absolute", left: 0, top: R, width: R * 2, height: 1.5, background: T.line }} />
        <div style={{ position: "absolute", left: R, top: 0, width: 1.5, height: R * 2, background: T.line }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${t * 200}deg, rgba(46,196,214,0.4), rgba(46,196,214,0) 60deg, transparent 360deg)` }} />
        {blips.map((b, i) => {
          const p = sp(60.3 + i * 0.22, SP.pop);
          const x = R + Math.cos(b.a) * R * b.r;
          const y = R + Math.sin(b.a) * R * b.r;
          return (
            <div key={b.n} style={{ position: "absolute", left: x, top: y, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) }}>
              <div style={{ position: "absolute", left: -12, top: -12, width: 24, height: 24, borderRadius: 12, background: T.carn, transform: `scale(${p})` }} />
              <div style={{ position: "absolute", left: 18, top: -18, padding: "4px 12px", borderRadius: 999, background: "rgba(10,26,47,0.92)", border: `1px solid ${T.line}`, fontFamily: T.sans, fontWeight: 700, fontSize: 20, color: T.ink, whiteSpace: "nowrap" }}>{b.n}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 110, top: 420, width: 560 }}>
        <G radius={28} style={{ padding: "26px 32px" }}>
          <Caps color={T.carn}>CONTAS NO RADAR</Caps>
          <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 96, color: T.ink, lineHeight: 1.05 }}>{String(n * 3).padStart(2, "0")}</div>
          <div style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 24, color: T.dim }}>prospecção ativa, todos os dias</div>
        </G>
      </div>
    </>
  );
};
const PanelD: React.FC<Clk> = ({ ez }) => {
  const jump = ez(62.4, 63.3);
  const land = ez(63.2, 63.6);
  const x0 = 470,
    x1 = 1290,
    yb = 760;
  const lx = interpolate(jump, [0, 1], [x0, x1]);
  const ly = yb - Math.sin(jump * Math.PI) * 300;
  return (
    <>
      <Title offset={54.8} out={99} rows={[serif([{ w: "Sai da", at: 62.32 }, { w: "zona de conforto", at: 62.64, color: T.carn, italic: true }], 72), serif([{ w: "pra vender.", at: 63.28 }], 72)]} w={1700} />
      <div style={{ position: "absolute", left: 290, top: 760, width: 580, height: 170, borderRadius: "50%", border: `6px dashed rgba(154,168,184,${1 - jump * 0.45})`, background: "radial-gradient(closest-side, rgba(154,168,184,0.18), rgba(154,168,184,0.03))" }} />
      <div style={{ position: "absolute", left: 290, top: 690, width: 580, display: "flex", justifyContent: "center", opacity: 1 - jump * 0.35 }}>
        <G radius={999} style={{ padding: "8px 24px" }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, letterSpacing: "0.2em", color: T.herb, whiteSpace: "nowrap" }}>ZONA DE CONFORTO</span>
        </G>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${x0 + 110} ${yb + 60} Q ${(x0 + x1) / 2 + 110} ${yb - 560} ${x1 + 110} ${yb + 60}`} stroke="rgba(46,196,214,0.55)" strokeWidth={4} fill="none" strokeDasharray="4 16" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${jump} 1` }} />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: `rotate(${interpolate(jump, [0, 0.5, 1], [0, -10, 4], clamp)}deg)` }}>
        <div style={{ width: 200, height: 200, borderRadius: 100, background: T.carn, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 60px rgba(46,196,214,0.45)" }}>
          <Icon kind="person" size={120} color={T.paper} stroke={2} />
        </div>
      </div>
      {Array.from({ length: 10 }).map((_, k) => {
        const a = (k / 10) * Math.PI;
        return <div key={k} style={{ position: "absolute", left: x1 + 110 + Math.cos(a) * land * 160 * (0.6 + random(`d${k}`) * 0.6), top: yb + 150 - Math.sin(a) * land * 70, width: 14, height: 14, borderRadius: 7, background: "rgba(154,168,184,0.5)", opacity: land * (1 - ez(63.6, 64.3)), filter: "blur(2px)" }} />;
      })}
      <div style={{ position: "absolute", left: 1240, top: 470, ...pin(ez(63.4, 63.8)) }}>
        <G radius={999} tint={T.carnSoft} style={{ padding: "14px 34px" }}>
          <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 32, color: T.carn }}>território novo</span>
        </G>
      </div>
    </>
  );
};
export const S10: React.FC = () => {
  const off = 54.8;
  const { t, sp, ez } = useClock(off);
  const pos = ez(56.95, 57.4) + ez(59.62, 60.05) + ez(61.85, 62.3);
  const panels = [PanelA, PanelB, PanelC, PanelD];
  return (
    <Enter kind="flip" dir={-1}>
      <Bg13 />
      {panels.map((P, i) => {
        const d = i - pos;
        if (Math.abs(d) >= 1) return null;
        return (
          <AbsoluteFill key={i} style={{ transform: `translateX(${d * 1920}px)`, opacity: 1 - Math.abs(d) * 0.4 }}>
            <P t={t} sp={sp} ez={ez} />
          </AbsoluteFill>
        );
      })}
    </Enter>
  );
};
