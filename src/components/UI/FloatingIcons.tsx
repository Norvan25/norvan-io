import { useEffect, useRef, memo } from 'react';
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

// Memoized icon component to prevent re-renders
const FloatingIcon = memo(function FloatingIcon({ 
  Icon, 
  x, 
  y, 
  delay, 
  duration, 
  index,
  parallaxFactor
}: { 
  Icon: typeof Brain;
  x: number; 
  y: number; 
  delay: number;
  duration: number;
  index: number;
  parallaxFactor: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="floating-icon absolute text-[#00A6FB]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: 0.15,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        // CSS custom property for parallax (updated via JS)
        '--parallax-x': '0px',
        '--parallax-y': '0px',
        transform: 'translate(var(--parallax-x), var(--parallax-y))',
        willChange: 'transform',
      } as React.CSSProperties}
      data-parallax={parallaxFactor}
    >
      <Icon 
        size={24 + (index * 2)} 
        strokeWidth={1} 
        className="drop-shadow-[0_0_5px_rgba(0,166,251,0.5)]" 
      />
    </div>
  );
});

export default function FloatingIcons() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.03;
      currentY += (targetY - currentY) * 0.03;

      // Update all icons via CSS custom properties (no React re-render)
      if (containerRef.current) {
        const icons = containerRef.current.querySelectorAll('.floating-icon');
        icons.forEach((icon, i) => {
          const el = icon as HTMLElement;
          const factor = 20 + (i * 5);
          el.style.setProperty('--parallax-x', `${currentX * -factor}px`);
          el.style.setProperty('--parallax-y', `${currentY * -factor}px`);
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* CSS Animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(var(--parallax-x, 0), var(--parallax-y, 0)) translateY(0) rotate(0deg);
          }
          25% {
            transform: translate(var(--parallax-x, 0), var(--parallax-y, 0)) translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translate(var(--parallax-x, 0), var(--parallax-y, 0)) translateY(-20px) rotate(0deg);
          }
          75% {
            transform: translate(var(--parallax-x, 0), var(--parallax-y, 0)) translateY(-10px) rotate(-5deg);
          }
        }
        .floating-icon {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
      
      <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {icons.map((item, i) => (
          <FloatingIcon
            key={i}
            Icon={item.Icon}
            x={item.x}
            y={item.y}
            delay={item.delay}
            duration={item.duration}
            index={i}
            parallaxFactor={20 + (i * 5)}
          />
        ))}
      </div>
    </>
  );
}
