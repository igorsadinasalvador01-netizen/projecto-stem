import React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "../kit/Kit";
import { M } from "../v21/cuts21";
import { Big, Glass, Ico, k, kout, Mono, Orb, Tag, Wide, win } from "./Kit22";
import { C } from "./theme22";

// Vídeo 22 · ilustrações em vidro. Geometria (1920×1080) da pessoa em cada modo:
// hero 560–1360 · left 96–856 (área livre 920–1840) · right 1064–1824 (área livre 90–1000)
// tl / tr: quadrado de 300 nos cantos superiores (área livre ao centro).
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
// grupo de texto (sem vidro dentro) com saída: sobe, desfoca e some
const exitStyle = (o: number): React.CSSProperties => ({ opacity: o, filter: o < 0.99 ? `blur(${(1 - o) * 8}px)` : undefined, transform: `translateY(${(1 - o) * -16}px)` });

// ——— 0 · gancho: DOIS VENDEDORES · MESMA SALA DE REUNIÃO ———
export const Hook: React.FC<P> = ({ to }) => {
  const o = 1 - kout(to, 3.28, 0.24);
  if (o <= 0) return null;
  return (
    <>
      <div style={{ ...col(60, 460, "right", 250), ...exitStyle(o) }}>
        <Big text="DOIS" size={270} fill={C.blue} p={k(to, 0.24, 0.5)} mode="slam" />
        <Big text="VENDEDORES" size={112} p={k(to, 0.56, 0.5)} />
      </div>
      <Glass x={1404} y={330} w={440} h={330} o={o} p={k(to, 1.12, 0.5)}>
        <div style={{ position: "absolute", left: 34, top: 30, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Orb d="table" color={C.sky} size={60} p={k(to, 1.12, 0.6)} />
            <Mono p={k(to, 1.12)}>entram na</Mono>
          </div>
          <Big text="MESMA SALA" size={92} p={k(to, 1.76, 0.42)} mode="wipe" />
          <Big text="DE REUNIÃO" size={92} fill={C.sky} p={k(to, 2.4, 0.42)} mode="wipe" />
        </div>
      </Glass>
    </>
  );
};

// ——— 1 · os dois vendedores (pessoa no canto superior esquerdo) ———
export const Sellers: React.FC<P> = ({ to }) => {
  const g = win(to, 3.28, 10.0, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 10.0, 0.26);
  const lose = k(to, 7.52, 0.5); // "só um conquistou"
  const card = (i: 0 | 1) => {
    const a = i === 0 ? 3.28 : 5.2;
    const p = k(to, a, 0.55);
    const c = i === 0 ? C.red : C.sky;
    const win1 = i === 1 ? lose : 0;
    return (
      <Glass
        key={i}
        x={i === 0 ? 400 : 980}
        y={220}
        w={540}
        h={560}
        o={o}
        p={p}
       
        dim={i === 0 ? lose : 0}
       
        style={{ transform: `translateY(${(1 - p) * 30 - win1 * 12}px) scale(${(0.93 + 0.07 * p) * (1 + 0.035 * win1) * (1 - (i === 0 ? 0.04 * lose : 0))})` }}
      >
        <div style={{ position: "absolute", left: 40, top: 40, right: 40, display: "flex", flexDirection: "column", gap: 18, filter: i === 0 && lose > 0 ? `grayscale(${lose})` : undefined }}>
          <Tag color={c} text={i === 0 ? "VENDEDOR 01" : "VENDEDOR 02"} p={p} />
          <Orb d={i === 0 ? "tag" : "search"} color={c} size={104} p={k(to, a + 0.1, 0.6)} />
          <div style={{ marginTop: 30 }}>
            <Big text="TENTA" size={78} fill={C.ink2} p={k(to, i === 0 ? 4.0 : 6.08)} />
          </div>
          <Big text={i === 0 ? "VENDER" : "COMPREENDER"} size={i === 0 ? 150 : 92} fill={i === 0 ? C.red : C.sky} p={k(to, i === 0 ? 4.4 : 6.64, 0.45)} mode="slam" />
        </div>
      </Glass>
    );
  };
  const b = k(to, 8.08, 0.5);
  return (
    <>
      {card(0)}
      {card(1)}
      <Glass x={1010} y={806} w={480} h={78} r={39} o={o} p={b}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Ico d="check" size={30} color={C.green} sw={2.6} />
          <Wide size={22} color={C.ink}>Conquistou o cliente</Wide>
        </div>
      </Glass>
    </>
  );
};

// ——— 2 · "Imagina esta situação." (capítulo 01) ———
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
      <div style={{ ...col(1400, 470, "left", 330), ...exitStyle(o) }}>{right}</div>
    </>
  );
};

