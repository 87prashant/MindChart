import React from "react";
import { FormDataType } from "./AddNewThemo";

interface Props {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Types = (props: Props) => {
  const { formData, handleChange } = props;
  return (
    <>
      <select
        name="type"
        value={formData.type}
        onChange={(e) => handleChange(e)}
      >
        <option value="emotion">Emotion</option>
        <option value="thought">Thought</option>
      </select>
    </>
  );
};

export default Types;
