// Optimize the resize feature

import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import ForceGraph from "./ForceGraph";
import { FormDataType } from "./Form";

const StyledWrapper = styled("div")({
  height: "calc(100vh - 70px)",
  overflow: "hidden",
  backgroundColor: "#D0D0D0",
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
}

const Main = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { savedData, isChartAdded, setIsChartAdded } = props;
  const [dimensions, setDimensions] = useState({
    w: 0,
    h: 0,
  });

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const { w, h } = dimensions;
    const newProps = { w, h, savedData };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    // const svg = ForceGraph(newProps) as unknown as HTMLDivElement;
    ref.current!.innerHTML = "";
    ref.current!.append(svg);
  }, [savedData, dimensions]);

  useEffect(() => {
    setIsChartAdded(false);
    setDimensions({
      w: ref.current!.getBoundingClientRect().width,
      h: ref.current!.getBoundingClientRect().height,
    });
    function handleResize() {
      setIsChartAdded(false);
      setDimensions({
        w: ref.current!.getBoundingClientRect().width,
        h: ref.current!.getBoundingClientRect().height,
      });
    }
    window.addEventListener("resize", handleResize);
    return ref.current!.removeEventListener("resize", handleResize);
  }, []);

  return <StyledWrapper ref={ref}></StyledWrapper>;
};

export default Main;
