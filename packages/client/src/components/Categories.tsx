import styled from "@emotion/styled";
import { NodeDataType } from "./NodeForm";
import { CategoriesList } from "./constants";

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

const Categories = (props: Props) => {
  const { nodeData, handleChange } = props;
  const categories = [
    CategoriesList.CREATIVE,
    CategoriesList.ANALYTICAL,
    CategoriesList.CRITICAL,
    CategoriesList.CONCRETE,
    CategoriesList.ABSTRACT,
    CategoriesList.UNKNOWN,
  ];

  const inputs = categories.map((data, index) => {
    return (
      <div key={index}>
        <input
          type="checkbox"
          id={data}
          name="categories"
          checked={
            nodeData.categories?.[data as keyof typeof nodeData.categories]
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

export default Categories;
