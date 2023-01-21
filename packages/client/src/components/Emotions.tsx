import styled from "@emotion/styled";
import React, { useState } from "react";
import { NodeDataType } from "./NodeForm";
import IntensityForm from "./IntensityForm";
import { EmotionsList } from "./constants";

const Wrapper = styled("div")({
  "& input": {
    cursor: "pointer",
  },
  "& label": {
    marginRight: 6,
    cursor: "pointer",
  },
  marginBottom: 10,
});

export const emotions = [
  EmotionsList.NEUTRAL,
  EmotionsList.FEAR,
  EmotionsList.ANGER,
  EmotionsList.SADNESS,
  EmotionsList.SURPRISE,
  EmotionsList.JOY,
  EmotionsList.ANTICIPATION,
  EmotionsList.TRUST,
];

interface Props {
  nodeData: NodeDataType;
  setNodeData: any;
}

const Emotions = (props: Props) => {
  const { nodeData, setNodeData } = props;
  const [intensityForm, setIntensityForm] = useState<null | JSX.Element>(null);

  const handleChange = (e: any) => {
    setIntensityForm(() => {
      return (
        <IntensityForm
          event={e}
          nodeData={nodeData}
          setNodeData={setNodeData}
          setIntensityForm={setIntensityForm}
        />
      );
    });
  };

  const inputs = emotions.map((data, index) => {
    return (
      <div key={index}>
        <input
          type="checkbox"
          id={data}
          name="emotions"
          checked={
            !!nodeData.emotions?.[data as keyof typeof nodeData.emotions]
          }
          onChange={handleChange}
        />
        <label htmlFor={data}>
          {data.slice(0, 1).toUpperCase() + data.slice(1)}
        </label>
      </div>
    );
  });

  return (
    <>
      {intensityForm && intensityForm}
      <Wrapper>{inputs}</Wrapper>
    </>
  );
};

export default Emotions;
