<script lang="ts">
  import { onMount } from "svelte"
  import * as d3 from "d3"

  // --- Component Props ---
  export let nodes: { id: string; name: string; type: string }[]
  export let links: { source: string; target: string; type: string }[]
  export let currentElementId: string

  let svgElement: SVGSVGElement

  // --- Define specific types for D3 data ---
  interface GraphNode extends d3.SimulationNodeDatum {
    id: string
    name: string
    type: string
  }

  interface GraphLink {
    source: string | GraphNode
    target: string | GraphNode
    type: string
  }

  onMount(() => {
    if (!svgElement) return

    // --- STATIC COLOR THEME FOR THE GRAPH ---
    const colors = {
      background: "#f0f4f8",
      label: "#2d3748",
      labelHalo: "#ffffff",
      link: "#a0aec0",
      arrowhead: "#a0aec0",
      nodeDefault: "#63b3ed",
      nodeCurrent: "#f6ad55",
      nodeStroke: "#ffffff",
    }

    const width = svgElement.clientWidth
    const height = svgElement.clientHeight

    const simulationNodes: GraphNode[] = JSON.parse(JSON.stringify(nodes))
    const simulationLinks: GraphLink[] = JSON.parse(JSON.stringify(links))

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3
          .forceLink(simulationLinks)
          .id((d) => (d as GraphNode).id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const svg = d3.select(svgElement)
    svg.selectAll("*").remove()
    svg.style("background-color", colors.background)

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 23)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .style("fill", colors.arrowhead)

    const link = svg
      .append("g")
      .selectAll("line")
      .data(simulationLinks)
      .enter()
      .append("line")
      .style("stroke", colors.link)
      .style("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)")

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(simulationNodes)
      .enter()
      .append("circle")
      .attr("r", (d) => (d.id === currentElementId ? 18 : 12))
      .style("fill", (d) =>
        d.id === currentElementId ? colors.nodeCurrent : colors.nodeDefault,
      )
      .style("stroke", colors.nodeStroke)
      .style("stroke-width", 3)
      // --- LINTER FIX: Replaced `any` with specific GElement and Datum types ---
      .call(
        drag(simulation) as (
          selection: d3.Selection<
            SVGCircleElement,
            GraphNode,
            SVGGElement,
            unknown
          >,
        ) => void,
      )

    const label = svg
      .append("g")
      .selectAll("text")
      .data(simulationNodes)
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("x", 15)
      .attr("y", 5)
      .style("font-size", "14px")
      .style("fill", colors.label)
      .style("paint-order", "stroke")
      .style("stroke", colors.labelHalo)
      .style("stroke-width", "3px")
      .style("stroke-linecap", "butt")
      .style("stroke-linejoin", "miter")

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!)

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!)

      label.attr("transform", (d) => `translate(${d.x!},${d.y!})`)
    })

    function drag(simulation: d3.Simulation<GraphNode, undefined>) {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
        d: GraphNode,
      ) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(
        event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
        d: GraphNode,
      ) {
        d.fx = event.x
        d.fy = event.y
      }

      function dragended(
        event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
        d: GraphNode,
      ) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3
        .drag<SVGCircleElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    }
  })
</script>

<div class="w-full h-96 rounded-lg border border-base-300 overflow-hidden">
  <svg bind:this={svgElement} width="100%" height="100%"></svg>
</div>