// ——— 3 · o pedido do empresário (pessoa no canto superior direito) ———
const Plan: React.FC<{ p: number }> = ({ p }) => {
  const d = (q: number): React.SVGProps<SVGPathElement> => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.min(1, Math.max(0, (p - q) / 0.55)) });
  return (
    <svg width={760} height={300} viewBox="0 0 760 300" fill="none" stroke={C.sky} strokeWidth={2.4} strokeLinecap="round" >
      <path {...d(0)} d="M10 10H750V290H10Z" />
      <path {...d(0.12)} d="M260 10V170M260 230V290M10 150H180M520 10V120M520 180V290M520 150H750" />
      <path {...d(0.25)} d="M180 150a60 60 0 0 1 60 -60M520 120a60 60 0 0 1 60 60" strokeDasharray="1" opacity={0.7} />
      <path {...d(0.32)} d="M330 60h120v60H330zM300 190h180v50H300z" stroke={C.blue} />
      <path {...d(0.4)} d="M60 200h70v60H60zM600 40h110v70H600zM600 210h110v50H600z" strokeWidth={1.6} opacity={0.8} />
      <path {...d(0.45)} d="M10 0V-6M750 0V-6M10 -3H750" strokeWidth={1.2} opacity={0.6} />
    </svg>
  );
};
export const Brief: React.FC<P> = ({ to }) => {
  const g = win(to, 11.53, 15.92, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 15.92, 0.26);
  const arrow = k(to, 12.48, 0.6);
  return (
    <Glass x={230} y={130} w={1290} h={690} o={o} p={k(to, 11.53, 0.55)}>
      <div style={{ position: "absolute", left: 56, top: 50, right: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Orb d="person" color={C.blue} size={96} p={k(to, 11.92, 0.55)} />
          <Big text="EMPRESÁRIO" size={96} p={k(to, 11.92, 0.45)} />
        </div>
        <div style={{ position: "relative", width: 200, height: 60 }}>
          <Mono p={arrow} style={{ position: "absolute", left: 0, right: 0, top: -14, textAlign: "center" }}>procura</Mono>
          <svg width={200} height={60} viewBox="0 0 200 60" style={{ position: "absolute", top: 12 }}>
            <path d="M8 30H186" stroke={C.ink2} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
            <path d="M172 18l16 12-16 12" stroke={C.ink2} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.85 ? 1 : 0} />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Orb d="building" color={C.sky} size={96} p={k(to, 13.2, 0.55)} />
          <Big text="EMPRESA" size={96} fill={C.sky} p={k(to, 13.2, 0.45)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 56, top: 250, width: 380, display: "flex", flexDirection: "column", gap: 12 }}>
        <Mono p={k(to, 13.68)}>para fazer a</Mono>
        <Big text="REMODELAÇÃO" size={80} fill={C.blue} p={k(to, 14.0, 0.45)} mode="wipe" />
        <Wide size={24} color={C.ink2} p={k(to, 14.8)}>
          do seu
        </Wide>
        <Big text="ESPAÇO" size={84} fill={C.sky} p={k(to, 15.2, 0.4)} mode="slam" />
      </div>
      <div style={{ position: "absolute", left: 450, top: 262, opacity: k(to, 14.0, 0.3), transform: "scale(1.04)", transformOrigin: "0 0" }}>
        <Plan p={interpolate(to, [M(14.0), M(14.0) + 1.3], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp })} />
      </div>
    </Glass>
  );
};

