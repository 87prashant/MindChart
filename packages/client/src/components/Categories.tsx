import styled from "@emotion/styled";
import React from "react";
import { FormDataType } from "./Form";

const Wrapper = styled("div")({
  "& input": {
    cursor: "pointer",
  },
  "& label": {
    marginRight: 6,
    cursor: "pointer",
  },
});

interface Props {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Categories = (props: Props) => {
  const { formData, handleChange } = props;
  return (
    <Wrapper>
      <input
        type="checkbox"
        id="creative"
        name="categories"
        checked={formData.categories.creative}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="creative">Creative</label>
      <input
        type="checkbox"
        id="analytical"
        name="categories"
        checked={formData.categories.analytical}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="analytical">Analytical</label>
      <input
        type="checkbox"
        id="critical"
        name="categories"
        checked={formData.categories.critical}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="critical">Critical</label>
      <input
        type="checkbox"
        id="concrete"
        name="categories"
        checked={formData.categories.concrete}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="concrete">Concrete</label>
      <input
        type="checkbox"
        id="abstract"
        name="categories"
        checked={formData.categories.abstract}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="abstract">Abstract</label>
    </Wrapper>
  );
};

export default Categories
