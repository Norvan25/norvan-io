import React, { useState, useEffect } from 'react';
import Tesseract from './components/3d/Tesseract';
import StarField from './components/StarField';
import IntelligenceText from './components/IntelligenceText';
import Overlay from './components/UI/Overlay';
import DimensionSection from './components/Sections/DimensionSection';
import { Activity, Layers, Zap, Globe, Cpu } from 'lucide-react';

const DIMENSIONS = [
  { id: 'NORX', label: 'STRATEGY', color: '#007FFF', Icon: Activity, desc: "The Diagnostic Engine. We scan, analyze, and reveal the hidden friction in your business." },
  { id: 'NORY', label: 'ARCHITECTURE', color: '#7F4FC9', Icon: Layers, desc: "The Structural Blueprint. We design the systems, workflows, and hierarchies for scale." },
  { id: 'NORZ', label: 'EXPRESSION', color: '#F28500', Icon: Zap, desc: "The Brand Frequency. We amplify your signal to cut through the market noise." },
  { id: 'NORW', label: 'ENABLEMENT', color: '#009E60', Icon: Globe, desc: "The Knowledge Base. We train your teams and install the culture of intelligence." },
  { id: 'NORV', label: 'EXECUTION', color: '#00A6FB', Icon: Cpu, desc: "The Production Line. We deploy the tools, bots, and automations that do the work." },
];

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
    <div className="relative w-full min-h-screen bg-[#0A1628] text-white selection:bg-[#00A6FB] selection:text-black">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-60 transition-transform duration-100 ease-out"
          style={{
            backgroundImage: "url('/background-mesh.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.05)`
          }}
        />

        <StarField />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A1628_100%)] opacity-80" />
      </div>

      <div className="relative z-10 flex flex-col">

        <div className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 z-10">
            <Tesseract />
          </div>
          <IntelligenceText />
          <Overlay />
        </div>

        <div className="relative w-full bg-[#0A1628]/85 backdrop-blur-xl border-t border-white/10">
          {DIMENSIONS.map((dim, i) => (
            <DimensionSection key={dim.id} index={i} {...dim} />
          ))}

          <div className="py-24 text-center border-t border-white/10">
            <h3 className="text-2xl font-mono text-gray-500">SYSTEM ARCHITECTURE END</h3>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
