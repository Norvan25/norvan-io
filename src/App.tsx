import React, { Suspense } from 'react';
import Scene from './components/Scene';
import Overlay from './components/UI/Overlay';
import StarBackground from './components/StarBackground';
import StarField from './components/StarField';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#0A1628] overflow-hidden text-white">

      {/* 1. Animated Star Background (Warp Speed) */}
      <StarBackground />

      {/* 2. Particle Text Animation */}
      <div className="absolute inset-0 z-0">
        <StarField />
      </div>

      {/* 3. The 3D Engine (The Tesseract) */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* 4. UI Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <Overlay />
      </div>

    </div>
  );
}

export default App;