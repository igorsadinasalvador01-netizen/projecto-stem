import React from "react";
import { theme } from "../theme";

// Painel de vidro: transparência real (backdrop blur), aresta de luz no topo,
// sombra suave em duas camadas — o "material" premium de todo o vídeo.
export const Glass: React.FC<{
  children?: React.ReactNode;
  radius?: number;
  style?: React.CSSProperties;
  strong?: boolean;
  glow?: number; // 0..1 brilho turquesa no rebordo
}> = ({ children, radius = 40, style, strong = false, glow = 0 }) => (
  <div
    style={{
      position: "relative",
      borderRadius: radius,
      backgroundColor: theme.colors.pieceTint,
      backgroundImage: `linear-gradient(160deg, ${strong ? theme.colors.glassTop : theme.colors.glassStrong} 0%, ${theme.colors.glass} 42%, ${theme.colors.whiteMist} 100%)`,
      border: `1.5px solid ${theme.colors.stroke}`,
      boxShadow: [
        `inset 0 1.5px 0 ${theme.colors.strokeStrong}`,
        `0 40px 80px -24px ${theme.colors.shadowDeep}`,
        `0 12px 24px -12px ${theme.colors.shadow}`,
        glow > 0 ? `0 0 ${60 * glow}px ${theme.colors.glow}` : "",
      ]
        .filter(Boolean)
        .join(", "),
      backdropFilter: "blur(22px) saturate(1.3)",
      WebkitBackdropFilter: "blur(22px) saturate(1.3)",
      overflow: "hidden",
      ...style,
    }}
  >
    {/* reflexo diagonal */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(115deg, transparent 30%, ${theme.colors.whiteMist} 45%, transparent 60%)`,
        pointerEvents: "none",
      }}
    />
    {children}
  </div>
);

// Sombra de contacto no "chão" por baixo de um objeto.
export const ContactShadow: React.FC<{ width: number; opacity?: number; style?: React.CSSProperties }> = ({
  width,
  opacity = 1,
  style,
}) => (
  <div
    style={{
      width,
      height: width * 0.16,
      borderRadius: "50%",
      background: `radial-gradient(ellipse at center, ${theme.colors.shadowDeep}, transparent 70%)`,
      opacity,
      ...style,
    }}
  />
);
