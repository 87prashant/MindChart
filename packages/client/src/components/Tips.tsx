import styled from "@emotion/styled";
import { useMemo } from "react";
import { TipsArray } from "./constants";

const StyledWrapper = styled("div")({
  position: "absolute",
  bottom: 15,
  marginLeft: 10,
  color: "teal",
  textAlign: "center",
  fontSize: 13,
});

const Tips = ({ showNodeForm }: { showNodeForm: boolean }) => {
  const randomTip = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * TipsArray.length);
    return TipsArray[randomIndex];
  }, [showNodeForm]);

  return (
    <StyledWrapper>
      <span style={{ fontWeight: "bold" }}>Tip:</span> {randomTip}
    </StyledWrapper>
  );
};

export default Tips;
