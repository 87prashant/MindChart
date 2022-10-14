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
  marginBottom: 10,
});

interface Props {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: any;
}

const Emotions = (props: Props) => {
  const { formData, setFormData } = props;
  const [intensityForm, setIntensityForm] = useState<null | JSX.Element>(null);
  const emotions = [
    "neutral",
    "fear",
    "anger",
    "sadness",
    "disgust",
    "surprise",
    "joy",
    "anticipation",
    "trust",
  ];

  const handleChange = (e: any) => {
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

  const inputs = emotions.map((data) => {
    return (
      <>
        <input
          type="checkbox"
          id={data}
          name="emotions"
          checked={
            formData.emotions[data as keyof typeof formData.emotions].value
          }
          onChange={handleChange}
        />
        <label htmlFor={data}>
          {data.slice(0, 1).toUpperCase() + data.slice(1)}
        </label>
      </>
    );
  });

  return (
    <>
      {intensityForm && intensityForm}
      <Wrapper>{inputs}</Wrapper>
    </>
  );
};

export default Emotions;
