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
      norX: '#007fff', norY: '#7f4fc9', norZ: '#f28500', norW: '#009e60',
      norV: '#66d3fa', norVDark: '#007acc', edge: '#2a2f40',
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
    const norXVertices2 = [13, 12, 8, 9, 4, 5, 1, 2];
    const norYVertices = [4, 12, 14, 6, 7, 15, 13, 5];
    const norZVertices = [11, 15, 14, 10, 9, 8, 12, 13];
    const norWVertices = [1, 9, 11, 3];

    const rotateXW = (p: number[], a: number) => [p[0]*Math.cos(a)-p[3]*Math.sin(a), p[1], p[2], p[0]*Math.sin(a)+p[3]*Math.cos(a)];
    const rotateYW = (p: number[], a: number) => [p[0], p[1]*Math.cos(a)-p[3]*Math.sin(a), p[2], p[1]*Math.sin(a)+p[3]*Math.cos(a)];
    const rotateZW = (p: number[], a: number) => [p[0], p[1], p[2]*Math.cos(a)-p[3]*Math.sin(a), p[2]*Math.sin(a)+p[3]*Math.cos(a)];

    function projectB4(v: number[]) {
      const pi8 = Math.PI/8;
      const e1 = [Math.cos(pi8), Math.cos(3*pi8), Math.cos(5*pi8), Math.cos(7*pi8)];
      const e2 = [Math.sin(pi8), Math.sin(3*pi8), Math.sin(5*pi8), Math.sin(7*pi8)];
      const x = v[0]*e1[0] + v[1]*e1[1] + v[2]*e1[2] + v[3]*e1[3];
      const y = v[0]*e2[0] + v[1]*e2[1] + v[2]*e2[2] + v[3]*e2[3];
      return { x: x*0.55, y: y*0.55 };
    }

    function project4Dto3D(v: number[]) {
      const d = 2.5, s = d/(d-v[3]*0.4);
      return { x: v[0]*s, y: v[1]*s, z: v[2]*s };
    }

    function lineIntersection(p1: {x:number, y:number}, p2: {x:number, y:number}, p3: {x:number, y:number}, p4: {x:number, y:number}) {
      const x1=p1.x, y1=p1.y, x2=p2.x, y2=p2.y, x3=p3.x, y3=p3.y, x4=p4.x, y4=p4.y;
      const denom = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
      if (Math.abs(denom)<0.0001) return null;
      const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/denom;
      return { x: x1+t*(x2-x1), y: y1+t*(y2-y1) };
    }

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    function getEdgeColor(i: number, j: number, progress: number, morph: number) {
      if (morph >= 1) {
        const v1=vertices4D[i], v2=vertices4D[j];
        for(let c=0; c<4; c++) {
          if(v1[c]!==v2[c]) {
            if(c===3) return COLORS.norX; if(c===0) return COLORS.norY;
            if(c===1) return COLORS.norZ; if(c===2) return COLORS.norW;
          }
        }
      }
      let col = COLORS.edge;
      if ((norXVertices.includes(i)&&norXVertices.includes(j)) || (norXVertices2.includes(i)&&norXVertices2.includes(j))) col = COLORS.norX;
      else if (norYVertices.includes(i)&&norYVertices.includes(j)) col = COLORS.norY;
      else if (norZVertices.includes(i)&&norZVertices.includes(j)) col = COLORS.norZ;
      else if (norWVertices.includes(i)&&norWVertices.includes(j)) col = COLORS.norW;

      if (progress <= 0) return COLORS.edge;
      return col;
    }

    function getVertexColor(i: number, progress: number, morph: number) {
      if (morph >= 1) return COLORS.norV;
      if (norWVertices.includes(i) || i===0) return COLORS.norW;
      if (norZVertices.includes(i)) return COLORS.norZ;
      if (norYVertices.includes(i)) return COLORS.norY;
      return COLORS.norX;
    }

    function render(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      const phaseOrigin = easeOutCubic(Math.min(1, Math.max(0, (time - 0) / 1)));
      const phaseCore = easeOutCubic(Math.min(1, Math.max(0, (time - 1) / 1.5)));
      const phaseStruct = easeOutCubic(Math.min(1, Math.max(0, (time - 2.5) / 2.5)));
      const phaseColor = Math.min(1, Math.max(0, (time - 5) / 3));
      const phaseTranscend = Math.min(1, Math.max(0, (time - 8) / 4));

      const morph3D = phaseTranscend;
      const coreFade = time >= 8 ? Math.max(0, 1 - (time - 8) / 2) : 1;

      let aXW = 0, aYW = 0, aZW = 0;
      if (time >= 8) {
        const rt = time - 8;
        aXW = rt*0.3; aYW = rt*0.2; aZW = rt*0.15;
        viewAngle += 0.003 * morph3D;
      }

      const proj = vertices4D.map(v => {
        const p2 = projectB4(v);
        const pos2 = { x: centerX + p2.x*scale, y: centerY - p2.y*scale };

        let v4 = [...v];
        v4 = rotateXW(v4, aXW); v4 = rotateYW(v4, aYW); v4 = rotateZW(v4, aZW);
        const p3 = project4Dto3D(v4);
        const cos = Math.cos(viewAngle), sin = Math.sin(viewAngle);
        const rx = p3.x*cos - p3.z*sin;
        const rz = p3.x*sin + p3.z*cos;
        const pos3 = { x: centerX + rx*scale*0.65, y: centerY - p3.y*scale*0.65, z: rz };

        return {
          x: lerp(pos2.x, pos3.x, morph3D),
          y: lerp(pos2.y, pos3.y, morph3D)
        };
      });

      if (phaseCore > 0 && coreFade > 0) {
        const i = proj;
        const p = [
          lineIntersection(i[5], i[13], i[2], i[6]),
          lineIntersection(i[5], i[13], i[10], i[11]),
          lineIntersection(i[10], i[11], i[6], i[4]),
          lineIntersection(i[6], i[4], i[13], i[9]),
          lineIntersection(i[13], i[9], i[10], i[2]),
          lineIntersection(i[10], i[2], i[5], i[4]),
          lineIntersection(i[5], i[4], i[11], i[9]),
          lineIntersection(i[11], i[9], i[2], i[6])
        ].filter(pt => pt !== null) as {x:number, y:number}[];

        if (p.length >= 3) {
          const cx = centerX, cy = centerY;
          const size = phaseCore * scale * 0.25;

          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 3);
          gradient.addColorStop(0, COLORS.norV);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = coreFade * 0.5;
          ctx.beginPath(); ctx.arc(cx, cy, size*3, 0, Math.PI*2); ctx.fill();

          ctx.globalAlpha = coreFade;
          ctx.strokeStyle = COLORS.norV;
          ctx.lineWidth = 2;
          ctx.beginPath();
          p.forEach((pt, k) => {
            if (k===0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = COLORS.norVDark;
          ctx.fill();
        }
      }

      if (phaseStruct > 0) {
        ctx.globalAlpha = 1;
        edges.forEach(([a, b]) => {
          const color = getEdgeColor(a, b, phaseColor, morph3D);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(proj[a].x, proj[a].y);
          ctx.lineTo(proj[b].x, proj[b].y);
          ctx.stroke();
        });
      }

      if (phaseStruct > 0) {
        proj.forEach((p, k) => {
          const color = getVertexColor(k, phaseColor, morph3D);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
          ctx.fill();
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
