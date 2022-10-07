import * as d3 from "d3";
import { FormDataType } from "./Form";

interface Props {
  container: HTMLElement;
  w: number;
  h: number;
  savedData: FormDataType[];
}

const MiniChart = (props: Props) => {
  const { container, w, h, savedData } = props;
  const svg = d3
    .select(container)
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("viewBox", [-w / 2, -h / 2, w, h])
    .attr("style", "max-width: 100%");

  // const node = svg.append("g").attr()
};

export default MiniChart;
