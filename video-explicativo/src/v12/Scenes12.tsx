import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { clamp, Enter, EZ, Glass, Kinetic, Mesh, SP, useClock } from "../kit/Kit";
import { GlassQuestion } from "./Q3D";
import { T12 as T } from "./theme12";

// ——— peças do tema ———
export const Bg12: React.FC<{ hue?: "violet" | "coral" | "mint" }> = ({ hue = "violet" }) => (
  <Mesh
    base={`linear-gradient(180deg, ${T.deep}, ${T.base} 60%)`}
    grid="rgba(46,196,214,0.06)"
    gridSize={72}
    blobs={[
      { c: hue === "coral" ? "rgba(242,92,92,0.22)" : "rgba(46,196,214,0.14)", x: 22, y: 18, r: 900 },
      { c: hue === "mint" ? "rgba(54,211,153,0.2)" : "rgba(40,72,118,0.55)", x: 82, y: 70, r: 1000, s: 0.18 },
      { c: "rgba(70,110,160,0.16)", x: 60, y: 40, r: 700, s: 0.3 },
    ]}
  />
);
const G: React.FC<{ style?: React.CSSProperties; glow?: string; tint?: string; children?: React.ReactNode; radius?: number }> = ({ style, glow, tint, children, radius }) => (
  <Glass tint={tint ?? T.glass} edge={T.edge} glow={glow} radius={radius} style={style}>
    {children}
  </Glass>
);
const Title: React.FC<{ rows: Parameters<typeof Kinetic>[0]["rows"]; out: number; top?: number; offset: number }> = ({ rows, out, top = 210, offset }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top }}>
    <Kinetic offset={offset} out={out} rows={rows} />
  </div>
);
// a Syne é muito larga: os títulos ficam a 78% do tamanho pedido
const row = (words: { w: string; at: number; color?: string }[], size = 92, color: string = T.ink) => ({ words, size: Math.round(size * 0.78), font: T.display, color, weight: 800 });
const small = (words: { w: string; at: number; color?: string }[], size = 46) => ({ words, size, font: T.body, color: T.dim, weight: 600, spacing: "-0.01em" });

