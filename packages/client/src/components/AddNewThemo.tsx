import styled from "@emotion/styled";
import React from "react";

const StyledWrapper = styled("div")({
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: "rgba(239, 239, 240, 1)",
  border: "2px solid black",
  width: "700px",
  height: "400px",
  margin: "auto",
  padding: 15,
  borderRadius: 8,
  boxShadow: "10px 10px 8px #888888",
});

const Inputs = styled("input")({
  width: "300px",
  padding: "4px 10px",
  borderRadius: 7,
  border: "2px solid black",
});

const NameInput = styled(Inputs)({});

const SubmitButton = styled(Inputs)({
  position: "absolute",
  bottom: 20,
  left: 20,
  cursor: "pointer",
});

const CancelButton = styled(Inputs)({
  position: "absolute",
  bottom: 20,
  right: 20,
  cursor: "pointer",
});

const StyledDiv = styled('div')<{showAddNewThemo: boolean}>(({showAddNewThemo}) => ({
  position: 'fixed',
  display: showAddNewThemo ? 'block' : 'none',
  top: 0,
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.30)'
}))

interface Props {
  setShowAddNewThemo: React.Dispatch<React.SetStateAction<boolean>>
  showAddNewThemo: boolean
}

const AddNewThemo = (props: Props) => {
  const {showAddNewThemo, setShowAddNewThemo} = props
  const handleClick = () => {
    setShowAddNewThemo(false)
  }
  const handleSubmit = () => {
    setShowAddNewThemo(false)
  }

  return (
    <StyledDiv showAddNewThemo={showAddNewThemo}>
      <StyledWrapper>
        <form onSubmit={handleSubmit}>
          <h3>Name</h3>
          <NameInput placeholder="Name" />
          <SubmitButton type="submit" value="Submit" />
          <CancelButton type="button" value="Cancel" onClick={handleClick}/>
        </form>
      </StyledWrapper>
    </StyledDiv>
  );
};
export default AddNewThemo;
