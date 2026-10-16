import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, Enter, EZ, Glass, Kinetic, KW, SP, useClock } from "../kit/Kit";
import { T13 as T } from "./theme13";

// Vídeo 13 sem desenhos de animais: a metáfora fica na narração e nos títulos; a imagem
// mostra o mundo das vendas que ela descreve — caixa de entrada, comissão, prospecção,
// carteira, mercado novo, ligações e a reação do mercado.

// ——— peças do tema (pedra clara, grafite, vidro fosco) ———
export const Bg13: React.FC<{ dusk?: number }> = ({ dusk = 0 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, #0D2240, ${T.paper} 55%, #081526)` }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${T.line} 1px, transparent 1px), linear-gradient(90deg, ${T.line} 1px, transparent 1px)`, backgroundSize: "80px 80px", opacity: 0.35 }} />
    <AbsoluteFill style={{ background: "radial-gradient(1100px 700px at 70% 30%, rgba(46,196,214,0.10), transparent 70%)" }} />
    {dusk > 0 && <AbsoluteFill style={{ background: `rgba(3,8,16,${dusk * 0.5})` }} />}
  </AbsoluteFill>
);
type Row = Parameters<typeof Kinetic>[0]["rows"][number];
export const serif = (words: KW[], size = 96, color: string = T.ink, italic = false): Row => ({ words, size, font: T.serif, color, weight: 600, italic, spacing: "-0.02em" });
export const label = (words: KW[], size = 26, color: string = T.dim): Row => ({ words, size, font: T.sans, color, weight: 700, spacing: "0.2em" });
export const Title: React.FC<{ rows: Row[]; out: number; offset: number; x?: number; y?: number; align?: "center" | "flex-start"; w?: number }> = ({ rows, out, offset, x = 110, y = 96, align = "flex-start", w = 820 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <Kinetic offset={offset} out={out} rows={rows} align={align} />
  </div>
);
export const G: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number; tint?: string; edge?: string }> = ({ style, children, radius = 26, tint = T.glass, edge = T.edge }) => (
  <Glass tint={tint} edge={edge} radius={radius} blur={20} style={{ boxShadow: `${T.shadow}, inset 0 1px 0 rgba(255,255,255,0.18)`, ...style }}>
    {children}
  </Glass>
);
export const Caps: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = T.dim, size = 20 }) => (
  <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: size, letterSpacing: "0.22em", color }}>{children}</div>
);
export const pin = (p: number, d = 40) => ({ opacity: interpolate(p, [0, 0.35], [0, 1], clamp), transform: `translateY(${(1 - p) * d}px) scale(${0.95 + p * 0.05})` });

// ——— ícones de linha (perfis de vendedor, não animais) ———
export const Icon: React.FC<{ kind: "inbox" | "target" | "person" | "pin" | "gem"; size: number; color: string; stroke?: number }> = ({ kind, size, color, stroke = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {kind === "inbox" && (
      <>
        <path d="M3 13l2.5-7.5A2 2 0 0 1 7.4 4h9.2a2 2 0 0 1 1.9 1.5L21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z" />
        <path d="M3 13h5l1.5 2.5h5L16 13h5" />
      </>
    )}
    {kind === "target" && (
      <>
        <circle cx={12} cy={12} r={9} />
        <circle cx={12} cy={12} r={5} />
        <circle cx={12} cy={12} r={1.4} fill={color} />
        <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
      </>
    )}
    {kind === "person" && <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />}
    {kind === "pin" && (
      <>
        <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
        <circle cx={12} cy={10} r={2.4} />
      </>
    )}
    {kind === "gem" && (
      <>
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M2 9h20M9 3l3 18 3-18" />
      </>
    )}
  </svg>
);
export const IconBadge: React.FC<{ kind: "inbox" | "target" | "person"; size: number; color: string; soft: string }> = ({ kind, size, color, soft }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: soft, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon kind={kind} size={size * 0.56} color={color} />
  </div>
);
const Profile: React.FC<{ p: number; kind: "inbox" | "target"; title: string; sub: string; color: string; soft: string; x?: number; y?: number }> = ({ p, kind, title, sub, color, soft, x = 110, y = 440 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 22, ...pin(p) }}>
    <IconBadge kind={kind} size={92} color={color} soft={soft} />
    <div>
      <Caps color={color} size={22}>
        {title}
      </Caps>
      <div style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 36, color: T.dim, marginTop: 4 }}>{sub}</div>
    </div>
  </div>
);
export const Tag: React.FC<{ children: React.ReactNode; color: string; soft: string; size?: number }> = ({ children, color, soft, size = 18 }) => (
  <span style={{ padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: 999, background: soft, color, fontFamily: T.sans, fontWeight: 700, fontSize: size, whiteSpace: "nowrap" }}>{children}</span>
);

