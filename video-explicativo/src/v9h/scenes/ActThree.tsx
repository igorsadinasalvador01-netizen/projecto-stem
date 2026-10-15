import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { A, Backdrop, C, Cursor, F, FaceCard, FaceFull, FaceVideo, Glass, Phone, Pic, SceneInH, SideCard, STILL, VIDS, VideoThumb } from "../Premium";
import { SCENESH, t9, VOICE_END } from "../timelineH";

const S = (id: string) => SCENESH.find((s) => s.id === id)!;
const Dy = A.day;
const soft = { damping: 18, stiffness: 110, mass: 0.9 };
const snap = { damping: 14, stiffness: 180, mass: 0.6 };

const Check: React.FC<{ size: number; color?: string }> = ({ size, color = C.good }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </div>
);
export const HeartIcon: React.FC<{ size: number; color?: string }> = ({ size, color = C.blue }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-10-9.3C.3 8.3 2 4 6 4c2.3 0 3.6 1.3 4.5 2.6.4.6 1.6.6 2 0C13.4 5.3 14.7 4 17 4c4 0 5.7 4.3 4 7.7C19.5 16.4 12 21 12 21z" fill={color} />
  </svg>
);

// ——— c1: "E atenção." ———
export const C1: React.FC = () => {
  const at = useAt(S("c1").from);
  const att = at(t9("atenção", 39.4));
  return (
    <SceneInH kind="light">
      <FaceFull sceneFrom={S("c1").from} grade="day" act="day" />
      <SideCard x={170} y={340} w={420} at={att - 3} pad="22px 26px">
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width={58} height={58} viewBox="0 0 24 24" fill="none">
            <path d="M12 3L2 20h20z" fill={C.warnSoft} stroke={C.warn} strokeWidth={1.8} strokeLinejoin="round" />
            <path d="M12 9.5v4.5M12 17v.3" stroke={C.warn} strokeWidth={2.2} strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: 36, color: C.warn, letterSpacing: "-0.02em" }}>Atenção</div>
            <div style={{ fontSize: 20, color: Dy.dim }}>um ponto importante</div>
          </div>
        </div>
      </SideCard>
      <SideCard x={1330} y={340} w={430} at={att + 5} from="right" pad="20px 24px">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 68, height: 68, borderRadius: 34, overflow: "hidden", flexShrink: 0 }}>
            <Pic src={STILL[2]} pos="50% 25%" style={{ transform: "scale(1.4)", transformOrigin: "50% 22%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 25 }}>A tua imagem</div>
            <div style={{ fontSize: 19, color: Dy.dim }}>continua a ser tua</div>
          </div>
          <Check size={40} />
        </div>
      </SideCard>
    </SceneInH>
  );
};

