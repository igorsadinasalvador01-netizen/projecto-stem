import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { A, AI_GRAD, Backdrop, C, F, FaceCard, FaceFull, Glass, Laptop, Phone, SceneInH, THUMBS } from "../Premium";
import { SCENESH, t9 } from "../timelineH";

const S = (id: string) => SCENESH.find((s) => s.id === id)!;
const D = A.dawn;
const soft = { damping: 18, stiffness: 110, mass: 0.9 };
const snap = { damping: 14, stiffness: 180, mass: 0.6 };

// esfera de IA: brilho em gradiente que gira e respira
export const Orb: React.FC<{ size: number; energy?: number }> = ({ size, energy = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div style={{ position: "absolute", inset: -size * 0.35, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.3), rgba(6,182,212,0.15) 45%, rgba(255,255,255,0) 70%)", filter: "blur(10px)", opacity: energy }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(from 0deg, #2563EB, #06B6D4, #16A34A, #94A3B8, #2563EB)", transform: `rotate(${t * 70}deg) scale(${1 + Math.sin(t * 3) * 0.03 * energy})`, filter: `blur(${size * 0.08}px)` }} />
      <div style={{ position: "absolute", inset: size * 0.12, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 35%, rgba(255,255,255,0) 70%)" }} />
    </div>
  );
};

const STEP_LABELS = ["Parar", "Gravar", "Repetir", "Editar", "Legendas", "Publicar"];

// ——— b1: a virada — rosto com luz de nascer do sol ———
export const B1: React.FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [0, 45], [0, 1], clamp);
  return (
    <SceneInH kind="light">
      <FaceFull sceneFrom={S("b1").from} grade="dawn" act="dawn" light={light} />
    </SceneInH>
  );
};

