import { FormDataType, FormErrorType } from "./Form";

export const validateFormData = (data: FormDataType, setFormErrors: any) => {
  let output = true;
  if (JSON.stringify(data.categories) === "{}") {
    setFormErrors((formErrors: FormErrorType) => {
      return {
        ...formErrors,
        categoriesError: "* At least select one category",
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
        emotionsError: "* At least select one emotion",
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
        descriptionError: "* Description can not be empty",
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