// ——— c2: a sua imagem continua — visor de câmara vs. avatar gerado ———
export const C2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("c2");
  const at = useAt(sc.from);
  const card = spring({ frame: frame - 2, fps, config: soft });
  const sub = at(t9("substituir", 40.5));
  const rej = at(t9("imagem", 41.3));
  const av = spring({ frame: frame - sub, fps, config: soft });
  const out = interpolate(frame, [rej + 6, rej + 20], [0, 1], { easing: theme.ease.in, ...clamp });
  const lock = spring({ frame: frame - at(t9("aparecer", 42)), fps, config: snap });
  const t = frame / fps;
  const br = 26 - lock * 10;
  return (
    <SceneInH kind="fade">
      <Backdrop act="day" />
      {/* avatar gerado que tenta ocupar o lugar */}
      <div style={{ position: "absolute", left: 200 + av * 260 - out * 380, top: 260, width: 360, height: 520, opacity: av * (1 - out), transform: `rotate(${out * -10}deg) scale(${1 - out * 0.1})`, filter: `blur(${out * 6}px)` }}>
        <Glass act="day" style={{ position: "absolute", inset: 0, overflow: "hidden" }} radius={30}>
          <Pic src={STILL[1]} pos="50% 30%" filter="saturate(0.25) contrast(1.15) brightness(1.12) blur(1.4px)" />
          <Pic src={STILL[1]} pos="50% 30%" filter="saturate(0) brightness(1.3) blur(0.6px)" style={{ mixBlendMode: "screen", opacity: 0.35, transform: `translateX(${Math.sin(frame * 0.9) * 5}px)` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(186,230,253,0.45), rgba(241,245,249,0.15))", mixBlendMode: "multiply" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(15,23,42,0.07) 0 2px, transparent 2px 5px)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: `${(frame * 3) % 100}%`, height: 18, background: "rgba(255,255,255,0.35)", filter: "blur(4px)" }} />
          <div style={{ position: "absolute", left: 22, top: 20, padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.8)", fontFamily: F.sans, fontWeight: 600, fontSize: 20, color: Dy.dim }}>avatar gerado por IA</div>
        </Glass>
        {frame >= rej && (
          <div style={{ position: "absolute", right: -26, top: -26, width: 76, height: 76, borderRadius: 38, background: Dy.warn, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spring({ frame: frame - rej, fps, config: snap })})` }}>
            <svg width={40} height={40} viewBox="0 0 24 24" stroke="#fff" strokeWidth={3.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </div>
        )}
      </div>
      {/* o que continua a ser seu */}
      {["A tua imagem", "A tua voz", "As tuas ideias"].map((l, k) => (
        <SideCard key={l} x={1400} y={300 + k * 128} w={400} at={at(t9("aparecer", 42)) + k * 5} from="right" pad="18px 22px">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Check size={44} />
            <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: "-0.01em" }}>{l}</div>
          </div>
        </SideCard>
      ))}
      {/* você, no visor */}
      <div style={{ position: "absolute", left: 760, top: 50, width: 560, height: 900, opacity: card, transform: `scale(${0.95 + card * 0.05})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 36, overflow: "hidden", boxShadow: "0 50px 100px -40px rgba(15,23,42,0.45)" }}>
          <FaceVideo sceneFrom={sc.from} grade="day" posY={36} />
        </div>
        <div style={{ position: "absolute", left: 26, top: 24, display: "flex", alignItems: "center", gap: 10, fontFamily: F.mono, fontSize: 22, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#FF453A", opacity: Math.floor(t * 2) % 2 ? 1 : 0.4 }} />
          REC
        </div>
        <div style={{ position: "absolute", right: 26, top: 24, fontFamily: F.mono, fontSize: 22, color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>4K · 30</div>
        {/* foco no rosto */}
        <div style={{ position: "absolute", left: 140 + br, top: 170 + br, width: 280 - 2 * br, height: 300 - 2 * br }}>
          {[
            { left: 0, top: 0, b: "borderLeft borderTop" },
            { right: 0, top: 0, b: "borderRight borderTop" },
            { left: 0, bottom: 0, b: "borderLeft borderBottom" },
            { right: 0, bottom: 0, b: "borderRight borderBottom" },
          ].map((c, i) => {
            const col = lock > 0.5 ? C.good : "rgba(255,255,255,0.9)";
            const st: React.CSSProperties = { position: "absolute", width: 40, height: 40, ...c };
            c.b.split(" ").forEach((k) => ((st as Record<string, string>)[k] = `4px solid ${col}`));
            delete (st as Record<string, unknown>).b;
            return <div key={i} style={st} />;
          })}
        </div>
        {lock > 0.05 && (
          <div style={{ position: "absolute", left: "50%", bottom: 40, transform: `translateX(-50%) scale(${lock})`, padding: "10px 24px", borderRadius: 999, background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", gap: 12, fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: Dy.ink }}>
            <Check size={30} />
            Você
          </div>
        )}
      </div>
    </SceneInH>
  );
};

// ——— c3: partilhar · conectar · agregar — um globo de pontos e mensagens de quem foi ajudado ———
const fib = (n: number) =>
  Array.from({ length: n }).map((_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    return [Math.cos(th) * r, y, Math.sin(th) * r] as [number, number, number];
  });
const PTS = fib(420);
const CITY = [17, 63, 120, 171, 222, 268, 311, 356];
// reações ilustrativas (sem nomes nem números): o que o conteúdo provoca nas pessoas
const MSGS = [
  { x: 170, y: 210, c: "#2563EB", m: "Obrigado por partilhar!" },
  { x: 1380, y: 170, c: "#16A34A", m: "Isto ajudou-me muito." },
  { x: 140, y: 620, c: "#64748B", m: "Vou começar hoje." },
  { x: 1400, y: 600, c: "#0EA5E9", m: "Partilhei com amigos." },
];
export const C3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("c3");
  const at = useAt(sc.from);
  const t = frame / fps;
  const R = 330;
  const cx = 960;
  const cy = 500;
  const rot = t * 0.25;
  const proj = (p: [number, number, number]) => {
    const x = p[0] * Math.cos(rot) - p[2] * Math.sin(rot);
    const z = p[0] * Math.sin(rot) + p[2] * Math.cos(rot);
    const y = p[1] * Math.cos(0.35) - z * Math.sin(0.35);
    const zz = p[1] * Math.sin(0.35) + z * Math.cos(0.35);
    return { x: cx + x * R, y: cy + y * R, z: zz };
  };
  const globe = spring({ frame: frame - 2, fps, config: soft });
  const share = at(t9("partilhar", 45.3));
  const link = at(t9("conectar", 46.8));
  const group = at(t9("agregar", 47.4));
  const tool = spring({ frame: frame - at(t9("ferramenta", 44)), fps, config: snap });
  return (
    <SceneInH kind="zoom">
      <Backdrop act="day" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: globe }}>
        <circle cx={cx} cy={cy} r={R} fill="rgba(241,245,249,0.8)" />
        {PTS.map((p, i) => {
          const q = proj(p);
          return <circle key={i} cx={q.x} cy={q.y} r={q.z > 0 ? 3.4 : 2} fill={q.z > 0 ? "#94A3B8" : "#CBD5E1"} />;
        })}
        {/* rotas: de você para o mundo */}
        {CITY.map((ci, k) => {
          const q = proj(PTS[ci]);
          const pr = interpolate(frame, [share + k * 2, share + k * 2 + 14], [0, 1], clamp);
          if (pr <= 0) return null;
          const mx = (cx + q.x) / 2;
          const my = (cy + q.y) / 2 - 140;
          return (
            <g key={k}>
              <path d={`M ${cx} ${cy} Q ${mx} ${my} ${q.x} ${q.y}`} stroke={C.blue} strokeWidth={3} fill="none" pathLength={1} strokeDasharray={`${pr} 1`} strokeLinecap="round" />
              {pr > 0.95 && <circle cx={q.x} cy={q.y} r={9} fill={C.blue} opacity={q.z > -0.2 ? 1 : 0.4} />}
            </g>
          );
        })}
        {/* ligações entre as pessoas */}
        {CITY.map((ci, k) => {
          const a = proj(PTS[ci]);
          const b = proj(PTS[CITY[(k + 3) % CITY.length]]);
          const pr = interpolate(frame, [link + k * 2, link + k * 2 + 12], [0, 1], clamp);
          return pr > 0 ? <path key={`l${k}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={C.good} strokeWidth={2.5} pathLength={1} strokeDasharray={`${pr} 1`} opacity={0.8} /> : null;
        })}
      </svg>
      {/* você no centro */}
      <div style={{ position: "absolute", left: cx - 80, top: cy - 80, width: 160, height: 160, borderRadius: 80, overflow: "hidden", border: "5px solid #fff", boxShadow: "0 20px 40px -14px rgba(15,23,42,0.45)", transform: `scale(${0.6 + tool * 0.4})`, opacity: globe }}>
        <FaceVideo sceneFrom={sc.from} grade="day" posY={34} zoom={1.4} punch={false} />
      </div>
      {/* as pessoas que respondem */}
      {MSGS.map((m, k) => {
        const p = spring({ frame: frame - group - k * 4, fps, config: snap }); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div key={k} style={{ position: "absolute", left: m.x, top: m.y, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})` }}>
            <Glass act="day" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", background: "rgba(255,255,255,0.88)" }} radius={24}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: `linear-gradient(135deg, ${m.c}, #fff)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={30} height={30} viewBox="0 0 24 24" fill="#fff">
                  <circle cx={12} cy={8} r={4.5} />
                  <path d="M3 21c1-5 4.5-7.5 9-7.5s8 2.5 9 7.5z" />
                </svg>
              </div>
              <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: Dy.ink, whiteSpace: "nowrap" }}>{m.m}</div>
              <HeartIcon size={30} />
            </Glass>
          </div>
        );
      })}
    </SceneInH>
  );
};

