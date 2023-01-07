import styled from "@emotion/styled";

const Header = styled("div")({
  height: "70px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  backgroundColor: "#F4EBD0",
  userSelect: "none",
});

const Footer = styled("div")({
  height: "calc(100vh - 70px)",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
});

const CommonBackground = () => {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
};

export default CommonBackground;
