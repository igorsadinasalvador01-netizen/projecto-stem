import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp, Enter, EZ, Glass, Kinetic, KW, SP, useClock } from "../kit/Kit";
import { KICKS, score, Stadium3D } from "./Stadium3D";
import { T16 as T } from "./theme16";

// ——— noite de jogo: degradê escuro, dois refletores e o relvado em perspectiva ———
export const Bg16: React.FC = () => {
  const { t } = useClock();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${T.night} 0%, ${T.deep} 55%, #0F2440 100%)` }}>
      {[-1, 1].map((s) => (
        <div key={s} style={{ position: "absolute", left: s < 0 ? -260 : 640, top: -280, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,247,250,0.22), transparent 62%)", opacity: 0.85 + Math.sin(t * 1.3 + s) * 0.08 }} />
      ))}
      <div style={{ position: "absolute", left: -400, right: -400, bottom: -40, height: 760, transform: "perspective(900px) rotateX(62deg)", transformOrigin: "50% 100%", background: `repeating-linear-gradient(180deg, ${T.pitch} 0 90px, ${T.pitchDark} 90px 180px)`, opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 55%, rgba(10,26,47,0.55))" }} />
    </AbsoluteFill>
  );
};
type Row = Parameters<typeof Kinetic>[0]["rows"][number];
const big = (words: KW[], size = 150, color: string = T.chalk): Row => ({ words, size, font: T.display, color, weight: 400, spacing: "0.01em" });
const small = (words: KW[], size = 44, color: string = T.dim): Row => ({ words, size, font: T.body, color, weight: 600, spacing: "-0.01em" });
const Title: React.FC<{ rows: Row[]; out: number; offset: number; top?: number }> = ({ rows, out, offset, top = 220 }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top }}>
    <Kinetic offset={offset} out={out} rows={rows} />
  </div>
);
const Caps: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = T.dim, size = 24 }) => (
  <div style={{ fontFamily: T.body, fontWeight: 800, fontSize: size, letterSpacing: "0.22em", color }}>{children}</div>
);
const pin = (p: number, d = 40) => ({ opacity: interpolate(p, [0, 0.35], [0, 1], clamp), transform: `translateY(${(1 - p) * d}px) scale(${0.95 + p * 0.05})` });

// ——— 1 · liga até bater a meta ———
export const S1: React.FC = () => {
  const { t, sp, ez } = useClock(0);
  const fill = ez(1.5, 3.36, 0, 1, EZ.inOut);
  const hit = sp(3.36, SP.pop);
  const calls = Math.round(interpolate(t, [1.5, 3.36], [0, 47], { easing: EZ.inOut, ...clamp }));
  const r = 250;
  const C = 2 * Math.PI * r;
  return (
    <Enter kind="none">
      <Bg16 />
      <Title offset={0} out={99} rows={[small([{ w: "Vendedor que é vendedor", at: 0.08 }], 46), big([{ w: "liga até", at: 2.0 }, { w: "bater a meta.", at: 2.88, color: T.green }], 150)]} />
      <div style={{ position: "absolute", left: 540 - 300, top: 620, width: 600, height: 600, ...pin(sp(0.3, SP.soft)) }}>
        <svg width={600} height={600} viewBox="0 0 600 600" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={300} cy={300} r={r} stroke="rgba(244,247,250,0.1)" strokeWidth={26} fill="none" />
          <circle cx={300} cy={300} r={r} stroke={hit > 0.5 ? T.green : T.chalk} strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={`${C * fill} ${C}`} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Caps>META</Caps>
          <div style={{ fontFamily: T.display, fontSize: 200, lineHeight: 1, color: hit > 0.5 ? T.green : T.chalk }}>{Math.round(fill * 100)}%</div>
          <div style={{ fontFamily: T.body, fontWeight: 600, fontSize: 34, color: T.dim }}>{calls} ligações</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", ...pin(hit) }}>
        <div style={{ padding: "14px 36px", borderRadius: 999, background: T.green, fontFamily: T.display, fontSize: 52, letterSpacing: "0.06em", color: T.night }}>META BATIDA</div>
      </div>
    </Enter>
  );
};