const Person: React.FC<{ s: number; tone?: string; eyes?: "x" | "ok" | "?" | "calm"; look?: number }> = ({ s, tone = T.violet, eyes = "calm", look = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <defs>
      <linearGradient id={`pg${tone}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone} stopOpacity={0.9} />
        <stop offset="1" stopColor={tone} stopOpacity={0.25} />
      </linearGradient>
    </defs>
    <circle cx={50} cy={36} r={20} fill={`url(#pg${tone})`} stroke="rgba(255,255,255,0.45)" strokeWidth={1} />
    <path d="M12 100c2-24 18-36 38-36s36 12 38 36z" fill={`url(#pg${tone})`} stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
    {eyes === "x" ? (
      <g stroke="#fff" strokeWidth={2.4} strokeLinecap="round">
        <path d="M39 31l6 6M45 31l-6 6M55 31l6 6M61 31l-6 6" />
      </g>
    ) : (
      <g fill="#fff">
        <circle cx={42 + look * 2} cy={35} r={2.6} />
        <circle cx={58 + look * 2} cy={35} r={2.6} />
      </g>
    )}
    {eyes === "ok" && <path d="M42 44 Q50 50 58 44" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />}
    {eyes === "?" && <path d="M44 46 Q50 43 56 46" stroke="#fff" strokeWidth={2.2} fill="none" strokeLinecap="round" />}
  </svg>
);
const Check: React.FC<{ s: number; c?: string }> = ({ s, c = T.mint }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const Cross: React.FC<{ s: number; c?: string }> = ({ s, c = T.coral }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

// ——— 1 · gancho: o "?" de vidro em 3D ———
export const S1: React.FC = () => {
  const { sp } = useClock(0);
  const ver = sp(7.04, SP.pop);
  return (
    <Enter kind="none">
      <Bg12 />
      <div style={{ position: "absolute", left: 0, top: 430, width: 1080, height: 1060 }}>
        <GlassQuestion width={1080} height={1060} at={0.05} />
      </div>
      <Title offset={0} out={4.9} top={170} rows={[row([{ w: "Pouquíssimos", at: 0.16 }], 100), small([{ w: "vendedores fazem", at: 0.88 }], 50), row([{ w: "esta pergunta", at: 1.92, color: T.violet }], 100)]} />
      <Title offset={0} out={7.3} top={170} rows={[row([{ w: "Você", at: 4.96 }, { w: "vira o jogo", at: 5.2, color: T.violet }], 100), row([{ w: "e fecha", at: 5.92, color: T.mint }, { w: "mais antes", at: 6.4 }], 100)]} />
      <div style={{ position: "absolute", right: 110, top: 1300, opacity: ver, transform: `scale(${0.5 + ver * 0.5}) rotate(${(1 - ver) * -12}deg)` }}>
        <G radius={999} glow="rgba(54,211,153,0.5)" style={{ padding: "14px 30px" }}>
          <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 40, color: T.mint }}>quer ver?</span>
        </G>
      </div>
    </Enter>
  );
};

// ——— 2 · o erro dos 400 benefícios ———
const BENEFITS = ["Garantia", "Frete grátis", "Suporte 24h", "Bônus", "App", "Relatórios", "Integrações", "Parcelamento", "Treinamento", "Certificado", "Comunidade", "Atualizações", "Brindes", "Cashback", "Templates", "Consultoria", "Dashboard", "Backup", "Acesso vitalício", "Mentoria", "E-book", "Checklist", "Planilhas", "Aulas extra", "Selo", "VIP", "Cupom", "Live", "Podcast", "Grupo"];
export const S2: React.FC = () => {
  const off = 7.2;
  const { t, sp, ez } = useClock(off);
  const n = Math.round(interpolate(t, [9.7, 10.9], [0, 400], { easing: EZ.out, ...clamp }));
  const counter = sp(9.7, SP.pop);
  const focus = ez(12.1, 12.6);
  return (
    <Enter kind="zoom">
      <Bg12 hue="coral" />
      <Title offset={off} out={11.4} rows={[row([{ w: "Muitos vendedores", at: 7.28 }], 80), row([{ w: "cometem o", at: 8.16 }, { w: "erro", at: 8.64, color: T.coral }], 96)]} />
      <Title offset={off} out={99} rows={[row([{ w: "Um", at: 12.16 }, { w: "benefício", at: 12.24, color: T.mint }, { w: "só", at: 12.8 }], 92), small([{ w: "ajuda a vender", at: 12.96 }], 52)]} />
      {/* chuva de benefícios */}
      {BENEFITS.concat(BENEFITS).map((b, k) => {
        const at = 9.3 + k * 0.045;
        const p = sp(at, SP.snap);
        if (p <= 0.01) return null;
        const x = 70 + random(`bx${k}`) * 760;
        const yEnd = 640 + random(`by${k}`) * 700;
        const rot = (random(`br${k}`) - 0.5) * 30;
        return (
          <div key={k} style={{ position: "absolute", left: x, top: -80 + (yEnd + 80) * p, transform: `rotate(${rot * p}deg)`, opacity: (1 - focus * 0.85) * Math.min(1, p * 2), filter: `blur(${focus * 6}px)` }}>
            <G radius={999} tint="rgba(242,92,92,0.10)" style={{ padding: "10px 22px" }}>
              <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 28, color: T.ink, whiteSpace: "nowrap" }}>{b}</span>
            </G>
          </div>
        );
      })}
      {/* contador 0 → 400 */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 640, height: 520, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(8,16,28,0.85) 30%, transparent 70%)", opacity: counter * (1 - focus) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: counter * (1 - focus), transform: `scale(${0.7 + counter * 0.3})` }}>
        <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 300, lineHeight: 1, color: T.coral, textShadow: `0 0 80px ${T.coral}88`, fontVariantNumeric: "tabular-nums" }}>{n}</div>
        <div style={{ fontFamily: T.body, fontWeight: 700, fontSize: 52, color: T.ink, letterSpacing: "0.04em" }}>benefícios de uma vez</div>
      </div>
      {/* o benefício certo */}
      {focus > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", opacity: focus, transform: `scale(${0.7 + focus * 0.3})` }}>
          <G radius={999} glow="rgba(54,211,153,0.6)" tint="rgba(54,211,153,0.14)" style={{ padding: "26px 54px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: T.display, fontWeight: 800, fontSize: 60, color: T.ink }}>
              <Check s={56} /> o benefício certo
            </span>
          </G>
        </div>
      )}
    </Enter>
  );
};

