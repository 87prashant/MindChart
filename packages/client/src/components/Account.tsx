import React from "react";
import styled from "@emotion/styled";

const Container = styled("div")({
  width: 50,
  height: 50,
  borderRadius: "50%",
  backgroundColor: "teal",
  display: "flex",
  WebkitAlignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  margin: "0 20px",
  cursor: "pointer",
});

interface Props {
  userInfo: { username: string; email: string };
  accountInfoRef: any;
}

const Account = (props: Props) => {
  const {
    userInfo: { username },
    accountInfoRef,
  } = props;

  function handleClick() {
    accountInfoRef.current!.style.display = "block";
  }

  let i: any = 0;
  let surnameFirstLetter: string = "";
  for (i in username as any) {
    if (username[i] === " ") surnameFirstLetter = username[++i];
  }
  const content = (username.slice(0, 1) + surnameFirstLetter).toUpperCase();

  return <Container onClick={handleClick}>{content}</Container>;
};

export default Account;