// ——— 4 · o primeiro vendedor despeja tudo (pessoa à esquerda) ———
const ITEMS: [number, string, string][] = [
  [19.52, "MATERIAIS", "box"],
  [20.48, "PREÇO", "euro"],
  [21.28, "VANTAGENS", "star"],
  [22.32, "SERVIÇO", "tool"],
];
export const Pitch: React.FC<P> = ({ to }) => {
  const g = win(to, 15.92, 23.2, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 23.2, 0.26);
  const im = k(to, 17.76, 0.45);
  return (
    <>
      <Glass x={940} y={120} w={880} h={250} o={o} p={k(to, 16.48, 0.5)}>
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            <Tag color={C.red} text="VENDEDOR 01" p={k(to, 16.48)} />
            <Mono p={k(to, 17.12)}>já chega</Mono>
          </div>
          <Big text="IMEDIATAMENTE" size={138} fill={C.red} p={im} mode="slam" />
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 948, top: 404, ...exitStyle(o) }}>
        <Mono p={k(to, 18.48)} color={C.ink2}>
          apresentando
        </Mono>
      </div>
      {ITEMS.map(([at, txt, ic], i) => {
        const p = interpolate(to, [M(at), M(at) + 0.42], [0, 1], { easing: Easing.out(Easing.back(1.5)), ...clamp });
        const x = 940 + (i % 2) * 450;
        const y = 450 + Math.floor(i / 2) * 140;
        return (
          <Glass key={txt} x={x} y={y} w={430} h={118} r={24} o={o} p={Math.min(1, p)} style={{ transform: `translateX(${(1 - p) * 160}px) rotate(${(1 - p) * 6 + (i % 2 ? 1.2 : -1.2)}deg) scale(${0.9 + 0.1 * p})` }}>
            <div style={{ position: "absolute", left: 26, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 20 }}>
              <Orb d={ic} color={C.blue} size={66} p={p} />
              <Big text={txt} size={72} p={1} />
            </div>
          </Glass>
        );
      })}
    </>
  );
};

