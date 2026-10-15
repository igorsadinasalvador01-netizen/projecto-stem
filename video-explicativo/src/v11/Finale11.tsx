import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { clamp } from "../components/Motion";
import { PerfilCard } from "../components/PerfilFinal";
import { BrainIcon, Chip, GemIcon, Headline, HookIcon, OldPaper, Paper, Spark, useClock } from "./Kit11";
import { EASE, F11, N11, P11, SPR } from "./look11";
import { SCENES10, TAP10, W10 as W } from "../v10/timeline10";

// ——— entradas de cena (0,45 s) ———
const Enter: React.FC<{ kind: "whip" | "zoom" | "iris"; children: React.ReactNode }> = ({ kind, children }) => {
  const { frame, fps } = useClock();
  const p = interpolate(frame, [0, Math.round(0.45 * fps)], [0, 1], { easing: EASE.out, ...clamp });
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (kind === "whip")
    return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100}%)`, filter: `blur(${(1 - p) * 10}px)`, boxShadow: "-80px 0 120px rgba(11,13,18,0.18)" }}>{children}</AbsoluteFill>;
  if (kind === "zoom") return <AbsoluteFill style={{ opacity: Math.min(1, p * 1.6), transform: `scale(${0.86 + 0.14 * p})`, filter: `blur(${(1 - p) * 12}px)` }}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ clipPath: `circle(${p * 1400}px at 50% 52%)` }}>{children}</AbsoluteFill>;
};

// ——— 10 · "Psicologia pura aplicada nas vendas." ———
const BARS = [0.32, 0.44, 0.5, 0.66, 1];
export const Psico11: React.FC = () => {
  const off = SCENES10.psico.from;
  const { t, sp, ez } = useClock(off);
  const brain = sp(W.psicologia2, SPR.pop);
  const glow = ez(W.pura, W.pura + 0.4);
  const beam = ez(W.aplicada - 0.05, W.vendas + 0.05, 0, 1, EASE.inOut);
  const chart = sp(W.aplicada + 0.1, SPR.soft);
  const arrow = sp(W.vendas + 0.25, SPR.pop);
  return (
    <Enter kind="zoom">
      <Paper />
      {/* cérebro com sinapses a orbitar */}
      <div style={{ position: "absolute", left: 540 - 160, top: 210, width: 320, height: 320, transform: `scale(${0.6 + brain * 0.4})`, opacity: interpolate(brain, [0, 0.3], [0, 1], clamp) }}>
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, ${P11.violet}${glow > 0.5 ? "30" : "1C"}, transparent 68%)` }} />
        {Array.from({ length: 7 }).map((_, k) => {
          const a = (t - off) * (0.9 + k * 0.12) + k * 0.9;
          const rr = 150 + (k % 3) * 18;
          return <div key={k} style={{ position: "absolute", left: 160 + Math.cos(a) * rr - 6, top: 160 + Math.sin(a) * rr * 0.55 - 6, width: 12, height: 12, borderRadius: 6, background: k % 2 ? P11.turq : P11.violet, opacity: 0.4 + glow * 0.6 }} />;
        })}
        <BrainIcon s={320} glow={glow} w={1.6} />
      </div>
      <Headline
        offset={off}
        top={560}
        out={99}
        rows={[
          { size: 120, words: [{ w: "Psicologia", at: W.psicologia2 }] },
          { size: 130, words: [{ w: "pura", at: W.pura, serif: true, color: P11.violet }] },
          { size: 60, weight: 600, color: P11.grayDeep, words: [{ w: "aplicada", at: W.aplicada }, { w: "nas", at: W.nas }, { w: "vendas", at: W.vendas, color: P11.limeText }] },
        ]}
      />
      {/* o feixe do cérebro até às vendas */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M 700 420 C 1000 520, 1010 980, 820 1150" stroke={P11.turq} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${beam} 1` }} />
      </svg>
      {/* gráfico de vendas a subir */}
      <div style={{ position: "absolute", left: 250, width: 580, top: 1160, height: 360, display: "flex", alignItems: "flex-end", gap: 22, opacity: chart }}>
        {BARS.map((h, k) => {
          // as barras cinzentas sobem em "aplicada"; a verde dispara em "vendas"
          const g = sp(k === BARS.length - 1 ? W.vendas : W.aplicada + 0.05 + k * 0.08, SPR.snap);
          return <div key={k} style={{ flex: 1, height: `${h * 100 * g}%`, borderRadius: 16, background: k === BARS.length - 1 ? `linear-gradient(180deg, ${P11.lime}, ${P11.limeText})` : P11.line2, boxShadow: k === BARS.length - 1 ? `0 0 40px ${P11.lime}66` : "none" }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 250, width: 580, top: 1528, height: 3, background: P11.line2, opacity: chart }} />
      <div style={{ position: "absolute", left: 640, top: 1060, opacity: arrow, transform: `translateY(${(1 - arrow) * 30}px) scale(${0.7 + arrow * 0.3})` }}>
        <Chip bg={P11.lime} color="#fff" size={34}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 17l6-6 4 4 7-8M15 7h6v6" />
          </svg>
          vendas
        </Chip>
      </div>
    </Enter>
  );
};

// ——— 11 · "Siga para mais dicas valiosas de marketing." — fecha sempre com o perfil real ———
export const Siga11: React.FC = () => {
  const off = SCENES10.siga.from;
  const { t, frame, fps, sp } = useClock(off);
  const card = sp(off + 0.05, SPR.soft);
  // o toque em "Seguir" depois de o perfil assentar (lê-se primeiro, toca-se depois)
  const tapAt = Math.round((TAP10 - off) * fps);
  return (
    <Enter kind="iris">
      <Paper warm={1} />
      <Headline
        offset={off}
        top={190}
        out={99}
        rows={[
          { size: 80, words: [{ w: "Siga", at: W.siga }, { w: "para mais", at: W.para }] },
          { size: 92, words: [{ w: "dicas valiosas", at: W.dicas, pill: P11.amberSoft }] },
          { size: 56, weight: 600, color: P11.grayDeep, words: [{ w: "de marketing", at: W.de2 }] },
        ]}
      />
      <div style={{ position: "absolute", left: 40, top: 500, opacity: interpolate(card, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - card) * 90}px) scale(${0.94 + card * 0.06})`, transformOrigin: "50% 0%" }}>
        <PerfilCard width={1000} tapAt={tapAt} />
      </div>
      {/* mais dicas: os vídeos de marketing já publicados (miniaturas reais) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", gap: 22 }}>
        {[6, 7, 8].map((v, k) => {
          const p = sp(W.valiosas + k * 0.09, SPR.snap);
          return (
            <div key={v} style={{ position: "relative", width: 200, height: 270, borderRadius: 22, overflow: "hidden", border: "4px solid #fff", boxShadow: "0 30px 50px -24px rgba(11,13,18,0.45)", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - p) * 60}px) rotate(${(k - 1) * 4}deg) scale(${1 + (t - off) * 0.01})` }}>
              <Img src={staticFile(`v9h/thumbs/v${v}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 58, height: 58, margin: -29, borderRadius: 29, background: "rgba(255,255,255,0.3)", border: "2px solid rgba(255,255,255,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, marginLeft: 6, borderLeft: "18px solid #fff", borderTop: "12px solid transparent", borderBottom: "12px solid transparent" }} />
              </div>
              {k === 1 && (
                <div style={{ position: "absolute", left: 10, top: 10 }}>
                  <GemIcon s={34} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Spark x={960} y={520} s={44} at={TAP10 + 0.1} c={P11.turq} offset={off} />
      <Spark x={150} y={1350} s={36} at={W.valiosas + 0.1} offset={off} />
    </Enter>
  );
};

// ═══════ os dois únicos momentos nostálgicos ═══════
// ——— entradas de cena à moda antiga ———
const EnterOld: React.FC<{ kind: "page" | "iris" | "dissolve"; children: React.ReactNode }> = ({ kind, children }) => {
  const { frame, fps } = useClock();
  const p = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], { easing: EASE.out, ...clamp });
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (kind === "page")
    return (
      <AbsoluteFill style={{ transform: `perspective(2400px) rotateY(${(1 - p) * -70}deg)`, transformOrigin: "0% 50%", boxShadow: `-40px 0 80px rgba(60,40,20,${0.4 * (1 - p)})` }}>
        {children}
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(60,40,20,${0.35 * (1 - p)}), transparent 60%)` }} />
      </AbsoluteFill>
    );
  if (kind === "dissolve") return <AbsoluteFill style={{ opacity: p, filter: `blur(${(1 - p) * 14}px) sepia(${1 - p})` }}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ clipPath: `circle(${p * 1400}px at 50% 50%)` }}>{children}</AbsoluteFill>;
};

