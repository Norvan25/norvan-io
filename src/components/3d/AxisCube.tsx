import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function CubeMesh({ iconPath, color }: { iconPath: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useLoader(THREE.TextureLoader, iconPath);
  useMemo(() => {
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group scale={0.8}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 3, 3]} />
        <meshPhysicalMaterial
          color={color}
          map={texture}
          emissiveMap={texture}
          emissive={color}
          emissiveIntensity={4}
          transparent={true}
          opacity={0.1}
          transmission={0.2}
          metalness={0.1}
          roughness={0}
          thickness={1}
          clearcoat={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={meshRef}>
        <boxGeometry args={[3.05, 3.05, 3.05]} />
        <meshStandardMaterial
          color={color}
          wireframe
          opacity={0.5}
          transparent
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
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
