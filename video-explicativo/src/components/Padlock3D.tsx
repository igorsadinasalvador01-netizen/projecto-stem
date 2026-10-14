import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { RoundedBox } from "@react-three/drei";
import { theme } from "../theme";
import { clamp } from "./Motion";
import { GlowSprite, StudioLights } from "./Studio3D";

// Cadeado 3D: "o segredo". Cai em cena, roda devagar e abre no impacto.
const Padlock: React.FC<{ dropAt: number; unlockAt: number; glowAt: number }> = ({
  dropAt,
  unlockAt,
  glowAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const drop = spring({ frame: frame - dropAt, fps, config: theme.spring.heavy });
  const unlock = spring({ frame: frame - unlockAt, fps, config: theme.spring.bouncy });
  const glow = spring({ frame: frame - glowAt, fps, config: theme.spring.settle });

  const y = interpolate(drop, [0, 1], [3.2, 0]);
  const spinIn = interpolate(drop, [0, 1], [-1.4, 0]);
  const sway = Math.sin(t * 1.1) * 0.32;
  const bob = Math.sin(t * 1.6) * 0.04;
  const lift = interpolate(unlock, [0, 1], [0, 0.3]);
  const swing = interpolate(unlock, [0, 1], [0, 0.85]);
  const keyGlow = interpolate(glow, [0, 1], [0.15, 1]) + interpolate(unlock, [0, 1], [0, 0.8]);

  return (
    <group position={[0, y + bob - 0.2, 0]} rotation={[0.12, spinIn + sway - 0.25, 0.04]}>
      {/* Corpo */}
      <RoundedBox args={[1.8, 1.45, 0.66]} radius={0.17} smoothness={8}>
        <meshPhysicalMaterial
          color={theme.colors.metalDark}
          metalness={0.62}
          roughness={0.34}
          clearcoat={1}
          clearcoatRoughness={0.14}
        />
      </RoundedBox>
      {/* Placa frontal em vidro escuro */}
      <RoundedBox args={[1.42, 1.08, 0.04]} radius={0.12} smoothness={6} position={[0, 0, 0.33]}>
        <meshPhysicalMaterial
          color={theme.colors.pieceDark}
          metalness={0.2}
          roughness={0.08}
          clearcoat={1}
          transmission={0.15}
          thickness={0.2}
        />
      </RoundedBox>
      {/* Fechadura turquesa */}
      <group position={[0, 0.06, 0.36]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.03, 48]} />
          <meshStandardMaterial
            color={theme.colors.primary}
            emissive={theme.colors.primary}
            emissiveIntensity={keyGlow * 1.25}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.03]} />
          <meshStandardMaterial
            color={theme.colors.primary}
            emissive={theme.colors.primary}
            emissiveIntensity={keyGlow * 1.25}
            toneMapped={false}
          />
        </mesh>
        <GlowSprite color={theme.colors.glow} scale={1.6} opacity={0.55 * keyGlow} position={[0, -0.08, 0.05]} />
      </group>
      {/* Arco (pivô na perna direita) */}
      <group position={[0.5, 0.72 + lift, 0]} rotation={[0, swing, 0]}>
        <group position={[-0.5, 0, 0]}>
          <mesh position={[0, 0.42, 0]}>
            <torusGeometry args={[0.5, 0.115, 32, 96, Math.PI]} />
            <meshPhysicalMaterial color={theme.colors.chrome} metalness={1} roughness={0.14} clearcoat={0.6} />
          </mesh>
          <mesh position={[-0.5, 0.14, 0]}>
            <cylinderGeometry args={[0.115, 0.115, 0.56, 32]} />
            <meshPhysicalMaterial color={theme.colors.chrome} metalness={1} roughness={0.14} clearcoat={0.6} />
          </mesh>
          {/* perna longa (pivô): continua dentro do corpo quando abre */}
          <mesh position={[0.5, -0.06, 0]}>
            <cylinderGeometry args={[0.115, 0.115, 0.96, 32]} />
            <meshPhysicalMaterial color={theme.colors.chrome} metalness={1} roughness={0.14} clearcoat={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export const Padlock3D: React.FC<{
  width: number;
  height: number;
  dropAt: number;
  unlockAt: number;
  glowAt: number;
}> = ({ width, height, dropAt, unlockAt, glowAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rim = interpolate(frame, [unlockAt, unlockAt + 0.3 * fps], [0.6, 1.6], { easing: theme.ease.out, ...clamp });
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0.3, 6.8], fov: 30 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ background: "transparent" }}
    >
      <StudioLights rim={rim} />
      <Padlock dropAt={dropAt} unlockAt={unlockAt} glowAt={glowAt} />
    </ThreeCanvas>
  );
};
