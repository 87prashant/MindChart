import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Header,
  Inputs,
  StyledWrapper,
  StyledDiv,
  SubmitButton,
  CancelButton,
} from "./NodeForm";
import ClipLoader from "react-spinners/ClipLoader";
import { ResponseStatus, UserChoiceList, Misc, Errors } from "./constants";

const Container = styled(StyledDiv)({
  display: "none",
});

const Wrapper = styled(StyledWrapper)({
  width: 250,
  height: 320,
  border: "2px solid black",
  overflow: "hidden",
});

const FormContainer = styled("div")({
  gap: 15,
  display: "flex",
  transition: "all 250ms linear",
});

const Form = styled("form")({
  minWidth: "100%",
});

const RegisterForm = styled(Form)({});

const LoginForm = styled(Form)({});

const ForgetPasswordForm = styled(Form)({
  paddingLeft: 1.5,
});

const StyledHeader = styled(Header)({
  fontSize: 18,
  color: "teal",
  textAlign: "center",
  margin: "0px 0px 20px 0px",
});

export const StyledInputName = styled(Header)({
  fontSize: 12,
  margin: 0,
});

export const StyledInput = styled(Inputs)({
  width: "100%",
  margin: "0px 0px 10px 0px",
});

const StyledSubmitButton = styled(SubmitButton)({
  width: 80,
  bottom: 12,
  left: 15,
});

const StyledCancelButton = styled(CancelButton)({
  width: 80,
  bottom: 12,
  right: 15,
});

const StyledStatus = styled("div")({
  fontSize: 11,
  color: "red",
  fontWeight: "bold",
});

const Button = styled("div")({
  textDecoration: "underline",
  border: "none",
  backgroundColor: "inherit",
  color: "teal",
  cursor: "pointer",
  fontSize: 13,
  transition: "all 200ms ease",
  ":hover": {
    color: "green",
  },
});

interface Props {
  authenticationFormRef: any;
  setIsRegistered: any;
  setUserInfo: any;
  setSavedData: any;
  setIsChartAdded: any;
}