// ——— c4: sem tempo para estar diante das câmeras — o vídeo sai na mesma ———
export const C4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c4").from);
  const set = spring({ frame: frame - 2, fps, config: soft });
  const fast = at(t9("não", 49));
  const hours = frame < fast ? 14 + frame / 60 : 14 + fast / 60 + (frame - fast) / 4;
  const hh = Math.floor(hours) % 24;
  const mm = Math.floor((hours % 1) * 60);
  const pub = spring({ frame: frame - at(t9("câmeras", 50)), fps, config: snap });
  return (
    <SceneInH kind="slide">
      <Backdrop act="day" />
      {/* luz de anel */}
      <div style={{ position: "absolute", left: 1020, top: 140, opacity: set }}>
        <div style={{ width: 420, height: 420, borderRadius: 210, border: "26px solid #FFFDF8", boxShadow: "0 0 80px rgba(255,236,200,0.95), inset 0 0 40px rgba(255,236,200,0.8)" }} />
        <div style={{ position: "absolute", left: 205, top: 420, width: 10, height: 380, background: "#2A2725", borderRadius: 5 }} />
        <div style={{ position: "absolute", left: 130, top: 790, width: 160, height: 10, background: "#2A2725", borderRadius: 5 }} />
      </div>
      {/* banco vazio */}
      <div style={{ position: "absolute", left: 1110, top: 640, opacity: set }}>
        <div style={{ width: 240, height: 34, borderRadius: 17, background: "linear-gradient(180deg, #CBD5E1, #94A3B8)" }} />
        <svg width={240} height={260} viewBox="0 0 240 260">
          <path d="M40 0 L20 260 M200 0 L220 260 M60 120 L180 120" stroke="#64748B" strokeWidth={12} strokeLinecap="round" />
        </svg>
      </div>
      {/* câmara no tripé */}
      <div style={{ position: "absolute", left: 300, top: 300, opacity: set, transform: `translateX(${(1 - set) * -100}px)` }}>
        <div style={{ width: 300, height: 190, borderRadius: 26, background: "linear-gradient(160deg, #3A3D44, #15161A)", boxShadow: "0 40px 60px -30px rgba(0,0,0,0.6)", position: "relative" }}>
          <div style={{ position: "absolute", right: -70, top: 35, width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 40% 35%, #4A5A7A, #0A0C12 60%)", border: "10px solid #2A2C31" }} />
          <div style={{ position: "absolute", left: 22, top: 18, width: 14, height: 14, borderRadius: 7, background: "#FF453A", opacity: Math.floor(frame / 15) % 2 ? 1 : 0.3 }} />
        </div>
        <svg width={300} height={420} viewBox="0 0 300 420">
          <path d="M150 0 L50 420 M150 0 L150 420 M150 0 L250 420" stroke="#2A2725" strokeWidth={9} strokeLinecap="round" />
        </svg>
      </div>
      {/* relógio */}
      <div style={{ position: "absolute", left: 120, top: 150, opacity: set }}>
        <Glass act="day" style={{ padding: "16px 28px", background: "rgba(255,255,255,0.85)" }} radius={22}>
          <div style={{ fontFamily: F.sans, fontSize: 20, color: Dy.dim }}>Agenda livre</div>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 52, color: Dy.ink, letterSpacing: "-0.03em" }}>
            {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 20, color: Dy.warn }}>0 min</div>
        </Glass>
      </div>
      {/* e mesmo assim: publicado */}
      <div style={{ position: "absolute", left: 1330, top: 70, transform: `translateY(${(1 - pub) * -140}px)`, opacity: pub }}>
        <Glass act="day" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px 16px 16px", background: "rgba(255,255,255,0.94)" }} radius={26}>
          <VideoThumb i={5} radius={10} style={{ width: 62, height: 86 }} />
          <div>
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 24, color: Dy.ink }}>Vídeo publicado</div>
            <div style={{ fontFamily: F.sans, fontSize: 18, color: Dy.dim }}>{VIDS[5].title} · agora</div>
          </div>
          <Check size={40} />
        </Glass>
      </div>
    </SceneInH>
  );
};

