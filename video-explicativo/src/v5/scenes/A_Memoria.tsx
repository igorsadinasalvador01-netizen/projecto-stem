import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, useAt } from "../../components/Motion";
import { IconCheck } from "../../components/Icons";
import { c5, ease5, springs5, t5 } from "../theme5";
import { SCENES5, W5 } from "../timeline5";
import { Scene5 } from "../Vintage";
import { Gauge, IndexCard, Polaroid, SoftWords, Stamp, Typewriter } from "../Props5";

// ——— Cena 1: um segredo (envelope com lacre) ———
export const S1Segredo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES5.segredo.from);
  const env = spring({ frame: frame - at(W5.um), fps, config: springs5.drop });
  const seal = spring({ frame: frame - at(W5.sobre), fps, config: springs5.settle });
  const flap = interpolate(frame, [at(W5.comecar) - 2, at(W5.comecar) + 0.45 * fps], [0, 1], { easing: ease5.inOut, ...clamp });
  const letter = spring({ frame: frame - at(W5.no), fps, config: springs5.drift });
  const W_ = 760;
  const H_ = 460;

  return (
    <Scene5 surface="paper" enter="flicker">
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typewriter text="Quer saber um" from={at(W5.quer)} to={at(W5.segredo) - 2} style={{ fontSize: 52, color: c5.inkSoft }} caret={false} />
        <SoftWords style={{ ...t5.serifIt, fontSize: 220, marginTop: 6 }} rise={40} words={[{ text: "segredo", at: at(W5.segredo) }]} />
      </div>

      {/* envelope */}
      <div
        style={{
          position: "absolute",
          left: 540 - W_ / 2,
          top: 880,
          width: W_,
          height: H_,
          perspective: 1600,
          opacity: env,
          transform: `translateY(${(1 - env) * -300}px) rotate(${(1 - env) * -10 - 2}deg)`,
          filter: `drop-shadow(0 30px 40px ${c5.shadowDeep})`,
        }}
      >
        {/* fundo */}
        <div style={{ position: "absolute", inset: 0, background: c5.paperDeep, borderRadius: 14, zIndex: 0 }} />
        {/* aba (atrás da carta depois de abrir) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W_,
            height: H_ * 0.62,
            background: `linear-gradient(180deg, ${c5.paperEdge}, ${c5.paperDeep})`,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "50% 0%",
            transform: `rotateX(${flap * 178}deg)`,
            zIndex: flap > 0.5 ? 1 : 4,
          }}
        />
        {/* carta */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 30,
            width: W_ - 80,
            height: H_ - 60,
            background: c5.cream,
            borderRadius: 6,
            transform: `translateY(${-letter * 330}px)`,
            zIndex: 2,
            padding: "46px 50px",
            boxShadow: `0 10px 20px ${c5.shadow}`,
            backgroundImage: `repeating-linear-gradient(180deg, transparent 0 54px, ${c5.tealMist} 54px 56px)`,
            backgroundPosition: "0px 40px",
          }}
        >
          <div style={{ ...t5.label, fontSize: 20 }}>confidencial</div>
          <div style={{ marginTop: 34 }}>
            <Typewriter text="começar no digital" from={at(W5.no) + 4} to={at(W5.digital) + 0.7 * fps} style={{ fontSize: 46 }} />
          </div>
          <div style={{ marginTop: 14, height: 4, width: `${interpolate(frame, [at(W5.digital), at(W5.digital) + 0.6 * fps], [0, 92], clamp)}%`, background: c5.teal, borderRadius: 2 }} />
        </div>
        {/* bolso da frente */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${c5.paper}, ${c5.paperDeep})`,
            clipPath: "polygon(0 30%, 50% 66%, 100% 30%, 100% 100%, 0 100%)",
            borderRadius: 14,
            zIndex: 3,
          }}
        />
        {/* lacre */}
        <div
          style={{
            position: "absolute",
            left: W_ / 2 - 62,
            top: H_ * 0.62 - 80,
            width: 124,
            height: 124,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${c5.tealLight}, ${c5.tealDeep} 60%, ${c5.tealDark})`,
            boxShadow: `0 6px 12px ${c5.shadowDeep}, inset 0 0 0 10px rgba(255,255,255,0.08)`,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...t5.serifIt,
            fontSize: 70,
            color: c5.tealMist,
            transform: `scale(${1 + seal * 0.25}) rotate(${seal * 25}deg)`,
            opacity: 1 - seal,
          }}
        >
          s
        </div>
      </div>

      <div style={{ position: "absolute", top: 1470, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 80, color: c5.inkSoft }}
          words={[
            { text: "sobre", at: at(W5.sobre) },
            { text: "começar", at: at(W5.comecar) },
          ]}
        />
        <SoftWords
          style={{ ...t5.serifIt, fontSize: 120, color: c5.tealDeep, marginTop: 6 }}
          gap={24}
          words={[
            { text: "no", at: at(W5.no) },
            { text: "digital?", at: at(W5.digital) },
          ]}
        />
      </div>
    </Scene5>
  );
};

