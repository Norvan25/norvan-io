import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Brain, Cpu, Network, Bot, Zap, Workflow, Globe,
  Database, Code, Sparkles, BrainCircuit
} from 'lucide-react';

const icons = [
  { Icon: Brain, x: 10, y: 20, delay: 0 },
  { Icon: Sparkles, x: 85, y: 25, delay: 1.5 },
  { Icon: Cpu, x: 80, y: 15, delay: 2 },
  { Icon: Network, x: 20, y: 80, delay: 1 },
  { Icon: Bot, x: 70, y: 70, delay: 3 },
  { Icon: Zap, x: 40, y: 40, delay: 1.5 },
  { Icon: Workflow, x: 90, y: 50, delay: 2.5 },
  { Icon: Globe, x: 15, y: 50, delay: 0.5 },
  { Icon: Database, x: 60, y: 85, delay: 3.5 },
  { Icon: Code, x: 50, y: 10, delay: 1 },
  { Icon: BrainCircuit, x: 30, y: 60, delay: 2.8 },
];

export default function FloatingIcons() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 50 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {icons.map((item, i) => {
        const movementFactor = 20 + (i * 5);
        const xPos = useTransform(x, [-1, 1], [movementFactor, -movementFactor]);
        const yPos = useTransform(y, [-1, 1], [movementFactor, -movementFactor]);

        return (
          <motion.div
            key={i}
            className="absolute text-[#00A6FB]"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              x: xPos,
              y: yPos,
              opacity: 0.15,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay
            }}
          >
            <item.Icon size={24 + (i * 2)} strokeWidth={1} className="drop-shadow-[0_0_5px_rgba(0,166,251,0.5)]" />
          </motion.div>
        );
      })}
    </div>
  );
}