// ——— 5 · o segundo vendedor pergunta (pessoa à direita) + pergunta escrita ao teclado ———
type Row = [number, number, string, string?][]; // [início, fim, palavra, cor] (tempo original)
// texto escrito ao teclado: cada palavra é teclada no seu início exato, letra a letra
export const typeAt = (a: number, b: number, n: number, i: number) => M(a) + (i / n) * Math.min(0.28, Math.max(0.1, (M(b) - M(a)) * 0.8));
export const Typed: React.FC<{ to: number; rows: Row[]; size: number; color?: string }> = ({ to, rows, size, color = C.ink }) => {
  // índice global do último carácter já escrito → o cursor fica logo a seguir
  let last = -1;
  let gi = 0;
  rows.flat().forEach(([a, b, w]) => {
    const n = [...w].length;
    for (let i = 0; i < n; i++, gi++) if (to >= typeAt(a, b, n, i)) last = gi;
  });
  gi = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.12 }}>
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: "flex", flexWrap: "nowrap", columnGap: size * 0.26 }}>
          {r.map(([a, b, w, c], wi) => {
            const chars = [...w];
            return (
              <span key={wi} style={{ position: "relative", fontFamily: C.ui, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", color: c ?? color, whiteSpace: "nowrap" }}>
                {chars.map((ch, ci) => {
                  const me = gi++;
                  return (
                    <span key={ci} style={{ position: "relative", opacity: to >= typeAt(a, b, chars.length, ci) ? 1 : 0 }}>
                      {ch}
                      {me === last && <Cursor to={to} size={size} />}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
export const Cursor: React.FC<{ to: number; size: number }> = ({ to, size }) => (
  <span style={{ position: "absolute", right: -size * 0.12, top: size * 0.14, width: Math.max(3, size * 0.07), height: size * 0.92, borderRadius: 2, background: C.blue, opacity: 0.35 + 0.65 * (Math.sin(to * Math.PI * 3.2) > -0.2 ? 1 : 0) }} />
);

export const Ask: React.FC<P> = ({ to }) => {
  const g = win(to, 23.2, 30.41, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 30.41, 0.26);
  const calm = k(to, 25.44, 0.8);
  return (
    <>
      <Glass x={90} y={110} w={900} h={250} o={o} p={k(to, 23.38, 0.5)}>
        <div style={{ position: "absolute", left: 40, top: 34, right: 40, display: "flex", flexDirection: "column", gap: 10 }}>
          <Tag color={C.sky} text="VENDEDOR 02" p={k(to, 23.38)} />
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
            <Big text="APENAS" size={104} fill={C.ink2} p={k(to, 24.48)} />
            <Big text="PERGUNTA" size={104} fill={C.sky} p={k(to, 24.88, 0.45)} mode="slam" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: calm }}>
            <svg width={120} height={24} viewBox="0 0 120 24">
              <path d={`M0 12 ${Array.from({ length: 25 }, (_, i) => `L${i * 5} ${12 + Math.sin(i * 0.55 + to * 2.2) * 7 * calm}`).join(" ")}`} stroke={C.sky} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            </svg>
            <Wide size={22} color={C.sky} p={calm}>
              calma e friamente
            </Wide>
          </div>
        </div>
      </Glass>
      <Glass x={90} y={392} w={900} h={430} o={o} p={k(to, 26.88, 0.5)}>
        <div style={{ position: "absolute", left: 34, top: -28, fontFamily: C.display, fontSize: 220, color: C.sky, opacity: 0.85, lineHeight: 1 }}>“</div>
        <div style={{ position: "absolute", left: 66, top: 104 }}>
          <Typed
            to={to}
            size={60}
            rows={[
              [
                [26.88, 27.04, "O"],
                [27.04, 27.13, "que"],
                [27.13, 28.2, "atualmente"],
              ],
              [
                [28.24, 28.56, "mais"],
                [28.56, 28.72, "te"],
                [28.72, 29.5, "incomoda", C.blue],
              ],
              [
                [29.52, 29.92, "neste"],
                [29.92, 30.4, "espaço?"],
              ],
            ]}
          />
        </div>
      </Glass>
    </>
  );
};

// ——— 6 · a resposta do cliente (preto e branco; pessoa à esquerda) ———
const Clock: React.FC<{ to: number; size: number; spin: number }> = ({ to, size, spin }) => {
  const a = (to * 720 * spin) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <circle cx={50} cy={50} r={44} stroke={C.red} strokeWidth={5} fill="none" />
      <path d={`M50 50 L${50 + 30 * Math.sin((a * Math.PI) / 180)} ${50 - 30 * Math.cos((a * Math.PI) / 180)}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <path d={`M50 50 L${50 + 20 * Math.sin((a * Math.PI) / 2160)} ${50 - 20 * Math.cos((a * Math.PI) / 2160)}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      <circle cx={50} cy={50} r={4} fill={C.red} />
    </svg>
  );
};
const Mess: React.FC<{ to: number; size: number; p: number }> = ({ to, size, p }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
    {Array.from({ length: 9 }).map((_, i) => {
      const r = i % 3;
      const c = Math.floor(i / 3);
      const j = p * (((i * 37) % 11) - 5);
      return (
        <rect
          key={i}
          x={8 + r * 30 + j * 1.2}
          y={8 + c * 30 + (((i * 53) % 7) - 3) * p}
          width={24}
          height={24}
          rx={4}
          fill="none"
          stroke={i % 4 === 0 ? C.red : C.ink2}
          strokeWidth={3}
          transform={`rotate(${j * 2.4 + Math.sin(to * 3 + i) * 2 * p} ${20 + r * 30} ${20 + c * 30})`}
        />
      );
    })}
  </svg>
);
export const Client: React.FC<P> = ({ to }) => {
  const g = win(to, 30.41, 38.56, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 38.56, 0.26);
  return (
    <>
      <Glass x={940} y={110} w={880} h={150} o={o} p={k(to, 30.88, 0.5)}>
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 22 }}>
          <Orb d="users" color={C.ink} size={80} p={k(to, 30.88, 0.55)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
              <Tag color={C.ink} text="CLIENTE" p={k(to, 30.88)} />
              <Mono p={k(to, 31.52)}>responde</Mono>
            </div>
            <Wide size={26} p={k(to, 32.8)}>
              os meus funcionários
            </Wide>
          </div>
        </div>
      </Glass>
      <Glass x={940} y={290} w={880} h={250} o={o} p={k(to, 33.84, 0.45)}>
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 34 }}>
          <Clock to={to} size={150} spin={k(to, 33.84, 1.0)} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Big text="PERDEM" size={120} fill={C.red} p={k(to, 33.84, 0.45)} mode="slam" />
            <div style={{ display: "flex", gap: 20 }}>
              <Big text="MUITO" size={96} p={k(to, 34.4)} />
              <Big text="TEMPO" size={96} p={k(to, 34.8)} />
            </div>
          </div>
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 980, top: 556, display: "flex", alignItems: "center", gap: 14, ...exitStyle(o) }}>
        <Ico d="down" size={26} color={C.ink2} />
        <Mono p={k(to, 35.36)} color={C.ink2}>
          porque
        </Mono>
      </div>
      <Glass x={940} y={606} w={880} h={240} o={o} p={k(to, 36.0, 0.45)}>
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 34 }}>
          <Mess to={to} size={150} p={k(to, 36.8, 0.6)} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Big text="O ESPAÇO ESTÁ" size={84} fill={C.ink2} p={k(to, 36.0)} />
            <Big text="MAL ORGANIZADO" size={110} fill={C.red} p={k(to, 36.8, 0.45)} mode="slam" />
          </div>
        </div>
      </Glass>
    </>
  );
};

// ——— 7 · o primeiro vendedor só queria vender (preto e branco; canto superior esquerdo) ———
export const Fail: React.FC<P> = ({ to }) => {
  const g = win(to, 40.78, 44.83, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 44.83, 0.24);
  return (
    <Glass x={400} y={180} w={1120} h={640} o={o} p={k(to, 40.78, 0.55)}>
      <div style={{ position: "absolute", left: 60, top: 54, right: 60, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            <Tag color={C.red} text="VENDEDOR 01" p={k(to, 41.04)} />
            <Mono p={k(to, 41.94)}>estava apenas</Mono>
          </div>
          <Orb d="tag" color={C.red} size={84} p={k(to, 43.31, 0.5)} />
        </div>
        {/* "O PRIMEIRO" ocupa o lugar até entrar PREOCUPADO */}
        <div style={{ position: "relative", marginTop: 10, height: 168 }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - k(to, 42.8, 0.18), transform: `translateY(${-24 * k(to, 42.8, 0.25)}px)` }}>
            <Big text="O PRIMEIRO" size={168} fill={C.ink2} p={k(to, 41.04, 0.45)} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Big text="PREOCUPADO" size={168} p={k(to, 42.8, 0.45)} mode="slam" />
          </div>
        </div>
        <Big text="EM VENDER" size={168} fill={C.red} p={k(to, 43.31, 0.45)} mode="slam" />
        <Wide size={30} color={C.ink2} p={k(to, 43.76)}>
          a remodelação
        </Wide>
      </div>
    </Glass>
  );
};

// ——— 8 · o segundo percebeu: produtividade → solução → negócio (canto superior direito) ———
const Chart: React.FC<{ p: number; to: number }> = ({ p, to }) => {
  const pts = [
    [0, 150],
    [80, 138],
    [160, 142],
    [240, 112],
    [320, 96],
    [400, 64],
    [480, 30],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const tip = pts[pts.length - 1];
  return (
    <svg width={500} height={170} viewBox="-10 0 500 170" style={{ overflow: "visible" }}>
      <path d={d} stroke={C.green} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {p > 0.95 && <circle cx={tip[0]} cy={tip[1]} r={9 + Math.sin(to * 6) * 2} fill={C.green} />}
    </svg>
  );
};
export const Solution: React.FC<P> = ({ to }) => {
  const g = win(to, 44.83, 53.68, 0.5);
  if (g <= 0) return null;
  const o = 1 - kout(to, 53.68, 0.26);
  const strike = k(to, 50.27, 0.35);
  return (
    <Glass x={200} y={110} w={1330} h={760} o={o} p={k(to, 44.83, 0.55)}>
      <div style={{ position: "absolute", left: 56, top: 44, right: 56, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          <Tag color={C.sky} text="VENDEDOR 02" p={k(to, 45.04)} />
          <Mono p={k(to, 46.24)}>que o problema era a</Mono>
        </div>
        {/* "PERCEBEU" ocupa o lugar até entrar PRODUTIVIDADE (o painel nunca fica vazio) */}
        <div style={{ position: "relative", marginTop: 6, height: 190 }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - k(to, 47.36, 0.18), transform: `translateY(${-24 * k(to, 47.36, 0.25)}px)` }}>
            <Big text="PERCEBEU" size={190} fill={C.sky} p={k(to, 45.6, 0.45)} />
          </div>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Big text="PRODUTIVIDADE" size={190} fill={C.blue} p={k(to, 47.36, 0.5)} mode="slam" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 4 }}>
          <Mono p={k(to, 48.63)}>em vez de vender</Mono>
          <Big text="A OBRA" size={92} fill={strike > 0 ? `rgba(244,247,251,${1 - 0.45 * strike})` : C.ink} p={k(to, 49.81)} strike={strike} />
          <div style={{ opacity: k(to, 50.46), transform: `translateX(${(1 - k(to, 50.46)) * -20}px)` }}>
            <Ico d="arrow" size={54} color={C.ink2} sw={2.4} />
          </div>
          <Orb d="check" color={C.green} size={70} p={k(to, 50.95, 0.5)} />
          <Big text="A SOLUÇÃO" size={108} fill={C.green} p={k(to, 50.95, 0.45)} mode="slam" />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40, marginTop: 22 }}>
          <Chart p={interpolate(to, [M(51.57), M(51.57) + 1.2], [0, 1], { easing: Easing.inOut(Easing.cubic), ...clamp })} to={to} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 6 }}>
            <Wide size={24} color={C.ink2} p={k(to, 51.57)}>
              que melhoraria
            </Wide>
            <Big text="O NEGÓCIO" size={120} fill={C.green} p={k(to, 52.19, 0.45)} mode="slam" />
          </div>
        </div>
      </div>
    </Glass>
  );
};

