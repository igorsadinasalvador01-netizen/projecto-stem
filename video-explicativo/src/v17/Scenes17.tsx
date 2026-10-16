import React from "react";
import { AbsoluteFill, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { PerfilCard } from "../components/PerfilFinal";
import { clamp, EZ, Glass, SP } from "../kit/Kit";
import { M, OUT_FRAMES, OUT_LEN, punch, useClock17 as useClock } from "./cuts17";
import { useFx17 } from "./Fx17";
import { GlassQuestion } from "../v12/Q3D";
import { Building, Scene3D } from "./Building3D";
import { T17 as T, ZONE } from "./theme17";

// A filmagem fica SEMPRE no ecrã inteiro (nenhum fundo de cor por cima dela). Os gráficos vivem
// na faixa de cima (por cima do capacete) e passam por trás da pessoa recortada.

// ——— linha do tempo (segundos da narração) ———
// marcas no tempo original, interpoladas no tempo da montagem (contínuo mesmo sobre um corte)
const ez = (t: number, a: number, b: number, e = EZ.inOut) => {
  const A = M(a);
  const B = Math.max(M(b), A + Math.min(b - a, 0.12));
  return interpolate(M(t), [A, B], [0, 1], { easing: e, ...clamp });
};
export const layersK = (t: number) => ez(t, 15.5, 15.95, EZ.out) * (1 - ez(t, 16.45, 16.95));
const redK = (t: number) => ez(t, 42.2, 42.5, EZ.out) * (1 - ez(t, 44.5, 44.9));
// separação em camadas 3D (fundo atrás, título no meio, pessoa à frente)
// (o deslocamento em x/y compensa a rotação, para a pessoa da frente tapar a do fundo)
const layerT = (L: number, z: number) => `rotateY(${-24 * L}deg) rotateX(${6 * L}deg) translate3d(${0.4477 * z * L}px, ${0.1051 * z * L}px, ${z * L}px) scale(${1 - 0.34 * L})`;

// depois do último fotograma da montagem, a filmagem fica parada (fecho com o perfil)
export const LAST17 = OUT_FRAMES - 4;
const Footage: React.FC<{ src: string; transparent?: boolean; style?: React.CSSProperties }> = ({ src, transparent, style }) => {
  const frame = useCurrentFrame();
  return (
    <Freeze frame={LAST17} active={frame > LAST17}>
      <OffthreadVideo src={staticFile(src)} muted transparent={transparent} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
    </Freeze>
  );
};

// vidro; `shine` (0→1) passa um reflexo de luz na diagonal quando o cartão entra
const G: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number; tint?: string; edge?: string; glow?: string; shine?: number }> = ({ style, children, radius = 28, tint = T.glass, edge = T.edge, glow, shine }) => (
  <Glass tint={tint} edge={edge} radius={radius} blur={22} glow={glow} style={style}>
    {children}
    {shine !== undefined && shine > 0.001 && shine < 0.999 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 36%, rgba(255,255,255,0.26) 50%, transparent 64%)", transform: `translateX(${-120 + 240 * shine}%)`, pointerEvents: "none" }} />}
  </Glass>
);
// ícones desenhados (traço), no estilo dos chips
export const ICON: Record<string, string> = {
  tag: "M3 12l9-9h8v8l-9 9zM16 7.5h.01",
  tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.6-1.6M12 6.5V8M12 16v1.5",
  alert: "M12 3 2 20h20L12 3zM12 10v4M12 17h.01",
  shield: "M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3zM8.5 12l2.5 2.5 4.5-5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  brick: "M3 6h18v4H3zM3 10h18v4H3zM3 14h18v4H3zM9 6v4M15 10v4M9 14v4",
  trophy: "M8 4h8v4a4 4 0 0 1-8 0V4zM8 5H5a3 3 0 0 0 3 3.5M16 5h3a3 3 0 0 1-3 3.5M12 12v4M9 20h6M10 16h4v4h-4z",
};
const pin = (p: number, d = 40) => ({ opacity: interpolate(p, [0, 0.35], [0, 1], clamp), transform: `translateY(${(1 - p) * d}px) scale(${0.94 + p * 0.06})` });
const Caps: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = T.gray, size = 22 }) => (
  <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: size, letterSpacing: "0.2em", color }}>{children}</div>
);
const Chip: React.FC<{ children: React.ReactNode; color: string; soft?: string; size?: number; icon?: "ok" | "no"; svg?: string }> = ({ children, color, soft = T.chip, size = 30, icon, svg }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.36}px ${size * 0.7}px`, borderRadius: 999, background: soft, border: `2px solid ${color}66`, backdropFilter: "blur(14px)", boxShadow: "0 18px 40px -18px rgba(0,0,0,0.55)", fontFamily: T.ui, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" }}>
    {icon && (
      <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {icon === "ok" ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 6l12 12M18 6 6 18" />}
      </svg>
    )}
    {svg && (
      <svg width={size * 0.95} height={size * 0.95} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={ICON[svg]} />
      </svg>
    )}
    {children}
  </div>
);
// palavra grande numa placa de vidro escuro, atrás da cabeça (a pessoa tapa-lhe a base)
const Slab: React.FC<{ word: string; color: string; p: number; top?: number; size?: number; glow?: string }> = ({ word, color, p, top = 352, size = 196, glow }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", perspective: 1400, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) }}>
    <div style={{ transform: `rotateX(${(1 - p) * 40}deg) translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, transformOrigin: "50% 100%" }}>
      <G radius={34} tint="rgba(10,26,47,0.62)" edge="rgba(143,230,240,0.45)" glow={glow} shine={interpolate(p, [0.2, 1], [0, 1], clamp)} style={{ padding: "6px 46px 0" }}>
        <div style={{ display: "flex", fontFamily: T.display, fontSize: size, lineHeight: 1, letterSpacing: "0.02em", color, textShadow: "0 8px 30px rgba(0,0,0,0.35)" }}>
          {word.split("").map((ch, i) => {
            const q = interpolate(p * 1.5 - i * 0.05, [0, 0.5], [0, 1], { easing: EZ.out, ...clamp });
            return (
              <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 46}px) rotateX(${(1 - q) * 70}deg)` }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ height: 6, margin: "0 0 14px", borderRadius: 3, background: color, transform: `scaleX(${interpolate(p, [0.5, 1], [0, 1], clamp)})`, transformOrigin: "left", opacity: 0.85 }} />
      </G>
    </div>
  </div>
);

// filmagem com o grading do vídeo: PB nos momentos de falha; na volta do valor a cor revela-se
// num círculo a partir do rosto
const GRADE = "contrast(1.04) saturate(1.05)";
const pbFilter = (pb: number) => (pb < 0.002 ? GRADE : `${GRADE} grayscale(${pb}) contrast(${1 + 0.22 * pb}) brightness(${1 - 0.06 * pb})`);
const Graded: React.FC<{ src: string; transparent?: boolean }> = ({ src, transparent }) => {
  const { pb, reveal } = useFx17();
  if (reveal > 0 && reveal < 1)
    return (
      <>
        <AbsoluteFill>
          <Footage src={src} transparent={transparent} style={{ filter: pbFilter(1) }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `circle(${reveal * 125}% at 40% 40%)` }}>
          <Footage src={src} transparent={transparent} style={{ filter: GRADE }} />
        </AbsoluteFill>
      </>
    );
  return <Footage src={src} transparent={transparent} style={{ filter: pbFilter(reveal >= 1 ? 0 : pb) }} />;
};

// ——— 1 · filmagem (fundo) ———
export const Plate: React.FC = () => {
  const { t, to } = useClock();
  const { zoom } = useFx17();
  const L = layersK(t);
  return (
    <AbsoluteFill>
      {/* durante a separação em camadas, o que aparece à volta é a própria filmagem desfocada */}
      {L > 0.002 && (
        <AbsoluteFill style={{ opacity: Math.min(1, L * 4) }}>
          <Footage src="v17/plate_c.mp4" style={{ filter: "blur(34px) brightness(0.8) saturate(0.95)", transform: "scale(1.18)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 44 * L, transform: layerT(L, -260), boxShadow: L > 0.02 ? `0 60px 120px -40px rgba(0,0,0,${0.7 * L}), inset 0 0 0 3px rgba(255,255,255,${0.35 * L})` : "none" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${punch(to) * zoom})`, transformOrigin: "40% 46%" }}>
            <Graded src="v17/plate_c.mp4" />
          </div>
          {L > 0.02 && (
            <div style={{ position: "absolute", right: 40, top: 610, opacity: L }}>
              <Chip color={T.gray} size={36}>
                CAMADA 01 · FUNDO
              </Chip>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ——— 3 · pessoa recortada (por cima dos gráficos "de trás") ———
export const Person: React.FC = () => {
  const { t, to } = useClock();
  const { zoom } = useFx17();
  const L = layersK(t);
  return (
    <AbsoluteFill style={{ perspective: 2200 }}>
      <div style={{ position: "absolute", inset: 0, transform: layerT(L, 260) }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${punch(to) * zoom})`, transformOrigin: "40% 46%" }}>
          <Graded src="v17/fg_c.webm" transparent />
        </div>
        {L > 0.02 && (
          <div style={{ position: "absolute", right: 60, top: 1380, opacity: L }}>
            <Chip color={T.turq} size={36}>
              CAMADA 03 · VOCÊ
            </Chip>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ——— HUD de "edição ao vivo" (estrutura da referência, adaptada) ———
const CH: [number, string][] = [
  [0, "O problema"],
  [6.8, "Porquê?"],
  [8.2, "Não basta ser bom"],
  [15.5, "O exemplo"],
  [19.9, "As propostas"],
  [33.0, "Confiança"],
  [36.0, "O que se vende"],
  [42.2, "Onde falham"],
  [51.3, "Guarda isto"],
  [59.7, "Segue o perfil"],
];
export const HUD: React.FC = () => {
  const { t, to, frame, fps } = useClock();
  let i = 0;
  CH.forEach(([a], k) => {
    if (t >= a) i = k;
  });
  const s = Math.floor(Math.min(to, OUT_LEN));
  const tc = `00:00:${String(s).padStart(2, "0")}:${String(frame % fps).padStart(2, "0")}`;
  const red = redK(t);
  const chIn = ez(t, CH[i][0], CH[i][0] + 0.35, EZ.out);
  const pill = "rgba(8,20,38,0.66)";
  return (
    <>
      <div style={{ position: "absolute", left: 36, top: 40 }}>
        <G radius={999} tint={pill} style={{ padding: "11px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: T.red, boxShadow: `0 0 ${10 + 8 * Math.abs(Math.sin(to * 3))}px ${T.red}` }} />
          <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 20, letterSpacing: "0.18em", color: red > 0.3 ? T.red : T.white }}>AO VIVO</span>
          <span style={{ width: 1, height: 22, background: T.line }} />
          <span style={{ fontFamily: T.mono, fontWeight: 500, fontSize: 20, color: T.gray }}>{tc}</span>
          <span style={{ width: 1, height: 22, background: T.line }} />
          <span style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 20, color: T.turq }}>
            {String(i + 1).padStart(2, "0")}/{CH.length}
          </span>
          <svg width={20} height={20} viewBox="0 0 24 24" style={{ transform: `rotate(${to * 240}deg)` }}>
            <circle cx={12} cy={12} r={8} stroke={T.gray} strokeWidth={3} fill="none" strokeDasharray="30 20" />
          </svg>
        </G>
      </div>
      <div style={{ position: "absolute", left: 36, top: 104, opacity: chIn, transform: `translateX(${(1 - chIn) * -14}px)` }}>
        <G radius={999} tint={pill} style={{ padding: "7px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: red > 0.3 ? T.red : T.turq }} />
          <span style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 21, color: T.white }}>{CH[i][1]}</span>
        </G>
      </div>
      {/* linha do tempo da "edição": capítulos e cabeça de leitura */}
      <div style={{ position: "absolute", left: 36, right: 36, top: 154, height: 6, borderRadius: 3, background: "rgba(8,20,38,0.55)", boxShadow: "0 0 0 1px rgba(255,255,255,0.12)" }}>
        <div style={{ width: `${Math.min(1, to / OUT_LEN) * 100}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${T.blue}, ${T.turq})` }} />
        {CH.map(([a], k) => (
          <div key={k} style={{ position: "absolute", left: `${(M(a) / OUT_LEN) * 100}%`, top: -3, width: 2, height: 12, borderRadius: 1, background: k <= i ? T.turq : "rgba(255,255,255,0.45)" }} />
        ))}
        <div style={{ position: "absolute", left: `calc(${Math.min(1, to / OUT_LEN) * 100}% - 8px)`, top: -5, width: 16, height: 16, borderRadius: 8, background: T.white, boxShadow: `0 0 0 3px ${T.turq}, 0 0 14px ${T.turq}` }} />
      </div>
      <div style={{ position: "absolute", right: 36, top: 40 }}>
        <G radius={999} tint={pill} style={{ padding: "8px 22px 8px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth={1.9}>
            <rect x={3} y={3} width={18} height={18} rx={5} />
            <circle cx={12} cy={12} r={4.2} />
            <circle cx={17.3} cy={6.7} r={1.1} fill={T.white} stroke="none" />
          </svg>
          <span style={{ fontFamily: T.display, fontSize: 34, lineHeight: 1, letterSpacing: "0.03em", color: T.white, paddingTop: 3 }}>@SERGIO_SALVADOR10</span>
        </G>
      </div>
    </>
  );
};

// ——— 2 · gráficos ATRÁS da pessoa ———
const cam1 = (t: number) => ({ pos: [Math.sin(t * 0.35) * 0.35, 1.5, 8.6] as [number, number, number], look: [0, 1.2, 0] as [number, number, number] });
export const Behind: React.FC = () => {
  const { t, to, sp } = useClock();
  const L = layersK(t);
  // cap. 1: prédio de vidro (obra excelente) e prédio de betão (trabalha pior), por cima do capacete
  const riseA = ez(t, 0.5, 2.3, EZ.out);
  const riseB = ez(t, 5.2, 6.2, EZ.out);
  const lose = ez(t, 4.4, 4.8);
  const ch1 = 1 - ez(t, 6.6, 7.0);
  // cap. 3
  const notEnough = sp(9.2, SP.pop) * (1 - ez(t, 14.3, 14.6));
  const good = sp(9.84, SP.pop) * (1 - ez(t, 14.3, 14.6));
  const demo = sp(12.4, SP.snap) * (1 - ez(t, 15.2, 15.5));
  const chosen = sp(14.8, SP.pop) * (1 - ez(t, 15.25, 15.5));
  // cap. 7: tiles de vidro (segurança, previsibilidade, tranquilidade)
  const tiles = [
    { at: 39.44, x: 40, y: 182, l: "SEGURANÇA", s: "risco sob controlo", ic: "shield" },
    { at: 40.16, x: 690, y: 262, l: "PREVISIBILIDADE", s: "custo e prazo claros", ic: "chart" },
    { at: 41.36, x: 330, y: 404, l: "TRANQUILIDADE", s: "o cliente dorme bem", ic: "calm" },
  ];
  const construct = sp(37.4, SP.pop) * (1 - ez(t, 39.1, 39.4));
  return (
    <AbsoluteFill>
      {t < 7.1 && (
        <div style={{ position: "absolute", left: 0, top: 150, width: 1080, height: 520, opacity: ch1 }}>
          <Scene3D width={1080} height={520} cam={cam1(to)} fov={30}>
            <Building x={-2.3} floors={6} w={1.3} d={1.1} rise={riseA} glow={0.4 + 0.6 * ez(t, 2.4, 2.9) * (1 - lose)} edge={lose > 0.5 ? T.red : T.turq} />
            <Building x={2.2} floors={3} w={1.3} d={1.1} rise={riseB} concrete />
          </Scene3D>
        </div>
      )}
      {t > 6.6 && t < 8.6 && (
        <div style={{ position: "absolute", left: 300, top: 120, opacity: 1 - ez(t, 8.0, 8.4) }}>
          <GlassQuestion width={480} height={480} at={M(6.85)} color2={T.turq} />
        </div>
      )}
      {/* cap. 3 · não basta ser bom → DEMONSTRAR */}
      {t > 9 && t < 15.6 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 186, display: "flex", justifyContent: "center", gap: 16 }}>
            <div style={pin(notEnough, 24)}>
              <Chip color={T.red} icon="no" size={30}>
                NÃO BASTA
              </Chip>
            </div>
            <div style={pin(good, 24)}>
              <Chip color={T.white} size={30}>
                ser bom naquilo que fazes
              </Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 186, display: "flex", justifyContent: "center", ...pin(chosen, 24) }}>
            <Chip color={T.green} icon="ok" size={30}>
              porque te devem escolher
            </Chip>
          </div>
          <Slab word="DEMONSTRAR" color={T.turq} p={demo} />
        </>
      )}
      {/* cap. 4 · camadas: o título "EXEMPLO" é a camada do meio */}
      {L > 0.02 && (
        <AbsoluteFill style={{ perspective: 2200, opacity: L }}>
          <AbsoluteFill style={{ transform: layerT(L, 0) }}>
            <G radius={40} tint="rgba(10,26,47,0.55)" edge="rgba(143,230,240,0.6)" style={{ position: "absolute", left: 40, top: 60, width: 1000, height: 430, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Chip color={T.blue} size={30}>
                CAMADA 02 · TÍTULO
              </Chip>
              <div style={{ fontFamily: T.display, fontSize: 250, lineHeight: 0.9, color: T.turq, paddingTop: 10 }}>EXEMPLO</div>
            </G>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {/* cap. 4–6: a mesma obra, as duas propostas, a confiança */}
      {t > 16.6 && t < 36.4 && <Tender />}
      {/* cap. 7: o que se vende */}
      {t > 37 && t < 39.5 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", ...pin(construct) }}>
          <div style={{ position: "relative" }}>
            <Chip color={T.gray} svg="brick" size={36}>
              apenas construção
            </Chip>
            <div style={{ position: "absolute", left: -8, right: -8, top: "50%", height: 5, borderRadius: 3, background: T.red, transform: `scaleX(${ez(t, 38.2, 38.5)})`, transformOrigin: "left" }} />
          </div>
        </div>
      )}
      {t > 39.3 && t < 42.4 &&
        tiles.map((x, i) => {
          const p = sp(x.at, SP.pop);
          const out = ez(t, 42.0, 42.3);
          return (
            <div key={x.l} style={{ position: "absolute", left: x.x, top: x.y, perspective: 1200, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (1 - out) }}>
              <div style={{ transform: `rotateY(${(i === 1 ? -18 : 18) + Math.sin(to * 1.2 + i) * 6}deg) rotateX(${8 + Math.cos(to + i) * 4}deg) translateY(${(1 - p) * 80 + Math.sin(to * 1.6 + i) * 8}px) scale(${0.7 + p * 0.3})` }}>
                <G radius={26} tint="rgba(10,26,47,0.6)" edge="rgba(143,230,240,0.6)" glow="rgba(54,211,153,0.3)" style={{ width: 350, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 18, background: T.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {x.ic === "shield" && <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3zM8.5 12l2.5 2.5 4.5-5" />}
                      {x.ic === "chart" && <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />}
                      {x.ic === "calm" && <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01" />}
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 25, letterSpacing: "0.05em", color: T.white }}>{x.l}</div>
                    <div style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 20, color: T.gray }}>{x.s}</div>
                  </div>
                </G>
              </div>
            </div>
          );
        })}
      {/* cap. 8–9: o prédio explodido (o valor) e TRANSFORMAR */}
      {t > 44.8 && t < 59.95 && <ValueTower />}
    </AbsoluteFill>
  );
};

// medidor semicircular de confiança (arco + agulha + percentagem)
const Gauge: React.FC<{ v: number; color: string; p: number }> = ({ v, color, p }) => {
  const R = 100;
  const arc = (a0: number, a1: number) => {
    const P = (a: number) => [130 + R * Math.cos(Math.PI * (1 - a)), 128 - R * Math.sin(Math.PI * (1 - a))];
    const [x0, y0] = P(a0);
    const [x1, y1] = P(a1);
    return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`;
  };
  const ang = Math.PI * (1 - v);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", ...pin(p, 24) }}>
      <svg width={260} height={150} viewBox="0 0 260 150">
        <path d={arc(0, 1)} stroke="rgba(255,255,255,0.12)" strokeWidth={18} fill="none" strokeLinecap="round" />
        {v > 0.005 && <path d={arc(0, v)} stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" />}
        {[0, 0.25, 0.5, 0.75, 1].map((k) => {
          const a = Math.PI * (1 - k);
          return <line key={k} x1={130 + 78 * Math.cos(a)} y1={128 - 78 * Math.sin(a)} x2={130 + 70 * Math.cos(a)} y2={128 - 70 * Math.sin(a)} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />;
        })}
        <line x1={130} y1={128} x2={130 + 66 * Math.cos(ang)} y2={128 - 66 * Math.sin(ang)} stroke={T.white} strokeWidth={5} strokeLinecap="round" />
        <circle cx={130} cy={128} r={9} fill={T.white} />
      </svg>
      <div style={{ marginTop: -6, fontFamily: T.display, fontSize: 64, lineHeight: 1, color }}>{Math.round(v * 100)}%</div>
      <Caps size={17}>CONFIANÇA</Caps>
    </div>
  );
};

// ——— a mesma obra · duas propostas · quem passa mais confiança ———
const Tender: React.FC = () => {
  const { t, sp } = useClock();
  const one = sp(17.04, SP.soft) * (1 - ez(t, 19.6, 19.95));
  const props = sp(20.0, SP.soft) * (1 - ez(t, 35.9, 36.3));
  const conf = sp(34.24, SP.soft);
  const won = ez(t, 35.3, 35.6);
  const A: [string, number, string][] = [
    ["Apresenta o preço", 20.96, "tag"],
    ["Executa o trabalho", 22.56, "tool"],
  ];
  const B: [string, number, string][] = [
    ["Controla os custos", 26.24, "coin"],
    ["Reduz os imprevistos", 27.84, "alert"],
    ["Minimiza os riscos", 29.92, "shield"],
    ["Cumpre o prazo", 31.6, "clock"],
  ];
  const barA = 0.31 * ez(t, 34.24, 35.1, EZ.out);
  const barB = 0.87 * ez(t, 34.24, 35.3, EZ.out);
  return (
    <AbsoluteFill>
      {/* a mesma obra */}
      <div style={{ position: "absolute", left: 40, right: 40, top: ZONE.top, ...pin(one, 50) }}>
        <G radius={32} tint="rgba(10,26,47,0.66)" shine={ez(t, 17.1, 17.9)} style={{ padding: "26px 32px" }}>
          <Caps color={T.turq}>CONCURSO · A MESMA OBRA</Caps>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 50, color: T.white, marginTop: 6 }}>Edifício residencial</div>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            {[
              { n: "A", at: 17.04, c: T.gray },
              { n: "B", at: 17.5, c: T.blueLight },
            ].map((x) => (
              <div key={x.n} style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${T.line}`, ...pin(sp(x.at, SP.pop), 20) }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: x.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontSize: 36, color: T.navy, paddingTop: 3 }}>{x.n}</div>
                <div>
                  <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 26, color: T.white }}>Empreendedor {x.n}</div>
                  <div style={{ fontFamily: T.ui, fontWeight: 600, fontSize: 19, color: T.gray }}>proposta enviada</div>
                </div>
              </div>
            ))}
          </div>
        </G>
      </div>
      {/* as duas propostas lado a lado */}
      <div style={{ position: "absolute", left: 40, right: 40, top: ZONE.top, display: "flex", gap: 18, ...pin(props, 50) }}>
        {[
          { id: "A", rows: A, c: T.gray, at: 20.24 },
          { id: "B", rows: B, c: T.blueLight, at: 23.92 },
        ].map((P) => {
          const win = P.id === "B";
          const dim = win ? 1 : 1 - 0.4 * won;
          const enter = sp(P.at, SP.soft);
          return (
            <div key={P.id} style={{ flex: 1, opacity: dim * interpolate(enter, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - enter) * 30}px) scale(${win ? 1 + 0.02 * won : 1 - 0.02 * won})` }}>
              <G radius={28} tint="rgba(10,26,47,0.68)" edge={win && won > 0.5 ? T.green : win ? "rgba(59,130,246,0.6)" : T.edge} glow={win && won > 0.5 ? "rgba(54,211,153,0.4)" : undefined} shine={win && won > 0 ? won : ez(t, P.at, P.at + 0.8)} style={{ padding: "20px 22px", height: ZONE.h }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: P.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontSize: 30, color: T.navy, paddingTop: 2 }}>{P.id}</div>
                  <Caps color={P.c} size={22}>
                    PROPOSTA {P.id}
                  </Caps>
                </div>
                <div style={{ marginTop: 10, opacity: 1 - conf }}>
                  {P.rows.map(([r, at, ic]) => {
                    const p = sp(at, SP.pop);
                    const ok = sp(at + 0.25, SP.pop);
                    return (
                      <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", borderTop: `1px solid ${T.line}`, ...pin(p, 14) }}>
                        <span style={{ width: 36, height: 36, borderRadius: 11, background: win ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={win ? T.blueLight : T.gray} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d={ICON[ic]} />
                          </svg>
                        </span>
                        <span style={{ flex: 1, fontFamily: T.ui, fontWeight: 700, fontSize: 26, color: T.white, lineHeight: 1.1 }}>{r}</span>
                        <span style={{ width: 26, height: 26, borderRadius: 13, background: win ? T.green : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${win ? ok : 1})` }}>
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={win ? T.navy : T.gray} strokeWidth={3.4} strokeLinecap="round">
                            {win ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6 12h12" />}
                          </svg>
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* confiança: medidor (agulha) por cima da lista */}
                {conf > 0.01 && <Gauge v={win ? barB : barA} color={win ? T.green : T.gray} p={conf} />}
              </G>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ——— o prédio explodido (à direita, atrás do ombro) e a lista do valor (à esquerda, no topo) ———
const VALUES = ["Prazo cumprido", "Menos risco", "Menos imprevistos", "Custo controlado"];
const VALUE_ICON = ["clock", "shield", "alert", "coin"];
const ValueTower: React.FC = () => {
  const { t, to, sp } = useClock();
  const rise = ez(t, 44.9, 46.1, EZ.out);
  const explode = ez(t, 48.4, 49.6) * (1 - ez(t, 55.3, 56.6));
  const note = sp(51.6, SP.soft) * (1 - ez(t, 54.9, 55.3));
  const glow = ez(t, 58.8, 59.3);
  const fade = 1 - ez(t, 59.5, 59.9);
  const what = sp(45.6, SP.pop) * (1 - ez(t, 47.1, 47.4));
  const forget = sp(47.36, SP.pop) * (1 - ez(t, 48.9, 49.2));
  const head = sp(49.2, SP.pop) * (1 - note) * (1 - ez(t, 55.3, 55.6));
  const believe = sp(56.56, SP.pop) * (1 - ez(t, 58.9, 59.2));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", left: 620, top: 130, width: 460, height: 1000, opacity: 1 - note * 0.7 }}>
        <Scene3D width={460} height={1000} cam={{ pos: [0, 2.3, 8.4], look: [0, 1.8, 0] }} fov={30}>
          <Building x={0} floors={4} w={1.05} d={0.95} rise={rise} explode={explode} spin={Math.sin(to * 0.4) * 0.2 + (to - M(45)) * 0.04} glow={0.3 + glow * 0.9} edge={glow > 0.5 ? T.green : T.turq} />
        </Scene3D>
      </div>
      {/* o que fazem → esquecem-se do valor */}
      <div style={{ position: "absolute", left: 40, top: ZONE.top + 10, ...pin(what) }}>
        <Chip color={T.gray} size={30}>
          explicam só o que fazem
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 40, top: ZONE.top + 10, ...pin(forget) }}>
        <Chip color={T.red} icon="no" size={30}>
          esquecem-se do valor
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 40, top: ZONE.top - 4, ...pin(head, 20) }}>
        <Chip color={T.turq} size={24}>
          O VALOR QUE ENTREGAM
        </Chip>
      </div>
      {VALUES.map((v, i) => {
        const p = sp(49.3 + i * 0.25, SP.pop) * (1 - note) * (1 - ez(t, 55.3, 55.6));
        return (
          <div key={v} style={{ position: "absolute", left: 40, top: ZONE.top + 70 + i * 72, ...pin(p, 20) }}>
            <Chip color={T.green} svg={VALUE_ICON[i]} size={27}>
              {v}
            </Chip>
          </div>
        );
      })}
      {/* guarda isto */}
      <div style={{ position: "absolute", left: 40, right: 40, top: ZONE.top, ...pin(note, 60) }}>
        <G radius={32} tint="rgba(10,26,47,0.74)" edge="rgba(143,230,240,0.5)" shine={ez(t, 51.7, 52.6)} style={{ padding: "26px 34px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={T.turq} strokeWidth={2} strokeLinejoin="round">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
            <Caps color={T.turq} size={24}>
              GUARDA ISTO
            </Caps>
          </div>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 50, lineHeight: 1.12, color: T.white, marginTop: 12 }}>
            O cliente não compra apenas o teu{" "}
            <span style={{ position: "relative", color: T.gray }}>
              serviço.
              <span style={{ position: "absolute", left: -4, right: -4, top: "55%", height: 5, background: T.red, transform: `scaleX(${ez(t, 54.4, 54.8)})`, transformOrigin: "left" }} />
            </span>
          </div>
        </G>
      </div>
      <div style={{ position: "absolute", left: 40, top: ZONE.top + 10, ...pin(believe) }}>
        <Chip color={T.blue} size={30}>
          compra aquilo em que acredita
        </Chip>
      </div>
      {/* transformar */}
      <Slab word="TRANSFORMAR" color={T.green} p={sp(59.04, SP.snap)} glow="rgba(54,211,153,0.35)" />
    </AbsoluteFill>
  );
};

// ——— 4 · à FRENTE: etiquetas, carimbo vermelho, bordas de validação ———
export const Front: React.FC = () => {
  const { t, to, sp } = useClock();
  const { reveal } = useFx17();
  const red = redK(t);
  const okA = sp(2.64, SP.pop) * (1 - ez(t, 4.3, 4.5));
  const loseA = sp(4.48, SP.pop) * (1 - ez(t, 6.6, 6.9));
  const tagB = sp(6.0, SP.pop) * (1 - ez(t, 6.6, 6.9));
  const lower = sp(0.4, SP.soft) * (1 - ez(t, 3.2, 3.5));
  // validação (verde) e atenção (vermelho) só nas bordas: a filmagem nunca fica tapada
  const green = Math.max(sp(14.8, SP.soft) * (1 - ez(t, 15.2, 15.5)), sp(35.36, SP.soft) * (1 - ez(t, 35.9, 36.2)), sp(59.04, SP.soft) * (1 - ez(t, 59.5, 59.8)));
  const pulse = 0.75 + 0.25 * Math.sin(to * 12);
  return (
    <AbsoluteFill>
      {/* cap. 1 · etiquetas dos prédios */}
      <div style={{ position: "absolute", left: 392, top: 236, ...pin(okA) }}>
        <Chip color={T.green} icon="ok" size={28}>
          OBRA EXCELENTE
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 392, top: 236, ...pin(loseA) }}>
        <Chip color={T.red} icon="no" size={28}>
          PERDEU A OBRA
        </Chip>
      </div>
      <div style={{ position: "absolute", right: 40, top: 316, ...pin(tagB) }}>
        <Chip color={T.white} svg="trophy" size={26}>
          TRABALHA PIOR · E GANHOU
        </Chip>
      </div>
      {/* rodapé com o perfil (como o crachá da referência) */}
      <div style={{ position: "absolute", left: 40, top: 1420, ...pin(lower, 30) }}>
        <G radius={20} tint="rgba(10,26,47,0.7)" style={{ padding: "12px 22px", borderLeft: `5px solid ${T.turq}` }}>
          <div style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 30, color: T.white }}>@sergio_salvador10</div>
          <div style={{ fontFamily: T.ui, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: T.gray }}>CONSTRUÇÃO · VENDAS</div>
        </G>
      </div>
      {/* cap. 8 · cena de atenção: carimbo no topo + borda vermelha */}
      {red > 0.01 && (
        <>
          <AbsoluteFill style={{ boxShadow: `inset 0 0 0 ${10 * red}px rgba(242,92,92,${0.9 * pulse}), inset 0 0 ${80 * red}px rgba(242,92,92,${0.32 * pulse})`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", justifyContent: "center", opacity: red, transform: `rotate(-4deg) scale(${1.5 - sp(42.32, SP.pop) * 0.5})` }}>
            <div style={{ padding: "10px 36px 2px", border: `7px solid ${T.red}`, borderRadius: 20, background: "rgba(10,26,47,0.72)", backdropFilter: "blur(10px)", fontFamily: T.display, fontSize: 112, lineHeight: 1, color: T.red, letterSpacing: "0.03em" }}>É AQUI QUE FALHAM</div>
          </div>
        </>
      )}
      {/* anel de luz na frente da revelação da cor */}
      {reveal > 0 && reveal < 1 && (
        <div style={{ position: "absolute", left: 432 - reveal * 1947, top: 768 - reveal * 1947, width: reveal * 3894, height: reveal * 3894, borderRadius: "50%", border: `6px solid rgba(46,196,214,${1 - reveal})`, boxShadow: `0 0 40px rgba(46,196,214,${0.6 * (1 - reveal)}), inset 0 0 40px rgba(46,196,214,${0.4 * (1 - reveal)})`, pointerEvents: "none" }} />
      )}
      {green > 0.01 && <AbsoluteFill style={{ boxShadow: `inset 0 0 0 ${8 * green}px rgba(54,211,153,0.9), inset 0 0 ${70 * green}px rgba(54,211,153,0.3)`, pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};

// ——— 5 · CTA: perfil original (sem filtros) a subir por cima do colete; seguir, gostar, partilhar ———
export const CTA_CARD_AT = 61.2;
export const CTA: React.FC = () => {
  const { t, fps, sp } = useClock();
  if (t < 59.7) return null;
  const ask = sp(60.4, SP.pop) * (1 - ez(t, 61.3, 61.6));
  const card = sp(CTA_CARD_AT, SP.soft);
  const items: { at: number; l: string; c: string; d: string }[] = [
    { at: 61.76, l: "Segue o perfil", c: T.turq, d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9c0-3.9 3.1-6.5 7-6.5 1.5 0 2.9.4 4 1M18 15v6M15 18h6" },
    { at: 62.64, l: "Deixa o teu like", c: T.red, d: "M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" },
    { at: 63.52, l: "Compartilhe", c: T.blue, d: "M4 12.5 20 4l-5 16-3.5-6.5L4 12.5zm7.5 1L20 4" },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: ZONE.top + 10, display: "flex", justifyContent: "center", ...pin(ask) }}>
        <Chip color={T.turq} size={32}>
          queres vender melhor?
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 40, top: ZONE.top, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((x) => {
          const p = sp(x.at, SP.pop);
          return (
            <div key={x.l} style={{ ...pin(p, 30) }}>
              <G radius={24} tint="rgba(10,26,47,0.74)" style={{ width: 470, padding: "14px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                <svg width={46} height={46} viewBox="0 0 24 24" fill={x.c === T.red && p > 0.6 ? T.red : "none"} stroke={x.c} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `scale(${0.85 + p * 0.15})` }}>
                  <path d={x.d} />
                </svg>
                <span style={{ fontFamily: T.ui, fontWeight: 800, fontSize: 32, color: T.white }}>{x.l}</span>
              </G>
            </div>
          );
        })}
      </div>
      {/* perfil original, sem filtros nem grão por cima */}
      <div style={{ position: "absolute", left: 60, top: 1086, opacity: interpolate(card, [0, 0.2], [0, 1], clamp), transform: `translateY(${(1 - card) * 900}px)` }}>
        <PerfilCard width={960} tapAt={Math.round(M(61.95) * fps)} />
      </div>
    </AbsoluteFill>
  );
};
