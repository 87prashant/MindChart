import * as d3 from "d3";
// import { BaseType } from "d3";
import React, {useEffect, useRef} from 'react'
import miserable from "../miserable.json";

export interface miserableType {
  nodes: nodeType[];
  links: linkType[];
}

interface nodeType {
  id: string;
  group: number;
}

interface linkType {
  source: string;
  target: string;
  value: number;
}

interface secondArgumentType {
  // container: BaseType
  nodeId?: (d: nodeType) => string;
  nodeGroup?: (d: nodeType) => number;
  nodeTitle?: ({ id, group }: nodeType) => string;
  nodeFill?: string;
  nodeStroke?: string;
  nodeStrokeWidth?: number;
  nodeStrokeOpacity?: number;
  nodeRadius?: number;
  nodeStrength?: number;
  linkSource?: ({ source }: linkType) => string;
  linkTarget?: ({ target }: linkType) => string;
  linkStroke?: string;
  linkStrokeOpacity?: number;
  linkStrokeWidth?: number;
  linkStrokeLinecap?: string;
  linkStrength?: number;
  colors?: readonly string[];
  width?: number;
  height?: number;
  invalidation?: any;
}

// const miserables = miserable;
// const chart = ForceGraph(miserables, {});
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
export default function ForceGraph() {
  const props= miserable
  const secondArgument = {
    // container,
    nodeId: (d) => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup: (d) => d.group, // given d in nodes, returns an (ordinal) value for color
    // nodeGroups: [], // an array of ordinal values representing the node groups
    nodeTitle: (d) => `${d.id}\n${d.group}`, // given d in nodes, a title string
    nodeFill: "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke: "#fff", // node stroke color
    nodeStrokeWidth: 1.5, // node stroke width, in pixels
    nodeStrokeOpacity: 1, // node stroke opacity
    nodeRadius: 5, // node radius, in pixels
    nodeStrength: undefined,
    linkSource: ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget: ({ target }) => target, // given d in links, returns a node identifier string
    linkStroke: "#999", // link stroke color
    linkStrokeOpacity: 0.6, // link stroke opacity
    linkStrokeWidth: 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap: "round", // link stroke linecap
    linkStrength: undefined,
    colors: d3.schemeTableau10, // an array of color strings, for the node groups
    width: 640, // outer width, in pixels
    height: 400, // outer height, in pixels
    invalidation: undefined, // when this promise resolves, stop the simulation
  } as secondArgumentType
  const {nodeId, nodeGroup, nodeTitle, nodeFill, nodeStroke, nodeStrokeWidth, nodeStrokeOpacity, nodeRadius, nodeStrength, linkSource, linkTarget, linkStroke, linkStrokeOpacity, linkStrokeWidth, linkStrokeLinecap, linkStrength, colors, width, height, invalidation, } = secondArgument
  const containerRef = useRef(null)
  let nodeGroups: any = undefined
  useEffect(() => {
    const container = containerRef.current
    const { nodes, links } = props;
    // Compute values.
    const N: number[] = d3.map(nodes, nodeId!).map(intern);
    const LS = d3.map(links, linkSource!).map(intern);
    const LT = d3.map(links, linkTarget!).map(intern);
    // if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W =
      typeof linkStrokeWidth !== "function"
        ? null
        : d3.map(links, linkStrokeWidth);
    const L: number[] | null =
      typeof linkStroke !== "function" ? null : d3.map(links, linkStroke); // not sure
  
    // Replace the input nodes and links with mutable objects for the simulation.
    const newNodes: d3.SimulationNodeDatum[] = d3.map(nodes, (_, i) => ({
      index: N[i],
    })); //not sure
    const newLinks = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));
  
    // Compute default domains.
    // let here
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G)
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups!, colors!); // not sure
  
    // Construct the forces.
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(newLinks).id(({ index: i }) => N[i!]); // not sure
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
  
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width!)
      .attr("height", height!)
      .attr("viewBox", [-width! / 2, -height! / 2, width!, height!])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    const link = svg
      .append("g")
      .attr("stroke", typeof linkStroke !== "function" ? linkStroke! : null)
      .attr("stroke-opacity", linkStrokeOpacity!)
      .attr("stroke-width", linkStrokeWidth!)
      .attr("stroke-linecap", linkStrokeLinecap!)
      .selectAll("line")
      .data(newLinks)
      .join("line");
  
    const simulation = d3
      .forceSimulation(newNodes)
      .force("link", forceLink)
      .force("charge", forceNode)
      .force("center", d3.forceCenter())
      .on("tick", ticked);
  
    const node = svg
      .append("g")
      .attr("fill", nodeFill!)
      .attr("stroke", nodeStroke!)
      .attr("stroke-opacity", nodeStrokeOpacity!)
      .attr("stroke-width", nodeStrokeWidth!)
      .selectAll("circle")
      .data(newNodes)
      .join("circle")
      .attr("r", nodeRadius!)
      .call(drag(simulation) as any); //not sure
  
    if (W) link.attr("stroke-width", ({ source: i }) => W[i] as any); // not sure
    if (L) link.attr("stroke", ({ source: i }) => L[i]); // not sure
    if (G) node.attr("fill", ({ index: i }) => color!(G[i!])); // not sure
    if (T) node.append("title").text(({ index: i }) => T[i!]); // not sure
    if (invalidation != null) invalidation.then(() => simulation.stop());
  
    function intern(value: { valueOf: () => any } | null) {
      // not sure
      return value !== null && typeof value === "object"
        ? value.valueOf()
        : value;
    }
  
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
  
      node
        .attr("cx", (d) => d.x!) // not sure
        .attr("cy", (d) => d.y!); // not sure
    }
  
    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      //not sure
      function dragstarted(event: {
        active: any;
        subject: { fx: any; x: any; fy: any; y: any };
      }) {
        //not sure
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
  
      function dragged(event: { subject: { fx: any; fy: any }; x: any; y: any }) {
        //not sure
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
  
      function dragended(event: {
        active: any;
        subject: { fx: null; fy: null };
      }) {
        //not sure
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
    // const output = Object.assign(svg.node()!, { scales: { color } });
    // return output; // not sure
  }, [])

  return (
    <div ref={containerRef}></div>
  )
}
