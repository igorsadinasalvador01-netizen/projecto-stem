import React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "../kit/Kit";
import { C, OUT } from "../v22/theme22";
import { M } from "./cuts23";
import { Big, Glass, Ico, k, kout, Mono, Orb, Tag, Wide, win } from "./Kit23";

// Vídeo 23 · "Dois centímetros" — ilustrações em vidro vazio. Geometria 1920×1080 da pessoa:
// hero 560–1360 · left 96–856 (livre 920–1840) · right 1064–1824 (livre 90–1000) · tl / tr 300 px.
type P = { to: number };
const col = (x: number, w: number, align: "left" | "right", top: number): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top,
  width: w,
  display: "flex",
  flexDirection: "column",
  alignItems: align === "right" ? "flex-end" : "flex-start",
  gap: 6,
});
const exitStyle = (o: number): React.CSSProperties => ({ opacity: o, filter: o < 0.99 ? `blur(${(1 - o) * 8}px)` : undefined, transform: `translateY(${(1 - o) * -16}px)` });
const draw = (p: number): React.SVGProps<SVGPathElement> => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.min(1, Math.max(0, p)) });
const prog = (to: number, at: number, d: number) => interpolate(to, [M(at), M(at) + d], [0, 1], { easing: Easing.inOut(Easing.cubic), ...clamp });

// ——— 0 · gancho: DOIS CENTÍMETROS · régua · QUANTO PODE CUSTAR? ———
const Ruler: React.FC<{ to: number }> = ({ to }) => {
  const p = k(to, 0.88, 0.5);
  const d = prog(to, 0.88, 0.9); // a cota de 2 cm abre
  const PX = 150; // px por cm
  return (
    <svg width={400} height={150} viewBox="0 0 400 150" style={{ overflow: "visible" }}>
      <rect x={10} y={56} width={380} height={64} rx={8} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2} opacity={p} />
      {Array.from({ length: 25 }).map((_, i) => {
        const x = 20 + i * (PX / 10);
        const L = i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11;
        const show = Math.min(1, Math.max(0, p * 40 - i * 0.6));
        return <line key={i} x1={x} y1={56} x2={x} y2={56 + L} stroke="rgba(255,255,255,0.8)" strokeWidth={i % 10 === 0 ? 2.2 : 1.4} opacity={show} />;
      })}
      {[0, 1, 2].map((n) => (
        <text key={n} x={20 + n * PX} y={110} fill={C.ink2} fontFamily={C.mono} fontSize={16} textAnchor="middle" opacity={p}>
          {n}
        </text>
      ))}
      {/* cota de 2 cm (azul) */}
      <path d={`M20 30 H${20 + 2 * PX * d}`} stroke={C.blue} strokeWidth={4} strokeLinecap="round" />
      <path d="M20 18 V44" stroke={C.blue} strokeWidth={3} opacity={d > 0 ? 1 : 0} />
      <path d={`M${20 + 2 * PX * d} 18 V44`} stroke={C.blue} strokeWidth={3} opacity={d > 0 ? 1 : 0} />
      <text x={20 + PX} y={14} fill={C.blue} fontFamily={C.display} fontSize={34} textAnchor="middle" opacity={Math.max(0, d - 0.6) / 0.4}>
        2 CM
      </text>
    </svg>
  );
};
export const Hook: React.FC<P> = ({ to }) => {
  const o = 1 - kout(to, 6.86, 0.24);
  if (o <= 0) return null;
  return (
    <>
      <div style={{ ...col(60, 460, "right", 200), ...exitStyle(o) }}>
        <Big text="DOIS" size={250} fill={C.blue} p={k(to, 0.6, 0.5)} mode="slam" />
        <Big text="CENTÍMETROS" size={96} p={k(to, 0.88, 0.5)} />
        <Mono p={k(to, 1.6)} style={{ marginTop: 14 }}>
          parecem
        </Mono>
        <Big text="INSIGNIFICANTES" size={70} fill={C.ink2} p={k(to, 2.16, 0.7)} mode="letters" />
      </div>
      <Glass x={1400} y={190} w={450} h={250} o={o} p={k(to, 0.88, 0.55)} from="right">
        <div style={{ position: "absolute", left: 24, top: 30 }}>
          <Ruler to={to} />
        </div>
        <Mono p={k(to, 2.9)} style={{ position: "absolute", left: 30, top: 204 }}>
          em uma obra
        </Mono>
      </Glass>
      <Glass x={1400} y={470} w={450} h={290} o={o} p={k(to, 4.64, 0.5)} from="right">
        <div style={{ position: "absolute", left: 34, top: 30, display: "flex", flexDirection: "column", gap: 4 }}>
          <Mono p={k(to, 4.64)}>mas você sabe</Mono>
          <Big text="QUANTO ISSO" size={84} p={k(to, 4.64, 0.45)} />
          <Big text="PODE CUSTAR?" size={92} fill={C.red} p={k(to, 5.36, 0.45)} mode="slam" />
        </div>
      </Glass>
    </>
  );
};

