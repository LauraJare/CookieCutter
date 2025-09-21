import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export default function Canvas2D({ onSvgChange }) {
  const canvasRef = useRef(null);

  useEffect(() => {
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
        onSvgChange(svg);
      });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".svg" onChange={handleSvgUpload} />
      <canvas id="draw-canvas" />
    </div>
  );
}
