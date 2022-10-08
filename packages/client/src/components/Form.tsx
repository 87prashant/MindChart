// TODO: Optimize the 'categories by storing only the required ones
// TODO: fix handlechange types

import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import Emotions from "./Emotions";
import Categories from "./Categories";

const StyledWrapper = styled("div")({
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: "rgba(225, 225, 225, 1)",
  border: "2px solid black",
  width: "700px",
  height: "450px",
  margin: "auto",
  padding: 15,
  borderRadius: 8,
  boxShadow: "10px 10px 8px #888888",
});

const Inputs = styled("input")({
  width: "300px",
  padding: "4px 10px",
  borderRadius: 7,
  border: "2px solid black",
});

const DescriptionInput = styled("textarea")({
  width: "calc(100% - 6px)",
  height: "180px",
  resize: "none",
  padding: "4px 10px",
  borderRadius: 7,
  border: "2px solid black",
});

const SubmitButton = styled(Inputs)({
  position: "absolute",
  bottom: 20,
  left: 20,
  cursor: "pointer",
});

const CancelButton = styled(Inputs)({
  position: "absolute",
  bottom: 20,
  right: 20,
  cursor: "pointer",
});

const StyledDiv = styled("div")<{ showForm: boolean }>(({ showForm }) => ({
  position: "fixed",
  display: showForm ? "block" : "none",
  top: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.20)",
}));

const StyledErrors = styled("div")({
  color: "red",
  fontSize: 12,
});

const StyledContainer = styled("div")({
  height: 350,
  padding: "10px 20px",
  backgroundColor: "rgba(242, 242, 242, 1)",
  borderRadius: 8,
  overflowY: "scroll",
  "::-webkit-scrollbar": {
    width: 12,
  },
  "::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 5px grey",
    borderRadius: 8,
  },
  "::-webkit-scrollbar-thumb": {
    background: "rgba(165, 165, 165, 1)",
    borderRadius: 10,
  },
});

const StyledSlider = styled("input")({
  cursor: "pointer",
});

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  showForm: boolean;
  savedData: FormDataType[];
  setSavedData: any;
}

export interface EmotionProperty {
  value: boolean;
  intensity: number;
}

export interface Emotion {
  neutral: EmotionProperty;
  fear: EmotionProperty;
  joy: EmotionProperty;
  anticipation: EmotionProperty;
  trust: EmotionProperty;
  disgust: EmotionProperty;
  anger: EmotionProperty;
  surprise: EmotionProperty;
  sadness: EmotionProperty;
}

interface Thoughts {
  creative: boolean;
  concrete: boolean;
  abstract: boolean;
  analytical: boolean;
  critical: boolean;
  unknown: boolean;
}

export interface FormDataType {
  categories: Thoughts;
  emotions: Emotion;
  priority: number;
  description: string;
}

const Form: any = (props: Props) => {
  const { showForm, setShowForm, setSavedData, savedData } = props;
  const emotionPropertyInitialValue = {
    value: false,
    intensity: 30,
  };
  const emotionsInitialValue = {
    neutral: emotionPropertyInitialValue,
    fear: emotionPropertyInitialValue,
    joy: emotionPropertyInitialValue,
    anticipation: emotionPropertyInitialValue,
    trust: emotionPropertyInitialValue,
    disgust: emotionPropertyInitialValue,
    anger: emotionPropertyInitialValue,
    surprise: emotionPropertyInitialValue,
    sadness: emotionPropertyInitialValue,
  };
  const categoriesInitialValue = {
    creative: false,
    concrete: false,
    abstract: false,
    analytical: false,
    critical: false,
    unknown: false,
  };

  const [formData, setFormData] = useState({
    categories: categoriesInitialValue,
    emotions: emotionsInitialValue,
    priority: 50,
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    categoriesError: "",
    emotionsError: "",
    descriptionError: "",
  });
  useEffect(() => {
    validateFormData(formData);
    return () => {};
  }, [formData]);

  const refreshFormData = () => {
    setFormData(() => {
      return {
        categories: categoriesInitialValue,
        emotions: emotionsInitialValue,
        priority: 50,
        description: "",
      };
    });
  };
  const refreshFormErrors = () => {
    setFormErrors(() => {
      return {
        categoriesError: "",
        emotionsError: "",
        descriptionError: "",
      };
    });
  };
  const handleCancel = () => {
    setShowForm(false);
    refreshFormData();
    refreshFormErrors();
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((formData) => {
      const { type, value, name, id } = e.target;
      if (type === "checkbox") {
        return {
          ...formData,
          categories: {
            ...formData.categories,
            [id]: (e.target as HTMLInputElement).checked,
          },
        };
      }
      return {
        ...formData,
        [name]: value,
      };
    });
  };
  const validateFormData = (data: FormDataType) => {
    let output = true;
    if (
      JSON.stringify(data.categories) === JSON.stringify(categoriesInitialValue)
    ) {
      setFormErrors((formErrors) => {
        return {
          ...formErrors,
          categoriesError: "* At least select one category",
        };
      });
      output = false;
    } else {
      setFormErrors((formErrors) => {
        return {
          ...formErrors,
          categoriesError: "",
        };
      });
    }
    if (
      JSON.stringify(data.emotions) === JSON.stringify(emotionsInitialValue)
    ) {
      setFormErrors((formErrors) => {
        return {
          ...formErrors,
          emotionsError: "* At least select one emotion",
        };
      });
      output = false;
    } else {
      setFormErrors((formErrors) => {
        return {
          ...formErrors,
          emotionsError: "",
        };
      });
    }
    if (!data.description) {
      setFormErrors((formErrors) => {
        return {
          ...formErrors,
          descriptionError: "* Description can not be empty",
        };
      });
      output = false;
    } else {
      setFormErrors((formErrors) => {
        return {
          ...formErrors,
          descriptionError: "",
        };
      });
    }
    return output;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFormData(formData)) return;
    setSavedData((savedData: FormDataType[]) => {
      return [...savedData, formData];
    });
    refreshFormData();
    refreshFormErrors();
    setShowForm(false);
  };

  return (
    <StyledDiv showForm={showForm}>
      <StyledWrapper>
        <form onSubmit={handleSubmit}>
          <StyledContainer>
            <h5>Description</h5>
            <DescriptionInput
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {formErrors.descriptionError && (
              <StyledErrors>{formErrors.descriptionError}</StyledErrors>
            )}
            <h5>Category</h5>
            <Categories formData={formData} handleChange={handleChange} />
            {formErrors.categoriesError && (
              <StyledErrors>{formErrors.categoriesError}</StyledErrors>
            )}
            <h5>Emotions</h5>
            <Emotions
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
            />
            {formErrors.emotionsError && (
              <StyledErrors>{formErrors.emotionsError}</StyledErrors>
            )}
            <h5>Priority</h5>
            <StyledSlider
              type="range"
              min="10"
              max="100"
              name="priority"
              onChange={handleChange}
              value={formData.priority}
            />
          </StyledContainer>
          <SubmitButton type="submit" value="Submit" />
          <CancelButton type="button" value="Cancel" onClick={handleCancel} />
        </form>
      </StyledWrapper>
    </StyledDiv>
  );
};

export default Form;