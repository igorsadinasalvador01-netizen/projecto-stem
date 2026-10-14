import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFonts } from "../fonts";
import { clamp } from "../components/Motion";
import { Captions9 } from "./Captions9";
import { BAR, CinemaOverlay, F, HistoricOverlay, P, VHSOverlay } from "./Look";
import { ACT2, ACT3, SCENES9, t9, TOTAL9, VOICE_END } from "./timeline9";
import { N1, N2, N3, N4, N5 } from "./scenes/Nostalgia";
import { C1, C2, C3, C4, C5, C6, C7 } from "./scenes/Cinema";
import { H1, H2, H3, H4, H5, H6, H7 } from "./scenes/Historic";
import mix from "./mix9.json";

loadFonts();

export type Conteudo9Props = { sfx: boolean; sfxGain: number };

const SCENE_COMPONENTS: Record<string, React.FC> = { n1: N1, n2: N2, n3: N3, n4: N4, n5: N5, c1: C1, c2: C2, c3: C3, c4: C4, c5: C5, c6: C6, c7: C7, h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6, h7: H7 };

// ——— sons: entradas e saídas nas junções, destaques nas palavras ———
type Sfx = { file: string; at: number; v?: number };
const seq = (file: string, at: number, n: number, step: number, v?: number): Sfx[] => Array.from({ length: n }, (_, i) => ({ file, at: at + i * step, v }));
const SFX: Sfx[] = [
  // 1 · nostálgico
  { file: "rec.wav", at: 0.0, v: 0.3 },
  { file: "vhs.wav", at: 2.38, v: 0.5 },
  ...seq("paper.wav", 2.45, 3, 0.1, 0.8),
  { file: "pop.wav", at: t9("tempo", 2.4) },
  { file: "swish.wav", at: t9("transformar", 3) },
  { file: "thud.wav", at: t9("conteúdo", 4.5) },
  { file: "vhs.wav", at: t9("conteúdo", 4.5) + 0.05, v: 0.3 },
  { file: "vhs.wav", at: 5.42, v: 0.5 },
  { file: "paper.wav", at: t9("tenho", 5.4), v: 0.7 },
  ...["parar", "gravar", "repetir", "editar", "legendas", "publicar"].map((w): Sfx => ({ file: "thud.wav", at: t9(w, 5.5) })),
  { file: "rec.wav", at: t9("gravar", 5.5) + 0.05, v: 0.4 },
  { file: "clap.wav", at: t9("repetir", 5.5) + 0.12, v: 0.5 },
  { file: "vhs.wav", at: 10.32, v: 0.5 },
  ...["trabalho", "responsabilidades", "prioridades"].map((w): Sfx => ({ file: "pop.wav", at: t9(w, 10.4) })),
  { file: "pop.wav", at: t9("produzir", 13) },
  { file: "whoosh.wav", at: t9("conteúdo", 13.6) + 0.1, v: 0.6 },
  { file: "vhs.wav", at: 14.22, v: 0.5 },
  ...seq("tick.wav", t9("constantemente", 14), 9, 0.055, 0.8),
  { file: "stamp.wav", at: t9("complicado", 15) },
  { file: "vhs.wav", at: 15.92, v: 0.6 },
  // 2 · cinema
  { file: "braam.wav", at: ACT2 - 0.06, v: 0.05 },
  { file: "whoosh.wav", at: t9("perceber", 16.4) - 0.1, v: 0.35 },
  { file: "swish.wav", at: 18.36 },
  { file: "braam.wav", at: t9("inteligência", 18.3) - 0.02, v: 0.05 },
  { file: "shimmer.wav", at: t9("inteligência", 18.3) + 0.25, v: 0.5 },
  ...seq("tick.wav", t9("mudar", 19.4), 6, 0.05),
  { file: "hit.wav", at: t9("processo", 20.2) - 0.03, v: 0.6 },
  { file: "whoosh.wav", at: 20.9, v: 0.7 },
  ...["conhecimento", "ideias", "aprendo"].map((w, i): Sfx => ({ file: "pop.wav", at: t9(w, [21.5, 22.5, 23.5][i]) })),
  { file: "swell.wav", at: t9("transformo", 24) - 0.3, v: 0.8 },
  ...["roteiro", "prompts", "vídeos"].map((w, i): Sfx => ({ file: "pop.wav", at: t9(w, [24.5, 25, 25.5][i]) })),
  { file: "swish.wav", at: 26.32 },
  { file: "shimmer.wav", at: t9("minha", 27) - 0.1, v: 0.5 },
  { file: "whoosh.wav", at: 27.55, v: 0.7 },
  ...seq("tick.wav", t9("estruturar", 28.5), 4, 0.12),
  { file: "swish.wav", at: t9("melhorar", 30) + 0.1, v: 0.6 },
  { file: "yes.wav", at: t9("melhorar", 30) + 0.6, v: 0.6 },
  ...seq("tick.wav", t9("cenas", 32) - 0.45, 6, 0.13),
  { file: "swish.wav", at: 33.02 },
  ...seq("typekey.wav", 33.32, 14, 0.07, 0.7),
  { file: "hit.wav", at: t9("remotion", 34) - 0.03, v: 0.5 },
  ...seq("pop.wav", t9("vários", 35.8), 5, 0.06, 0.7),
  { file: "whoosh.wav", at: 36.95, v: 0.7 },
  { file: "stamp.wav", at: t9("dia", 38.8) },
  { file: "riser.wav", at: ACT3 - 1.0, v: 0.6 },
  // 3 · histórico
  { file: "filmburn.wav", at: ACT3 - 0.05, v: 0.7 },
  { file: "projector.wav", at: ACT3 + 0.1, v: 0.5 },
  { file: "stamp.wav", at: t9("atenção", 39.3) },
  { file: "swish.wav", at: 39.96, v: 0.7 },
  { file: "whoosh.wav", at: t9("substituir", 40.5), v: 0.6 },
  { file: "no.wav", at: t9("imagem", 41.3), v: 0.7 },
  { file: "pop.wav", at: t9("imagem", 41.3) + 0.1 },
  { file: "shutter.wav", at: t9("aparecer", 42) },
  { file: "paper.wav", at: 43.03 },
  { file: "stamp.wav", at: t9("ferramenta", 44) },
  ...seq("tick.wav", t9("partilhar", 45.3), 6, 0.1),
  ...seq("tick.wav", t9("conectar", 46.8), 6, 0.067, 0.7),
  ...seq("pop.wav", t9("agregar", 47.4), 4, 0.08, 0.6),
  { file: "swish.wav", at: 48.43, v: 0.7 },
  ...seq("tick.wav", t9("não", 49), 10, 0.07, 0.6),
  { file: "shutter.wav", at: t9("câmeras", 50) },
  { file: "hit.wav", at: t9("câmeras", 50), v: 0.4 },
  { file: "paper.wav", at: 50.76 },
  ...seq("typekey.wav", t9("conhecimento", 50.9), 12, 0.06, 0.7),
  ...seq("typekey.wav", t9("tempo", 52), 9, 0.06, 0.7),
  { file: "alert.wav", at: t9("limita", 52.6), v: 0.5 },
  ...seq("typekey.wav", t9("tens", 54.3), 8, 0.05, 0.8),
  { file: "no.wav", at: t9("mais", 54.9) + 0.05, v: 0.7 },
  { file: "swish.wav", at: 55.26, v: 0.7 },
  { file: "riser.wav", at: t9("mudar", 56.8) - 0.95, v: 0.5 },
  { file: "shimmer.wav", at: t9("mudar", 56.8), v: 0.7 },
  { file: "whoosh.wav", at: 58.05, v: 0.6 },
  { file: "pop.wav", at: t9("siga", 58.5) },
  { file: "typekey.wav", at: t9("perfil", 58.9) + 0.07 },
  { file: "yes.wav", at: t9("perfil", 58.9) + 0.15, v: 0.7 },
  ...seq("tick.wav", t9("todos", 60.3), 7, 0.067),
  { file: "pop.wav", at: t9("like", 61.5) },
  { file: "pop.wav", at: t9("curte", 61.8) },
  { file: "whoosh.wav", at: t9("compartilhe", 62.2) + 0.3, v: 0.6 },
  { file: "ding.wav", at: VOICE_END + 0.05, v: 0.35 },
];
const SFX_SECONDS: Record<string, number> = {
  "alert.wav": 0.32, "braam.wav": 2.6, "clap.wav": 0.25, "ding.wav": 1.3, "filmburn.wav": 1.1, "hit.wav": 0.9, "no.wav": 0.6, "paper.wav": 0.45,
  "pop.wav": 0.16, "projector.wav": 1.6, "rec.wav": 0.32, "riser.wav": 1.0, "shimmer.wav": 1.4, "shutter.wav": 0.35, "stamp.wav": 0.3,
  "swell.wav": 2.2, "swish.wav": 0.28, "thud.wav": 0.28, "tick.wav": 0.04, "typekey.wav": 0.09, "vhs.wav": 0.45, "whoosh.wav": 0.55, "yes.wav": 0.7,
};

