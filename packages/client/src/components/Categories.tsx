import styled from "@emotion/styled";
import React from "react";
import { FormDataType } from "./Form";
import { CategoriesList } from "./constants";

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
    CategoriesList.CREATIVE,
    CategoriesList.ANALYTICAL,
    CategoriesList.CRITICAL,
    CategoriesList.CONCRETE,
    CategoriesList.ABSTRACT,
    CategoriesList.UNKNOWN,
  ];

  const inputs = categories.map((data, index) => {
    return (
      <div key={index}>
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
      </div>
    );
  });
  return <Wrapper>{inputs}</Wrapper>;
};

export default Categories;
