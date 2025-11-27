import { useRef, useEffect } from 'react';

export default function Tesseract() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0, centerX = 0, centerY = 0, scale = 0;
    let animationId: number;
    let startTime: number | null = null;
    let viewAngle = 0;

    const COLORS = {
      norX: '#007fff',
      norY: '#7f4fc9',
      norZ: '#f28500',
      norW: '#009e60',
      norV: '#66d3fa',
      norVDark: '#007acc',
      edge: '#2a2f40',
    };

    const vertices4D: number[][] = [];
    for (let w = -1; w <= 1; w += 2)
      for (let z = -1; z <= 1; z += 2)
        for (let y = -1; y <= 1; y += 2)
          for (let x = -1; x <= 1; x += 2)
            vertices4D.push([x, y, z, w]);

    const edges: number[][] = [];
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        if (diff === 1) edges.push([i, j]);
      }

    const norXVertices = [3, 2, 6, 7, 11, 10, 14, 15];
    const norYVertices = [4, 12, 14, 6, 7, 15, 13, 5];
    const norZVertices = [11, 15, 14, 10, 9, 8, 12, 13];
    const norWVertices = [1, 9, 11, 3];

    function projectB4(v: number[]) {
      const pi8 = Math.PI/8;
      const x = v[0]*Math.cos(pi8) + v[1]*Math.cos(3*pi8) + v[2]*Math.cos(5*pi8) + v[3]*Math.cos(7*pi8);
      const y = v[0]*Math.sin(pi8) + v[1]*Math.sin(3*pi8) + v[2]*Math.sin(5*pi8) + v[3]*Math.sin(7*pi8);
      return { x: x * 0.55, y: y * 0.55 };
    }

    const rotateXW = (p: number[], a: number): number[] => [p[0]*Math.cos(a)-p[3]*Math.sin(a), p[1], p[2], p[0]*Math.sin(a)+p[3]*Math.cos(a)];
    const rotateYW = (p: number[], a: number): number[] => [p[0], p[1]*Math.cos(a)-p[3]*Math.sin(a), p[2], p[1]*Math.sin(a)+p[3]*Math.cos(a)];
    const rotateZW = (p: number[], a: number): number[] => [p[0], p[1], p[2]*Math.cos(a)-p[3]*Math.sin(a), p[2]*Math.sin(a)+p[3]*Math.cos(a)];

    function project4Dto3D(v: number[]) {
      const d = 2.5;
      const s = d / (d - v[3] * 0.4);
      return { x: v[0] * s, y: v[1] * s, z: v[2] * s };
    }

    function lineIntersection(p1: {x:number, y:number}, p2: {x:number, y:number}, p3: {x:number, y:number}, p4: {x:number, y:number}) {
      const x1=p1.x, y1=p1.y, x2=p2.x, y2=p2.y, x3=p3.x, y3=p3.y, x4=p4.x, y4=p4.y;
      const denom = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
      if (Math.abs(denom)<0.0001) return null;
      const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/denom;
      return { x: x1+t*(x2-x1), y: y1+t*(y2-y1) };
    }

    const PHASE = {
      ORIGIN: { start: 0, end: 1 },
      CORE: { start: 1, end: 3 },
      STRUCTURE: { start: 2.5, end: 5 },
      COLORS: { start: 5, end: 8 },
      TRANSCEND: { start: 8, end: 12 }
    };

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
    function getPhaseProgress(time: number, phase: {start: number, end: number}) {
      if (time < phase.start) return 0;
      if (time > phase.end) return 1;
      return (time - phase.start) / (phase.end - phase.start);
    }

    function render(timestamp: number) {
      if (!ctx || !canvas) return;
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      const pOrigin = easeOutCubic(getPhaseProgress(time, PHASE.ORIGIN));
      const pCore = easeOutCubic(getPhaseProgress(time, PHASE.CORE));
      const pStruct = easeOutCubic(getPhaseProgress(time, PHASE.STRUCTURE));
      const pColor = getPhaseProgress(time, PHASE.COLORS);
      const pTranscend = getPhaseProgress(time, PHASE.TRANSCEND);

      const morph3D = easeOutCubic(pTranscend);
      const coreOpacity = 1 - morph3D;

      let aXW = 0, aYW = 0, aZW = 0;
      if (time >= PHASE.TRANSCEND.start) {
         const rt = time - PHASE.TRANSCEND.start;
         aXW = rt * 0.4; aYW = rt * 0.2; aZW = rt * 0.1;
         viewAngle += 0.005 * morph3D;
      }

      const points = vertices4D.map(v => {
         const p2 = projectB4(v);
         const pos2 = { x: centerX + p2.x*scale, y: centerY - p2.y*scale };

         let v4 = [...v];
         v4 = rotateXW(v4, aXW); v4 = rotateYW(v4, aYW); v4 = rotateZW(v4, aZW);
         const p3 = project4Dto3D(v4);
         const cos = Math.cos(viewAngle), sin = Math.sin(viewAngle);
         const rx = p3.x*cos - p3.z*sin;
         const rz = p3.x*sin + p3.z*cos;
         const pos3 = { x: centerX + rx*scale*0.6, y: centerY - p3.y*scale*0.6, z: rz };

         return {
            x: lerp(pos2.x, pos3.x, morph3D),
            y: lerp(pos2.y, pos3.y, morph3D)
         };
      });

      if (pOrigin > 0 && pCore < 1) {
         const sz = pOrigin * 6 * (1 - pCore);
         ctx.beginPath(); ctx.arc(centerX, centerY, sz, 0, Math.PI*2);
         ctx.fillStyle = COLORS.norV; ctx.fill();
         const g = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sz*4);
         g.addColorStop(0, 'rgba(102, 211, 250, 0.5)');
         g.addColorStop(1, 'transparent');
         ctx.fillStyle = g; ctx.beginPath(); ctx.arc(centerX, centerY, sz*4, 0, Math.PI*2); ctx.fill();
      }

      if (pCore > 0 && coreOpacity > 0.01) {
         const coreSize = pCore * scale * 0.35;
         const pts = [];
         for(let i=0; i<8; i++) {
            const ang = (i * Math.PI * 2) / 8 + (Math.PI/8);
            pts.push({
               x: centerX + Math.cos(ang) * coreSize,
               y: centerY + Math.sin(ang) * coreSize
            });
         }

         ctx.globalAlpha = coreOpacity;
         ctx.beginPath();
         pts.forEach((p, i) => i===0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
         ctx.closePath();

         const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize);
         grad.addColorStop(0, COLORS.norV);
         grad.addColorStop(1, COLORS.norVDark);
         ctx.fillStyle = grad;
         ctx.fill();

         ctx.lineWidth = 2;
         ctx.strokeStyle = COLORS.norV;
         ctx.stroke();
         ctx.globalAlpha = 1;
      }

      if (pStruct > 0) {
         edges.forEach(([i, j]) => {
            let col = COLORS.edge;
            if (pColor > 0) {
               const v1 = vertices4D[i];
               const v2 = vertices4D[j];
               let target = COLORS.edge;
               for(let c=0; c<4; c++) {
                  if (v1[c] !== v2[c]) {
                     if(c===3) target = COLORS.norX;
                     if(c===0) target = COLORS.norY;
                     if(c===1) target = COLORS.norZ;
                     if(c===2) target = COLORS.norW;
                  }
               }

               if (pColor > 0.5) col = target;
            }

            const start = points[i];
            const end = points[j];

            const dist = Math.hypot(start.x - centerX, start.y - centerY);
            const maxDist = scale;
            const delay = (dist/maxDist) * 0.5;
            const lineProg = Math.max(0, Math.min(1, (pStruct - delay) / (1 - delay)));

            if (lineProg > 0) {
               ctx.beginPath();
               ctx.moveTo(lerp(centerX, start.x, lineProg), lerp(centerY, start.y, lineProg));
               ctx.lineTo(lerp(centerX, end.x, lineProg), lerp(centerY, end.y, lineProg));
               ctx.strokeStyle = col;
               ctx.lineWidth = 2;
               ctx.stroke();
            }
         });
      }

      if (pStruct > 0) {
         points.forEach((p, i) => {
            const dist = Math.hypot(p.x - centerX, p.y - centerY);
            const delay = (dist / scale) * 0.5;
            const prog = Math.max(0, Math.min(1, (pStruct - delay) / (1 - delay)));

            if (prog > 0) {
               let col = COLORS.edge;
               if (pColor > 0.5) {
                  const v = vertices4D[i];
                  if (v[3] === 1) col = COLORS.norX;
                  else if (v[0] === 1) col = COLORS.norY;
                  else if (v[1] === 1) col = COLORS.norZ;
                  else col = COLORS.norW;
               }

               ctx.beginPath();
               ctx.arc(p.x, p.y, 4 * prog, 0, Math.PI*2);
               ctx.fillStyle = col;
               ctx.fill();
            }
         });
      }

      animationId = requestAnimationFrame(render);
    }

    const handleResize = () => {
       width = canvas.width = canvas.offsetWidth;
       height = canvas.height = canvas.offsetHeight;
       centerX = width/2; centerY = height/2;
       scale = Math.min(width, height) * 0.35;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animationId = requestAnimationFrame(render);

    return () => {
       window.removeEventListener('resize', handleResize);
       cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />;
}
