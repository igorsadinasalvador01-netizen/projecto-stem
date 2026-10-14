import React from "react";

// Ícones de linha desenhados em SVG (sem emoji), herdam a cor via currentColor.
type P = { size?: number; stroke?: number; color?: string };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 56, stroke = 2.2, color, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color ?? "currentColor"}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const IconBriefcase: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
    <path d="M3 12.5h18" />
  </Svg>
);

export const IconUsers: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
    <path d="M16 5.2a3.4 3.4 0 0 1 0 6.6" />
    <path d="M18.5 14.8c1.6.8 2.7 2.6 3 5.2" />
  </Svg>
);

export const IconWallet: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M19 7V5.8A1.8 1.8 0 0 0 17.2 4H5.5A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a2.5 2.5 0 0 0 2.5-2.5v-8A2.5 2.5 0 0 0 18.5 7H5.5" />
    <circle cx="16.5" cy="13.5" r="1.2" />
  </Svg>
);

export const IconEye: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconPlay: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </Svg>
);

export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </Svg>
);

export const IconArrow: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Svg>
);

export const IconBag: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Svg>
);
