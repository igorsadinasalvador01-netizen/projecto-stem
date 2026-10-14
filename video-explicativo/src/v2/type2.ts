import type React from "react";
import { theme } from "../theme";
import { c2 } from "./theme2";

// Tipografia ao estilo dos anúncios de grandes marcas: contraste de peso
// (900 vs 300), muito ar, e alternância de família nas frases de impacto.
export const t2 = {
  hero: {
    fontFamily: theme.fonts.display,
    fontWeight: 900,
    letterSpacing: "-0.055em",
    lineHeight: 0.96,
    color: c2.ink,
  },
  head: {
    fontFamily: theme.fonts.display,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    lineHeight: 1.02,
    color: c2.ink,
  },
  light: {
    fontFamily: theme.fonts.display,
    fontWeight: 300,
    letterSpacing: "-0.03em",
    lineHeight: 1.08,
    color: c2.inkSoft,
  },
  impact: {
    fontFamily: theme.fonts.serif,
    fontStyle: "italic",
    fontWeight: 400,
    letterSpacing: "-0.015em",
    lineHeight: 1,
    color: c2.ink,
  },
  body: {
    fontFamily: theme.fonts.body,
    fontWeight: 500,
    color: c2.inkSoft,
  },
  mono: {
    fontFamily: theme.fonts.mono,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: c2.inkFaint,
  },
} satisfies Record<string, React.CSSProperties>;
