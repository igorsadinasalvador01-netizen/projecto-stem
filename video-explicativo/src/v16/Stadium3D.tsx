import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, EZ } from "../kit/Kit";
import { useGlowTexture } from "../components/Studio3D";

// Relvado à noite em three.js: linhas da grande área, baliza com rede, bancada escura,
// refletores e uma bola de futebol (12 pentágonos sobre a esfera) a rematar.
export type Kick = { at: number; kind: "goal" | "wide" | "post" | "over"; tx: number; ty: number };
export const KICKS: Kick[] = [
  { at: 8.9, kind: "wide", tx: 5.4, ty: 1.2 },
  { at: 9.75, kind: "post", tx: 3.62, ty: 1.3 },
  { at: 10.6, kind: "goal", tx: -2.2, ty: 1.6 },
  { at: 14.6, kind: "over", tx: 1.2, ty: 3.4 },
  { at: 15.2, kind: "wide", tx: -5.2, ty: 0.8 },
  { at: 15.84, kind: "goal", tx: 2.6, ty: 1.7 },
  { at: 16.4, kind: "goal", tx: -2.9, ty: 0.6 },
  { at: 16.95, kind: "goal", tx: 3.0, ty: 2.1 },
  { at: 17.68, kind: "goal", tx: -2.6, ty: 2.05 },
];
export const FLIGHT = 0.5;
const BALL_BACK = [13.45];
const R = 0.24; // bola estilizada (maior que a real, para ler no vertical)
const GOAL_Z = -11;

// placar acumulado até ao instante t
export const score = (t: number) => {
  const done = KICKS.filter((k) => t >= k.at + FLIGHT);
  return { shots: done.length, goals: done.filter((k) => k.kind === "goal").length };
};

const usePitchTexture = () =>
  useMemo(() => {
    const W = 1024,
      H = 1024;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;
    const X = (x: number) => ((x + 22) / 44) * W;
    const Z = (z: number) => ((z + 14) / 34) * H;
    for (let i = 0; i < 17; i++) {
      g.fillStyle = i % 2 ? "#2F5D45" : "#2A553F";
      g.fillRect(0, Z(-14 + i * 2), W, Z(-12 + i * 2) - Z(-14 + i * 2) + 1);
    }
    g.strokeStyle = "rgba(242,244,239,0.92)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(0, Z(GOAL_Z));
    g.lineTo(W, Z(GOAL_Z));
    g.rect(X(-20.15), Z(GOAL_Z), X(20.15) - X(-20.15), Z(5.5) - Z(GOAL_Z));
    g.rect(X(-9.15), Z(GOAL_Z), X(9.15) - X(-9.15), Z(-5.5) - Z(GOAL_Z));
    g.stroke();
    g.beginPath();
    g.ellipse(X(0), Z(0), X(9.15) - X(0), Z(9.15) - Z(0), 0, Math.asin(5.5 / 9.15), Math.PI - Math.asin(5.5 / 9.15));
    g.stroke();
    g.fillStyle = "rgba(242,244,239,0.95)";
    g.beginPath();
    g.ellipse(X(0), Z(0), 3, 3, 0, 0, Math.PI * 2);
    g.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
const useNetTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.strokeStyle = "rgba(242,244,239,0.75)";
    g.lineWidth = 2;
    for (let i = 0; i <= 256; i += 16) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i, 256);
      g.moveTo(0, i);
      g.lineTo(256, i);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 2.4);
    return tex;
  }, []);
const useCrowdTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, "#0B110F");
    grd.addColorStop(1, "#16211C");
    g.fillStyle = grd;
    g.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 2600; i++) {
      const x = random(`cx${i}`) * 1024;
      const y = 40 + random(`cy${i}`) * 200;
      g.fillStyle = `rgba(242,244,239,${0.04 + random(`ca${i}`) * 0.12})`;
      g.fillRect(x, y, 3, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

const Ball: React.FC<{ pos: [number, number, number]; spin: number; scale: number }> = ({ pos, spin, scale }) => {
  const patches = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1, 0);
    const p = ico.attributes.position;
    const seen: THREE.Vector3[] = [];
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)).normalize();
      if (!seen.some((s) => s.distanceTo(v) < 1e-3)) seen.push(v);
    }
    return seen;
  }, []);
  return (
    <group position={pos} rotation={[spin, spin * 0.6, 0]} scale={scale}>
      <mesh>
        <sphereGeometry args={[R, 48, 48]} />
        <meshStandardMaterial color="#F4F5F2" roughness={0.45} />
      </mesh>
      {patches.map((v, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), v);
        return (
          <mesh key={i} position={v.clone().multiplyScalar(R * 1.002)} quaternion={q}>
            <circleGeometry args={[R * 0.34, 5]} />
            <meshStandardMaterial color="#1A1D1B" roughness={0.5} />
          </mesh>
        );
      })}
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

