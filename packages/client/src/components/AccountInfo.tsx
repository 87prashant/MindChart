import React from "react";
import styled from "@emotion/styled";

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
  // whiteSpace: "nowrap"
  marginBottom: 8,
});

const Button = styled("input")({
  border: "none",
  backgroundColor: "inherit",
  cursor: "pointer",
  color: "red",
  fontWeight: "bold",
});

interface Props {
  userInfo: {
    username: string;
    email: string;
  };
  setIsRegistered: any;
  accountInfoRef: any;
}

const AccountInfo = (props: Props) => {
  const { userInfo, setIsRegistered, accountInfoRef } = props;

  function handleMouseOut() {
    accountInfoRef.current!.style.display = "none";
  }

  return (
    <Container ref={accountInfoRef} onMouseLeave={handleMouseOut}>
      <Info>{userInfo.email}</Info>
      <hr />
      <Button
        value="Log out"
        type="button"
        onClick={() => setIsRegistered(false)}
      />
    </Container>
  );
};

export default AccountInfo;
