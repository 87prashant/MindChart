import styled from "@emotion/styled";
import React from "react";

const Container = styled("div")({
  display: "none",
  position: "absolute",
  top: 50,
  right: 25,
  padding: 5,
  border: "2px solid black",
  borderRadius: 8,
  backgroundColor: "rgba(242, 242, 242, 1)",
  boxShadow: "10px 10px 8px rgba(0, 0, 0, 0.3)",
});

const Info = styled("div")({
  marginBottom: 8,
});

const Button = styled("input")({
  border: "none",
  backgroundColor: "inherit",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all ease 100ms",
  ":hover": {
    color: "red",
  },
});

interface Props {
  userInfo: {
    username: string;
    email: string;
  };
  setIsRegistered: any;
  accountInfoRef: any;
  setSavedData: any;
  setIsChartAdded: any;
}

const AccountInfo = (props: Props) => {
  const {
    userInfo,
    setIsRegistered,
    accountInfoRef,
    setSavedData,
    setIsChartAdded,
  } = props;

  function handleLogout() {
    setIsRegistered(false);
    setSavedData([]);
    setIsChartAdded(false);
  }

  return (
    <Container ref={accountInfoRef} onClick={(e) => e.stopPropagation()}>
      <Info>{userInfo.email}</Info>
      <hr />
      <Button value="Log out" type="button" onClick={handleLogout} />
    </Container>
  );
};

export default AccountInfo;