// ——— capítulo (hero): número grande à esquerda, palavra à direita ———
export const Chapter: React.FC<P & { a: number; b: number; num: string; label: string; right: React.ReactNode }> = ({ to, a, b, num, label, right }) => {
  const o = 1 - kout(to, b, 0.24);
  if (to < M(a) || o <= 0) return null;
  return (
    <>
      <div style={{ ...col(60, 460, "right", 300), ...exitStyle(o) }}>
        <Big text={num} size={260} fill={C.blue} p={k(to, a, 0.5)} mode="slam" />
        <Wide size={26} color={C.ink2} p={k(to, a + 0.15)}>
          {label}
        </Wide>
      </div>
      <div style={{ ...col(1400, 470, "left", 340), ...exitStyle(o) }}>{right}</div>
    </>
  );
};

// ——— parede da casa de banho: azulejos colocados um a um (+ elemento previsto) ———
const COLS = 6;
const ROWS = 7;
export const tileAt = (i: number) => 9.36 + i * 0.034; // o som de cada azulejo usa a mesma regra
const Wall: React.FC<{ to: number; w: number; h: number; tilesAt: number; dims?: number; clash?: number; element?: number }> = ({ to, w, h, dims = 0, clash = 0, element = 0 }) => {
  const tw = w / COLS;
  const th = h / ROWS;
  const off = clash * 18; // o erro de 2 cm: a grelha desalinha em relação ao elemento
  const ex = tw * 2.1;
  const ey = th * 2.6;
  const ew = tw * 2.2;
  const eh = th * 2.4;
  return (
    <svg width={w + 80} height={h + 80} viewBox={`-40 -40 ${w + 80} ${h + 80}`} style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={w} height={h} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2.4} />
      {Array.from({ length: COLS * ROWS }).map((_, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const t = to - M(tileAt(i));
        const p = OUT(Math.min(1, Math.max(0, t / 0.22)));
        if (p <= 0) return null;
        return (
          <rect
            key={i}
            x={c * tw + 4 + off}
            y={r * th + 4}
            width={tw - 8}
            height={th - 8}
            rx={3}
            fill="none"
            stroke={clash > 0.5 && c >= 2 && c <= 4 && r >= 2 && r <= 5 ? C.red : "rgba(255,255,255,0.75)"}
            strokeWidth={1.8}
            opacity={p}
            transform={`translate(0 ${(1 - p) * -12})`}
          />
        );
      })}
      {element > 0 && (
        <g opacity={element}>
          <rect x={ex} y={ey} width={ew} height={eh} rx={10} fill="rgba(5,10,20,0.85)" stroke={clash > 0.5 ? C.red : C.sky} strokeWidth={3} />
          <text x={ex + ew / 2} y={ey + eh / 2 + 8} fill={clash > 0.5 ? C.red : C.sky} fontFamily={C.mono} fontSize={18} textAnchor="middle" letterSpacing="2">
            ELEMENTO
          </text>
        </g>
      )}
      {dims > 0 && (
        <g stroke={C.sky} strokeWidth={2}>
          <path {...draw(dims)} d={`M0 -22 H${w}`} />
          <path {...draw(dims)} d={`M${w + 22} 0 V${h}`} />
          <text x={w / 2} y={-30} fill={C.sky} stroke="none" fontFamily={C.display} fontSize={30} textAnchor="middle" opacity={dims > 0.8 ? 1 : 0}>
            ? CM
          </text>
        </g>
      )}
      {clash > 0 && (
        <g opacity={clash}>
          <rect x={ex - 6} y={ey - 6} width={ew + 12 + off} height={eh + 12} rx={12} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="10 8" />
          <text x={ex + ew + off + 24} y={ey - 14} fill={C.red} fontFamily={C.display} fontSize={56}>
            ≠
          </text>
        </g>
      )}
    </svg>
  );
};
const Speed: React.FC<{ to: number; size: number; p: number }> = ({ to, size, p }) => {
  const a = (to * 900 * p) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0, opacity: p }}>
      <circle cx={50} cy={54} r={38} stroke={C.red} strokeWidth={5} fill="none" />
      <path d="M50 8v8M40 8h20" stroke={C.red} strokeWidth={5} strokeLinecap="round" />
      <path d={`M50 54 L${50 + 26 * Math.sin((a * Math.PI) / 180)} ${54 - 26 * Math.cos((a * Math.PI) / 180)}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};
export const Bathroom: React.FC<P> = ({ to }) => {
  const g = win(to, 8.16, 13.84, 0.55);
  if (g <= 0) return null;
  const o = 1 - kout(to, 13.84, 0.26);
  return (
    <Glass x={210} y={110} w={1320} h={760} o={o} p={k(to, 8.16, 0.6)} from="left">
      <div style={{ position: "absolute", left: 56, top: 44, width: 560, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Orb d="users" color={C.sky} size={64} p={k(to, 8.16, 0.5)} />
          <Wide size={26} p={k(to, 8.16)}>
            uma equipe entrou
          </Wide>
        </div>
        <Mono p={k(to, 8.64)} style={{ marginTop: 18 }}>
          para fazer o trabalho de
        </Mono>
        <Big text="REVESTIMENTO" size={108} fill={C.blue} p={k(to, 9.36, 0.6)} mode="letters" />
        <Wide size={24} color={C.ink2} p={k(to, 10.48)}>
          de uma casa de banho
        </Wide>
        <div style={{ height: 34 }} />
        <Mono p={k(to, 11.68)}>e as</Mono>
        <Big text="MEDIÇÕES" size={96} p={k(to, 11.84, 0.45)} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Speed to={to} size={84} p={k(to, 13.15, 0.4)} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Mono p={k(to, 12.4)}>foram feitas</Mono>
            <Big text="ÀS PRESSAS" size={100} fill={C.red} p={k(to, 13.15, 0.4)} mode="slam" />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 700, top: 70 }}>
        <Wall to={to} w={520} h={580} tilesAt={9.36} dims={prog(to, 11.84, 0.9)} element={k(to, 10.48, 0.5)} />
      </div>
    </Glass>
  );
};

// ——— 2 · ninguém confirmou as dimensões (pessoa à esquerda) ———
export const Confirm: React.FC<P> = ({ to }) => {
  const g = win(to, 13.84, 18.06, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 18.06, 0.26);
  const x = k(to, 15.92, 0.35);
  return (
    <Glass x={940} y={130} w={880} h={700} o={o} p={k(to, 13.84, 0.55)} from="right">
      <div style={{ position: "absolute", left: 56, top: 50, right: 56, display: "flex", flexDirection: "column", gap: 4 }}>
        <Big text="NINGUÉM" size={150} p={k(to, 13.84, 0.45)} mode="slam" />
        <Big text="CONFIRMOU" size={150} fill={C.red} p={k(to, 14.47, 0.45)} />
        <Wide size={26} color={C.ink2} p={k(to, 14.96)}>
          devidamente
        </Wide>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 28, opacity: k(to, 15.77), transform: `translateX(${(1 - k(to, 15.77)) * 40}px)` }}>
          <div style={{ position: "relative", width: 96, height: 96, borderRadius: 18, border: "3px solid rgba(255,255,255,0.7)" }}>
            {x > 0 && <div style={{ position: "absolute", inset: -10, transform: `scale(${1.6 - 0.6 * x})`, opacity: Math.min(1, x * 2) }}><Ico d="x" size={116} color={C.red} sw={3.2} /></div>}
          </div>
          <Big text="AS DIMENSÕES" size={96} p={k(to, 15.77, 0.4)} />
        </div>
      </div>
    </Glass>
  );
};

// ——— 3 · instalação: incompatibilidade (P&B) + o retrabalho (canto superior esquerdo) ———
const REWORK: [number, string, string, string?][] = [
  [24.97, "CORTAR", "cut"],
  [25.81, "ADAPTAR", "tool"],
  [26.58, "COMPRAR MATERIAIS", "cart", "adicionais"],
  [28.6, "CORRIGIR TUDO", "redo", "todo o trabalho"],
];
export const Install: React.FC<P> = ({ to }) => {
  const g = win(to, 18.06, 31.02, 0.55);
  if (g <= 0) return null;
  const o = 1 - kout(to, 31.02, 0.26);
  const clash = k(to, 21.12, 0.3);
  return (
    <>
      <Glass x={780 - 400 * Easing.bezier(0.65, 0, 0.35, 1)(interpolate(to, [M(23.99), M(23.99) + 0.6], [0, 1], clamp))} y={110} w={700} h={760} o={o} p={k(to, 18.64, 0.6)} from="left">
        <div style={{ position: "absolute", left: 44, top: 40, right: 44, display: "flex", flexDirection: "column", gap: 2 }}>
          <Mono p={k(to, 18.64)}>quando chega a fase da</Mono>
          <Big text="INSTALAÇÃO" size={104} p={k(to, 19.04, 0.45)} />
          <Mono p={k(to, 19.84)} color={C.ink2} style={{ marginTop: 6 }}>
            descobrem que existe
          </Mono>
          <Big text="INCOMPATIBILIDADE" size={86} fill={C.red} p={clash} mode="slam" />
          <Wide size={18} color={C.ink2} p={k(to, 22.16)}>
            com os elementos previstos
          </Wide>
        </div>
        <div style={{ position: "absolute", left: 120, top: 400 }}>
          <Wall to={to} w={420} h={300} tilesAt={9.36} element={k(to, 22.32, 0.5)} clash={clash * (to > M(21.12) ? 1 : 0)} />
        </div>
      </Glass>
      <Glass x={1120} y={110} w={720} h={760} o={o} p={k(to, 23.99, 0.55)} from="right">
        <div style={{ position: "absolute", left: 40, top: 36, right: 40, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Ico d="alert" size={30} color={C.red} sw={2.2} />
            <Mono p={k(to, 23.99)} color={C.ink2}>
              e agora é preciso
            </Mono>
          </div>
          {REWORK.map(([at, txt, ic, sub], i) => {
            const p = interpolate(to, [M(at), M(at) + 0.42], [0, 1], { easing: Easing.out(Easing.back(1.4)), ...clamp });
            const last = i === REWORK.length - 1;
            return (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 22, height: 132, padding: "0 26px", borderRadius: 22, border: `1.5px solid ${last ? "rgba(255,75,75,0.55)" : "rgba(255,255,255,0.22)"}`, opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 120}px) scale(${0.9 + 0.1 * Math.min(1, p)})` }}>
                <Orb d={ic} color={C.red} size={72} p={Math.min(1, p)} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Big text={txt} size={last ? 84 : 74} fill={last ? C.red : C.ink} p={1} />
                  {sub && (
                    <Mono p={k(to, at + 0.6)} size={15}>
                      {sub}
                    </Mono>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Glass>
    </>
  );
};

