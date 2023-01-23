// Optimize the resize feature

import { useEffect } from "react";
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
  accountInfoRef: any;
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
    accountInfoRef,
  } = props;

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const { w, h } = dimensions;
    const newProps = { w, h, savedData, handleNodeClick, setShowNodeClickModal };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    mainRef.current!.innerHTML = "";
    mainRef.current!.append(svg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData, dimensions]);

  function handleClick(e: any) {
    if (accountInfoRef.current) {
      accountInfoRef.current.style.display = "none";
    }
    setShowNodeClickModal(false)
  }

  return <StyledWrapper onClick={handleClick} ref={mainRef}></StyledWrapper>;
};

export default Main;
