import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = {
  norX: "#007FFF",
  norY: "#7F4FC9",
  norZ: "#F28500",
  norW: "#009E60",
  norV: "#00A6FB"
};

function rotateXW(p: number[], a: number) {
  return [p[0]*Math.cos(a) - p[3]*Math.sin(a), p[1], p[2], p[0]*Math.sin(a) + p[3]*Math.cos(a)];
}
function rotateYW(p: number[], a: number) {
  return [p[0], p[1]*Math.cos(a) - p[3]*Math.sin(a), p[2], p[1]*Math.sin(a) + p[3]*Math.cos(a)];
}
function rotateZW(p: number[], a: number) {
  return [p[0], p[1], p[2]*Math.cos(a) - p[3]*Math.sin(a), p[2]*Math.sin(a) + p[3]*Math.cos(a)];
}
function project(p: number[]) {
  const d = 3;
  const s = d/(d-p[3]);
  return new THREE.Vector3(p[0]*s, p[1]*s, p[2]*s);
}

export function Tesseract() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const facesRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(size.width < 768);
  }, [size.width]);

  const { vertices4D, edges, faces } = useMemo(() => {
    const verts: number[][] = [];
    for(let x=-1;x<=1;x+=2) for(let y=-1;y<=1;y+=2) for(let z=-1;z<=1;z+=2) for(let w=-1;w<=1;w+=2) verts.push([x,y,z,w]);

    const e: [number, number][] = [];
    for(let i=0;i<16;i++) for(let j=i+1;j<16;j++) {
      let diff=0;
      for(let k=0;k<4;k++) diff+=(verts[i][k]!==verts[j][k]?1:0);
      if(diff===1) e.push([i,j]);
    }

    const f: number[][] = [];
    for(let i=0;i<16;i++) for(let j=i+1;j<16;j++) for(let k=j+1;k<16;k++) for(let l=k+1;l<16;l++) {
      const quad = [i,j,k,l];
      let shared=0;
      for(let c=0;c<4;c++) if(quad.map(idx=>verts[idx][c]).every((v,_,arr)=>v===arr[0])) shared++;
      if(shared===2) f.push(quad);
    }
    return { vertices4D: verts, edges: e, faces: f };
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !linesRef.current || !facesRef.current) return;
    const time = state.clock.elapsedTime;
    const ang = { xw: time*0.5, yw: time*0.3, zw: time*0.2 };

    const baseScale = isMobile ? 0.5 : 0.7;
    groupRef.current.scale.setScalar(baseScale);

    const proj = vertices4D.map(v => {
      let r = v;
      r = rotateXW(r, ang.xw);
      r = rotateYW(r, ang.yw);
      r = rotateZW(r, ang.zw);
      return { pos: project(r), w: r[3] };
    });

    groupRef.current.children.forEach((child, i) => {
      if (child.name === 'vertex' && proj[i]) {
        child.position.copy(proj[i].pos);
        const isOuter = proj[i].w > 0;
        const sizeMult = isMobile ? 0.7 : 1.0;
        child.scale.setScalar((isOuter ? 0.06 : 0.04) * sizeMult);
        (child as THREE.Mesh).material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(isOuter ? COLORS.norV : COLORS.norZ);
      }
    });

    const lPos = linesRef.current.geometry.attributes.position.array as Float32Array;
    let li = 0;
    edges.forEach(([i, j]) => {
      lPos[li++] = proj[i].pos.x; lPos[li++] = proj[i].pos.y; lPos[li++] = proj[i].pos.z;
      lPos[li++] = proj[j].pos.x; lPos[li++] = proj[j].pos.y; lPos[li++] = proj[j].pos.z;
    });
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    const fPos = facesRef.current.geometry.attributes.position.array as Float32Array;
    const fCol = facesRef.current.geometry.attributes.color.array as Float32Array;
    let fi = 0;
    let ci = 0;

    faces.forEach(quad => {
      const ws = quad.map(idx => vertices4D[idx][3]);
      const col = new THREE.Color(COLORS.norY);
      if (ws.every(w => w === 1)) col.set(COLORS.norV);
      if (ws.every(w => w === -1)) col.set(COLORS.norZ);

      const p = quad.map(idx => proj[idx].pos);

      const center = new THREE.Vector3();
      p.forEach(pt => center.add(pt));
      center.divideScalar(4);

      const v1 = new THREE.Vector3().subVectors(p[1], p[0]);
      const v2 = new THREE.Vector3().subVectors(p[2], p[0]);
      const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

      const withAngles = quad.map((idx, i) => {
        const vec = new THREE.Vector3().subVectors(p[i], center);
        const ref = new THREE.Vector3().subVectors(p[0], center);
        const cross = new THREE.Vector3().crossVectors(ref, vec);
        const angle = Math.atan2(cross.dot(normal), vec.dot(ref));
        return { idx, angle };
      });

      withAngles.sort((a, b) => a.angle - b.angle);
      const sortedP = withAngles.map(item => proj[item.idx].pos);

      const push = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
         fPos[fi++]=a.x; fPos[fi++]=a.y; fPos[fi++]=a.z;
         fPos[fi++]=b.x; fPos[fi++]=b.y; fPos[fi++]=b.z;
         fPos[fi++]=c.x; fPos[fi++]=c.y; fPos[fi++]=c.z;
         for(let k=0;k<3;k++) {
           fCol[ci++]=col.r;
           fCol[ci++]=col.g;
           fCol[ci++]=col.b;
         }
      };

      push(sortedP[0], sortedP[1], sortedP[2]);
      push(sortedP[0], sortedP[2], sortedP[3]);
    });
    facesRef.current.geometry.attributes.position.needsUpdate = true;
    facesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {vertices4D.map((_, i) => (
        <mesh key={i} name="vertex">
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial />
        </mesh>
      ))}

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edges.length * 2}
            itemSize={3}
            array={new Float32Array(edges.length * 6)}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </lineSegments>

      <mesh ref={facesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={faces.length * 6}
            itemSize={3}
            array={new Float32Array(faces.length * 18)}
          />
          <bufferAttribute
            attach="attributes-color"
            count={faces.length * 6}
            itemSize={3}
            array={new Float32Array(faces.length * 18)}
          />
        </bufferGeometry>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
