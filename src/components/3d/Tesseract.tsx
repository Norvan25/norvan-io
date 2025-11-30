import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Hypercube() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group ref={meshRef}>

      {/* 1. THE CRYSTAL CORE (Premium Glass) */}
      <mesh>
        <octahedronGeometry args={[2.5, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0}
          metalness={0.1}
          transmission={1}
          thickness={3}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0}
          attenuationColor="#00A6FB"
          attenuationDistance={5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. THE OUTER CAGE (Neon Edges) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.OctahedronGeometry(2.5, 0)]} />
        <lineBasicMaterial color="#00A6FB" transparent opacity={0.6} />
      </lineSegments>

      {/* 3. THE SECONDARY SHELL (Ghost Layer for Depth) */}
      <mesh scale={[1.4, 1.4, 1.4]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshPhysicalMaterial
          color="#00A6FB"
          roughness={0.1}
          metalness={0.8}
          transmission={0.2}
          transparent
          opacity={0.1}
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. OUTER WIREFRAME BOX */}
      <lineSegments scale={[1.4, 1.4, 1.4]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.5, 2.5, 2.5)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </lineSegments>

    </group>
  );
}

export default function Tesseract() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00A6FB" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Hypercube />
        </Float>

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