// ——— 3 · quando o diferencial faz sentido para quem compra ———
export const S3: React.FC = () => {
  const off = 13.8;
  const { sp, ez } = useClock(off);
  const card = sp(off + 0.05, SP.soft);
  const fly = ez(14.85, 15.6, 0, 1, EZ.inOut);
  const fit = sp(15.6, SP.pop);
  return (
    <Enter kind="rise">
      <Bg12 hue="mint" />
      <Title offset={off} out={99} rows={[small([{ w: "quando o diferencial", at: 13.84 }], 50), row([{ w: "faz sentido", at: 14.88, color: T.mint }], 104), small([{ w: "pra quem tá comprando", at: 15.36 }], 50)]} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 640, opacity: card, transform: `translateY(${(1 - card) * 80}px)` }}>
        <G style={{ padding: "48px 48px 56px" }} glow={fit > 0.5 ? "rgba(54,211,153,0.45)" : undefined}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Person s={190} tone={fit > 0.5 ? T.mint : T.violet} eyes={fit > 0.5 ? "ok" : "?"} />
            <div>
              <div style={{ fontFamily: T.body, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", color: T.dim }}>O CLIENTE PRECISA DE</div>
              <div style={{ marginTop: 18, width: 420, height: 92, borderRadius: 999, border: `3px dashed ${fit > 0.5 ? T.mint : T.faint}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontWeight: 800, fontSize: 40, color: fit > 0.5 ? T.mint : T.faint }}>
                {fit > 0.5 ? "✓ encaixa" : "?"}
              </div>
            </div>
          </div>
        </G>
      </div>
      {/* a peça certa voa até ao lugar */}
      <div style={{ position: "absolute", left: 300 + fly * 250, top: 1240 - fly * 455, opacity: 1 - fit, transform: `rotate(${(1 - fly) * -8}deg) scale(${1 - fly * 0.1})` }}>
        <G radius={999} glow="rgba(54,211,153,0.6)" tint="rgba(54,211,153,0.16)" style={{ padding: "22px 40px" }}>
          <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 44, color: T.ink }}>o diferencial certo</span>
        </G>
      </div>
    </Enter>
  );
};

// ——— 4 · lista longa é ótimo… o erro é despejar tudo de uma vez ———
export const S4: React.FC = () => {
  const off = 16.3;
  const { t, sp, ez } = useClock(off);
  const list = sp(16.6, SP.soft);
  const scroll = interpolate(t, [16.8, 18.5], [0, 900], { easing: EZ.inOut, ...clamp });
  const boom = ez(21.05, 21.6, 0, 1, EZ.out);
  const stamp = sp(21.9, SP.pop);
  const items = BENEFITS.slice(0, 22);
  return (
    <Enter kind="slide">
      <Bg12 />
      <Title offset={off} out={18.5} rows={[small([{ w: "ter uma", at: 16.32 }], 50), row([{ w: "longa lista", at: 16.72, color: T.violet }], 100), row([{ w: "é ótimo", at: 18.0, color: T.mint }], 84)]} />
      <Title offset={off} out={99} rows={[small([{ w: "mas o grande", at: 18.56 }], 50), row([{ w: "erro", at: 19.04, color: T.coral }], 120), small([{ w: "é apresentar todos", at: 20.08 }, { w: "de uma vez só", at: 21.6 }], 50)]} />
      <div style={{ position: "absolute", left: 220, right: 220, top: 640, height: 760, opacity: list }}>
        <G style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 30 - scroll }}>
            {items.map((b, k) => {
              const a = (k / items.length) * Math.PI * 2;
              const dx = Math.cos(a + k) * 900 * boom;
              const dy = Math.sin(a * 1.3 + k) * 900 * boom;
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, height: 72, padding: "0 36px", fontFamily: T.body, fontWeight: 700, fontSize: 34, color: T.ink, transform: `translate(${dx}px, ${dy}px) rotate(${boom * (k % 2 ? 40 : -40)}deg)`, opacity: 1 - boom * 0.8 }}>
                  <Check s={34} /> {b}
                </div>
              );
            })}
          </div>
        </G>
      </div>
      {stamp > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "16px 50px", border: `8px solid ${T.coral}`, borderRadius: 24, fontFamily: T.display, fontWeight: 800, fontSize: 110, letterSpacing: "0.08em", color: T.coral, transform: `rotate(-10deg) scale(${2 - stamp})`, opacity: interpolate(stamp, [0, 0.3], [0, 1], clamp), textShadow: `0 0 40px ${T.coral}88`, boxShadow: `0 0 60px -10px ${T.coral}` }}>
            ERRO
          </div>
        </div>
      )}
    </Enter>
  );
};

// ——— 5 · em vez de tagarelar: um negócio simples ———
export const S5: React.FC = () => {
  const off = 22.2;
  const { t, sp, ez } = useClock(off);
  const mute = sp(24.6, SP.pop);
  const simple = sp(25.04, SP.pop);
  const BLA = ["blá blá", "e mais isto…", "blá blá blá", "e também…", "ah, e ainda…", "blá", "sem falar que…", "blá blá"];
  return (
    <Enter kind="blur">
      <Bg12 hue="coral" />
      <Title offset={off} out={99} rows={[small([{ w: "ao invés de ficar", at: 22.56 }], 50), row([{ w: "tagarelando", at: 23.28, color: T.coral }], 104)]} />
      <div style={{ position: "absolute", left: 445, top: 860 }}>
        <Person s={190} tone={T.coral} />
      </div>
      {BLA.map((b, k) => {
        const p = sp(22.5 + k * 0.22, SP.snap);
        const a = -Math.PI / 2 + (k - 3.5) * 0.42;
        const r = 330 + (k % 2) * 60;
        return (
          <div key={k} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 120, top: 950 + Math.sin(a) * r * 0.9 - 20 + Math.sin(t * 3 + k) * 6, opacity: p * (1 - mute), transform: `scale(${(0.6 + p * 0.4) * (1 - mute * 0.5)})` }}>
            <G radius={28} tint="rgba(242,92,92,0.12)" style={{ padding: "14px 24px" }}>
              <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 38, color: T.ink, whiteSpace: "nowrap" }}>{b}</span>
            </G>
          </div>
        );
      })}
      {/* silêncio */}
      {mute > 0.01 && (
        <div style={{ position: "absolute", left: 540 - 80, top: 640, width: 160, height: 160, borderRadius: 80, background: T.coral, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${mute})`, opacity: 1 - ez(25.0, 25.3), boxShadow: `0 0 60px ${T.coral}` }}>
          <svg width={86} height={86} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6" />
          </svg>
        </div>
      )}
      {simple > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", opacity: simple, transform: `translateY(${(1 - simple) * 40}px) scale(${0.7 + simple * 0.3})` }}>
          <G radius={999} glow="rgba(54,211,153,0.55)" tint="rgba(54,211,153,0.14)" style={{ padding: "24px 60px" }}>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 46, color: T.ink, whiteSpace: "nowrap" }}>
              faz um negócio <span style={{ color: T.mint }}>simples</span>
            </span>
          </G>
        </div>
      )}
    </Enter>
  );
};

