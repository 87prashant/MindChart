import styled from "@emotion/styled";
import { Misc } from "./constants";

const Header = styled("div")({
  height: `${Misc.HEADER_HEIGHT}px`,
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  backgroundColor: "#F4EBD0",
  userSelect: "none",
});

const Main = styled("div")({
  height: `calc(100vh - ${Misc.HEADER_HEIGHT}px)`,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
});

const CommonBackground = () => {
  return (
    <>
      <Header />
      <Main />
    </>
  );
};

export default CommonBackground;
