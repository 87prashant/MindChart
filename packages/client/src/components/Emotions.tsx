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

const Emotions = (props: Props) => {
  const { formData, handleChange } = props;
  return (
    <Wrapper>
      <input
        type="checkbox"
        id="neutral"
        name="emotions"
        checked={formData.emotions.neutral}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="neutral">Neutral</label>
      <input
        type="checkbox"
        id="fear"
        name="emotions"
        checked={formData.emotions.fear}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="fear">Fear</label>
      <input
        type="checkbox"
        id="anger"
        name="emotions"
        checked={formData.emotions.anger}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="anger">Anger</label>
      <input
        type="checkbox"
        id="sadness"
        name="emotions"
        checked={formData.emotions.sadness}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="sadness">Sadness</label>
      <input
        type="checkbox"
        id="disgust"
        name="emotions"
        checked={formData.emotions.disgust}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="disgust">Disgust</label>
      <input
        type="checkbox"
        id="surprise"
        name="emotions"
        checked={formData.emotions.surprise}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="surprise">Surprise</label>
      <input
        type="checkbox"
        id="joy"
        name="emotions"
        checked={formData.emotions.joy}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="joy">Joy</label>
      <input
        type="checkbox"
        id="anticipation"
        name="emotions"
        checked={formData.emotions.anticipation}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="anticipation">Anticipation</label>
      <input
        type="checkbox"
        id="trust"
        name="emotions"
        checked={formData.emotions.trust}
        onChange={(e) => handleChange(e)}
      />
      <label htmlFor="trust">Trust</label>
    </Wrapper>
  );
};

export default Emotions;
