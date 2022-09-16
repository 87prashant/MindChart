import React, { useRef, useEffect } from "react";
import styled from "@emotion/styled";
import useD3 from '../hooks/useD3'

const StyledWrapper = styled("canvas")({
  border: "10px solid black",
  width: "calc(100% - 20px)",
  height: "calc(100vh - 125px)",
});

const Canvas = () => {
  // const canvasRef = useRef(null)
  
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // const draw = (ctx: CanvasRenderingContext2D | null) => {
  //   ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height)
  //   ctx?.beginPath();
  //   ctx?.rect(20, 20, 100, 10);
  //   ctx?.stroke();
  // }


  // useEffect(() => {
  //   const canvas = canvasRef.current as unknown as HTMLCanvasElement
  //   const context = canvas?.getContext('2d')
  //   draw(context)
  //   return () => {
  //   }
  // }, [])

  const canvasRef = useD3(
    (ctx) => {
      ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height)
      ctx?.beginPath();
      ctx?.rect(20, 20, 100, 10);
      ctx?.stroke();
    }
  )
  return (
    <div>
      <StyledWrapper ref={canvasRef} />
    </div>
  );
};

export default Canvas;
