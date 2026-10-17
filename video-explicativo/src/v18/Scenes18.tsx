import React from "react";
import { AbsoluteFill, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { PerfilCard } from "../components/PerfilFinal";
import { clamp, EZ, SP } from "../kit/Kit";
import { M, OUT_FRAMES, punch, useClock18 as useClock } from "./cuts18";
import { useFx18 } from "./Fx18";
import { T18 as T, ZONE18 as Z } from "./theme18";
import { Card, ez, Icon, Label, Pill, pop, Serif, Tag } from "./ui18";

// ——— filmagem (sempre visível; a cor nunca a substitui) ———
export const LAST18 = OUT_FRAMES - 4;
const Footage: React.FC<{ src: string; transparent?: boolean; style?: React.CSSProperties }> = ({ src, transparent, style }) => {
  const frame = useCurrentFrame();
  return (
    <Freeze frame={LAST18} active={frame > LAST18}>
      <OffthreadVideo src={staticFile(src)} muted transparent={transparent} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
    </Freeze>
  );
};
const GRADE = "contrast(1.05) saturate(1.04)";
const pbFilter = (pb: number) => (pb < 0.002 ? GRADE : `${GRADE} grayscale(${pb}) contrast(${1 + 0.2 * pb}) brightness(${1 - 0.05 * pb})`);
const Graded: React.FC<{ src: string; transparent?: boolean }> = ({ src, transparent }) => {
  const { pb, reveal } = useFx18();
  if (reveal > 0 && reveal < 1)
    return (
      <>
        <AbsoluteFill>
          <Footage src={src} transparent={transparent} style={{ filter: pbFilter(1) }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `circle(${reveal * 125}% at 42% 42%)` }}>
          <Footage src={src} transparent={transparent} style={{ filter: GRADE }} />
        </AbsoluteFill>
      </>
    );
  return <Footage src={src} transparent={transparent} style={{ filter: pbFilter(reveal >= 1 ? 0 : pb) }} />;
};

// ——— modo "cartão" da referência: ficas grande num cartão de borda azul; à volta, a própria
//     filmagem desfocada (com a grelha de pontos da referência) ———
export const cardK = (t: number) => ez(t, 27.25, 27.8, EZ.out) * (1 - ez(t, 33.15, 33.6));
const CARD = { l: 120, t: 600, r: 960, b: 1790, rad: 44, s: 0.8, ox: 540, oy: 1250 };
const cardTransform = (k: number) => `translate(${CARD.ox}px, ${CARD.oy}px) scale(${1 - (1 - CARD.s) * k}) translate(${-CARD.ox}px, ${-CARD.oy}px)`;
const zoomOrigin = "42% 44%";

export const Plate: React.FC = () => {
  const { t, to } = useClock();
  const { zoom } = useFx18();
  const k = cardK(t);
  const dz = digitalZoomAt(to);
  return (
    <AbsoluteFill>
      {k > 0.002 && (
        <AbsoluteFill style={{ opacity: Math.min(1, k * 3) }}>
          <Footage src="v18/plate_c.mp4" style={{ filter: "blur(30px) brightness(1.06) saturate(0.92)", transform: "scale(1.15)" }} />
          <AbsoluteFill style={{ background: "rgba(246,247,249,0.16)" }} />
          <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(10,26,47,0.16) 1.4px, transparent 1.6px)", backgroundSize: "28px 28px" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ clipPath: k > 0.002 ? `inset(${CARD.t * k}px ${(1080 - CARD.r) * k}px ${(1920 - CARD.b) * k}px ${CARD.l * k}px round ${CARD.rad * k}px)` : undefined }}>
        <AbsoluteFill style={{ transform: cardTransform(k) }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${punch(to) * zoom * dz})`, transformOrigin: zoomOrigin }}>
            <Graded src="v18/plate_c.mp4" />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {k > 0.002 && <div style={{ position: "absolute", left: CARD.l, top: CARD.t, width: CARD.r - CARD.l, height: CARD.b - CARD.t, borderRadius: CARD.rad, border: `4px solid ${T.blue}`, boxShadow: `0 40px 90px -30px rgba(10,26,47,0.55), 0 0 0 1px rgba(255,255,255,0.4)`, opacity: k }} />}
    </AbsoluteFill>
  );
};
export const Person: React.FC = () => {
  const { t, to } = useClock();
  const { zoom } = useFx18();
  const k = cardK(t);
  const dz = digitalZoomAt(to);
  if (k > 0.002) return null; // no modo cartão a pessoa já está dentro do cartão
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch(to) * zoom * dz})`, transformOrigin: zoomOrigin }}>
        <Graded src="v18/fg_c.webm" transparent />
      </div>
    </AbsoluteFill>
  );
};

