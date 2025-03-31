import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

interface CanvasEditorProps {
  imageUrl: string;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ imageUrl }) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas("canvas", {
      width: 600,
      height: 600,
    });
    canvasRef.current = canvasInstance;
    setCanvas(canvasInstance);

    let isMounted = true;
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        if (!isMounted || !canvasInstance) return;
        img.scaleToWidth(canvasInstance.getWidth() * 0.8);
        canvasInstance.add(img);
        canvasInstance.centerObject(img);
        img.setCoords();
        canvasInstance.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
    return () => {
      isMounted = false;
      if (canvasRef.current) {
        canvasRef.current.dispose();
        canvasRef.current = null;
      }
      setCanvas(null);
    };
  }, [imageUrl]);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox("Your Text Here", {
      left: 180,
      top: 180,
      fontSize: 20,
      fill: "black",
    });
    canvas.add(text);
    canvas.renderAll();
  };

  const addShape = (shape: "rectangle" | "circle" | "triangle") => {
    if (!canvas) return;
    let shapeObj;
    switch (shape) {
      case "rectangle":
        shapeObj = new fabric.Rect({
          left: 240,
          top: 200,
          width: 100,
          height: 50,
          fill: "blue",
        });
        break;
      case "circle":
        shapeObj = new fabric.Circle({
          left: 150,
          top: 260,
          radius: 50,
          fill: "red",
        });
        break;
      case "triangle":
        shapeObj = new fabric.Triangle({
          left: 240,
          top: 260,
          width: 100,
          height: 100,
          fill: "green",
        });
        break;
      default:
        return;
    }
    canvas.add(shapeObj);
    canvas.renderAll();
  };
  const resetCanvas = () => {
    if (!canvas) return;
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        canvas.clear();
        img.scaleToWidth(canvas.getWidth() * 0.8);
        canvas.add(img);
        canvas.centerObject(img);
        img.setCoords();
        canvas.renderAll();
      },
      { crossOrigin: "anonymous" }
    );
  };
  const logCanvasLayers = () => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const layers = objects.map((obj, index) => {
      return {
        index,
        type: obj.type,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        fill: obj.fill,
        text: obj.type === "textbox" ? (obj as fabric.Textbox).text : undefined,
      };
    });
    console.log("Canvas Layers:", layers);
    alert("Check the console for layers info.");
  };
  const downloadImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png" });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "edited-image.png";
    link.click();
  };

  return (
    <div className="canvas-editor">
      <canvas id="canvas" style={{ border: "1px solid #ccc" }}></canvas>
      <div className="toolbar">
        <button onClick={addText}>Add Text</button>
        <button onClick={() => addShape("rectangle")}>Rectangle</button>
        <button onClick={() => addShape("circle")}>Circle</button>
        <button onClick={() => addShape("triangle")}>Triangle</button>
        <button onClick={resetCanvas}>Reset</button>
        <button onClick={downloadImage}>Download</button>
        <button onClick={logCanvasLayers}>Log Layers</button>
      </div>
    </div>
  );
};

export default CanvasEditor;
