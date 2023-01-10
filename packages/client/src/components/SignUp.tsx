import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Header,
  Inputs,
  StyledWrapper,
  StyledDiv,
  SubmitButton,
  CancelButton,
} from "./Form";

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
  signUpFormRef: any;
  setIsRegistered: any;
  setUserInfo: any;
  setSavedData: any;
  setIsChartAdded: any;
}

const userChoiceList = {
  LOGIN: "Login",
  REGISTER: "Register",
  FORGET_PASSWORD: "Forget_Password",
};
Object.freeze(userChoiceList);

const SignUp = (props: Props) => {
  const {
    signUpFormRef,
    setIsRegistered,
    setUserInfo,
    setSavedData,
    setIsChartAdded,
  } = props;

  const [status, setStatus] = useState(null);
  const [userChoice, setUserChoice] = useState(userChoiceList.REGISTER);

  const registerNameRef = useRef<HTMLInputElement | null>(null);
  const registerEmailRef = useRef<HTMLInputElement | null>(null);
  const registerPassRef = useRef<HTMLInputElement | null>(null);
  const loginEmailRef = useRef<HTMLInputElement | null>(null);
  const loginPassRef = useRef<HTMLInputElement | null>(null);
  const forgetPasswordEmailRef = useRef<HTMLInputElement | null>(null);
  const formContainerRef = useRef<HTMLDivElement | null>(null);

  function handleFormSubmit(e: any) {
    e.preventDefault();
    if (userChoice === userChoiceList.REGISTER) {
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
          // always status error
          const { error } = data;
          setStatus(error);
        });
    } else if (userChoice === userChoiceList.LOGIN) {
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
          const { status } = data;
          if (status === "ok") {
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
          setStatus(error);
        });
    }
  }

  function handleCancel() {
    signUpFormRef.current!.style.display = "none";
  }

  function handleUserChoice(choice: string) {
    setUserChoice(choice);
    setStatus(null);
    formContainerRef.current!.style.transform =
      choice === userChoiceList.REGISTER
        ? ""
        : choice === userChoiceList.LOGIN
        ? "translate(-232px)"
        : "translate(-464px)";
  }

  return (
    <Container showForm={false} ref={signUpFormRef}>
      <Wrapper>
        <FormContainer ref={formContainerRef}>
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
            <StyledStatus>{status}</StyledStatus>
            <Button onClick={() => handleUserChoice(userChoiceList.LOGIN)}>
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
            <StyledStatus>{status}</StyledStatus>
            <Button onClick={() => handleUserChoice(userChoiceList.REGISTER)}>
              Register
            </Button>
            <Button
              onClick={() => handleUserChoice(userChoiceList.FORGET_PASSWORD)}
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
            <StyledStatus>{status}</StyledStatus>
            <Button onClick={() => handleUserChoice(userChoiceList.LOGIN)}>
              Login
            </Button>
          </ForgetPasswordForm>
        </FormContainer>
        <StyledSubmitButton
          onClick={(e) => handleFormSubmit(e)}
          isFormDataDuplicate={false}
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

export default SignUp;
