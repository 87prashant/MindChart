import {
  FormDataType,
  categoriesInitialValue,
  FormErrorType,
  Emotion,
} from "./Form";

export const validateFormData = (data: FormDataType, setFormErrors: any) => {
  let output = true;
  const validateEmotions = (emotionsObject: Emotion) => {
    for (let key in emotionsObject) {
      if (emotionsObject[key as keyof typeof emotionsObject].value) {
        return false;
      }
    }
    return true;
  };
  if (
    JSON.stringify(data.categories) === JSON.stringify(categoriesInitialValue)
  ) {
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
  if (validateEmotions(data.emotions)) {
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
