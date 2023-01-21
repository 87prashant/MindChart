// Optimize the resize feature

import { useEffect } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import { NodeDataType } from "./NodeForm";

const StyledWrapper = styled("div")({
  height: "calc(100vh - 70px)",
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
  ref2: any;
  dimensions: {
    w: number;
    h: number;
  };
  current: HTMLDivElement | null;
  accountInfoRef: any;
}

const Main = (props: Props) => {
  const {
    savedData,
    isChartAdded,
    setIsChartAdded,
    handleNodeClick,
    ref2,
    dimensions,
    current,
    accountInfoRef,
  } = props;

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const { w, h } = dimensions;
    const newProps = { w, h, savedData, handleNodeClick, current };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    ref2.current!.innerHTML = "";
    ref2.current!.append(svg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData, dimensions]);

  function handleClick(e: any) {
    if (accountInfoRef.current) {
      accountInfoRef.current.style.display = "none";
    }
    if (current) {
      current!.style.visibility = "hidden";
    }
  }

  return <StyledWrapper onClick={handleClick} ref={ref2}></StyledWrapper>;
};

export default Main;