// ——— 9 · comum vs. estratégico (hero) ———
export const Separate: React.FC<P> = ({ to }) => {
  const o = 1 - kout(to, 57.92, 0.24);
  if (to < M(53.68) || o <= 0) return null;
  const strike = k(to, 56.34, 0.35);
  return (
    <>
      <div style={{ ...col(60, 460, "right", 120), ...exitStyle(o) }}>
        <Big text="03" size={170} fill={C.blue} p={k(to, 53.68, 0.5)} mode="slam" />
        <Mono p={k(to, 54.56)} color={C.ink2}>
          o que separa
        </Mono>
        <div style={{ height: 70 }} />
        <Mono p={k(to, 54.96)}>um</Mono>
        <Big text="VENDEDOR" size={104} fill="rgba(200,208,222,0.75)" p={k(to, 55.12)} />
        <Big text="COMUM" size={150} fill="rgba(200,208,222,0.75)" p={k(to, 55.52, 0.45)} mode="slam" strike={strike} />
      </div>
      <div style={{ ...col(1400, 470, "left", 330), ...exitStyle(o) }}>
        <Mono p={k(to, 56.16)}>de um</Mono>
        <Big text="PROFISSIONAL" size={92} fill={C.blue} p={k(to, 56.34, 0.45)} mode="slam" />
        <Big text="ESTRATÉGICO" size={100} fill={C.blue} p={k(to, 56.96, 0.45)} mode="wipe" />
      </div>
    </>
  );
};

