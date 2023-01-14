import styled from "@emotion/styled";
import React, { useState, useEffect, useMemo } from "react";
import Emotions from "./Emotions";
import Categories from "./Categories";
import { validateFormData } from "./formValidation";
import Tips from "./Tips";

export const StyledWrapper = styled("div")({
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: "rgba(225, 225, 225, 1)",
  border: "2px solid black",
  width: "700px",
  height: "480px",
  margin: "auto",
  padding: 15,
  borderRadius: 8,
  boxShadow: "10px 10px 8px rgba(0, 0, 0, 0.3)",
  userSelect: "none",
});

export const Header = styled("div")({
  fontWeight: "bold",
  fontSize: 17,
  marginBottom: 10,
});

export const Inputs = styled("input")({
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
  marginBottom: 10,
});

export const SubmitButton = styled(Inputs)<{ isFormDataDuplicate: boolean }>(
  ({ isFormDataDuplicate }) => ({
    position: "absolute",
    bottom: 50,
    left: 20,
    cursor: isFormDataDuplicate ? "not-allowed" : "pointer",
    fontWeight: "bold",
    color: isFormDataDuplicate ? "rgba(0, 0, 0, 0.3)" : "black",
    border: isFormDataDuplicate
      ? "2px solid rgba(0, 0, 0, 0.3)"
      : "2px solid black",
  })
);

export const CancelButton = styled(Inputs)({
  position: "absolute",
  bottom: 50,
  right: 20,
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all ease 300ms",
  ":hover": {
    backgroundColor: "red",
  },
});

export const StyledDiv = styled("div")<{ showForm: boolean }>(
  ({ showForm }) => ({
    position: "fixed",
    display: showForm ? "block" : "none",
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.20)",
  })
);

const StyledErrors = styled("div")<{ isEarlySubmit: boolean }>(
  ({ isEarlySubmit }) => ({
    color: isEarlySubmit ? "red" : "teal",
    fontSize: 12,
    marginBottom: 10,
  })
);

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
  marginBottom: 10,
});

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  showForm: boolean;
  savedData: FormDataType[];
  setSavedData: any;
  setIsChartAdded: any;
  formData: FormDataType;
  setFormData: any;
  isDemoActive: boolean;
  hackedNodeData: FormDataType;
  setHackedNodeData: any;
  userInfo: { username: string; email: string };
  isRegistered: boolean;
}

export interface Emotion {
  neutral?: number;
  fear?: number;
  joy?: number;
  anticipation?: number;
  trust?: number;
  anger?: number;
  surprise?: number;
  sadness?: number;
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
  _id?: string;
}

export interface FormErrorType {
  categoriesError: string;
  emotionsError: string;
  descriptionError: string;
}

const Form: any = (props: Props) => {
  const {
    showForm,
    setShowForm,
    setSavedData,
    setIsChartAdded,
    formData,
    setFormData,
    savedData,
    isDemoActive,
    hackedNodeData,
    setHackedNodeData,
    userInfo: { email },
    isRegistered,
  } = props;

  const [formErrors, setFormErrors] = useState({
    categoriesError: "",
    emotionsError: "",
    descriptionError: "",
  });
  const [isEarlySubmit, setIsEarlySubmit] = useState(false);
  const refreshFormData = () => {
    setFormData(() => {
      return {
        categories: {
          creative: false,
          concrete: false,
          abstract: false,
          analytical: false,
          critical: false,
          unknown: false,
        },
        emotions: {},
        priority: 20,
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
  const [isFormDataDuplicate, setIsFormDataDuplicate] = useState(false);

  useEffect(() => {
    validateFormData(formData, setFormErrors);
    if (hackedNodeData) {
      setIsFormDataDuplicate(
        JSON.stringify(hackedNodeData) === JSON.stringify(formData)
      );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleCancel = () => {
    setShowForm(false);
    refreshFormData();
    refreshFormErrors();
    setIsEarlySubmit(false);
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((formData: FormDataType) => {
      const { type, value, name, id } = e.target;
      if (type === "checkbox") {
        return {
          ...formData,
          categories: {
            ...formData.categories,
            [id]: (e.target as HTMLInputElement).checked ? true : false,
          },
        };
      }
      return {
        ...formData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFormData(formData, setFormErrors)) {
      setIsEarlySubmit(true);
      return;
    }
    if (isFormDataDuplicate) return;

    if (hackedNodeData) {
      const newSavedData = savedData.filter((d) => {
        return (
          d.categories !== hackedNodeData.categories &&
          d.description !== hackedNodeData.description &&
          d.emotions !== hackedNodeData.emotions &&
          d.priority !== hackedNodeData.priority
        );
      });
      setSavedData(() => {
        return [...newSavedData, formData];
      });
    } else {
      setSavedData((prev: FormDataType[]) => {
        return [...prev, formData];
      });
    }
    if (isRegistered) {
      fetch(process.env.REACT_APP_MODIFY_DATA_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          toBeAdded: formData,
          toBeDeleted: hackedNodeData,
          operation: hackedNodeData ? "Update" : "Add"
        }),
      })
        .then((response) => response.json())
        .then((data) => {});
    }
    setHackedNodeData(null);
    refreshFormData();
    refreshFormErrors();
    setShowForm(false);
    setIsChartAdded(false);
    setIsEarlySubmit(false);
  };

  useEffect(() => {
    if (!isDemoActive) {
      window.localStorage.setItem("savedData", JSON.stringify(savedData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData]);

  const tips = useMemo(() => {
    return <Tips />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  return (
    <StyledDiv showForm={showForm}>
      <StyledWrapper>
        <form onSubmit={handleSubmit}>
          <StyledContainer>
            <Header>Description</Header>
            <DescriptionInput
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {formErrors.descriptionError && (
              <StyledErrors isEarlySubmit={isEarlySubmit}>
                {formErrors.descriptionError}
              </StyledErrors>
            )}
            <Header>Category</Header>
            <Categories formData={formData} handleChange={handleChange} />
            {formErrors.categoriesError && (
              <StyledErrors isEarlySubmit={isEarlySubmit}>
                {formErrors.categoriesError}
              </StyledErrors>
            )}
            <Header>Emotions</Header>
            <Emotions formData={formData} setFormData={setFormData} />
            {formErrors.emotionsError && (
              <StyledErrors isEarlySubmit={isEarlySubmit}>
                {formErrors.emotionsError}
              </StyledErrors>
            )}
            <Header>Priority</Header>
            <StyledSlider
              type="range"
              min="10"
              max="70"
              name="priority"
              onChange={handleChange}
              value={formData.priority}
            />
          </StyledContainer>
          <SubmitButton
            isFormDataDuplicate={isFormDataDuplicate}
            type="submit"
            value="Submit"
          />
          <CancelButton type="button" value="Cancel" onClick={handleCancel} />
        </form>
        {tips}
      </StyledWrapper>
    </StyledDiv>
  );
};

export default Form;
