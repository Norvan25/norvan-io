import { useRef, useEffect } from 'react';

export default function Tesseract() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number, centerX: number, centerY: number, scale: number;
    let isMobile = false;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rectWidth = window.innerWidth;
      const rectHeight = window.innerHeight;

      canvas.width = rectWidth * dpr;
      canvas.height = rectHeight * dpr;

      canvas.style.width = `${rectWidth}px`;
      canvas.style.height = `${rectHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      width = rectWidth;
      height = rectHeight;
      centerX = width / 2;
      centerY = height / 2;

      isMobile = width < 768;
      const multiplier = isMobile ? 0.30 : 0.22;
      scale = Math.min(width, height) * multiplier;
    }

    const COLORS = {
      norX: '#007fff',
      norY: '#7f4fc9',
      norZ: '#f28500',
      norW: '#009e60',
      norV: '#66d3fa',
      norVDark: '#007acc',
      edge: '#2a2f40',
      bg: '#0d1326'
    };

    // Helper to parse hex color to RGB
    function hexToRgb(hex: string): { r: number; g: number; b: number } {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    }

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
    for (let w = -1; w <= 1; w += 2) {
      for (let z = -1; z <= 1; z += 2) {
        for (let y = -1; y <= 1; y += 2) {
          for (let x = -1; x <= 1; x += 2) {
            vertices4D.push([x, y, z, w]);
          }
        }
      }
    }

    const edges: number[][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        }
        if (diff === 1) edges.push([i, j]);
      }
    }

    const norXVertices = [3, 2, 6, 7, 11, 10, 14, 15];
    const norXVertices2 = [13, 12, 8, 9, 4, 5, 1, 2];
    const norYVertices = [4, 12, 14, 6, 7, 15, 13, 5];
    const norZVertices = [11, 15, 14, 10, 9, 8, 12, 13];
    const norWVertices = [1, 9, 11, 3];
    const norWVertices2 = [5, 13, 15, 7];

    const norXFaces = [[2, 6, 7, 3], [0, 1, 5, 4]];
    const norYFaces = [[4, 12, 14, 6], [5, 13, 15, 7]];
    const norZFaces = [[11, 15, 14, 10], [9, 8, 12, 13]];
    const norWFaces = [[1, 9, 11, 3], [0, 8, 10, 2]];

    const tesseractFaces: number[][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        for (let k = j + 1; k < 16; k++) {
          for (let l = k + 1; l < 16; l++) {
            const quad = [i, j, k, l];
            const pts = quad.map(idx => vertices4D[idx]);
            let shared = 0;
            for (let c = 0; c < 4; c++) {
              if (pts.every(p => p[c] === pts[0][c])) shared++;
            }
            if (shared === 2) {
              const varying: number[] = [];
              for (let c = 0; c < 4; c++) {
                if (!pts.every(p => p[c] === pts[0][c])) varying.push(c);
              }
              const sorted = quad.slice().sort((a, b) => {
                const pa = vertices4D[a], pb = vertices4D[b];
                if (pa[varying[0]] !== pb[varying[0]]) return pa[varying[0]] - pb[varying[0]];
                return pa[varying[1]] - pb[varying[1]];
              });
              tesseractFaces.push([sorted[0], sorted[1], sorted[3], sorted[2]]);
            }
          }
        }
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

    const norXEdges = [[8,0], [4,0], [0,1]];
    const norWEdgesOpacity = [[0,2]];

    const PHASE = {
      ORIGIN: { start: 0, end: 1 },
      CORE: { start: 1, end: 2.5 },
      STRUCTURE: { start: 2.5, end: 5 },
      COLORS: { start: 5, end: 8 },
      TRANSCEND: { start: 8, end: 12 }
    };

    let startTime: number | null = null;
    let viewAngle = 0;
    let animationId: number;

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
    function easeInOutSine(t: number) { return -(Math.cos(Math.PI * t) - 1) / 2; }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function getPhaseProgress(time: number, phase: {start: number, end: number}) {
      if (time < phase.start) return 0;
      if (time > phase.end) return 1;
      return (time - phase.start) / (phase.end - phase.start);
    }

    function lineIntersection(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, p4: {x: number, y: number}) {
      const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
      const x3 = p3.x, y3 = p3.y, x4 = p4.x, y4 = p4.y;
      const denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
      if (Math.abs(denom) < 0.0001) return null;
      const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;
      return { x: x1 + t*(x2-x1), y: y1 + t*(y2-y1) };
    }

    function getEdgeColor(i: number, j: number, colorProgress: number, use3DColors = false) {
      if (use3DColors) {
        const v1 = vertices4D[i];
        const v2 = vertices4D[j];
        for (let c = 0; c < 4; c++) {
          if (v1[c] !== v2[c]) {
            if (c === 3) return COLORS.norX;
            if (c === 0) return COLORS.norY;
            if (c === 1) return COLORS.norZ;
            if (c === 2) return COLORS.norW;
          }
        }
      }

      const isNorX = norXVertices.includes(i) && norXVertices.includes(j);
      const isNorX2 = norXVertices2.includes(i) && norXVertices2.includes(j);
      const isNorXEdge = norXEdges.some(([a,b]) => (i===a && j===b) || (i===b && j===a));
      const isNorY = norYVertices.includes(i) && norYVertices.includes(j);
      const isNorZ = norZVertices.includes(i) && norZVertices.includes(j);
      const isNorW = norWVertices.includes(i) && norWVertices.includes(j);
      const isNorW2 = norWVertices2.includes(i) && norWVertices2.includes(j);
      const isNorWEdge = norWEdgesOpacity.some(([a,b]) => (i===a && j===b) || (i===b && j===a));

      let targetColor = COLORS.edge;
      if (isNorX || isNorX2 || isNorXEdge) targetColor = COLORS.norX;
      else if (isNorY) targetColor = COLORS.norY;
      else if (isNorZ) targetColor = COLORS.norZ;
      else if (isNorW || isNorW2 || isNorWEdge) targetColor = COLORS.norW;

      if (colorProgress <= 0) return COLORS.edge;
      if (colorProgress >= 1) return targetColor;

      return targetColor;
    }

    // ========== GLASS FACE RENDERING ==========
    // Simplified version for mobile, full version for desktop
    function drawGlassFace(
      face: number[],
      projected: { x: number; y: number; z: number }[],
      color: string,
      baseAlpha: number,
      time: number,
      zNormal: number
    ) {
      const { r, g, b } = hexToRgb(color);

      // Face center
      const cx = face.reduce((sum, vi) => sum + projected[vi].x, 0) / 4;
      const cy = face.reduce((sum, vi) => sum + projected[vi].y, 0) / 4;

      // Pulse glow
      const pulse = 0.85 + 0.15 * Math.sin(time * 2);

      // Depth-based transparency
      const depthFactor = Math.max(0.3, Math.min(1, 0.5 + zNormal * 0.5));
      const alpha = baseAlpha * depthFactor * pulse;

      // Path helper
      function tracePath() {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
        for (let i = 1; i < face.length; i++) {
          ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
        }
        ctx.closePath();
      }

      // Calculate max distance for gradients
      let maxDist = 0;
      for (const vi of face) {
        const d = Math.sqrt(
          Math.pow(projected[vi].x - cx, 2) + Math.pow(projected[vi].y - cy, 2)
        );
        if (d > maxDist) maxDist = d;
      }

      // ===== MOBILE: Simplified 2-layer rendering (no shadowBlur) =====
      if (isMobile) {
        // LAYER 1: Simple glass fill with gradient
        const gradient = ctx.createRadialGradient(
          cx - maxDist * 0.2,
          cy - maxDist * 0.2,
          0,
          cx,
          cy,
          maxDist * 1.1
        );
        gradient.addColorStop(0, `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, ${alpha * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);

        tracePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // LAYER 2: Simple edge stroke (no glow)
        tracePath();
        ctx.strokeStyle = `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        return;
      }

      // ===== DESKTOP: Full 4-layer glass rendering =====
      
      // LAYER 1: Outer glow
      tracePath();
      ctx.save();
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
      ctx.shadowBlur = 25;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
      ctx.fill();
      ctx.restore();

      // LAYER 2: Main glass gradient
      const gradient = ctx.createRadialGradient(
        cx - maxDist * 0.3,
        cy - maxDist * 0.3,
        0,
        cx,
        cy,
        maxDist * 1.2
      );
      gradient.addColorStop(0, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, ${alpha * 0.45})`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.22})`);
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
      gradient.addColorStop(1, `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, ${alpha * 0.25})`);

      tracePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // LAYER 3: Rim glow (edge lighting)
      tracePath();
      ctx.save();
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 1.8})`;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = `rgba(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)}, ${alpha * 0.65})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // LAYER 4: Specular highlight
      const highlightGrad = ctx.createRadialGradient(
        cx - maxDist * 0.4,
        cy - maxDist * 0.4,
        0,
        cx - maxDist * 0.4,
        cy - maxDist * 0.4,
        maxDist * 0.5
      );
      highlightGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.35})`);
      highlightGrad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.12})`);
      highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      tracePath();
      ctx.fillStyle = highlightGrad;
      ctx.fill();
    }

    function render(timestamp: number) {
      if (!ctx || !canvas) return;
      if (!startTime) startTime = timestamp;
      const time = (timestamp - startTime) / 1000;
      const currentTime = time;

      ctx.clearRect(0, 0, width, height);

      const originProgress = easeOutCubic(getPhaseProgress(currentTime, PHASE.ORIGIN));
      const coreProgress = easeOutCubic(getPhaseProgress(currentTime, PHASE.CORE));
      const structureProgress = easeOutCubic(getPhaseProgress(currentTime, PHASE.STRUCTURE));
      const colorProgress = easeInOutSine(getPhaseProgress(currentTime, PHASE.COLORS));
      const transcendProgress = easeInOutSine(getPhaseProgress(currentTime, PHASE.TRANSCEND));

      let morph3D = transcendProgress;

      const coreFade = currentTime >= PHASE.TRANSCEND.start ?
        Math.max(0, 1 - (currentTime - PHASE.TRANSCEND.start) / 2) : 1;

      let aXW = 0, aYW = 0, aZW = 0;
      if (currentTime >= PHASE.TRANSCEND.start) {
        const rotTime = currentTime - PHASE.TRANSCEND.start;
        aXW = rotTime * 0.3 + Math.sin(rotTime * 0.2) * 0.5;
        aYW = rotTime * 0.2 + Math.cos(rotTime * 0.15) * 0.4;
        aZW = rotTime * 0.15 + Math.sin(rotTime * 0.25) * 0.3;
        viewAngle += 0.003 * morph3D;
      }

      const projected = vertices4D.map((v) => {
        const logo2D = projectB4(v);
        const logoPos = {
          x: centerX + logo2D.x * scale,
          y: centerY - logo2D.y * scale
        };

        let v4d = [...v];
        v4d = rotateXW(v4d, aXW);
        v4d = rotateYW(v4d, aYW);
        v4d = rotateZW(v4d, aZW);
        const pos3d = project4Dto3D(v4d);

        const cos = Math.cos(viewAngle);
        const sin = Math.sin(viewAngle);
        const rx = pos3d.x * cos - pos3d.z * sin;
        const rz = pos3d.x * sin + pos3d.z * cos;

        const tess3D = {
          x: centerX + rx * scale * 0.65,
          y: centerY - pos3d.y * scale * 0.65,
          z: rz
        };

        return {
          x: lerp(logoPos.x, tess3D.x, morph3D),
          y: lerp(logoPos.y, tess3D.y, morph3D),
          z: morph3D > 0 ? tess3D.z : 0
        };
      });

      const int1 = lineIntersection(projected[5], projected[13], projected[2], projected[6]);
      const int2 = lineIntersection(projected[10], projected[11], projected[6], projected[4]);
      const int3 = lineIntersection(projected[6], projected[4], projected[13], projected[9]);
      const int4 = lineIntersection(projected[13], projected[9], projected[10], projected[2]);
      const int5 = lineIntersection(projected[10], projected[2], projected[5], projected[4]);
      const int6 = lineIntersection(projected[5], projected[4], projected[11], projected[9]);
      const int7 = lineIntersection(projected[11], projected[9], projected[2], projected[6]);
      const int8 = lineIntersection(projected[5], projected[13], projected[10], projected[11]);
      const octagonPoints = [int1, int8, int2, int3, int4, int5, int6, int7].filter(p => p !== null) as {x: number, y: number}[];

      // ========== PHASE 1: ORIGIN POINT ==========
      if (originProgress > 0 && coreProgress < 1) {
        const pointSize = originProgress * 6.4 * (1 - coreProgress);
        const glowSize = pointSize * 3;
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
        glow.addColorStop(0, 'rgba(102, 211, 250, 0.8)');
        glow.addColorStop(1, 'rgba(102, 211, 250, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        ctx.beginPath();
        ctx.arc(centerX, centerY, pointSize, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.norV;
        ctx.fill();
      }

      // ========== DRAW 2D FACES (fade out during transcendence) ==========
      if (colorProgress > 0 && coreFade > 0) {
        const faceAlpha = 0.25 * colorProgress * coreFade;
        const drawFace = (faces: number[][], col: string) => {
           ctx.fillStyle = col;
           ctx.globalAlpha = faceAlpha;
           faces.forEach(face => {
              ctx.beginPath();
              ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
              face.slice(1).forEach(v => ctx.lineTo(projected[v].x, projected[v].y));
              ctx.closePath();
              ctx.fill();
           });
           ctx.globalAlpha = 1;
        };
        drawFace(norXFaces, COLORS.norX);
        drawFace(norYFaces, COLORS.norY);
        drawFace(norZFaces, COLORS.norZ);
        drawFace(norWFaces, COLORS.norW);
      }

      // ========== DRAW 3D GLASS TESSERACT FACES ==========
      if (morph3D > 0) {
        // Sort faces by depth (painter's algorithm - back to front)
        const sortedFaces = tesseractFaces.map(face => {
          const avgZ = face.reduce((sum, vi) => sum + projected[vi].z, 0) / 4;

          // Calculate face normal for depth-based transparency
          const p0 = projected[face[0]];
          const p1 = projected[face[1]];
          const p2 = projected[face[2]];

          const v1 = { x: p1.x - p0.x, y: p1.y - p0.y };
          const v2 = { x: p2.x - p0.x, y: p2.y - p0.y };
          const zNormal = (v1.x * v2.y - v1.y * v2.x) > 0 ? 1 : -1;

          return {
            vertices: face,
            avgZ,
            color: getTesseractFaceColor(face),
            zNormal
          };
        }).sort((a, b) => a.avgZ - b.avgZ);

        const baseAlpha = 0.38 * morph3D;

        // Draw each glass face
        sortedFaces.forEach(face => {
          drawGlassFace(
            face.vertices,
            projected,
            face.color,
            baseAlpha,
            currentTime,
            face.zNormal
          );
        });
      }

      // ========== PHASE 2: CORE OCTAGON (fades out during transcendence) ==========
      if (coreProgress > 0 && coreFade > 0 && octagonPoints.length >= 3) {
        const cx = octagonPoints.reduce((sum, p) => sum + p.x, 0) / octagonPoints.length;
        const cy = octagonPoints.reduce((sum, p) => sum + p.y, 0) / octagonPoints.length;
        
        // Mobile: 5% smaller octagon (0.75 * 0.95 = 0.7125)
        const scaleFactor = isMobile ? 0.7125 : 0.75;
        const coreSize = coreProgress;

        if (coreSize > 0.1) {
          const innerOctagon = octagonPoints.map(p => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const newDist = (dist * scaleFactor + 7) * coreSize;
            return { x: cx + (dx / dist) * newDist, y: cy + (dy / dist) * newDist };
          });

          let maxDist = 0;
          for (const p of innerOctagon) {
            const d = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
            if (d > maxDist) maxDist = d;
          }

          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist);
          gradient.addColorStop(0, COLORS.norV);
          gradient.addColorStop(1, COLORS.norVDark);

          ctx.globalAlpha = coreFade;
          ctx.beginPath();
          ctx.moveTo(innerOctagon[0].x, innerOctagon[0].y);
          innerOctagon.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
          ctx.closePath();
          ctx.fillStyle = gradient; ctx.fill();
          ctx.strokeStyle = COLORS.norV; ctx.lineWidth = 3; ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // ========== PHASE 3: STRUCTURE (EDGES) ==========
      if (structureProgress > 0) {
        const sortedEdges = edges.map(([i, j]) => ({
          i, j, z: (projected[i].z + projected[j].z) / 2
        })).sort((a, b) => a.z - b.z);

        sortedEdges.forEach(({ i, j }) => {
          const midX = (projected[i].x + projected[j].x) / 2;
          const midY = (projected[i].y + projected[j].y) / 2;
          const dist = Math.sqrt((midX - centerX)**2 + (midY - centerY)**2);
          const delay = (dist / (scale * 0.6)) * 0.7;
          const prog = Math.max(0, Math.min(1, (structureProgress - delay) / (1 - delay)));

          if (prog > 0) {
            const use3D = morph3D >= 1;
            const col = getEdgeColor(i, j, colorProgress, use3D);
            const startX = lerp(centerX, projected[i].x, prog);
            const startY = lerp(centerY, projected[i].y, prog);
            const endX = lerp(centerX, projected[j].x, prog);
            const endY = lerp(centerY, projected[j].y, prog);

            // Add glow to edges in 3D mode (desktop only for performance)
            if (morph3D > 0 && !isMobile) {
              const rgb = hexToRgb(col);
              ctx.save();
              ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.5 * morph3D})`;
              ctx.shadowBlur = 6;
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.strokeStyle = col;
              ctx.lineWidth = 1.2;
              ctx.stroke();
              ctx.restore();
            } else {
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.strokeStyle = col;
              ctx.lineWidth = isMobile ? 1.0 : 0.8;
              ctx.stroke();
            }
          }
        });

        // ========== VERTICES WITH GLOW ==========
        // FIX: All dots use #66d3fa color, opacity reduced by 5%
        const sortedVerts = projected.map((p, i) => ({ ...p, i })).sort((a, b) => a.z - b.z);
        sortedVerts.forEach(({ x, y, i }) => {
          const dist = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
          const delay = (dist / (scale * 0.6)) * 0.5;
          const prog = Math.max(0, Math.min(1, (structureProgress - delay) / (1 - delay)));

          if (prog > 0) {
            // Always use #66d3fa (COLORS.norV) for all vertices
            const col = COLORS.norV;
            const radius = (morph3D > 0 ? 3.5 : 2.5) * prog;
            const glowR = radius * 3;

            const rgb = hexToRgb(col);
            
            // Reduced opacity by 5%: 0.7 -> 0.65, 0.25 -> 0.20
            const glow = ctx.createRadialGradient(x, y, radius * 0.5, x, y, glowR);
            glow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.65)`);
            glow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.20)`);
            glow.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

            ctx.beginPath();
            ctx.arc(x, y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />;
}
