// Optimize the resize feature

import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import { NodeDataType } from "./NodeForm";
import { Misc } from "./constants";

const StyledWrapper = styled("div")<{ canvasScale: number }>(
  ({ canvasScale }) => ({
    height: `calc(100vh - ${Misc.HEADER_HEIGHT}px)`,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    "& svg": {
      "& g": {
        "& circle": {
          cursor: "pointer",
        },
      },
    },
  })
);

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
  setShowCanvasScaleOverlay: any;
}

type canvasTimeoutType = {
  canvasTimeoutId: NodeJS.Timeout | undefined;
  overlayTimeoutId: NodeJS.Timeout | undefined;
};

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
    setShowCanvasScaleOverlay,
  } = props;

  const [scaleTimeoutId, setScaleTimeoutId] = useState<canvasTimeoutType>({
    canvasTimeoutId: undefined,
    overlayTimeoutId: undefined,
  });

  useEffect(() => {
    const handleWheel = (e: any) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
        setCanvasScale((prev: number) => {
          const newVal = prev + zoomDelta;
          if (newVal < 0.3) return 0.3;
          else if (newVal > 1) return 1;
          else return newVal;
        });
        setIsChartAdded(false);
        setShowNodeClickModal(false);

        setShowCanvasScaleOverlay(true);
        clearTimeout(scaleTimeoutId.overlayTimeoutId);
        setScaleTimeoutId((prev: canvasTimeoutType) => {
          const temp = setTimeout(() => setShowCanvasScaleOverlay(false), 1000);
          return { ...prev, overlayTimeoutId: temp };
        });
      }
    };
    const canvas = mainRef.current;
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasScale]);

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
      canvasScale,
    };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    clearTimeout(scaleTimeoutId.canvasTimeoutId);
    setScaleTimeoutId((prev: canvasTimeoutType) => {
      const temp = setTimeout(() => {
        mainRef.current!.innerHTML = "";
        mainRef.current!.append(svg);
      }, 500);
      return { ...prev, canvasTimeoutId: temp };
    });
  }, [savedData, dimensions, canvasScale]);

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