// ——— 6 · a pergunta: "O que você NÃO quer?" ———
export const S6: React.FC = () => {
  const off = 25.8;
  const { t, sp } = useClock(off);
  const pad = sp(26.9, SP.soft);
  const q = "O que você NÃO quer?";
  const n = Math.max(0, Math.min(q.length, Math.floor((t - 27.62) * 30)));
  return (
    <Enter kind="iris">
      <Bg12 />
      <div style={{ position: "absolute", left: 190, top: 120, width: 700, height: 700 }}>
        <GlassQuestion width={700} height={700} at={0.1} color2={T.mint} />
      </div>
      <Title offset={off} out={99} top={800} rows={[small([{ w: "pergunta para o seu cliente", at: 25.84 }], 48)]} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 900, opacity: pad, transform: `translateY(${(1 - pad) * 60}px) rotate(-1.5deg)` }}>
        <G style={{ padding: "38px 50px 54px" }} glow="rgba(46,196,214,0.45)">
          <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.2em", color: T.violet }}>ANOTA AÍ</div>
          <div style={{ marginTop: 18, minHeight: 260, fontFamily: T.display, fontWeight: 800, fontSize: 92, lineHeight: 1.08, color: T.ink }}>
            {q.slice(0, n).split("NÃO").map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span style={{ color: T.coral, textShadow: `0 0 40px ${T.coral}88` }}>NÃO</span>}
              </React.Fragment>
            ))}
            {n < q.length && <span style={{ display: "inline-block", width: 8, height: 82, marginLeft: 6, background: T.violet, verticalAlign: "-8px", opacity: Math.floor(t * 4) % 2 ? 1 : 0.2 }} />}
          </div>
        </G>
      </div>
    </Enter>
  );
};

