import React, { useMemo } from "react";
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { theme } from "../theme";

// Iluminação de estúdio partilhada: softboxes brancas + recorte turquesa.
// Tudo local (sem HDR externo), para reflexos metálicos realistas.
export const StudioLights: React.FC<{ rim?: number }> = ({ rim = 1 }) => (
  <>
    <ambientLight intensity={0.25} />
    <directionalLight position={[3, 5, 6]} intensity={1.6} />
    <directionalLight position={[-4, -2, 3]} intensity={0.35} />
    <Environment resolution={256}>
      {/* estúdio cinza: os metais refletem cinza, nunca preto */}
      <color attach="background" args={[theme.colors.envGray]} />
      <Lightformer form="rect" intensity={3.2} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={1.8} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
      <Lightformer form="rect" intensity={1.4} position={[5, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[6, 0.8, 1]} />
      <Lightformer
        form="rect"
        color={theme.colors.primary}
        intensity={2.6 * rim}
        position={[0, -1, -5]}
        scale={[12, 1.5, 1]}
      />
      <Lightformer form="ring" intensity={0.55} position={[2, 3, 4]} scale={1.6} />
    </Environment>
  </>
);

// Textura radial para brilhos (sprites aditivos).
export const useGlowTexture = (color: string) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, color);
    g.addColorStop(0.35, color.replace(/[\d.]+\)$/, "0.35)"));
    g.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [color]);

export const GlowSprite: React.FC<{
  color: string;
  scale: number;
  opacity: number;
  position?: [number, number, number];
}> = ({ color, scale, opacity, position = [0, 0, 0] }) => {
  const tex = useGlowTexture(color);
  return (
    <mesh position={position} renderOrder={10}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
};
