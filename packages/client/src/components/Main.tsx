// Optimize the resize feature

import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import { NodeDataType } from "./NodeForm";
import { Misc } from "./constants";

const StyledWrapper = styled("div")({
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
});

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
  } = props;

  const zoomRef = useRef(1);

  useEffect(() => {
    const canvas = mainRef.current
    function handleWheelChange(e: any) {
      if (e.ctrlKey) {
        e.preventDefault();
        // canvas!.style.
        const canvas = mainRef.current;
        const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1; // adjust as needed
        zoomRef.current += zoomDelta;
        canvas!.style.transformOrigin = "top left"
        canvas.style.transform = `scale(${zoomRef.current})`;
      }
    }

    canvas!.addEventListener(
      "wheel",
      (e: any) => handleWheelChange(e),
      { passive: false }
    );
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

  return <StyledWrapper onClick={handleClick} ref={mainRef}></StyledWrapper>;
};

export default Main;
