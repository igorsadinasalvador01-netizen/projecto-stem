import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { clamp } from "../components/Motion";
import { PerfilCard } from "../components/PerfilFinal";
import { BrainIcon, Chip, GemIcon, Headline, HookIcon, Paper, Spark, useClock } from "./Kit10";
import { EASE, F10, P10, SPR } from "./look10";
import { SCENES10, TAP10, W10 as W } from "./timeline10";

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

// ——— 4 · "Aqui vem o truque." — o único instante a preto (iris que abre e fecha) ———
export const Truque10: React.FC = () => {
  const { t, sp, ez } = useClock(0);
  if (t < W.aqui - 0.08 || t > W.retire + 0.08) return null;
  const open = ez(W.aqui - 0.08, W.aqui + 0.2, 0, 1, EASE.out);
  const close = ez(W.retire - 0.24, W.retire + 0.06, 0, 1, EASE.in);
  const r = 1500 * open * (1 - close);
  const words: [string, number][] = [
    ["Aqui", W.aqui],
    ["vem", W.vem],
    ["o", W.o],
  ];
  const tr = sp(W.truque - 0.03, SPR.pop);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 50%)`, background: "radial-gradient(900px 900px at 50% 45%, #1A1F29, #07080B 70%)" }}>
      <AbsoluteFill style={{ background: `radial-gradient(500px 360px at 50% 56%, ${P10.amber}22, transparent 70%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 22, fontFamily: F10.display, fontWeight: 600, fontSize: 74, color: "#fff", letterSpacing: "-0.03em" }}>
        {words.map(([w, at]) => {
          const p = sp(at - 0.03, SPR.snap);
          return (
            <span key={w} style={{ opacity: interpolate(p, [0, 0.5], [0, 1], clamp), transform: `translateY(${(1 - p) * 30}px)`, display: "inline-block" }}>
              {w}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: F10.serif, fontStyle: "italic", fontSize: 250, lineHeight: 1, color: P10.amber, textShadow: `0 0 60px ${P10.amber}66`, opacity: interpolate(tr, [0, 0.4], [0, 1], clamp), transform: `scale(${0.7 + tr * 0.3}) rotate(${(1 - tr) * -4}deg)` }}>
        truque.
      </div>
      <Spark x={250} y={820} s={56} at={W.truque + 0.05} />
      <Spark x={850} y={1060} s={40} at={W.truque + 0.12} />
      <Spark x={800} y={760} s={28} at={W.truque + 0.18} c="#fff" />
    </AbsoluteFill>
  );
};

// ——— 9 · "É o efeito isca." ———
export const Efeito10: React.FC = () => {
  const off = SCENES10.efeito.from;
  const { t, sp, ez } = useClock(off);
  const line = ez(off + 0.05, off + 0.5, 0, 1, EASE.out);
  const sw = Math.sin((t - off) * 3.2) * 7 * Math.exp(-(t - off) * 0.6);
  const ef = sp(W.efeito - 0.03, SPR.snap);
  const isca = sp(W.isca2 - 0.03, SPR.pop);
  const eo = sp(W.e2 - 0.03, SPR.snap);
  const hookY = -260 + 520 * line;
  const def = sp(W.efeito + 0.15, SPR.soft);
  return (
    <Enter kind="whip">
      <Paper />
      {/* a isca pendurada: linha, anzol e a etiqueta da opção barata */}
      <div style={{ position: "absolute", left: 540 - 1.5, top: -300, width: 3, height: hookY + 300 + 6, background: P10.ink }} />
      <div style={{ position: "absolute", left: 540 - 25, top: hookY, transform: `rotate(${sw}deg)`, transformOrigin: "25px 0px" }}>
        <HookIcon s={40} c={P10.ink} w={3.4} />
        <div style={{ position: "absolute", left: -140, top: 50, width: 320, padding: "34px 0 26px", borderRadius: 30, background: "#fff", border: `1.5px solid ${P10.line2}`, boxShadow: "0 40px 70px -30px rgba(11,13,18,0.35)", textAlign: "center", transform: "rotate(-6deg)", transformOrigin: "50% 0%" }}>
          <div style={{ position: "absolute", left: 148, top: 10, width: 24, height: 24, borderRadius: 12, border: `4px solid ${P10.line2}` }} />
          <div style={{ fontFamily: F10.mono, fontSize: 20, letterSpacing: "0.14em", color: P10.gray, marginTop: 12 }}>OPÇÃO B</div>
          <div style={{ fontFamily: F10.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.045em", color: P10.grayDeep, lineHeight: 1.05 }}>R$ 167</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <Chip bg={P10.coralSoft} color={P10.coral} size={22}>
              3 benefícios
            </Chip>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: F10.display, fontWeight: 500, fontSize: 64, color: P10.grayDeep, letterSpacing: "-0.02em", opacity: eo, transform: `translateY(${(1 - eo) * 24}px)` }}>É o</div>
        <div style={{ fontFamily: F10.display, fontWeight: 900, fontSize: 190, lineHeight: 1, letterSpacing: "-0.055em", color: P10.ink, opacity: interpolate(ef, [0, 0.4], [0, 1], clamp), transform: `translateY(${(1 - ef) * 50}px) scale(${0.92 + ef * 0.08})`, filter: `blur(${(1 - Math.min(1, ef)) * 8}px)` }}>efeito</div>
        <div style={{ position: "relative", fontFamily: F10.serif, fontStyle: "italic", fontSize: 280, lineHeight: 0.95, color: P10.coral, opacity: interpolate(isca, [0, 0.4], [0, 1], clamp), transform: `scale(${0.7 + isca * 0.3}) rotate(${(1 - isca) * -6}deg)` }}>
          isca.
          <div style={{ position: "absolute", left: 20, right: 30, bottom: 18, height: 16, borderRadius: 8, background: P10.coral, opacity: 0.18, transform: `scaleX(${ez(W.isca2 + 0.1, W.isca2 + 0.45, 0, 1, EASE.out)})`, transformOrigin: "left" }} />
        </div>
      </div>
      {/* definição: o que é a isca */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 1430, textAlign: "center", fontFamily: F10.display, fontWeight: 500, fontSize: 44, lineHeight: 1.25, letterSpacing: "-0.02em", color: P10.grayDeep, opacity: def, transform: `translateY(${(1 - def) * 26}px)` }}>
        uma opção <b style={{ color: P10.ink, fontWeight: 800 }}>pior</b> que faz a sua
        <br />
        parecer a <b style={{ color: P10.turqDeep, fontWeight: 800 }}>melhor escolha</b>
      </div>
      <Spark x={830} y={1140} s={54} at={W.isca2 + 0.08} c={P10.coral} offset={off} />
      <Spark x={240} y={1080} s={34} at={W.isca2 + 0.16} c={P10.amber} offset={off} />
    </Enter>
  );
};

