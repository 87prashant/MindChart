import { NodeDataType, FormErrorType } from "./NodeForm";
import { Errors } from "./constants";

export const validateFormData = (data: NodeDataType, setNodeFormErrors: any) => {
  let output = true;
  if (JSON.stringify(data.categories) === "{}") {
    setNodeFormErrors((nodeFormErrors: FormErrorType) => {
      return {
        ...nodeFormErrors,
        categoriesError: `* ${Errors.CATEGORY_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: FormErrorType) => {
      return {
        ...nodeFormErrors,
        categoriesError: "",
      };
    });
  }
  if (JSON.stringify(data.emotions) === "{}") {
    setNodeFormErrors((nodeFormErrors: FormErrorType) => {
      return {
        ...nodeFormErrors,
        emotionsError: `* ${Errors.EMOTION_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: FormErrorType) => {
      return {
        ...nodeFormErrors,
        emotionsError: "",
      };
    });
  }
  if (!data.description) {
    setNodeFormErrors((nodeFormErrors: FormErrorType) => {
      return {
        ...nodeFormErrors,
        descriptionError: `* ${Errors.DESCRIPTION_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: FormErrorType) => {
      return {
        ...nodeFormErrors,
        descriptionError: "",
      };
    });
  }
  return output;
};
