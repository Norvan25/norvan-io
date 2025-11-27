import React, { Suspense, useState, useEffect } from 'react';
import Tesseract from './components/3d/Tesseract';
import Overlay from './components/UI/Overlay';
import IntelligenceText from './components/IntelligenceText';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div className="relative w-full h-screen bg-[#0A1628] overflow-hidden text-white">

      {/* LAYER 1: The Background Mesh (Restored) */}
      <div
        className="fixed inset-0 z-0 opacity-70 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          backgroundImage: "url('/background-mesh.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.05)`
        }}
      />

      {/* LAYER 2: The Tesseract Engine */}
      <div className="absolute inset-0 z-10">
        <Tesseract />
      </div>

      {/* LAYER 2.5: Intelligence Text Particles */}
      <IntelligenceText />

      {/* LAYER 3: Glass/Vignette Overlay (The "Glassy" Look) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(10, 22, 40, 0.4) 80%, rgba(10, 22, 40, 0.8) 100%)',
          boxShadow: 'inset 0 0 100px rgba(0, 166, 251, 0.05)'
        }}
      />

      {/* LAYER 4: The UI (HUD) */}
      <div className="relative z-30 pointer-events-none">
        <Overlay />
      </div>

    </div>
  );
}

export default App;