// ——— 2 · esse é o segredo da venda ———
export const S2: React.FC = () => {
  const { t } = useClock(3.7);
  return (
    <Enter kind="zoom">
      <Bg16 />
      <div style={{ position: "absolute", left: 540 - 900, top: -200, width: 1800, height: 1800, background: `conic-gradient(from ${180 + Math.sin(t * 1.4) * 18}deg at 50% 0%, transparent 0deg, rgba(244,247,250,0.12) 12deg, transparent 26deg)` }} />
      <Title offset={3.7} out={99} top={700} rows={[small([{ w: "Esse é", at: 3.76 }], 50), big([{ w: "o segredo", at: 4.08 }], 190), big([{ w: "da venda.", at: 4.56, color: T.turq }], 190)]} />
    </Enter>
  );
};

// ——— 3 · quanto mais pessoas você fala, mais você vende ———
export const S3: React.FC = () => {
  const off = 5.1;
  const { t, sp } = useClock(off);
  const people = Math.round(interpolate(t, [5.4, 6.4], [0, 120], { easing: EZ.out, ...clamp }));
  const sales = Math.round(interpolate(t, [6.8, 7.4], [0, 18], { easing: EZ.out, ...clamp }));
  const bars = [0.18, 0.3, 0.42, 0.58, 0.76, 0.96];
  return (
    <Enter kind="slide">
      <Bg16 />
      <Title offset={off} out={99} rows={[big([{ w: "Quanto mais", at: 5.12 }, { w: "você fala,", at: 6.08 }], 130), big([{ w: "mais você vende.", at: 6.8, color: T.green }], 130)]} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 640, display: "flex", gap: 30 }}>
        {[
          { l: "PESSOAS", v: people, p: sp(5.3, SP.snap), c: T.chalk },
          { l: "VENDAS", v: sales, p: sp(6.7, SP.snap), c: T.green },
        ].map((x) => (
          <div key={x.l} style={{ flex: 1, ...pin(x.p) }}>
            <Glass tint={T.glass} edge={T.edge} radius={30} style={{ padding: "30px 34px" }}>
              <Caps>{x.l}</Caps>
              <div style={{ fontFamily: T.display, fontSize: 160, lineHeight: 1, color: x.c }}>{x.v}</div>
            </Glass>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1000, height: 380, display: "flex", alignItems: "flex-end", gap: 22 }}>
        {bars.map((h, i) => {
          const p = sp(5.5 + i * 0.28, SP.snap);
          return <div key={i} style={{ flex: 1, height: `${h * 100 * p}%`, borderRadius: "14px 14px 4px 4px", background: i === bars.length - 1 ? T.green : "rgba(244,247,250,0.22)" }} />;
        })}
      </div>
    </Enter>
  );
};

