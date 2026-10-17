// Kit partilhado dos vídeos 12+: relógio em segundos, fundos mesh, vidro premium,
// legendas palavra a palavra, transições, mistura com ducking e o fecho com o perfil
// original. Cada vídeo traz o seu tema (cores, fontes, modelos) — o kit só dá a gramática.
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PerfilCard } from "../components/PerfilFinal";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EZ = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};
export type Spr = { damping: number; stiffness: number; mass: number };
export const SP = {
  soft: { damping: 18, stiffness: 110, mass: 0.9 },
  snap: { damping: 14, stiffness: 180, mass: 0.6 },
  pop: { damping: 10, stiffness: 210, mass: 0.6 },
  heavy: { damping: 20, stiffness: 110, mass: 1.3 },
} as const;

export type Word = { text: string; start: number; end: number };

// relógio em segundos absolutos do áudio (offset = início da cena)
export const useClock = (offset = 0) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = offset + frame / fps;
  const sp = (at: number, cfg: Spr = SP.soft) => spring({ frame: frame - Math.round((at - offset) * fps), fps, config: cfg });
  const ez = (a: number, b: number, from = 0, to = 1, easing = EZ.inOut) => interpolate(t, [a, b], [from, to], { easing, ...clamp });
  return { frame, fps, t, sp, ez, width, height, vertical: height > width };
};

// ——— fundo mesh: manchas de luz que derivam devagar sobre uma base ———
export type Blob = { c: string; x: number; y: number; r: number; s?: number };
export const Mesh: React.FC<{ base: string; blobs: Blob[]; grid?: string; gridSize?: number }> = ({ base, blobs, grid, gridSize = 64 }) => {
  const { t } = useClock();
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const s = b.s ?? 0.25;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${b.x + Math.sin(t * s + i * 1.7) * 6}%`,
              top: `${b.y + Math.cos(t * s * 0.8 + i) * 5}%`,
              width: b.r,
              height: b.r,
              marginLeft: -b.r / 2,
              marginTop: -b.r / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${b.c} 0%, transparent 68%)`,
              filter: "blur(30px)",
            }}
          />
        );
      })}
      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${(t * 8) % gridSize}px ${(t * 4) % gridSize}px`,
            WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 50%, black 20%, transparent 80%)",
            maskImage: "radial-gradient(ellipse 75% 60% at 50% 50%, black 20%, transparent 80%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ——— acabamento: grão + vinheta (cor do tema) ———
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;
export const Finish: React.FC<{ vignette?: string; grain?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ vignette = "rgba(0,0,0,0.45)", grain = 0.06, blend = "overlay" }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 88% 72% at 50% 48%, transparent 55%, ${vignette} 100%)` }} />
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, backgroundSize: "260px", backgroundPosition: `${(frame * 47) % 260}px ${(frame * 71) % 260}px`, opacity: grain, mixBlendMode: blend }} />
    </>
  );
};

