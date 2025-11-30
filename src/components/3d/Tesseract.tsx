import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Hypercube() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const group = groupRef.current;
    const core = coreRef.current;
    const wireframe = wireframeRef.current;

    if (group && core && wireframe) {
      group.rotation.x = time * 0.2;
      group.rotation.y = time * 0.3;
      group.rotation.z = time * 0.1;

      if (time < 3.5) {
        const scale = Math.min(1, Math.pow(time * 0.6, 2));
        group.scale.setScalar(scale);

        if (wireframe.material instanceof THREE.LineBasicMaterial) {
          wireframe.material.opacity = Math.min(1, time);
        }
        if (core.material instanceof THREE.MeshPhysicalMaterial) {
          const solidify = Math.max(0, (time - 1.0) / 2.0);
          core.material.opacity = Math.min(1, solidify);
          core.material.transmission = Math.min(1, solidify);
        }
      } else {
        group.scale.setScalar(1);
        if (wireframe.material instanceof THREE.LineBasicMaterial) {
          wireframe.material.opacity = 0.5 + Math.sin(time * 1.5) * 0.2;
        }
        if (core.material instanceof THREE.MeshPhysicalMaterial) {
          core.material.opacity = 1;
          core.material.transmission = 1;
        }
      }
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>

      <mesh ref={coreRef}>
        <octahedronGeometry args={[2.5, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0}
          metalness={0.1}
          transmission={0}
          thickness={3}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0}
          attenuationColor="#00A6FB"
          attenuationDistance={5}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments ref={wireframeRef}>
        <edgesGeometry args={[new THREE.OctahedronGeometry(2.5, 0)]} />
        <lineBasicMaterial color="#00A6FB" transparent opacity={0} />
      </lineSegments>

      <mesh scale={[1.4, 1.4, 1.4]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshPhysicalMaterial
          color="#00A6FB"
          roughness={0.1}
          metalness={0.8}
          transmission={0.2}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments scale={[1.4, 1.4, 1.4]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.5, 2.5, 2.5)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
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
