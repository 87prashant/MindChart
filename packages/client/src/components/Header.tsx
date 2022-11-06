import React from "react";
import styled from "@emotion/styled";
import { FormDataType } from "./Form";

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
    border: isDemoActive
      ? "2px solid rgba(0, 0, 0)"
      : "2px solid rgba(0, 0, 0, 0.3)",
    padding: "10px",
    margin: "0 20px",
    textDecoration: "none",
    color: isDemoActive ? "rgba(0, 0, 0)" : "rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bolder",
  })
);

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isDemoActive: boolean;
  setIsDemoActive: any;
  setSavedData: any;
  setIsChartAdded: any;
  demoData: FormDataType[];
}

const Header = (props: Props) => {
  const {
    setShowForm,
    isDemoActive,
    setIsDemoActive,
    setSavedData,
    demoData,
    setIsChartAdded,
  } = props;
  const showForm = () => {
    setShowForm(true);
  };

  function handleClick() {
    setIsDemoActive((isDemoActive: boolean) => (isDemoActive ? false : true));
    //"!isDemoActive" because I am updating isDemoActive at the same above
    setSavedData((prev: FormDataType[]) => (!isDemoActive ? demoData : []));
    setIsChartAdded((prev: boolean) => false);
  }

  return (
    <StyledHeader>
      <HelpButton
        href="https://github.com/87prashant/MindChart"
        target="_blank"
      >
        <img src="github_logo.png" alt="" width="25" height="25" />
        <span>Help in Development</span>
      </HelpButton>
      <DemoButton isDemoActive={isDemoActive} onClick={handleClick}>
        Demo
      </DemoButton>
      <AddButton onClick={() => showForm()}>Add</AddButton>
    </StyledHeader>
  );
};

export default Header;
