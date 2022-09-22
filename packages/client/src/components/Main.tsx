import React from "react";
import styled from "@emotion/styled";

const StyledWrapper = styled('div')({
  border: "10px solid black",
  width: "calc(100% - 20px)",
  height: "calc(100vh - 125px)",
});

const Main = () => {
  
  return (
    <div>
      <StyledWrapper />
    </div>
  );
};

export default Main;
