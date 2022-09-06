import React from "react";
import styled from "@emotion/styled";

const StyledWrapper = styled("canvas")({
  border: "10px solid black",
  width: 'calc(100% - 20px)',
  height: 'calc(100vh - 125px)'
})

const Canvas = () => {
  return <StyledWrapper />;
};

export default Canvas;