const Authentication = (props: Props) => {
  const {
    authenticationFormRef,
    setIsRegistered,
    setUserInfo,
    setSavedData,
    setIsChartAdded,
  } = props;

  const [status, setStatus] = useState<String | null>(null);
  const [userChoice, setUserChoice] = useState(UserChoiceList.REGISTER);
  const [loading, setLoading] = useState<boolean>(false);

  const registerNameRef = useRef<HTMLInputElement | null>(null);
  const registerEmailRef = useRef<HTMLInputElement | null>(null);
  const registerPassRef = useRef<HTMLInputElement | null>(null);
  const loginEmailRef = useRef<HTMLInputElement | null>(null);
  const loginPassRef = useRef<HTMLInputElement | null>(null);
  const forgetPasswordEmailRef = useRef<HTMLInputElement | null>(null);
  const nodeFormContainerRef = useRef<HTMLDivElement | null>(null);

  function handleInvalidEmail() {
    setLoading(false);
    setStatus(Errors.INVALID_EMAIL);
  }

  function handleFormSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    if (userChoice === UserChoiceList.REGISTER) {
      if (!Misc.EMAIL_PATTERN.test(registerEmailRef.current!.value)) {
        handleInvalidEmail();
        return;
      }

      fetch(process.env.REACT_APP_REGISTER_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerNameRef.current!.value.toLowerCase(),
          email: registerEmailRef.current!.value.toLowerCase(),
          password: registerPassRef.current!.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          // always status error
          const { error } = data;
          setStatus(error);
        });
    } else if (userChoice === UserChoiceList.LOGIN) {
      if (!Misc.EMAIL_PATTERN.test(loginEmailRef.current!.value)) {
        handleInvalidEmail();
        return;
      }

      fetch(process.env.REACT_APP_LOGIN_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmailRef.current!.value.toLowerCase(),
          password: loginPassRef.current!.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          const { status } = data;
          if (status === ResponseStatus.OK) {
            const {
              userCredentials: { username, email },
              userData,
            } = data;
            setSavedData(() => userData);
            setIsChartAdded(false);
            setIsRegistered(true);
            setUserInfo(() => ({ username, email }));
          } else {
            setStatus(data.error);
          }
        });
    } else {
      if (!Misc.EMAIL_PATTERN.test(forgetPasswordEmailRef.current!.value)) {
        handleInvalidEmail();
        return;
      }

      fetch(process.env.REACT_APP_FORGET_PASSWORD_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgetPasswordEmailRef.current!.value.toLowerCase(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // always status error
          const { error } = data;
          setLoading(false);
          setStatus(error);
        });
    }
  }

  function handleCancel() {
    authenticationFormRef.current!.style.display = "none";
  }

  function handleUserChoice(choice: string) {
    setUserChoice(choice);
    setStatus(null);
    nodeFormContainerRef.current!.style.transform =
      choice === UserChoiceList.REGISTER
        ? ""
        : choice === UserChoiceList.LOGIN
        ? "translate(-232px)"
        : "translate(-464px)";
  }

  return (
    <Container ref={authenticationFormRef}>
      <Wrapper>
        <FormContainer ref={nodeFormContainerRef}>
          <RegisterForm>
            <StyledHeader>Create an account</StyledHeader>
            <StyledInputName>Name</StyledInputName>
            <StyledInput
              ref={registerNameRef}
              type={"text"}
              placeholder="Name"
            />
            <StyledInputName>Email</StyledInputName>
            <StyledInput
              ref={registerEmailRef}
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            <StyledInputName>Password</StyledInputName>
            <StyledInput
              ref={registerPassRef}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            {userChoice === UserChoiceList.REGISTER && loading ? (
              <ClipLoader color={"teal"} loading={loading} size={20} />
            ) : (
              <StyledStatus>{status}</StyledStatus>
            )}
            <Button onClick={() => handleUserChoice(UserChoiceList.LOGIN)}>
              Login instead
            </Button>
          </RegisterForm>
          <LoginForm>
            <StyledHeader>Log in</StyledHeader>
            <StyledInputName>Email</StyledInputName>
            <StyledInput
              ref={loginEmailRef}
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            <StyledInputName>Password</StyledInputName>
            <StyledInput
              ref={loginPassRef}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            {userChoice === UserChoiceList.LOGIN && loading ? (
              <ClipLoader color={"teal"} loading={loading} size={20} />
            ) : (
              <StyledStatus>{status}</StyledStatus>
            )}
            <Button onClick={() => handleUserChoice(UserChoiceList.REGISTER)}>
              Register
            </Button>
            <Button
              onClick={() => handleUserChoice(UserChoiceList.FORGET_PASSWORD)}
            >
              Forget Password
            </Button>
          </LoginForm>
          <ForgetPasswordForm>
            <StyledHeader>Forget Password</StyledHeader>
            <StyledInputName>Email</StyledInputName>
            <StyledInput
              ref={forgetPasswordEmailRef}
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            {userChoice === UserChoiceList.FORGET_PASSWORD && loading ? (
              <ClipLoader color={"teal"} loading={loading} size={20} />
            ) : (
              <StyledStatus>{status}</StyledStatus>
            )}
            <Button onClick={() => handleUserChoice(UserChoiceList.LOGIN)}>
              Login
            </Button>
          </ForgetPasswordForm>
        </FormContainer>
        <StyledSubmitButton
          onClick={(e) => handleFormSubmit(e)}
          isNodeDataDuplicate={false}
          type="submit"
          value="Submit"
        />
        <StyledCancelButton
          type="button"
          value="Cancel"
          onClick={handleCancel}
        />
      </Wrapper>
    </Container>
  );
};

export default Authentication;
