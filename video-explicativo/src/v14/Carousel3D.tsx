import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, EZ } from "../kit/Kit";
import { useGlowTexture } from "../components/Studio3D";

// Carrossel 3D de produtos (three.js): oito objetos modelados com primitivas, em materiais
// limpos — aço escovado, cerâmica branca, tecido, pintura azul-aço — sobre estúdio claro.
export const PRODUCTS = ["Panela", "Eletrônicos", "Roupa de cama", "Imóveis", "Automóveis", "Software de gestão", "Tratores", "Consórcio"];
export const PRODUCT_AT = [16.56, 17.84, 19.04, 20.48, 21.28, 22.24, 24.64, 26.08];

const steel = <meshStandardMaterial color="#C9CED3" metalness={1} roughness={0.22} />;
const graphite = <meshStandardMaterial color="#22262A" metalness={0.2} roughness={0.5} />;
const rubber = <meshStandardMaterial color="#1B1D20" roughness={0.85} />;
const darkGlass = <meshPhysicalMaterial color="#1A2129" metalness={0.3} roughness={0.06} clearcoat={1} />;

const Pan: React.FC = () => (
  <group position={[0, -0.25, 0]}>
    <mesh position={[0, 0.27, 0]}>
      <cylinderGeometry args={[0.66, 0.6, 0.56, 72, 1, true]} />
      <meshStandardMaterial color="#C9CED3" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.6, 72]} />
      {steel}
    </mesh>
    <mesh position={[0, 0.55, 0]} scale={[1, 0.4, 1]}>
      <sphereGeometry args={[0.68, 72, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#D5D9DD" metalness={1} roughness={0.15} />
    </mesh>
    <mesh position={[0, 0.86, 0]}>
      <sphereGeometry args={[0.09, 32, 32]} />
      {graphite}
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.8, 0.42, 0]}>
        <boxGeometry args={[0.3, 0.07, 0.16]} />
        {graphite}
      </mesh>
    ))}
  </group>
);
const Phone: React.FC = () => (
  <group rotation={[0, 0, -0.08]}>
    <RoundedBox args={[0.84, 1.66, 0.09]} radius={0.08} smoothness={6}>
      <meshStandardMaterial color="#2A2F35" metalness={0.8} roughness={0.25} />
    </RoundedBox>
    <mesh position={[0, 0, 0.047]}>
      <planeGeometry args={[0.76, 1.56]} />
      <meshStandardMaterial color="#1C2733" emissive="#3E5C76" emissiveIntensity={0.45} roughness={0.08} />
    </mesh>
    {[0.42, 0.22, 0.02].map((y, i) => (
      <mesh key={y} position={[-0.08 + i * 0.04, y, 0.05]}>
        <planeGeometry args={[0.5 - i * 0.08, 0.1]} />
        <meshBasicMaterial color="#DDE3E9" transparent opacity={0.85 - i * 0.2} />
      </mesh>
    ))}
  </group>
);
const Linen: React.FC = () => (
  <group position={[0, -0.35, 0]}>
    {["#FFFFFF", "#DCD3C4", "#9FB3C4"].map((c, i) => (
      <RoundedBox key={c} args={[1.4, 0.2, 0.95]} radius={0.08} smoothness={5} position={[i * 0.04 - 0.04, i * 0.21, 0]} rotation={[0, (i - 1) * 0.06, 0]}>
        <meshStandardMaterial color={c} roughness={0.95} />
      </RoundedBox>
    ))}
    <RoundedBox args={[0.95, 0.24, 0.55]} radius={0.11} smoothness={6} position={[0, 0.7, 0]}>
      <meshStandardMaterial color="#F4F1EC" roughness={0.9} />
    </RoundedBox>
  </group>
);
const House: React.FC = () => {
  const roof = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.78, 0);
    s.lineTo(0.78, 0);
    s.lineTo(0, 0.55);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.04, bevelEnabled: false });
    g.translate(0, 0, -0.52);
    return g;
  }, []);
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.3, 0.8, 0.92]} />
        <meshStandardMaterial color="#F3F4F5" roughness={0.6} />
      </mesh>
      <mesh geometry={roof} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#2B3036" roughness={0.55} />
      </mesh>
      <mesh position={[0.25, 0.02, 0.465]}>
        <boxGeometry args={[0.22, 0.42, 0.02]} />
        {graphite}
      </mesh>
      {[-0.3, 0.55].map((x) => (
        <mesh key={x} position={[x === 0.55 ? -0.32 : x, 0.32, 0.465]}>
          <boxGeometry args={[0.26, 0.22, 0.02]} />
          <meshStandardMaterial color="#B8C9D8" emissive="#8FA7BC" emissiveIntensity={0.25} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};
const Car: React.FC = () => (
  <group position={[0, -0.25, 0]}>
    <RoundedBox args={[1.8, 0.38, 0.82]} radius={0.14} smoothness={6} position={[0, 0.1, 0]}>
      <meshPhysicalMaterial color="#3E5C76" metalness={0.6} roughness={0.28} clearcoat={1} clearcoatRoughness={0.08} />
    </RoundedBox>
    <RoundedBox args={[0.92, 0.3, 0.68]} radius={0.12} smoothness={6} position={[-0.14, 0.38, 0]}>
      <meshPhysicalMaterial color="#3A4A58" metalness={0.4} roughness={0.08} clearcoat={1} />
    </RoundedBox>
    {[-0.58, 0.58].flatMap((x) =>
      [-0.42, 0.42].map((z) => (
        <group key={`${x}${z}`} position={[x, -0.1, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.21, 0.21, 0.14, 40]} />
            {rubber}
          </mesh>
          <mesh position={[0, z > 0 ? 0.072 : -0.072, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.01, 32]} />
            {steel}
          </mesh>
        </group>
      )),
    )}
  </group>
);
const Laptop: React.FC = () => {
  const bars = [0.25, 0.42, 0.33, 0.58, 0.7];
  return (
    <group position={[0, -0.45, 0.1]}>
      <RoundedBox args={[1.56, 0.06, 1.04]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color="#C9CED3" metalness={0.9} roughness={0.3} />
      </RoundedBox>
      <group position={[0, 0.03, -0.5]} rotation={[-0.22, 0, 0]}>
        <RoundedBox args={[1.56, 1.02, 0.04]} radius={0.03} smoothness={4} position={[0, 0.51, 0]}>
          <meshStandardMaterial color="#C9CED3" metalness={0.9} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.51, 0.021]}>
          <planeGeometry args={[1.46, 0.92]} />
          <meshStandardMaterial color="#16202A" emissive="#1E2C3A" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
        {bars.map((h, i) => (
          <mesh key={i} position={[-0.48 + i * 0.24, 0.16 + h * 0.5, 0.024]}>
            <planeGeometry args={[0.14, h]} />
            <meshBasicMaterial color={i === bars.length - 1 ? "#8FA7BC" : "#4F6B84"} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
const Tractor: React.FC = () => {
  const paint = <meshStandardMaterial color="#5E8C6A" metalness={0.3} roughness={0.45} />;
  return (
    <group position={[0, -0.15, 0]} scale={0.95}>
      <mesh position={[0.05, 0.05, 0]}>
        <boxGeometry args={[1.1, 0.42, 0.56]} />
        {paint}
      </mesh>
      <mesh position={[0.68, -0.02, 0]}>
        <boxGeometry args={[0.5, 0.32, 0.46]} />
        {paint}
      </mesh>
      <mesh position={[-0.28, 0.55, 0]}>
        <boxGeometry args={[0.56, 0.58, 0.56]} />
        {darkGlass}
      </mesh>
      <mesh position={[-0.28, 0.86, 0]}>
        <boxGeometry args={[0.66, 0.05, 0.64]} />
        {paint}
      </mesh>
      <mesh position={[0.62, 0.42, 0.12]}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 16]} />
        {graphite}
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[-0.36, -0.18, s * 0.42]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.22, 40]} />
            {rubber}
          </mesh>
          <mesh position={[0.66, -0.34, s * 0.34]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 32]} />
            {rubber}
          </mesh>
        </group>
      ))}
    </group>
  );
};
const Coins: React.FC = () => (
  <group position={[0, -0.5, 0]}>
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} position={[Math.sin(i * 1.7) * 0.03 - 0.25, 0.05 + i * 0.1, Math.cos(i * 1.3) * 0.03]}>
        <cylinderGeometry args={[0.42, 0.42, 0.085, 56]} />
        <meshStandardMaterial color="#CDBB8E" metalness={1} roughness={0.25} />
      </mesh>
    ))}
    {/* chave */}
    <group position={[0.55, 0.55, 0.1]} rotation={[0, 0, -0.5]}>
      <mesh>
        <torusGeometry args={[0.2, 0.06, 20, 48]} />
        {steel}
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.05]} />
        {steel}
      </mesh>
      {[0, 1].map((i) => (
        <mesh key={i} position={[0.08, -0.72 + i * 0.16, 0]}>
          <boxGeometry args={[0.12, 0.07, 0.05]} />
          {steel}
        </mesh>
      ))}
    </group>
  </group>
);
const MODELS = [Pan, Phone, Linen, House, Car, Laptop, Tractor, Coins];

