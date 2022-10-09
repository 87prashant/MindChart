//TODO: what to do when component unmount?

import styled from "@emotion/styled";
import React, { useState } from "react";
import { FormDataType } from "./Form";

const Container = styled("div")({
  position: "fixed",
  left: 0,
  bottom: 0,
  height: "100vh",
  width: "100vw",
  zIndex: 2,
  backgroundColor: "rgba(0, 0, 0, 0.20)",
});

const FormWrapper = styled("div")({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  height: 170,
  width: 200,
  margin: "auto",
  position: "fixed",
  border: "2px solid black",
  padding: 15,
  borderRadius: 8,
  backgroundColor: "rgba(225, 225, 225, 1)",
  boxShadow: "10px 10px 8px #888888",
});

const StyledDiv = styled("div")({
  backgroundColor: "rgba(242, 242, 242, 1)",
  borderRadius: 8,
  padding: "5px 10px",
});

const Header = styled("div")({
  fontSize: 20,
  fontWeight: "bold",
  textAlign: "center",
});

const SelectedEmotion = styled("p")({
  fontSize: 15,
  textAlign: "center",
  fontWeight: "bolder",
  color: "teal",
});

const SubmitWrapper = styled("div")({
  display: "flex",
  marginTop: 5,
});

const DoneButton = styled("button")({
  padding: 4,
  border: "2px solid black",
  borderRadius: 8,
  cursor: "pointer",
  marginLeft: "auto",
});

const CancelButton = styled("button")({
  padding: 4,
  border: "2px solid black",
  borderRadius: 8,
  cursor: "pointer",
});

const StyledSlider = styled("input")({
  cursor: "pointer",
  width: "100%",
});

interface Props {
  event: any;
  setIntensityForm: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
  formData: FormDataType;
  setFormData: any;
}

const IntensityForm = (props: Props) => {
  const { event, setIntensityForm, formData, setFormData } = props;
  const { id }: { id: string } = event.target;
  const selectedEmotion =
    formData.emotions[id as keyof typeof formData.emotions];
  // to force update this component
  const [intensity, setIntensity] = useState(selectedEmotion.intensity);
  const handleChange = (e: any) => {
    setFormData((formData: FormDataType) => ({
      ...formData,
      emotions: {
        ...formData.emotions,
        [id]: {
          ...selectedEmotion,
          intensity: e.target.value,
        },
      },
    }));
    setIntensity(e.target.value);
  };
  const handleCancel = () => {
    setFormData((formData: FormDataType) => ({
      ...formData,
      emotions: {
        ...formData.emotions,
        [id]: {
          value: false,
          intensity: 30,
        },
      },
    }));
    setIntensityForm(null);
  };
  const handleDone = () => {
    setFormData((formData: FormDataType) => ({
      ...formData,
      emotions: {
        ...formData.emotions,
        [id]: {
          value: true,
          intensity: intensity,
        },
      },
    }));
    setIntensityForm(null);
  };

  return (
    <Container>
      <FormWrapper>
        <StyledDiv>
          <Header>Select Intensity</Header>
          <SelectedEmotion>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </SelectedEmotion>
          <StyledSlider
            type="range"
            min="10"
            max="100"
            value={intensity}
            onChange={handleChange}
          />
        </StyledDiv>
        <SubmitWrapper>
          <CancelButton onClick={handleCancel}>
            {selectedEmotion.value ? "Remove" : "Cancel"}
          </CancelButton>
          <DoneButton onClick={handleDone}>Done</DoneButton>
        </SubmitWrapper>
      </FormWrapper>
    </Container>
  );
};

export default IntensityForm;
