import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { RoundedBox } from "@react-three/drei";
import { theme } from "../theme";
import { GlowSprite, StudioLights } from "./Studio3D";

// Barra arredondada entre dois pontos (para desenhar o visto em 3D).
const Stroke: React.FC<{ a: [number, number]; b: [number, number]; w: number; glow: number }> = ({
  a,
  b,
  w,
  glow,
}) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) + w;
  return (
    <RoundedBox
      args={[len, w, 0.08]}
      radius={w / 2 - 0.005}
      smoothness={6}
      position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]}
      rotation={[0, 0, Math.atan2(dy, dx)]}
    >
      <meshStandardMaterial
        color={theme.colors.primary}
        emissive={theme.colors.primary}
        emissiveIntensity={glow}
        toneMapped={false}
      />
    </RoundedBox>
  );
};

const chrome = (
  <meshPhysicalMaterial color={theme.colors.chrome} metalness={1} roughness={0.16} clearcoat={0.7} />
);

// Selo 3D "primeira venda": entra a girar no "boom" e assenta.
const Seal: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = spring({ frame: frame - at, fps, config: theme.spring.heavy });
  const pop = spring({ frame: frame - at - 6, fps, config: theme.spring.bouncy });
  const z = interpolate(p, [0, 1], [-7, 0]);
  const spin = interpolate(p, [0, 1], [Math.PI * 5, 0]);
  const sway = Math.sin(t * 1.2) * 0.22 * p;
  const glow = interpolate(pop, [0, 1], [0.3, 1.2]);
  const s = interpolate(pop, [0, 1], [0.85, 1]);
  if (frame < at) return null;
  return (
    <group position={[0, Math.sin(t * 1.5) * 0.05, z]} rotation={[0.08, spin + sway, 0]} scale={s}>
      <GlowSprite color={theme.colors.glow} scale={2.9} opacity={0.5 * p} position={[0, 0, -0.4]} />
      {/* Disco */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 128]} />
        <meshPhysicalMaterial
          color={theme.colors.metalDark}
          metalness={0.6}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
      {/* Aro cromado */}
      <mesh>
        <torusGeometry args={[1, 0.085, 32, 160]} />
        {chrome}
      </mesh>
      {/* Anel interior */}
      <mesh position={[0, 0, 0.1]}>
        <torusGeometry args={[0.8, 0.018, 16, 160]} />
        {chrome}
      </mesh>
      {/* Visto turquesa */}
      <group position={[0, 0.02, 0.14]}>
        <Stroke a={[-0.36, 0.0]} b={[-0.1, -0.26]} w={0.15} glow={glow} />
        <Stroke a={[-0.1, -0.26]} b={[0.4, 0.3]} w={0.15} glow={glow} />
      </group>
      {/* Verso */}
      <group position={[0, 0, -0.12]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <torusGeometry args={[0.8, 0.018, 16, 160]} />
          {chrome}
        </mesh>
      </group>
    </group>
  );
};

export const Seal3D: React.FC<{ width: number; height: number; at: number }> = ({ width, height, at }) => (
  <ThreeCanvas
    width={width}
    height={height}
    camera={{ position: [0, 0, 6], fov: 30 }}
    gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    style={{ background: "transparent" }}
  >
    <StudioLights rim={1.3} />
    <Seal at={at} />
  </ThreeCanvas>
);