// ——— 4 · "Aqui vem o truque." — intertítulo de cinema mudo (íris antiga) ———
export const Truque11: React.FC = () => {
  const { t, frame, sp, ez } = useClock(0);
  if (t < W.aqui - 0.08 || t > W.retire + 0.08) return null;
  const open = ez(W.aqui - 0.08, W.aqui + 0.2, 0, 1, EASE.out);
  const close = ez(W.retire - 0.24, W.retire + 0.06, 0, 1, EASE.in);
  const r = 1500 * open * (1 - close);
  const tr = sp(W.truque - 0.03, SPR.soft);
  const weave = Math.sin(frame * 1.7) * 1.5;
  const words: [string, number][] = [
    ["Aqui", W.aqui],
    ["vem", W.vem],
    ["o", W.o],
  ];
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 50%)`, background: N11.night }}>
      <AbsoluteFill style={{ background: "radial-gradient(700px 900px at 50% 48%, rgba(120,90,50,0.35), transparent 70%)" }} />
      {/* moldura ornamentada do intertítulo */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 470, bottom: 470, border: "3px solid rgba(246,231,204,0.7)", transform: `translateY(${weave}px)` }}>
        <div style={{ position: "absolute", inset: 12, border: "1.5px solid rgba(246,231,204,0.45)" }} />
        {[
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ].map(([x, y], i) => (
          <svg key={i} width={70} height={70} viewBox="0 0 40 40" style={{ position: "absolute", left: x ? undefined : -18, right: x ? -18 : undefined, top: y ? undefined : -18, bottom: y ? -18 : undefined, transform: `scale(${x ? -1 : 1}, ${y ? -1 : 1})` }}>
            <path d="M4 36 C 4 16, 16 4, 36 4 M10 36 C 10 20, 20 10, 36 10 M18 22 a4 4 0 1 0 0.1 0" stroke="#F6E7CC" strokeWidth={2} fill="none" opacity={0.75} />
          </svg>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", gap: 24, fontFamily: F11.serif, fontSize: 84, color: "#F6E7CC" }}>
          {words.map(([w, at]) => {
            const p = sp(at - 0.03, SPR.snap);
            return (
              <span key={w} style={{ opacity: interpolate(p, [0, 0.5], [0, 1], clamp), filter: `blur(${(1 - Math.min(1, p)) * 6}px)` }}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center", fontFamily: F11.serif, fontStyle: "italic", fontSize: 250, lineHeight: 1, color: N11.mustard, opacity: interpolate(tr, [0, 0.4], [0, 1], clamp), transform: `scale(${0.85 + tr * 0.15})`, textShadow: "0 0 40px rgba(212,149,42,0.45)" }}>
          truque.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ——— 9 · "É o efeito isca." — entrada de dicionário antigo ———
export const Efeito11: React.FC = () => {
  const off = SCENES10.efeito.from;
  const { t, sp, ez } = useClock(off);
  const line = ez(off + 0.05, off + 0.5, 0, 1, EASE.out);
  const sw = Math.sin((t - off) * 3.2) * 7 * Math.exp(-(t - off) * 0.6);
  const eo = sp(W.e2 - 0.03, SPR.soft);
  const ef = sp(W.efeito - 0.03, SPR.soft);
  const isca = sp(W.isca2 - 0.03, SPR.pop);
  const def = sp(W.efeito + 0.15, SPR.soft);
  const hookY = -260 + 590 * line;
  return (
    <EnterOld kind="page">
      <OldPaper />
      <div style={{ position: "absolute", left: 90, right: 90, top: 120, display: "flex", justifyContent: "space-between", fontFamily: F11.mono, fontSize: 20, letterSpacing: "0.2em", color: N11.sepia, borderBottom: `1.5px solid ${N11.sepia}`, paddingBottom: 12 }}>
        <span>DICIONÁRIO DE VENDAS</span>
        <span>P. 47</span>
      </div>
      {/* a isca pendurada, com a etiqueta antiga da opção B */}
      <div style={{ position: "absolute", left: 540 - 1.5, top: -300, width: 3, height: hookY + 306, background: N11.inkSoft }} />
      <div style={{ position: "absolute", left: 540 - 25, top: hookY, transform: `rotate(${sw}deg)`, transformOrigin: "25px 0px" }}>
        <HookIcon s={40} c={N11.inkSoft} w={3.4} />
        <div style={{ position: "absolute", left: -140, top: 50, width: 320, padding: "30px 0 22px", background: N11.card, border: `1.5px solid ${N11.sepia}`, boxShadow: "0 30px 50px -26px rgba(60,40,20,0.5)", textAlign: "center", transform: "rotate(-6deg)", transformOrigin: "50% 0%", clipPath: "polygon(12% 0, 88% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)" }}>
          <div style={{ position: "absolute", left: 148, top: 10, width: 24, height: 24, borderRadius: 12, border: `3px solid ${N11.sepia}` }} />
          <div style={{ fontFamily: F11.mono, fontSize: 18, letterSpacing: "0.16em", color: N11.sepia, marginTop: 14 }}>OPÇÃO B</div>
          <div style={{ fontFamily: F11.serif, fontSize: 88, color: N11.inkSoft, lineHeight: 1.05 }}>R$ 167</div>
          <div style={{ fontFamily: F11.hand, fontWeight: 600, fontSize: 34, color: N11.red }}>só 3 benefícios</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 760 }}>
        <div style={{ fontFamily: F11.serif, fontStyle: "italic", fontSize: 58, color: N11.sepia, opacity: eo, transform: `translateY(${(1 - eo) * 20}px)` }}>É o…</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28, flexWrap: "wrap" }}>
          <span style={{ fontFamily: F11.serif, fontSize: 170, lineHeight: 1, color: N11.ink, opacity: interpolate(ef, [0, 0.4], [0, 1], clamp), filter: `blur(${(1 - Math.min(1, ef)) * 8}px)` }}>efeito</span>
          <span style={{ fontFamily: F11.serif, fontStyle: "italic", fontSize: 230, lineHeight: 0.95, color: N11.rust, opacity: interpolate(isca, [0, 0.4], [0, 1], clamp), transform: `scale(${0.8 + isca * 0.2})`, display: "inline-block", transformOrigin: "left bottom" }}>isca.</span>
        </div>
        <div style={{ marginTop: 26, fontFamily: F11.mono, fontSize: 24, color: N11.sepia, opacity: def }}>[e·fei·to ís·ca] · s.m.</div>
        <div style={{ marginTop: 14, fontFamily: F11.serif, fontSize: 50, lineHeight: 1.22, color: N11.ink, opacity: def, transform: `translateY(${(1 - def) * 20}px)` }}>
          Uma opção <i style={{ color: N11.red }}>pior</i>, criada de propósito, que faz a sua parecer a <i style={{ color: N11.teal }}>melhor escolha</i>.
        </div>
      </div>
    </EnterOld>
  );
};