// ——— 05 · zoom digital (usado na filmagem e no visor do efeito) ———
const DZ_A = 61.0;
const DZ_B = 62.85;
export const digitalZoomAt = (to: number) => {
  const a = M(DZ_A);
  const b = M(DZ_B);
  if (to < a || to > b + 0.45) return 1;
  const step = (at: number, from: number, z: number) => from + (z - from) * interpolate(to, [at, at + 0.1], [0, 1], clamp);
  const up = step(a + 0.3, step(a, 1, 1.16), 1.32);
  const back = interpolate(to, [b, b + 0.4], [0, 1], { easing: EZ.inOut, ...clamp });
  return up + (1 - up) * back;
};

// ——— marca do perfil + etiqueta do efeito ativo ———
export const HUD18: React.FC<{ fx?: { n: string; name: string } }> = ({ fx }) => {
  const { t } = useClock();
  return (
    <>
      <div style={{ position: "absolute", left: 36, top: 52, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 10px", borderRadius: 999, background: "rgba(255,255,255,0.86)", boxShadow: "0 10px 24px -14px rgba(10,26,47,0.5)" }}>
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth={2}>
          <rect x={3} y={3} width={18} height={18} rx={5} />
          <circle cx={12} cy={12} r={4.2} />
          <circle cx={17.3} cy={6.7} r={1.1} fill={T.ink} stroke="none" />
        </svg>
        <span style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 17, letterSpacing: "0.08em", color: T.ink }}>@SERGIO_SALVADOR10</span>
      </div>
      {fx && t < 79 && (
        <div style={{ position: "absolute", right: 36, top: 56, padding: "7px 14px", borderRadius: 999, background: T.blue, fontFamily: T.mono, fontWeight: 500, fontSize: 16, letterSpacing: "0.12em", color: "#fff", boxShadow: "0 10px 24px -12px rgba(31,107,255,0.7)" }}>
          FX {fx.n} · {fx.name}
        </div>
      )}
    </>
  );
};

// ——— 8,8–13,9 · medir a obra: cotas desenhadas na parede + "só olhar" + quantidades inventadas ———
export const Measure: React.FC = () => {
  const { t, to, sp } = useClock();
  if (t < 8.6 || t > 14.3) return null;
  const draw = ez(t, 9.28, 10.0, EZ.out);
  const out = ez(t, 13.9, 14.25, EZ.in);
  const look = sp(11.04, SP.snap) * (1 - ez(t, 12.8, 13.0));
  const inv = sp(12.99, SP.snap);
  const scramble = Math.floor(to * 14) % 997;
  const dim = (x1: number, y1: number, x2: number, y2: number, label: string, lx: number, ly: number) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * draw} y2={y1 + (y2 - y1) * draw} stroke="#fff" strokeWidth={3} style={{ filter: "drop-shadow(0 2px 4px rgba(10,26,47,0.6))" }} />
        {[0, 1].map((e) => {
          const px = e ? x2 : x1;
          const py = e ? y2 : y1;
          const vert = Math.abs(x2 - x1) < 1;
          return <line key={e} x1={vert ? px - 14 : px} y1={vert ? py : py - 14} x2={vert ? px + 14 : px} y2={vert ? py : py + 14} stroke="#fff" strokeWidth={3} opacity={draw} />;
        })}
        {len > 0 && (
          <foreignObject x={lx} y={ly} width={180} height={50} opacity={interpolate(draw, [0.6, 1], [0, 1], clamp)}>
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 10, background: T.blue, fontFamily: T.mono, fontWeight: 500, fontSize: 22, color: "#fff" }}>{label}</div>
          </foreignObject>
        )}
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {dim(250, 260, 940, 260, "6,20 m", 520, 200)}
        {dim(1000, 300, 1000, 1150, "2,85 m", 880, 690)}
      </svg>
      <div style={{ position: "absolute", left: 40, top: Z.top + 120, ...pop(look) }}>
        <Tag icon="eye" color={T.red} size={28}>
          só olhar <span style={{ color: T.red }}>✕</span>
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 40, top: Z.top + 220, ...pop(inv) }}>
        <Card style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }} edge={T.red}>
          <Icon d="calc" size={34} color={T.red} />
          <div>
            <Label color={T.red}>QUANTIDADES INVENTADAS</Label>
            <div style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 40, color: T.ink }}>≈ {String(scramble).padStart(3, "0")} m³ ?</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// ——— 27–33 · modo cartão: engenharia = vendas ———
