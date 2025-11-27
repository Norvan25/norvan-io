import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function CubeMesh({ iconPath, color }: { iconPath: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useLoader(THREE.TextureLoader, iconPath);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 3, 3]} />
        <meshPhysicalMaterial
          color={color}
          map={texture}
          emissiveMap={texture}
          emissive={color}
          emissiveIntensity={2}
          transmission={0.6}
          opacity={1}
          metalness={0}
          roughness={0}
          thickness={2}
          clearcoat={1}
          transparent={true}
        />
      </mesh>

      <mesh rotation={meshRef.current?.rotation}>
        <boxGeometry args={[3.1, 3.1, 3.1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function AxisCube({ iconPath, color }: { iconPath: string; color: string }) {
  return (
    <Canvas className="w-full h-full" dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={1} />
      <Environment preset="city" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <CubeMesh iconPath={iconPath} color={color} />
      </Float>
    </Canvas>
  );
}