// ——— 4 · o relvado 3D: treino, a bola, o gol, chutar até ficar proficiente ———
type V3 = [number, number, number];
const mix3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const ez = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { easing: EZ.inOut, ...clamp });
const WIDE = { pos: [0, 10, 13] as V3, look: [0, 0, -5] as V3 };
const BEHIND = { pos: [0, 2.2, 4.6] as V3, look: [0, 0, -6] as V3 };
const LOW = { pos: [1.5, 1.1, 3.4] as V3, look: [-0.2, 0.3, -6] as V3 };
export const camAt = (t: number) => {
  const a = ez(t, 7.7, 8.75);
  const b = ez(t, 11.5, 13.4) * (1 - ez(t, 14.1, 14.6));
  let pos = mix3(WIDE.pos, BEHIND.pos, a);
  let look = mix3(WIDE.look, BEHIND.look, a);
  pos = mix3(pos, LOW.pos, b);
  look = mix3(look, LOW.look, b);
  // pequeno abalo da câmara em cada golo
  const g = KICKS.filter((k) => k.kind === "goal").reduce((acc, k) => acc + Math.max(0, 1 - Math.abs(t - (k.at + 0.42)) / 0.18), 0);
  pos = [pos[0] + Math.sin(t * 60) * 0.02 * g, pos[1] + Math.cos(t * 55) * 0.02 * g, pos[2]];
  return { pos, look };
};
export const Pitch: React.FC = () => {
  const off = 7.7;
  const { t, sp, ez: ezc } = useClock(off);
  const acc = Math.round(interpolate(t, [10.2, 11.1], [18, 74], { easing: EZ.out, ...clamp }));
  const gauge = sp(8.6, SP.soft) * (1 - ezc(11.3, 11.6));
  const board = sp(14.45, SP.soft);
  const s = (() => {
    const all = score(t);
    const pre = score(14.4);
    return { shots: all.shots - pre.shots, goals: all.goals - pre.goals };
  })();
  const rate = s.shots ? Math.round((s.goals / s.shots) * 100) : 0;
  const pro = sp(16.72, SP.pop);
  const goalPop = KICKS.filter((k) => k.kind === "goal" && k.at > 14.4).reduce((a, k) => a + Math.max(0, 1 - Math.abs(t - (k.at + 0.45)) / 0.2), 0);
  return (
    <Enter kind="blur">
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${T.night}, ${T.deep} 60%, #0F2440)` }} />
      <Stadium3D width={1080} height={1920} offset={off} cam={camAt} ballFrom={8.2} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,26,47,0.75) 0%, transparent 30%, transparent 70%, rgba(10,26,47,0.6) 100%)" }} />
      <Title offset={off} out={11.3} rows={[small([{ w: "E quanto mais você", at: 7.76 }], 46), big([{ w: "treina,", at: 8.64, color: T.turq }], 160)]} />
      <Title offset={off} out={14.25} rows={[small([{ w: "Nunca jogou futebol?", at: 12.16 }], 46), big([{ w: "Pega a bola.", at: 13.28 }, { w: "Tem o gol.", at: 13.84, color: T.green }], 120)]} />
      <Title offset={off} out={99} rows={[small([{ w: "Quanto mais você", at: 14.4 }], 46), big([{ w: "chuta pro gol,", at: 15.2 }], 130)]} />
      {/* índice de acerto a subir */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 930, ...pin(gauge) }}>
        <Glass tint={T.glass} edge={T.edge} radius={30} style={{ padding: "24px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Caps>ÍNDICE DE ACERTO</Caps>
            <span style={{ fontFamily: T.display, fontSize: 84, lineHeight: 1, color: acc > 50 ? T.green : T.chalk }}>{acc}%</span>
          </div>
          <div style={{ marginTop: 12, height: 14, borderRadius: 7, background: "rgba(244,247,250,0.12)" }}>
            <div style={{ width: `${acc}%`, height: "100%", borderRadius: 7, background: acc > 50 ? T.green : T.chalk }} />
          </div>
        </Glass>
      </div>
      {/* placar */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 380, ...pin(board) }}>
        <Glass tint={T.glass} edge={T.edge} radius={28} style={{ padding: "18px 30px", display: "flex", justifyContent: "space-between" }}>
          {[
            { l: "CHUTES", v: String(s.shots).padStart(2, "0"), c: T.chalk, p: 0 },
            { l: "GOLS", v: String(s.goals).padStart(2, "0"), c: T.green, p: goalPop },
            { l: "ACERTO", v: `${rate}%`, c: T.chalk, p: 0 },
          ].map((x) => (
            <div key={x.l} style={{ textAlign: "center", minWidth: 200 }}>
              <Caps size={20}>{x.l}</Caps>
              <div style={{ fontFamily: T.display, fontSize: 92, lineHeight: 1, color: x.c, transform: `scale(${1 + x.p * 0.25})` }}>{x.v}</div>
            </div>
          ))}
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", opacity: interpolate(pro, [0, 0.3], [0, 1], clamp), transform: `rotate(-4deg) scale(${1.8 - pro * 0.8})` }}>
        <div style={{ padding: "10px 40px", border: `6px solid ${T.green}`, borderRadius: 16, background: "rgba(10,26,47,0.55)", fontFamily: T.display, fontSize: 110, letterSpacing: "0.04em", color: T.green }}>PROFICIENTE</div>
      </div>
    </Enter>
  );
};
