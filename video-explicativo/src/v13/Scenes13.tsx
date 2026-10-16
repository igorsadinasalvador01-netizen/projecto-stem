import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { clamp, Enter, EZ, Glass, Kinetic, KW, SP, useClock } from "../kit/Kit";
import { Acacia, Cow, feet, Fence, FieldCard, Ground, Lion, Rock, Sky, T13 as T } from "./Art13";

type Row = Parameters<typeof Kinetic>[0]["rows"][number];
export const serif = (words: KW[], size = 96, color: string = T.ink, italic = false): Row => ({ words, size, font: T.serif, color, weight: 600, italic, spacing: "-0.02em" });
export const label = (words: KW[], size = 30, color: string = T.gold): Row => ({ words, size, font: T.sans, color, weight: 700, spacing: "0.18em" });
export const Title: React.FC<{ rows: Row[]; out: number; offset: number; x?: number; y?: number; align?: "center" | "flex-start"; w?: number }> = ({ rows, out, offset, x = 110, y = 110, align = "flex-start", w = 900 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <Kinetic offset={offset} out={out} rows={rows} align={align} />
  </div>
);
const Pill: React.FC<{ children: React.ReactNode; color?: string; p: number; x: number; y: number; size?: number }> = ({ children, color = T.gold, p, x, y, size = 34 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${0.8 + p * 0.2})` }}>
    <Glass tint={T.glass} edge={T.edge} radius={999} style={{ padding: `${size * 0.36}px ${size * 0.8}px` }}>
      <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap" }}>{children}</span>
    </Glass>
  </div>
);

// ——— 1 · abertura: "uma história natural" ———
export const S1: React.FC = () => {
  const { sp } = useClock(0);
  const h = sp(1.76, SP.pop);
  const c = sp(2.48, SP.pop);
  return (
    <Enter kind="none">
      <Sky />
      <Acacia w={520} style={{ position: "absolute", left: 1300, top: 516 }} />
      <Ground />
      <Title offset={0} out={3.0} x={0} w={1920} y={170} align="center" rows={[label([{ w: "VENDEDORES · UMA HISTÓRIA NATURAL", at: 0.08 }], 26), serif([{ w: "Vendedor", at: 0.08 }, { w: "é igual a", at: 0.56 }, { w: "bicho.", at: 0.96, color: T.gold, italic: true }], 120)]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 390, display: "flex", justifyContent: "center", gap: 60 }}>
        {[
          { p: h, t: "HERBÍVORO", c: T.olive },
          { p: c, t: "CARNÍVORO", c: T.amber },
        ].map((b) => (
          <div key={b.t} style={{ opacity: b.p, transform: `translateY(${(1 - b.p) * 40}px) scale(${0.7 + b.p * 0.3})` }}>
            <Glass tint={T.glass} edge={T.edge} radius={999} glow={`${b.c}66`} style={{ padding: "18px 46px" }}>
              <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 44, letterSpacing: "0.16em", color: b.c }}>{b.t}</span>
            </Glass>
          </div>
        ))}
      </div>
    </Enter>
  );
};

// ——— 2 · a vaca: pasta dentro da cerca, come o que plantaram ———
export const S2: React.FC = () => {
  const off = 3.0;
  const { t, sp, ez } = useClock(off);
  const graze = 0.5 + 0.5 * Math.sin(t * 2.2);
  const fence = ez(7.3, 7.8);
  const planted = (k: number) => sp(10.16 + k * 0.06, SP.snap);
  const card = sp(3.9, SP.soft);
  return (
    <Enter kind="blur">
      <Sky sunX={30} />
      <Ground />
      {/* capim plantado em fileiras */}
      {Array.from({ length: 12 }).map((_, k) => (
        <svg key={k} width={60} height={50} viewBox="0 0 60 50" style={{ position: "absolute", left: 640 + (k % 6) * 120, top: 858 + Math.floor(k / 6) * 46, opacity: planted(k), transform: `scale(${planted(k)})`, transformOrigin: "50% 100%" }}>
          <path d="M10 50 Q14 20 18 6 Q20 26 24 50 M26 50 Q32 16 38 2 Q38 28 42 50 M42 50 Q46 24 52 12 Q52 32 54 50Z" fill={T.olive} />
        </svg>
      ))}
      <Cow w={560} graze={graze} style={{ position: "absolute", left: 640, top: feet("cow", 560, 870) }} />
      <Fence x={380} y={762} w={1160} glow={fence} />
      <Title offset={off} out={6.5} rows={[serif([{ w: "Imagina", at: 3.04 }, { w: "uma vaca.", at: 3.52, color: T.gold, italic: true }], 104), serif([{ w: "Cabeça baixa,", at: 4.88 }, { w: "comendo capim.", at: 5.6 }], 60, T.dim)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "Ela não", at: 8.08 }, { w: "escolhe", at: 8.4, color: T.red, italic: true }], 104), serif([{ w: "come o que", at: 9.44 }, { w: "plantaram", at: 10.16, color: T.olive, italic: true }], 64, T.dim)]} />
      <FieldCard title="FICHA DE CAMPO · 01" p={card} x={1320} y={110} rows={[["Espécie", "Vaca"], ["Habitat", "dentro da cerca", fence > 0.5 ? T.gold : undefined], ["Dieta", "o que plantaram", T.olive]]} />
    </Enter>
  );
};

// ——— 3 · o capim acaba: emagrece e morre no mesmo lugar ———
export const S3: React.FC = () => {
  const off = 10.8;
  const { t, sp, ez } = useClock(off);
  const gone = ez(11.2, 12.0);
  const thin = ez(12.9, 13.8);
  const dusk = ez(13.6, 16.2);
  const pin = sp(14.56, SP.pop);
  const energy = interpolate(t, [11.2, 15.8], [0.8, 0.08], { easing: EZ.inOut, ...clamp });
  return (
    <Enter kind="none">
      <Sky sunX={30} dusk={dusk} />
      <Ground />
      {Array.from({ length: 12 }).map((_, k) => (
        <svg key={k} width={60} height={50} viewBox="0 0 60 50" style={{ position: "absolute", left: 640 + (k % 6) * 120, top: 858 + Math.floor(k / 6) * 46, opacity: 1 - gone, transform: `scale(${1 - gone * (0.6 + random(`g${k}`) * 0.4)})`, transformOrigin: "50% 100%" }}>
          <path d="M10 50 Q14 20 18 6 Q20 26 24 50 M26 50 Q32 16 38 2 Q38 28 42 50 M42 50 Q46 24 52 12 Q52 32 54 50Z" fill={T.olive} />
        </svg>
      ))}
      <Cow w={560} graze={0.3 + 0.2 * Math.sin(t)} thin={thin} color={`rgb(${28 + dusk * 30},${18 + dusk * 24},${16 + dusk * 24})`} style={{ position: "absolute", left: 640, top: feet("cow", 560, 870), opacity: 1 - dusk * 0.4 }} />
      <Fence x={380} y={762} w={1160} />
      <Title offset={off} out={12.8} rows={[serif([{ w: "Se o capim", at: 10.88 }, { w: "acaba…", at: 11.44, color: T.red, italic: true }], 104)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "Ela", at: 12.8 }, { w: "emagrece", at: 12.96, color: T.red, italic: true }], 104), serif([{ w: "e morre no", at: 13.84 }, { w: "mesmo lugar.", at: 14.56, color: T.gold, italic: true }], 64, T.dim)]} />
      {/* energia a cair */}
      <div style={{ position: "absolute", left: 1320, top: 120, width: 480 }}>
        <Glass tint={T.glass} edge={T.edge} radius={24} style={{ padding: "22px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.sans, fontWeight: 700, fontSize: 20, letterSpacing: "0.2em", color: T.gold }}>
            <span>ENERGIA</span>
            <span style={{ color: energy < 0.3 ? T.red : T.ink }}>{Math.round(energy * 100)}%</span>
          </div>
          <div style={{ marginTop: 14, height: 16, borderRadius: 8, background: "rgba(246,241,232,0.15)", overflow: "hidden" }}>
            <div style={{ width: `${energy * 100}%`, height: "100%", borderRadius: 8, background: energy < 0.3 ? T.red : T.olive }} />
          </div>
        </Glass>
      </div>
      {/* "mesmo lugar" */}
      <div style={{ position: "absolute", left: 880, top: 440, opacity: pin, transform: `translateY(${(1 - pin) * -60}px)` }}>
        <svg width={80} height={110} viewBox="0 0 24 33">
          <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 33 12 33s12-12.5 12-21.3C24 5.2 18.6 0 12 0z" fill={T.gold} />
          <circle cx={12} cy={11.5} r={4.5} fill={T.night} />
        </svg>
      </div>
    </Enter>
  );
};

// ——— 4 · o leão escolhe: olha o rebanho e decide ———
export const S4: React.FC = () => {
  const off = 16.4;
  const { t, sp, ez } = useClock(off);
  const lion = sp(16.9, SP.heavy);
  const scan = ez(20.0, 21.0);
  const lock = sp(21.04, SP.pop);
  const target = 3;
  return (
    <Enter kind="wipe">
      <Sky sunX={27} sunY={50} />
      <Acacia w={300} color="#4E443C" style={{ position: "absolute", left: 1600, top: 640 }} />
      <Ground />
      {/* rebanho ao longe (cor da atmosfera) */}
      {Array.from({ length: 7 }).map((_, k) => (
        <div key={k} style={{ position: "absolute", left: 1000 + k * 118 + Math.sin(t + k) * 4, top: feet("cow", 110, 846) - (k % 2) * 10 }}>
          <Cow w={110} graze={0.5 + 0.5 * Math.sin(t * 2 + k)} color={k === target && lock > 0.5 ? "#6E2A22" : "#4E443C"} />
        </div>
      ))}
      {/* mira a varrer o rebanho */}
      {scan > 0.01 && (
        <div style={{ position: "absolute", left: 1000 + (lock > 0.5 ? target * 118 : interpolate(scan, [0, 1], [0, 6]) * 118), top: 772 - (lock > 0.5 ? (target % 2) * 10 : 0), width: 110, height: 110, opacity: 0.95 }}>
          <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: `scale(${1 + (1 - lock) * 0.2}) rotate(${(1 - lock) * 45}deg)` }}>
            <circle cx={55} cy={55} r={44} fill="none" stroke={lock > 0.5 ? T.red : T.ink} strokeWidth={4} />
            <path d="M55 2v20M55 88v20M2 55h20M88 55h20" stroke={lock > 0.5 ? T.red : T.ink} strokeWidth={4} strokeLinecap="round" />
          </svg>
        </div>
      )}
      <Rock w={760} style={{ position: "absolute", left: 60, top: 518 }} />
      <Lion w={520} roar={0} style={{ position: "absolute", left: 180, top: 331 + (1 - lion) * 40, opacity: lion }} />
      <Title offset={off} out={19.0} rows={[serif([{ w: "Agora,", at: 16.56 }, { w: "o leão.", at: 17.12, color: T.amber, italic: true }], 112), serif([{ w: "Leão é", at: 18.0 }, { w: "diferente.", at: 18.48 }], 64, T.dim)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "O leão", at: 18.96 }, { w: "escolhe.", at: 19.36, color: T.amber, italic: true }], 112), serif([{ w: "olha o rebanho", at: 20.0 }, { w: "e decide", at: 20.88 }], 64, T.dim)]} />
      <FieldCard title="FICHA DE CAMPO · 02" p={sp(17.4, SP.soft)} x={1320} y={110} accent={T.amber} rows={[["Espécie", "Leão"], ["Habitat", "onde houver presa", T.amber], ["Dieta", "escolhe a presa", lock > 0.5 ? T.red : undefined]]} />
    </Enter>
  );
};

// ——— 5 · mapa: ataca dentro da cerca; quando a presa acaba, sai e caça lá fora ———
const P0 = [310, 340], P1 = [850, -60], P2 = [1390, 350];
const bez = (u: number) => [0, 1].map((i) => (1 - u) * (1 - u) * P0[i] + 2 * (1 - u) * u * P1[i] + u * u * P2[i]);
const Herd: React.FC<{ k: number; on: number; flash?: number }> = ({ k, on, flash = 0 }) => (
  <div style={{ width: 70, height: 70, borderRadius: 35, background: on > 0.5 ? "rgba(142,154,91,0.95)" : "rgba(142,154,91,0.12)", border: `2px solid ${flash > 0 ? T.red : "rgba(246,241,232,0.35)"}`, boxShadow: on > 0.5 ? "0 0 22px rgba(142,154,91,0.7)" : "none", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.85 + on * 0.15 + flash * 0.3})` }}>
    <Cow w={50} color={on > 0.5 ? T.night : "rgba(246,241,232,0.18)"} graze={Math.sin(k)} />
  </div>
);
export const S5: React.FC = () => {
  const off = 22.9;
  const { t, sp, ez } = useClock(off);
  const map = sp(23.0, SP.soft);
  const attack = ez(24.9, 25.4, 0, 1, EZ.out);
  const route = ez(27.9, 29.8, 0, 1, EZ.inOut);
  const hunt = sp(29.68, SP.pop);
  const [bx, by] = bez(route);
  const lx = route > 0 ? bx : 310;
  const ly = route > 0 ? by : interpolate(attack, [0, 1], [640, 340]);
  return (
    <Enter kind="zoom">
      <AbsoluteFill style={{ background: `radial-gradient(1300px 820px at 50% 45%, #5C4A3C, ${T.night})` }} />
      <div style={{ position: "absolute", left: 110, top: 220, width: 1700, height: 720, opacity: map, transform: `perspective(1800px) rotateX(${(1 - map) * 30 + 14}deg)`, transformOrigin: "50% 100%" }}>
        <Glass tint="rgba(28,24,21,0.55)" edge={T.edge} radius={30} style={{ position: "absolute", inset: 0 }}>
          {/* relevo: manchas de vegetação e curvas de nível */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(420px 260px at 18% 48%, rgba(142,154,91,0.28), transparent 70%), radial-gradient(380px 260px at 82% 50%, rgba(142,154,91,0.22), transparent 70%), radial-gradient(500px 300px at 50% 90%, rgba(200,135,78,0.16), transparent 70%)" }} />
          <svg width={1700} height={720} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M -20 ${120 + i * 120} C 400 ${60 + i * 130}, 900 ${200 + i * 110}, 1720 ${100 + i * 125}`} stroke="rgba(240,225,200,0.35)" strokeWidth={1.5} fill="none" />
            ))}
          </svg>
          {/* a cerca (território conhecido) */}
          <div style={{ position: "absolute", left: 90, top: 140, width: 440, height: 400, border: `5px dashed ${T.gold}`, borderRadius: 30, boxShadow: `0 0 30px rgba(217,178,106,0.25), inset 0 0 30px rgba(217,178,106,0.15)` }} />
          <div style={{ position: "absolute", left: 110, top: 96, fontFamily: T.sans, fontWeight: 700, fontSize: 26, letterSpacing: "0.18em", color: T.gold }}>DENTRO DA CERCA</div>
          {Array.from({ length: 9 }).map((_, k) => {
            const gone = ez(25.4 + k * 0.2, 25.55 + k * 0.2);
            return (
              <div key={k} style={{ position: "absolute", left: 140 + (k % 3) * 120 + Math.sin(t * 2 + k) * 3, top: 190 + Math.floor(k / 3) * 110 }}>
                <Herd k={k} on={1 - gone} flash={gone > 0 && gone < 1 ? 1 - gone : 0} />
              </div>
            );
          })}
          {/* território novo, lá fora */}
          <div style={{ position: "absolute", left: 1180, top: 160, width: 420, height: 380, borderRadius: "50%", border: `3px solid ${T.amber}`, opacity: 0.35 + route * 0.65, boxShadow: route > 0.9 ? `0 0 ${40 * hunt}px ${T.amber}` : "none" }} />
          {Array.from({ length: 6 }).map((_, k) => (
            <div key={k} style={{ position: "absolute", left: 1235 + (k % 3) * 110, top: 230 + Math.floor(k / 3) * 120, opacity: route, transform: `scale(${0.6 + route * 0.4})` }}>
              <Herd k={k} on={1} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 1270, top: 110, fontFamily: T.sans, fontWeight: 700, fontSize: 26, letterSpacing: "0.18em", color: T.amber, opacity: 0.35 + route * 0.65 }}>LÁ FORA</div>
          {/* rota do leão */}
          <svg width={1700} height={720} style={{ position: "absolute", inset: 0 }}>
            <path d={`M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} stroke="rgba(200,135,78,0.25)" strokeWidth={4} fill="none" strokeDasharray="12 14" />
            <path d={`M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} stroke={T.amber} strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${route} 1`} strokeLinecap="round" />
          </svg>
          {/* anel de ataque */}
          <div style={{ position: "absolute", left: 310 - 120, top: 340 - 120, width: 240, height: 240, borderRadius: 120, border: `4px solid ${T.red}`, opacity: attack * (1 - ez(25.6, 26.4)), transform: `scale(${0.4 + attack * 0.8})` }} />
          <div style={{ position: "absolute", left: lx - 46, top: ly - 46, width: 92, height: 92, borderRadius: 46, background: T.amber, boxShadow: `0 0 44px ${T.amber}, 0 0 0 6px rgba(246,241,232,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + hunt * 0.12 + attack * (1 - ez(25.4, 25.9)) * 0.25})` }}>
            <Lion w={70} color={T.night} />
          </div>
        </Glass>
      </div>
      <Title offset={off} out={26.0} x={110} y={70} rows={[serif([{ w: "Se tem rebanho na cerca,", at: 22.96 }, { w: "ataca ali.", at: 25.12, color: T.amber, italic: true }], 66)]} w={1700} />
      <Title offset={off} out={99} x={110} y={70} rows={[serif([{ w: "Se a presa acaba,", at: 26.16 }, { w: "sai da cerca", at: 28.88, color: T.amber, italic: true }, { w: "e caça lá fora.", at: 29.52 }], 66)]} w={1700} />
    </Enter>
  );
};

