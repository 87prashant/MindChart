import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
// import ForceGraph from "./ForceGraph";
import MiniChart from "./MiniChart";
import { FormDataType } from "./Form";

const StyledWrapper = styled("div")({
  border: "5px solid black",
  height: "calc(100vh - 70px)",
  overflow: "hidden",
});

interface Props {
  savedData: FormDataType[];
}
const Main = (props: Props) => {
  const { savedData } = props;
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current as unknown as HTMLElement;
    const w: number = container!.getBoundingClientRect().width;
    const h: number = container!.getBoundingClientRect().height;
    const newProps = { container, w, h, savedData };
    // ForceGraph(props);
    MiniChart(newProps);
  }, []);
  return <StyledWrapper ref={ref}></StyledWrapper>;
};

export default Main;
