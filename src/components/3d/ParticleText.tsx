import { useRef, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';

export function ParticleText() {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const font = useLoader(
    FontLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json'
  );

  const scale = Math.min(1, viewport.width / 35);

  const { geometry, originalPositions } = useMemo(() => {
    const textGeo = new TextGeometry('NORVAN', {
      font,
      size: 6,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: false,
    });

    textGeo.center();

    const positionAttribute = textGeo.attributes.position;
    const positions = new Float32Array(positionAttribute.array);
    const originalPos = new Float32Array(positionAttribute.array);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return { geometry: pointsGeo, originalPositions: originalPos };
  }, [font]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      positions[i] = x + Math.sin(time * 0.5 + x * 0.3) * 0.1;
      positions[i + 1] = y + Math.cos(time * 0.3 + y * 0.4) * 0.1;
      positions[i + 2] = originalPositions[i + 2] + Math.sin(time * 0.5 + x * 0.2 + y * 0.2) * 0.08;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    pointsRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <group position={[0, 0, -12]} scale={[scale, scale, scale]}>
      <points ref={pointsRef}>
        <primitive object={geometry} attach="geometry" />
        <pointsMaterial
          size={0.15}
          color="#00A6FB"
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
