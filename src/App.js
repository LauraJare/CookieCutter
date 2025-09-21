import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { fabric } from 'fabric';

function App() {
  const [svgData, setSvgData] = useState(null);
  const canvasRef = useRef(null);

  // Create Fabric.js canvas
  React.useEffect(() => {
    const canvas = new fabric.Canvas('draw-canvas', {
      width: 400,
      height: 400,
      backgroundColor: '#f0f0f0',
    });
    canvasRef.current = canvas;
  }, []);

  const handleSvgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const svg = event.target.result;
      fabric.loadSVGFromString(svg, (objects, options) => {
        const obj = fabric.util.groupSVGElements(objects, options);
        canvasRef.current.clear();
        canvasRef.current.add(obj);
        canvasRef.current.renderAll();
        setSvgData(svg);
      });
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      <div>
        <h2>2D Design</h2>
        <input type="file" accept=".svg" onChange={handleSvgUpload} />
        <canvas id="draw-canvas" />
      </div>
      
      <div style={{ width: '400px', height: '400px' }}>
        <h2>3D Preview</h2>
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {svgData && <ExtrudedShape svg={svgData} />}
        </Canvas>
      </div>
    </div>
  );
}

// Simple 3D extrude of SVG shape
function ExtrudedShape({ svg }) {
  const ref = useRef();
  
  React.useEffect(() => {
    import('three').then(({ Shape, ShapeGeometry, Mesh, MeshStandardMaterial }) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const path = doc.querySelector('path');
      if (!path) return;
      const shape = new Shape();
      const pathLength = path.getTotalLength();
      // Very simple: just a box for demo (full SVG to Shape parsing is complex)
      const geometry = new ShapeGeometry(new Shape().moveTo(0,0).lineTo(2,0).lineTo(2,2).lineTo(0,2).closePath());
      const material = new MeshStandardMaterial({ color: 'orange', metalness: 0.2, roughness: 0.8 });
      const mesh = new Mesh(geometry, material);
      ref.current.add(mesh);
    });
  }, [svg]);

  return <group ref={ref} />;
}

export default App;
