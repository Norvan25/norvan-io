import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function TextureFace({ iconPath, color }: { iconPath: string; color: string }) {
  const texture = useLoader(THREE.TextureLoader, iconPath);

  useMemo(() => {
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
  }, [texture]);

  return (
    <meshBasicMaterial
      map={texture}
      transparent
      opacity={1}
      side={THREE.FrontSide}
      toneMapped={false}
    />
  );
}

function CubeMesh({ iconPath, color }: { iconPath: string; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={meshRef}>

      {/* LAYER 1: PREMIUM GLASS BODY */}
      <RoundedBox args={[3.5, 3.5, 3.5]} radius={0.25} smoothness={4}>
         <meshPhysicalMaterial
            color={color}
            transparent
            opacity={1}
            transmission={0.95}
            thickness={3}
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={1.5}
            metalness={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
         />
      </RoundedBox>

      {/* LAYER 2: ICON OVERLAY (Floating Inside) */}
      <RoundedBox args={[3.51, 3.51, 3.51]} radius={0.25} smoothness={4}>
         <Suspense fallback={null}>
            <TextureFace iconPath={iconPath} color={color} />
         </Suspense>
      </RoundedBox>

      {/* LAYER 3: NEON EDGES (Thinner & Brighter) */}
      <RoundedBox args={[3.5, 3.5, 3.5]} radius={0.25} smoothness={4}>
         <meshBasicMaterial visible={false} />
         <Edges threshold={30} color={color} linewidth={1} scale={1.01} />
      </RoundedBox>

    </group>
  );
}

export default function AxisCube({ iconPath, color }: { iconPath: string; color: string }) {
  return (
    <div className="w-full h-full relative">
      <Canvas className="w-full h-full block" dpr={[1, 3]}>
        <PerspectiveCamera makeDefault position={[0, 0, 9]} />
        <ambientLight intensity={1} />
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Suspense fallback={null}>
            <CubeMesh iconPath={iconPath} color={color} />
          </Suspense>
        </Float>
      </Canvas>
    </div>
  );
}