// ——— b2: Inteligência artificial — o processo antigo reorganiza-se num só fluxo ———
export const B2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("b2").from);
  const ti = at(t9("inteligência", 18.3));
  const title = spring({ frame: frame - ti, fps, config: soft });
  const orb = spring({ frame: frame - ti + 6, fps, config: soft });
  const chips = spring({ frame: frame - at(t9("mudar", 19.4)), fps, config: soft });
  const align = interpolate(frame, [at(t9("completamente", 19.4)), at(t9("este", 20)) + 6], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const neu = spring({ frame: frame - at(t9("processo", 20.2)), fps, config: snap });
  const rowW = 1500;
  return (
    <SceneInH kind="fade">
      <Backdrop act="dawn" />
      <div style={{ position: "absolute", left: 960 - 110, top: 120, transform: `scale(${0.6 + orb * 0.4})`, opacity: orb }}>
        <Orb size={220} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          textAlign: "center",
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 120,
          letterSpacing: "-0.04em",
          backgroundImage: AI_GRAD,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: title,
          transform: `translateY(${(1 - title) * 40}px)`,
          filter: `blur(${(1 - title) * 8}px)`,
        }}
      >
        Inteligência artificial
      </div>
      {/* o processo antigo, desordenado → um fluxo único */}
      <div style={{ position: "absolute", left: 960 - rowW / 2, top: 640, width: rowW, height: 160 }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 58, height: 6, borderRadius: 3, backgroundImage: AI_GRAD, transform: `scaleX(${align})`, transformOrigin: "left", opacity: align }} />
        {STEP_LABELS.map((l, k) => {
          const x = (k / 5) * (rowW - 220);
          const messX = x + Math.sin(k * 2.1) * 60;
          const messY = Math.cos(k * 1.7) * 70;
          return (
            <div
              key={l}
              style={{
                position: "absolute",
                left: messX + (x - messX) * align,
                top: messY * (1 - align),
                width: 220,
                height: 120,
                borderRadius: 26,
                background: "#FFFFFF",
                border: `2px solid ${align > 0.9 ? "#93C5FD" : C.line}`,
                boxShadow: "0 24px 50px -24px rgba(15,23,42,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.sans,
                fontWeight: 600,
                fontSize: 30,
                color: D.ink,
                opacity: chips * (0.55 + align * 0.45),
                transform: `rotate(${(1 - align) * Math.sin(k * 3) * 10}deg) scale(${0.8 + chips * 0.2})`,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", opacity: neu, transform: `translateY(${(1 - neu) * 20}px)` }}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: C.good, color: "#fff", fontFamily: F.sans, fontWeight: 700, fontSize: 32, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 30 }}>✓</span>
          Novo processo
        </div>
      </div>
    </SceneInH>
  );
};

// ——— b3: conhecimento + ideias + aprendizados → roteiro · prompts · vídeos ———
const Src: React.FC<{ at: number; icon: string; title: string; sub: string }> = ({ at, icon, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: snap });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 18, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 10px 24px -14px rgba(15,23,42,0.25)", opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: C.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={D.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 24, color: D.ink }}>{title}</div>
        <div style={{ fontFamily: F.sans, fontSize: 18, color: D.dim }}>{sub}</div>
      </div>
    </div>
  );
};
const Out: React.FC<{ at: number; title: string; children: React.ReactNode }> = ({ at, title, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: snap });
  return (
    <div style={{ borderRadius: 18, background: "#fff", border: `1px solid ${C.line}`, padding: 18, boxShadow: "0 14px 30px -18px rgba(15,23,42,0.3)", opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + p * 0.06})` }}>
      <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 22, color: D.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, backgroundImage: AI_GRAD }} />
        {title}
      </div>
      {children}
    </div>
  );
};
export const B3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("b3").from);
  const lap = spring({ frame: frame - 2, fps, config: soft });
  const typeAt = at(t9("transformo", 24));
  const prompt = "Transforma isto em roteiro, prompts e vídeos";
  const n = Math.max(0, Math.min(prompt.length, Math.floor((frame - typeAt) * 2.2)));
  const glow = interpolate(frame, [typeAt, typeAt + 10], [0, 1], clamp);
  return (
    <SceneInH kind="slide">
      <Backdrop act="dawn" />
      <div style={{ position: "absolute", left: 290, top: 70, transform: `translateY(${(1 - lap) * 100}px)`, opacity: lap }}>
        <Laptop w={1180} screen="#FFFFFF">
          <div style={{ position: "absolute", inset: 0, fontFamily: F.sans }}>
            <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${C.line}` }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
              ))}
              <div style={{ marginLeft: 16, fontSize: 18, color: D.dim }}>Estúdio de conteúdo</div>
            </div>
            <div style={{ position: "absolute", left: 24, top: 74, width: 330, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.12em", color: D.faint }}>FONTES</div>
              <Src at={at(t9("conhecimento", 21.5))} icon="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM20 17v4H6.5" title="Conhecimento" sub="anos de experiência" />
              <Src at={at(t9("ideias", 22.5))} icon="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" title="Ideias" sub="47 rascunhos" />
              <Src at={at(t9("aprendo", 23.5))} icon="M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5" title="Aprendizados" sub="o que aprendo todos os dias" />
            </div>
            {/* barra de pedido com brilho de IA */}
            <div style={{ position: "absolute", left: 380, right: 24, top: 74, height: 80, borderRadius: 20, padding: 2.5, backgroundImage: AI_GRAD, opacity: 0.35 + glow * 0.65, boxShadow: `0 0 ${40 * glow}px rgba(255,90,140,0.35)` }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", padding: "0 22px", fontSize: 24, color: D.ink }}>
                {n > 0 ? prompt.slice(0, n) : <span style={{ color: D.faint }}>Pergunta ou descreve…</span>}
                {n > 0 && n < prompt.length && <span style={{ width: 3, height: 30, background: D.accent, marginLeft: 3 }} />}
              </div>
            </div>
            <div style={{ position: "absolute", left: 380, right: 24, top: 180, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Out at={at(t9("roteiro", 24.5))} title="Roteiro">
                {[0.95, 0.8, 0.9, 0.6, 0.85, 0.7].map((w, i) => (
                  <div key={i} style={{ height: 10, width: `${w * 100}%`, borderRadius: 5, background: i === 0 ? C.ink : C.line, marginBottom: 12 }} />
                ))}
              </Out>
              <Out at={at(t9("prompts", 25))} title="Prompts">
                {["cena 1 · gancho", "cena 2 · problema", "cena 3 · virada"].map((p, i) => (
                  <div key={i} style={{ fontFamily: F.mono, fontSize: 16, color: D.ink, padding: "8px 10px", borderRadius: 8, background: C.graySoft, marginBottom: 8 }}>
                    {p}
                  </div>
                ))}
              </Out>
              <Out at={at(t9("vídeos", 25.5))} title="Vídeos">
                <div style={{ display: "flex", gap: 10 }}>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ flex: 1, height: 150, borderRadius: 12, background: `linear-gradient(160deg, ${THUMBS[[0, 1, 5][k]]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 0, height: 0, borderLeft: "20px solid #fff", borderTop: "12px solid transparent", borderBottom: "12px solid transparent", marginLeft: 6 }} />
                    </div>
                  ))}
                </div>
              </Out>
            </div>
          </div>
        </Laptop>
      </div>
    </SceneInH>
  );
};

// ——— b4: "A ideia continua a ser a minha." ———
export const B4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("b4");
  const at = useAt(sc.from);
  const w = (word: string, after: number) => spring({ frame: frame - at(t9(word, after)) + 2, fps, config: soft });
  const words: [string, string, number][] = [
    ["A", "a", 26.4],
    ["ideia", "ideia", 26.4],
    ["continua", "continua", 26.4],
    ["a ser", "ser", 27.0],
  ];
  const minha = w("minha", 27);
  return (
    <SceneInH kind="fade">
      <Backdrop act="dawn" />
      <div style={{ position: "absolute", left: 130, top: 300, width: 1050 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 26px", fontFamily: F.sans, fontWeight: 300, fontSize: 96, letterSpacing: "-0.035em", color: D.ink, lineHeight: 1.08 }}>
          {words.map(([txt, key, after]) => {
            const p = w(key, after);
            return (
              <span key={txt} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, display: "inline-block", filter: `blur(${(1 - p) * 6}px)` }}>
                {txt}
              </span>
            );
          })}
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 210, color: D.accent, lineHeight: 1, marginTop: 10, opacity: minha, transform: `translateY(${(1 - minha) * 40}px)`, filter: `blur(${(1 - minha) * 8}px)` }}>a minha.</div>
      </div>
      <FaceCard sceneFrom={sc.from} grade="dawn" act="dawn" />
    </SceneInH>
  );
};

// ——— b5: a IA ajuda — estrutura, roteiro, cenas ———
export const B5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("b5").from);
  const f1 = at(t9("estruturar", 28.5));
  const f2 = at(t9("melhorar", 30));
  const f3 = at(t9("construir", 31));
  const order = interpolate(frame, [f1, f1 + 0.7 * fps], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const strike = interpolate(frame, [f2 + 3, f2 + 12], [0, 1], clamp);
  const insert = spring({ frame: frame - f2 - 14, fps, config: snap });
  const lit = (k: number) => interpolate(frame, [at(t9("cenas", 32)) - 16 + k * 4, at(t9("cenas", 32)) - 8 + k * 4], [0, 1], clamp);
  const active = (start: number) => interpolate(frame, [start - 4, start + 6], [0, 1], clamp);
  const Card: React.FC<{ x: number; n: string; title: string; on: number; delay: number; children: React.ReactNode }> = ({ x, n, title, on, delay, children }) => {
    const p = spring({ frame: frame - delay, fps, config: soft });
    return (
      <div style={{ position: "absolute", left: x, top: 170, width: 540, height: 640, opacity: p, transform: `translateY(${(1 - p) * 80}px)` }}>
        <div style={{ position: "absolute", inset: -3, borderRadius: 33, backgroundImage: AI_GRAD, opacity: on, filter: "blur(1px)" }} />
        <Glass act="dawn" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.94)", padding: 34 }} radius={30}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 26 }}>
            <span style={{ fontFamily: F.mono, fontSize: 22, color: D.accent }}>{n}</span>
            <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: D.ink, letterSpacing: "-0.02em" }}>{title}</span>
          </div>
          {children}
        </Glass>
      </div>
    );
  };
  const outline = ["Gancho", "Problema", "Virada", "Mensagem"];
  const scrambled = [2, 0, 3, 1];
  return (
    <SceneInH kind="rise">
      <Backdrop act="dawn" />
      <div style={{ position: "absolute", left: 110, top: 90, display: "flex", alignItems: "center", gap: 18, fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: D.dim }}>
        <div style={{ transform: "scale(0.25)", transformOrigin: "left center", width: 40, height: 40 }}>
          <Orb size={160} />
        </div>
        <span style={{ marginLeft: 6 }}>com a ajuda da IA</span>
      </div>
      <Card x={110} n="01" title="Estrutura" on={active(f1)} delay={2}>
        {outline.map((o, i) => {
          const from = scrambled.indexOf(i);
          const y = (from + (i - from) * order) * 92;
          return (
            <div key={o} style={{ position: "absolute", left: 34, right: 34, top: 120 + y, height: 74, borderRadius: 16, background: i === 0 ? C.blueSoft : C.graySoft, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: D.ink }}>
              <span style={{ width: 34, height: 34, borderRadius: 17, background: order > 0.9 ? D.accent : "#CBD5E1", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              {o}
            </div>
          );
        })}
      </Card>
      <Card x={690} n="02" title="Roteiro" on={active(f2)} delay={5}>
        {[0.95, 0.85, 0.9, 0.7, 0.8].map((w, i) => (
          <div key={i} style={{ position: "relative", height: 14, width: `${w * 100}%`, borderRadius: 7, background: C.line, marginBottom: 26 }}>
            {i === 2 && <div style={{ position: "absolute", left: 0, top: 5, height: 4, width: `${strike * 100}%`, background: "#E5484D" }} />}
          </div>
        ))}
        <div style={{ opacity: insert, transform: `translateY(${(1 - insert) * 12}px)`, padding: "14px 18px", borderRadius: 14, background: "#E8F7EF", border: "1.5px solid #9FDDBE", fontFamily: F.sans, fontSize: 22, color: "#11633F" }}>
          Sugestão: começar pela emoção, não pela técnica.
        </div>
      </Card>
      <Card x={1270} n="03" title="Cenas" on={active(f3)} delay={8}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div
              key={k}
              style={{
                height: 200,
                borderRadius: 14,
                background: `linear-gradient(160deg, ${THUMBS[[0, 4, 3, 1, 2, 5][k]]})`,
                opacity: 0.18 + lit(k) * 0.82,
                transform: `scale(${0.92 + lit(k) * 0.08})`,
                boxShadow: lit(k) > 0.5 ? "0 14px 26px -14px rgba(15,23,42,0.4)" : "none",
              }}
            />
          ))}
        </div>
      </Card>
    </SceneInH>
  );
};

// ——— b6: Remotion — código → pré-visualização → vários vídeos ———
const CODE = ["<Composition", '  id="video-01"', "  fps={30}", "  width={1080}", "  height={1920}", "/>"];
const GRADS = THUMBS;
export const B6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("b6").from);
  const ed = spring({ frame: frame - 2, fps, config: soft });
  const chars = Math.floor(Math.max(0, frame - at(33.25)) * 1.8);
  const prog = interpolate(frame, [at(t9("preparar", 34.5)), at(t9("vários", 35.8))], [0, 1], { easing: theme.ease.inOut, ...clamp });
  const many = at(t9("vários", 35.8));
  const fan = spring({ frame: frame - many, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  const rem = spring({ frame: frame - at(t9("remotion", 34)), fps, config: snap });
  let left = chars;
  return (
    <SceneInH kind="slide">
      <Backdrop act="dawn" />
      {/* editor de código */}
      <div style={{ position: "absolute", left: 100, top: 170, width: 820, opacity: ed * (1 - fan * 0.6), transform: `translateX(${(1 - ed) * -80 - fan * 120}px) scale(${1 - fan * 0.08})` }}>
        <div style={{ borderRadius: 26, background: "#14161C", boxShadow: "0 50px 100px -40px rgba(15,23,42,0.5)", overflow: "hidden" }}>
          <div style={{ height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#1B1E26" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
            ))}
            <div style={{ marginLeft: 16, fontFamily: F.mono, fontSize: 18, color: "rgba(255,255,255,0.55)" }}>Video.tsx</div>
            <div style={{ marginLeft: "auto", fontFamily: F.sans, fontWeight: 700, fontSize: 20, color: "#fff", opacity: rem, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, backgroundImage: AI_GRAD }} />
              Remotion
            </div>
          </div>
          <div style={{ padding: "26px 32px", minHeight: 400 }}>
            {CODE.map((line, i) => {
              const show = line.slice(0, Math.max(0, left));
              left -= line.length;
              return (
                <div key={i} style={{ fontFamily: F.mono, fontSize: 34, lineHeight: 1.5, color: i === 0 || i === 5 ? "#7FB2FF" : i === 1 ? "#86EFAC" : "#E8E6E3", whiteSpace: "pre", minHeight: 51 }}>
                  <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 26 }}>{i + 1}</span>
                  {show}
                </div>
              );
            })}
          </div>
          <div style={{ padding: "0 32px 28px" }}>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{ width: `${prog * 100}%`, height: "100%", backgroundImage: AI_GRAD }} />
            </div>
            <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 18, color: "rgba(255,255,255,0.55)" }}>render · {Math.round(prog * 100)}%</div>
          </div>
        </div>
      </div>
      {/* pré-visualização → leque de vídeos */}
      {GRADS.map((g, k) => {
        const off = k - 4;
        const x = 1360 + off * 150 * fan - fan * 220;
        const rot = off * 7 * fan;
        const y = 150 + Math.abs(off) * 26 * fan;
        const show = k === 4 ? 1 : fan;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x - 170,
              top: y,
              width: 340,
              height: 600,
              borderRadius: 30,
              background: `linear-gradient(165deg, ${g})`,
              boxShadow: "0 40px 80px -30px rgba(15,23,42,0.45)",
              border: "4px solid #fff",
              transform: `rotate(${rot}deg)`,
              transformOrigin: "50% 120%",
              opacity: show * ed,
              zIndex: 10 - Math.abs(off),
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 26, right: 60, bottom: 40, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.8)" }} />
            <div style={{ position: "absolute", left: 26, right: 120, bottom: 70, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.55)" }} />
            <div style={{ position: "absolute", left: "50%", top: "42%", width: 0, height: 0, marginLeft: -12, borderLeft: "40px solid rgba(255,255,255,0.95)", borderTop: "24px solid transparent", borderBottom: "24px solid transparent" }} />
            {k === 4 && fan < 0.5 && <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${prog * 100}%`, background: "#fff" }} />}
          </div>
        );
      })}
    </SceneInH>
  );
};

