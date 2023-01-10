import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const Result = styled("div")({
  color: "red",
  textAlign: "center",
  fontSize: 14,
});

const VerifyEmail = () => {
  const [result, setResult] = useState("");
  const { email, verificationToken } = useParams();
  const navigate = useNavigate();

  function handleClick() {
    fetch(process.env.REACT_APP_VERIFICATION_API!, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        verificationToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { status } = data;
        if (status === "error") {
          setResult(data.error);
          return;
        }
        navigate("/", { state: { isRegistered: true, username: data.username, email } });
      });
  }
  return (
    <>
      <CommonBackground />
      <Wrapper>
        <Heading>Hi, Verify by clicking the below button</Heading>
        <VerifyButton onClick={handleClick}>Verify and Login</VerifyButton>
        <Result>{result}</Result>
      </Wrapper>
    </>
  );
};

export default VerifyEmail;