// ——— 4 · a causa: o problema começou muito antes (pessoa à direita) ———
const NODES = ["MEDIÇÃO", "VERIFICAÇÃO", "EXECUÇÃO"];
export const Cause: React.FC<P> = ({ to }) => {
  const g = win(to, 31.02, 38.67, 0.55);
  if (g <= 0) return null;
  const o = 1 - kout(to, 38.67, 0.26);
  const back = prog(to, 33.16, 0.7); // o marcador recua da execução para a medição
  const mk = k(to, 32.44, 0.35);
  const NX = [120, 410, 700];
  const mx = NX[2] + (NX[0] - NX[2]) * back;
  const bad = [k(to, 35.12, 0.35), k(to, 37.36, 0.35), 0];
  return (
    <Glass x={90} y={110} w={900} h={690} o={o} p={k(to, 31.02, 0.55)} from="left">
      <div style={{ position: "absolute", left: 50, top: 40, right: 50, display: "flex", flexDirection: "column", gap: 2 }}>
        <Tag color={C.blue} text="02 · A CAUSA" p={k(to, 31.02)} />
        <Big text="O PROBLEMA" size={120} p={k(to, 31.08, 0.6)} mode="letters" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          <Wide size={24} color={C.ink2} p={k(to, 31.56)} style={{ paddingBottom: 14 }}>
            não começou na
          </Wide>
          <Big text="EXECUÇÃO" size={84} fill={C.ink2} p={k(to, 32.44, 0.4)} strike={k(to, 32.6, 0.3)} />
        </div>
        <Big text="COMEÇOU MUITO ANTES" size={92} fill={C.blue} p={k(to, 33.16, 0.45)} mode="slam" />
      </div>
      {/* linha do processo */}
      <div style={{ position: "absolute", left: 0, top: 470, width: 900, height: 260 }}>
        <svg width={900} height={120} viewBox="0 0 900 120" style={{ position: "absolute", left: 0, top: 0 }}>
          <path {...draw(prog(to, 31.08, 0.8))} d={`M${NX[0]} 60 H${NX[2]}`} stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
          {NX.map((x, i) => {
            const p = k(to, 31.08 + i * 0.12, 0.4);
            const col2 = bad[i] > 0.5 ? C.red : "rgba(255,255,255,0.85)";
            return <circle key={i} cx={x} cy={60} r={22 * p} fill="rgba(5,10,20,0.9)" stroke={col2} strokeWidth={3.5} />;
          })}
          {mk > 0 && <circle cx={mx} cy={60} r={36 + 3 * Math.sin(to * 7)} fill="none" stroke={C.red} strokeWidth={3} opacity={mk} />}
        </svg>
        {NODES.map((n, i) => (
          <div key={n} style={{ position: "absolute", left: NX[i] - 150, width: 300, top: 104, textAlign: "center", opacity: k(to, 31.08 + i * 0.12), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Mono size={17} color={bad[i] > 0.5 ? C.red : C.ink2}>
              {n}
            </Mono>
            {i < 2 && (
              <Wide size={18} color={C.red} p={bad[i]}>
                {i === 0 ? "falta de rigor" : "falta de verificação"}
              </Wide>
            )}
          </div>
        ))}
      </div>
    </Glass>
  );
};

// ——— 6 · a lição (canto superior direito) ———
const SAVE: [number, string, string][] = [
  [53.42, "TEMPO", "clock"],
  [53.98, "DINHEIRO", "coin"],
  [54.86, "RECURSOS", "box"],
];
export const Lesson: React.FC<P> = ({ to }) => {
  const g = win(to, 46.72, 56.79, 0.55);
  if (g <= 0) return null;
  const o = 1 - kout(to, 56.79, 0.26);
  return (
    <Glass x={210} y={110} w={1320} h={660} o={o} p={k(to, 46.72, 0.6)} from="left">
      <div style={{ position: "absolute", left: 56, top: 40, right: 56, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Tag color={C.green} text="03 · A LIÇÃO" p={k(to, 46.72)} />
          <Orb d="helmet" color={C.sky} size={50} p={k(to, 46.78, 0.5)} />
          <Mono p={k(to, 46.72)}>na engenharia civil,</Mono>
        </div>
        {/* "ENGENHARIA CIVIL" ocupa o lugar até entrar PRODUTIVIDADE (o painel nunca fica vazio) */}
        <div style={{ position: "relative", height: 150 }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - k(to, 48.05, 0.18), transform: `translateY(${-24 * k(to, 48.05, 0.25)}px)` }}>
            <Big text="ENGENHARIA CIVIL" size={150} fill={C.sky} p={k(to, 46.78, 0.6)} mode="letters" />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Big text="PRODUTIVIDADE" size={150} fill={C.blue} p={k(to, 48.05, 0.5)} mode="slam" />
          </div>
        </div>
        <Wide size={24} color={C.ink2} p={k(to, 48.8)}>
          também significa
        </Wide>
        <div style={{ display: "flex", gap: 26, marginTop: 4 }}>
          <Big text="EVITAR" size={124} fill={C.green} p={k(to, 49.9, 0.45)} />
          <Big text="RETRABALHOS" size={124} fill={C.green} p={k(to, 50.35, 0.6)} mode="letters" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
          <Mono p={k(to, 51.18)}>porque</Mono>
          <Orb d="ruler" color={C.green} size={56} p={k(to, 51.66, 0.5)} />
          <Wide size={26} p={k(to, 51.66)}>
            uma medição bem feita
          </Wide>
          <Mono p={k(to, 52.94)}>pode poupar</Mono>
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 22 }}>
          {SAVE.map(([at, txt, ic]) => {
            const p = interpolate(to, [M(at), M(at) + 0.42], [0, 1], { easing: Easing.out(Easing.back(1.5)), ...clamp });
            return (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 16, height: 112, padding: "0 28px 0 18px", borderRadius: 22, border: "1.5px solid rgba(46,219,127,0.5)", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 40}px) scale(${0.88 + 0.12 * Math.min(1, p)})` }}>
                <Orb d={ic} color={C.green} size={64} p={Math.min(1, p)} />
                <Big text={txt} size={74} p={1} />
              </div>
            );
          })}
        </div>
      </div>
    </Glass>
  );
};

// ——— 7 · guarda isto (pessoa à direita; P&B em "um erro que ninguém detectou a tempo") ———
const W8: React.FC<{ to: number; at: number; children: string; color?: string; size?: number }> = ({ to, at, children, color = C.ink, size = 56 }) => {
  const p = k(to, at, 0.35);
  return (
    <span style={{ display: "inline-block", fontFamily: C.ui, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", color, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 14}px)`, filter: p < 0.97 ? `blur(${(1 - p) * 6}px)` : undefined }}>{children}</span>
  );
};
export const Keep: React.FC<P> = ({ to }) => {
  const g = win(to, 56.79, 64.3, 0.45);
  if (g <= 0) return null;
  const o = 1 - kout(to, 64.3, 0.3);
  return (
    <>
      <Glass x={90} y={110} w={560} h={120} r={60} o={o} p={k(to, 56.8, 0.45)} from="left">
        <div style={{ position: "absolute", left: 26, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 20 }}>
          <Orb d="bookmark" color={C.blue} size={70} p={k(to, 56.8, 0.5)} />
          <Big text="GUARDA ISTO" size={96} fill={C.blue} p={k(to, 56.8, 0.4)} mode="slam" />
        </div>
      </Glass>
      <Glass x={90} y={262} w={900} h={600} o={o} p={k(to, 57.8, 0.5)} from="left">
        <div style={{ position: "absolute", left: 50, top: 40, right: 50, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", columnGap: 14 }}>
            <W8 to={to} at={57.8} color={C.mute} size={40}>
              às vezes,
            </W8>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 16 }}>
            <W8 to={to} at={58.62}>o maior</W8>
            <W8 to={to} at={58.96} color={C.sky}>
              custo
            </W8>
            <W8 to={to} at={59.28}>de uma obra</W8>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22, marginTop: 6 }}>
            <W8 to={to} at={60.23} color={C.ink2} size={44}>
              não são os
            </W8>
            <Big text="MATERIAIS" size={110} p={k(to, 60.72, 0.45)} strike={k(to, 61.52, 0.3)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 6 }}>
            <Mono p={k(to, 61.52)} color={C.ink2}>
              mas sim
            </Mono>
            <Big text="UM ERRO" size={150} fill={C.red} p={k(to, 62.23, 0.45)} mode="slam" />
          </div>
          <Wide size={24} color={C.ink2} p={k(to, 62.72)}>
            que ninguém detectou a tempo
          </Wide>
        </div>
      </Glass>
    </>
  );
};
