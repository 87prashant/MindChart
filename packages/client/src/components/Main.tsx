// Optimize the resize feature

import { useEffect } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
// import ForceGraph from "./ForceGraph";
import { FormDataType } from "./Form";

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
  savedData: FormDataType[];
  isChartAdded: boolean;
  setIsChartAdded: any;
  handleHover: any;
  ref2: any;
  dimensions: {
    w: number;
    h: number;
  };
  current: HTMLDivElement | null
}

const Main = (props: Props) => {
  const {
    savedData,
    isChartAdded,
    setIsChartAdded,
    handleHover,
    ref2,
    dimensions,
    current
  } = props;

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const { w, h } = dimensions;
    const newProps = { w, h, savedData, handleHover, current };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    // const svg = ForceGraph(newProps) as unknown as HTMLDivElement;
    ref2.current!.innerHTML = "";
    ref2.current!.append(svg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData, dimensions]);

  return <StyledWrapper ref={ref2} ></StyledWrapper>;
};

export default Main;
