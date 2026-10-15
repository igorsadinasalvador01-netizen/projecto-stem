import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { clamp } from "./Motion";

// O perfil ORIGINAL do autor (captura do Instagram, sem alterações), para fechar SEMPRE
// os vídeos com "siga". Ficheiro único: public/perfil/perfil.png (1206×930).
// Por cima só entra a animação do toque em "Seguir" — a imagem nunca é alterada.
export const PERFIL_IMG = { src: "perfil/perfil.png", w: 1206, h: 930 };
// botão "Seguir" na captura (px da imagem original)
const FOLLOW = { x: 48, y: 797, w: 323, h: 94, r: 18 };

export const PerfilCard: React.FC<{ tapAt: number; width?: number }> = ({ tapAt, width = 1000 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pad = 22;
  const k = (width - 2 * pad) / PERFIL_IMG.w;
  const bx = pad + FOLLOW.x * k;
  const by = pad + FOLLOW.y * k;
  const bw = FOLLOW.w * k;
  const bh = FOLLOW.h * k;
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  // dedo a chegar, toque, onda e anel de destaque à volta do botão
  const finger = interpolate(frame, [tapAt - 16, tapAt - 1], [0, 1], { easing: theme.ease.inOut, ...clamp }) * interpolate(frame, [tapAt + 10, tapAt + 18], [1, 0], clamp);
  const press = interpolate(frame - tapAt, [-4, 0, 7], [0, 1, 0], clamp);
  const wave = interpolate(frame - tapAt, [0, 20], [0, 1], { easing: theme.ease.out, ...clamp });
  const hint = interpolate(frame, [tapAt - 30, tapAt - 12], [0, 1], clamp) * (1 - interpolate(frame, [tapAt + 24, tapAt + 40], [0, 1], clamp));
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
  const burst = spring({ frame: frame - tapAt, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } });
  return (
    <div style={{ position: "relative", width, height: PERFIL_IMG.h * k + 2 * pad, borderRadius: 44, background: "#FFFFFF", border: "1.5px solid rgba(11,13,18,0.07)", boxShadow: "0 60px 110px -40px rgba(11,13,18,0.38), 0 10px 30px -14px rgba(11,13,18,0.16)" }}>
      <div style={{ position: "absolute", left: pad, top: pad, width: PERFIL_IMG.w * k, height: PERFIL_IMG.h * k, borderRadius: 20, overflow: "hidden" }}>
        <Img src={staticFile(PERFIL_IMG.src)} style={{ width: "100%", height: "100%", display: "block", transform: `scale(${1 + Math.min(frame, 90) * 0.00012})`, transformOrigin: "50% 40%" }} />
      </div>
      {/* anel a convidar ao toque (fora do botão) */}
      <div style={{ position: "absolute", left: bx - 8, top: by - 8, width: bw + 16, height: bh + 16, borderRadius: FOLLOW.r * k + 8, border: `4px solid rgba(74,93,249,${0.35 + 0.45 * pulse})`, opacity: hint, transform: `scale(${1 - press * 0.04})` }} />
      {/* toque: escurece levemente o botão por um instante, onda e brilhos */}
      <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, borderRadius: FOLLOW.r * k, background: "rgba(0,0,0,1)", opacity: press * 0.18 }} />
      {wave > 0 && wave < 1 && (
        <div style={{ position: "absolute", left: cx - 150 * wave, top: cy - 150 * wave, width: 300 * wave, height: 300 * wave, borderRadius: "50%", border: "5px solid rgba(74,93,249,0.9)", opacity: 1 - wave }} />
      )}
      {burst > 0.01 &&
        Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const d = 40 + burst * 110;
          return <div key={i} style={{ position: "absolute", left: cx + Math.cos(a) * d - 6, top: cy + Math.sin(a) * d * 0.7 - 6, width: 12, height: 12, borderRadius: 6, background: i % 2 ? "#4A5DF9" : "#FFB300", opacity: interpolate(frame - tapAt, [8, 22], [1, 0], clamp) }} />;
        })}
      {finger > 0.01 && (
        <div style={{ position: "absolute", left: cx - 40 + (1 - finger) * 200, top: cy - 40 + (1 - finger) * 170, width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.55)", border: "3px solid rgba(11,13,18,0.22)", boxShadow: "0 12px 26px rgba(11,13,18,0.3)", backdropFilter: "blur(3px)", opacity: finger, transform: `scale(${1 - press * 0.2})` }} />
      )}
    </div>
  );
};