// ——— 1 · abertura: dois tipos de vendedor ———
export const S1: React.FC = () => {
  const { sp } = useClock(0);
  const h = sp(1.76, SP.pop);
  const c = sp(2.48, SP.pop);
  return (
    <Enter kind="none">
      <Bg13 />
      <Title offset={0} out={99} x={0} w={1920} y={150} align="center" rows={[label([{ w: "VENDEDORES · UMA HISTÓRIA NATURAL", at: 0.08 }], 24), serif([{ w: "Vendedor", at: 0.08 }, { w: "é igual a", at: 0.56 }, { w: "bicho.", at: 0.96, color: T.carn, italic: true }], 128)]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: 60 }}>
        {[
          { p: h, k: "inbox" as const, t: "HERBÍVORO", s: "espera o que chega", col: T.herb, soft: T.herbSoft },
          { p: c, k: "target" as const, t: "CARNÍVORO", s: "escolhe a presa", col: T.carn, soft: T.carnSoft },
        ].map((b) => (
          <div key={b.t} style={{ ...pin(b.p, 80) }}>
            <G radius={34} style={{ width: 560, padding: "40px 44px", display: "flex", alignItems: "center", gap: 30 }}>
              <IconBadge kind={b.k} size={130} color={b.col} soft={b.soft} />
              <div>
                <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 44, letterSpacing: "0.14em", color: b.col }}>{b.t}</div>
                <div style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 36, color: T.dim, marginTop: 6 }}>{b.s}</div>
              </div>
            </G>
          </div>
        ))}
      </div>
    </Enter>
  );
};

