import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { Environment, Lightformer } from "@react-three/drei";
import { T17 } from "./theme17";

// Prédio de vidro em three.js: lajes de vidro com transmissão (transparência real), arestas
// turquesa e placas brancas entre andares. `rise` faz o prédio nascer do chão, `explode`
// separa os andares no ar (como a casa explodida da referência), `glow` acende a cor.
type BProps = { x: number; z?: number; floors: number; w: number; d: number; rise: number; explode?: number; tint?: string; edge?: string; glow?: number; spin?: number; concrete?: boolean };

const Floor: React.FC<{ w: number; h: number; d: number; tint: string; edge: string; glow: number; concrete: boolean }> = ({ w, h, d, tint, edge, glow, concrete }) => {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);
  const mullions = useMemo(() => {
    const pts: number[] = [];
    const n = Math.max(2, Math.round(w / 0.32));
    for (let i = 1; i < n; i++) {
      const x = -w / 2 + (i * w) / n;
      pts.push(x, -h / 2, d / 2 + 0.002, x, h / 2, d / 2 + 0.002);
    }
    const m = Math.max(2, Math.round(d / 0.32));
    for (let i = 1; i < m; i++) {
      const z = -d / 2 + (i * d) / m;
      pts.push(w / 2 + 0.002, -h / 2, z, w / 2 + 0.002, h / 2, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [w, h, d]);
  return (
    <group>
      {concrete ? (
        <mesh>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#9AA3AE" roughness={0.95} envMapIntensity={0.15} emissive="#3A4049" emissiveIntensity={0.4} />
        </mesh>
      ) : (
        <mesh>
          <boxGeometry args={[w, h, d]} />
          <meshPhysicalMaterial color={tint} transmission={0.9} thickness={0.8} roughness={0.06} ior={1.45} transparent opacity={0.92} attenuationColor={T17.turq} attenuationDistance={1.3} envMapIntensity={1.6} clearcoat={1} clearcoatRoughness={0.1} emissive={edge} emissiveIntensity={glow * 0.25} />
        </mesh>
      )}
      <mesh position={[0, -h / 2 + 0.02, 0]}>
        <boxGeometry args={[w * 1.04, 0.05, d * 1.04]} />
        <meshStandardMaterial color={concrete ? "#4A5462" : "#E9F1F7"} roughness={0.5} emissive={edge} emissiveIntensity={glow * 0.4} />
      </mesh>
      {!concrete && (
        <>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={edge} transparent opacity={0.9} />
          </lineSegments>
          <lineSegments geometry={mullions}>
            <lineBasicMaterial color={edge} transparent opacity={0.5} />
          </lineSegments>
        </>
      )}
    </group>
  );
};

export const Building: React.FC<BProps> = ({ x, z = 0, floors, w, d, rise, explode = 0, tint = "#9EE3EE", edge = T17.turq, glow = 0, spin = 0, concrete = false }) => {
  const h = 0.46;
  return (
    <group position={[x, 0, z]} rotation={[0, -0.55 + spin, 0]}>
      {Array.from({ length: floors }).map((_, i) => {
        const appear = Math.max(0, Math.min(1, rise * floors - i));
        if (appear <= 0) return null;
        const y = h / 2 + i * h + explode * i * 0.42;
        const side = (i % 2 ? 1 : -1) * explode * 0.18;
        return (
          <group key={i} position={[side, y - (1 - appear) * 0.4, 0]} scale={[1, appear, 1]} rotation={[0, explode * (i % 2 ? 0.12 : -0.12), 0]}>
            <Floor w={w} h={h} d={d} tint={tint} edge={edge} glow={glow} concrete={concrete} />
          </group>
        );
      })}
      {/* cobertura */}
      {rise > 0.98 && !concrete && (
        <mesh position={[0, floors * h + (floors - 1) * explode * 0.42 + 0.04 + explode * 0.4, 0]}>
          <boxGeometry args={[w * 0.6, 0.08, d * 0.6]} />
          <meshStandardMaterial color="#E9F1F7" emissive={edge} emissiveIntensity={glow * 0.5} />
        </mesh>
      )}
      {/* anel no chão (como o da casa na referência) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[rise, rise, 1]}>
        <ringGeometry args={[Math.max(w, d) * 0.85, Math.max(w, d) * 0.9, 64]} />
        <meshBasicMaterial color={edge} transparent opacity={0.55} />
      </mesh>
    </group>
  );
};

const CamRig: React.FC<{ pos: [number, number, number]; look: [number, number, number] }> = ({ pos, look }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...pos);
  camera.lookAt(...look);
  camera.updateProjectionMatrix();
  return null;
};

export const Scene3D: React.FC<{ width: number; height: number; cam: { pos: [number, number, number]; look: [number, number, number] }; fov?: number; children: React.ReactNode }> = ({ width, height, cam, fov = 40, children }) => (
  <ThreeCanvas width={width} height={height} camera={{ position: cam.pos, fov }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} style={{ background: "transparent" }}>
    <CamRig pos={cam.pos} look={cam.look} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 6, 5]} intensity={1.6} />
    <pointLight position={[-3, 2, 3]} intensity={10} color={T17.turq} />
    <pointLight position={[3, 1, 2]} intensity={4.5} color={T17.blue} />
    <Environment resolution={256}>
      <color attach="background" args={["#0F2440"]} />
      <Lightformer form="rect" intensity={3.5} position={[0, 5, 3]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={2.4} color={T17.turq} position={[-4, 1, 2]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} />
      <Lightformer form="rect" intensity={2} color={T17.blue} position={[4, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[5, 1.5, 1]} />
    </Environment>
    {children}
  </ThreeCanvas>
);
