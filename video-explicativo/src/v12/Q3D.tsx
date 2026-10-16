import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { Environment, Lightformer } from "@react-three/drei";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, EZ } from "../kit/Kit";
import { useGlowTexture } from "../components/Studio3D";
import { T12 } from "./theme12";

// "?" de vidro: tubo contínuo + esfera, material físico com transmissão e irisação.
const QMark: React.FC<{ spin: number; float: number }> = ({ spin, float }) => {
  const tube = useMemo(() => {
    const pts = [
      [-0.62, 0.62],
      [-0.5, 1.02],
      [-0.12, 1.24],
      [0.36, 1.18],
      [0.64, 0.86],
      [0.6, 0.48],
      [0.3, 0.2],
      [0.04, -0.02],
      [0.0, -0.36],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5), 220, 0.17, 40, false);
  }, []);
  const mat = (
    <meshPhysicalMaterial
      color="#F4EFE6"
      transmission={1}
      thickness={1.1}
      roughness={0.06}
      ior={1.45}
      iridescence={0.12}
      iridescenceIOR={1.3}
      clearcoat={1}
      attenuationColor="#E3D3B3"
      attenuationDistance={3.2}
      envMapIntensity={1.6}
    />
  );
  return (
    <group rotation={[0.1, spin, 0]} position={[0, float, 0]}>
      <mesh geometry={tube}>{mat}</mesh>
      {/* tampas arredondadas nas pontas */}
      <mesh position={[-0.62, 0.62, 0]}>
        <sphereGeometry args={[0.17, 40, 40]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.36, 0]}>
        <sphereGeometry args={[0.17, 40, 40]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.86, 0]}>
        <sphereGeometry args={[0.24, 48, 48]} />
        {mat}
      </mesh>
    </group>
  );
};

export const GlassQuestion: React.FC<{ width: number; height: number; at?: number; color2?: string }> = ({ width, height, at = 0, color2 = T12.coral }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const intro = interpolate(frame, [at * fps, at * fps + 0.9 * fps], [0, 1], { easing: EZ.out, ...clamp });
  const spin = (1 - intro) * -2.4 + Math.sin(t * 0.7) * 0.45;
  const glowV = useGlowTexture("rgba(214,193,154,0.95)");
  const glowC = useGlowTexture(color2 === T12.mint ? "rgba(141,181,154,0.8)" : "rgba(210,104,90,0.75)");
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0.2, 5.2], fov: 32 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-2.5, 1, 2]} intensity={14} color={T12.violet} />
      <pointLight position={[2.5, -1, 2]} intensity={10} color={color2} />
      <Environment resolution={256}>
        <color attach="background" args={["#1A1B1E"]} />
        <Lightformer form="rect" intensity={4} position={[0, 4, 2]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={3} color={T12.violet} position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} />
        <Lightformer form="rect" intensity={2.6} color={color2} position={[4, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[5, 1.5, 1]} />
        <Lightformer form="ring" intensity={2} color={T12.mint} position={[0, -3, -3]} scale={3} />
      </Environment>
      {/* brilhos atrás do vidro: a refração ganha cor */}
      <sprite position={[-0.6, 0.5, -2]} scale={[4.2, 4.2, 1]}>
        <spriteMaterial map={glowV} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite position={[0.8, -0.6, -2.4]} scale={[3.4, 3.4, 1]}>
        <spriteMaterial map={glowC} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
      </sprite>
      <group scale={intro * 0.82} position={[0, -0.12, 0]}>
        <QMark spin={spin} float={Math.sin(t * 1.3) * 0.06} />
      </group>
    </ThreeCanvas>
  );
};