// ——— 6 · erra a maioria das caçadas, não para de existir — não tem geladeira ———
export const S6: React.FC = () => {
  const off = 30.4;
  const { t, sp } = useClock(off);
  const fridge = sp(34.4, SP.pop);
  const tries = ["✕", "✕", "✕", "✕", "✕", "✓"];
  return (
    <Enter kind="slide">
      <Sky sunX={80} sunY={70} dusk={0.35} />
      <Ground />
      <Title offset={off} out={33.5} rows={[serif([{ w: "Erra a maioria", at: 30.48 }, { w: "das caçadas…", at: 31.36 }], 96), serif([{ w: "mas não para", at: 32.16, color: T.amber, italic: true }], 96)]} />
      <div style={{ position: "absolute", left: 110, top: 455, display: "flex", gap: 20 }}>
        {tries.map((x, k) => {
          const p = sp(30.7 + k * 0.4, SP.pop);
          const ok = x === "✓";
          return (
            <div key={k} style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.6 + p * 0.4})` }}>
              <Glass tint={ok ? "rgba(142,154,91,0.28)" : T.glass} edge={T.edge} radius={24} glow={ok ? "rgba(142,154,91,0.6)" : undefined} style={{ width: 150, height: 176, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 76, lineHeight: 1, color: ok ? "#B8C08A" : "#D9776A" }}>{x}</span>
                <span style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 22, marginTop: 10, color: T.ink }}>caça {k + 1}</span>
              </Glass>
            </div>
          );
        })}
      </div>
      <Title offset={off} out={99} x={1000} y={160} w={820} rows={[serif([{ w: "Porque o leão", at: 33.6 }], 72), serif([{ w: "não tem geladeira.", at: 34.32, color: T.gold, italic: true }], 84)]} />
      {/* geladeira vazia, riscada */}
      <div style={{ position: "absolute", left: 1290, top: 420, opacity: fridge, transform: `scale(${0.7 + fridge * 0.3}) rotate(${(1 - fridge) * 8}deg)` }}>
        <svg width={260} height={360} viewBox="0 0 100 140">
          <rect x={10} y={4} width={80} height={132} rx={10} fill="rgba(246,241,232,0.14)" stroke={T.ink} strokeWidth={3} />
          <path d="M10 48h80M22 18v18M22 62v24" stroke={T.ink} strokeWidth={3} strokeLinecap="round" />
          <path d="M0 140L100 0" stroke={T.red} strokeWidth={7} strokeLinecap="round" opacity={fridge} />
        </svg>
      </div>
      <Lion w={340} style={{ position: "absolute", left: 160 + (t - 30.4) * 70, top: feet("lion", 340, 870) - Math.abs(Math.sin(t * 5)) * 6 }} />
    </Enter>
  );
};

// ——— 7 · quando o leão aparece, todos mudam; ninguém muda por causa da vaca ———
export const S7: React.FC = () => {
  const off = 35.2;
  const { t, sp, ez } = useClock(off);
  const lion = sp(36.1, SP.heavy);
  const flee = ez(37.6, 38.8, 0, 1, EZ.out);
  const cow = sp(40.6, SP.soft);
  const lionOut = ez(39.0, 39.5);
  return (
    <Enter kind="blur">
      <Sky sunX={50} sunY={60} />
      <Ground />
      {Array.from({ length: 8 }).map((_, k) => {
        const dir = k < 4 ? -1 : 1;
        const x = 300 + k * 170;
        return (
          <div key={k} style={{ position: "absolute", left: x + dir * flee * (420 + k * 40) * (1 - cow), top: feet("cow", 150, 870) - (k % 2) * 10, transform: `scaleX(${flee > 0.2 && cow < 0.5 ? -dir : 1})` }}>
            <Cow w={150} graze={cow > 0.5 || flee < 0.1 ? 0.5 + 0.5 * Math.sin(t * 2 + k) : -0.4} />
          </div>
        );
      })}
      <Lion w={560} roar={sp(36.2, SP.pop) * (1 - lionOut)} style={{ position: "absolute", left: 680, top: feet("lion", 560, 870) + (1 - lion) * 60 + lionOut * 60, opacity: lion * (1 - lionOut) }} />
      <div style={{ position: "absolute", left: 760, top: feet("cow", 380, 870), opacity: cow }}>
        <Cow w={380} graze={0.5 + 0.5 * Math.sin(t * 2)} color="#3A322C" />
      </div>
      <Title offset={off} out={39.1} rows={[serif([{ w: "Quando o leão", at: 35.68 }, { w: "aparece,", at: 36.16, color: T.amber, italic: true }], 96), serif([{ w: "todos mudam de", at: 37.52 }, { w: "comportamento.", at: 38.64, color: T.gold }], 60, T.dim)]} />
      <Title offset={off} out={99} rows={[serif([{ w: "Ninguém muda", at: 39.2 }], 96), serif([{ w: "por causa de", at: 40.48 }, { w: "uma vaca.", at: 40.96, color: T.olive, italic: true }], 72, T.dim)]} />
      <Pill p={sp(38.64, SP.pop) * (1 - lionOut)} x={1380} y={240} color={T.red} size={30}>
        ALERTA NO REBANHO
      </Pill>
    </Enter>
  );
};

// ——— 11 · high ticket: nada de tirador de pedido nem atendente de bar ———
export const S11: React.FC = () => {
  const off = 64.5;
  const { t, sp } = useClock(off);
  const gem = sp(66.08, SP.pop);
  const pad = sp(67.2, SP.pop);
  const bar = sp(69.04, SP.pop);
  return (
    <Enter kind="zoom">
      <Sky sunX={50} sunY={66} dusk={0.2} />
      <Ground />
      <Lion w={460} style={{ position: "absolute", left: 1340, top: feet("lion", 460, 870) }} />
      <Title offset={off} out={99} rows={[serif([{ w: "Principalmente", at: 64.56 }, { w: "no high ticket.", at: 66.08, color: T.gold, italic: true }], 84)]} />
      {/* selo high ticket */}
      <div style={{ position: "absolute", left: 140, top: 380, opacity: gem, transform: `scale(${0.6 + gem * 0.4}) rotate(${(1 - gem) * -15}deg)` }}>
        <Glass tint="rgba(217,178,106,0.22)" edge={T.edge} radius={999} glow={`${T.gold}aa`} style={{ padding: "18px 44px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: T.sans, fontWeight: 700, fontSize: 40, letterSpacing: "0.12em", color: T.gold }}>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth={1.8} strokeLinejoin="round" style={{ transform: `rotate(${Math.sin(t * 2) * 8}deg)` }}>
              <path d="M6 3h12l4 6-10 12L2 9z" fill="rgba(217,178,106,0.3)" />
              <path d="M2 9h20M9 3l3 18 3-18" />
            </svg>
            HIGH TICKET
          </span>
        </Glass>
      </div>
      {[
        { p: pad, t: "tirador de pedido", y: 540 },
        { p: bar, t: "atendente de bar", y: 690 },
      ].map((x) => (
        <div key={x.t} style={{ position: "absolute", left: 140, top: x.y, opacity: x.p, transform: `translateX(${(1 - x.p) * -40}px)` }}>
          <Glass tint="rgba(194,90,78,0.14)" edge={T.edge} radius={24} style={{ padding: "18px 34px" }}>
            <span style={{ position: "relative", fontFamily: T.serif, fontStyle: "italic", fontWeight: 600, fontSize: 58, color: T.ink }}>
              {x.t}
              <span style={{ position: "absolute", left: -6, right: -6, top: "55%", height: 6, borderRadius: 3, background: T.red, transform: `scaleX(${interpolate(x.p, [0.4, 1], [0, 1], clamp)})`, transformOrigin: "left" }} />
            </span>
          </Glass>
        </div>
      ))}
    </Enter>
  );
};
