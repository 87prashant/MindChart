//TODO: Optimize the nodesArray
//TODO: Optimize the links

import * as d3 from "d3";
import { Misc } from "./constants";
import { emotions } from "./Emotions";
import { findColors } from "./findColors";
import { Emotion, NodeDataType } from "./NodeForm";

interface Props {
  w: number;
  h: number;
  savedData: NodeDataType[];
  setShowNodeClickModal: any;
  handleNodeClick: any;
}

const MiniChart = (props: Props) => {
  const { w, h, savedData, handleNodeClick, setShowNodeClickModal } = props;
  const findGroupArray = (data: Emotion) => {
    let arr: any = []; //give proper type
    for (let key in JSON.parse(JSON.stringify(data))) {
      arr.push(emotions.indexOf(key));
    }
    return arr;
  };
  const nodesArray = savedData.map((data) => {
    return {
      description: data.description,
      priority: +data.priority,
      categories: JSON.parse(JSON.stringify(data.categories)), // to remove the undefined property
      emotions: JSON.parse(JSON.stringify(data.emotions)),
      group: findGroupArray(data.emotions),
    };
  });

  const hackDataArray = savedData.map((data) => {
    return {
      categories: JSON.parse(JSON.stringify(data.categories)),
      emotions: JSON.parse(JSON.stringify(data.emotions)),
      priority: data.priority,
      description: data.description,
    };
  });

  const N = d3.map(nodesArray, (d) => JSON.stringify(d)).map(intern);
  const R = d3.map(nodesArray, (d) => d.priority); //radius array
  const C = d3.map(nodesArray, (d) => findColors(d.emotions)).map(intern); //colors array
  const mappedHackDataArray = d3.map(hackDataArray, (d) => JSON.stringify(d));

  const nodes: d3.SimulationNodeDatum[] = d3.map(nodesArray, (_, i) => ({
    index: N[i],
  }));

  let links: any = []; //give proper type
  for (let i = 0; i < nodesArray.length; i++) {
    const groups = nodesArray[i].group;
    for (let j = 0; j < groups.length; j++) {
      const group = groups[j];
      for (let k = i + 1; k < nodesArray.length; k++) {
        const compareGroups = nodesArray[k].group;
        for (let l = 0; l < compareGroups.length; l++) {
          const compareGroup = compareGroups[l];
          if (group === compareGroup) {
            links.push({
              source: JSON.stringify(nodesArray[i]),
              target: JSON.stringify(nodesArray[k]),
            });
          }
        }
      }
    }
  }

  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({ index: i }) => N[i!]);
  const collisionForce = d3.forceCollide((_, i) => R[i]);
  forceNode.strength(-1000);
  forceLink.strength(0.13);

  const svg = d3
    .create("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("viewBox", [-w / 2, -h / 2, w, h])
    .attr("style", "max-width: 100%");

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("collide", collisionForce)
    .force("center", d3.forceCenter())
    .on("tick", ticked);

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("id", ({ index: i }) => mappedHackDataArray[i!]) // for NodeClickModel
    .attr("r", ({ index: i }) => R[i!])
    .attr("fill", ({ index: i }) => C[i!]) // highest intensity emotion color
    .call(drag(simulation) as any)
    .on("click", (e) => handleNodeClick(e));

  function intern(value: { valueOf: () => any } | null) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function ticked() {
    node
      .attr("cx", (d, i) =>
        // x axis boundary conditions
        d.x! < -w / 2 + R[i]
          ? -w / 2 + R[i]
          : d.x! > w / 2 - R[i]
          ? w / 2 - R[i]
          : d.x!
      )
      .attr("cy", (d, i) =>
        // y axis boundary conditions
        d.y! < -h / 2 + R[i]
          ? -h / 2 + R[i]
          : d.y! > h / 2 - R[i]
          ? h / 2 - R[i]
          : d.y!
      );
  }

  function handleOtherNodes(request?: string) {
    nodes.forEach((n) => {
      n.fx = request ? n.x : null;
      n.fy = request ? n.y : null;
    });
  }

  function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      handleOtherNodes("fixOtherNodes");
      setShowNodeClickModal(false)
    }

    function dragged(event: any) {
      handleOtherNodes();
      event.subject.fx = event.sourceEvent.clientX - w / 2;
      event.subject.fy = event.sourceEvent.clientY - h / 2 - Misc.HEADER_HEIGHT;
      setShowNodeClickModal(false)
    }

    function dragended(event: any) {
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
