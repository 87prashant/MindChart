//TODO: make it data driven instead of hard coding

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
        onChange={handleChange}
      />
      <label htmlFor="creative">Creative</label>
      <input
        type="checkbox"
        id="analytical"
        name="categories"
        checked={formData.categories.analytical}
        onChange={handleChange}
      />
      <label htmlFor="analytical">Analytical</label>
      <input
        type="checkbox"
        id="critical"
        name="categories"
        checked={formData.categories.critical}
        onChange={handleChange}
      />
      <label htmlFor="critical">Critical</label>
      <input
        type="checkbox"
        id="concrete"
        name="categories"
        checked={formData.categories.concrete}
        onChange={handleChange}
      />
      <label htmlFor="concrete">Concrete</label>
      <input
        type="checkbox"
        id="abstract"
        name="categories"
        checked={formData.categories.abstract}
        onChange={handleChange}
      />
      <label htmlFor="abstract">Abstract</label>
      <input
        type="checkbox"
        id="unknown"
        name="categories"
        checked={formData.categories.unknown}
        onChange={handleChange}
      />
      <label htmlFor="unknown">Unknown</label>
    </Wrapper>
  );
};

export default Categories;