// ——— 10 · a regra (pessoa à esquerda) ———
export const Rule: React.FC<P> = ({ to }) => {
  const g = win(to, 57.92, 62.08, 0.45);
  if (g <= 0) return null;
  const o = 1 - kout(to, 62.08, 0.26);
  return (
    <Glass x={940} y={100} w={880} h={760} o={o} p={k(to, 57.92, 0.45)}>
      <div style={{ position: "absolute", left: 56, top: 36, right: 56, display: "flex", flexDirection: "column", gap: 2 }}>
        <Big text="NÃO" size={230} fill={C.red} p={k(to, 57.92, 0.4)} mode="slam" />
        <div style={{ display: "flex", gap: 22 }}>
          <Big text="VENDAS" size={118} p={k(to, 58.24)} />
          <Big text="SOLUÇÕES" size={118} p={k(to, 58.96)} />
        </div>
        <Wide size={30} color={C.ink2} p={k(to, 59.68)} style={{ marginTop: 8, marginBottom: 4 }}>
          antes de
        </Wide>
        <Big text="COMPREENDERES" size={118} fill={C.sky} p={k(to, 60.16, 0.45)} mode="wipe" />
        <Big text="O REAL PROBLEMA" size={118} fill={C.blue} p={k(to, 61.04, 0.45)} mode="slam" />
      </div>
    </Glass>
  );
};

