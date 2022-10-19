//TODO: Optimize the nodesArray
//TODO: Optimze the linksArray

import * as d3 from "d3";
import { emotions } from "./Emotions";
import { Emotion, FormDataType } from "./Form";

interface Props {
  w: number;
  h: number;
  savedData: FormDataType[];
}

const MiniChart = (props: Props) => {
  const { w, h, savedData } = props;
  const findGroupArray = (data: Emotion) => {
    let arr = [];
    for (let key in JSON.parse(JSON.stringify(data))) {
      arr.push(emotions.indexOf(key));
    }
    return arr;
  };
  const nodesArray = savedData.map((data) => {
    return {
      description: data.description,
      priority: data.priority,
      categories: JSON.parse(JSON.stringify(data.categories)), // to remove the undefined property
      emotions: JSON.parse(JSON.stringify(data.emotions)),
      group: findGroupArray(data.emotions),
    };
  });

  let linkArray = [];
  for (let i = 0; i < nodesArray.length; i++) {
    const groups = nodesArray[i].group;
    for (let j = 0; j < groups.length; j++) {
      const group = groups[j];
      for (let k = i + 1; k < nodesArray.length; k++) {
        const compareGroups = nodesArray[k].group;
        for (let l = 0; l < compareGroups.length; l++) {
          const compareGroup = compareGroups[l];
          if (group === compareGroup) {
            linkArray.push({
              source: nodesArray[i].description,
              target: nodesArray[k].description,
            });
          }
        }
      }
    }
  }

  const N = d3.map(nodesArray, (d) => d.description).map(intern);
  console.log(N);
  const newNodes: d3.SimulationNodeDatum[] = d3.map(savedData, (d) => ({}));

  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(linkArray).id(({ index: i }) => N[i!]);
  forceNode.strength(-400);

  const simulation = d3
    .forceSimulation(newNodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter())
    .on("tick", ticked);

  const svg = d3
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
    .call(drag(simulation) as any);

  const link = svg
    .append("g")
    .attr("stroke", "black")
    // .attr("stroke-opacity", linkStrokeOpacity!)
    // .attr("stroke-width", linkStrokeWidth!)
    // .attr("stroke-linecap", linkStrokeLinecap!)
    .selectAll("line")
    .data(linkArray)
    .join("line");


  node.attr("r", ({ index: i }) => savedData[i!].priority/2); // temporary

  function intern(value: { valueOf: () => any } | null) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function ticked() {
    link
      .attr("x1", (d) => (d.source as any).x)
      .attr("y1", (d) => (d.source as any).y)
      .attr("x2", (d) => (d.source as any).x)
      .attr("y2", (d) => (d.source as any).y);

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