// ——— 10 · "Psicologia pura aplicada nas vendas." ———
const BARS = [0.32, 0.44, 0.5, 0.66, 1];
export const Psico10: React.FC = () => {
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
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, ${P10.violet}${glow > 0.5 ? "30" : "1C"}, transparent 68%)` }} />
        {Array.from({ length: 7 }).map((_, k) => {
          const a = (t - off) * (0.9 + k * 0.12) + k * 0.9;
          const rr = 150 + (k % 3) * 18;
          return <div key={k} style={{ position: "absolute", left: 160 + Math.cos(a) * rr - 6, top: 160 + Math.sin(a) * rr * 0.55 - 6, width: 12, height: 12, borderRadius: 6, background: k % 2 ? P10.turq : P10.violet, opacity: 0.4 + glow * 0.6 }} />;
        })}
        <BrainIcon s={320} glow={glow} w={1.6} />
      </div>
      <Headline
        offset={off}
        top={560}
        out={99}
        rows={[
          { size: 120, words: [{ w: "Psicologia", at: W.psicologia2 }] },
          { size: 130, words: [{ w: "pura", at: W.pura, serif: true, color: P10.violet }] },
          { size: 60, weight: 600, color: P10.grayDeep, words: [{ w: "aplicada", at: W.aplicada }, { w: "nas", at: W.nas }, { w: "vendas", at: W.vendas, color: "#0A9A5B" }] },
        ]}
      />
      {/* o feixe do cérebro até às vendas */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M 700 420 C 1000 520, 1010 980, 820 1150" stroke={P10.turq} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: `${beam} 1` }} />
      </svg>
      {/* gráfico de vendas a subir */}
      <div style={{ position: "absolute", left: 250, width: 580, top: 1160, height: 360, display: "flex", alignItems: "flex-end", gap: 22, opacity: chart }}>
        {BARS.map((h, k) => {
          // as barras cinzentas sobem em "aplicada"; a verde dispara em "vendas"
          const g = sp(k === BARS.length - 1 ? W.vendas : W.aplicada + 0.05 + k * 0.08, SPR.snap);
          return <div key={k} style={{ flex: 1, height: `${h * 100 * g}%`, borderRadius: 16, background: k === BARS.length - 1 ? `linear-gradient(180deg, ${P10.lime}, #0A9A5B)` : P10.line2, boxShadow: k === BARS.length - 1 ? `0 0 40px ${P10.lime}66` : "none" }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 250, width: 580, top: 1528, height: 3, background: P10.line2, opacity: chart }} />
      <div style={{ position: "absolute", left: 640, top: 1060, opacity: arrow, transform: `translateY(${(1 - arrow) * 30}px) scale(${0.7 + arrow * 0.3})` }}>
        <Chip bg={P10.lime} color="#fff" size={34}>
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
export const Siga10: React.FC = () => {
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
          { size: 92, words: [{ w: "dicas valiosas", at: W.dicas, pill: P10.amberSoft }] },
          { size: 56, weight: 600, color: P10.grayDeep, words: [{ w: "de marketing", at: W.de2 }] },
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
      <Spark x={960} y={520} s={44} at={TAP10 + 0.1} c={P10.turq} offset={off} />
      <Spark x={150} y={1350} s={36} at={W.valiosas + 0.1} offset={off} />
    </Enter>
  );
};