// ——— vidro premium: desfoque do fundo, borda de luz, reflexo no topo ———
export const Glass: React.FC<{ tint?: string; edge?: string; radius?: number; blur?: number; glow?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  tint = "rgba(255,255,255,0.10)",
  edge = "rgba(255,255,255,0.30)",
  radius = 32,
  blur = 26,
  glow,
  style,
  children,
}) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      background: `linear-gradient(150deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 55%), ${tint}`,
      border: `1.5px solid ${edge}`,
      boxShadow: `0 40px 90px -40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.06)${glow ? `, 0 0 70px -10px ${glow}` : ""}`,
      backdropFilter: `blur(${blur}px) saturate(160%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,0.14), transparent)", pointerEvents: "none" }} />
    {children}
  </div>
);

// ——— legendas palavra a palavra ———
export type CapStyle = {
  font: string;
  size: number;
  weight?: number;
  color: string;
  active: string;
  dim?: number;
  y: number; // centro vertical (px)
  x?: number; // centro horizontal (px)
  maxWidth?: number;
  pill?: { bg: string; edge?: string; blur?: number };
  shadow?: string;
  upper?: boolean;
  tone?: (w: string) => string | undefined; // cor especial por palavra (ex.: negativo/positivo)
  activeBg?: string; // realce atrás da palavra que está a ser dita
  emph?: (w: string) => boolean; // palavras-chave: ficam maiores
};
type Chunk = { words: Word[]; start: number; end: number };
export const chunkWords = (words: Word[], maxChars: number): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const len = cur.reduce((a, x) => a + x.text.length + 1, 0);
    if (cur.length && (len + w.text.length > maxChars || (prev && w.start - prev.end > 0.35))) flush();
    cur.push(w);
    if (/[.!?…]$/.test(w.text) || (/[,;:]$/.test(w.text) && len > maxChars * 0.55)) flush();
  });
  flush();
  for (let i = 0; i < out.length - 1; i++) out[i].end = Math.min(out[i + 1].start - 0.02, out[i].end + 0.45);
  if (out.length) out[out.length - 1].end += 0.5;
  return out;
};
export const Captions: React.FC<{ words: Word[]; maxChars?: number; st: CapStyle; until?: number; hide?: [number, number][] }> = ({ words, maxChars = 28, st, until = 9999, hide = [] }) => {
  const { t, frame, fps, width } = useClock();
  const chunks = React.useMemo(() => chunkWords(words, maxChars), [words, maxChars]);
  if (t > until || hide.some(([a, b]) => t >= a && t < b)) return null;
  const c = chunks.find((x) => t >= x.start - 0.08 && t < x.end);
  if (!c) return null;
  const pop = spring({ frame: frame - Math.round((c.start - 0.08) * fps), fps, config: { damping: 16, stiffness: 240, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", left: (st.x ?? width / 2) - (st.maxWidth ?? width - 120) / 2, width: st.maxWidth ?? width - 120, top: st.y, display: "flex", justifyContent: "center", transform: `translateY(-50%) translateY(${(1 - pop) * 16}px)`, opacity: interpolate(pop, [0, 0.4], [0, 1], clamp) }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: Math.round(st.size * 0.28),
          padding: st.pill ? `${st.size * 0.28}px ${st.size * 0.6}px` : 0,
          borderRadius: st.size * 0.5,
          background: st.pill?.bg,
          border: st.pill?.edge ? `1.5px solid ${st.pill.edge}` : undefined,
          backdropFilter: st.pill ? `blur(${st.pill.blur ?? 18}px)` : undefined,
          boxShadow: st.pill ? "0 20px 40px -22px rgba(0,0,0,0.5)" : undefined,
          fontFamily: st.font,
          fontWeight: st.weight ?? 700,
          fontSize: st.size,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          textTransform: st.upper ? "uppercase" : "none",
          textShadow: st.shadow,
        }}
      >
        {c.words.map((w, i) => {
          const next = c.words[i + 1];
          const active = t >= w.start - 0.04 && (!next || t < next.start - 0.04);
          const said = t >= w.start - 0.04;
          const tone = st.tone?.(w.text);
          const em = !!st.emph?.(w.text);
          const big = said && em;
          const hl = active && st.activeBg;
          return (
            <span key={i} style={{ display: "inline-block", color: tone ?? (active ? st.active : st.color), opacity: said ? 1 : st.dim ?? 0.4, transform: active ? `translateY(-3px) scale(${big ? 1.1 : 1.04})` : big ? "scale(1.06)" : "none", ...(em ? { margin: "0 0.2em" } : {}), ...(hl ? { borderRadius: "0.16em", background: st.activeBg, boxShadow: `0 0 0 0.12em ${st.activeBg}` } : {}) }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ——— título cinético genérico (palavras entram quando são ditas) ———
export type KW = { w: string; at: number; color?: string; font?: string; italic?: boolean; size?: number; weight?: number };
export const Kinetic: React.FC<{ rows: { words: KW[]; size: number; font: string; weight?: number; color: string; gap?: number; italic?: boolean; spacing?: string }[]; out: number; offset?: number; style?: React.CSSProperties; align?: "center" | "flex-start" }> = ({
  rows,
  out,
  offset = 0,
  style,
  align = "center",
}) => {
  const { sp, ez } = useClock(offset);
  const gone = ez(out - 0.12, out + 0.16, 0, 1, EZ.in);
  if (gone >= 1) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: 4, opacity: 1 - gone, transform: `translateY(${-50 * gone}px)`, filter: `blur(${gone * 8}px)`, ...style }}>
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: "flex", flexWrap: "wrap", justifyContent: align, alignItems: "baseline", columnGap: r.gap ?? Math.round(r.size * 0.24) }}>
          {r.words.map((k, wi) => {
            const p = sp(k.at - 0.04, SP.snap);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  fontFamily: k.font ?? r.font,
                  fontWeight: k.weight ?? r.weight ?? 800,
                  fontStyle: k.italic ?? r.italic ? "italic" : "normal",
                  fontSize: k.size ?? r.size,
                  lineHeight: 1.04,
                  letterSpacing: r.spacing ?? "-0.03em",
                  color: k.color ?? r.color,
                  opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
                  transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + p * 0.06})`,
                  filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
                }}
              >
                {k.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ——— entradas de cena (0,45–0,5 s) ———
export type EnterKind = "rise" | "zoom" | "wipe" | "iris" | "blur" | "flip" | "slide" | "none";
export const Enter: React.FC<{ kind: EnterKind; children: React.ReactNode; dir?: 1 | -1 }> = ({ kind, children, dir = 1 }) => {
  const { frame, fps } = useClock();
  const p = interpolate(frame, [0, Math.round(0.48 * fps)], [0, 1], { easing: EZ.out, ...clamp });
  if (kind === "none" || p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  switch (kind) {
    case "rise":
      return <AbsoluteFill style={{ opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 160}px)` }}>{children}</AbsoluteFill>;
    case "zoom":
      return <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5), transform: `scale(${0.86 + 0.14 * p})`, filter: `blur(${(1 - p) * 12}px)` }}>{children}</AbsoluteFill>;
    case "wipe":
      return <AbsoluteFill style={{ clipPath: dir > 0 ? `inset(0 ${(1 - p) * 100}% 0 0)` : `inset(0 0 0 ${(1 - p) * 100}%)` }}>{children}</AbsoluteFill>;
    case "iris":
      return <AbsoluteFill style={{ clipPath: `circle(${p * 150}% at 50% 50%)` }}>{children}</AbsoluteFill>;
    case "blur":
      return <AbsoluteFill style={{ opacity: p, filter: `blur(${(1 - p) * 20}px)`, transform: `scale(${1.06 - 0.06 * p})` }}>{children}</AbsoluteFill>;
    case "flip":
      return <AbsoluteFill style={{ transform: `perspective(2200px) rotateY(${(1 - p) * 80 * dir}deg)`, transformOrigin: dir > 0 ? "0% 50%" : "100% 50%", opacity: Math.min(1, p * 2) }}>{children}</AbsoluteFill>;
    case "slide":
      return <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 100 * dir}%)`, boxShadow: "0 0 120px rgba(0,0,0,0.35)" }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

// ——— mistura: efeitos só na margem livre do áudio original (mixN.json) ———
export type Mix = { fps: number; headroom: number[]; peaks: Record<string, number>; voice?: number[]; loud?: Record<string, number> };
// durante a fala, cada efeito fica ~7 dB abaixo da voz (RMS); nos silêncios pode subir
const VOICE_ON = 0.012;
const UNDER_VOICE = 0.6;
export type Cue = { file: string; at: number; v?: number };
export const SFX_SECONDS: Record<string, number> = {
  "alert.wav": 0.32, "ding.wav": 1.3, "filmburn.wav": 1.1, "heartbeat.wav": 0.9, "hit.wav": 0.9, "no.wav": 0.6, "paper.wav": 0.45, "pop.wav": 0.16, "projector.wav": 1.6,
  "riser.wav": 1.0, "shimmer.wav": 1.4, "shutter.wav": 0.35, "stamp.wav": 0.3, "swell.wav": 2.2, "swish.wav": 0.28, "tap.wav": 0.07, "thud.wav": 0.28, "tick.wav": 0.04,
  "typekey.wav": 0.09, "whoosh.wav": 0.55, "yes.wav": 0.7, "click.wav": 0.09, "braam.wav": 2.6, "rec.wav": 0.32, "clap.wav": 0.25,
  "k_bell.wav": 1.48, "k_bong.wav": 0.12, "k_card_fan.wav": 0.72, "k_card_place.wav": 0.69, "k_card_slide.wav": 0.6, "k_chips.wav": 0.29, "k_click.wav": 0.02, "k_drop.wav": 0.19,
  "v17_shu.wav": 0.26, "v17_slide.wav": 0.38, "v17_slide_long.wav": 0.7, "v17_entry.wav": 0.42, "v17_entry_long.wav": 0.9, "v17_sub.wav": 1.1, "v17_glitch.wav": 0.34, "v17_pb.wav": 0.65, "v17_cor.wav": 0.55, "v17_riser.wav": 2.0, "v17_hit.wav": 1.4,
  "k_error.wav": 0.5, "k_glass_light.wav": 0.21, "k_glass_med.wav": 0.54, "k_glitch.wav": 0.03, "k_grass.wav": 0.67, "k_impact_heavy.wav": 0.57, "k_impact_soft.wav": 0.18,
  "k_key.wav": 0.25, "k_metal_light.wav": 0.23, "k_mouse.wav": 0.06, "k_punch.wav": 0.54, "k_roll.wav": 0.06, "k_select.wav": 0.06, "k_switch.wav": 0.61, "k_wood.wav": 0.33,
};
export const seq = (file: string, at: number, n: number, step: number, v?: number): Cue[] => Array.from({ length: n }, (_, i) => ({ file, at: at + i * step, v }));
// `master` escala o resultado final (depois dos limites), para misturas com música por baixo
export const SfxTrack: React.FC<{ cues: Cue[]; mix: Mix; gain: number; master?: number }> = ({ cues, mix, gain, master = 1 }) => {
  const { fps } = useVideoConfig();
  const headroomAt = (f: number) => {
    const h = mix.headroom;
    const i = Math.max(0, Math.min(h.length - 1, f));
    return Math.max(0.02, (h[Math.max(0, i - 1)] + h[i] + h[Math.min(h.length - 1, i + 1)]) / 3);
  };
  // menor nível de voz (só fotogramas com fala) à volta do instante, a antecipar 100 ms — cadeia lateral
  const voiceLow = (f: number) => {
    const vo = mix.voice;
    if (!vo) return Infinity;
    let low = Infinity;
    for (let k = f - 1; k <= f + 3; k++) {
      const x = vo[Math.max(0, Math.min(vo.length - 1, k))];
      if (x >= VOICE_ON) low = Math.min(low, x);
    }
    return low;
  };
  const duck = (file: string, desired: number, start: number) => (f: number) => {
    const peak = mix.peaks[file] ?? 1;
    const loud = mix.loud?.[file] ?? peak;
    const v = Math.min(desired, (0.8 * headroomAt(start + f)) / peak, (UNDER_VOICE * voiceLow(start + f)) / loud);
    // degraus de 0,5 dB (sempre para baixo, nunca acima do limite)
    if (v < 0.002) return 0;
    return master * Math.pow(10, Math.floor(40 * Math.log10(v) + 1e-6) / 40);
  };
  return (
    <>
      {cues.map((s, i) => {
        const start = Math.max(0, Math.round(s.at * fps));
        const len = Math.ceil((SFX_SECONDS[s.file] ?? 1.5) * fps) + 1;
        return (
          <Sequence key={i} from={start} durationInFrames={len} name={`sfx · ${s.file}`}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={duck(s.file, gain * (s.v ?? 1), start)} />
          </Sequence>
        );
      })}
    </>
  );
};

// ——— fecho com o perfil original (sem filtros por cima) ———
export const ProfileOutro: React.FC<{
  from: number;
  tap: number;
  bg: React.ReactNode;
  title: KW[];
  sub?: string;
  font: string;
  subFont?: string;
  ink: string;
  dim: string;
  accent: string;
  titleSize?: number;
}> = ({ from, tap, bg, title, sub, font, subFont, ink, dim, accent, titleSize }) => {
  const { fps, sp, vertical, width } = useClock(from);
  const card = sp(from + 0.1, SP.soft);
  const tapAt = Math.round((tap - from) * fps);
  const subIn = sp(from + 0.5, SP.soft);
  const cardW = vertical ? 1000 : 1040;
  const titleNode = (
    <Kinetic offset={from} out={9999} align={vertical ? "center" : "flex-start"} rows={[{ words: title, size: titleSize ?? (vertical ? 104 : 112), font, color: ink, weight: 800 }]} />
  );
  return (
    <Enter kind="zoom">
      {bg}
      {vertical ? (
        <>
          <div style={{ position: "absolute", left: 60, right: 60, top: 300 }}>{titleNode}</div>
          {sub && <div style={{ position: "absolute", left: 60, right: 60, top: 430, textAlign: "center", fontFamily: subFont ?? font, fontSize: 40, fontWeight: 500, color: dim, opacity: subIn }}>{sub}</div>}
          <div style={{ position: "absolute", left: (width - cardW) / 2, top: 560, opacity: interpolate(card, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - card) * 100}px) scale(${0.94 + card * 0.06})` }}>
            <PerfilCard width={cardW} tapAt={tapAt} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", opacity: subIn }}>
            <div style={{ padding: "16px 34px", borderRadius: 999, background: accent, color: "#fff", fontFamily: subFont ?? font, fontWeight: 700, fontSize: 36, boxShadow: `0 20px 40px -18px ${accent}` }}>@sergio_salvador10</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 110, top: 330, width: 640 }}>{titleNode}</div>
          {sub && <div style={{ position: "absolute", left: 110, top: 480, width: 620, fontFamily: subFont ?? font, fontSize: 38, fontWeight: 500, color: dim, opacity: subIn }}>{sub}</div>}
          <div style={{ position: "absolute", left: 110, top: 640, opacity: subIn }}>
            <div style={{ display: "inline-block", padding: "14px 30px", borderRadius: 999, background: accent, color: "#fff", fontFamily: subFont ?? font, fontWeight: 700, fontSize: 34, boxShadow: `0 20px 40px -18px ${accent}` }}>@sergio_salvador10</div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 150, opacity: interpolate(card, [0, 0.3], [0, 1], clamp), transform: `translateX(${(1 - card) * 120}px) scale(${0.94 + card * 0.06})` }}>
            <PerfilCard width={cardW} tapAt={tapAt} />
          </div>
        </>
      )}
    </Enter>
  );
};
