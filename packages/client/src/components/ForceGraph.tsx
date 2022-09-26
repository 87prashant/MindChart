import * as d3 from "d3";
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

interface factorsType {
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

interface Props {
  container: HTMLElement;
  w: number;
  h: number;
}
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
export default function ForceGraph(props: Props) {
  const { container, w, h } = props;
  const factors = {
    nodeId: (d) => d.id,
    nodeGroup: (d) => d.group,
    nodeTitle: (d) => `${d.id}\n${d.group}`,
    nodeFill: "currentColor",
    nodeStroke: "#fff",
    nodeStrokeWidth: 1.5,
    nodeStrokeOpacity: 1,
    nodeRadius: 5,
    nodeStrength: undefined,
    linkSource: ({ source }) => source,
    linkTarget: ({ target }) => target,
    linkStroke: "#999",
    linkStrokeOpacity: 0.6,
    linkStrokeWidth: 1.5,
    linkStrokeLinecap: "round",
    linkStrength: undefined,
    colors: d3.schemeTableau10,
    width: w,
    height: h,
    invalidation: undefined,
  } as factorsType;
  const {
    nodeId,
    nodeGroup,
    nodeTitle,
    nodeFill,
    nodeStroke,
    nodeStrokeWidth,
    nodeStrokeOpacity,
    nodeRadius,
    nodeStrength,
    linkSource,
    linkTarget,
    linkStroke,
    linkStrokeOpacity,
    linkStrokeWidth,
    linkStrokeLinecap,
    linkStrength,
    colors,
    width,
    height,
    invalidation,
  } = factors;
  let nodeGroups: any = undefined;
  const { nodes, links } = miserable;
  const N: number[] = d3.map(nodes, nodeId!).map(intern);
  const LS = d3.map(links, linkSource!).map(intern);
  const LT = d3.map(links, linkTarget!).map(intern);
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W =
    typeof linkStrokeWidth !== "function"
      ? null
      : d3.map(links, linkStrokeWidth);
  const L: number[] | null =
    typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
  const newNodes: d3.SimulationNodeDatum[] = d3.map(nodes, (_, i) => ({
    index: N[i],
  }));
  const newLinks = d3.map(links, (_, i) => ({
    source: LS[i],
    target: LT[i],
  }));
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  const color =
    nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups!, colors!);
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(newLinks).id(({ index: i }) => N[i!]);
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
    .call(drag(simulation) as any);

  if (W) link.attr("stroke-width", ({ source: i }) => W[i] as any);
  if (L) link.attr("stroke", ({ source: i }) => L[i]);
  if (G) node.attr("fill", ({ index: i }) => color!(G[i!]));
  if (T) node.append("title").text(({ index: i }) => T[i!]);
  if (invalidation != null) invalidation.then(() => simulation.stop());

  function intern(value: { valueOf: () => any } | null) {
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
}
