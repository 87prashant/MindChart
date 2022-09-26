import React, { useEffect, useMemo, useRef } from "react";
import styled from "@emotion/styled";
import ForceGraph from "./ForceGraph";
import { BaseType } from "d3";

const StyledWrapper = styled("div")({
  border: "5px solid black",
  width: "calc(100% - 20px)",
  height: "calc(100vh - 125px)",
});
const Main = () => {
  const ForceGraphComponent: JSX.Element = useMemo(() => {
     return <ForceGraph />
  }, []);
  return (
  <StyledWrapper>
    {ForceGraphComponent}
  </StyledWrapper>
  )
};

export default Main;
