import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { loadFonts } from "../fonts";
import { BEAT, BLACK, bf, ClipId, fb, FPS19, samples, SHOTS, Shot, shotIndexAt, speedAt, srcAt, TEXTS, k60 } from "./edit19";

loadFonts();

// ——— Vídeo 19: edição cinematográfica de ginásio (sem narração; música e SFX originais) ———
const W = 1080;
const H = 1920;
const UI = "Inter Tight";
const C = { white: "#F3F5F8", ink: "#05070A" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TR = 4; // meia-duração (fotogramas) das transições direcionais

const SRC = (k: ClipId) => staticFile(`v19/${k}.mp4`);
// recortes da pessoa (alfa) só onde o texto passa por trás do corpo
const FG: Partial<Record<number, { file: string; k0: number }>> = {
  5: { file: "v19/A_fg.webm", k0: 120 },
  20: { file: "v19/E_fg.webm", k0: 405 },
};

const ease = Easing.bezier(0.45, 0, 0.55, 1);

type Look = { z: number; tx: number; ty: number; rot: number; bx: number; by: number; op: number; bright: number; blur: number };

// enquadramento: zoom lento + foco, impulsos de zoom nos impactos, tremor controlado
const frameShot = (sh: Shot, beat: number): Look => {
  const p = interpolate(beat, sh.b, [0, 1], clamp);
  let z = sh.z[0] + (sh.z[1] - sh.z[0]) * ease(p);
  let dx = 0;
  let dy = 0;
  let rot = 0;
  for (const k of sh.kick ?? []) {
    const dt = (beat - k) * BEAT;
    if (dt >= -0.01) z *= 1 + 0.05 * Math.exp(-Math.max(0, dt) / 0.11);
  }
  for (const k of sh.shake ?? []) {
    const dt = (beat - k) * BEAT;
    if (dt >= 0 && dt < 0.5) {
      const a = Math.exp(-dt / 0.13);
      dx += 16 * a * Math.sin(2 * Math.PI * 11 * dt);
      dy += 11 * a * Math.sin(2 * Math.PI * 14 * dt + 1.3);
      rot += 0.45 * a * Math.sin(2 * Math.PI * 8 * dt + 0.6);
      z += 0.03 * a;
    }
  }
  const mx = ((z - 1) * W) / 2;
  const my = ((z - 1) * H) / 2;
  const tx = Math.max(-mx, Math.min(mx, (0.5 - sh.c[0]) * W * z)) + dx;
  const ty = Math.max(-my, Math.min(my, (0.5 - sh.c[1]) * H * z)) + dy;
  return { z, tx, ty, rot, bx: 0, by: 0, op: 1, bright: 1, blur: 0 };
};

// pilha ponderada de fotogramas (interpolação/obturador): opacidade acumulada
const FrameStack: React.FC<{ file: string; frames: { f: number; w: number }[]; transparent?: boolean }> = ({ file, frames, transparent }) => {
  let cum = 0;
  return (
    <>
      {frames.map(({ f, w }, i) => {
        cum += w;
        const op = i === 0 ? 1 : w / cum;
        return (
          <AbsoluteFill key={f} style={{ opacity: op }}>
            <Freeze frame={f} active>
              <OffthreadVideo src={staticFile(file)} muted transparent={transparent} style={{ width: W, height: H }} />
            </Freeze>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const lookStyle = (L: Look): React.CSSProperties => ({
  transform: `translate(${L.tx}px, ${L.ty}px) rotate(${L.rot}deg) scale(${L.z})`,
  transformOrigin: "50% 50%",
  opacity: L.op,
  filter: [L.bright !== 1 ? `brightness(${L.bright})` : "", L.blur > 0.3 ? `blur(${L.blur}px)` : "", L.bx + L.by > 0.5 ? `url(#mb${Math.round(L.bx)}_${Math.round(L.by)})` : ""].join(" ").trim() || undefined,
});

// desfoque direcional (SVG) para whips
const MotionBlurDefs: React.FC<{ looks: Look[] }> = ({ looks }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      {looks
        .filter((L) => L.bx + L.by > 0.5)
        .map((L) => (
          <filter key={`${Math.round(L.bx)}_${Math.round(L.by)}`} id={`mb${Math.round(L.bx)}_${Math.round(L.by)}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={`${Math.round(L.bx)} ${Math.round(L.by)}`} edgeMode="duplicate" />
          </filter>
        ))}
    </defs>
  </svg>
);

const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.085 }}>
    <filter id="grain19">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 97} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={W} height={H} filter="url(#grain19)" />
  </svg>
);

// ——— tipografia mínima (sem subtítulos, sem marca) ———
const Letters: React.FC<{ txt: string; f: number; size: number; weight: number; track0: number; track1: number; dur: number; stagger?: number }> = ({ txt, f, size, weight, track0, track1, dur, stagger = 1.6 }) => {
  const track = interpolate(f, [0, dur], [track0, track1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ fontFamily: UI, fontWeight: weight, fontSize: size, letterSpacing: `${track}em`, color: C.white, whiteSpace: "nowrap", lineHeight: 1, textShadow: "0 14px 50px rgba(0,0,0,0.35)" }}>
      {[...txt].map((ch, i) => {
        const p = interpolate(f - i * stagger, [0, 13], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 34}px)`, filter: p < 0.99 ? `blur(${(1 - p) * 10}px)` : undefined }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};

const TextLayer: React.FC<{ frame: number; layer: "behind" | "front" }> = ({ frame, layer }) => (
  <>
    {TEXTS.map((t, i) => {
      const f0 = Math.round(bf(t.b[0]));
      const f1 = Math.round(bf(t.b[1]));
      if (frame < f0 || frame > f1) return null;
      const f = frame - f0;
      const out = interpolate(frame, [f1 - 8, f1], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
      const outBlur = (1 - out) * 10;
      if (t.style === "behind" && layer === "behind")
        return (
          <AbsoluteFill key={i} style={{ alignItems: "center", top: 430, height: 200, opacity: out, filter: outBlur > 0.3 ? `blur(${outBlur}px)` : undefined }}>
            <Letters txt={t.txt} f={f} size={150} weight={800} track0={0.2} track1={0.05} dur={f1 - f0} />
          </AbsoluteFill>
        );
      if (t.style === "hero" && layer === "behind")
        return (
          <AbsoluteFill key={i} style={{ alignItems: "center", top: 300, height: 200, opacity: out, filter: outBlur > 0.3 ? `blur(${outBlur}px)` : undefined }}>
            <Letters txt={t.txt} f={f} size={128} weight={800} track0={0.16} track1={0.04} dur={f1 - f0} stagger={1.3} />
          </AbsoluteFill>
        );
      if (t.style === "end" && layer === "front") {
        const lines = t.txt.split("|");
        const rule = interpolate(f, [0, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <AbsoluteFill key={i} style={{ alignItems: "center", top: 1270, height: 300, opacity: out }}>
            <div style={{ width: 92 * rule, height: 2, background: C.white, opacity: 0.85, marginBottom: 40 }} />
            {lines.map((ln, j) => {
              const p = interpolate(f - 6 - j * 7, [0, 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
              return (
                <div key={j} style={{ overflow: "hidden", padding: "6px 0" }}>
                  <div style={{ fontFamily: UI, fontWeight: 600, fontSize: 64, letterSpacing: "0.3em", marginRight: "-0.3em", color: C.white, lineHeight: 1.12, transform: `translateY(${(1 - p) * 100}%)`, opacity: p }}>{ln}</div>
                </div>
              );
            })}
          </AbsoluteFill>
        );
      }
      return null;
    })}
  </>
);

// ——— transições ———
const whipDir = (k?: string) => ({ whipL: [-1, 0], whipR: [1, 0], whipU: [0, -1], whipD: [0, 1] } as Record<string, number[]>)[k ?? ""];

const looksAt = (frame: number) => {
  const beat = fb(frame);
  const i = shotIndexAt(beat);
  const out: { idx: number; L: Look; beat: number }[] = [];
  const sh = SHOTS[i];
  const fc = bf(sh.b[0]);
  const nx = SHOTS[i + 1];
  const fn = nx ? bf(nx.b[0]) : Infinity;
  // transição de entrada no plano atual (perto do início) ou saída para o próximo (perto do fim)
  const pair = (P: number, Q: number, fcut: number) => {
    const typ = SHOTS[Q].in ?? "cut";
    const u = interpolate(frame, [fcut - TR, fcut + TR], [0, 1], clamp);
    const LP = frameShot(SHOTS[P], beat);
    const LQ = frameShot(SHOTS[Q], beat);
    const dir = whipDir(typ);
    if (dir) {
      const E = Easing.inOut(Easing.cubic);
      const e = E(u);
      // velocidade do movimento neste fotograma → quantidade de desfoque direcional
      const du = 1 / (2 * TR);
      const de = E(Math.min(1, u + du / 2)) - E(Math.max(0, u - du / 2));
      const span = dir[0] ? W : H;
      const blurPx = Math.min(90, de * span * 0.45);
      LP.tx += dir[0] * e * W;
      LP.ty += dir[1] * e * H;
      LQ.tx += -dir[0] * (1 - e) * W;
      LQ.ty += -dir[1] * (1 - e) * H;
      for (const L of [LP, LQ]) {
        L.bx = dir[0] ? blurPx : 0;
        L.by = dir[1] ? blurPx : 0;
      }
      return [
        { idx: P, L: LP, beat: Math.min(beat, SHOTS[P].b[1]) },
        { idx: Q, L: LQ, beat: Math.max(beat, SHOTS[Q].b[0]) },
      ];
    }
    if (typ === "zoom") {
      if (frame < fcut) {
        const a = interpolate(frame, [fcut - TR, fcut], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
        LP.z *= 1 + 0.55 * a;
        LP.blur = 9 * a;
        return [{ idx: P, L: LP, beat }];
      }
      const a = interpolate(frame, [fcut, fcut + TR + 2], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
      LQ.z *= 1 + 0.32 * a;
      LQ.blur = 7 * a;
      LQ.bright = 1 + 0.25 * a;
      return [{ idx: Q, L: LQ, beat }];
    }
    return null;
  };
  if (i > 0 && frame < fc + TR + 2) {
    const r = pair(i - 1, i, fc);
    if (r) return r;
  }
  if (nx && frame >= fn - TR) {
    const r = pair(i, i + 1, fn);
    if (r) return r;
  }
  const L = frameShot(sh, beat);
  const typ = sh.in ?? "cut";
  const df = frame - fc;
  if (typ === "flash" && df < 8) L.bright = 1 + 0.75 * Math.exp(-Math.max(0, df) / 1.7);
  if (typ === "dip") L.op = interpolate(df, [1, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (nx && (nx.in ?? "cut") === "dip") L.op *= interpolate(frame, [fn - 4, fn], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  out.push({ idx: i, L, beat });
  return out;
};

const ShotView: React.FC<{ idx: number; L: Look; beat: number; frame: number; textBehind: boolean }> = ({ idx, L, beat, frame, textBehind }) => {
  const sh = SHOTS[idx];
  const b = Math.max(sh.b[0], Math.min(sh.b[1] - 1e-3, beat));
  const s = srcAt(sh, b);
  const sp = beat < sh.b[0] || beat > sh.b[1] ? 0 : speedAt(sh, b);
  const fr = samples(sh.clip, s, sp);
  const fg = FG[idx];
  return (
    <AbsoluteFill style={lookStyle(L)}>
      <FrameStack file={`v19/${sh.clip}.mp4`} frames={fr} />
      {textBehind && fg && (
        <>
          <TextLayer frame={frame} layer="behind" />
          <FrameStack file={fg.file} frames={fr.map((x) => ({ f: Math.max(0, x.f - fg.k0), w: x.w }))} transparent />
        </>
      )}
    </AbsoluteFill>
  );
};

export type Video19Props = { music: boolean };

export const Video19: React.FC<Video19Props> = ({ music }) => {
  const frame = useCurrentFrame();
  const beat = fb(frame);
  const looks = looksAt(frame);
  // texto por trás do corpo: desenhado dentro do plano (mesma transformação), entre a imagem e o recorte
  const behindOn = TEXTS.some((t) => t.style !== "end" && frame >= Math.round(bf(t.b[0])) && frame <= Math.round(bf(t.b[1])));
  // freeze: leve escurecimento para o texto respirar
  const cur = SHOTS[shotIndexAt(beat)];
  let dim = 0;
  if (cur.freeze && beat >= cur.freeze[0]) dim = interpolate(beat, [cur.freeze[0] + 0.3, cur.freeze[0] + 2], [0, cur.freeze[1] > 70 ? 0.5 : 0.22], { ...clamp, easing: ease });
  // preto: pausas antes do drop/clímax e o fecho
  let black = 0;
  for (const [a, e] of BLACK) {
    const fa = bf(a);
    const fe = bf(e);
    if (e >= 80) black = Math.max(black, interpolate(frame, [fa, fa + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }));
    else if (frame >= Math.round(fa) && frame < Math.round(fe)) black = 1;
  }
  // flash curto (exposição) nas entradas com "flash"
  const sh = SHOTS[shotIndexAt(beat)];
  const df = frame - bf(sh.b[0]);
  const flash = sh.in === "flash" && df >= 0 && df < 6 ? 0.32 * Math.exp(-df / 1.2) : 0;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <MotionBlurDefs looks={looks.map((x) => x.L)} />
      {looks.map((x) => (
        <ShotView key={x.idx} idx={x.idx} L={x.L} beat={x.beat} frame={frame} textBehind={behindOn && FG[x.idx] !== undefined} />
      ))}
      {/* acabamento: vinheta suave (o resto da gradação está na filmagem) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 62% at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.42) 100%)" }} />
      {dim > 0 && <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(3,5,8,${dim * 0.55}) 0%, rgba(3,5,8,${dim * 0.75}) 50%, rgba(3,5,8,${Math.min(0.9, dim * 1.5)}) 100%)` }} />}
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />}
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: black }} />
      <TextLayer frame={frame} layer="front" />
      {music && <Audio src={staticFile("audio19.m4a")} />}
    </AbsoluteFill>
  );
};

export { FPS19, k60 };
