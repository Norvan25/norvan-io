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

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      centerX = width / 2;
      centerY = height / 2;
      scale = Math.min(width, height) * 0.35;
    };

    const COLORS = {
      norX: '#007fff',
      norY: '#7f4fc9',
      norZ: '#f28500',
      norW: '#009e60',
      norV: '#66d3fa',
      norVDark: '#007acc',
      edge: '#2a2f40',
    };

    function projectB4(v: number[]) {
      const pi8 = Math.PI / 8;
      const e1 = [Math.cos(pi8), Math.cos(3*pi8), Math.cos(5*pi8), Math.cos(7*pi8)];
      const e2 = [Math.sin(pi8), Math.sin(3*pi8), Math.sin(5*pi8), Math.sin(7*pi8)];
      const x = v[0]*e1[0] + v[1]*e1[1] + v[2]*e1[2] + v[3]*e1[3];
      const y = v[0]*e2[0] + v[1]*e2[1] + v[2]*e2[2] + v[3]*e2[3];
      return { x: x * 0.55, y: y * 0.55 };
    }

    function rotateXW(p: number[], a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return [p[0]*c - p[3]*s, p[1], p[2], p[0]*s + p[3]*c];
    }
    function rotateYW(p: number[], a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return [p[0], p[1]*c - p[3]*s, p[2], p[1]*s + p[3]*c];
    }
    function rotateZW(p: number[], a: number) {
      const c = Math.cos(a), s = Math.sin(a);
      return [p[0], p[1], p[2]*c - p[3]*s, p[2]*s + p[3]*c];
    }

    function project4Dto3D(v: number[]) {
      const d = 2.5;
      const s = d / (d - v[3] * 0.4);
      return { x: v[0] * s, y: v[1] * s, z: v[2] * s };
    }

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

    const norXFaces = [[2, 6, 7, 3], [0, 1, 5, 4]];
    const norYFaces = [[4, 12, 14, 6], [5, 13, 15, 7]];
    const norZFaces = [[11, 15, 14, 10], [9, 8, 12, 13]];
    const norWFaces = [[1, 9, 11, 3], [0, 8, 10, 2]];

    const tesseractFaces: number[][] = [];
    for (let i = 0; i < 16; i++)
      for (let j = i + 1; j < 16; j++)
        for (let k = j + 1; k < 16; k++)
          for (let l = k + 1; l < 16; l++) {
            const quad = [i, j, k, l];
            const pts = quad.map(idx => vertices4D[idx]);
            let shared = 0;
            for (let c = 0; c < 4; c++) if (pts.every(p => p[c] === pts[0][c])) shared++;
            if (shared === 2) {
              tesseractFaces.push(quad);
            }
          }

    function getTesseractFaceColor(faceIndices: number[]) {
      const pts = faceIndices.map(i => vertices4D[i]);
      if (pts.every(p => p[3] === pts[0][3])) return COLORS.norX;
      if (pts.every(p => p[0] === pts[0][0])) return COLORS.norY;
      if (pts.every(p => p[1] === pts[0][1])) return COLORS.norZ;
      if (pts.every(p => p[2] === pts[0][2])) return COLORS.norW;
      return COLORS.norX;
    }

    const PHASE = {
      ORIGIN: { start: 0, end: 1 },
      CORE: { start: 1, end: 2.5 },
      STRUCTURE: { start: 2.5, end: 5 },
      COLORS: { start: 5, end: 8 },
      TRANSCEND: { start: 8, end: 12 }
    };

    let startTime: number | null = null;
    let viewAngle = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const getPhaseProgress = (time: number, phase: {start:number, end:number}) => {
      if (time < phase.start) return 0;
      if (time > phase.end) return 1;
      return (time - phase.start) / (phase.end - phase.start);
    };

    function render(timestamp: number) {
      if (!ctx || !canvas) return;
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      const originProgress = easeOutCubic(getPhaseProgress(time, PHASE.ORIGIN));
      const coreProgress = easeOutCubic(getPhaseProgress(time, PHASE.CORE));
      const structureProgress = easeOutCubic(getPhaseProgress(time, PHASE.STRUCTURE));
      const colorProgress = easeInOutSine(getPhaseProgress(time, PHASE.COLORS));
      const transcendProgress = easeInOutSine(getPhaseProgress(time, PHASE.TRANSCEND));

      const morph3D = transcendProgress;
      const coreFade = time >= PHASE.TRANSCEND.start ? Math.max(0, 1 - (time - PHASE.TRANSCEND.start) / 2) : 1;

      let aXW = 0, aYW = 0, aZW = 0;
      if (time >= PHASE.TRANSCEND.start) {
        const rotTime = time - PHASE.TRANSCEND.start;
        aXW = rotTime * 0.3 + Math.sin(rotTime * 0.2) * 0.5;
        aYW = rotTime * 0.2 + Math.cos(rotTime * 0.15) * 0.4;
        aZW = rotTime * 0.15 + Math.sin(rotTime * 0.25) * 0.3;
        viewAngle += 0.003 * morph3D;
      }

      const projected = vertices4D.map(v => {
        const logo2D = projectB4(v);
        const logoPos = { x: centerX + logo2D.x * scale, y: centerY - logo2D.y * scale };

        let v4d = [...v];
        v4d = rotateXW(v4d, aXW); v4d = rotateYW(v4d, aYW); v4d = rotateZW(v4d, aZW);
        const pos3d = project4Dto3D(v4d);

        const cos = Math.cos(viewAngle), sin = Math.sin(viewAngle);
        const rx = pos3d.x * cos - pos3d.z * sin;
        const rz = pos3d.x * sin + pos3d.z * cos;

        const tess3D = { x: centerX + rx * scale * 0.65, y: centerY - pos3d.y * scale * 0.65, z: rz };

        return {
          x: lerp(logoPos.x, tess3D.x, morph3D),
          y: lerp(logoPos.y, tess3D.y, morph3D),
          z: morph3D > 0 ? tess3D.z : 0
        };
      });

      if (originProgress > 0 && coreProgress < 1) {
        const pointSize = originProgress * 8 * (1 - coreProgress);
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pointSize * 3);
        glow.addColorStop(0, 'rgba(102, 211, 250, 0.8)');
        glow.addColorStop(1, 'rgba(102, 211, 250, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(centerX - pointSize*3, centerY - pointSize*3, pointSize * 6, pointSize * 6);
        ctx.beginPath(); ctx.arc(centerX, centerY, pointSize, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.norV; ctx.fill();
      }

      if (colorProgress > 0 && coreFade > 0) {
        const drawFace = (faces: number[][], color: string) => {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.4 * colorProgress * coreFade;
          faces.forEach(face => {
            ctx.beginPath();
            ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
            face.slice(1).forEach(v => ctx.lineTo(projected[v].x, projected[v].y));
            ctx.closePath(); ctx.fill();
          });
          ctx.globalAlpha = 1;
        };
        drawFace(norXFaces, COLORS.norX);
        drawFace(norYFaces, COLORS.norY);
        drawFace(norZFaces, COLORS.norZ);
        drawFace(norWFaces, COLORS.norW);
      }

      if (morph3D > 0) {
        const sortedFaces = tesseractFaces.map(face => ({
          vertices: face,
          avgZ: face.reduce((sum, vi) => sum + projected[vi].z, 0) / 4,
          color: getTesseractFaceColor(face)
        })).sort((a, b) => a.avgZ - b.avgZ);

        ctx.globalAlpha = 0.3 * morph3D;
        sortedFaces.forEach(face => {
          const center = { x:0, y:0 };
          face.vertices.forEach(i => { center.x += projected[i].x; center.y += projected[i].y });
          center.x/=4; center.y/=4;
          const sortedVerts = face.vertices.slice().sort((a,b) =>
             Math.atan2(projected[a].y - center.y, projected[a].x - center.x) -
             Math.atan2(projected[b].y - center.y, projected[b].x - center.x)
          );

          ctx.beginPath();
          ctx.moveTo(projected[sortedVerts[0]].x, projected[sortedVerts[0]].y);
          sortedVerts.slice(1).forEach(i => ctx.lineTo(projected[i].x, projected[i].y));
          ctx.closePath();
          ctx.fillStyle = face.color;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      if (structureProgress > 0) {
        edges.forEach(([i, j]) => {
          const midX = (projected[i].x + projected[j].x) / 2;
          const dist = Math.sqrt((midX - centerX)**2 + ((projected[i].y + projected[j].y)/2 - centerY)**2);
          const maxDist = scale * 0.6;
          const delay = (dist / maxDist) * 0.7;
          const prog = Math.max(0, Math.min(1, (structureProgress - delay) / (1 - delay)));

          if (prog > 0) {
            const startX = lerp(centerX, projected[i].x, prog);
            const startY = lerp(centerY, projected[i].y, prog);
            const endX = lerp(centerX, projected[j].x, prog);
            const endY = lerp(centerY, projected[j].y, prog);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = COLORS.edge;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      }

      if (structureProgress > 0) {
         projected.forEach((p) => {
            const dist = Math.sqrt((p.x - centerX)**2 + (p.y - centerY)**2);
            const delay = (dist / (scale * 0.6)) * 0.5;
            const prog = Math.max(0, Math.min(1, (structureProgress - delay) / (1 - delay)));

            if (prog > 0) {
               const radius = 6.9 * prog;
               ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
               ctx.fillStyle = COLORS.edge; ctx.fill();
            }
         });
      }

      animationId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}
