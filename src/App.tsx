import React, { Suspense } from 'react';
import Tesseract from './components/3d/Tesseract';
import Overlay from './components/UI/Overlay';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#0A1628] overflow-hidden text-white">

      {/* LAYER 1: The Background Mesh (Restored) */}
      <div
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('/background-mesh.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* LAYER 2: The Tesseract Engine */}
      <div className="absolute inset-0 z-10">
        <Tesseract />
      </div>

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
