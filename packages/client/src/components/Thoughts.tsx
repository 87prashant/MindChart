import styled from "@emotion/styled";
import { NodeDataType } from "./NodeForm";
import { ThoughtsList } from "./constants";

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

interface Props {
  nodeData: NodeDataType;
  handleChange: any;
}

const Thoughts = (props: Props) => {
  const { nodeData, handleChange } = props;
  const thoughts = [
    ThoughtsList.CREATIVE,
    ThoughtsList.ANALYTICAL,
    ThoughtsList.CRITICAL,
    ThoughtsList.CONCRETE,
    ThoughtsList.ABSTRACT,
    ThoughtsList.UNKNOWN,
  ];

  const inputs = thoughts.map((data, index) => {
    return (
      <div key={index}>
        <input
          type="checkbox"
          id={data}
          name="thoughts"
          checked={
            !!nodeData.thoughts?.[data as keyof typeof nodeData.thoughts]
          }
          onChange={handleChange}
        />
        <label htmlFor={data}>
          {data.slice(0, 1).toUpperCase() + data.slice(1)}
        </label>
      </div>
    );
  });

  return <Wrapper>{inputs}</Wrapper>;
};

export default Thoughts;
