import { memo } from 'react';
import {
  Brain, Cpu, Network, Bot, Zap, Workflow, Globe,
  Database, Code, Sparkles, BrainCircuit
} from 'lucide-react';

const icons = [
  { Icon: Brain, x: 10, y: 20, delay: 0, duration: 10 },
  { Icon: Sparkles, x: 85, y: 25, delay: 1.5, duration: 11 },
  { Icon: Cpu, x: 80, y: 15, delay: 2, duration: 12 },
  { Icon: Network, x: 20, y: 80, delay: 1, duration: 13 },
  { Icon: Bot, x: 70, y: 70, delay: 3, duration: 14 },
  { Icon: Zap, x: 40, y: 40, delay: 1.5, duration: 11 },
  { Icon: Workflow, x: 90, y: 50, delay: 2.5, duration: 12 },
  { Icon: Globe, x: 15, y: 50, delay: 0.5, duration: 10 },
  { Icon: Database, x: 60, y: 85, delay: 3.5, duration: 15 },
  { Icon: Code, x: 50, y: 10, delay: 1, duration: 11 },
  { Icon: BrainCircuit, x: 30, y: 60, delay: 2.8, duration: 13 },
];

const FloatingIcons = memo(function FloatingIcons() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
      `}</style>
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {icons.map((item, i) => (
          <div
            key={i}
            className="absolute text-[#00A6FB]"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity: 0.15,
              animation: `float ${item.duration}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <item.Icon 
              size={24 + (i * 2)} 
              strokeWidth={1} 
              className="drop-shadow-[0_0_5px_rgba(0,166,251,0.5)]" 
            />
          </div>
        ))}
      </div>
    </>
  );
});

export default FloatingIcons;