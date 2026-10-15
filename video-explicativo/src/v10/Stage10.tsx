import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp } from "../components/Motion";
import { BrainIcon, CheckIcon, Chip, Headline, HookIcon, Paper, Spark, StarIcon, TargetIcon, useClock } from "./Kit10";
import { EASE, F10, P10, SPR } from "./look10";
import { W10 as W } from "./timeline10";

// O mesmo palco do gancho até à escolha (0–23,6 s): os dois cartões evoluem com a voz.
const CW = 440;
const CH = 820;
const TOP = 480;
const DECOY_X = 300; // centro do cartão da opção barata
const MAIN_X = 780; // centro do produto que você quer vender

const ROWS = [
  { l: "Aulas passo a passo", p: true },
  { l: "Suporte individual", p: true },
  { l: "Certificado", p: true },
  { l: "Comunidade", p: false },
  { l: "Material em PDF", p: false },
  { l: "Bônus de templates", p: false },
];
const ROW_H = 66;
const REMOVE = [14.5, 14.88, 15.26]; // retirar os 3 principais da opção barata

type Tone = "gray" | "turq" | "coral" | "lime";
const TONE: Record<Tone, [string, string]> = {
  gray: [P10.mist, P10.grayDeep],
  turq: [P10.turqSoft, P10.turqDeep],
  coral: [P10.coralSoft, P10.coral],
  lime: [P10.limeSoft, "#0A9A5B"],
};

