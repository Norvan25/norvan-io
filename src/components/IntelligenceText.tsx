import { useRef, useEffect } from 'react';

export default function IntelligenceText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let particles: any[] = [];
    let animationId: number;
    let time = 0;

    const COLORS = { primary: '#00A6FB' };

    function init() {
      particles = [];
      const targetPixels = getTextPixels();

      for (let i = 0; i < targetPixels.length; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: targetPixels[i].x,
          targetY: targetPixels[i].y,
          size: Math.random() * 1.2 + 0.5,
          color: COLORS.primary,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        });
      }
    }

    function getTextPixels() {
      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return [];

      offscreen.width = width;
      offscreen.height = height;

      const isMobile = width < 768;

      offCtx.fillStyle = '#fff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      if (isMobile) {
        const fontSize = Math.min(width * 0.11, 55);
        offCtx.font = `900 ${fontSize}px Inter, sans-serif`;
        offCtx.fillText("INTELLIGENCE", width / 2, height * 0.15);
        offCtx.fillText("IN MOTION", width / 2, height * 0.21);
      } else {
        const fontSize = Math.min(width * 0.03, 45);
        offCtx.font = `900 ${fontSize}px Inter, sans-serif`;
        offCtx.fillText("INTELLIGENCE IN MOTION", width / 2, height * 0.18);
      }

      const imageData = offCtx.getImageData(0, 0, width, height);
      const pixels = [];
      const density = isMobile ? 2 : 3;

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

    function render() {
      if (!ctx || !canvas) return;
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        const progress = Math.min(1, time * 0.8);
        const ease = 1 - Math.pow(1 - progress, 3);

        let cx = p.x + (p.targetX - p.x) * ease;
        let cy = p.y + (p.targetY - p.y) * ease;

        if (progress > 0.9) {
          cx += Math.sin(time * 2 + p.targetX * 0.05) * 1.5;
          cy += Math.cos(time * 1.5 + p.targetY * 0.05) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.8 * ease;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    }

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      init();
    };

    resize();
    window.addEventListener('resize', resize);
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />;
}
