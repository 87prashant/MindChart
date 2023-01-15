import styled from "@emotion/styled";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import CommonBackground from "./CommonBackground";
import { StyledWrapper } from "./Form";
import { SignUpButton } from "./Header";
import { StyledInput, StyledInputName } from "./SignUp";
import { ResponseStatus, Errors } from "./constants";

const Wrapper = styled(StyledWrapper)({
  width: 380,
  height: 300,
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
  marginBottom: 20,
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

const StyledStatus = styled("div")({
  color: "red",
  textAlign: "center",
  fontSize: 14,
});

const InputName = styled(StyledInputName)({
  marginBottom: 5,
  fontSize: 15,
});

const Input = styled(StyledInput)({
  width: 200,
  padding: 4,
});

const ForgetPassword = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passOneRef = useRef<HTMLInputElement | null>(null);
  const passTwoRef = useRef<HTMLInputElement | null>(null);

  const { email, verificationToken } = useParams();
  const navigate = useNavigate();

  function handleClick() {
    setLoading(true);
    setStatus(null);
    const passwordOne = passOneRef.current!.value;
    const passwordTwo = passTwoRef.current!.value;
    if (passwordOne !== passwordTwo) {
      setLoading(false);
      setStatus(Errors.UNMATCHED_PASSWORD);
      return;
    }

    fetch(process.env.REACT_APP_FORGET_PASSWORD_VERIFY_API!, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, verificationToken, password: passwordOne }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        const { status } = data;
        if (status === ResponseStatus.ERROR) {
          setStatus(data.error);
          return;
        }
        navigate("/", {
          state: { isRegistered: true, username: data.username, email },
        });
      });
  }

  return (
    <>
      <CommonBackground />
      <Wrapper>
        <Heading>Create new Password</Heading>
        <InputName>Enter Password</InputName>
        <Input
          ref={passOneRef}
          type="password"
          placeholder="Enter Password"
          autoComplete="current-password"
        />
        <InputName>Enter Password again</InputName>
        <Input
          ref={passTwoRef}
          type="password"
          placeholder="Enter Password again"
          autoComplete="current-password"
        />
        {loading ? (
          <ClipLoader color={"teal"} loading={loading} size={20} />
        ) : (
          <StyledStatus>{status}</StyledStatus>
        )}
        <VerifyButton onClick={handleClick}>Change</VerifyButton>
      </Wrapper>
    </>
  );
};

export default ForgetPassword;