type CardProps = {
  x: number;
  scale: number;
  rot?: number;
  lift?: number;
  tag: string;
  name: string;
  price: number;
  hero: boolean;
  show: number;
  fill: number;
  dash: number;
  header: number;
  rowIn: number[];
  strike: number[];
  fly: number[];
  collapse: number[];
  count: { n: number; p: number; tone: Tone; pop?: number };
  ring: number;
  dim: number;
  cover: number; // capa do produto (1) → recolhe quando se listam os benefícios (0)
  ghost?: number[]; // lugar vazio "retirado" onde estava um benefício principal
  sub: string;
  children?: React.ReactNode;
};
const Card: React.FC<CardProps> = ({ x, scale, rot = 0, lift = 0, tag, name, price, hero, show, fill, dash, header, rowIn, strike, fly, collapse, count, ring, dim, cover, ghost = [0, 0, 0], sub, children }) => {
  let y = 334;
  const [cbg, cfg] = TONE[count.tone];
  return (
    <div style={{ position: "absolute", left: x - CW / 2, top: TOP, width: CW, height: CH, transform: `translateY(${lift}px) rotate(${rot}deg) scale(${scale})`, transformOrigin: "50% 0%", opacity: show }}>
      {/* contorno tracejado: a opção a nascer */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 38, border: `3px dashed ${P10.line2}`, opacity: dash * (1 - fill) }} />
      {/* anel turquesa: o produto que você quer vender */}
      <div style={{ position: "absolute", inset: -8, borderRadius: 46, border: `4px solid ${P10.turq}`, opacity: ring, boxShadow: `0 0 60px ${P10.turq}55, 0 0 120px ${P10.turq}22` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 38,
          background: "#FFFFFF",
          border: `1.5px solid ${P10.line}`,
          boxShadow: "0 50px 90px -40px rgba(11,13,18,0.32), 0 10px 26px -14px rgba(11,13,18,0.16)",
          opacity: fill,
          overflow: "hidden",
          filter: `saturate(${1 - dim}) brightness(${1 - dim * 0.03})`,
        }}
      >
        {hero && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 8, background: `linear-gradient(90deg, ${P10.turq}, ${P10.turqLight})` }} />}
        <div style={{ position: "absolute", left: 34, top: 36, fontFamily: F10.mono, fontSize: 20, letterSpacing: "0.14em", color: hero ? P10.turqDeep : P10.gray }}>{tag}</div>
        <div style={{ position: "absolute", left: 34, top: 68, fontFamily: F10.display, fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: P10.ink }}>{name}</div>
        <div style={{ position: "absolute", left: 34, top: 122, display: "flex", alignItems: "baseline", gap: 10, fontFamily: F10.display, color: P10.ink, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: 34, fontWeight: 600, color: P10.grayDeep }}>R$</span>
          <span style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{price}</span>
        </div>
        <div style={{ position: "absolute", left: 34, right: 34, top: 270, height: 1.5, background: P10.line }} />
        {cover > 0.001 && <Cover hero={hero} name={name} sub={sub} p={cover} />}
        <div style={{ position: "absolute", left: 34, top: 292, fontFamily: F10.mono, fontSize: 18, letterSpacing: "0.14em", color: P10.gray, opacity: header, transform: `translateY(${(1 - header) * 10}px)` }}>BENEFÍCIOS</div>
        {ROWS.map((r, k) => {
          const top = y;
          y += ROW_H * (1 - collapse[k]);
          const inP = rowIn[k];
          if (inP <= 0.001) return null;
          const fl = fly[k];
          const st = strike[k];
          const gh = k < 3 ? ghost[k] : 0;
          return (
            <React.Fragment key={k}>
            {gh > 0.001 && (
              <div style={{ position: "absolute", left: 22, right: 22, top, height: 58, borderRadius: 14, border: `2.5px dashed ${P10.coral}66`, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", opacity: gh, fontFamily: F10.display, fontSize: 22, fontStyle: "italic", color: P10.coral }}>
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={P10.coral} strokeWidth={2.4} strokeLinecap="round">
                  <path d="M5 12h14" />
                </svg>
                retirado
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: 22,
                right: 22,
                top,
                height: 58,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 12px",
                borderRadius: 14,
                background: `rgba(255,228,233,${st * 0.9})`,
                opacity: interpolate(inP, [0, 0.5], [0, 1], clamp) * (1 - fl),
                transform: `translate(${(1 - inP) * -26 - fl * 70}px, ${fl * fl * 460}px) rotate(${-fl * 12}deg)`,
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 17, flexShrink: 0, background: st > 0.5 ? P10.coral : r.p ? (hero ? P10.turq : P10.grayDeep) : P10.mist, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckIcon s={20} c={r.p || st > 0.5 ? "#fff" : P10.gray} />
              </div>
              <div style={{ fontFamily: F10.display, fontSize: 25, fontWeight: r.p ? 600 : 500, color: r.p ? P10.ink : P10.grayDeep, whiteSpace: "nowrap" }}>{r.l}</div>
              {r.p && (
                <div style={{ marginLeft: "auto" }}>
                  <StarIcon s={24} />
                </div>
              )}
              <div style={{ position: "absolute", left: 58, right: 16, top: 28, height: 3.5, borderRadius: 2, background: P10.coral, transform: `scaleX(${st})`, transformOrigin: "left" }} />
            </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 34, bottom: 30, opacity: count.p, transform: `translateY(${(1 - count.p) * 16}px) scale(${1 + (count.pop ?? 0) * 0.12})`, transformOrigin: "left center" }}>
          <Chip bg={cbg} color={cfg} size={24}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{count.n}</span> benefícios
          </Chip>
        </div>
      </div>
      {children}
    </div>
  );
};

// capa do produto (antes de se listarem os benefícios): o cartão nunca fica vazio
const Cover: React.FC<{ hero: boolean; name: string; sub: string; p: number }> = ({ hero, name, sub, p }) => {
  const { t } = useClock(0);
  const c1 = hero ? P10.turq : "#A7B1BD";
  const c2 = hero ? P10.turqDeep : P10.grayDeep;
  return (
    <div style={{ position: "absolute", left: 26, right: 26, top: 300, height: 470, borderRadius: 26, overflow: "hidden", background: `linear-gradient(150deg, ${c1}, ${c2})`, opacity: p, transform: `scaleY(${0.4 + p * 0.6})`, transformOrigin: "50% 0%" }}>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: "absolute", left: 250 - k * 30, top: -60 + k * 40, width: 260 + k * 120, height: 260 + k * 120, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.22)", transform: `rotate(${t * 8 + k * 30}deg)` }} />
      ))}
      <div style={{ position: "absolute", left: "50%", top: 150, width: 108, height: 108, marginLeft: -54, borderRadius: 54, background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(t * 2.4) * 0.03})` }}>
        <div style={{ width: 0, height: 0, marginLeft: 8, borderLeft: "34px solid #fff", borderTop: "21px solid transparent", borderBottom: "21px solid transparent" }} />
      </div>
      <div style={{ position: "absolute", left: 26, bottom: 64, fontFamily: F10.display, fontWeight: 800, fontSize: 34, letterSpacing: "-0.02em", color: "#fff" }}>{name}</div>
      <div style={{ position: "absolute", left: 26, bottom: 30, fontFamily: F10.mono, fontSize: 18, letterSpacing: "0.1em", color: "rgba(255,255,255,0.85)" }}>{sub}</div>
    </div>
  );
};

// cliente: rosto minimalista, os olhos comparam as duas opções
const Avatar: React.FC<{ look: number; happy: number }> = ({ look, happy }) => (
  <svg width={190} height={190} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={48} fill="#FFFFFF" stroke={P10.line2} strokeWidth={1.5} />
    <clipPath id="av10">
      <circle cx={50} cy={50} r={47} />
    </clipPath>
    <g clipPath="url(#av10)">
      <path d="M14 104c2-20 17-30 36-30s34 10 36 30z" fill="#B8C2CD" />
      <circle cx={50} cy={44} r={21} fill="#D5DCE3" />
      <ellipse cx={42} cy={43} rx={4.6} ry={5.2} fill="#fff" />
      <ellipse cx={58} cy={43} rx={4.6} ry={5.2} fill="#fff" />
      <circle cx={42 + look * 2.4} cy={43.5} r={2.5} fill={P10.ink} />
      <circle cx={58 + look * 2.4} cy={43.5} r={2.5} fill={P10.ink} />
      <path d={`M43 ${53 - happy} Q50 ${56 + happy * 3} 57 ${53 - happy}`} stroke={P10.inkSoft} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

export const Stage10: React.FC = () => {
  const { t, sp, ez } = useClock(0);

  // ——— 1 · o produto sozinho no centro; depois vai para o seu lugar ———
  const mainIn = sp(0.08, SPR.soft);
  const toSlot = ez(W.crie, W.crie + 0.62);
  const mainX = 540 + (MAIN_X - 540) * toSlot;
  const mainScale = 1.1 - 0.1 * toSlot;
  const meterIn = sp(W.parecer, SPR.snap) * (1 - ez(W.crie - 0.05, W.crie + 0.2, 0, 1, EASE.in));
  const knob = ez(W.barato - 0.05, W.barato + 0.5, 0.1, 0.88, EASE.out);
  const brainGlow = ez(W.psicologia, W.psicologia + 0.4);

  // ——— 2 · a segunda opção nasce (tracejado → cartão), preço 197 → 167 ———
  const decoyShow = sp(W.segunda, SPR.snap);
  const decoyFill = ez(W.opcao - 0.05, W.opcao + 0.3, 0, 1, EASE.out);
  const decoyPrice = Math.round(interpolate(t, [W.pouco, W.menor + 0.35], [197, 167], { easing: EASE.inOut, ...clamp }));
  const diff = sp(W.menor + 0.1, SPR.pop) * (1 - ez(W.agora - 0.3, W.agora, 0, 1, EASE.in));
  const ring = ez(W.realmente - 0.1, W.realmente + 0.35);
  const target = sp(W.realmente, SPR.pop);

  // ——— 3 · benefícios principais (★) e secundários nos dois cartões ———
  const header = ez(W.principais - 0.15, W.principais + 0.15, 0, 1, EASE.out);
  const rowIn = (k: number, d = 0) => sp((k < 3 ? W.principais + k * 0.11 : W.secundarios + (k - 3) * 0.11) + d, SPR.snap);
  const countIn = sp(W.cada, SPR.snap);

  // ——— 5 · retirar os principais da opção barata ———
  const strike = REMOVE.map((r) => ez(r - 0.04, r + 0.16, 0, 1, EASE.out));
  const fly = REMOVE.map((r) => ez(r + 0.2, r + 0.56, 0, 1, EASE.in));
  const ghost = REMOVE.map((r) => ez(r + 0.42, r + 0.7));
  const tray = sp(REMOVE[0] + 0.3, SPR.soft) * (1 - ez(W.quando - 0.2, W.quando + 0.1, 0, 1, EASE.in));
  const zero = [0, 0, 0];
  // capa dos produtos até "liste os benefícios"
  const cover = 1 - ez(W.beneficios, W.principais - 0.02, 0, 1, EASE.in);
  // 2 · comparador de preço · 3 · legenda dos benefícios (zona de baixo)
  const bars = sp(W.menor + 0.12, SPR.soft) * (1 - ez(W.agora - 0.15, W.agora + 0.15, 0, 1, EASE.in));
  const legend = sp(W.principais + 0.1, SPR.soft) * (1 - ez(W.aqui - 0.15, W.aqui + 0.05, 0, 1, EASE.in));
  const label = sp(0.05, SPR.snap) * (1 - ez(W.parecer - 0.2, W.parecer + 0.05, 0, 1, EASE.in));
  const decoyCount = t < REMOVE[0] + 0.3 ? 6 : t < REMOVE[1] + 0.3 ? 5 : t < REMOVE[2] + 0.3 ? 4 : 3;
  const decoyTone: Tone = t >= REMOVE[0] + 0.3 ? "coral" : "gray";
  const decoyDim = ez(W.barata - 0.1, W.barata + 0.5) * 0.75;

  // ——— 6 · vira isca: linha de pesca, o cartão é içado e balança, carimbo ———
  const line = ez(W.vira - 0.15, W.isca - 0.05, 0, 1, EASE.out);
  const lift = -34 * ez(W.isca - 0.05, W.isca + 0.3, 0, 1, EASE.out);
  const swing = t > W.isca ? Math.sin((t - W.isca) * 3.6) * 5 * Math.exp(-(t - W.isca) * 0.55) : 0;
  // a curva do anzol (≈50 px abaixo do topo do ícone) prende o topo do cartão
  const hookTop = -400 + (TOP + lift + 6 - 50 + 400) * line;
  const stamp = sp(W.isca, SPR.pop);
  const purpose = sp(W.ruim, SPR.snap);

  // ——— 7 · o cliente compara (VS, olhos esquerda/direita); grave do áudio aos 20,35 s ———
  const avatarIn = sp(W.cliente - 0.05, SPR.snap);
  const vs = sp(W.comparar, SPR.pop);
  const look =
    t < W.comparar ? 0 : t < W.pensar + 1.9 ? Math.sin((t - W.comparar) * 7.5) : interpolate(t, [W.pensar + 1.9, W.pensar + 2.2], [Math.sin((W.pensar + 1.9 - W.comparar) * 7.5), 1], clamp);
  const punch = t >= W.boom - 0.05 ? 0.04 * Math.exp(-(t - W.boom + 0.05) * 5) : 0;
  const bubble = sp(W.pensar, SPR.snap);

  // ——— 8 · por um pouco mais → muito mais benefícios → escolhido ———
  const plus = sp(W.pouco2, SPR.pop);
  const twice = sp(W.muito, SPR.pop);
  const chosen = sp(W.beneficios3, SPR.pop);
  const decoyDim2 = decoyDim + ez(W.muito, W.muito + 0.4) * 0.2;
  const happy = ez(W.muito, W.muito + 0.4);
  const mainCountPop = interpolate(t - W.muito, [0, 0.12, 0.4], [0, 1, 0], clamp);

  // ——— câmara: foco na opção barata ao retirar; punch no grave; foco final na escolha ———
  const fd = ez(W.retire, W.retire + 0.5) - ez(16.45, 16.95);
  const fm = ez(W.muito, W.muito + 0.6);
  const camS = 1 + 0.16 * fd + 0.05 * fm + punch;
  const camX = 270 * fd - 120 * fm;
  const camY = -20 * fd;

  return (
    <AbsoluteFill>
      <Paper warm={ring} />
      {/* ——— câmara ——— */}
      <AbsoluteFill style={{ transform: `translate(${camX}px, ${camY}px) scale(${camS})`, transformOrigin: "50% 50%" }}>
        {/* linha de pesca + anzol (a isca) */}
        {line > 0 && (
          <>
            <div style={{ position: "absolute", left: DECOY_X - 1.5, top: -400, width: 3, height: hookTop - -400 + 6, background: `linear-gradient(180deg, rgba(11,13,18,0) 0%, rgba(11,13,18,0) ${Math.max(0, 100 - (170 / Math.max(1, hookTop + 406)) * 100)}%, ${P10.ink} 100%)` }} />
            <div style={{ position: "absolute", left: DECOY_X - 25, top: hookTop, opacity: interpolate(line, [0, 0.2], [0, 1], clamp) }}>
              <HookIcon s={40} c={P10.ink} w={3.4} />
            </div>
          </>
        )}
        {/* opção B — a mais barata (vira a isca) */}
        <Card
          x={DECOY_X}
          scale={1}
          rot={swing}
          lift={lift}
          tag="OPÇÃO B"
          name="Curso Essencial"
          price={t < W.pouco ? 197 : decoyPrice}
          hero={false}
          show={interpolate(decoyShow, [0, 0.3], [0, 1], clamp)}
          fill={decoyFill}
          dash={decoyShow}
          header={header}
          rowIn={ROWS.map((_, k) => rowIn(k, 0.05))}
          strike={[...strike, 0, 0, 0]}
          fly={[...fly, 0, 0, 0]}
          collapse={zero.concat(zero)}
          ghost={ghost}
          cover={cover}
          sub="6 MÓDULOS · 20 AULAS"
          count={{ n: decoyCount, p: countIn, tone: decoyTone, pop: interpolate(t - (REMOVE[2] + 0.3), [0, 0.12, 0.4], [0, 1, 0], clamp) }}
          ring={0}
          dim={decoyDim2}
        >
          {/* diferença de preço: só um pouco menor */}
          <div style={{ position: "absolute", right: -30, top: 150, opacity: diff, transform: `scale(${0.6 + diff * 0.4}) rotate(${-4 * diff}deg)` }}>
            <Chip bg={P10.ink} color="#fff" size={28}>
              − R$ 30
            </Chip>
          </div>
          {/* carimbo ISCA + "ruim de propósito" */}
          {stamp > 0.01 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  padding: "8px 34px",
                  border: `7px solid ${P10.coral}`,
                  borderRadius: 18,
                  fontFamily: F10.display,
                  fontWeight: 900,
                  fontSize: 84,
                  letterSpacing: "0.08em",
                  color: P10.coral,
                  background: "rgba(255,255,255,0.86)",
                  transform: `rotate(-12deg) scale(${2.2 - 1.2 * stamp})`,
                  opacity: interpolate(stamp, [0, 0.25], [0, 1], clamp),
                  boxShadow: `0 0 0 ${Math.max(0, 1 - stamp) * 30}px ${P10.coral}22`,
                }}
              >
                ISCA
              </div>
              <div style={{ opacity: purpose, transform: `translateY(${(1 - purpose) * 20}px) rotate(-4deg)` }}>
                <Chip bg={P10.ink} color="#fff" size={26}>
                  <span style={{ width: 12, height: 12, borderRadius: 6, background: P10.amber }} />
                  ruim de propósito
                </Chip>
              </div>
            </div>
          )}
        </Card>
        {/* opção A — o produto que você quer vender (herói turquesa) */}
        <Card
          x={mainX}
          scale={mainScale * (1 + chosen * 0.03)}
          lift={(1 - mainIn) * 140}
          tag={t < W.crie ? "O SEU PRODUTO" : "OPÇÃO A"}
          name="Curso Completo"
          cover={cover}
          sub="12 MÓDULOS · 48 AULAS"
          price={197}
          hero
          show={interpolate(mainIn, [0, 0.3], [0, 1], clamp)}
          fill={1}
          dash={0}
          header={header}
          rowIn={ROWS.map((_, k) => rowIn(k))}
          strike={zero.concat(zero)}
          fly={zero.concat(zero)}
          collapse={zero.concat(zero)}
          count={{ n: 6, p: countIn, tone: twice > 0.5 ? "lime" : "turq", pop: mainCountPop }}
          ring={ring}
          dim={0}
        >
          {/* "o que você realmente quer vender" → "escolhido" */}
          <div style={{ position: "absolute", left: 0, right: 0, top: -34, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "absolute", opacity: target * (1 - chosen), transform: `translateY(${(1 - target) * 24}px) scale(${0.8 + target * 0.2})` }}>
              <Chip bg={P10.turq} color="#fff" size={26} style={{ boxShadow: `0 14px 30px -12px ${P10.turq}AA` }}>
                <TargetIcon s={28} />o que você quer vender
              </Chip>
            </div>
            <div style={{ position: "absolute", opacity: chosen, transform: `scale(${0.6 + chosen * 0.4})` }}>
              <Chip bg={P10.lime} color="#fff" size={30} style={{ boxShadow: `0 16px 34px -12px ${P10.lime}` }}>
                <CheckIcon s={30} /> Escolhido
              </Chip>
            </div>
          </div>
        </Card>
        {/* VS */}
        {vs > 0.01 && (
          <div style={{ position: "absolute", left: 540 - 56, top: TOP + 214, width: 112, height: 112, borderRadius: 56, background: P10.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F10.display, fontWeight: 900, fontSize: 40, letterSpacing: "-0.02em", transform: `scale(${vs * (1 + punch * 4)})`, boxShadow: `0 0 0 ${10 + punch * 300}px rgba(11,13,18,${0.06 + punch})`, opacity: 1 - ez(W.muito, W.muito + 0.3) }}>
            VS
          </div>
        )}
      </AbsoluteFill>

      {/* ——— medidor de perceção de preço (gancho) ——— */}
      {meterIn > 0.01 && (
        <div style={{ position: "absolute", left: 170, right: 170, top: 1450, opacity: meterIn, transform: `translateY(${(1 - meterIn) * 40}px)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F10.mono, fontSize: 20, letterSpacing: "0.12em", color: P10.gray, marginBottom: 14 }}>
            <span style={{ color: P10.coral }}>CARO</span>
            <span>PERCEPÇÃO DE PREÇO</span>
            <span style={{ color: "#0A9A5B" }}>BARATO</span>
          </div>
          <div style={{ position: "relative", height: 18, borderRadius: 9, background: `linear-gradient(90deg, ${P10.coral}, ${P10.amber} 50%, ${P10.lime})` }}>
            <div style={{ position: "absolute", left: `${knob * 100}%`, top: -15, width: 48, height: 48, marginLeft: -24, borderRadius: 24, background: "#fff", border: `5px solid ${P10.ink}`, boxShadow: "0 10px 20px -8px rgba(11,13,18,0.5)" }} />
          </div>
        </div>
      )}

      {/* ——— etiqueta inicial (algo mexe logo no primeiro fotograma) ——— */}
      {label > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 108, display: "flex", justifyContent: "center", opacity: label, transform: `translateY(${(1 - label) * -20}px)` }}>
          <Chip bg={P10.ink} color="#fff" size={22} style={{ fontFamily: F10.mono, fontWeight: 500, letterSpacing: "0.14em" }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: P10.violet }} />
            PSICOLOGIA DE PREÇOS
          </Chip>
        </div>
      )}
      {/* ——— 2 · só um pouco menor ——— */}
      {bars > 0.01 && (
        <div style={{ position: "absolute", left: 110, right: 110, top: 1420, opacity: bars, transform: `translateY(${(1 - bars) * 40}px)` }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: F10.mono, fontSize: 20, letterSpacing: "0.12em", color: P10.gray, marginBottom: 16 }}>
            DIFERENÇA DE PREÇO
            <div style={{ marginLeft: "auto" }}>
              <Chip bg={P10.ink} color="#fff" size={24}>
                só R$ 30
              </Chip>
            </div>
          </div>
          {[
            { k: "B", v: 167, c: "#A7B1BD" },
            { k: "A", v: 197, c: P10.turq },
          ].map((b, i) => {
            const g = sp(W.menor + 0.2 + i * 0.12, SPR.soft);
            return (
              <div key={b.k} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12, fontFamily: F10.display, fontWeight: 700, fontSize: 28, color: P10.ink }}>
                <span style={{ width: 30, color: b.k === "A" ? P10.turqDeep : P10.gray }}>{b.k}</span>
                <div style={{ flex: 1, height: 26, borderRadius: 13, background: P10.mist }}>
                  <div style={{ width: `${(b.v / 197) * 100 * g}%`, height: "100%", borderRadius: 13, background: b.c }} />
                </div>
                <span style={{ width: 110, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>R$ {b.v}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* ——— 3 · legenda: principais vs. secundários ——— */}
      {legend > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1440, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: legend, transform: `translateY(${(1 - legend) * 40}px)` }}>
          <div style={{ transform: `scale(${0.9 + 0.1 * sp(W.principais + 0.1, SPR.pop)})` }}>
            <Chip bg={P10.amberSoft} color={P10.ink} size={30}>
              <StarIcon s={32} /> principais: o que faz comprar
            </Chip>
          </div>
          <div style={{ opacity: sp(W.secundarios + 0.05, SPR.snap) }}>
            <Chip bg={P10.mist} color={P10.grayDeep} size={30}>
              <CheckIcon s={30} c={P10.gray} /> secundários: os extras
            </Chip>
          </div>
        </div>
      )}
      {/* ——— 5–6 · a bandeja do que foi retirado ——— */}
      {tray > 0.01 && (
        <div style={{ position: "absolute", left: 110, right: 110, top: 1420, opacity: tray, transform: `translateY(${(1 - tray) * 40}px)` }}>
          <div style={{ fontFamily: F10.mono, fontSize: 20, letterSpacing: "0.12em", color: P10.coral, marginBottom: 16, textAlign: "center" }}>RETIRADOS DA OPÇÃO B</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {ROWS.slice(0, 3).map((r, k) => {
              const g = sp(REMOVE[k] + 0.5, SPR.pop);
              return (
                <div key={r.l} style={{ opacity: interpolate(g, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - g) * -60}px) rotate(${(1 - g) * -8 + (k - 1) * 2}deg)` }}>
                  <Chip bg={P10.coralSoft} color={P10.coral} size={26}>
                    <span style={{ textDecoration: "line-through", textDecorationThickness: 3 }}>{r.l}</span>
                  </Chip>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* ——— o cliente e o que ele pensa ——— */}
      {avatarIn > 0.01 && (
        <div style={{ position: "absolute", left: 70, top: 1372, opacity: avatarIn * (1 - ez(23.5, 23.75)), transform: `translateY(${(1 - avatarIn) * 80}px)` }}>
          <Avatar look={look} happy={happy} />
        </div>
      )}
      {bubble > 0.01 && (
        <div style={{ position: "absolute", left: 290, right: 70, top: 1352, opacity: interpolate(bubble, [0, 0.3], [0, 1], clamp) * (1 - ez(23.5, 23.75)), transform: `scale(${0.85 + bubble * 0.15})`, transformOrigin: "0% 60%" }}>
          <div style={{ position: "absolute", left: -46, top: 128, width: 22, height: 22, borderRadius: 11, background: "#fff", border: `1.5px solid ${P10.line}` }} />
          <div style={{ position: "absolute", left: -22, top: 104, width: 30, height: 30, borderRadius: 15, background: "#fff", border: `1.5px solid ${P10.line}` }} />
          <div style={{ minHeight: 210, borderRadius: 40, background: "#fff", border: `1.5px solid ${P10.line}`, boxShadow: "0 40px 70px -30px rgba(11,13,18,0.3)", padding: "30px 36px", fontFamily: F10.display, fontWeight: 700, fontSize: 46, lineHeight: 1.18, letterSpacing: "-0.02em", color: P10.ink }}>
            {t < W.por - 0.05 ? (
              <div style={{ display: "flex", gap: 14, paddingTop: 50 }}>
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{ width: 18, height: 18, borderRadius: 9, background: P10.gray, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 9 - k * 0.9)) }} />
                ))}
              </div>
            ) : (
              <ThoughtWords />
            )}
          </div>
        </div>
      )}

      {/* ——— títulos (fixos, fora da câmara) ——— */}
      <Headline
        out={W.parecer - 0.05}
        rows={[
          { words: [{ w: "Seu", at: W.seu }, { w: "produto", at: W.produto }] },
          { size: 62, weight: 500, color: P10.grayDeep, words: [{ w: "ou serviço", at: W.servico }] },
        ]}
      />
      <Headline
        out={W.crie - 0.05}
        rows={[
          { words: [{ w: "Parecer", at: W.parecer }, { w: "mais", at: W.mais }, { w: "barato", at: W.barato, serif: true, color: "#0A9A5B" }] },
          { size: 54, weight: 600, color: P10.grayDeep, words: [{ w: "usando", at: W.usando }, { w: "psicologia", at: W.psicologia, color: P10.violet, icon: <BrainIcon s={58} glow={brainGlow} /> }] },
        ]}
      />
      <Headline
        out={W.agora - 0.05}
        rows={[
          { words: [{ w: "Crie uma", at: W.crie }] },
          { words: [{ w: "segunda opção", at: W.segunda, pill: P10.amberSoft }] },
          { size: 50, weight: 600, color: P10.grayDeep, words: [{ w: "com preço", at: W.com }, { w: "um pouco", at: W.um }, { w: "menor", at: W.menor, color: P10.ink }] },
        ]}
      />
      <Headline
        out={W.aqui - 0.05}
        rows={[
          { words: [{ w: "Liste os", at: W.liste }, { w: "benefícios", at: W.beneficios, color: P10.turqDeep }] },
          { size: 54, weight: 600, color: P10.grayDeep, words: [{ w: "principais", at: W.principais, color: P10.ink, icon: <StarIcon s={44} /> }, { w: "e", at: W.e }, { w: "secundários", at: W.secundarios }] },
        ]}
      />
      <Headline
        out={W.a - 0.05}
        rows={[
          { words: [{ w: "Retire", at: W.retire, color: P10.coral }, { w: "os principais", at: W.principais2 }] },
          { size: 54, weight: 600, color: P10.grayDeep, words: [{ w: "da opção", at: W.da }, { w: "mais barata", at: W.mais2, color: P10.ink }] },
        ]}
      />
      <Headline
        out={W.quando - 0.05}
        rows={[
          { size: 54, weight: 600, color: P10.grayDeep, words: [{ w: "A opção barata", at: W.a }] },
          { size: 96, words: [{ w: "vira uma", at: W.vira }, { w: "isca", at: W.isca, serif: true, color: P10.coral }] },
        ]}
      />
      <Headline
        out={W.por - 0.05}
        rows={[
          { size: 50, weight: 600, color: P10.grayDeep, words: [{ w: "Quando o cliente", at: W.quando }] },
          { size: 96, words: [{ w: "compara", at: W.comparar, pill: P10.turqSoft }] },
          { size: 50, weight: 600, color: P10.grayDeep, words: [{ w: "vai pensar…", at: W.vai }] },
        ]}
      />
      {/* 8 · a conta que o cliente faz */}
      {plus > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: 1 - ez(23.48, 23.7, 0, 1, EASE.in) }}>
          <div style={{ opacity: plus, transform: `translateY(${(1 - plus) * 30}px) scale(${0.7 + plus * 0.3})` }}>
            <Chip bg={P10.amber} color={P10.ink} size={58}>
              + R$ 30
            </Chip>
          </div>
          <svg width={80} height={40} viewBox="0 0 80 40" style={{ opacity: twice }}>
            <path d="M4 20h66M54 6l16 14-16 14" stroke={P10.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ opacity: twice, transform: `translateY(${(1 - twice) * 30}px) scale(${0.7 + twice * 0.3})` }}>
            <Chip bg={P10.lime} color="#fff" size={58}>
              2× benefícios
            </Chip>
          </div>
        </div>
      )}
      <Spark x={985} y={205} s={40} at={W.barato + 0.1} c={P10.lime} />
      <Spark x={820} y={230} s={36} at={W.muito + 0.08} c={P10.lime} />
      <Spark x={960} y={470} s={46} at={W.beneficios3 + 0.05} c={P10.amber} />
    </AbsoluteFill>
  );
};

// o pensamento do cliente, palavra a palavra
const ThoughtWords: React.FC = () => {
  const { sp } = useClock(0);
  const words: { w: string; at: number; c?: string }[] = [
    { w: "Por", at: W.por },
    { w: "um", at: W.um2 },
    { w: "pouco", at: W.pouco2 },
    { w: "mais,", at: W.mais3 },
    { w: "eu", at: W.eu },
    { w: "levo", at: W.levo },
    { w: "muito", at: W.muito, c: "#0A9A5B" },
    { w: "mais", at: W.mais4, c: "#0A9A5B" },
    { w: "benefícios.", at: W.beneficios3 },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: 12 }}>
      {words.map((x) => {
        const p = sp(x.at - 0.04, SPR.snap);
        return (
          <span key={x.w + x.at} style={{ color: x.c ?? P10.ink, opacity: interpolate(p, [0, 0.5], [0, 1], clamp), transform: `translateY(${(1 - p) * 18}px)`, display: "inline-block" }}>
            {x.w}
          </span>
        );
      })}
    </div>
  );
};
