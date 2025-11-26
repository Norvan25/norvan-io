import { useRef, useEffect } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0, cx = 0, cy = 0;

    const STAR_COUNT = 600;
    const SPEED = 0.02;
    const COLORS = ["#00A6FB", "#ffffff", "#7F4FC9", "#F28500"];

    const stars: { x: number; y: number; z: number; color: string }[] = [];

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: Math.random(),
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
    };

    const animate = () => {
      ctx.fillStyle = "#0A1628";
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.z -= SPEED * 0.05;

        if (star.z <= 0) {
          star.z = 1;
          star.x = (Math.random() - 0.5) * 2;
          star.y = (Math.random() - 0.5) * 2;
        }

        const scale = 1 / star.z;
        const x2d = star.x * scale * width * 0.5 + cx;
        const y2d = star.y * scale * height * 0.5 + cy;

        const size = (1 - star.z) * 1.5;

        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    initStars();
    resize();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
