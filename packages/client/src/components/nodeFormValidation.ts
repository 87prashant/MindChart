import { NodeDataType, NodeFormErrorType } from "./NodeForm";
import { Errors } from "./constants";

export const validateNodeData = (data: NodeDataType, setNodeFormErrors: any) => {
  let output = true;

  if (JSON.stringify(data.thoughts) === "{}") {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        thoughtsError: `* ${Errors.THOUGHT_REQUIRED}`,
      };
    });
    output = false;
  } else {
    setNodeFormErrors((nodeFormErrors: NodeFormErrorType) => {
      return {
        ...nodeFormErrors,
        thoughtsError: "",
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
