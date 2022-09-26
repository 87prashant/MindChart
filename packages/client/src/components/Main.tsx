import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import ForceGraph from "./ForceGraph";

const StyledWrapper = styled("div")({
  border: "5px solid black",
  boxSizing: "border-box",
  height: "calc(100vh - 100px)",
  overflow: 'hidden'
});
const Main = () => {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current as unknown as HTMLElement;
    const w: number = container!.getBoundingClientRect().width;
    const h: number = container!.getBoundingClientRect().height;
    const props = { container, w, h };
    ForceGraph(props);
  }, []);
  return <StyledWrapper ref={ref}></StyledWrapper>;
};

export default Main;
