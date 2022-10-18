import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import MiniChart from "./MiniChart";
import { FormDataType } from "./Form";

const StyledWrapper = styled("div")({
  border: "5px solid black",
  height: "calc(100vh - 70px)",
  overflow: "hidden",
});

interface Props {
  savedData: FormDataType[];
  isChartAdded: boolean;
  setIsChartAdded: any;
}

const Main = (props: Props) => {
  const { savedData, isChartAdded, setIsChartAdded } = props;
  const div = (<div></div>) as unknown as HTMLDivElement;
  const ref = useRef<HTMLDivElement>(div);

  useEffect(() => {
    if (isChartAdded) return;
    setIsChartAdded(true);
    const container = ref.current as unknown as HTMLElement;
    const w = container!.getBoundingClientRect().width;
    const h = container!.getBoundingClientRect().height;
    const newProps = { w, h, savedData };
    const svg = MiniChart(newProps) as unknown as HTMLDivElement;
    ref.current!.innerHTML = "";
    ref.current!.append(svg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData]);

  return <StyledWrapper ref={ref}></StyledWrapper>;
};

export default Main;
