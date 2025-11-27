import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function CubeMesh({ iconPath, color }: { iconPath: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useLoader(THREE.TextureLoader, iconPath);
  useMemo(() => {
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
  }, [texture]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      <RoundedBox
        ref={meshRef}
        args={[3.5, 3.5, 3.5]}
        radius={0.25}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color={color}
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={2}
          transparent={true}
          opacity={0.9}
          transmission={0.2}
          metalness={0.1}
          roughness={0.2}
          side={THREE.FrontSide}
        />
        <Edges scale={1.0} threshold={30} color={color} linewidth={2} />
      </RoundedBox>
    </group>
  );
}

export default function AxisCube({ iconPath, color }: { iconPath: string; color: string }) {
  return (
    <div className="w-full h-full relative">
      <Canvas className="w-full h-full block" dpr={[1, 3]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={1} />
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CubeMesh iconPath={iconPath} color={color} />
        </Float>
      </Canvas>
    </div>
  );
}
