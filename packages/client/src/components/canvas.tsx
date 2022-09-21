import React, { useRef, useEffect } from "react";
import styled from "@emotion/styled";

const StyledWrapper = styled("canvas")({
  border: "10px solid black",
  width: "calc(100% - 20px)",
  height: "calc(100vh - 125px)",
});

const Canvas = () => {
  const canvasRef = useRef(null)

  const draw = (ctx: CanvasRenderingContext2D | null) => {
    ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height)
    ctx?.beginPath();
    ctx?.rect(20, 20, 40, 18);
    ctx?.fill();
    if(ctx !== null) {
      ctx.fillStyle = "green";
    }
    ctx?.fillRect(10, 10, 150, 100);
  }

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const context = canvas?.getContext('2d')
    draw(context)
    return () => {
    }
  }, [])

  // const canvasRef = useD3(
  //   (ctx) => {
  //     ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height)
  //     ctx?.beginPath();
  //     ctx?.rect(20, 20, 100, 10);
  //     ctx?.stroke();
  //   }
  // )
  return (
    <div>
      <StyledWrapper ref={canvasRef} />
    </div>
  );
};

export default Canvas;
