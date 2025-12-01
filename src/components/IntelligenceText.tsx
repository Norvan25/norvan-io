import { useEffect, useRef } from 'react';

const COLORS = {
  norX: '#007fff', norY: '#7f4fc9', norZ: '#f28500', norW: '#009e60', norV: '#66d3fa', grey: '#2a2f40'
};
const TEXT = 'INTELLIGENCE IN MOTION';
const CHARS = TEXT.split('');
const TEXT_DELAY = 5;
const TEXT_DURATION = 3;

export default function IntelligenceText() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    // Cache span references once on mount
    if (wrapperRef.current) {
      spansRef.current = Array.from(wrapperRef.current.querySelectorAll('span[data-char]')) as HTMLSpanElement[];
    }

    let startTime: number | null = null;
    let animId: number;
    let lastProgress = -1;

    function getCharColor(index: number, progress: number) {
      const charNorm = index / CHARS.length;
      const wavePos = progress * 1.8 - charNorm * 0.6;

      if (wavePos <= 0) return COLORS.grey;
      if (wavePos >= 1.2) return index >= 16 ? COLORS.norV : '#ffffff';

      const phase = (wavePos * 4) % 4;
      if (phase < 1) return COLORS.norX;
      if (phase < 2) return COLORS.norY;
      if (phase < 3) return COLORS.norZ;
      return COLORS.norW;
    }

    function getCharGlow(index: number, progress: number, time: number) {
      const charNorm = index / CHARS.length;
      const wavePos = progress * 1.8 - charNorm * 0.6;

      if (wavePos <= 0) return 'none';

      if (wavePos >= 1.2) {
        const breathe = 0.4 + Math.sin(time * 2) * 0.3;
        const size = index >= 16 ? 25 : 15;
        return `0 0 ${size * breathe}px ${index >= 16 ? COLORS.norV : '#ffffff'}`;
      }

      const phase = (wavePos * 4) % 4;
      let col = COLORS.norX;
      if (phase >= 1 && phase < 2) col = COLORS.norY;
      else if (phase >= 2 && phase < 3) col = COLORS.norZ;
      else if (phase >= 3) col = COLORS.norW;
      return `0 0 20px ${col}`;
    }

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000;

      let progress = 0;
      if (time > TEXT_DELAY) {
        progress = Math.min(1, (time - TEXT_DELAY) / TEXT_DURATION);
        progress = -(Math.cos(Math.PI * progress) - 1) / 2;
      }

      if (wrapperRef.current) {
        // Only update opacity when progress changes significantly
        const newOpacity = progress > 0 ? String(Math.min(1, progress * 2)) : '0';
        if (wrapperRef.current.style.opacity !== newOpacity) {
          wrapperRef.current.style.opacity = newOpacity;
        }

        // Only update spans when progress has changed enough (reduces work)
        if (progress > 0 && Math.abs(progress - lastProgress) > 0.005) {
          lastProgress = progress;
          
          // Use cached spans instead of querySelectorAll
          for (let i = 0; i < spansRef.current.length; i++) {
            const span = spansRef.current[i];
            span.style.color = getCharColor(i, progress);
            span.style.textShadow = getCharGlow(i, progress, time);
          }
        } else if (progress >= 1) {
          // After animation complete, only update glow for breathing effect
          for (let i = 0; i < spansRef.current.length; i++) {
            const span = spansRef.current[i];
            span.style.textShadow = getCharGlow(i, progress, time);
          }
        }
      }
      
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="absolute left-0 w-full flex justify-center z-20 pointer-events-none px-4 notranslate"
      translate="no"
      style={{ top: 'calc(18% - 24px)' }}
    >
      <div
        ref={wrapperRef}
        className="flex justify-center whitespace-nowrap font-sans font-semibold tracking-wide opacity-0 text-center leading-tight"
        style={{ fontSize: 'clamp(1.0rem, 4.5vw, 2.5rem)' }}
      >
        {CHARS.map((char, i) => (
          <span 
            key={i} 
            data-char={i}
            style={{ 
              minWidth: char === ' ' ? '0.3em' : 'auto',
              willChange: 'color, text-shadow'
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
