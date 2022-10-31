// Optimize the resize feature

import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
// import ForceGraph from "./ForceGraph";
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

function debounce(fn: any, ms: number) {
  let timer: any;
  return (_: any) => {
    clearTimeout(timer);
    timer = setTimeout(function (this: any) {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

interface Props {
  savedData: FormDataType[];
  isChartAdded: boolean;
  setIsChartAdded: any;
  handleHover: any;
}

const Main = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { savedData, isChartAdded, setIsChartAdded, handleHover } = props;
  const [dimensions, setDimensions] = useState({
    w: 0,
    h: 0,
  });

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const { w, h } = dimensions;
    const newProps = { w, h, savedData, handleHover };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    // const svg = ForceGraph(newProps) as unknown as HTMLDivElement;
    ref.current!.innerHTML = "";
    ref.current!.append(svg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData, dimensions]);

  useEffect(() => {
    setIsChartAdded(false);
    setDimensions({
      w: ref.current!.getBoundingClientRect().width,
      h: ref.current!.getBoundingClientRect().height,
    });
    const handleDebounceResize = debounce(function handleResize() {
      setIsChartAdded(false);
      setDimensions({
        w: ref.current!.getBoundingClientRect().width,
        h: ref.current!.getBoundingClientRect().height,
      });
    }, 300);

    window.addEventListener("resize", handleDebounceResize);
    return ref.current!.removeEventListener("resize", handleDebounceResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <StyledWrapper ref={ref}></StyledWrapper>;
};

export default Main;