// ——— 7 · é muito mais fácil saber o que NÃO quer ———
const NOT = ["Perder dinheiro", "Dor de cabeça", "Ficar sem suporte", "Atrasos", "Ser enganado"];
export const S7: React.FC = () => {
  const off = 28.8;
  const { t, sp } = useClock(off);
  const cols = sp(30.9, SP.soft);
  return (
    <Enter kind="zoom">
      <Bg12 />
      <Title offset={off} out={99} rows={[small([{ w: "essa pergunta é", at: 29.04 }], 50), row([{ w: "poderosíssima", at: 30.08, color: T.violet }], 84)]} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 560, display: "flex", gap: 30, opacity: cols, transform: `translateY(${(1 - cols) * 60}px)` }}>
        <G style={{ flex: 1, padding: "34px 30px", minHeight: 760 }} tint="rgba(242,92,92,0.08)" glow="rgba(242,92,92,0.35)">
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 44, color: T.coral }}>NÃO QUER</div>
          <div style={{ fontFamily: T.body, fontSize: 26, color: T.dim, marginBottom: 20 }}>responde em segundos</div>
          {NOT.map((x, k) => {
            const p = sp(31.6 + k * 0.32, SP.snap);
            return (
              <div key={x} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, fontFamily: T.body, fontWeight: 700, fontSize: 34, color: T.ink }}>
                <Cross s={34} /> {x}
              </div>
            );
          })}
        </G>
        <G style={{ flex: 1, padding: "34px 30px", minHeight: 760 }} tint="rgba(54,211,153,0.06)">
          <div style={{ fontFamily: T.display, fontWeight: 800, fontSize: 44, color: T.mint }}>QUER</div>
          <div style={{ fontFamily: T.body, fontSize: 26, color: T.dim, marginBottom: 20 }}>fica a pensar…</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: T.display, fontSize: 120, color: T.faint, marginTop: 120, justifyContent: "center" }}>
            ?<span style={{ width: 8, height: 90, background: T.mint, opacity: Math.floor(t * 3) % 2 ? 1 : 0.15 }} />
          </div>
        </G>
      </div>
    </Enter>
  );
};