// ——— 2–3 · o herbívoro: leads que o marketing planta, dentro da zona de conforto; quando acabam… ———
const LEADS: { n: string; o: string; at: number }[] = [
  { n: "Carla Menezes", o: "Meta Ads", at: 3.9 },
  { n: "Rafael Souza", o: "Site", at: 4.6 },
  { n: "Júlia Prado", o: "Indicação", at: 5.3 },
  { n: "Bruno Lima", o: "Google", at: 6.0 },
  { n: "Ana Ribeiro", o: "Meta Ads", at: 6.7 },
  { n: "Pedro Alves", o: "WhatsApp", at: 7.5 },
];
export const Inbox: React.FC = () => {
  const off = 3.0;
  const { t, sp, ez } = useClock(off);
  const card = sp(3.3, SP.soft);
  const zone = ez(7.3, 7.8);
  const noFilter = sp(8.24, SP.pop);
  const planted = sp(10.16, SP.pop);
  const empty = ez(11.1, 11.6);
  const arrived = LEADS.filter((l) => t >= l.at).length;
  const today = Math.round(arrived * (1 - empty));
  const comm = interpolate(t, [11.4, 15.8], [1, 0.09], { easing: EZ.inOut, ...clamp });
  const here = sp(14.56, SP.pop);
  return (
    <Enter kind="blur">
      <Bg13 />
      <Title offset={off} out={6.45} rows={[serif([{ w: "Imagina", at: 3.04 }, { w: "uma vaca.", at: 3.52, color: T.herb, italic: true }], 92), serif([{ w: "Cabeça baixa,", at: 4.88 }, { w: "comendo o que chega.", at: 5.6 }], 50, T.dim)]} />
      <Title offset={off} out={7.98} rows={[serif([{ w: "Lá do lado,", at: 6.72 }], 92), serif([{ w: "dentro da cerca.", at: 7.36, italic: true }], 50, T.dim)]} />
      <Title offset={off} out={10.75} rows={[serif([{ w: "Ela não", at: 8.08 }, { w: "escolhe:", at: 8.4, color: T.miss, italic: true }], 92), serif([{ w: "come o que", at: 9.44 }, { w: "plantaram.", at: 10.16, color: T.herb, italic: true }], 50, T.dim)]} />
      <Title offset={off} out={12.7} rows={[serif([{ w: "Se o capim", at: 10.88 }, { w: "acaba…", at: 11.44, color: T.miss, italic: true }], 92)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "Emagrece", at: 12.96, color: T.miss, italic: true }], 92), serif([{ w: "e morre no", at: 13.84 }, { w: "mesmo lugar.", at: 14.56 }], 50, T.dim)]} />
      <Profile p={sp(3.7, SP.soft)} kind="inbox" title="VENDEDOR HERBÍVORO" sub="espera o que chega" color={T.herb} soft={T.herbSoft} y={430} />
      {/* comissão do mês a cair */}
      <div style={{ position: "absolute", left: 110, top: 600, width: 720, ...pin(sp(11.2, SP.soft)) }}>
        <G style={{ padding: "26px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Caps>COMISSÃO DO MÊS</Caps>
            <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 52, color: comm < 0.3 ? T.miss : T.ink }}>R$ {Math.round(comm * 6400).toLocaleString("pt-BR")}</span>
          </div>
          <svg width={656} height={120} viewBox="0 0 656 120" style={{ marginTop: 10 }}>
            <path d={`M0 30 L110 26 L220 34 L330 28 L440 ${30 + (1 - comm) * 40} L656 ${30 + (1 - comm) * 84}`} stroke={comm < 0.3 ? T.miss : T.herb} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </G>
      </div>
      <div style={{ position: "absolute", left: 110, top: 880, display: "flex", alignItems: "center", gap: 14, ...pin(here) }}>
        <Icon kind="pin" size={44} color={T.ink} stroke={2} />
        <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 30, color: T.ink }}>mesma carteira, mesmo lugar</span>
      </div>
      {/* zona de conforto (a "cerca") à volta da caixa de entrada */}
      <div style={{ position: "absolute", left: 950, top: 120, width: 900, height: 820, borderRadius: 44, border: `4px dashed ${zone > 0.05 ? T.herb : T.faint}`, boxShadow: zone > 0.05 ? `0 0 ${50 * zone}px rgba(154,168,184,${0.45 * zone})` : "none", opacity: card }} />
      <div style={{ position: "absolute", left: 990, top: 98, ...pin(zone, 10) }}>
        <Tag color={T.paper} soft={T.herb} size={20}>
          ZONA DE CONFORTO
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 170, width: 800, ...pin(card, 60) }}>
        <G radius={30} style={{ padding: "28px 32px", height: 720 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon kind="inbox" size={34} color={T.herb} />
              <Caps color={T.ink}>CAIXA DE ENTRADA</Caps>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ opacity: noFilter, transform: `scale(${0.8 + noFilter * 0.2})` }}>
                <Tag color={T.miss} soft={T.missSoft}>
                  escolha: nenhuma
                </Tag>
              </span>
              <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: today ? T.ink : T.miss }}>{today} leads hoje</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, paddingBottom: 10, borderBottom: `1px solid ${T.line}`, fontFamily: T.sans, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: T.dim }}>
            <span>CONTACTO</span>
            <span style={{ color: planted > 0.5 ? T.herb : T.dim }}>{planted > 0.5 ? "PLANTADO PELO MARKETING" : "ORIGEM"}</span>
          </div>
          <div style={{ position: "relative", height: 560 }}>
            {LEADS.map((l, k) => {
              const p = sp(l.at, SP.snap);
              const pushed = LEADS.slice(k + 1).reduce((a, m) => a + sp(m.at, SP.snap), 0);
              const gone = ez(11.1 + k * 0.05, 11.45 + k * 0.05, 0, 1, EZ.in);
              return (
                <div key={l.n} style={{ position: "absolute", left: 0, right: 0, top: pushed * 88, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (1 - gone), transform: `translateY(${(1 - p) * -40}px) translateX(${gone * 60}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 0", borderBottom: `1px solid ${T.line}` }}>
                    <div style={{ width: 52, height: 52, borderRadius: 26, background: T.herbSoft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, fontWeight: 700, fontSize: 20, color: T.herb }}>
                      {l.n
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 28, color: T.ink }}>{l.n}</div>
                      <div style={{ fontFamily: T.sans, fontSize: 20, color: T.dim }}>novo lead · agora</div>
                    </div>
                    <Tag color={T.herb} soft={T.herbSoft} size={20}>
                      {l.o}
                    </Tag>
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", opacity: ez(11.6, 12.0) }}>
              <div style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 54, color: T.dim }}>Nenhum lead novo.</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 14, fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: T.faint }}>
                <svg width={28} height={28} viewBox="0 0 24 24" style={{ transform: `rotate(${t * 220}deg)` }}>
                  <circle cx={12} cy={12} r={9} stroke={T.faint} strokeWidth={3} fill="none" strokeDasharray="36 24" />
                </svg>
                aguardando o marketing…
              </div>
            </div>
          </div>
        </G>
      </div>
    </Enter>
  );
};

// ——— 4 · o carnívoro: olha o mercado inteiro e escolhe o alvo de hoje ———
const MARKET: { n: string; s: string; v: number }[] = [
  { n: "Construtora Alfa", s: "Construção", v: 0.56 },
  { n: "Rede Sol", s: "Varejo", v: 0.42 },
  { n: "Grupo Vale", s: "Indústria", v: 0.92 },
  { n: "Clínica Prime", s: "Saúde", v: 0.64 },
  { n: "Agro Norte", s: "Agronegócio", v: 0.71 },
  { n: "Metal Sul", s: "Metalurgia", v: 0.38 },
];
export const Market: React.FC = () => {
  const off = 16.4;
  const { sp, ez } = useClock(off);
  const scan = ez(19.95, 20.95);
  const lock = sp(21.04, SP.pop);
  const target = 2;
  const row = lock > 0.5 ? target : Math.min(MARKET.length - 1, Math.floor(interpolate(scan, [0, 1], [0, MARKET.length - 0.01])));
  return (
    <Enter kind="wipe">
      <Bg13 />
      <Title offset={off} out={18.9} rows={[serif([{ w: "Agora,", at: 16.56 }, { w: "o leão.", at: 17.2, color: T.carn, italic: true }], 92), serif([{ w: "Leão é", at: 18.0 }, { w: "diferente.", at: 18.48 }], 50, T.dim)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "O leão", at: 18.96 }, { w: "escolhe.", at: 19.36, color: T.carn, italic: true }], 92), serif([{ w: "olha o mercado", at: 20.0 }, { w: "e decide.", at: 20.88 }], 50, T.dim)]} />
      <Profile p={sp(16.8, SP.soft)} kind="target" title="VENDEDOR CARNÍVORO" sub="escolhe a presa" color={T.carn} soft={T.carnSoft} y={430} />
      <div style={{ position: "absolute", left: 960, top: 150, width: 860, ...pin(sp(16.7, SP.soft), 60) }}>
        <G radius={30} style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon kind="target" size={34} color={T.carn} />
              <Caps color={T.ink}>MERCADO · 48 EMPRESAS</Caps>
            </div>
            <Tag color={T.carn} soft={T.carnSoft} size={20}>
              prospecção ativa
            </Tag>
          </div>
          <div style={{ display: "flex", marginTop: 22, paddingBottom: 10, borderBottom: `1px solid ${T.line}`, fontFamily: T.sans, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: T.dim }}>
            <span style={{ flex: 1.4 }}>EMPRESA</span>
            <span style={{ flex: 1 }}>SETOR</span>
            <span style={{ flex: 1 }}>POTENCIAL</span>
          </div>
          {MARKET.map((m, k) => {
            const p = sp(17.0 + k * 0.1, SP.snap);
            const on = scan > 0 && k === row;
            const chosen = lock > 0.5 && k === target;
            return (
              <div key={m.n} style={{ position: "relative", display: "flex", alignItems: "center", padding: "20px 14px", margin: "0 -14px", borderRadius: 18, background: chosen ? T.carnSoft : on ? "rgba(255,255,255,0.06)" : "transparent", border: chosen ? `2px solid ${T.carn}` : "2px solid transparent", opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (lock > 0.5 && !chosen ? 0.45 : 1), transform: `translateX(${(1 - p) * 40}px)` }}>
                <span style={{ flex: 1.4, fontFamily: T.sans, fontWeight: 700, fontSize: 28, color: T.ink }}>{m.n}</span>
                <span style={{ flex: 1, fontFamily: T.sans, fontSize: 24, color: T.dim }}>{m.s}</span>
                <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ flex: 1, height: 10, borderRadius: 5, background: T.line }}>
                    <span style={{ display: "block", width: `${m.v * 100 * p}%`, height: "100%", borderRadius: 5, background: chosen ? T.carn : T.faint }} />
                  </span>
                  <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 22, color: chosen ? T.carn : T.dim, width: 46 }}>{Math.round(m.v * 100)}</span>
                </span>
                {chosen && (
                  <span style={{ position: "absolute", right: -10, top: -18, ...pin(lock, 10) }}>
                    <Tag color={T.paper} soft={T.carn} size={18}>
                      ALVO DE HOJE
                    </Tag>
                  </span>
                )}
              </div>
            );
          })}
        </G>
      </div>
    </Enter>
  );
};

// ——— 5 · trabalha a carteira até esgotar; depois sai e caça no mercado novo ———
const WALLET = ["Grupo Vale", "Construtora Alfa", "Agro Norte", "Clínica Prime", "Rede Sol", "Metal Sul"];
export const Territory: React.FC = () => {
  const off = 22.9;
  const { t, sp, ez } = useClock(off);
  const out = ez(28.8, 29.7, 0, 1, EZ.inOut);
  const fresh = ez(27.7, 28.2);
  return (
    <Enter kind="zoom">
      <Bg13 />
      <Title offset={off} out={26.0} w={1700} rows={[serif([{ w: "Rebanho na cerca?", at: 22.96 }, { w: "Ataca ali.", at: 25.12, color: T.carn, italic: true }], 80)]} />
      <Title offset={off} out={99} w={1700} rows={[serif([{ w: "A presa acabou?", at: 26.16 }, { w: "Sai da cerca", at: 28.88, color: T.carn, italic: true }, { w: "e caça lá fora.", at: 29.52 }], 80)]} />
      <div style={{ position: "absolute", left: 110, top: 270, width: 720, ...pin(sp(23.0, SP.soft), 60) }}>
        <G radius={30} style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Caps color={T.ink}>CARTEIRA ATUAL</Caps>
            <span style={{ opacity: ez(27.1, 27.4) }}>
              <Tag color={T.miss} soft={T.missSoft}>
                esgotada
              </Tag>
            </span>
          </div>
          {WALLET.map((w, k) => {
            const done = sp(25.2 + k * 0.33, SP.pop);
            return (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 0", borderBottom: `1px solid ${T.line}`, opacity: 1 - done * 0.4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, border: `2px solid ${done > 0.5 ? T.good : T.faint}`, background: done > 0.5 ? T.good : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.8 + done * 0.2})` }}>
                  {done > 0.5 && (
                    <svg width={20} height={20} viewBox="0 0 24 24">
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span style={{ flex: 1, fontFamily: T.sans, fontWeight: 700, fontSize: 28, color: T.ink, textDecoration: done > 0.5 ? "line-through" : "none", textDecorationColor: T.faint }}>{w}</span>
                <span style={{ fontFamily: T.sans, fontSize: 22, color: done > 0.5 ? T.good : T.dim }}>{done > 0.5 ? "trabalhada" : "na fila"}</span>
              </div>
            );
          })}
        </G>
      </div>
      {/* seta: sair da cerca */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M 850 560 C 920 420, 990 420, 1060 560" stroke={T.carn} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${out} 1`} />
        <path d="M 1046 532 L 1062 562 L 1030 556" stroke={T.carn} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={out > 0.95 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: 1090, top: 270, width: 720, opacity: 0.35 + fresh * 0.65, transform: `scale(${0.96 + fresh * 0.04})` }}>
        <G radius={30} edge={out > 0.9 ? T.carn : T.edge} style={{ padding: "28px 32px", height: 600 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Caps color={T.ink}>MERCADO NOVO</Caps>
            <span style={{ opacity: ez(29.6, 29.9) }}>
              <Tag color={T.paper} soft={T.carn}>
                caçando
              </Tag>
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginTop: 30 }}>
            {Array.from({ length: 12 }).map((_, k) => {
              const p = sp(28.9 + k * 0.1, SP.pop);
              const hot = k % 3 === 0 && t > 29.7;
              return (
                <div key={k} style={{ height: 110, borderRadius: 20, border: `2px solid ${hot ? T.carn : T.line}`, background: hot ? T.carnSoft : "rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.25 + p * 0.75, transform: `scale(${0.9 + p * 0.1})` }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: hot ? T.carn : T.faint }} />
                  <div style={{ width: 70, height: 8, borderRadius: 4, background: T.line }} />
                </div>
              );
            })}
          </div>
        </G>
      </div>
    </Enter>
  );
};

// ——— 6 · erra a maioria das ligações, mas não para — não tem geladeira ———
export const S6: React.FC = () => {
  const off = 30.4;
  const { sp } = useClock(off);
  const fridge = sp(34.4, SP.pop);
  const tries = ["✕", "✕", "✕", "✕", "✕", "✓"];
  return (
    <Enter kind="slide">
      <Bg13 />
      <Title offset={off} out={33.5} w={1000} rows={[serif([{ w: "Erra a maioria", at: 30.48 }, { w: "das caçadas…", at: 31.36 }], 92), serif([{ w: "mas não para.", at: 32.16, color: T.carn, italic: true }], 92)]} />
      <div style={{ position: "absolute", left: 110, top: 470, display: "flex", gap: 22 }}>
        {tries.map((x, k) => {
          const p = sp(30.7 + k * 0.4, SP.pop);
          const ok = x === "✓";
          return (
            <div key={k} style={{ ...pin(p) }}>
              <G radius={26} tint={ok ? T.goodSoft : T.glass} style={{ width: 150, height: 178, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 76, lineHeight: 1, color: ok ? T.good : T.miss }}>{x}</span>
                <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 22, marginTop: 10, color: T.dim }}>ligação {k + 1}</span>
              </G>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 110, top: 700, ...pin(sp(32.8, SP.soft)) }}>
        <Tag color={T.good} soft={T.goodSoft} size={26}>
          1 venda em 6 tentativas — e continua
        </Tag>
      </div>
      <Title offset={off} out={99} x={1060} y={150} w={760} rows={[serif([{ w: "Porque o leão", at: 33.6 }], 64), serif([{ w: "não tem geladeira.", at: 34.32, color: T.carn, italic: true }], 76)]} />
      <div style={{ position: "absolute", left: 1290, top: 420, opacity: fridge, transform: `scale(${0.7 + fridge * 0.3}) rotate(${(1 - fridge) * 8}deg)` }}>
        <svg width={260} height={360} viewBox="0 0 100 140">
          <rect x={10} y={4} width={80} height={132} rx={10} fill="rgba(255,255,255,0.06)" stroke={T.ink} strokeWidth={3} />
          <path d="M10 48h80M22 18v18M22 62v24" stroke={T.ink} strokeWidth={3} strokeLinecap="round" />
          <path d="M0 140L100 0" stroke={T.miss} strokeWidth={7} strokeLinecap="round" opacity={fridge} />
        </svg>
      </div>
    </Enter>
  );
};

// ——— 7 · quando o carnívoro entra, o mercado reage; ninguém reage ao herbívoro ———
const REACTIONS = [
  { txt: "Concorrente baixou o preço", at: 36.5 },
  { txt: "Cliente pediu reunião", at: 36.95 },
  { txt: "Fornecedor ligou de volta", at: 37.4 },
  { txt: "Decisor respondeu o e-mail", at: 37.85 },
];
export const Reaction: React.FC = () => {
  const off = 35.2;
  const { t, sp, ez } = useClock(off);
  const carn = sp(36.16, SP.pop) * (1 - ez(39.0, 39.3));
  const herb = sp(40.48, SP.pop);
  const spike = ez(36.3, 38.6, 0, 1, EZ.out) * (1 - ez(39.2, 40.0));
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = (i / 23) * 760;
    const base = 150 + Math.sin(i * 1.3 + t) * 4;
    const y = base - (i > 9 ? spike * Math.min(1, (i - 9) / 5) * 120 : 0);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <Enter kind="blur">
      <Bg13 />
      <Title offset={off} out={39.1} rows={[serif([{ w: "Quando o leão", at: 35.68 }, { w: "aparece,", at: 36.16, color: T.carn, italic: true }], 88), serif([{ w: "todos mudam de", at: 37.52 }, { w: "comportamento.", at: 38.64 }], 50, T.dim)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "Ninguém muda", at: 39.2 }], 88), serif([{ w: "por causa de", at: 40.48 }, { w: "uma vaca.", at: 40.96, color: T.herb, italic: true }], 56, T.dim)]} />
      <div style={{ position: "absolute", left: 110, top: 440, ...pin(carn) }}>
        <Tag color={T.paper} soft={T.carn} size={26}>
          vendedor carnívoro entrou no mercado
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 110, top: 440, ...pin(herb) }}>
        <Tag color={T.paper} soft={T.herb} size={26}>
          vendedor herbívoro entrou no mercado
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 110, top: 540, display: "flex", flexDirection: "column", gap: 14 }}>
        {REACTIONS.map((r) => {
          const p = sp(r.at, SP.snap) * (1 - ez(39.1, 39.4));
          return (
            <div key={r.txt} style={{ ...pin(p, 20) }}>
              <G radius={18} style={{ padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: T.carn }} />
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 28, color: T.ink }}>{r.txt}</span>
              </G>
            </div>
          );
        })}
        <div style={{ ...pin(sp(40.96, SP.soft), 20) }}>
          <span style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 44, color: T.dim }}>nenhuma reação.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1000, top: 300, width: 820, ...pin(sp(35.4, SP.soft), 60) }}>
        <G radius={30} style={{ padding: "28px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Caps color={T.ink}>ATIVIDADE DO MERCADO</Caps>
            <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 24, color: spike > 0.3 ? T.good : T.dim }}>{spike > 0.3 ? "▲ alta" : "estável"}</span>
          </div>
          <svg width={760} height={200} viewBox="0 0 760 200" style={{ marginTop: 18 }}>
            <path d="M0 150 H760" stroke={T.line} strokeWidth={2} />
            <path d={pts} stroke={spike > 0.3 ? T.carn : T.faint} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </G>
      </div>
    </Enter>
  );
};