// trajectória da bola: arco do ponto de penálti até ao alvo; golo fica na rede
const flight = (k: Kick, u: number): [number, number, number] => {
  const e = EZ.out(Math.min(1, u));
  const end: [number, number, number] = k.kind === "goal" ? [k.tx, k.ty, GOAL_Z - 1.2] : k.kind === "post" ? [k.tx, k.ty, GOAL_Z] : [k.tx * 1.25, k.ty * 1.1, GOAL_Z - 5];
  const x = interpolate(e, [0, 1], [0, end[0]]);
  const z = interpolate(e, [0, 1], [0, end[2]]);
  const y = R + interpolate(e, [0, 1], [0, end[1] - R]) + Math.sin(Math.PI * e) * 0.9;
  if (u <= 1) return [x, y, z];
  const v = Math.min(1, (u - 1) / 0.6);
  if (k.kind === "goal") return [end[0], Math.max(R, end[1] - v * v * end[1]), end[2]];
  if (k.kind === "post") return [end[0] - v * 1.6, Math.max(R, end[1] - v * 1.2), end[2] + v * 3];
  return end;
};

export const Stadium3D: React.FC<{ width: number; height: number; offset: number; cam: (t: number) => { pos: [number, number, number]; look: [number, number, number] }; ballFrom?: number }> = ({ width, height, offset, cam, ballFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = offset + frame / fps;
  const pitch = usePitchTexture();
  const net = useNetTexture();
  const crowd = useCrowdTexture();
  const glow = useGlowTexture("rgba(242,244,239,0.95)");
  // remate em curso (ou o último)
  const last = [...KICKS].reverse().find((k) => t >= k.at);
  const next = KICKS.find((k) => k.at > t);
  let ball: [number, number, number] = [0, R, 0];
  let spin = 0;
  let scale = interpolate(t, [ballFrom, ballFrom + 0.35], [0, 1], { easing: EZ.out, ...clamp });
  if (last) {
    const u = (t - last.at) / FLIGHT;
    // a bola volta ao ponto de penálti antes do remate seguinte (e quando "pega a bola")
    const resets = [...BALL_BACK, ...(next ? [next.at - 0.3] : [])].filter((r) => r > last.at + FLIGHT);
    const resetAt = resets.length ? Math.min(...resets) : Infinity;
    if (t < resetAt) {
      ball = flight(last, u);
      spin = u * 9;
    } else {
      scale = interpolate(t, [resetAt, resetAt + 0.2], [0, 1], { easing: EZ.out, ...clamp });
    }
  }
  // a rede estufa quando a bola entra
  const g = last && last.kind === "goal" ? (t - last.at) / FLIGHT : 0;
  const bulge = last && last.kind === "goal" ? Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (g - 0.75) / 1.1)))) : 0;
  const post = last && last.kind === "post" ? Math.max(0, 1 - Math.abs((t - last.at - FLIGHT) / 0.25)) : 0;
  const c = cam(t);
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: c.pos, fov: 60, near: 0.1, far: 200 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} style={{ background: "transparent" }}>
      <CamRig pos={c.pos} look={c.look} />
      <ambientLight intensity={0.45} color="#DDE8E0" />
      <directionalLight position={[-8, 14, 6]} intensity={1.5} />
      <directionalLight position={[8, 12, -14]} intensity={0.8} color="#E8EEF0" />
      {/* relvado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3]}>
        <planeGeometry args={[44, 34]} />
        <meshStandardMaterial map={pitch} roughness={0.95} />
      </mesh>
      {/* bancada ao fundo */}
      <mesh position={[0, 5, -24]}>
        <planeGeometry args={[80, 12]} />
        <meshBasicMaterial map={crowd} />
      </mesh>
      {/* refletores */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <sprite position={[s * 16, 15, -22]} scale={[9, 9, 1]}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.9} />
          </sprite>
          <mesh position={[s * 16, 15, -22.5]}>
            <boxGeometry args={[3, 1.4, 0.3]} />
            <meshBasicMaterial color="#F7F8F4" />
          </mesh>
        </group>
      ))}
      {/* baliza */}
      <group position={[0, 0, GOAL_Z]}>
        {[-3.66, 3.66].map((x) => (
          <mesh key={x} position={[x, 1.22, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 2.44, 20]} />
            <meshStandardMaterial color={post > 0 && x > 0 ? "#FFFFFF" : "#ECEFEA"} emissive="#ffffff" emissiveIntensity={post * 0.8 * (x > 0 ? 1 : 0)} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 2.44, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 7.46, 20]} />
          <meshStandardMaterial color="#ECEFEA" roughness={0.3} />
        </mesh>
        {/* rede: fundo, tecto e lados */}
        <mesh position={[0, 1.1, -1.9 - bulge * 0.45]} scale={[1, 1, 1]}>
          <planeGeometry args={[7.32, 2.2]} />
          <meshBasicMaterial map={net} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, 2.32, -0.95 - bulge * 0.2]} rotation={[-Math.PI / 2 + 0.12, 0, 0]}>
          <planeGeometry args={[7.32, 1.95]} />
          <meshBasicMaterial map={net} transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {[-3.66, 3.66].map((x) => (
          <mesh key={x} position={[x, 1.2, -0.95]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.9, 2.4]} />
            <meshBasicMaterial map={net} transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {/* sombra da bola */}
      <mesh position={[ball[0], 0.01, ball[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * (1.3 - Math.min(0.6, (ball[1] - R) * 0.3)), 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35 * scale} depthWrite={false} />
      </mesh>
      <Ball pos={ball} spin={spin} scale={scale} />
    </ThreeCanvas>
  );
};
