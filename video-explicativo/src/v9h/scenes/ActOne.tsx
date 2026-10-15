import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { A, Backdrop, Cursor, F, FaceCard, FaceFull, FaceVideo, Glass, Phone, Pic, SceneInH, SideCard, STILL, VIDS, VideoThumb } from "../Premium";
import { SCENESH, t9, WORDS } from "../timelineH";

const S = (id: string) => SCENESH.find((s) => s.id === id)!;
const N = A.night;
const soft = { damping: 18, stiffness: 110, mass: 0.9 };
const snap = { damping: 14, stiffness: 180, mass: 0.6 };

// ——— a1: gancho — rosto à noite; à volta, as ideias reais guardadas e o verdadeiro problema ———
export const A1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("a1").from);
  const pb = at(t9("problemas", 0.4));
  const id = at(t9("ideias", 1.8));
  const row = (k: number) => spring({ frame: frame - 10 - k * 4, fps, config: snap });
  const fan = spring({ frame: frame - id - 4, fps, config: { damping: 15, stiffness: 130, mass: 0.7 } });
  return (
    <SceneInH kind="none">
      <FaceFull sceneFrom={S("a1").from} grade="night" act="night" />
      <SideCard x={140} y={200} w={450} at={4} tilt={-1.5}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: N.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={N.accent} strokeWidth={2.2} strokeLinecap="round">
              <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
            </svg>
          </div>
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "-0.01em" }}>Ideias para vídeos</div>
          <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 24, color: N.accent }}>47</div>
        </div>
        {[0, 3, 5, 6].map((i, k) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderTop: k ? `1px solid ${N.line}` : "none", opacity: row(k), transform: `translateX(${(1 - row(k)) * -16}px)` }}>
            <VideoThumb i={i} radius={8} style={{ width: 46, height: 64, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 22 }}>{VIDS[i].title}</div>
              <div style={{ fontSize: 16, color: N.dim }}>rascunho · por gravar</div>
            </div>
          </div>
        ))}
      </SideCard>
      <SideCard x={1330} y={190} w={450} at={pb} from="right" tilt={1.5}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: N.warnSoft, color: N.warn, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 25 }}>O meu maior problema</div>
            <div style={{ fontSize: 18, color: N.dim }}>não era a falta de ideias…</div>
          </div>
        </div>
      </SideCard>
      <SideCard x={1380} y={360} w={400} at={id} from="right" pad="22px 22px 20px">
        <div style={{ position: "relative", height: 250 }}>
          {[3, 5, 7].map((i, k) => (
            <VideoThumb
              key={i}
              i={i}
              radius={14}
              play={k === 1 ? 46 : 0}
              style={{ position: "absolute", left: 128 + (k - 1) * 104 * fan, top: 10 + Math.abs(k - 1) * 16 * fan, width: 128, height: 220, transform: `rotate(${(k - 1) * 8 * fan}deg)`, boxShadow: "0 18px 30px -16px rgba(15,23,42,0.5)", zIndex: k === 1 ? 2 : 1, border: "3px solid #fff" }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <div style={{ padding: "8px 18px", borderRadius: 999, background: N.goodSoft, color: N.good, fontWeight: 700, fontSize: 21 }}>✓ ideias não faltam</div>
        </div>
      </SideCard>
    </SceneInH>
  );
};

// ——— a2: um caderno cheio de ideias vs. 0 publicados ———
const IDEAS = ["série sobre IA no dia a dia", "bastidores do meu trabalho", "3 erros de quem começa", "como organizo o meu dia", "o que aprendi este ano", "tutorial rápido", "responder perguntas"];
const Widget: React.FC<{ at: number; children: React.ReactNode; h: number }> = ({ at, children, h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: snap });
  return (
    <div style={{ height: h, borderRadius: 26, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", padding: "18px 22px", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${0.85 + p * 0.15})`, color: "#fff", fontFamily: F.sans }}>
      {children}
    </div>
  );
};
export const A2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("a2").from);
  const book = spring({ frame: frame - 2, fps, config: soft });
  const phone = spring({ frame: frame - 6, fps, config: soft });
  const tT = at(t9("tempo", 2.4));
  const ring = interpolate(frame, [tT, tT + 0.9 * fps], [0.62, 0.06], { easing: theme.ease.inOut, ...clamp });
  const draftsAt = at(t9("essas", 3.9));
  const drafts = Math.round(interpolate(frame, [draftsAt, draftsAt + 0.6 * fps], [0, 47], clamp));
  const zeroAt = at(t9("conteúdo", 4.5));
  const R = 46;
  const C = 2 * Math.PI * R;
  return (
    <SceneInH kind="fade">
      <Backdrop act="night" />
      {/* luz quente do candeeiro sobre a secretária */}
      <div style={{ position: "absolute", left: 60, top: 40, width: 1100, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.07), rgba(37,99,235,0) 65%)" }} />
      {/* caderno */}
      <div style={{ position: "absolute", left: 200, top: 120, width: 640, height: 790, transform: `rotate(${-4 + (1 - book) * -6}deg) translateY(${(1 - book) * 80}px)`, opacity: book }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: "repeating-linear-gradient(180deg, transparent 0 60px, rgba(90,120,160,0.18) 60px 62px), linear-gradient(170deg, #FFFBF2, #EFE5D1)", boxShadow: "0 50px 90px -40px rgba(15,23,42,0.45)" }} />
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 50 + i * 54, top: -18, width: 12, height: 42, borderRadius: 6, background: "linear-gradient(90deg, #7D838C, #E4E7EB, #8A9099)", boxShadow: "0 4px 6px rgba(0,0,0,0.35)" }} />
        ))}
        <div style={{ position: "absolute", left: 60, top: 54, fontFamily: F.hand, fontSize: 70, color: "#2B2622" }}>Ideias</div>
        {IDEAS.map((idea, i) => {
          const p = spring({ frame: frame - 6 - i * 3, fps, config: snap }); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{ position: "absolute", left: 60, top: 160 + i * 84, display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * -20}px)` }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, border: "3px solid #4A433C" }} />
              <span style={{ fontFamily: F.hand, fontSize: 50, color: "#2B2622" }}>{idea}</span>
            </div>
          );
        })}
        {/* caneta */}
        <div style={{ position: "absolute", left: 470, top: 600, width: 300, height: 22, borderRadius: 11, background: "linear-gradient(180deg, #3A3D44, #111216 60%, #2A2C31)", transform: "rotate(-38deg)", boxShadow: "0 18px 24px -8px rgba(0,0,0,0.6)" }}>
          <div style={{ position: "absolute", right: -26, top: 4, width: 0, height: 0, borderLeft: "28px solid #C9CCD2", borderTop: "7px solid transparent", borderBottom: "7px solid transparent" }} />
        </div>
      </div>
      {/* telemóvel: tempo livre, rascunhos, publicados */}
      <div style={{ position: "absolute", left: 1180, top: 60, perspective: 1600, opacity: phone }}>
        <div style={{ transform: `rotateY(-16deg) rotateZ(3deg) translateX(${(1 - phone) * 160}px)` }}>
          <Phone w={400} screen="linear-gradient(180deg, #1B2340, #0A0E1A)">
            <div style={{ position: "absolute", left: 22, right: 22, top: 90, display: "flex", flexDirection: "column", gap: 18 }}>
              <Widget at={tT - 2} h={190}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <svg width={120} height={120} viewBox="0 0 120 120">
                    <circle cx={60} cy={60} r={R} stroke="rgba(255,255,255,0.15)" strokeWidth={12} fill="none" />
                    <circle cx={60} cy={60} r={R} stroke={ring < 0.2 ? N.warn : N.accent} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={`${C * ring} ${C}`} transform="rotate(-90 60 60)" />
                  </svg>
                  <div>
                    <div style={{ fontSize: 20, opacity: 0.7 }}>Tempo livre hoje</div>
                    <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em" }}>{ring < 0.2 ? "0 h 15" : "3 h 20"}</div>
                  </div>
                </div>
              </Widget>
              <Widget at={draftsAt - 2} h={220}>
                <div style={{ fontSize: 20, opacity: 0.7 }}>Rascunhos</div>
                <div style={{ fontSize: 56, fontWeight: 700 }}>{drafts} ideias</div>
                <div style={{ fontSize: 20, opacity: 0.6, marginTop: 6 }}>por gravar</div>
              </Widget>
              <Widget at={zeroAt - 2} h={150}>
                <div style={{ fontSize: 20, opacity: 0.7 }}>Publicados esta semana</div>
                <div style={{ fontSize: 64, fontWeight: 800, color: N.warn }}>0</div>
              </Widget>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 22, color: "#fff" }}>23:12</div>
          </Phone>
        </div>
      </div>
    </SceneInH>
  );
};

// ——— a3: o processo antigo — telemóvel no tripé (take 7), edição no telemóvel (como no CapCut)
// e a lista do que cada vídeo custa ———
const STEPS = [
  { w: "parar", l: "Parar", i: "M8 5v14M16 5v14", c: "5 min" },
  { w: "gravar", l: "Gravar", i: "M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14", c: "40 min" },
  { w: "repetir", l: "Repetir partes", i: "M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5", c: "× 7 takes" },
  { w: "editar", l: "Editar", i: "M6 4a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M6 15a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M8.5 7.5L20 18M8.5 16.5L20 6", c: "1 h 30" },
  { w: "legendas", l: "Legendas", i: "M3 6h18v12H3zM7 12h4M13 12h4M7 15h7", c: "40 min" },
  { w: "publicar", l: "Publicar", i: "M12 16V4M7 9l5-5 5 5M4 20h16", c: "15 min" },
];
const TOOLS = [
  { l: "Editar", i: "M6 4a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M6 15a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M8.5 7.5L20 18M8.5 16.5L20 6" },
  { l: "Áudio", i: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0a3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" },
  { l: "Texto", i: "M4 7V4h16v3M12 4v16M9 20h6" },
  { l: "Autocolantes", i: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M8.5 14s1.3 2 3.5 2 3.5-2 3.5-2M9 9.5v.5M15 9.5v.5" },
  { l: "PiP", i: "M3 5h18v14H3zM12 11h7v6h-7z" },
  { l: "Efeitos", i: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" },
];
const Ico: React.FC<{ d: string; s: number; c: string; w?: number }> = ({ d, s, c, w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const SW = 402;
const PX = 2.2; // px de linha do tempo por fotograma
const CAPS = ["Tenho que", "parar,", "gravar,", "repetir", "editar,", "colocar", "legendas"];
const EditorScreen: React.FC<{ sceneFrom: number; st: number[]; colocar: number }> = ({ sceneFrom, st, colocar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gt = sceneFrom + frame / fps;
  const word = WORDS.find((w) => gt >= w.start - 0.05 && gt < w.end + 0.12);
  const wordPop = word ? spring({ frame: frame - Math.round((word.start - sceneFrom) * fps), fps, config: { damping: 12, stiffness: 260, mass: 0.5 } }) : 0;
  const capsOn = frame >= st[4] - 2;
  const tl = frame * PX;
  const PH = SW / 2;
  const sx = (cx: number) => PH + cx - tl;
  const CW = 98;
  const appear = [-99, -99, st[1], st[1] + 5, st[2], st[2] + 4, st[2] + 8, st[2] + 12];
  const shown = appear.filter((a) => frame >= a).length;
  const splitX = st[3] * PX;
  const sel = frame >= st[3] && frame < colocar + 10;
  const selClip = Math.floor(splitX / CW);
  const exp0 = st[5] + 4;
  const pct = Math.round(interpolate(frame, [exp0, exp0 + 26], [0, 100], { easing: theme.ease.inOut, ...clamp }));
  const modal = spring({ frame: frame - exp0, fps, config: snap });
  const active = frame >= colocar ? 2 : frame >= st[3] ? 0 : -1;
  const exportPress = interpolate(frame - st[5], [-3, 0, 5], [0, 1, 0], clamp);
  const secs = Math.floor(3 + frame / fps);
  return (
    <AbsoluteFill style={{ background: "#0B0B0D", fontFamily: F.sans, color: "#fff" }}>
      {/* barra de estado */}
      <div style={{ position: "absolute", left: 30, top: 17, fontSize: 16, fontWeight: 700 }}>23:41</div>
      <div style={{ position: "absolute", right: 26, top: 19, display: "flex", gap: 6, alignItems: "flex-end" }}>
        {[5, 8, 11, 14].map((h) => (
          <div key={h} style={{ width: 3.5, height: h, borderRadius: 1, background: "#fff" }} />
        ))}
        <div style={{ marginLeft: 6, width: 26, height: 13, borderRadius: 4, border: "1.5px solid rgba(255,255,255,0.6)", padding: 1.5 }}>
          <div style={{ width: "22%", height: "100%", borderRadius: 2, background: "#FF453A" }} />
        </div>
      </div>
      {/* barra superior */}
      <div style={{ position: "absolute", left: 16, right: 14, top: 58, height: 36, display: "flex", alignItems: "center" }}>
        <Ico d="M6 6l12 12M18 6L6 18" s={24} c="#fff" />
        <div style={{ margin: "0 auto", fontSize: 15, fontWeight: 600, opacity: 0.9 }}>1080P ▾</div>
        <div style={{ padding: "7px 16px", borderRadius: 9, background: "#2563EB", fontSize: 15, fontWeight: 700, transform: `scale(${1 - exportPress * 0.1})` }}>Exportar</div>
      </div>
      {/* pré-visualização 9:16 com o vídeo real */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, height: 372, background: "#000" }}>
        <div style={{ position: "absolute", left: (SW - 209) / 2, top: 0, width: 209, height: 372, overflow: "hidden" }}>
          <FaceVideo sceneFrom={sceneFrom} grade="night" posY={34} />
          {capsOn && word && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", justifyContent: "center" }}>
              <div style={{ padding: "3px 10px", borderRadius: 7, background: "#2563EB", fontWeight: 900, fontSize: 21, letterSpacing: "0.01em", textTransform: "uppercase", transform: `scale(${0.7 + wordPop * 0.3})` }}>{word.text.replace(/[.,!?]/g, "")}</div>
            </div>
          )}
        </div>
      </div>
      {/* controlos */}
      <div style={{ position: "absolute", left: 16, right: 16, top: 486, height: 26, display: "flex", alignItems: "center", fontFamily: F.mono, fontSize: 13 }}>
        <span style={{ opacity: 0.85 }}>00:{String(secs).padStart(2, "0")}</span>
        <span style={{ opacity: 0.45 }}>&nbsp;/ 00:42</span>
        <div style={{ margin: "0 auto", width: 0, height: 0, borderLeft: "14px solid #fff", borderTop: "9px solid transparent", borderBottom: "9px solid transparent", transform: "translateX(-30px)" }} />
        <Ico d="M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-2" s={20} c="rgba(255,255,255,0.8)" />
        <div style={{ width: 14 }} />
        <Ico d="M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h2" s={20} c="rgba(255,255,255,0.35)" />
      </div>
      {/* régua */}
      {Array.from({ length: 8 }).map((_, k) => {
        const x = sx(k * 66);
        return x > -40 && x < SW + 10 ? (
          <div key={k} style={{ position: "absolute", left: x - 16, top: 526, fontFamily: F.mono, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            00:{String(k * 1).padStart(2, "0")}
          </div>
        ) : null;
      })}
      {/* pista de vídeo: takes reais */}
      {appear.map((a, i) => {
        const p = spring({ frame: frame - a, fps, config: snap });
        if (p <= 0.01) return null;
        const x = sx(i * CW);
        if (x > SW + 10 || x + CW < -10) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 550, width: (CW - 3) * p, height: 56, borderRadius: 6, overflow: "hidden", display: "flex", border: sel && i === selClip ? "2.5px solid #fff" : "none", boxSizing: "border-box" }}>
            {[0, 1].map((j) => (
              <div key={j} style={{ position: "relative", width: 48, height: "100%", flexShrink: 0 }}>
                <Pic src={STILL[(i + j) % 4]} pos="50% 30%" />
              </div>
            ))}
          </div>
        );
      })}
      {/* corte (dividir) */}
      {frame >= st[3] && (
        <div style={{ position: "absolute", left: sx(splitX) - 2, top: 546, width: 4, height: 64, background: "#0B0B0D", transform: `scaleY(${spring({ frame: frame - st[3], fps, config: snap })})` }} />
      )}
      {/* "+" para adicionar */}
      <div style={{ position: "absolute", left: sx(shown * CW) + 6, top: 560, width: 36, height: 36, borderRadius: 8, background: "#fff", color: "#0B0B0D", fontSize: 28, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</div>
      {/* áudio (forma de onda da voz) */}
      {Array.from({ length: 160 }).map((_, k) => {
        const cx = 2 + k * 5;
        if (cx > shown * CW - 4) return null;
        const x = sx(cx);
        if (x < -4 || x > SW + 4) return null;
        const h = 4 + random(`wv${k}`) * 18 * (0.5 + 0.5 * Math.abs(Math.sin(k * 0.37)));
        return <div key={k} style={{ position: "absolute", left: x, top: 627 - h / 2, width: 3, height: h, borderRadius: 2, background: "#E9B949", opacity: 0.9 }} />;
      })}
      {/* linhas "toque para adicionar" (como no editor real) → legendas geradas */}
      {[
        { y: 650, t: "Toque para adicionar legenda", i: "M4 7V4h16v3M12 4v16M9 20h6" },
        { y: 688, t: "Toque para adicionar música", i: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0a3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0a3 3 0 0 1 6 0z" },
        { y: 726, t: "Toque para adicionar autocolante", i: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M8.5 14s1.3 2 3.5 2 3.5-2 3.5-2" },
      ].map((r, k) => (
        <div key={r.t} style={{ position: "absolute", left: 18, right: 18, top: r.y, height: 30, borderRadius: 7, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", fontSize: 13, color: "rgba(255,255,255,0.55)", opacity: k === 0 ? 1 - interpolate(frame, [st[4] - 4, st[4] + 2], [0, 1], clamp) : 1 }}>
          <Ico d={r.i} s={15} c="rgba(255,255,255,0.55)" />
          {r.t}
        </div>
      ))}
      {CAPS.map((c, k) => {
        const p = spring({ frame: frame - st[4] - k * 2, fps, config: snap });
        if (p <= 0.01) return null;
        const x = sx(8 + k * 74);
        return (
          <div key={c} style={{ position: "absolute", left: x, top: 650, width: 70 * p, height: 30, borderRadius: 6, background: "#2563EB", overflow: "hidden", whiteSpace: "nowrap", fontSize: 12, fontWeight: 700, padding: "7px 6px", boxSizing: "border-box" }}>
            T {c}
          </div>
        );
      })}
      {/* cursor de reprodução */}
      <div style={{ position: "absolute", left: PH - 1, top: 522, width: 2, height: 240, background: "#fff", boxShadow: "0 0 6px rgba(0,0,0,0.6)" }} />
      {/* ferramentas */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 772, height: 70, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex" }}>
        {TOOLS.map((tool, k) => (
          <div key={tool.l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, paddingTop: 10, color: k === active ? "#60A5FA" : "rgba(255,255,255,0.85)" }}>
            <Ico d={tool.i} s={24} c={k === active ? "#60A5FA" : "rgba(255,255,255,0.85)"} />
            <div style={{ fontSize: 11, fontWeight: 600 }}>{tool.l}</div>
          </div>
        ))}
      </div>
      {/* exportar */}
      {modal > 0.01 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${0.55 * modal})`, alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 250, padding: "26px 0 22px", borderRadius: 20, background: "#1C1C1F", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `scale(${0.85 + modal * 0.15})`, opacity: modal }}>
            <svg width={86} height={86} viewBox="0 0 86 86">
              <circle cx={43} cy={43} r={36} stroke="rgba(255,255,255,0.12)" strokeWidth={7} fill="none" />
              <circle cx={43} cy={43} r={36} stroke={pct >= 100 ? "#16A34A" : "#2563EB"} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 226} 226`} transform="rotate(-90 43 43)" />
              <text x={43} y={49} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={700} fontFamily="inherit">
                {pct >= 100 ? "✓" : `${pct}%`}
              </text>
            </svg>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{pct >= 100 ? "Pronto a publicar" : "A exportar…"}</div>
            <div style={{ fontSize: 12, opacity: 0.5 }}>1080p · 30 fps</div>
          </div>
        </AbsoluteFill>
      )}
      <Cursor
        kind="touch"
        size={0.85}
        keys={[
          { f: st[3] - 18, x: 250, y: 700 },
          { f: st[3], x: 34, y: 796, click: true },
          { f: colocar, x: 168, y: 796, click: true },
          { f: st[5], x: 352, y: 76, click: true },
        ]}
        hideAt={st[5] + 12}
      />
    </AbsoluteFill>
  );
};
export const A3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("a3");
  const at = useAt(sc.from);
  const st = STEPS.map((s) => at(t9(s.w, 5.5)));
  const colocar = at(t9("colocar", 8));
  const tri = spring({ frame: frame - 2, fps, config: soft });
  const ed = spring({ frame: frame - 5, fps, config: soft });
  const card = spring({ frame: frame - 9, fps, config: soft });
  const take = Math.min(7, Math.max(1, 1 + Math.floor((frame - st[2]) / 3)));
  const secs = 2 * 3600 + 47 * 60 + Math.floor(frame * 21);
  const hh = Math.floor(secs / 3600);
  const mm = Math.floor((secs % 3600) / 60);
  const ss = secs % 60;
  const done = (k: number) => interpolate(frame, [st[k], st[k] + 6], [0, 1], clamp);
  const total = spring({ frame: frame - st[5] - 6, fps, config: snap });
  return (
    <SceneInH kind="slide">
      <Backdrop act="night" />
      {/* telemóvel no tripé a gravar */}
      <div style={{ position: "absolute", left: 100, top: 170, opacity: tri, transform: `translateY(${(1 - tri) * 80}px)` }}>
        <Phone w={290}>
          <FaceVideo sceneFrom={sc.from} grade="night" posY={34} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "6px 14px", borderRadius: 10, background: "#FF3B30", fontFamily: F.sans, fontWeight: 700, fontSize: 19, color: "#fff", opacity: Math.floor(frame / 15) % 2 ? 1 : 0.6 }}>● REC</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: F.mono, fontSize: 25, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>TAKE {frame >= st[2] ? take : 1}</div>
        </Phone>
        <svg width={290} height={280} viewBox="0 0 290 280" style={{ marginTop: -10 }}>
          <path d="M145 0 L55 280 M145 0 L145 280 M145 0 L235 280" stroke="#3A3F4B" strokeWidth={10} strokeLinecap="round" />
        </svg>
      </div>
      {/* edição no telemóvel */}
      <div style={{ position: "absolute", left: 470, top: 40, opacity: ed, transform: `translateY(${(1 - ed) * 100}px)` }}>
        <Phone w={430}>
          <EditorScreen sceneFrom={sc.from} st={st} colocar={colocar} />
        </Phone>
      </div>
      {/* o custo de cada vídeo */}
      <div style={{ position: "absolute", left: 1010, top: 130, width: 810, opacity: card, transform: `translateX(${(1 - card) * 120}px)` }}>
        <Glass act="night" style={{ padding: "30px 36px 28px", background: "rgba(255,255,255,0.95)" }} radius={32}>
          <div style={{ display: "flex", alignItems: "flex-end", marginBottom: 20, fontFamily: F.sans }}>
            <div>
              <div style={{ fontSize: 22, color: N.dim }}>Por cada vídeo</div>
              <div style={{ fontSize: 42, fontWeight: 700, color: N.ink, letterSpacing: "-0.02em" }}>O meu processo</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 12, background: N.warnSoft, fontFamily: F.mono, fontSize: 26, color: N.warn }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: N.warn, opacity: Math.floor(frame / 12) % 2 ? 1 : 0.35 }} />
              {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </div>
          </div>
          {STEPS.map((s, k) => {
            const on = done(k) > 0.5;
            const cur = on && (k === 5 || done(k + 1) < 0.5);
            return (
              <div key={s.w} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 16px", marginBottom: 6, borderRadius: 18, background: cur ? N.blueSoft : "transparent", fontFamily: F.sans }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: on ? N.accent : N.graySoft, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(done(k) * Math.PI) * 0.18})` }}>
                  <Ico d={s.i} s={26} c={on ? "#fff" : "#94A3B8"} w={2.4} />
                </div>
                <div style={{ fontSize: 30, fontWeight: 600, color: on ? N.ink : N.faint }}>{s.l}</div>
                <div style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 10, background: k === 2 && on ? N.warnSoft : N.graySoft, color: k === 2 && on ? N.warn : N.gray, fontFamily: F.mono, fontSize: 21, opacity: 0.4 + done(k) * 0.6 }}>{s.c}</div>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, height: 52 }}>
            <div style={{ padding: "10px 22px", borderRadius: 999, background: N.warn, color: "#fff", fontFamily: F.sans, fontWeight: 700, fontSize: 26, opacity: total, transform: `scale(${0.7 + total * 0.3})` }}>≈ 3 h por cada vídeo</div>
          </div>
        </Glass>
      </div>
    </SceneInH>
  );
};

