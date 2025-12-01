import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  velocityX: number;
  velocityY: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0;
    let particles: Particle[] = [];
    let backgroundStars: Star[] = [];
    let time = 0;
    let animationId: number;

    // Pre-create gradient canvas for particle glow (reusable)
    const glowCanvas = document.createElement('canvas');
    const glowCtx = glowCanvas.getContext('2d');
    const glowSize = 24; // Fixed size, will scale when drawing
    glowCanvas.width = glowSize * 2;
    glowCanvas.height = glowSize * 2;
    
    if (glowCtx) {
      const gradient = glowCtx.createRadialGradient(glowSize, glowSize, 0, glowSize, glowSize, glowSize);
      gradient.addColorStop(0, 'rgba(75, 219, 211, 0.8)');
      gradient.addColorStop(1, 'rgba(75, 219, 211, 0)');
      glowCtx.fillStyle = gradient;
      glowCtx.fillRect(0, 0, glowSize * 2, glowSize * 2);
    }

    function init() {
      particles = [];
      backgroundStars = [];
      
      // Reduce star count for better performance
      const bgStarCount = Math.floor((width * height) / 4500); // Was 3000
      for (let i = 0; i < bgStarCount; i++) {
        backgroundStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (Math.random() * 1.5 + 0.5) * 0.85,
          opacity: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }
      
      // Reduce particle count
      const particleCount = Math.floor((width * height) / 12000); // Was 8000
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.5,
        color: '#4bdbd3',
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinkleOffset: Math.random() * Math.PI * 2,
        velocityX: (Math.random() - 0.5) * 0.3,
        velocityY: (Math.random() - 0.5) * 0.3
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
      init();
    }

    function render() {
      if (!ctx || !canvas) return;
      time += 0.016;
      
      ctx.clearRect(0, 0, width, height);

      // Background stars - simple circles, no gradients
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < backgroundStars.length; i++) {
        const star = backgroundStars[i];
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3 + 0.7;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Particles with pre-rendered glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.velocityX;
        p.y += p.velocityY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const twinkle = Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.3 + 0.7;
        const size = p.size * twinkle;

        // Draw glow using pre-rendered canvas (much faster than creating gradient)
        if (size > 0.8) {
          const drawSize = size * 3;
          ctx.globalAlpha = 0.25;
          ctx.drawImage(
            glowCanvas,
            p.x - drawSize,
            p.y - drawSize,
            drawSize * 2,
            drawSize * 2
          );
          ctx.globalAlpha = 1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    }

    resize();
    render();
    
    // Throttled resize handler
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 150);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
