import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { clamp } from "./Motion";

// O perfil real do autor, para fechar SEMPRE os vídeos com "siga".
// Réplica do Instagram (light mode). A foto de perfil vem de um único ficheiro:
// substituir public/perfil/avatar.jpg pela foto oficial muda todos os vídeos.
export const PERFIL = {
  user: "sergio_salvador10",
  name: "IGOR SADINA| POLÍMATA",
  posts: 3,
  followers: 2127,
  following: 31,
  category: "Empreendedor",
  bio: ["👷🏿 | Engenharia por profissão.", "🏷️ | Vendedor por paixão.", "Tecnologia na mente. Desporto no sangue 🥋"],
  threads: "sergio_salvador10",
  facebook: "Igor Sérgio Sadina",
  avatar: "perfil/avatar.jpg",
};

const IG_BLUE = "#4A5DF9";
const IG_GRAY = "#EFEFF2";
const INK = "#000000";
const SOFT = "#737373";
const F = theme.fonts;

const Ico: React.FC<{ d: string; s: number; c?: string; w?: number; fill?: string }> = ({ d, s, c = INK, w = 2, fill = "none" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/**
 * Cartão do perfil. `tapAt` = fotograma local do toque em "Seguir" (o botão passa a
 * "A seguir" e os seguidores sobem +1). `width` escala tudo proporcionalmente.
 */
export const PerfilCard: React.FC<{ tapAt: number; width?: number; enterAt?: number }> = ({ tapAt, width = 1000, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = width / 1000;
  const following = frame >= tapAt + 2;
  const press = interpolate(frame - tapAt, [-4, 0, 6], [0, 1, 0], clamp);
  const plus = spring({ frame: frame - tapAt - 3, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const plusOut = interpolate(frame - tapAt, [30, 42], [1, 0], clamp);
  const ring = spring({ frame: frame - enterAt - 6, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const finger = interpolate(frame, [tapAt - 14, tapAt - 1], [0, 1], { easing: theme.ease.inOut, ...clamp }) * interpolate(frame, [tapAt + 8, tapAt + 16], [1, 0], clamp);
  const wave = interpolate(frame - tapAt, [0, 18], [0, 1], { easing: theme.ease.out, ...clamp });
  const btn = (bg: string, col: string): React.CSSProperties => ({
    flex: 1,
    height: 78 * k,
    borderRadius: 16 * k,
    background: bg,
    color: col,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: F.display,
    fontWeight: 700,
    fontSize: 32 * k,
    letterSpacing: "-0.01em",
  });
  const stat = (n: string, l: string, hi = false) => (
    <div style={{ flex: 1, lineHeight: 1.15 }}>
      <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 42 * k, color: hi ? IG_BLUE : INK, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontFamily: F.body, fontSize: 31 * k, color: INK }}>{l}</div>
    </div>
  );
  return (
    <div style={{ position: "relative", width, borderRadius: 44 * k, background: "#FFFFFF", border: "1.5px solid rgba(11,13,18,0.07)", boxShadow: "0 60px 110px -40px rgba(11,13,18,0.38), 0 10px 30px -14px rgba(11,13,18,0.16)", padding: `${34 * k}px ${44 * k}px ${44 * k}px` }}>
      {/* barra de navegação */}
      <div style={{ display: "flex", alignItems: "center", gap: 26 * k, marginBottom: 34 * k }}>
        <Ico d="M15 4l-8 8 8 8" s={46 * k} w={2.2} />
        <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 46 * k, letterSpacing: "-0.02em", color: INK }}>{PERFIL.user}</div>
        <div style={{ marginLeft: "auto" }}>
          <Ico d="M5 12h.01M12 12h.01M19 12h.01" s={42 * k} w={3.4} />
        </div>
      </div>
      {/* cabeçalho */}
      <div style={{ display: "flex", alignItems: "center", gap: 46 * k }}>
        <div style={{ position: "relative", width: 230 * k, height: 230 * k, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: -8 * k, borderRadius: "50%", padding: 5 * k, backgroundImage: "linear-gradient(45deg, #FEDA75, #FA7E1E 30%, #D62976 55%, #962FBF 78%, #4F5BD5)", opacity: ring, transform: `rotate(${(1 - ring) * -90}deg)` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
            <Img src={staticFile(PERFIL.avatar)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + frame * 0.0006})` }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.display, fontWeight: 800, fontSize: 36 * k, letterSpacing: "0.005em", color: INK, marginBottom: 22 * k }}>{PERFIL.name}</div>
          <div style={{ position: "relative", display: "flex" }}>
            {stat(String(PERFIL.posts), "publicações")}
            {stat(String(following ? PERFIL.followers + 1 : PERFIL.followers), "seguidores", following)}
            {stat(String(PERFIL.following), "a seguir")}
            {plus > 0.01 && (
              <div style={{ position: "absolute", left: 330 * k, top: 2 * k, padding: `${6 * k}px ${16 * k}px`, borderRadius: 999, background: "#10C977", color: "#fff", fontFamily: F.display, fontWeight: 800, fontSize: 26 * k, opacity: plusOut, transform: `translateY(${(1 - plus) * 20 * k}px) scale(${0.6 + plus * 0.4})` }}>+1</div>
            )}
          </div>
        </div>
      </div>
      {/* bio real */}
      <div style={{ marginTop: 34 * k, fontFamily: F.body, fontSize: 32 * k, lineHeight: 1.42, color: INK }}>
        <div style={{ color: SOFT }}>{PERFIL.category}</div>
        {PERFIL.bio.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {/* ligações */}
      <div style={{ display: "flex", gap: 22 * k, marginTop: 26 * k }}>
        {[
          { t: PERFIL.threads, i: <Ico d="M16.5 11.2c-.6-3-2.6-4.4-5-4.3-2.8.1-4.6 2.3-4.6 5.1 0 3.2 2 5.2 5 5.2 2.4 0 4.2-1.5 4.2-3.6 0-1.8-1.4-2.9-3.4-2.9-2 0-3.2 1.1-3.2 2.4 0 1.2 1 2 2.4 2 2.6 0 3.6-2.2 3.6-5.2M12 3a9 9 0 1 0 6.5 15.3" s={32 * k} w={2.2} /> },
          { t: PERFIL.facebook, i: <Ico d="M12 3a9 9 0 0 0-1.4 17.9V14.6H8.3V12h2.3v-2c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.6h-2.2v6.3A9 9 0 0 0 12 3z" s={32 * k} w={1.8} /> },
        ].map((p) => (
          <div key={p.t} style={{ display: "flex", alignItems: "center", gap: 12 * k, padding: `${14 * k}px ${26 * k}px`, borderRadius: 999, border: "2px solid #E3E3E6", fontFamily: F.display, fontWeight: 700, fontSize: 29 * k, color: INK }}>
            {p.i}
            {p.t}
          </div>
        ))}
      </div>
      {/* botões */}
      <div style={{ position: "relative", display: "flex", gap: 14 * k, marginTop: 34 * k }}>
        <div style={{ position: "relative", ...btn(following ? IG_GRAY : IG_BLUE, following ? INK : "#fff"), transform: `scale(${1 - press * 0.06})`, boxShadow: following ? "none" : `0 16px 30px -14px ${IG_BLUE}` }}>
          {following ? "A seguir ˅" : "Seguir"}
          {wave > 0 && wave < 1 && (
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 240 * k * wave, height: 240 * k * wave, marginLeft: -120 * k * wave, marginTop: -120 * k * wave, borderRadius: "50%", border: `${4 * k}px solid ${following ? IG_BLUE : "#fff"}`, opacity: 1 - wave }} />
          )}
          {finger > 0.01 && (
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 76 * k, height: 76 * k, marginLeft: -38 * k + (1 - finger) * 180 * k, marginTop: -38 * k + (1 - finger) * 150 * k, borderRadius: "50%", background: "rgba(255,255,255,0.55)", border: "3px solid rgba(11,13,18,0.2)", boxShadow: "0 10px 24px rgba(11,13,18,0.3)", opacity: finger, transform: `scale(${1 - press * 0.2})` }} />
          )}
        </div>
        <div style={btn(IG_GRAY, INK)}>Mensagem</div>
        <div style={btn(IG_GRAY, INK)}>Contactar</div>
        <div style={{ ...btn(IG_GRAY, INK), flex: "none", width: 78 * k }}>
          <Ico d="M15 19c0-3-2.5-5-6-5s-6 2-6 5M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7zM19 8v6M16 11h6" s={36 * k} w={2} />
        </div>
      </div>
    </div>
  );
};
