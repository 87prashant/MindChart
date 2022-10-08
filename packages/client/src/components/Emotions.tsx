//TODO: make it data driven instead of hard coding

import styled from "@emotion/styled";
import React, { useState } from "react";
import { FormDataType } from "./Form";
import IntensityForm from "./IntensityForm";

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
  setFormData: any;
}

const Emotions = (props: Props) => {
  const { formData, setFormData } = props;
  const [intensityForm, setIntensityForm] = useState<null | JSX.Element>(null);

  const newHandleChange = (e: any) => {
    setIntensityForm(() => {
      return (
        <IntensityForm
          event={e}
          formData={formData}
          setFormData={setFormData}
          setIntensityForm={setIntensityForm}
        />
      );
    });
  };

  return (
    <>
      {intensityForm && intensityForm}
      <Wrapper>
        <input
          type="checkbox"
          id="neutral"
          name="emotions"
          checked={formData.emotions.neutral.value}
          onChange={newHandleChange}
        />
        <label htmlFor="neutral">Neutral</label>
        <input
          type="checkbox"
          id="fear"
          name="emotions"
          checked={formData.emotions.fear.value}
          onChange={newHandleChange}
        />
        <label htmlFor="fear">Fear</label>
        <input
          type="checkbox"
          id="anger"
          name="emotions"
          checked={formData.emotions.anger.value}
          onChange={newHandleChange}
        />
        <label htmlFor="anger">Anger</label>
        <input
          type="checkbox"
          id="sadness"
          name="emotions"
          checked={formData.emotions.sadness.value}
          onChange={newHandleChange}
        />
        <label htmlFor="sadness">Sadness</label>
        <input
          type="checkbox"
          id="disgust"
          name="emotions"
          checked={formData.emotions.disgust.value}
          onChange={newHandleChange}
        />
        <label htmlFor="disgust">Disgust</label>
        <input
          type="checkbox"
          id="surprise"
          name="emotions"
          checked={formData.emotions.surprise.value}
          onChange={newHandleChange}
        />
        <label htmlFor="surprise">Surprise</label>
        <input
          type="checkbox"
          id="joy"
          name="emotions"
          checked={formData.emotions.joy.value}
          onChange={newHandleChange}
        />
        <label htmlFor="joy">Joy</label>
        <input
          type="checkbox"
          id="anticipation"
          name="emotions"
          checked={formData.emotions.anticipation.value}
          onChange={newHandleChange}
        />
        <label htmlFor="anticipation">Anticipation</label>
        <input
          type="checkbox"
          id="trust"
          name="emotions"
          checked={formData.emotions.trust.value}
          onChange={newHandleChange}
        />
        <label htmlFor="trust">Trust</label>
      </Wrapper>
    </>
  );
};

export default Emotions;