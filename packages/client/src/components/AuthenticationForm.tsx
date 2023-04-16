import { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Header,
  Inputs,
  StyledWrapper,
  StyledDiv,
  SubmitButton,
  CancelButton,
  NodeDataType,
} from "./NodeForm";
import { ResponseStatus, UserChoiceList, Misc, Errors } from "./constants";
import LoadingAnimation from "./Animations/LoadingAnimation";
import { ObjectId } from "bson";
import GoogleSvg from "./SvgComponent/GoogleSvg";
import { useGoogleLogin } from '@react-oauth/google';

const Container = styled(StyledDiv)({
  backdropFilter: "blur(10px)",
  position: "absolute",
});

const Wrapper = styled(StyledWrapper)({
  width: 250,
  height: 320,
  backgroundColor: "white",
});

const GoogleAuthentication = styled("button")({
  position: "absolute",
  padding: 8,
  right: -35,
  top: 35,
  width: 40,
  height: 40,
  backgroundColor: "white",
  borderRadius: 5,
  border: "none",
  cursor: "pointer",
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
});

const FormContainer = styled("div")({
  gap: 15,
  display: "flex",
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
  color: "green",
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
  height: 20,
  color: "red",
  fontWeight: "bold",
});

const Button = styled("div")({
  textDecoration: "none",
  border: "none",
  backgroundColor: "inherit",
  color: "teal",
  cursor: "pointer",
  fontSize: 13,
  transition: "all 200ms ease",
  ":hover": {
    textDecoration: "underline",
  },
});

export const HorizontalRule = styled("hr")({
  borderTop: "1px",
  borderColor: "rgba(192, 192, 192)",
});

interface Props {
  setShowAuthenticationForm: any;
  setIsRegistered: any;
  setUserInfo: any;
  setSavedData: any;
  setIsChartAdded: any;
}

const AuthenticationForm = (props: Props) => {
  const {
    setShowAuthenticationForm,
    setIsRegistered,
    setUserInfo,
    setSavedData,
    setIsChartAdded,
  } = props;

  //Store the status from backend
  const [status, setStatus] = useState<string | null>(null);
  //Store the choice of user ( login/register/forget password )
  const [userChoice, setUserChoice] = useState(UserChoiceList.REGISTER);
  //Store if the response from backend has come or not
  const [loading, setLoading] = useState<boolean>(false);

  const registerNameRef = useRef<HTMLInputElement | null>(null);
  const registerEmailRef = useRef<HTMLInputElement | null>(null);
  const registerPassRef = useRef<HTMLInputElement | null>(null);
  const loginEmailRef = useRef<HTMLInputElement | null>(null);
  const loginPassRef = useRef<HTMLInputElement | null>(null);
  const forgetPasswordEmailRef = useRef<HTMLInputElement | null>(null);

  function handleStatus(message: string) {
    setLoading(false);
    setStatus(message);
  }

  function handleFormSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    //Register
    if (userChoice === UserChoiceList.REGISTER) {
      if (!Misc.EMAIL_PATTERN.test(registerEmailRef.current!.value)) {
        handleStatus(Errors.INVALID_EMAIL);
        return;
      }

      const username = registerNameRef.current!.value;
      const email = registerEmailRef.current!.value.toLowerCase();
      const password = registerPassRef.current!.value;

      if (!password || !email || !username) {
        handleStatus(Errors.ALL_FIELDS_COMPULSORY);
        return;
      }
      if (username.length < 5) {
        handleStatus(Errors.SHORT_USERNAME);
        return;
      }
      if (password.length < 8) {
        handleStatus(Errors.SHORT_PASSWORD);
        return;
      }

      fetch(process.env.REACT_APP_REGISTER_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          // always status error
          const { error } = data;
          setStatus(error);
        });
    }
    //Login
    else if (userChoice === UserChoiceList.LOGIN) {
      if (!Misc.EMAIL_PATTERN.test(loginEmailRef.current!.value)) {
        handleStatus(Errors.INVALID_EMAIL);
        return;
      }

      const email = loginEmailRef.current!.value.toLowerCase();
      const password = loginPassRef.current!.value;

      if (!password || !email) {
        handleStatus(Errors.ALL_FIELDS_COMPULSORY);
        return;
      }

      fetch(process.env.REACT_APP_LOGIN_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
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

            // because _id returned here is of string type
            const fixedUserData = userData.map((d: NodeDataType) => {
              return { ...d, _id: new ObjectId(d._id) };
            });

            setShowAuthenticationForm(false);
            setSavedData(fixedUserData);
            setIsChartAdded(false);
            setIsRegistered(true);
            setUserInfo(() => ({ username, email }));
          } else {
            setStatus(data.error);
          }
        });
    }
    //Forget Password
    else {
      if (!Misc.EMAIL_PATTERN.test(forgetPasswordEmailRef.current!.value)) {
        handleStatus(Errors.INVALID_EMAIL);
        return;
      }

      const email = forgetPasswordEmailRef.current!.value.toLowerCase();

      if (!email) {
        handleStatus(Errors.ALL_FIELDS_COMPULSORY);
        return;
      }

      fetch(process.env.REACT_APP_FORGET_PASSWORD_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
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

  function handleUserChoice(choice: string) {
    setUserChoice(choice);
    setStatus(null);
    setLoading(false);
  }

  const login = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  });
  
  return (
    <Container>
      <Wrapper>
        <GoogleAuthentication onClick={() => login()}>
            <GoogleSvg />
        </GoogleAuthentication>
        <FormContainer>
          {userChoice === UserChoiceList.REGISTER && (
            <RegisterForm>
              <StyledHeader>Create an Account</StyledHeader>
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
              <StyledStatus>
                {loading ? <LoadingAnimation size={6} /> : status}
              </StyledStatus>
              <HorizontalRule />
              <Button onClick={() => handleUserChoice(UserChoiceList.LOGIN)}>
                Login instead
              </Button>
            </RegisterForm>
          )}
          {userChoice === UserChoiceList.LOGIN && (
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
              <StyledStatus>
                {userChoice === UserChoiceList.LOGIN && loading ? (
                  <LoadingAnimation size={6} />
                ) : (
                  status
                )}
              </StyledStatus>
              <HorizontalRule />
              <Button onClick={() => handleUserChoice(UserChoiceList.REGISTER)}>
                Register
              </Button>
              <Button
                onClick={() => handleUserChoice(UserChoiceList.FORGET_PASSWORD)}
              >
                Forget Password
              </Button>
            </LoginForm>
          )}
          {userChoice === UserChoiceList.FORGET_PASSWORD && (
            <ForgetPasswordForm>
              <StyledHeader>Forget Password</StyledHeader>
              <StyledInputName>Email</StyledInputName>
              <StyledInput
                ref={forgetPasswordEmailRef}
                type="email"
                placeholder="Email"
                autoComplete="email"
              />
              <StyledStatus>
                {loading ? <LoadingAnimation size={6} /> : status}
              </StyledStatus>
              <HorizontalRule />
              <Button onClick={() => handleUserChoice(UserChoiceList.LOGIN)}>
                Login
              </Button>
            </ForgetPasswordForm>
          )}
        </FormContainer>
        <StyledSubmitButton
          onClick={(e) => handleFormSubmit(e)}
          type="submit"
          value="Submit"
        />
        <StyledCancelButton
          type="button"
          value="Cancel"
          onClick={() => setShowAuthenticationForm(false)}
        />
      </Wrapper>
    </Container>
  );
};

export default AuthenticationForm;
