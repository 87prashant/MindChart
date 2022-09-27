import styled from "@emotion/styled";
import React from "react";
import { FormDataType } from "./AddNewThemo";

const Wrapper = styled('div')({
  '& input': {
    cursor: 'pointer',
  },
  '& label': {
    marginRight: 10,
    cursor: 'pointer',
  }
})
interface Props {
  formData: FormDataType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Categories = (props: Props) => {
  const { formData, handleChange } = props;
  return (
    <div>
      {formData.type === "emotion" ? (
        <Wrapper>
          <input
            type="checkbox"
            id="fear"
            name="fear"
            checked={formData.categories.emotions.fear}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="fear">Fear</label>
          <input
            type="checkbox"
            id="anger"
            name="anger"
            checked={formData.categories.emotions.anger}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="anger">Anger</label>
          <input
            type="checkbox"
            id="sadness"
            name="sadness"
            checked={formData.categories.emotions.sadness}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="sadness">Sadness</label>
          <input
            type="checkbox"
            id="disgust"
            name="disgust"
            checked={formData.categories.emotions.disgust}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="disgust">Disgust</label>
          <input
            type="checkbox"
            id="surprise"
            name="surprise"
            checked={formData.categories.emotions.surprise}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="surprise">Surprise</label>
          <input
            type="checkbox"
            id="joy"
            name="joy"
            checked={formData.categories.emotions.joy}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="joy">Joy</label>
          <input
            type="checkbox"
            id="anticipation"
            name="anticipation"
            checked={formData.categories.emotions.anticipation}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="anticipation">Anticipation</label>
          <input
            type="checkbox"
            id="trust"
            name="trust"
            checked={formData.categories.emotions.trust}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="trust">Trust</label>
        </Wrapper>
      ) : (
        <Wrapper>
          <input
            type="checkbox"
            id="creative"
            name="creative"
            checked={formData.categories.thoughts.creative}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="creative">Creative</label>
          <input
            type="checkbox"
            id="analytical"
            name="analytical"
            checked={formData.categories.thoughts.analytical}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="analytical">Analytical</label>
          <input
            type="checkbox"
            id="critical"
            name="critical"
            checked={formData.categories.thoughts.critical}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="critical">Critical</label>
          <input
            type="checkbox"
            id="concrete"
            name="concrete"
            checked={formData.categories.thoughts.concrete}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="concrete">Concrete</label>
          <input
            type="checkbox"
            id="abstract"
            name="abstract"
            checked={formData.categories.thoughts.abstract}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="abstract">Abstract</label>
        </Wrapper>
      )}
    </div>
  );
};

export default Categories;
