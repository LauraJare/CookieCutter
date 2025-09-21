import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function Preview3D({ svg }) {
  const meshRef = useRef();

  useEffect(() => {
    if (!svg) return;

    // Simple placeholder: cube extrusion (replace with full SVG extrusion)
    const shape = new THREE.Shape();
    shape.moveTo(0,0).lineTo(2,0).lineTo(2,2).lineTo(0,2).closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
    const material = new THREE.MeshStandardMaterial({ color: 'orange', metalness: 0.2, roughness: 0.8 });
    
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current.add(mesh);
  }, [svg]);

  return (
    <Canvas camera={{ position: [5, 5, 10] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <group ref={meshRef} />
    </Canvas>
  );
}
