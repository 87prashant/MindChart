// Optimize the resize feature

import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import { NodeDataType } from "./NodeForm";
import { Misc } from "./constants";

const StyledWrapper = styled("div")<{ canvasScale: number }>((canvasScale) => ({
  height: `calc(100vh - ${Misc.HEADER_HEIGHT}px)`,
  overflow: "hidden",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "& svg": {
    "& g": {
      "& circle": {
        cursor: "pointer",
        transform: `scale(${canvasScale})`,
      },
    },
  },
}));

interface Props {
  savedData: NodeDataType[];
  isChartAdded: boolean;
  setIsChartAdded: any;
  handleNodeClick: any;
  mainRef: any;
  dimensions: {
    w: number;
    h: number;
  };
  setShowNodeClickModal: any;
  setShowProfileModal: any;
  setCanvasScale: any;
  canvasScale: number;
}

const Main = (props: Props) => {
  const {
    savedData,
    isChartAdded,
    setIsChartAdded,
    handleNodeClick,
    mainRef,
    dimensions,
    setShowNodeClickModal,
    setShowProfileModal,
    setCanvasScale,
    canvasScale,
  } = props;

  const handleWheel = (e: any) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      setCanvasScale((prev: number) => prev + zoomDelta);
    }
  };

  useEffect(() => {
    const canvas = mainRef.current;
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () =>
      canvas.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const { w, h } = dimensions;
    const newProps = {
      w,
      h,
      savedData,
      handleNodeClick,
      setShowNodeClickModal,
    };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    mainRef.current!.innerHTML = "";
    mainRef.current!.append(svg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData, dimensions]);

  function handleClick(e: any) {
    setShowProfileModal(false);
    setShowNodeClickModal(false);
  }

  return (
    <StyledWrapper
      onClick={handleClick}
      ref={mainRef}
      canvasScale={canvasScale}
    ></StyledWrapper>
  );
};

export default Main;
