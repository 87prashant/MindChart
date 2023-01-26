import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommonBackground from "./CommonBackground";
import styled from "@emotion/styled";
import { StyledWrapper } from "./NodeForm";
import { AuthenticationButton } from "./Header";
import { ClipLoader } from "react-spinners";
import React from "react";

const Wrapper = styled(StyledWrapper)({
  width: 380,
  height: 150,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "white",
  padding: 0,
});

const Heading = styled("div")({
  color: "teal",
  fontWeight: "bolder",
  fontSize: 18,
  marginBottom: 20,
});

const VerifyButton = styled(AuthenticationButton)({
  marginBottom: 5,
  border: "none",
  color: "white",
  position: "relative",
  top: 15,
  transition: "all 200ms ease",
  ":hover": {
    backgroundColor: "rgba(67, 160, 71, 1)",
  },
});

const StyledStatus = styled("div")({
  color: "red",
  opacity: "0.8",
  textAlign: "center",
  fontSize: 12,
  height: 20,
  position: "relative",
  top: 15,
});

const VerifyEmailPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { email, verificationToken } = useParams();
  const navigate = useNavigate();

  function handleClick() {
    setLoading(true);
    setStatus(null);
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
        setLoading(false);
        const { status } = data;
        if (status === "error") {
          setStatus(data.error);
          return;
        }
        navigate("/", {
          state: { isLoggedIn: true, username: data.username, email },
        });
      });
  }
  return (
    <>
      <CommonBackground />
      <Wrapper>
        <Heading>Hi, Verify by clicking the below button</Heading>
        <VerifyButton onClick={handleClick}>Verify and Login</VerifyButton>
        {loading ? (
          <StyledStatus>
            <ClipLoader color={"teal"} loading={loading} size={20} />
          </StyledStatus>
        ) : (
          <StyledStatus>{status}</StyledStatus>
        )}
      </Wrapper>
    </>
  );
};

export default VerifyEmailPage;