// ——— b7: vários conteúdos num só dia ———
export const B7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = S("b7");
  const at = useAt(sc.from);
  const ph = spring({ frame: frame - 2, fps, config: soft });
  const t0 = at(t9("produzir", 37));
  const count = Math.min(9, Math.max(0, Math.floor((frame - t0) / 2.4) + 1));
  const day = spring({ frame: frame - at(t9("dia", 38.8)), fps, config: snap });
  const times = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"];
  return (
    <SceneInH kind="fade">
      <Backdrop act="dawn" />
      <div style={{ position: "absolute", left: 160, top: 60, transform: `translateY(${(1 - ph) * 120}px) rotate(-3deg)`, opacity: ph }}>
        <Phone w={420} finish="light" screen="#FFFFFF">
          <div style={{ position: "absolute", left: 24, right: 24, top: 80, fontFamily: F.sans }}>
            <div style={{ fontSize: 20, color: D.dim }}>Agendados</div>
            <div style={{ fontSize: 44, fontWeight: 800, color: D.ink, letterSpacing: "-0.03em", marginBottom: 14 }}>Hoje</div>
            {times.map((tm, i) => (
              <div key={tm} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 8, borderRadius: 14, background: "#fff", border: `1px solid ${C.line}`, opacity: i < count ? 1 : 0.35 }}>
                <div style={{ width: 34, height: 48, borderRadius: 8, background: `linear-gradient(165deg, ${GRADS[i]})` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: D.ink }}>Vídeo {i + 1}</div>
                  <div style={{ fontSize: 15, color: D.dim }}>{tm}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: i < count ? C.good : "#CBD5E1", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
              </div>
            ))}
          </div>
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 690, top: 260, fontFamily: F.sans, color: D.ink }}>
        <div style={{ fontSize: 260, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.9 }}>{Math.max(1, count)}</div>
        <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: "-0.02em", color: D.dim }}>vídeos</div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "12px 30px", borderRadius: 999, background: C.good, color: "#fff", fontWeight: 800, fontSize: 44, opacity: day, transform: `scale(${0.6 + day * 0.4})` }}>em 1 dia</div>
      </div>
      <FaceCard sceneFrom={sc.from} grade="dawn" act="dawn" />
    </SceneInH>
  );
};