// ——— 11 · high ticket: nada de tirador de pedido nem atendente de bar ———
export const S11: React.FC = () => {
  const off = 64.5;
  const { t, sp } = useClock(off);
  const gem = sp(66.08, SP.pop);
  const pad = sp(67.2, SP.pop);
  const bar = sp(69.04, SP.pop);
  return (
    <Enter kind="zoom">
      <Bg13 />
      <Title offset={off} out={99} w={1000} rows={[serif([{ w: "Principalmente", at: 64.56 }, { w: "no high ticket.", at: 66.08, color: T.carn, italic: true }], 88)]} />
      {/* contrato fechado (o resultado do carnívoro) */}
      <div style={{ position: "absolute", left: 1180, top: 260, width: 640, ...pin(sp(64.8, SP.soft), 60) }}>
        <div style={{ transform: `translateY(${Math.sin(t * 1.3) * 6}px)` }}>
          <G radius={32} edge={gem > 0.5 ? T.carn : T.edge} style={{ padding: "34px 38px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Caps color={T.carn}>CONTRATO ASSINADO</Caps>
              <Icon kind="gem" size={40} color={T.carn} />
            </div>
            <div style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 54, color: T.ink, marginTop: 18 }}>Grupo Vale</div>
            <div style={{ fontFamily: T.sans, fontSize: 24, color: T.dim }}>projeto anual · 12 meses</div>
            <div style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 84, color: T.good, marginTop: 20 }}>R$ {Math.round(interpolate(gem, [0, 1], [0, 480], clamp))}.000</div>
            <div style={{ marginTop: 18, height: 1, background: T.line }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: T.sans, fontSize: 22, color: T.dim }}>
              <span>vendedor</span>
              <span style={{ color: T.carn, fontWeight: 700 }}>carnívoro</span>
            </div>
          </G>
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 330, ...pin(gem) }}>
        <G radius={999} tint={T.carnSoft} style={{ padding: "16px 40px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: T.sans, fontWeight: 700, fontSize: 40, letterSpacing: "0.12em", color: T.carn }}>
            <Icon kind="gem" size={42} color={T.carn} />
            HIGH TICKET
          </span>
        </G>
      </div>
      {[
        { p: pad, t: "tirador de pedido", y: 520 },
        { p: bar, t: "atendente de bar", y: 680 },
      ].map((x) => (
        <div key={x.t} style={{ position: "absolute", left: 110, top: x.y, opacity: x.p, transform: `translateX(${(1 - x.p) * -40}px)` }}>
          <G radius={24} style={{ padding: "18px 34px" }}>
            <span style={{ position: "relative", fontFamily: T.serif, fontStyle: "italic", fontWeight: 600, fontSize: 60, color: T.ink }}>
              {x.t}
              <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: 6, borderRadius: 3, background: T.miss, transform: `scaleX(${interpolate(x.p, [0.4, 1], [0, 1], clamp)})`, transformOrigin: "left" }} />
            </span>
          </G>
        </div>
      ))}
    </Enter>
  );
};
