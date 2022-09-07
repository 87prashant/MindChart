import React, { useRef, useEffect } from "react";
import styled from "@emotion/styled";
// import { Theme } from "@emotion/react";

const StyledWrapper = styled("canvas")({
  border: "10px solid black",
  width: "calc(100% - 20px)",
  height: "calc(100vh - 125px)",
});

const Canvas = () => {
  const canvasRef = useRef(null)
  
  // verify the usage of ? and ! here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draw = (ctx: CanvasRenderingContext2D | null, frameCount: number) => {
    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx!.fillStyle = '#000000'
    ctx?.beginPath()
    ctx?.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx?.fill()
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current as unknown as HTMLCanvasElement
    const context = canvas?.getContext('2d')
    let frameCount = 0
    let animationFrameId: number
    
    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <div>
      <StyledWrapper ref={canvasRef} />
    </div>
  );
};

export default Canvas;
