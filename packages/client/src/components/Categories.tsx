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
  marginBottom: 10,
});

interface Props {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Categories = (props: Props) => {
  const { formData, handleChange } = props;
  const categories = [
    "creative",
    "analytical",
    "critical",
    "concrete",
    "abstract",
    "unknown",
  ];

  const inputs = categories.map((data) => {
    return (
      <>
        <input
          type="checkbox"
          id={data}
          name="categories"
          checked={
            formData.categories?.[data as keyof typeof formData.categories]
          }
          onChange={handleChange}
        />
        <label htmlFor={data}>
          {data.slice(0, 1).toUpperCase() + data.slice(1)}
        </label>
      </>
    );
  });
  return <Wrapper>{inputs}</Wrapper>;
};

export default Categories;
