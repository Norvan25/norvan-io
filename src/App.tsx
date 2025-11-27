import React, { useState, useEffect } from 'react';
import Tesseract from './components/3d/Tesseract';
import IntelligenceText from './components/IntelligenceText';
import Overlay from './components/UI/Overlay';
import DimensionSection from './components/Sections/DimensionSection';
import StarField from './components/StarField';

const DIMENSIONS = [
  {
    id: 'NORX',
    label: 'STRATEGY',
    color: '#007FFF',
    iconPath: '/NorAudit.svg',
    desc: "The Diagnostic Engine. We scan, analyze, and reveal the hidden friction in your business.",
    modules: ['NORDATA', 'NORSCAN', 'NORMAP', 'NORAUDIT']
  },
  {
    id: 'NORY',
    label: 'ARCHITECTURE',
    color: '#7F4FC9',
    iconPath: '/NorCoach.svg',
    desc: "The Structural Blueprint. We design the systems, workflows, and hierarchies for scale.",
    modules: ['NORFLOW', 'NORSTACK', 'NORGRID', 'NORHUB']
  },
  {
    id: 'NORZ',
    label: 'EXPRESSION',
    color: '#F28500',
    iconPath: '/NorBrand.svg',
    desc: "The Brand Frequency. We amplify your signal to cut through the market noise.",
    modules: ['NORBRAND', 'NORCOPY', 'NORVOICE', 'NORWAVE']
  },
  {
    id: 'NORW',
    label: 'ENABLEMENT',
    color: '#009E60',
    iconPath: '/NorCast.svg',
    desc: "The Knowledge Base. We train your teams and install the culture of intelligence.",
    modules: ['NORACADEMY', 'NORLEARN', 'NORGUIDE', 'NORPATH']
  },
  {
    id: 'NORV',
    label: 'EXECUTION',
    color: '#00A6FB',
    iconPath: '/NorBot.svg',
    desc: "The Production Line. We deploy the tools, bots, and automations that do the work.",
    modules: ['NORBOT', 'NORFLOW', 'NORENGINE', 'NORPULSE']
  },
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
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url('/background-mesh.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.05)`
          }}
        />

        <StarField />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A1628_100%)] opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col">

        <div className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 z-10">
            <Tesseract />
          </div>
          <IntelligenceText />
          <Overlay />
        </div>

        <div className="relative w-full">
          {DIMENSIONS.map((dim, i) => (
            <DimensionSection key={dim.id} index={i} {...dim} />
          ))}
        </div>

        <div className="py-32 text-center relative z-10 bg-gradient-to-t from-[#0A1628] to-transparent">
          <h3 className="text-xl font-mono text-gray-500 tracking-widest">SYSTEM END</h3>
        </div>

      </div>

    </div>
  );
}

export default App;