// índice contínuo do produto em destaque, a partir dos tempos em que cada um é dito
export const carouselIndex = (t: number) => {
  let idx = 0;
  PRODUCT_AT.forEach((at, i) => {
    if (i === 0) return;
    idx += interpolate(t, [at - 0.32, at + 0.12], [0, 1], { easing: EZ.inOut, ...clamp });
  });
  // "tudo que você imagina": o carrossel acelera
  const rush = interpolate(t, [27.3, 28.9], [0, 1], { easing: EZ.in, ...clamp });
  return idx + rush * rush * 6;
};

export const Carousel3D: React.FC<{ width: number; height: number; offset: number; idle?: boolean; zoom?: number }> = ({ width, height, offset, idle = false, zoom = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = offset + frame / fps; // segundos absolutos do áudio
  // no gancho (idle) roda devagar; na cena dos produtos segue a narração
  const idx = idle ? t * 0.55 : carouselIndex(t);
  const step = (Math.PI * 2) / MODELS.length;
  const R = 2.7;
  const shadow = useGlowTexture("rgba(0,0,0,0.6)");
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 1.5, 9.4 / zoom], fov: 30, rotation: [-0.13, 0, 0] }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 7, 6]} intensity={2.2} />
      <directionalLight position={[-5, 3, -2]} intensity={0.9} color="#8FE6F0" />
      <Environment resolution={256}>
        <color attach="background" args={["#10243F"]} />
        <Lightformer form="rect" intensity={3.2} position={[0, 5, 3]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={2} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#2EC4D6" position={[0, -3, -4]} scale={[8, 2, 1]} />
      </Environment>
      <group rotation={[0, -idx * step, 0]}>
        {MODELS.map((M, i) => {
          const a = i * step;
          let d = Math.abs(((idx - i) % MODELS.length) + MODELS.length) % MODELS.length;
          d = Math.min(d, MODELS.length - d);
          const front = Math.max(0, 1 - d);
          const s = 0.82 + front * 0.38;
          return (
            <group key={i} position={[Math.sin(a) * R, front * 0.15, Math.cos(a) * R]} rotation={[0, a, 0]}>
              <group rotation={[0.08, t * 0.5 + i, 0]} scale={s}>
                <M />
              </group>
              <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.2 * s, 2.2 * s]} />
                <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.7} />
              </mesh>
            </group>
          );
        })}
      </group>
    </ThreeCanvas>
  );
};