// ducking: cada efeito só ocupa a margem livre de voz+trilha (src/v9/mix9.json)
const headroomAt = (f: number) => {
  const h = mix.headroom;
  const i = Math.max(0, Math.min(h.length - 1, f));
  return Math.max(0.02, (h[Math.max(0, i - 1)] + h[i] + h[Math.min(h.length - 1, i + 1)]) / 3);
};
const duck = (file: string, desired: number, start: number) => (f: number) => {
  const peak = (mix.peaks as Record<string, number>)[file] ?? 1;
  const v = Math.min(desired, headroomAt(start + f) / peak);
  const step = desired / 16;
  return Math.floor(v / step + 1e-6) * step;
};

const TRANSITION_HOLD = 0.6;

// etiquetas de capítulo (como os "PASSO" do EXEMPLO), uma por modo
const ActLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inA = (from: number) => spring({ frame: frame - Math.round((from + 0.3) * fps), fps, config: { damping: 14, stiffness: 160, mass: 0.7 } });
  if (t < ACT2 - 0.45) {
    const p = inA(0);
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: 48, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "8px 30px", borderRadius: 10, background: "#F6EEDC", boxShadow: "0 8px 18px rgba(0,0,0,0.35)", fontFamily: F.hand, fontSize: 46, color: P.nos.ink, transform: `rotate(-1.5deg) translateY(${(1 - p) * -90}px)` }}>
          lado A · o problema
        </div>
      </div>
    );
  }
  if (t < ACT3) {
    const p = inA(ACT2);
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: BAR / 2 - 26, display: "flex", justifyContent: "center", opacity: p }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: F.mono, fontSize: 30, letterSpacing: "0.26em", color: P.cin.gold }}>
          <div style={{ width: 60, height: 26, backgroundImage: `repeating-linear-gradient(135deg, ${P.cin.white} 0 8px, #111 8px 16px)`, borderRadius: 4 }} />
          CENA 02 · A VIRADA
        </div>
      </div>
    );
  }
  const p = inA(ACT3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ padding: "8px 28px", background: P.his.red, color: P.his.cream, fontFamily: F.serif, fontSize: 40, letterSpacing: "0.12em", boxShadow: "0 8px 18px rgba(0,0,0,0.4)", transform: `scale(${0.8 + p * 0.2}) rotate(-1deg)` }}>
        ARQUIVO Nº 03 · A MENSAGEM
      </div>
    </div>
  );
};

const ModeLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const barsIn = interpolate(t, [ACT2, ACT2 + 0.2, ACT3, ACT3 + 0.3], [0, 1, 1, 0], clamp);
  const hisStrength = interpolate(t, [t9("mudar", 56.8), t9("mudar", 56.8) + 0.8], [1, 0.35], clamp);
  return (
    <>
      {t < 15.92 && <VHSOverlay t={t} />}
      {t >= ACT2 && t < ACT3 + 0.4 && <CinemaOverlay barsIn={barsIn} />}
      {t >= ACT3 && <HistoricOverlay strength={hisStrength} />}
    </>
  );
};

export const Conteudo9: React.FC<Conteudo9Props> = ({ sfx, sfxGain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES9.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const from = Math.round(s.from * fps);
        const last = i === SCENES9.length - 1;
        const dur = last ? Math.round(TOTAL9 * fps) - from : Math.round((s.to + TRANSITION_HOLD) * fps) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={`${s.id} · ${s.mode} · ${s.layout}`}>
            <Comp />
          </Sequence>
        );
      })}
      <ModeLayers />
      <ActLabel />
      <Captions9 />

      {/* voz (limpa de pausas e normalizada) + trilha sintetizada com sidechain */}
      <Audio src={staticFile("v9/voz.wav")} />
      <Audio src={staticFile("v9/trilha.wav")} />
      {sfx &&
        SFX.map((s, i) => {
          const start = Math.max(0, Math.round(s.at * fps));
          const len = Math.ceil((SFX_SECONDS[s.file] ?? 2) * fps) + 1;
          return (
            <Sequence key={i} from={start} durationInFrames={len} name={`sfx · ${s.file}`}>
              <Audio src={staticFile(`sfx/${s.file}`)} volume={duck(s.file, sfxGain * (s.v ?? 1), start)} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
