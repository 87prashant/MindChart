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

const AddButton = styled("button")({
  margin: "0 20px",
  padding: "10px",
  textDecoration: "none",
  cursor: "pointer",
  border: "solid black",
  borderRadius: "10px",
});

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = (props: Props) => {
  const Form = () => {
    props.setShowForm(true);
  };
  return (
    <StyledHeader>
      <AddButton onClick={() => Form()}>Add</AddButton>
    </StyledHeader>
  );
};

export default Header;
