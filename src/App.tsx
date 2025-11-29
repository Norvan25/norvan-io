import React, { useState, useEffect } from 'react';
import Tesseract from './components/3d/Tesseract';
import IntelligenceText from './components/IntelligenceText';
import Overlay from './components/UI/Overlay';
import Header from './components/UI/Header';
import DimensionSection from './components/Sections/DimensionSection';
import Footer from './components/Sections/Footer';
import StarField from './components/StarField';
import GlobalVoiceTrigger from './components/UI/GlobalVoiceTrigger';

const DIMENSIONS = [
  {
    id: 'NORX',
    label: 'INSIGHT',
    color: '#007FFF',
    iconPath: '/icons/modules/nordata.svg',
    desc: "The AI audit layer that scans your business, uncovers inefficiencies, and pinpoints where ROI comes first.",
    modules: [
      { name: "NorData", icon: "/icons/modules/nordata.svg", desc: "Collects and unifies your company's data into one clean, structured source ready for AI." },
      { name: "NorScan", icon: "/icons/modules/norscan.svg", desc: "Runs an AI diagnostic sweep to expose bottlenecks and hidden costs." },
      { name: "NorSense", icon: "/icons/modules/norsense.svg", desc: "Uses AI pattern recognition to detect signals and anomalies humans miss." },
      { name: "NorAudit", icon: "/icons/modules/noraudit.svg", desc: "Delivers an AI-powered audit brief with prioritized ROI actions." }
    ]
  },
  {
    id: 'NORY',
    label: 'ARCHITECTURE',
    color: '#7F4FC9',
    iconPath: '/icons/modules/normap.svg',
    desc: "The AI architecture axis that designs workflows and automations to scale operations without friction.",
    modules: [
      { name: "NorMap", icon: "/icons/modules/normap.svg", desc: "Generates AI workflow blueprints, mapping journeys and operational flowcharts." },
      { name: "NorFlow", icon: "/icons/modules/norflow.svg", desc: "Builds AI-powered automations with no-code / low-code tools." },
      { name: "NorCore", icon: "/icons/modules/norcore.svg", desc: "Orchestrates the system logic layer, managing rules, triggers, and integrations." },
      { name: "NorFrame", icon: "/icons/modules/norframe.svg", desc: "Provides AI-ready templates for rapid automation prototyping and scaling." }
    ]
  },
  {
    id: 'NORZ',
    label: 'EXPRESSION',
    color: '#F28500',
    iconPath: '/icons/modules/norbrand.svg',
    desc: "The AI expression axis that builds content engines, campaign logic, and omnichannel brand systems.",
    modules: [
      { name: "NorBrand", icon: "/icons/modules/norbrand.svg", desc: "Codifies brand voice, positioning, and narrative clarity into an AI-ready framework." },
      { name: "NorCast", icon: "/icons/modules/norcast.svg", desc: "Runs a dynamic campaign engine that powers omnichannel engagement flows." },
      { name: "NorWave", icon: "/icons/modules/norwave.svg", desc: "Launch sequencer and promotion automation builder for intelligent GTM execution." },
      { name: "NorGen", icon: "/icons/modules/norgen.svg", desc: "Creates AI-driven content (text, images, video) — fast, consistent, and on-brand." }
    ]
  },
  {
    id: 'NORW',
    label: 'KNOWLEDGE',
    color: '#009E60',
    iconPath: '/icons/modules/nortrain.svg',
    desc: "The AI enablement axis that transforms knowledge into adaptive training and performance systems.",
    modules: [
      { name: "NorTrain", icon: "/icons/modules/nortrain.svg", desc: "Builds adaptive SOPs, onboarding, and knowledge bases that evolve with every project." },
      { name: "NorCoach", icon: "/icons/modules/norcoach.svg", desc: "Delivers AI-guided coaching for leaders and teams — personalized, data-driven, continuous." },
      { name: "NorDNA", icon: "/icons/modules/nordna.svg", desc: "Maps talent data to align strengths, roles, and personalized growth paths." },
      { name: "NorGuide", icon: "/icons/modules/norguide.svg", desc: "Creates modular courses, wikis, and playbooks that capture and scale expertise." }
    ]
  },
  {
    id: 'NORV',
    label: 'EXECUTION',
    color: '#00A6FB',
    iconPath: '/icons/modules/norbot.svg',
    desc: "The AI deployment axis that connects tools, automations, and data into live operational systems.",
    modules: [
      { name: "NorBot", icon: "/icons/modules/norbot.svg", desc: "Automates workflows with AI agents that execute precise, repeatable operations across systems." },
      { name: "NorVoice", icon: "/icons/modules/norchat.svg", desc: "Builds chat and voice agents that handle service, sales, and automation in your brand's voice." },
      { name: "NorCRM", icon: "/icons/modules/norcrm.svg", desc: "Centralizes customer data and automates predictive engagement for smarter, faster relationships." },
      { name: "NorERP", icon: "/icons/modules/norerp.svg", desc: "Connects HR, finance, logistics, and analytics into one adaptive, AI-driven operating layer." }
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

        <div className="relative w-full bg-[#0A1628]/85 backdrop-blur-xl border-t border-white/10">
          {DIMENSIONS.map((dim, i) => (
            <DimensionSection key={dim.id} index={i} {...dim} />
          ))}

          <Footer />
        </div>

      </div>

      <GlobalVoiceTrigger />

    </div>
  );
}

export default App;
