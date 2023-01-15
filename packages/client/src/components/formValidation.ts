import { FormDataType, FormErrorType } from "./Form";
import { Errors } from "./constants";

export const validateFormData = (data: FormDataType, setFormErrors: any) => {
  let output = true;
  if (JSON.stringify(data.categories) === "{}") {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        categoriesError: `* ${Errors.CATEGORY_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        categoriesError: "",
      };
    });
  }
  if (JSON.stringify(data.emotions) === "{}") {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        emotionsError: `* ${Errors.EMOTION_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        emotionsError: "",
      };
    });
  }
  if (!data.description) {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        descriptionError: `* ${Errors.DESCRIPTION_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        descriptionError: "",
      };
    });
  }
  return output;
};
