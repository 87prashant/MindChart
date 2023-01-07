import { useParams } from "react-router-dom";
import CommonBackground from "./CommonBackground";
import styled from "@emotion/styled";
import { StyledWrapper } from "./Form";
import { SignUpButton } from "./Header";

const Wrapper = styled(StyledWrapper)({
  width: 380,
  height: 150,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "white",
});

const Heading = styled("div")({
  color: "teal",
  fontWeight: "bolder",
  fontSize: 18,
});

const VerifyButton = styled(SignUpButton)({
  marginTop: 25,
  border: "none",
  color: "white",
  transition: "all 200ms ease",
  ":hover": {
    backgroundColor: "rgba(67, 160, 71, 1)",
  },
});

const VerifyEmail = () => {
  const { token } = useParams();
  function handleClick() {

  }
  return (
    <>
      <CommonBackground />
      <Wrapper>
        <Heading>Hi, Verify by clicking the below button</Heading>
        <VerifyButton onClick={handleClick}>Verify and Login</VerifyButton>
      </Wrapper>
    </>
  );
};

export default VerifyEmail;
