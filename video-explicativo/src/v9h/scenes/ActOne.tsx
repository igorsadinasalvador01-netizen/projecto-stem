import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { theme } from "../../theme";
import { A, Backdrop, F, FaceCard, FaceFull, FaceVideo, Glass, Laptop, Phone, SceneInH } from "../Premium";
import { SCENESH, t9 } from "../timelineH";

const S = (id: string) => SCENESH.find((s) => s.id === id)!;
const N = A.night;
const soft = { damping: 18, stiffness: 110, mass: 0.9 };
const snap = { damping: 14, stiffness: 180, mass: 0.6 };

// ——— a1: gancho — rosto à noite ———
export const A1: React.FC = () => (
  <SceneInH kind="none">
    <FaceFull sceneFrom={S("a1").from} grade="night" act="night" />
  </SceneInH>
);

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

// ——— a3: o processo antigo — câmara no tripé (take 7) + edição no portátil a noite toda ———
const STEPS = [
  { w: "parar", l: "Parar", i: "M8 5v14M16 5v14" },
  { w: "gravar", l: "Gravar", i: "M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14" },
  { w: "repetir", l: "Repetir", i: "M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" },
  { w: "editar", l: "Editar", i: "M6 4a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M6 15a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5M8.5 7.5L20 18M8.5 16.5L20 6" },
  { w: "legendas", l: "Legendas", i: "M3 6h18v12H3zM7 12h4M13 12h4M7 15h7" },
  { w: "publicar", l: "Publicar", i: "M12 16V4M7 9l5-5 5 5M4 20h16" },
];
export const A3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(S("a3").from);
  const st = STEPS.map((s) => at(t9(s.w, 5.5)));
  const lap = spring({ frame: frame - 2, fps, config: soft });
  const tri = spring({ frame: frame - 6, fps, config: soft });
  const take = Math.min(7, Math.max(1, 1 + Math.floor((frame - st[2]) / 3)));
  const secs = 2 * 3600 + 47 * 60 + Math.floor(frame * 21);
  const hh = Math.floor(secs / 3600);
  const mm = Math.floor((secs % 3600) / 60);
  const ss = secs % 60;
  const done = (k: number) => interpolate(frame, [st[k], st[k] + 6], [0, 1], clamp);
  return (
    <SceneInH kind="slide">
      <Backdrop act="night" />
      {/* telemóvel no tripé a gravar */}
      <div style={{ position: "absolute", left: 120, top: 150, opacity: tri, transform: `translateY(${(1 - tri) * 80}px)` }}>
        <Phone w={300}>
          <FaceVideo sceneFrom={S("a3").from} grade="night" posY={34} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 52, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "6px 14px", borderRadius: 10, background: "#FF3B30", fontFamily: F.sans, fontWeight: 700, fontSize: 20, color: "#fff", opacity: Math.floor(frame / 15) % 2 ? 1 : 0.6 }}>● REC</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>TAKE {frame >= st[2] ? take : 1}</div>
        </Phone>
        <svg width={300} height={300} viewBox="0 0 300 300" style={{ marginTop: -10 }}>
          <path d="M150 0 L60 300 M150 0 L150 300 M150 0 L240 300" stroke="#3A3F4B" strokeWidth={10} strokeLinecap="round" />
        </svg>
      </div>
      {/* portátil com a edição */}
      <div style={{ position: "absolute", left: 560, top: 120, transform: `translateX(${(1 - lap) * 200}px)`, opacity: lap }}>
        <Laptop w={1120}>
          <div style={{ position: "absolute", inset: 0, background: "#0F1219", fontFamily: F.sans, color: "#fff" }}>
            <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
              ))}
              <div style={{ marginLeft: 20, fontSize: 20, opacity: 0.7 }}>video_final_v7.mp4</div>
              <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 22, color: N.warn }}>
                {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
              </div>
            </div>
            {/* passos */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "40px 70px 0", position: "relative" }}>
              <div style={{ position: "absolute", left: 120, right: 120, top: 84, height: 3, background: "rgba(255,255,255,0.12)" }} />
              <div style={{ position: "absolute", left: 120, top: 84, height: 3, width: `${(interpolate(frame, [st[0], st[5]], [0, 1], clamp) * (1120 - 2 * 120 - 40))}px`, background: N.accent }} />
              {STEPS.map((s, k) => (
                <div key={s.w} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 1 }}>
                  <div style={{ width: 90, height: 90, borderRadius: 45, background: done(k) > 0.5 ? N.accent : "#1A1F2B", border: "2px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(done(k) * Math.PI) * 0.15})` }}>
                    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={done(k) > 0.5 ? "#0B1020" : "rgba(255,255,255,0.5)"} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.i} />
                    </svg>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 600, opacity: done(k) > 0.5 ? 1 : 0.45 }}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* linha de tempo */}
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 200, borderRadius: 14, background: "#0A0D13", border: "1px solid rgba(255,255,255,0.06)", padding: 16 }}>
              {[0, 1, 2].map((track) => (
                <div key={track} style={{ position: "relative", height: 48, marginBottom: 12, borderRadius: 8, background: "rgba(255,255,255,0.03)" }}>
                  {Array.from({ length: 9 }).map((_, k) => {
                    const appear = track === 0 ? st[1] + k * 2 : track === 1 ? st[3] + k * 2 : st[4] + k * 2;
                    const on = interpolate(frame, [appear, appear + 4], [0, 1], clamp);
                    return (
                      <div
                        key={k}
                        style={{
                          position: "absolute",
                          left: `${k * 11 + random(`tl${track}${k}`) * 2}%`,
                          width: `${7 + random(`tw${track}${k}`) * 3}%`,
                          top: 6,
                          bottom: 6,
                          borderRadius: 6,
                          background: ["#3B82F6", "#94A3B8", "#60A5FA"][track],
                          opacity: on * 0.85,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
              <div style={{ position: "absolute", top: 8, bottom: 8, left: `${4 + ((frame * 0.9) % 90)}%`, width: 3, background: "#FF453A" }} />
            </div>
          </div>
        </Laptop>
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
      {/* o peso: um "+23" a pulsar ao lado */}
      <div style={{ position: "absolute", left: 1220, top: 300, fontFamily: F.sans, fontWeight: 700, fontSize: 64, color: N.warn, opacity: dim, transform: `scale(${0.8 + dim * 0.2})` }}>+23</div>
      <div style={{ position: "absolute", left: 1220, top: 380, fontFamily: F.sans, fontSize: 28, color: N.dim, opacity: dim }}>notificações por ler</div>
    </SceneInH>
  );
};
