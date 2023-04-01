// Optimize the resize feature

import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import { NodeDataType } from "./NodeForm";
import { Misc } from "./constants";
import { debounce } from "./App/App";

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

  const [scaleTimeoutId, setScaleTimeoutId] = useState<
    NodeJS.Timeout | undefined
  >();

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
        })

        setIsChartAdded(false);
        setShowNodeClickModal(false);
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
    clearTimeout(scaleTimeoutId)
    setScaleTimeoutId(() =>
      setTimeout(() => {
        mainRef.current!.innerHTML = "";
        mainRef.current!.append(svg);
      }, 200)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