// ——— 11 · guarda isto (pessoa à direita) ———
const W8: React.FC<{ to: number; at: number; children: string; color?: string }> = ({ to, at, children, color = C.ink }) => {
  const p = k(to, at, 0.35);
  return (
    <span style={{ display: "inline-block", fontFamily: C.ui, fontWeight: 800, fontSize: 58, letterSpacing: "-0.02em", color, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 14}px)`, filter: p < 0.97 ? `blur(${(1 - p) * 6}px)` : undefined }}>{children}</span>
  );
};
export const Keep: React.FC<P> = ({ to }) => {
  const g = win(to, 62.08, 67.95, 0.45);
  if (g <= 0) return null;
  const o = 1 - kout(to, 67.95, 0.3);
  return (
    <>
      <Glass x={90} y={110} w={560} h={120} r={60} o={o} p={k(to, 62.32, 0.45)}>
        <div style={{ position: "absolute", left: 26, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 20 }}>
          <Orb d="bookmark" color={C.blue} size={70} p={k(to, 62.32, 0.5)} />
          <Big text="GUARDA ISTO" size={96} fill={C.blue} p={k(to, 62.32, 0.4)} mode="slam" />
        </div>
      </Glass>
      <Glass x={90} y={262} w={900} h={590} o={o} p={k(to, 63.2, 0.5)}>
        <div style={{ position: "absolute", left: 50, top: 44, right: 50, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 16 }}>
            <W8 to={to} at={63.2}>Quem</W8>
            <W8 to={to} at={63.52} color={C.sky}>
              compreende
            </W8>
            <W8 to={to} at={64.08}>melhor</W8>
          </div>
          <div style={{ display: "flex", columnGap: 16 }}>
            <W8 to={to} at={64.4}>o</W8>
            <W8 to={to} at={64.56} color={C.blue}>
              problema
            </W8>
            <W8 to={to} at={65.28}>tem</W8>
          </div>
          <div style={{ marginTop: 12, opacity: k(to, 65.28), transform: `translateY(${(1 - k(to, 65.28)) * -10}px)` }}>
            <Ico d="down" size={40} color={C.green} sw={2.6} />
          </div>
          <Big text="VANTAGENS" size={130} fill={C.green} p={k(to, 65.6, 0.45)} mode="slam" />
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Big text="ENORMES" size={130} fill={C.green} p={k(to, 66.24, 0.45)} mode="slam" />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Orb d="handshake" color={C.green} size={62} p={k(to, 66.8, 0.5)} />
              <Wide size={20} color={C.ink2} p={k(to, 66.8)}>
                na hora da
                <br />
                negociação
              </Wide>
            </div>
          </div>
        </div>
      </Glass>
    </>
  );
};

