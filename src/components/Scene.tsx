import { Canvas } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera } from "@react-three/drei";
import { Tesseract } from "./3d/Tesseract";
import { StarField } from "./3d/StarField";

export default function Scene() {
  return (
    <Canvas className="w-full h-full" dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#00A6FB" intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#F28500" intensity={2} />

      <Environment preset="city" />

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Tesseract />
      </Float>

      <StarField />
    </Canvas>
  );
}
