import React, { Suspense } from 'react';
import Scene from './components/Scene';
import Overlay from './components/UI/Overlay';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#0A1628] overflow-hidden text-white">
      
      {/* 1. The Background Mesh (Fixed) */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{ 
          backgroundImage: "url('/background-mesh.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }} 
      />

      {/* 2. The 3D Engine (The Tesseract) */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* 3. The UI Layer (HUD & Dock) */}
      <div className="relative z-20 pointer-events-none">
        <Overlay />
      </div>

    </div>
  );
}

export default App;