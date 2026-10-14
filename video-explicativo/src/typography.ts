import type React from "react";
import { theme } from "./theme";

// Alternância de fontes: cada papel tem a sua voz tipográfica.
//  - display: frases de contexto (sans forte, apertada)
//  - impact:  frases de impacto (serifa itálica, editorial) — o "destaque"
//  - body:    texto de apoio
//  - mono:    dados, etiquetas e números de sistema
export const type = {
  display: {
    fontFamily: theme.fonts.display,
    fontWeight: 800,
    letterSpacing: "-0.045em",
    lineHeight: 1.02,
    color: theme.colors.text,
  },
  impact: {
    fontFamily: theme.fonts.serif,
    fontStyle: "italic",
    fontWeight: 400,
    letterSpacing: "-0.015em",
    lineHeight: 1,
    color: theme.colors.text,
  },
  body: {
    fontFamily: theme.fonts.body,
    fontWeight: 500,
    color: theme.colors.textDim,
  },
  mono: {
    fontFamily: theme.fonts.mono,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: theme.colors.textFaint,
  },
} satisfies Record<string, React.CSSProperties>;
