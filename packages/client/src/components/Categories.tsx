import styled from "@emotion/styled";
import React from "react";
import { FormDataType } from "./AddNewThemo";

const Wrapper = styled("div")({
  display: "flex",
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
        id="fear"
        name="fear"
        checked={formData.categories.fear}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="fear">Fear</label>
      <input
        type="checkbox"
        id="anger"
        name="anger"
        checked={formData.categories.anger}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="anger">Anger</label>
      <input
        type="checkbox"
        id="sadness"
        name="sadness"
        checked={formData.categories.sadness}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="sadness">Sadness</label>
      <input
        type="checkbox"
        id="disgust"
        name="disgust"
        checked={formData.categories.disgust}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="disgust">Disgust</label>
      <input
        type="checkbox"
        id="surprise"
        name="surprise"
        checked={formData.categories.surprise}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="surprise">Surprise</label>
      <input
        type="checkbox"
        id="joy"
        name="joy"
        checked={formData.categories.joy}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="joy">Joy</label>
      <input
        type="checkbox"
        id="anticipation"
        name="anticipation"
        checked={formData.categories.anticipation}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="anticipation">Anticipation</label>
      <input
        type="checkbox"
        id="trust"
        name="trust"
        checked={formData.categories.trust}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="trust">Trust</label>
    </Wrapper>
  );
};

export default Categories;