// ——— Cena 2: nunca 100% pronto (mostrador que fica nos 99%) ———
export const S2Pronto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES5.pronto.from);
  const climb = interpolate(frame, [at(W5.voce), at(W5.cem)], [0, 0.97], { easing: ease5.inOut, ...clamp });
  const jitter = frame > at(W5.cem) ? 0.005 + (random(`j${Math.floor(frame / 2)}`) - 0.5) * 0.012 : 0;
  const value = Math.min(0.99, climb + jitter);
  const stamp = spring({ frame: frame - at(W5.cem) - 4, fps, config: springs5.drop });
  const gaugeIn = spring({ frame: frame - at(W5.voce) + 4, fps, config: springs5.settle });
  const strike = interpolate(frame, [at(W5.cem) + 6, at(W5.cem) + 0.4 * fps], [0, 1], { easing: ease5.out, ...clamp });

  return (
    <Scene5 surface="teal" enter="film">
      <div style={{ position: "absolute", top: 230, left: 60, right: 60 }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 96, color: c5.cream }}
          gap={22}
          words={[
            { text: "Você", at: at(W5.voce) },
            { text: "nunca", at: at(W5.nunca), style: { ...t5.serifIt, color: c5.redLight } },
            { text: "vai", at: at(W5.vai) },
            { text: "se", at: at(W5.se) },
            { text: "sentir", at: at(W5.sentir) },
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 540 - 310, top: 600, opacity: gaugeIn, transform: `translateY(${(1 - gaugeIn) * 80}px)` }}>
        <Gauge value={value} size={620} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", ...t5.type, fontSize: 64, color: c5.cream, fontVariantNumeric: "tabular-nums" }}>
          {Math.min(99, Math.round(value * 100))}%
        </div>
        <div style={{ position: "absolute", right: -30, top: -10 }}>
          <Stamp text="100%" color={c5.red} p={stamp} rotate={12} size={40} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1360, left: 60, right: 60, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 30 }}>
        <div style={{ position: "relative" }}>
          <SoftWords style={{ ...t5.serif, fontSize: 150, color: c5.cream }} words={[{ text: "100%", at: at(W5.cem) }]} />
          <div style={{ position: "absolute", left: -10, top: "52%", height: 10, borderRadius: 5, width: `calc(${strike * 100}% + 20px)`, background: c5.redLight, opacity: strike > 0 ? 1 : 0 }} />
        </div>
        <SoftWords style={{ ...t5.serifIt, fontSize: 150, color: c5.cream }} words={[{ text: "pronto.", at: at(W5.pronto) }]} />
      </div>
    </Scene5>
  );
};

// ——— Cena 3: sempre algo novo para aprender (fichas de arquivo) ———
const TOPICS = ["algo novo", "tráfego pago", "copywriting", "edição de vídeo", "funil de vendas", "inteligência artificial"];