// ——— 8 · o cérebro trabalha 24 horas para evitar dor ———
export const S8: React.FC = () => {
  const off = 34.4;
  const { t, sp } = useClock(off);
  const ring = sp(34.6, SP.soft);
  const h = Math.round(interpolate(t, [35.4, 36.2], [0, 24], { easing: EZ.out, ...clamp }));
  const pains = [
    { w: "dor", at: 37.52, a: -0.6 },
    { w: "desconforto", at: 38.08, a: 0.5 },
  ];
  return (
    <Enter kind="blur">
      <Bg12 hue="coral" />
      <Title offset={off} out={99} rows={[small([{ w: "o cérebro trabalha", at: 34.48 }], 50), row([{ w: `${h} horas`, at: 35.52, color: T.violet }], 120), small([{ w: "para evitar dor", at: 36.24 }], 50)]} />
      <div style={{ position: "absolute", left: 540 - 300, top: 700, width: 600, height: 600, opacity: ring, transform: `scale(${0.8 + ring * 0.2})` }}>
        <svg width={600} height={600} viewBox="0 0 600 600" style={{ position: "absolute", inset: 0, transform: `rotate(${t * 20}deg)` }}>
          {Array.from({ length: 24 }).map((_, k) => {
            const a = (k / 24) * Math.PI * 2;
            return <line key={k} x1={300 + Math.cos(a) * 270} y1={300 + Math.sin(a) * 270} x2={300 + Math.cos(a) * (k % 6 ? 250 : 236)} y2={300 + Math.sin(a) * (k % 6 ? 250 : 236)} stroke={k % 6 ? T.faint : T.violet} strokeWidth={k % 6 ? 3 : 6} strokeLinecap="round" />;
          })}
          <circle cx={300} cy={300} r={284} fill="none" stroke={T.edge} strokeWidth={2} />
        </svg>
        {/* escudo */}
        <div style={{ position: "absolute", left: 150, top: 150, width: 300, height: 300 }}>
          <G radius={150} style={{ width: 300, height: 300 }} glow="rgba(46,196,214,0.55)">
            <svg width={300} height={300} viewBox="0 0 48 48" style={{ position: "absolute", inset: 0, padding: 70 }}>
              <path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" fill="rgba(46,196,214,0.35)" stroke={T.ink} strokeWidth={2} strokeLinejoin="round" />
              <path d="M17 24l5 5 9-10" stroke={T.mint} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </G>
        </div>
        {pains.map((p) => {
          const s = sp(p.at, SP.pop);
          const bounce = interpolate(s, [0, 1], [1, 0]);
          return s > 0.01 ? (
            <div key={p.w} style={{ position: "absolute", left: 300 + Math.cos(p.a) * (360 + bounce * 200) - 110, top: 300 + Math.sin(p.a) * (360 + bounce * 200) - 30, opacity: s }}>
              <G radius={999} tint="rgba(242,92,92,0.16)" style={{ padding: "12px 26px" }}>
                <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 38, color: T.coral }}>{p.w}</span>
              </G>
            </div>
          ) : null;
        })}
      </div>
    </Enter>
  );
};

