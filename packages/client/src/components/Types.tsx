import React from "react";
import { FormDataType } from "./AddNewThemo";
import styled from "@emotion/styled";

const StyledSelect = styled("select")({
  padding: "4px 10px",
  borderRadius: 7,
  border: "2px solid black",
  cursor: 'pointer',
});
interface Props {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Types = (props: Props) => {
  const { formData, handleChange } = props;
  return (
    <>
      <StyledSelect
        name="type"
        value={formData.type}
        onChange={(e) => handleChange(e)}
      >
        <option value="emotion">Emotion</option>
        <option value="thought">Thought</option>
      </StyledSelect>
    </>
  );
};

export default Types;
