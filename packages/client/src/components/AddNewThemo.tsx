import styled from "@emotion/styled";
import React from "react";
import Data from "../Data/Data";

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

const StyledDiv = styled("div")<{ showAddNewThemo: boolean }>(
  ({ showAddNewThemo }) => ({
    position: "fixed",
    display: showAddNewThemo ? "block" : "none",
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.10)",
  })
);

const StyledErrors = styled("div")({
  color: "red",
  fontSize: 11,
});

interface Props {
  setShowAddNewThemo: React.Dispatch<React.SetStateAction<boolean>>;
  showAddNewThemo: boolean;
}

type formDataType = {
  name: string;
};

const AddNewThemo = (props: Props) => {
  const { showAddNewThemo, setShowAddNewThemo } = props;
  const [formData, setFormData] = React.useState({
    name: "",
  });
  const [errors, setErrors] = React.useState({ nameError: "" });

  const refreshFormData = () => {
    setFormData(() => {
      return {
        name: "",
      };
    });
  };
  const refreshErrors = () => {
    setErrors(() => {
      return {
        nameError: "",
      };
    });
  };
  const handleCancel = () => {
    setShowAddNewThemo(false);
    refreshFormData();
    refreshErrors();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(() => {
      return { ...formData, [e.target.name]: e.target.value };
    });
  };
  const validateFormData = (data: formDataType) => {
    let output = true;
    if (!data.name) {
      setErrors(() => {
        return {
          nameError: "* Name can not be empty",
        };
      });
      output = false;
    }
    return output;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFormData(formData)) return;
    Data.push(formData);
    refreshFormData();
    refreshErrors();
    setShowAddNewThemo(false);
  };

  return (
    <StyledDiv showAddNewThemo={showAddNewThemo}>
      <StyledWrapper>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h5>Name</h5>
          <NameInput
            placeholder="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange(e)}
          />
          {errors.nameError && <StyledErrors>{errors.nameError}</StyledErrors>}
          <SubmitButton type="submit" value="Submit" />
          <CancelButton type="button" value="Cancel" onClick={handleCancel} />
        </form>
      </StyledWrapper>
    </StyledDiv>
  );
};

export default AddNewThemo;
