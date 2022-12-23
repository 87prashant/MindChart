import styled from "@emotion/styled";
import React from "react";

const StyledWrapper = styled("div")({
  position: "absolute",
  bottom: 15,
  marginLeft: 10,
  color: "teal",
  textAlign: "center",
  fontSize: 13,
});

const TipsArray = [
  "Larger size means high priority",
  "Color of entity represent highest its intensity emotion",
  "Similar emotion entities are closer to each other",
];

const Tips = () => {
  function giveRandomTip() {
    const randomIndex = Math.floor(Math.random() * TipsArray.length);
    return TipsArray[randomIndex];
  }

  return (
    <StyledWrapper>
      <span style={{ fontWeight: "bold" }}>Tip:</span> {giveRandomTip()}
    </StyledWrapper>
  );
};

export default Tips;
