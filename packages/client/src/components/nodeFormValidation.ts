import { NodeDataType, NodeFormErrorType } from "./NodeForm";
import { Errors } from "./constants";

export const validateNodeData = (data: NodeDataType, setNodeFormErrors: any) => {
  let output = true;

  if (JSON.stringify(data.categories) === "{}") {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        categoriesError: `* ${Errors.CATEGORY_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        categoriesError: "",
      };
    });
  }
  if (JSON.stringify(data.emotions) === "{}") {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        emotionsError: `* ${Errors.EMOTION_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        emotionsError: "",
      };
    });
  }
  if (!data.description) {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        descriptionError: `* ${Errors.DESCRIPTION_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        descriptionError: "",
      };
    });
  }
  
  return output;
};
