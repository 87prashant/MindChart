import React from "react";
import styled from "@emotion/styled";

const StyledHeader = styled("div")({
  height: "70px",
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  background: "#F4EBD0",
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
  "& span": {
    marginLeft: 10,
    fontWeight: "bold",
  },
  ":active": {
    color: "teal",
  }
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

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = (props: Props) => {
  const showForm = () => {
    props.setShowForm(true);
  };
  return (
    <StyledHeader>
      <HelpButton
        href="https://github.com/87prashant/MindChart"
        target="_blank"
      >
        <img src="github_logo.png" alt="" width="25" height="25" />
        <span>Help in Development</span>
      </HelpButton>
      <AddButton onClick={() => showForm()}>Add</AddButton>
    </StyledHeader>
  );
};

export default Header;