// ——— c5: conhecimento ✓ · tempo limitado · trabalhar mais ✕ ———
export const C5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c5").from);
  const r1 = spring({ frame: frame - at(t9("conhecimento", 50.9)), fps, config: soft });
  const r2 = spring({ frame: frame - at(t9("tempo", 52)), fps, config: soft });
  const lim = spring({ frame: frame - at(t9("limita", 52.6)), fps, config: snap });
  const r3 = spring({ frame: frame - at(t9("tens", 54.3)), fps, config: soft });
  const strike = interpolate(frame, [at(t9("mais", 54.9)), at(t9("mais", 54.9)) + 8], [0, 1], { easing: theme.ease.out, ...clamp });
  const sand = interpolate(frame, [at(t9("tempo", 52)), at(t9("tempo", 52)) + 2.2 * fps], [1, 0.15], clamp);
  const row = (p: number, children: React.ReactNode, y: number) => (
    <div style={{ position: "absolute", left: 360, right: 360, top: y, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <Glass act="day" style={{ height: 170, display: "flex", alignItems: "center", gap: 30, padding: "0 46px", background: "rgba(255,255,255,0.86)" }} radius={30}>
        {children}
      </Glass>
    </div>
  );
  return (
    <SceneInH kind="rise">
      <Backdrop act="day" />
      {row(
        r1,
        <>
          <Check size={70} />
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 52, color: Dy.ink, letterSpacing: "-0.02em" }}>Conhecimento para partilhar</div>
        </>,
        130,
      )}
      {row(
        r2,
        <>
          <svg width={70} height={100} viewBox="0 0 70 100">
            <rect x={4} y={2} width={62} height={8} rx={3} fill="#475569" />
            <rect x={4} y={90} width={62} height={8} rx={3} fill="#475569" />
            <path d="M12 10 C12 40 33 46 33 50 C33 54 12 60 12 90 L58 90 C58 60 37 54 37 50 C37 46 58 40 58 10 Z" fill="rgba(200,220,235,0.4)" stroke="#9AA8B5" strokeWidth={2} />
            <clipPath id="hgT">
              <path d="M12 10 C12 40 33 46 33 50 L37 50 C37 46 58 40 58 10 Z" />
            </clipPath>
            <rect x={10} y={10 + (1 - sand) * 40} width={50} height={40} fill="#60A5FA" clipPath="url(#hgT)" />
            <clipPath id="hgB">
              <path d="M33 50 C33 54 12 60 12 90 L58 90 C58 60 37 54 37 50 Z" />
            </clipPath>
            <rect x={10} y={90 - (1 - sand) * 36} width={50} height={40} fill="#60A5FA" clipPath="url(#hgB)" />
          </svg>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 52, color: Dy.ink, letterSpacing: "-0.02em" }}>Tempo</div>
          <div style={{ marginLeft: "auto", padding: "10px 24px", borderRadius: 999, background: C.warnSoft, color: Dy.warn, fontFamily: F.sans, fontWeight: 700, fontSize: 32, transform: `scale(${lim})` }}>limitado</div>
        </>,
        340,
      )}
      <div style={{ position: "absolute", left: 360, right: 360, top: 570, opacity: r3 * (1 - strike * 0.35), transform: `translateY(${(1 - r3) * 40}px)` }}>
        <div style={{ position: "relative", height: 200, borderRadius: 32, border: `3px dashed ${strike > 0.5 ? Dy.warn : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 96, letterSpacing: "-0.04em", color: Dy.ink }}>
          Trabalhar mais
          <div style={{ position: "absolute", left: 120, top: 98, height: 10, width: `${strike * 76}%`, background: Dy.warn, borderRadius: 5 }} />
        </div>
      </div>
    </SceneInH>
  );
};

// ——— c6: "Significa que talvez precisas mudar o seu processo." ———
export const C6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("c6").from);
  const mud = at(t9("mudar", 56.8));
  const light = interpolate(frame, [mud, mud + 20], [0, 1], clamp);
  const old = interpolate(frame, [mud - 4, mud + 8], [0, 1], clamp);
  const flow = (k: number) => spring({ frame: frame - mud - 4 - k * 4, fps, config: snap });
  return (
    <SceneInH kind="fade">
      <FaceFull sceneFrom={S("c6").from} grade="day" act="day" light={light} />
      <SideCard x={130} y={210} w={480} at={6} tilt={-1} style={{ filter: `grayscale(${old})`, opacity: 1 - old * 0.4 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 28 }}>Processo atual</div>
          <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 999, background: C.warnSoft, color: C.warn, fontWeight: 700, fontSize: 19 }}>≈ 3 h / vídeo</div>
        </div>
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Parar", "Gravar", "Repetir", "Editar", "Legendas", "Publicar"].map((l) => (
            <div key={l} style={{ padding: "10px 16px", borderRadius: 12, background: C.graySoft, fontWeight: 600, fontSize: 21, color: Dy.ink }}>{l}</div>
          ))}
          <div style={{ position: "absolute", left: -6, top: "50%", height: 4, width: `${old * 104}%`, borderRadius: 2, background: C.warn, transform: "rotate(-6deg)" }} />
        </div>
      </SideCard>
      <SideCard x={1310} y={190} w={480} at={mud - 2} from="right" style={{ border: `2px solid ${C.good}` }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 28 }}>Novo processo</div>
          <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 999, background: C.goodSoft, color: C.good, fontWeight: 700, fontSize: 19 }}>com IA</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 22, marginBottom: 16 }}>
          {["Ideia", "IA", "Vídeos"].map((l, k) => (
            <React.Fragment key={l}>
              {k > 0 && <span style={{ color: Dy.faint, opacity: flow(k) }}>→</span>}
              <div style={{ padding: "8px 16px", borderRadius: 12, background: k === 1 ? C.blueSoft : C.graySoft, color: k === 1 ? C.blue : Dy.ink, opacity: flow(k), transform: `scale(${0.8 + flow(k) * 0.2})` }}>{l}</div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[0, 3, 5].map((i, k) => (
            <VideoThumb key={i} i={i} play={30} radius={10} style={{ flex: 1, height: 170, opacity: flow(k + 2), transform: `translateY(${(1 - flow(k + 2)) * 16}px)` }} />
          ))}
        </div>
      </SideCard>
    </SceneInH>
  );
};

// ——— c7: siga · like · curte · compartilhe — o perfil real (@sergio_salvador10) + despedida ———
const IG_RING = "linear-gradient(45deg, #FEDA75, #FA7E1E 30%, #D62976 55%, #962FBF 78%, #4F5BD5)";
const IG_BLUE = "#0095F6";
const IGI: React.FC<{ d: string; s?: number; c?: string; w?: number; fill?: string }> = ({ d, s = 24, c = "#000", w = 1.9, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
// a grelha entra por linhas (como no Instagram, o mais recente no topo): 3 publicações reais + 2 linhas novas
const GROUPS = [
  [2, 1, 0],
  [5, 4, 3],
  [8, 7, 6],
];
const Profile: React.FC<{ sc: number; tap: number; todos: number; like: number }> = ({ sc, tap, todos, like }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const SW = 393;
  const following = frame >= tap + 3;
  const press = interpolate(frame - tap, [-3, 0, 5], [0, 1, 0], clamp);
  const gAt = [-999, todos, todos + 12];
  const gIn = gAt.map((a) => (a < 0 ? 1 : spring({ frame: frame - a, fps, config: { damping: 18, stiffness: 150, mass: 0.8 } })));
  const added = GROUPS.reduce((n, g, k) => n + (k > 0 && frame >= gAt[k] ? g.length : 0), 0);
  const scroll = interpolate(frame, [todos - 4, todos + 22], [0, 150], { easing: theme.ease.inOut, ...clamp });
  const cw = (SW - 2) / 3;
  const chH = (cw * 4) / 3;
  const heart = spring({ frame: frame - like, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const heartOut = interpolate(frame, [like + 14, like + 24], [1, 0], clamp);
  const ink = "#000";
  const gray = "#737373";
  const btn = (bg: string, col: string): React.CSSProperties => ({ flex: 1, height: 34, borderRadius: 8, background: bg, color: col, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14 });
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: F.body, color: ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${-scroll}px)` }}>
        {/* cabeçalho */}
        <div style={{ position: "absolute", left: 14, top: 108, width: 90, height: 90, borderRadius: 45, padding: 3, backgroundImage: IG_RING }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", border: "3px solid #fff" }}>
            <Pic src={STILL[1]} pos="50% 26%" style={{ transform: "scale(1.35)", transformOrigin: "50% 22%" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, right: 10, top: 114, fontWeight: 700, fontSize: 14.5, fontFamily: F.sans }}>IGOR SADINA| POLÍMATA</div>
        <div style={{ position: "absolute", left: 120, right: 6, top: 140, display: "flex" }}>
          {[
            [String(3 + added), "publicações"],
            [following ? "2128" : "2127", "seguidores"],
            ["31", "a seguir"],
          ].map(([n, l], k) => (
            <div key={l} style={{ flex: 1, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, fontSize: 17, fontFamily: F.sans, color: k === 1 && following ? IG_BLUE : ink }}>{n}</div>
              <div style={{ fontSize: 13.5 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* bio real */}
        <div style={{ position: "absolute", left: 16, right: 14, top: 208, fontSize: 14, lineHeight: 1.38 }}>
          <div style={{ color: gray }}>Empreendedor</div>
          <div>| Engenharia por profissão.</div>
          <div>| Vendedor por paixão.</div>
          <div>Tecnologia na mente. Desporto no sangue</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginTop: 2 }}>
            <span style={{ fontWeight: 800 }}>@</span> sergio_salvador10
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            <IGI d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" s={14} w={2.4} />
            Igor Sérgio Sadina
          </div>
        </div>
        {/* botões */}
        <div style={{ position: "absolute", left: 14, right: 14, top: 362, display: "flex", gap: 6, fontFamily: F.sans }}>
          <div style={{ ...btn(following ? "#EFEFEF" : IG_BLUE, following ? ink : "#fff"), transform: `scale(${1 - press * 0.06})` }}>{following ? "A seguir ˅" : "Seguir"}</div>
          <div style={btn("#EFEFEF", ink)}>Mensagem</div>
          <div style={btn("#EFEFEF", ink)}>Contactar</div>
          <div style={{ ...btn("#EFEFEF", ink), flex: "none", width: 34 }}>
            <IGI d="M15 19c0-3-2.5-5-6-5s-6 2-6 5M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7zM19 8v6M16 11h6" s={17} w={2} />
          </div>
        </div>
        {/* separadores */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 412, height: 44, display: "flex", borderBottom: "0.5px solid #DBDBDB" }}>
          {["M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18", "M3 3h18v18H3zM3 8h18M8 3l3 5M14 3l3 5M10 12v6l5-3z", "M4 4h16v13h-5l-3 3-3-3H4zM12 7.5a2 2 0 1 0 0 4a2 2 0 1 0 0-4M8 15c.8-1.6 2.2-2.4 4-2.4s3.2.8 4 2.4"].map((d, k) => (
            <div key={k} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: k === 0 ? `1.5px solid ${ink}` : "none" }}>
              <IGI d={d} s={23} c={k === 0 ? ink : gray} w={1.8} />
            </div>
          ))}
        </div>
        {/* grelha: os vídeos reais; os novos entram no topo, todos os dias */}
        <div style={{ position: "absolute", left: 0, top: 458, width: SW, height: 900 }}>
          {GROUPS.map((g, gi) =>
            g.map((p, col) => {
              if (frame < gAt[gi]) return null;
              const row = gIn.slice(gi + 1).reduce((r, v, k) => r + (frame >= gAt[gi + 1 + k] ? v : 0), 0);
              const enter = gi === 0 ? 1 : spring({ frame: frame - gAt[gi] - col * 2, fps, config: snap });
              return (
                <div key={p} style={{ position: "absolute", left: col * (cw + 1), top: row * (chH + 1), width: cw, height: chH, opacity: enter, transform: `scale(${0.75 + enter * 0.25})` }}>
                  <VideoThumb i={p} radius={0} style={{ position: "absolute", inset: 0 }} />
                  <div style={{ position: "absolute", right: 6, top: 6 }}>
                    <IGI d="M3 3h18v18H3zM3 8h18M8 3l3 5M14 3l3 5M10 12v6l5-3z" s={16} c="#fff" w={2} />
                  </div>
                  <div style={{ position: "absolute", left: 6, bottom: 5, display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                    <IGI d="M8 5v14l11-7z" s={12} c="#fff" fill="#fff" w={1} />
                    {[312, 287, 455, 198, 530, 264, 401, 377, 620][p]}
                  </div>
                  {p === 8 && frame >= like && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: heartOut }}>
                      <div style={{ transform: `scale(${heart})` }}>
                        <IGI d="M12 21s-7.5-4.6-10-9.3C.3 8.3 2 4 6 4c2.3 0 3.6 1.3 4.5 2.6.4.6 1.6.6 2 0C13.4 5.3 14.7 4 17 4c4 0 5.7 4.3 4 7.7C19.5 16.4 12 21 12 21z" s={64} c="#fff" fill="#fff" w={1} />
                      </div>
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
      {/* topo fixo: barra de estado + navegação por cima do conteúdo que desliza */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 100, background: "#fff", borderBottom: scroll > 40 ? "0.5px solid #DBDBDB" : "none" }} />
      {/* barra de navegação */}
      <div style={{ position: "absolute", left: 8, right: 12, top: 56, height: 40, display: "flex", alignItems: "center", gap: 10, background: "#fff" }}>
        <IGI d="M15 5l-7 7 7 7" s={28} w={2.2} />
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 17, fontFamily: F.sans, letterSpacing: "-0.01em" }}>sergio_salvador10</div>
        <IGI d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" s={24} />
        <div style={{ width: 4 }} />
        <IGI d="M5 12h.01M12 12h.01M19 12h.01" s={24} w={3.2} />
      </div>
      <div style={{ position: "absolute", left: 30, top: 17, fontSize: 15, fontWeight: 700, fontFamily: F.sans }}>9:41</div>
      <div style={{ position: "absolute", right: 24, top: 19, display: "flex", gap: 4, alignItems: "flex-end" }}>
        {[5, 8, 11, 14].map((h) => (
          <div key={h} style={{ width: 3.5, height: h, borderRadius: 1, background: ink }} />
        ))}
        <div style={{ marginLeft: 6, width: 25, height: 12, borderRadius: 4, border: "1.5px solid rgba(0,0,0,0.45)", padding: 1.5 }}>
          <div style={{ width: "78%", height: "100%", borderRadius: 2, background: ink }} />
        </div>
      </div>
      {/* barra inferior do Instagram */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "#fff", borderTop: "0.5px solid #DBDBDB", display: "flex", alignItems: "flex-start", justifyContent: "space-around", paddingTop: 12 }}>
        {["M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z", "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14M21 21l-4.6-4.6", "M3 3h18v18H3zM12 8v8M8 12h8", "M3 3h18v18H3zM3 8h18M8 3l3 5M14 3l3 5M10 12v6l5-3z"].map((d, k) => (
          <IGI key={k} d={d} s={26} w={1.9} />
        ))}
        <div style={{ position: "relative", width: 28, height: 28, borderRadius: 14, overflow: "hidden", border: "1.5px solid #000" }}>
          <Pic src={STILL[1]} pos="50% 26%" />
        </div>
      </div>
      <Cursor
        kind="touch"
        size={0.8}
        keys={[
          { f: tap - 16, x: 210, y: 600 },
          { f: tap, x: 66, y: 379, click: true },
          { f: like - 12, x: 150, y: 560 },
          { f: like, x: 66, y: 458 + chH / 2 - 150, click: true },
        ]}
        hideAt={like + 12}
      />
    </AbsoluteFill>
  );
};
export const C7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("c7");
  const at = useAt(sc.from);
  const ph = spring({ frame: frame - 2, fps, config: soft });
  const tap = at(t9("perfil", 58.9)) + 2;
  const todos = at(t9("todos", 60.3));
  const likeF = at(t9("like", 61.5));
  const like = spring({ frame: frame - likeF, fps, config: snap });
  const curte = spring({ frame: frame - at(t9("curte", 61.8)), fps, config: snap });
  const share = spring({ frame: frame - at(t9("compartilhe", 62.2)), fps, config: snap });
  const follow = spring({ frame: frame - tap - 3, fps, config: snap });
  const endAt = at(VOICE_END);
  const leave = interpolate(frame, [endAt, endAt + 9], [0, 1], { easing: theme.ease.in, ...clamp });
  const end = interpolate(frame, [endAt + 6, endAt + 18], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const endIn = spring({ frame: frame - endAt - 8, fps, config: soft });
  const bubble = (p: number, x: number, y: number, bg: string, child: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: y, width: 130, height: 130, borderRadius: 65, background: bg, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p}) translateY(${(1 - p) * 30}px)`, boxShadow: "0 24px 40px -18px rgba(15,23,42,0.4)", border: `1px solid ${C.line}` }}>{child}</div>
  );
  return (
    <SceneInH kind="slide">
      <Backdrop act="day" />
      <div style={{ opacity: 1 - leave, transform: `scale(${1 - leave * 0.03})`, filter: `blur(${leave * 6}px)` }}>
        <div style={{ position: "absolute", left: 420, top: 50, transform: `translateY(${(1 - ph) * 120}px)`, opacity: ph }}>
          <Phone w={420} finish="light" screen="#FFFFFF">
            <Profile sc={sc.from} tap={tap} todos={todos} like={likeF} />
          </Phone>
        </div>
        {/* +1 seguidor */}
        <div style={{ position: "absolute", left: 880, top: 250, opacity: follow * interpolate(frame, [tap + 40, tap + 52], [1, 0], clamp), transform: `translateY(${(1 - follow) * 20 - follow * 10}px) scale(${0.7 + follow * 0.3})` }}>
          <div style={{ padding: "10px 18px", borderRadius: 999, background: C.good, color: "#fff", fontFamily: F.sans, fontWeight: 700, fontSize: 26, boxShadow: "0 16px 30px -14px rgba(22,163,74,0.7)" }}>+1 seguidor</div>
        </div>
        {bubble(like, 170, 220, "#fff", <HeartIcon size={66} color="#E5484D" />)}
        {bubble(
          curte,
          150,
          420,
          C.ink,
          <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
            <path d="M7 10v11H3V10zM7 10l4-7c1.6 0 2.6 1.2 2.3 2.7L12.6 9H19c1.2 0 2.1 1.1 1.9 2.3l-1.4 7.5c-.2 1.3-1.3 2.2-2.6 2.2H7" fill="rgba(255,255,255,0.25)" />
          </svg>,
        )}
        {bubble(
          share,
          190,
          620,
          C.good,
          <svg width={58} height={58} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" fill="rgba(255,255,255,0.25)" />
          </svg>,
        )}
        <FaceCard sceneFrom={sc.from} grade="day" act="day" />
      </div>
      {/* despedida: o rosto vira avatar, o @ real */}
      {end > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22, opacity: end }}>
          <div style={{ width: 240, height: 240, borderRadius: 120, padding: 6, backgroundImage: IG_RING, transform: `scale(${0.8 + endIn * 0.2})`, boxShadow: "0 40px 80px -30px rgba(15,23,42,0.45)" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 114, overflow: "hidden", border: "5px solid #fff" }}>
              <FaceVideo sceneFrom={sc.from} grade="day" posY={30} zoom={1.5} punch={false} />
            </div>
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 104, color: Dy.ink, lineHeight: 1, opacity: endIn, transform: `translateY(${(1 - endIn) * 20}px)` }}>Siga o perfil</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 28px", borderRadius: 999, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 18px 36px -20px rgba(15,23,42,0.4)", opacity: endIn, transform: `translateY(${(1 - endIn) * 26}px)` }}>
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round">
              <defs>
                <linearGradient id="igg" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#FEDA75" />
                  <stop offset="0.35" stopColor="#FA7E1E" />
                  <stop offset="0.6" stopColor="#D62976" />
                  <stop offset="1" stopColor="#4F5BD5" />
                </linearGradient>
              </defs>
              <rect x={3} y={3} width={18} height={18} rx={5} stroke="url(#igg)" />
              <circle cx={12} cy={12} r={4} stroke="url(#igg)" />
              <circle cx={17.3} cy={6.7} r={0.6} fill="#D62976" stroke="none" />
            </svg>
            <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: Dy.ink, letterSpacing: "-0.01em" }}>@sergio_salvador10</span>
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 28, letterSpacing: "0.02em", color: Dy.dim, opacity: endIn }}>Igor Sadina · conteúdo novo todos os dias</div>
        </AbsoluteFill>
      )}
    </SceneInH>
  );
};