export const Compare: React.FC = () => {
  const { t, sp } = useClock();
  const k = cardK(t);
  if (k < 0.01) return null;
  const a = sp(28.72, SP.snap);
  const b = sp(30.72, SP.snap);
  const eq = sp(31.69, SP.pop);
  const box = (p: number, icon: string, title: string, sub: string, color: string) => (
    <div style={{ width: 400, ...pop(p) }}>
      <Card style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={icon} size={34} color="#fff" />
          </div>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 34, color: T.ink }}>{title}</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Serif size={34} color={T.navy2}>
            {sub}
          </Serif>
        </div>
      </Card>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Label color={T.ink} size={18} glow>A MESMA LÓGICA</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {box(a, "helmet", "Engenharia", "medir antes de orçar", T.navy)}
          <div style={{ fontFamily: T.ui, fontWeight: 900, fontSize: 70, color: T.blue, ...pop(eq) }}>=</div>
          {box(b, "handshake", "Vendas", "entender antes de vender", T.blue)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ——— 55–63 · o erro custa caro: engenharia (orçamento) e vendas (negócio) ———
export const ErrorCards: React.FC = () => {
  const { t, sp } = useClock();
  if (t < 54.9 || t > 63.6) return null;
  const rows: { at: number; at2: number; label: string; err: string; hit: string; icon: string; atHit: number }[] = [
    { at: 54.96, at2: 56.01, label: "NA ENGENHARIA", err: "erro de medição", hit: "orçamento", icon: "ruler", atHit: 58.22 },
    { at: 59.36, at2: 60.56, label: "NAS VENDAS", err: "erro de diagnóstico", hit: "negócio", icon: "search", atHit: 62.73 },
  ];
  const out = ez(t, 63.25, 63.55, EZ.in);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {rows.map((r, i) => {
        const p = sp(r.at, SP.snap);
        const e = sp(r.at2, SP.pop);
        const h = sp(r.atHit, SP.pop);
        return (
          <div key={r.label} style={{ position: "absolute", left: 40, right: 40, top: Z.top + 14 + i * 186, ...pop(p) }}>
            <Card style={{ padding: "16px 22px" }}>
              <Label color={T.blue}>{r.label}</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, ...pop(e, 10) }}>
                  <Icon d={r.icon} size={34} color={T.red} />
                  <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 34, color: T.ink }}>{r.err}</span>
                </div>
                <svg width={46} height={24} viewBox="0 0 46 24" style={{ opacity: h }}>
                  <path d="M2 12h38M32 4l8 8-8 8" stroke={T.gray} strokeWidth={3} fill="none" strokeLinecap="round" />
                </svg>
                <div style={{ ...pop(h, 10) }}>
                  <Pill color={T.red} icon="x" size={26}>
                    {r.hit}
                  </Pill>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ——— 63,7–67,6 · "não te preocupes em ficar bom a convencer" (riscado, como na referência) ———
export const Convince: React.FC = () => {
  const { t, sp } = useClock();
  if (t < 63.5 || t > 68.2) return null;
  const p = sp(63.66, SP.snap);
  const cross = ez(t, 66.87, 67.2, EZ.out);
  const out = ez(t, 67.7, 68.05, EZ.in);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: Z.top + 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 1 - out }}>
      <div style={pop(p)}>
        <Label color={T.ink} size={18} glow>POR ISSO, NÃO TE PREOCUPES EM</Label>
      </div>
      <div style={{ position: "relative", ...pop(sp(64.53, SP.snap)) }}>
        <Card style={{ padding: "18px 28px", display: "flex", alignItems: "center", gap: 16 }}>
          <Icon d="user" size={40} color={T.gray} />
          <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 44, color: T.ink }}>ficar bom a convencer</span>
        </Card>
        <svg width={720} height={120} viewBox="0 0 720 120" style={{ position: "absolute", left: -20, top: -10, pointerEvents: "none" }}>
          <path d="M10 100 L700 14" stroke={T.red} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cross} />
        </svg>
      </div>
    </div>
  );
};

// ——— fecho: perfil original (sem filtros) + gostar, seguir, partilhar ———
export const CTA_AT = 79.3;
export const CTA18: React.FC = () => {
  const { t, fps, sp } = useClock();
  if (t < 78.7) return null;
  const card = sp(CTA_AT, SP.soft);
  const items: { at: number; l: string; c: string; d: string }[] = [
    { at: 80.32, l: "Deixa o teu like", c: T.red, d: "heart" },
    { at: 81.75, l: "Segue o perfil", c: T.blue, d: "follow" },
    { at: 82.4, l: "Compartilha", c: T.turq, d: "share" },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, top: Z.top, display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((x) => {
          const p = sp(x.at, SP.pop);
          return (
            <div key={x.l} style={pop(p)}>
              <Card radius={20} style={{ width: 460, padding: "12px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <Icon d={x.d} size={40} color={x.c} fill={x.d === "heart" && p > 0.6 ? T.red : "none"} />
                <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 32, color: T.ink }}>{x.l}</span>
              </Card>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1086, opacity: interpolate(card, [0, 0.2], [0, 1], clamp), transform: `translateY(${(1 - card) * 900}px)` }}>
        <PerfilCard width={960} tapAt={Math.round(M(81.85) * fps)} />
      </div>
    </AbsoluteFill>
  );
};
