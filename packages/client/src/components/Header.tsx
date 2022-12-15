import React, { useRef } from "react";
import styled from "@emotion/styled";
import { FormDataType } from "./Form";
import SignUp from "./SignUp";
import Account from "./Account";
import AccountInfo from "./AccountInfo";

const StyledHeader = styled("div")({
  height: "70px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  background: "#F4EBD0",
  userSelect: "none",
});

const HelpButton = styled("a")({
  display: "flex",
  border: "2px solid black",
  borderRadius: 10,
  padding: 5,
  marginRight: "auto",
  marginLeft: "20px",
  textDecoration: "none",
  backgroundColor: "white",
  color: "teal",
  ":active": {
    color: "teal",
  },
});

const AddButton = styled("button")({
  margin: "0 20px",
  padding: "10px",
  textDecoration: "none",
  cursor: "pointer",
  border: "solid black",
  borderRadius: "10px",
  backgroundColor: "white",
  fontWeight: "bolder",
});

const DemoButton = styled("button")<{ isDemoActive: boolean }>(
  ({ isDemoActive }) => ({
    border: "none",
    padding: "10px",
    margin: "0 20px",
    textDecoration: "none",
    color: isDemoActive ? "rgba(0, 0, 0)" : "rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bolder",
  })
);

const SignUpButton = styled("button")({
  margin: "0 20px",
  padding: "10px",
  textDecoration: "none",
  cursor: "pointer",
  border: "solid black",
  borderRadius: "10px",
  backgroundColor: "white",
  fontWeight: "bolder",
});

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isDemoActive: boolean;
  setIsDemoActive: any;
  setSavedData: any;
  setIsChartAdded: any;
  demoData: FormDataType[];
  setIsRegistered: any;
  isRegistered: boolean;
  accountInfoRef: any;
  current: HTMLDivElement | null;
  userInfo: { username: string; email: string };
  setUserInfo: any;
}

const Header = (props: Props) => {
  const {
    setShowForm,
    isDemoActive,
    setIsDemoActive,
    setSavedData,
    demoData,
    setIsChartAdded,
    setIsRegistered,
    isRegistered,
    accountInfoRef,
    current,
    userInfo,
    setUserInfo,
  } = props;

  const showForm = () => {
    setShowForm(true);
  };

  const signUpFormRef = useRef<HTMLDivElement | null>(null);

  function handleClick() {
    setIsDemoActive((isDemoActive: boolean) => (isDemoActive ? false : true));
    const storedData: FormDataType[] = window.localStorage.getItem("savedData")
      ? JSON.parse(window.localStorage.getItem("savedData")!)
      : [];
    //"!isDemoActive" because I am updating isDemoActive at the same time above
    setSavedData((prev: FormDataType[]) =>
      !isDemoActive ? demoData : storedData
    );
    setIsChartAdded((prev: boolean) => false);
  }
  function openLoginPage() {
    signUpFormRef.current!.style.display = "block";
  }
  function handleHeaderClick() {
    if (accountInfoRef.current) {
      accountInfoRef.current!.style.display = "none";
    }
    if (current) {
      current!.style.visibility = "hidden";
    }
  }

  return (
    <StyledHeader onClick={handleHeaderClick}>
      <HelpButton
        href="https://github.com/87prashant/MindChart"
        target="_blank"
      >
        <img src="github_logo.png" alt="" width="25" height="25" />
      </HelpButton>
      <DemoButton isDemoActive={isDemoActive} onClick={handleClick}>
        Demo
      </DemoButton>
      <AddButton onClick={() => showForm()}>Add</AddButton>
      {!isRegistered && (
        <SignUpButton onClick={openLoginPage}>Register</SignUpButton>
      )}
      {!isRegistered && (
        <SignUp
          signUpFormRef={signUpFormRef}
          setIsRegistered={setIsRegistered}
          setUserInfo={setUserInfo}
        />
      )}
      {isRegistered && (
        <div style={{ position: "relative" }}>
          <Account accountInfoRef={accountInfoRef} userInfo={userInfo} />
          <AccountInfo
            accountInfoRef={accountInfoRef}
            setIsRegistered={setIsRegistered}
            userInfo={userInfo}
          />
        </div>
      )}
    </StyledHeader>
  );
};

export default Header;