// ——— 9 · mostrar que o medo não vai acontecer vs. pintar um cenário idealizado ———
export const S9: React.FC = () => {
  const off = 38.7;
  const { t, sp, ez } = useClock(off);
  const fear = sp(40.9, SP.soft);
  const shield = sp(43.04, SP.pop);
  const partB = ez(43.85, 44.2);
  const paint = sp(44.56, SP.soft);
  const grey = ez(46.48, 47.0);
  const pop = sp(48.6, SP.pop);
  return (
    <Enter kind="rise">
      <Bg12 hue={t < 43.9 ? "mint" : "violet"} />
      {/* A · o medo do cliente → não vai acontecer */}
      <AbsoluteFill style={{ opacity: 1 - partB }}>
        <Title offset={off} out={43.85} rows={[small([{ w: "é muito mais", at: 38.8 }], 50), row([{ w: "fácil e eficiente", at: 39.36, color: T.mint }], 86), small([{ w: "mostrar que o medo", at: 40.88 }], 50)]} />
        <div style={{ position: "absolute", left: 120, right: 120, top: 720, opacity: fear, transform: `translateY(${(1 - fear) * 60}px)` }}>
          <G style={{ padding: "40px 44px" }} tint="rgba(242,92,92,0.10)" glow={shield > 0.5 ? "rgba(54,211,153,0.5)" : "rgba(242,92,92,0.35)"}>
            <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.18em", color: T.coral }}>O MEDO DO CLIENTE</div>
            <div style={{ marginTop: 16, fontFamily: T.display, fontWeight: 800, fontSize: 64, color: T.ink, lineHeight: 1.1 }}>"E se não funcionar comigo?"</div>
            <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 18, opacity: shield, transform: `scale(${0.7 + shield * 0.3})`, transformOrigin: "left" }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: T.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check s={44} c="#10261E" />
              </div>
              <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 52, color: T.mint }}>isso não vai acontecer</span>
            </div>
          </G>
        </div>
      </AbsoluteFill>
      {/* B · o cenário idealizado só na cabeça do vendedor */}
      {partB > 0.01 && (
        <AbsoluteFill style={{ opacity: partB }}>
          <Title offset={off} out={99} rows={[small([{ w: "do que tentar", at: 44.08 }], 50), row([{ w: "pintar um cenário", at: 44.56, color: T.violet }], 84), small([{ w: "idealizado", at: 45.36 }], 56)]} />
          <div style={{ position: "absolute", left: 120, top: 1180 }}>
            <Person s={230} tone={T.violet} />
          </div>
          {[0, 1].map((k) => (
            <div key={k} style={{ position: "absolute", left: 300 + k * 50, top: 1110 - k * 60, width: 34 - k * 8, height: 34 - k * 8, borderRadius: "50%", border: `2px solid ${T.edge}`, background: T.glass, opacity: paint }} />
          ))}
          <div style={{ position: "absolute", left: 330, right: 90, top: 640, opacity: paint * (1 - pop * 0.9), transform: `scale(${(0.8 + paint * 0.2) * (1 - pop * 0.15)})`, transformOrigin: "20% 100%" }}>
            <G radius={60} style={{ padding: 26 }}>
              <div style={{ position: "relative", height: 380, borderRadius: 36, overflow: "hidden", filter: `grayscale(${grey}) brightness(${1 - grey * 0.35})`, background: "linear-gradient(180deg, #DCEBF3, #9EC6DA 48%, #4A6F8A)" }}>
                <div style={{ position: "absolute", left: "50%", top: 150, width: 170, height: 170, marginLeft: -85, borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF, #CFEFF5)", boxShadow: "0 0 80px #CFEFF5" }} />
                <svg width="100%" height={180} viewBox="0 0 400 180" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0 }}>
                  <path d="M0 120 L80 70 L160 110 L240 50 L320 100 L400 60 L400 180 L0 180z" fill="#2E4A5E" opacity={0.85} />
                </svg>
                {Array.from({ length: 6 }).map((_, k) => (
                  <div key={k} style={{ position: "absolute", left: `${12 + k * 15}%`, top: `${12 + (k % 3) * 10}%`, width: 8, height: 8, borderRadius: 4, background: "#fff", opacity: 0.5 + 0.5 * Math.sin(t * 3 + k) }} />
                ))}
              </div>
              <div style={{ marginTop: 18, fontFamily: T.body, fontWeight: 700, fontSize: 32, color: T.dim, textAlign: "center" }}>
                {t < 47.6 ? "o cenário perfeito… que ele nem deseja" : "só na cabeça do vendedor"}
              </div>
            </G>
          </div>
          {pop > 0.01 && (
            <div style={{ position: "absolute", left: 640 - 70, top: 760, width: 140, height: 140, borderRadius: 70, background: T.coral, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop})`, boxShadow: `0 0 50px ${T.coral}` }}>
              <Cross s={80} c="#fff" />
            </div>
          )}
        </AbsoluteFill>
      )}
    </Enter>
  );
};

// ——— 10 · o cliente nem sabe o que quer: sem experiência prévia ———
export const S10: React.FC = () => {
  const off = 49.5;
  const { t, sp } = useClock(off);
  const meter = sp(53.6, SP.soft);
  const items = sp(55.1, SP.snap);
  return (
    <Enter kind="blur">
      <Bg12 />
      <Title offset={off} out={99} rows={[small([{ w: "muitas vezes o cliente", at: 49.84 }], 48), row([{ w: "nem sabe", at: 50.72, color: T.violet }], 104), small([{ w: "o que ele quer", at: 52.08 }], 50)]} />
      {/* nevoeiro com dúvidas */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 520 }}>
        <div style={{ position: "absolute", left: 445, top: 150 }}>
          <Person s={190} tone={T.indigo} eyes="?" look={Math.sin(t * 2)} />
        </div>
        {Array.from({ length: 7 }).map((_, k) => {
          const a = (k / 7) * Math.PI * 2 + t * 0.4;
          return (
            <div key={k} style={{ position: "absolute", left: 540 + Math.cos(a) * 330 - 30, top: 250 + Math.sin(a) * 200 - 40, fontFamily: T.display, fontWeight: 800, fontSize: 70 + (k % 3) * 18, color: k % 2 ? T.violet : T.faint, opacity: 0.4 + 0.4 * Math.sin(t * 2 + k), filter: "blur(1px)" }}>
              ?
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 1150, opacity: meter, transform: `translateY(${(1 - meter) * 40}px)` }}>
        <G style={{ padding: "30px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.body, fontWeight: 800, fontSize: 28, letterSpacing: "0.12em", color: T.dim }}>
            <span>EXPERIÊNCIA PRÉVIA</span>
            <span style={{ color: T.coral }}>0%</span>
          </div>
          <div style={{ marginTop: 16, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ width: `${3 + Math.sin(t * 4) * 1.5}%`, height: "100%", background: T.coral }} />
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 18, opacity: items, transform: `translateY(${(1 - items) * 20}px)` }}>
            {["com o produto", "com o serviço"].map((x) => (
              <div key={x} style={{ flex: 1, padding: "14px 0", borderRadius: 18, border: `1.5px solid ${T.edge}`, textAlign: "center", fontFamily: T.body, fontWeight: 700, fontSize: 30, color: T.ink }}>
                {x}
              </div>
            ))}
          </div>
        </G>
      </div>
    </Enter>
  );
};

// ——— 11 · atue como consultor: medos → preocupações → solução → benefícios ———
const STEPS = [
  { w: "Medos", at: 60.72, c: T.coral },
  { w: "Preocupações", at: 61.2, c: T.coral },
  { w: "Solução", at: 63.2, c: T.mint },
  { w: "Benefícios", at: 63.92, c: T.mint },
];
export const S11: React.FC = () => {
  const off = 57.1;
  const { sp, ez } = useClock(off);
  const badge = sp(59.36, SP.pop);
  const line = ez(60.6, 64.2, 0, 1, EZ.inOut);
  return (
    <Enter kind="zoom">
      <Bg12 hue="mint" />
      <Title offset={off} out={99} rows={[small([{ w: "é fundamental que o vendedor", at: 57.44 }], 46), row([{ w: "atue como", at: 58.64 }], 80), row([{ w: "consultor", at: 59.36, color: T.mint }], 120)]} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 640, height: 820 }}>
        <div style={{ position: "absolute", left: 58, top: 60, width: 6, height: 640, borderRadius: 3, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", left: 58, top: 60, width: 6, height: 640 * line, borderRadius: 3, background: `linear-gradient(180deg, ${T.coral}, ${T.mint})` }} />
        {STEPS.map((s, k) => {
          const p = sp(s.at, SP.snap);
          return (
            <div key={s.w} style={{ position: "absolute", left: 0, top: k * 200, display: "flex", alignItems: "center", gap: 30, opacity: Math.max(0.25, p), transform: `translateX(${(1 - p) * 30}px)` }}>
              <div style={{ width: 122, height: 122, borderRadius: 61, background: p > 0.5 ? s.c : "rgba(255,255,255,0.06)", border: `2px solid ${T.edge}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontWeight: 800, fontSize: 54, color: p > 0.5 ? "#081526" : T.dim, boxShadow: p > 0.5 ? `0 0 40px ${s.c}88` : "none" }}>{k + 1}</div>
              <G radius={28} style={{ padding: "22px 36px" }}>
                <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 52, color: T.ink }}>{s.w}</span>
              </G>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 90, top: 560, opacity: badge, transform: `rotate(${8 - badge * 8}deg) scale(${0.6 + badge * 0.4})` }}>
        <G radius={999} glow="rgba(54,211,153,0.5)" tint="rgba(54,211,153,0.12)" style={{ padding: "12px 28px" }}>
          <span style={{ fontFamily: T.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.14em", color: T.mint }}>CONSULTOR</span>
        </G>
      </div>
    </Enter>
  );
};
