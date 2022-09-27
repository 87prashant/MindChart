// TODO: Change the name to Form as it makes for sense
// TODO: Optimize the categories by storing only the required ones

import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import Data from "../Data/Data";
import Types from "./Types";
import Categories from "./Categories";

const StyledWrapper = styled("div")({
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: "rgba(239, 239, 240, 1)",
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
  height: "80px",
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

const StyledDiv = styled("div")<{ showAddNewThemo: boolean }>(
  ({ showAddNewThemo }) => ({
    position: "fixed",
    display: showAddNewThemo ? "block" : "none",
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.20)",
  })
);

const StyledErrors = styled("div")({
  color: "red",
  fontSize: 11,
});

interface Props {
  setShowAddNewThemo: React.Dispatch<React.SetStateAction<boolean>>;
  showAddNewThemo: boolean;
}

interface Emotions {
  fear: boolean;
  joy: boolean;
  anticipation: boolean;
  trust: boolean;
  disgust: boolean;
  anger: boolean;
  surprise: boolean;
  sadness: boolean;
}

interface Thoughts {
  creative: boolean;
  concrete: boolean;
  abstract: boolean;
  analytical: boolean;
  critical: boolean;
}

export interface FormDataType {
  type: string;
  categories: { emotions: Emotions; thoughts: Thoughts };
  description: string;
}

const AddNewThemo = (props: Props) => {
  const { showAddNewThemo, setShowAddNewThemo } = props;
  const emotionsInitialValue = {
    fear: false,
    joy: false,
    anticipation: false,
    trust: false,
    disgust: false,
    anger: false,
    surprise: false,
    sadness: false,
  };
  const thoughtsInitialValue = {
    creative: false,
    concrete: false,
    abstract: false,
    analytical: false,
    critical: false,
  };
  const categoriesInitialValue = {
    emotions: emotionsInitialValue,
    thoughts: thoughtsInitialValue,
  };

  const [formData, setFormData] = useState({
    type: "emotion",
    categories: {
      emotions: emotionsInitialValue,
      thoughts: thoughtsInitialValue,
    },
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    categoriesError: "",
    descriptionError: "",
  });
  useEffect(() => {
    validateFormData(formData);
    return () => {};
  }, [formData]);

  const refreshFormData = (check: string | undefined = undefined) => {
    if (check === "onlyEmotions") {
      setFormData((formData) => {
        return {
          ...formData,
          categories: {
            ...formData.categories,
            emotions: emotionsInitialValue,
          },
        };
      });
      return;
    }
    if (check === "onlyThoughts") {
      setFormData((formData) => {
        return {
          ...formData,
          categories: {
            ...formData.categories,
            thoughts: thoughtsInitialValue,
          },
        };
      });
      return;
    }
    setFormData(() => {
      return {
        type: "emotion",
        categories: {
          emotions: emotionsInitialValue,
          thoughts: thoughtsInitialValue,
        },
        description: "",
      };
    });
  };
  const refreshFormErrors = () => {
    setFormErrors(() => {
      return {
        categoriesError: "",
        descriptionError: "",
      };
    });
  };
  const handleCancel = () => {
    setShowAddNewThemo(false);
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
      const { type, value, name } = e.target;
      if (type === "checkbox") {
        if (formData.type === "emotion") {
          return {
            ...formData,
            categories: {
              ...formData.categories,
              emotions: {
                ...formData.categories.emotions,
                [name]: (e.target as HTMLInputElement).checked,
              },
            },
          };
        }
        return {
          ...formData,
          categories: {
            ...formData.categories,
            thoughts: {
              ...formData.categories.thoughts,
              [name]: (e.target as HTMLInputElement).checked,
            },
          },
        };
      }
      if (name === "type" && value === "emotion") {
        refreshFormData("onlyThoughts");
      }
      if (name === "type" && value === "thought") {
        refreshFormData("onlyEmotions");
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
    Data.push(formData)
    refreshFormData();
    refreshFormErrors();
    setShowAddNewThemo(false);
  };

  return (
    <StyledDiv showAddNewThemo={showAddNewThemo}>
      <StyledWrapper>
        <form onSubmit={(e) => handleSubmit(e)}>
          <h5>Type</h5>
          <Types
            formData={formData}
            handleChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleChange(e)
            }
          />
          <h5>Category</h5>
          <Categories
            formData={formData}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
          />
          {formErrors.categoriesError && (
            <StyledErrors>{formErrors.categoriesError}</StyledErrors>
          )}
          <h5>Description</h5>
          <DescriptionInput
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
          />
          {formErrors.descriptionError && (
            <StyledErrors>{formErrors.descriptionError}</StyledErrors>
          )}
          <SubmitButton type="submit" value="Submit" />
          <CancelButton type="button" value="Cancel" onClick={handleCancel} />
        </form>
      </StyledWrapper>
    </StyledDiv>
  );
};

export default AddNewThemo;
