import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hasTarget: boolean;
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let particles: Particle[] = [];
    let backgroundStars: Star[] = [];
    let animationStarted = false;
    let animationProgress = 0;
    let time = 0;
    let animationId: number;

    function init() {
      particles = [];
      backgroundStars = [];
      const bgStarCount = Math.floor((width * height) / 3000);
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
      const targetPixels = getTextPixels('INTELLIGENCE IN MOTION');
      for (let i = 0; i < targetPixels.length; i++) {
        const p = createParticle();
        p.targetX = targetPixels[i].x;
        p.targetY = targetPixels[i].y;
        particles.push(p);
      }
      setTimeout(() => { animationStarted = true; }, 1000);
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: 0,
        targetY: 0,
        hasTarget: true,
        size: Math.random() * 1.2 + 0.5,
        color: '#4bdbd3',
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinkleOffset: Math.random() * Math.PI * 2,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2
      };
    }

    function getTextPixels(text: string) {
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return [];

      const isMobile = width < 768;
      offscreen.width = width;
      offscreen.height = height;

      offCtx.fillStyle = '#fff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      if (isMobile) {
        const fontSize = Math.min(width * 0.14, 80);
        offCtx.font = `900 ${fontSize}px Inter, sans-serif`;
        offCtx.fillText("INTELLIGENCE", width / 2, height * 0.15);
        offCtx.fillText("IN MOTION", width / 2, height * 0.22);
      } else {
        const fontSize = Math.min(width * 0.035, 60);
        offCtx.font = `900 ${fontSize}px Inter, sans-serif`;
        offCtx.fillText("INTELLIGENCE IN MOTION", width / 2, height * 0.18);
      }

      const imageData = offCtx.getImageData(0, 0, width, height);
      const pixels = [];
      const density = isMobile ? 3 : 2;

      for (let y = 0; y < height; y += density) {
        for (let x = 0; x < width; x += density) {
          const i = (y * width + x) * 4;
          if (imageData.data[i + 3] > 128) {
            pixels.push({ x, y });
          }
        }
      }
      return pixels;
    }

    function resize() {
      width = canvas!.width = canvas!.offsetWidth;
      height = canvas!.height = canvas!.offsetHeight;
      init();
    }

    function easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function render() {
      if (!ctx || !canvas) return;
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      backgroundStars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      if (animationStarted && animationProgress < 1) {
        animationProgress += 0.01;
        if (animationProgress > 1) animationProgress = 1;
      }

      const easedProgress = easeInOutQuad(animationProgress);

      particles.forEach((p, i) => {
        let x, y;
        if (animationStarted && p.hasTarget) {
          let targetX = p.targetX;
          let targetY = p.targetY;

          if (animationProgress > 0.8) {
            const wave = Math.sin(time * 1.5 + targetX * 0.01) * 3;
            targetY += wave;
          }

          x = p.x + (targetX - p.x) * easedProgress;
          y = p.y + (targetY - p.y) * easedProgress;
        } else {
          p.x += p.velocityX * 0.5;
          p.y += p.velocityY * 0.5;
          if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
          x = p.x; y = p.y;
        }

        const twinkle = Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.3 + 0.7;
        const size = p.size * twinkle;

        if (size > 0.8) {
          const glowSize = size * 3;
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
          glowGradient.addColorStop(0, "rgba(75, 219, 211, 0.8)");
          glowGradient.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(x, y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.globalAlpha = 0.3;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    }

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
