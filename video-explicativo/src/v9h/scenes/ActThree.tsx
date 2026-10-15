import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { A, Backdrop, C, F, FaceCard, FaceFull, FaceVideo, Glass, Phone, SceneInH, THUMBS } from "../Premium";
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
export const C1: React.FC = () => (
  <SceneInH kind="light">
    <FaceFull sceneFrom={S("c1").from} grade="day" act="day" />
  </SceneInH>
);

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
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #E2E8F0, #F8FAFC)" }} />
          <svg width={360} height={520} viewBox="0 0 100 144" style={{ position: "absolute", inset: 0 }}>
            <circle cx={50} cy={52} r={18} fill="#94A3B8" />
            <path d="M18 130c3-28 17-42 32-42s29 14 32 42z" fill="#94A3B8" />
          </svg>
          <div style={{ position: "absolute", left: 22, top: 20, padding: "6px 14px", borderRadius: 999, background: "rgba(0,0,0,0.06)", fontFamily: F.sans, fontWeight: 600, fontSize: 20, color: Dy.dim }}>avatar gerado</div>
        </Glass>
        {frame >= rej && (
          <div style={{ position: "absolute", right: -26, top: -26, width: 76, height: 76, borderRadius: 38, background: Dy.warn, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spring({ frame: frame - rej, fps, config: snap })})` }}>
            <svg width={40} height={40} viewBox="0 0 24 24" stroke="#fff" strokeWidth={3.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </div>
        )}
      </div>
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
      <div style={{ position: "absolute", left: 1470, top: 70, transform: `translateY(${(1 - pub) * -140}px)`, opacity: pub }}>
        <Glass act="day" style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", background: "rgba(255,255,255,0.92)" }} radius={26}>
          <Check size={46} />
          <div>
            <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 24, color: Dy.ink }}>Vídeo publicado</div>
            <div style={{ fontFamily: F.sans, fontSize: 18, color: Dy.dim }}>agora mesmo</div>
          </div>
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
  const at = useAt(S("c6").from);
  const light = interpolate(frame, [at(t9("mudar", 56.8)), at(t9("mudar", 56.8)) + 20], [0, 1], clamp);
  return (
    <SceneInH kind="fade">
      <FaceFull sceneFrom={S("c6").from} grade="day" act="day" light={light} />
    </SceneInH>
  );
};

// ——— c7: siga · like · curte · compartilhe + despedida ———
export const C7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("c7");
  const at = useAt(sc.from);
  const ph = spring({ frame: frame - 2, fps, config: soft });
  const tap = at(t9("perfil", 58.9)) + 2;
  const press = interpolate(frame, [tap, tap + 3, tap + 9], [0, 1, 0], clamp);
  const following = frame >= tap + 4;
  const grid = (k: number) => spring({ frame: frame - at(t9("todos", 60.3)) - k * 2, fps, config: snap });
  const like = spring({ frame: frame - at(t9("like", 61.5)), fps, config: snap });
  const curte = spring({ frame: frame - at(t9("curte", 61.8)), fps, config: snap });
  const share = spring({ frame: frame - at(t9("compartilhe", 62.2)), fps, config: snap });
  const endAt = at(VOICE_END);
  const end = interpolate(frame, [endAt, endAt + 14], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const endIn = spring({ frame: frame - endAt - 4, fps, config: soft });
  const GR = THUMBS;
  const bubble = (p: number, x: number, y: number, bg: string, child: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: y, width: 130, height: 130, borderRadius: 65, background: bg, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p}) translateY(${(1 - p) * 30}px)`, boxShadow: "0 24px 40px -18px rgba(15,23,42,0.4)", border: `1px solid ${C.line}` }}>{child}</div>
  );
  return (
    <SceneInH kind="slide">
      <Backdrop act="day" />
      <div style={{ opacity: 1 - end }}>
        <div style={{ position: "absolute", left: 420, top: 60, transform: `translateY(${(1 - ph) * 120}px)`, opacity: ph }}>
          <Phone w={420} finish="light" screen="#FFFFFF">
            <div style={{ position: "absolute", left: 24, right: 24, top: 90, fontFamily: F.sans }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 96, height: 96, borderRadius: 48, padding: 4, background: "linear-gradient(135deg, #2563EB, #06B6D4, #16A34A)" }}>
                  <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 44, overflow: "hidden", border: "3px solid #fff" }}>
                    <FaceVideo sceneFrom={sc.from} grade="day" posY={30} zoom={1.5} punch={false} />
                  </div>
                </div>

              </div>
              <div style={{ marginTop: 16, fontWeight: 700, fontSize: 22, color: Dy.ink }}>o meu perfil</div>
              <div style={{ fontSize: 17, color: Dy.dim }}>conteúdo todos os dias</div>
              <div style={{ marginTop: 16, height: 54, borderRadius: 14, background: following ? C.graySoft : C.blue, color: following ? Dy.ink : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, transform: `scale(${1 - press * 0.05})` }}>
                {following ? "A seguir ✓" : "Seguir"}
              </div>
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                {GR.map((g, k) => (
                  <div key={k} style={{ aspectRatio: "3 / 4", background: `linear-gradient(165deg, ${g})`, opacity: grid(k), transform: `scale(${0.8 + grid(k) * 0.2})` }} />
                ))}
              </div>
            </div>
          </Phone>
        </div>
        {bubble(like, 170, 220, "#fff", <HeartIcon size={66} />)}
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
      {/* despedida: o rosto vira avatar, mensagem limpa */}
      {end > 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28, opacity: end }}>
          <div style={{ width: 240, height: 240, borderRadius: 120, padding: 6, background: "linear-gradient(135deg, #2563EB, #06B6D4, #16A34A)", transform: `scale(${0.8 + endIn * 0.2})`, boxShadow: "0 40px 80px -30px rgba(15,23,42,0.45)" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 114, overflow: "hidden", border: "5px solid #fff" }}>
              <FaceVideo sceneFrom={sc.from} grade="day" posY={30} zoom={1.5} punch={false} />
            </div>
          </div>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 110, color: Dy.ink, opacity: endIn, transform: `translateY(${(1 - endIn) * 20}px)` }}>Siga o perfil</div>
          <div style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 30, letterSpacing: "0.02em", color: Dy.dim, opacity: endIn }}>conteúdo novo todos os dias</div>
        </AbsoluteFill>
      )}
    </SceneInH>
  );
};
