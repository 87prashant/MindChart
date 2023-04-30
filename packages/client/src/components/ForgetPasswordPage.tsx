import styled from "@emotion/styled";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonBackground from "./CommonBackground";
import { StyledWrapper } from "./NodeForm";
import { AuthenticationButton } from "./Header";
import { StyledInput, StyledInputName } from "./AuthenticationForm";
import { ResponseStatus, Errors, Apis, Misc } from "./constants";
import LoadingAnimation from "./Animations/LoadingAnimation";

const Wrapper = styled(StyledWrapper)({
  width: 280,
  height: 270,
  backgroundColor: "white",
});

const Heading = styled("div")({
  color: "green",
  fontWeight: "bolder",
  fontSize: 18,
  marginBottom: 20,
  textAlign: "center",
});

const ChangeButton = styled(AuthenticationButton)({
  margin: 0,
  marginTop: 5,
  width: "100%",
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
  fontSize: 12,
  opacity: "0.7",
  height: 20,
});

const InputName = styled(StyledInputName)({
  marginBottom: 5,
  fontSize: 13,
});

const Input = styled(StyledInput)({
  padding: 5,
});

const ForgetPasswordPage = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passOneRef = useRef<HTMLInputElement | null>(null);
  const passTwoRef = useRef<HTMLInputElement | null>(null);
  // Server timeout id
  const serverTimeoutId = useRef<number | undefined>(undefined);

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
    if (passwordOne.length < 8) {
      setLoading(false);
      setStatus(Errors.SHORT_PASSWORD);
      return;
    }
    serverTimeoutId.current = setTimeout(() => {
      setLoading(false);
      handleStatus(Errors.SERVER_ERROR);
    }, Misc.AUTH_API_TIMEOUT) as unknown as number;
    fetch(
      `${process.env.REACT_APP_BASE_URL!}${Apis.FORGET_PASSWORD_VERIFY_API}`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          verificationToken,
          password: passwordOne,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        const { status } = data;
        if (status === ResponseStatus.ERROR) {
          handleStatus(data.error);
          clearTimeout(serverTimeoutId.current);
        } else {
          clearTimeout(serverTimeoutId.current);
          navigate("/", {
            state: {
              isLoggedIn: true,
              userInfo: {
                username: data.username,
                email,
                imageUrl: data.imageUrl,
              },
              userData: data.userData,
            },
          });
        }
      });
  }

  function handleStatus(message: string) {
    setLoading(false);
    setStatus(message);
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
        <StyledStatus>
          {loading ? <LoadingAnimation size={6} /> : status}
        </StyledStatus>
        <ChangeButton onClick={handleClick}>Change</ChangeButton>
      </Wrapper>
    </>
  );
};

export default ForgetPasswordPage;