// ——— a4: uma semana sem espaço para criar ———
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
type Block = { d: number; s: number; e: number; label: string; color: string; at: "t" | "r" | "p" };
const BLOCKS: Block[] = [
  ...[0, 1, 2, 3, 4].map((d): Block => ({ d, s: 9, e: 18, label: "Trabalho", color: "#2563EB", at: "t" })),
  { d: 0, s: 18.5, e: 20, label: "Contas", color: "#64748B", at: "r" },
  { d: 1, s: 18.5, e: 20.5, label: "Escola", color: "#64748B", at: "r" },
  { d: 2, s: 18.5, e: 19.5, label: "Casa", color: "#64748B", at: "r" },
  { d: 3, s: 18.5, e: 20, label: "Médico", color: "#64748B", at: "r" },
  { d: 4, s: 18.5, e: 21, label: "Casa", color: "#64748B", at: "r" },
  { d: 5, s: 10, e: 19, label: "Família", color: "#60A5FA", at: "p" },
  { d: 6, s: 11, e: 19, label: "Família", color: "#60A5FA", at: "p" },
  { d: 0, s: 7, e: 8.5, label: "Ginásio", color: "#60A5FA", at: "p" },
  { d: 2, s: 7, e: 8.5, label: "Ginásio", color: "#60A5FA", at: "p" },
  { d: 1, s: 20.5, e: 22, label: "Descanso", color: "#60A5FA", at: "p" },
  { d: 3, s: 20, e: 22, label: "Descanso", color: "#60A5FA", at: "p" },
];
export const A4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("a4");
  const at = useAt(sc.from);
  const T = { t: at(t9("trabalho", 10.4)), r: at(t9("responsabilidades", 10.4)), p: at(t9("prioridades", 10.4)) };
  const win = spring({ frame: frame - 2, fps, config: soft });
  const top = 200;
  const left = 170;
  const cw = 140;
  const hh = 44;
  const y = (h: number) => top + (h - 7) * hh;
  const cIn = spring({ frame: frame - at(t9("produzir", 13)), fps, config: soft });
  const noRoom = at(t9("conteúdo", 13.6));
  const shake = frame > noRoom ? Math.sin((frame - noRoom) * 1.8) * 12 * Math.exp(-(frame - noRoom) / 14) : 0;
  const red = frame > noRoom;
  return (
    <SceneInH kind="fade">
      <Backdrop act="night" />
      <div style={{ position: "absolute", left: 70, top: 110, opacity: win, transform: `translateY(${(1 - win) * 60}px)` }}>
        <Glass act="night" style={{ width: 1110, height: 790, position: "relative", overflow: "hidden" }} radius={30}>
          <div style={{ position: "absolute", left: 30, top: 24, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: N.ink }}>
            Outubro <span style={{ fontWeight: 400, opacity: 0.6 }}>· semana 42</span>
          </div>
          {DAYS.map((d, i) => (
            <div key={d} style={{ position: "absolute", left: left - 70 + i * cw + 10, top: 120, width: cw - 20, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 22, color: N.dim }}>
              {d}
            </div>
          ))}
          {Array.from({ length: 16 }).map((_, k) => (
            <React.Fragment key={k}>
              <div style={{ position: "absolute", left: 24, top: y(7 + k) - 10 - 70, fontFamily: F.mono, fontSize: 16, color: N.faint }}>{7 + k}h</div>
              <div style={{ position: "absolute", left: left - 80, right: 20, top: y(7 + k) - 70, height: 1, background: "rgba(15,23,42,0.06)" }} />
            </React.Fragment>
          ))}
          {BLOCKS.map((b, i) => {
            const p = spring({ frame: frame - T[b.at] - (i % 7) * 2, fps, config: snap }); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: left - 70 + b.d * cw + 8,
                  width: cw - 16,
                  top: y(b.s) - 70,
                  height: (b.e - b.s) * hh - 4,
                  borderRadius: 10,
                  background: `${b.color}22`,
                  borderLeft: `5px solid ${b.color}`,
                  padding: "6px 10px",
                  fontFamily: F.sans,
                  fontWeight: 600,
                  fontSize: 18,
                  color: N.ink,
                  opacity: p,
                  transform: `scale(${0.8 + p * 0.2})`,
                  transformOrigin: "top left",
                }}
              >
                {b.label}
              </div>
            );
          })}
          {/* criar conteúdo: não há espaço */}
          <div
            style={{
              position: "absolute",
              left: left - 70 + 1 * cw + 8 + shake + (1 - cIn) * 600,
              width: 250,
              top: y(19) - 70 - (1 - cIn) * 200,
              height: 2.6 * hh,
              borderRadius: 10,
              background: red ? N.warn : N.good,
              boxShadow: "0 20px 40px -14px rgba(15,23,42,0.45)",
              padding: "8px 12px",
              fontFamily: F.sans,
              fontWeight: 700,
              fontSize: 26,
              color: "#fff",
              opacity: cIn,
              transform: `rotate(${(1 - cIn) * 8 + (red ? -3 : 0)}deg)`,
            }}
          >
            Criar conteúdo
            <div style={{ fontWeight: 500, fontSize: 20, opacity: 0.95 }}>{red ? "sem espaço" : "onde?"}</div>
          </div>
        </Glass>
      </div>
      <FaceCard sceneFrom={sc.from} grade="night" act="night" />
    </SceneInH>
  );
};