export const S3Aprender: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES5.aprender.from);
  const starts = [at(W5.algo), at(W5.novo) + 2, at(W5.para), at(W5.aprender) + 2, at(W5.aprender) + 8, at(W5.aprender) + 14];

  return (
    <Scene5 surface="ruled" enter="page">
      <div style={{ position: "absolute", top: 220, left: 60, right: 60 }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 104 }}
          gap={24}
          words={[
            { text: "Sempre", at: at(W5.sempre) },
            { text: "vai", at: at(W5.vai2) },
            { text: "existir", at: at(W5.existir) },
          ]}
        />
      </div>
      {TOPICS.map((tp, i) => {
        const p = spring({ frame: frame - starts[i], fps, config: springs5.drop });
        const stampP = spring({ frame: frame - starts[i] - 5, fps, config: springs5.drop });
        const rot = (random(`r${i}`) - 0.5) * 10;
        const ox = (random(`x${i}`) - 0.5) * 60;
        return (
          <div
            key={tp}
            style={{
              position: "absolute",
              left: 180 + ox,
              top: 690 - i * 22,
              opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
              transform: `translateX(${(1 - p) * 900}px) rotate(${rot + (1 - p) * 14}deg)`,
            }}
          >
            <IndexCard title={tp} n={i + 1} stampP={stampP} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1330, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SoftWords
          style={{ ...t5.serifIt, fontSize: 150, color: c5.tealDeep }}
          gap={30}
          words={[
            { text: "algo", at: at(W5.algo) },
            { text: "novo", at: at(W5.novo) },
          ]}
        />
        <SoftWords
          style={{ ...t5.serif, fontSize: 84, color: c5.inkSoft }}
          words={[
            { text: "para", at: at(W5.para) },
            { text: "aprender.", at: at(W5.aprender) },
          ]}
        />
      </div>
    </Scene5>
  );
};

// ——— Cena 4: quem faz a primeira venda não sabe tudo (polaroide + enciclopédia) ———
export const S4Venda: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = useAt(SCENES5.venda.from);
  const pol = spring({ frame: frame - at(W5.pessoas), fps, config: springs5.drop });
  const dev = interpolate(frame, [at(W5.primeira) - 4, at(W5.venda) + 0.4 * fps], [0, 1], { easing: ease5.inOut, ...clamp });
  const check = spring({ frame: frame - at(W5.venda), fps, config: springs5.drop });
  const books = spring({ frame: frame - at(W5.sabem) + 6, fps, config: springs5.settle });
  const no = spring({ frame: frame - at(W5.tudo), fps, config: springs5.drop });
  const strike = interpolate(frame, [at(W5.tudo) + 2, at(W5.tudo) + 0.35 * fps], [0, 1], { easing: ease5.out, ...clamp });
  const vols = ["A–C", "D–H", "I–P", "Q–Z"];

  return (
    <Scene5 surface="paper" enter="slide">
      <div style={{ position: "absolute", top: 200, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 72, color: c5.inkSoft }}
          gap={16}
          words={[
            { text: "As", at: at(W5.as) },
            { text: "pessoas", at: at(W5.pessoas) },
            { text: "que", at: at(W5.que) },
            { text: "fazem", at: at(W5.fazem) },
            { text: "a", at: at(W5.a) },
          ]}
        />
        <SoftWords
          style={{ ...t5.serifIt, fontSize: 156, color: c5.tealDeep }}
          gap={30}
          words={[
            { text: "primeira", at: at(W5.primeira) },
            { text: "venda", at: at(W5.venda) },
          ]}
        />
      </div>

      {/* polaroide da primeira venda */}
      <div style={{ position: "absolute", left: 90, top: 620, opacity: interpolate(pol, [0, 0.3], [0, 1], clamp), transform: `translateY(${(1 - pol) * -500}px) rotate(${-6 + (1 - pol) * -18}deg)` }}>
        <Polaroid caption={dev > 0.6 ? "1ª venda" : ""} width={460} develop={dev}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${c5.tealLight}, ${c5.teal} 60%, ${c5.tealDeep})` }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 170, height: 170, marginLeft: -85, marginTop: -85, borderRadius: "50%", background: c5.green, color: c5.cream, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 30px ${c5.shadowDeep}`, transform: `scale(${check})`, opacity: Math.min(1, check * 1.4) }}>
            <IconCheck size={100} stroke={2.6} />
          </div>
        </Polaroid>
      </div>

      {/* enciclopédia: "saber tudo" */}
      <div style={{ position: "absolute", left: 620, top: 700, display: "flex", gap: 10, opacity: books * (1 - no * 0.45), filter: `grayscale(${no})`, transform: `translateY(${(1 - books) * 80}px)` }}>
        {vols.map((v, i) => (
          <div
            key={v}
            style={{
              width: 82,
              height: 470 - (i % 2) * 30,
              marginTop: (i % 2) * 30,
              borderRadius: 8,
              background: [c5.tealDeep, c5.sepia, c5.tealDark, c5.paperEdge][i],
              boxShadow: `inset -8px 0 0 rgba(0,0,0,0.12), 0 14px 24px -10px ${c5.shadowDeep}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "26px 0",
            }}
          >
            <div style={{ width: 50, height: 6, background: c5.cream, opacity: 0.7 }} />
            <div style={{ ...t5.label, fontSize: 18, color: c5.cream, writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.2em" }}>tudo {v}</div>
            <div style={{ width: 50, height: 6, background: c5.cream, opacity: 0.7 }} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: 160 }}>
          <Stamp text="não" color={c5.red} p={no} rotate={-14} size={52} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1380, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SoftWords
          style={{ ...t5.serif, fontSize: 76, color: c5.inkSoft }}
          gap={16}
          words={[
            { text: "não", at: at(W5.nao), style: { ...t5.serifIt, color: c5.red } },
            { text: "são", at: at(W5.sao) },
            { text: "aquelas", at: at(W5.aquelas) },
            { text: "que", at: at(W5.que2) },
          ]}
        />
        <div style={{ position: "relative", marginTop: 8 }}>
          <SoftWords
            style={{ ...t5.serif, fontSize: 130 }}
            gap={28}
            words={[
              { text: "sabem", at: at(W5.sabem) },
              { text: "tudo,", at: at(W5.tudo) },
            ]}
          />
          <div style={{ position: "absolute", left: -10, top: "54%", height: 9, borderRadius: 5, width: `calc(${strike * 100}% + 20px)`, background: c5.red, opacity: strike > 0 ? 0.9 : 0 }} />
        </div>
      </div>
    </Scene5>
  );
};
