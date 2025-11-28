import React, { useState, useEffect } from 'react';
import Tesseract from './components/3d/Tesseract';
import IntelligenceText from './components/IntelligenceText';
import Overlay from './components/UI/Overlay';
import Header from './components/UI/Header';
import DimensionSection from './components/Sections/DimensionSection';
import StarField from './components/StarField';

const DIMENSIONS = [
  {
    id: 'NORX',
    label: 'INSIGHT',
    color: '#007FFF',
    iconPath: '/NorAudit.svg',
    desc: "The AI audit layer that scans your business, uncovers inefficiencies, and pinpoints where ROI comes first.",
    modules: [
      { name: "NorData", icon: "/NorAudit.svg", desc: "Collects and unifies your company's data into one clean, structured source ready for AI." },
      { name: "NorScan", icon: "/NorAudit.svg", desc: "Runs an AI diagnostic sweep to expose bottlenecks and hidden costs." },
      { name: "NorSense", icon: "/NorAudit.svg", desc: "Uses AI pattern recognition to detect signals and anomalies humans miss." },
      { name: "NorAudit", icon: "/NorAudit.svg", desc: "Delivers an AI-powered audit brief with prioritized ROI actions." }
    ]
  },
  {
    id: 'NORY',
    label: 'ARCHITECTURE',
    color: '#7F4FC9',
    iconPath: '/NorCoach.svg',
    desc: "The AI architecture axis that designs workflows and automations to scale operations without friction.",
    modules: [
      { name: "NorMap", icon: "/NorCoach.svg", desc: "Generates AI workflow blueprints, mapping journeys and operational flowcharts." },
      { name: "NorFlow", icon: "/NorCoach.svg", desc: "Builds AI-powered automations with no-code / low-code tools." },
      { name: "NorCore", icon: "/NorCoach.svg", desc: "Orchestrates the system logic layer, managing rules, triggers, and integrations." },
      { name: "NorFrame", icon: "/NorCoach.svg", desc: "Provides AI-ready templates for rapid automation prototyping and scaling." }
    ]
  },
  {
    id: 'NORZ',
    label: 'EXPRESSION',
    color: '#F28500',
    iconPath: '/NorBrand.svg',
    desc: "The AI expression axis that builds content engines, campaign logic, and omnichannel brand systems.",
    modules: [
      { name: "NorBrand", icon: "/NorBrand.svg", desc: "Codifies brand voice, positioning, and narrative clarity into an AI-ready framework." },
      { name: "NorCast", icon: "/NorCast.svg", desc: "Runs a dynamic campaign engine that powers omnichannel engagement flows." },
      { name: "NorWave", icon: "/NorBrand.svg", desc: "Launch sequencer and promotion automation builder for intelligent GTM execution." },
      { name: "NorGen", icon: "/NorBrand.svg", desc: "Creates AI-driven content (text, images, video) — fast, consistent, and on-brand." }
    ]
  },
  {
    id: 'NORW',
    label: 'KNOWLEDGE & ENABLEMENT',
    color: '#009E60',
    iconPath: '/NorCoach.svg',
    desc: "The AI enablement axis that transforms knowledge into adaptive training and performance systems.",
    modules: [
      { name: "NorTrain", icon: "/NorCoach.svg", desc: "Builds adaptive SOPs, onboarding, and knowledge bases that evolve with every project." },
      { name: "NorCoach", icon: "/NorCoach.svg", desc: "Delivers AI-guided coaching for leaders and teams — personalized, data-driven, continuous." },
      { name: "NorDNA", icon: "/NorCoach.svg", desc: "Maps talent data to align strengths, roles, and personalized growth paths." },
      { name: "NorGuide", icon: "/NorCoach.svg", desc: "Creates modular courses, wikis, and playbooks that capture and scale expertise." }
    ]
  },
  {
    id: 'NORV',
    label: 'EXECUTION & DEPLOYMENT',
    color: '#00A6FB',
    iconPath: '/NorBot.svg',
    desc: "The AI deployment axis that connects tools, automations, and data into live operational systems.",
    modules: [
      { name: "NorBot", icon: "/NorBot.svg", desc: "Automates workflows with AI agents that execute precise, repeatable operations across systems." },
      { name: "NorVoice", icon: "/NorBot.svg", desc: "Builds chat and voice agents that handle service, sales, and automation in your brand's voice." },
      { name: "NorCRM", icon: "/NorBot.svg", desc: "Centralizes customer data and automates predictive engagement for smarter, faster relationships." },
      { name: "NorERP", icon: "/NorBot.svg", desc: "Connects HR, finance, logistics, and analytics into one adaptive, AI-driven operating layer." }
    ]
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

      <Header />

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