// ——— a5: 23:48 — as notificações não param e "criar conteúdo" volta a ser adiado ———
const NOTES = [
  ["Trabalho", "12 novos e-mails"],
  ["Agenda", "Reunião amanhã às 8:00"],
  ["Lembrete", "Criar conteúdo · adiado"],
  ["Mensagens", "Já enviaste o relatório?"],
  ["Lembrete", "Criar conteúdo · adiado de novo"],
  ["Banco", "Fatura disponível"],
  ["Lembrete", "Criar conteúdo · adiado 7×"],
];
export const A5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("a5").from);
  const t0 = at(t9("constantemente", 14));
  const ph = spring({ frame: frame - 1, fps, config: soft });
  const comp = at(t9("complicado", 15));
  const dim = interpolate(frame, [comp, comp + 12], [0, 1], clamp);
  return (
    <SceneInH kind="fade">
      <Backdrop act="night" city />
      <div style={{ position: "absolute", left: 760, top: 40, transform: `translateY(${(1 - ph) * 120}px) scale(${1 - dim * 0.03})`, opacity: ph }}>
        <Phone w={400} screen="radial-gradient(120% 80% at 50% 0%, #2A3560, #0A0E1C 70%)">
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: F.sans, color: "#fff" }}>
            <div style={{ fontSize: 24, fontWeight: 600, opacity: 0.8 }}>terça-feira</div>
            <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>23:48</div>
          </div>
          <div style={{ position: "absolute", left: 16, right: 16, top: 270 }}>
            {NOTES.map(([app, msg], i) => {
              const appear = t0 + i * 4;
              if (frame < appear - 1) return null;
              const p = spring({ frame: frame - appear, fps, config: snap }); // eslint-disable-line react-hooks/rules-of-hooks
              const shown = Math.min(NOTES.length, Math.floor((frame - t0) / 4) + 1);
              const idx = shown - 1 - i; // o mais recente fica em cima
              const isRem = app === "Lembrete";
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    transform: `translateY(${idx * 92 + (1 - p) * -40}px) scale(${0.92 + p * 0.08})`,
                    opacity: p * (idx > 5 ? 0 : 1 - idx * 0.08),
                    padding: "14px 18px",
                    borderRadius: 22,
                    background: isRem ? "rgba(255,107,107,0.24)" : "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontFamily: F.sans,
                    color: "#fff",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.06em" }}>{app}</div>
                  <div style={{ fontSize: 21, fontWeight: 600 }}>{msg}</div>
                </div>
              );
            })}
          </div>
          <AbsoluteFill style={{ background: `rgba(0,0,0,${dim * 0.35})` }} />
        </Phone>
      </div>
      {/* à esquerda: os vídeos que ficam por terminar */}
      <SideCard x={130} y={210} w={500} at={t0 - 6} tilt={-1}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.01em" }}>Por terminar</div>
          <div style={{ padding: "2px 12px", borderRadius: 999, background: N.warnSoft, color: N.warn, fontWeight: 700, fontSize: 20 }}>3</div>
          <div style={{ marginLeft: "auto", fontSize: 18, color: N.dim }}>esta semana</div>
        </div>
        {[
          { i: 1, s: "Editar", p: 0.62 },
          { i: 4, s: "Legendas", p: 0.35 },
          { i: 7, s: "Gravar", p: 0.12 },
        ].map((r, k) => {
          const rp = spring({ frame: frame - t0 - k * 5, fps, config: snap });
          const late = spring({ frame: frame - comp - k * 3, fps, config: snap });
          return (
            <div key={r.i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderTop: k ? `1px solid ${N.line}` : "none", opacity: rp, transform: `translateY(${(1 - rp) * 14}px)` }}>
              <VideoThumb i={r.i} radius={10} filter={`grayscale(${0.3 + dim * 0.6})`} style={{ width: 62, height: 86, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 22 }}>{VIDS[r.i].title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: N.graySoft, overflow: "hidden" }}>
                    <div style={{ width: `${r.p * 100}%`, height: "100%", borderRadius: 4, background: late > 0.5 ? N.warn : N.accent }} />
                  </div>
                  <div style={{ fontSize: 16, color: N.dim, width: 82 }}>{r.s}</div>
                </div>
              </div>
              <div style={{ padding: "4px 10px", borderRadius: 8, background: N.warnSoft, color: N.warn, fontWeight: 700, fontSize: 16, opacity: late, transform: `scale(${0.6 + late * 0.4})` }}>adiado</div>
            </div>
          );
        })}
      </SideCard>
      {/* o peso: um "+23" a pulsar ao lado */}
      <div style={{ position: "absolute", left: 1220, top: 300, fontFamily: F.sans, fontWeight: 700, fontSize: 64, color: N.warn, opacity: dim, transform: `scale(${0.8 + dim * 0.2})` }}>+23</div>
      <div style={{ position: "absolute", left: 1220, top: 380, fontFamily: F.sans, fontSize: 28, color: N.dim, opacity: dim }}>notificações por ler</div>
    </SceneInH>
  );
};
