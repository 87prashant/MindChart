import styled from "@emotion/styled";
import React, { useState, useEffect, useMemo } from "react";
import Emotions from "./Emotions";
import Categories from "./Categories";
import { validateNodeData } from "./nodeFormValidation";
import Tips from "./Tips";
import { DataOperation } from "./constants";

export const StyledWrapper = styled("div")({
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: "rgba(242, 242, 242, 1)",
  width: "700px",
  height: "480px",
  margin: "auto",
  padding: 15,
  borderRadius: 8,
  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
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

export const SubmitButton = styled(Inputs)<{ isNodeDataDuplicate: boolean }>(
  ({ isNodeDataDuplicate }) => ({
    position: "absolute",
    bottom: 50,
    left: 20,
    cursor: isNodeDataDuplicate ? "not-allowed" : "pointer",
    fontWeight: "bold",
    color: isNodeDataDuplicate ? "rgba(0, 0, 0, 0.3)" : "black",
    border: isNodeDataDuplicate
      ? "2px solid rgba(0, 0, 0, 0.3)"
      : "2px solid black",
    ":hover": {
      backgroundColor: "rgb(192, 192, 192, 0.7)",
    },
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
    backgroundColor: "rgb(192, 192, 192, 0.7)",
  },
});

export const StyledDiv = styled("div")({
  position: "fixed",
  top: 0,
  height: "100%",
  width: "100%",
  backdropFilter: "blur(10px)",
});

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
  backgroundColor: "white",
  borderRadius: 8,
  overflowY: "scroll",
  "::-webkit-scrollbar": {
    width: 12,
  },
  "::-webkit-scrollbar-track": {
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
  setShowNodeForm: any;
  showNodeForm: boolean;
  savedData: NodeDataType[];
  setSavedData: any;
  setIsChartAdded: any;
  nodeData: NodeDataType;
  setNodeData: any;
  isDemoActive: boolean;
  hackedNodeData: NodeDataType;
  setHackedNodeData: any;
  userInfo: { username: string; email: string };
  isLoggedIn: boolean;
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

export interface NodeDataType {
  categories: Thoughts;
  emotions: Emotion;
  priority: number;
  description: string;
  _id?: string;
}

export interface NodeFormErrorType {
  categoriesError: string;
  emotionsError: string;
  descriptionError: string;
}

const NodeForm: any = (props: Props) => {
  const {
    showNodeForm,
    setShowNodeForm,
    setSavedData,
    setIsChartAdded,
    nodeData,
    setNodeData,
    savedData,
    isDemoActive,
    hackedNodeData,
    setHackedNodeData,
    userInfo: { email },
    isLoggedIn,
  } = props;

  const [nodeFormErrors, setNodeFormErrors] = useState({
    categoriesError: "",
    emotionsError: "",
    descriptionError: "",
  });
  const [isEarlySubmit, setIsEarlySubmit] = useState(false);
  const refreshNodeData = () => {
    setNodeData(() => {
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
    setNodeFormErrors(() => {
      return {
        categoriesError: "",
        emotionsError: "",
        descriptionError: "",
      };
    });
  };
  const [isNodeDataDuplicate, setIsNodeDataDuplicate] = useState(false);

  useEffect(() => {
    validateNodeData(nodeData, setNodeFormErrors);
    if (hackedNodeData) {
      setIsNodeDataDuplicate(
        JSON.stringify(hackedNodeData) === JSON.stringify(nodeData)
      );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeData]);

  const handleCancel = () => {
    setShowNodeForm(false);
    refreshNodeData();
    refreshFormErrors();
    setIsEarlySubmit(false);
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNodeData((nodeData: NodeDataType) => {
      const { type, value, name, id } = e.target;
      if (type === "checkbox") {
        return {
          ...nodeData,
          categories: {
            ...nodeData.categories,
            [id]: (e.target as HTMLInputElement).checked ? true : false,
          },
        };
      }
      return {
        ...nodeData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateNodeData(nodeData, setNodeFormErrors)) {
      setIsEarlySubmit(true);
      return;
    }
    if (isNodeDataDuplicate) return;

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
        return [...newSavedData, nodeData];
      });
    } else {
      setSavedData((prev: NodeDataType[]) => {
        return [...prev, nodeData];
      });
    }
    if (isLoggedIn) {
      fetch(process.env.REACT_APP_MODIFY_DATA_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          toBeAdded: nodeData,
          toBeDeleted: hackedNodeData,
          operation: hackedNodeData ? DataOperation.UPDATE : DataOperation.ADD,
        }),
      })
        .then((response) => response.json())
        //do something if error comes for example delete the created data with showing th messages etc.
        .then((data) => {});
    }
    setHackedNodeData(null);
    refreshNodeData();
    refreshFormErrors();
    setShowNodeForm(false);
    setIsChartAdded(false);
    setIsEarlySubmit(false);
  };

  useEffect(() => {
    if (!isDemoActive && !isLoggedIn) {
      window.localStorage.setItem("savedData", JSON.stringify(savedData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData]);

  const tips = useMemo(() => {
    return <Tips />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNodeForm]);

  return (
    <StyledDiv>
      <StyledWrapper>
        <form onSubmit={handleSubmit}>
          <StyledContainer>
            <Header>Description</Header>
            <DescriptionInput
              placeholder="Description"
              name="description"
              value={nodeData.description}
              onChange={handleChange}
            />
            {nodeFormErrors.descriptionError && (
              <StyledErrors isEarlySubmit={isEarlySubmit}>
                {nodeFormErrors.descriptionError}
              </StyledErrors>
            )}
            <Header>Category</Header>
            <Categories nodeData={nodeData} handleChange={handleChange} />
            {nodeFormErrors.categoriesError && (
              <StyledErrors isEarlySubmit={isEarlySubmit}>
                {nodeFormErrors.categoriesError}
              </StyledErrors>
            )}
            <Header>Emotions</Header>
            <Emotions nodeData={nodeData} setNodeData={setNodeData} />
            {nodeFormErrors.emotionsError && (
              <StyledErrors isEarlySubmit={isEarlySubmit}>
                {nodeFormErrors.emotionsError}
              </StyledErrors>
            )}
            <Header>Priority</Header>
            <StyledSlider
              type="range"
              min="10"
              max="70"
              name="priority"
              onChange={handleChange}
              value={nodeData.priority}
            />
          </StyledContainer>
          <SubmitButton
            isNodeDataDuplicate={isNodeDataDuplicate}
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

export default NodeForm;
