import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function ParticleText() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    const textWidth = 7;
    const textHeight = 2;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * textWidth;
      const y = (Math.random() - 0.5) * textHeight;
      const z = (Math.random() - 0.5) * 0.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }

    return { positions, originalPositions };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const original = particles.originalPositions;

    for (let i = 0; i < positions.length; i += 3) {
      const x = original[i];
      const y = original[i + 1];

      positions[i] = x + Math.sin(time * 0.5 + x * 0.5) * 0.08;
      positions[i + 1] = y + Math.cos(time * 0.3 + y * 0.5) * 0.08;
      positions[i + 2] = original[i + 2] + Math.sin(time * 0.5 + x * 0.3 + y * 0.3) * 0.05;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[0, 0, -5]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color="#00A6FB"
          transparent
          opacity={0.4}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <Text
        fontSize={2.5}
        letterSpacing={0.05}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        NORVAN
        <meshBasicMaterial
          color="#00A6FB"
          transparent
          opacity={0.05}
          wireframe
        />
      </Text>

      <Text
        fontSize={2.5}
        letterSpacing={0.05}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, -0.2]}
      >
        NORVAN
        <meshBasicMaterial
          color="#00A6FB"
          transparent
          opacity={0.02}
        />
      </Text>
    </group>
  );
}
