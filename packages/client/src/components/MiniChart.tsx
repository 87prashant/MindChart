import * as d3 from "d3";
import { FormDataType } from "./Form";

interface Props {
  w: number;
  h: number;
  savedData: FormDataType[];
}

const MiniChart = (props: Props) => {
  const { w, h, savedData } = props;
  console.log(savedData);
  const N: number[] = savedData.map(intern);
  const newNodes: d3.SimulationNodeDatum[] = d3.map(savedData, (d) => ({
    index: N[d.priority],
  }));

  const forceNode = d3.forceManyBody();

  const simulation = d3
    .forceSimulation(newNodes)
    // .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter())
    .on("tick", ticked);

  const svg = d3
    // .select(container)
    .create("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("viewBox", [-w / 2, -h / 2, w, h])
    .attr("style", "max-width: 100%");

  const node = svg
    .append("g")
    .attr("fill", "red")
    .attr("stroke", "#fff")
    // .attr("stroke-opacity", nodeStrokeOpacity!)
    // .attr("stroke-width", nodeStrokeWidth!)
    .selectAll("circle")
    .data(newNodes)
    .join("circle")
    .attr("r", 10)
    .call(drag(simulation) as any);

  function intern(value: { valueOf: () => any } | null) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function ticked() {
    // link
    //   .attr("x1", (d) => d.source.x)
    //   .attr("y1", (d) => d.source.y)
    //   .attr("x2", (d) => d.target.x)
    //   .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
  }

  function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
    function dragstarted(event: {
      active: any;
      subject: { fx: any; x: any; fy: any; y: any };
    }) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: { subject: { fx: any; fy: any }; x: any; y: any }) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: {
      active: any;
      subject: { fx: null; fy: null };
    }) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return svg.node();
};

export default MiniChart;
