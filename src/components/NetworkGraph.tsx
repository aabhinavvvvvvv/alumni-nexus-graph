
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '@/data/mockData';

interface NetworkGraphProps {
  data: GraphData;
  selectedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
}

export default function NetworkGraph({ data, selectedNodeId, onNodeClick }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear any existing graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Get the dimensions of the container
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Add a group for the graph
    const g = svg.append("g");

    // Create a zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // Apply the zoom behavior
    svg.call(zoom);

    // Create a force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(data.links)
        .id(d => d.id)
        .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.size * 2));

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Add link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(data.links)
      .enter()
      .append("text")
      .text(d => d.label || "")
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("dy", -3)
      .attr("fill", "#666")
      .attr("opacity", 0) // Start hidden
      .on("mouseover", function() {
        d3.select(this).attr("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0);
      });

    // Draw nodes with different colors based on type
    const node = g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", d => d.size || 5)
      .attr("class", d => `node-${d.type}`)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .call(drag(simulation) as any);

    // Add a highlight effect for the selected node
    if (selectedNodeId) {
      node.attr("opacity", d => d.id === selectedNodeId ? 1 : 0.3);
      link.attr("opacity", d => 
        d.source === selectedNodeId || 
        (typeof d.source === 'object' && (d.source as GraphNode).id === selectedNodeId) ||
        d.target === selectedNodeId || 
        (typeof d.target === 'object' && (d.target as GraphNode).id === selectedNodeId) 
          ? 1 : 0.1);
    } else {
      node.attr("opacity", 1);
      link.attr("opacity", 0.6);
    }

    // Add labels to nodes
    const label = g.append("g")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text(d => d.label)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dy", -10)
      .attr("opacity", d => d.id === selectedNodeId ? 1 : 0.7);

    // Add tooltips
    node.append("title")
      .text(d => `${d.label} (${d.type})`);

    // Add click handler
    node.on("click", (event, d) => {
      if (onNodeClick) {
        event.stopPropagation();
        onNodeClick(d.id);
      }
    });

    // Reset selection when clicking on the background
    svg.on("click", () => {
      if (onNodeClick) {
        onNodeClick("");
      }
    });

    // Define tick function to update positions
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      label
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
        
      linkLabel
        .attr("x", d => ((d.source as any).x + (d.target as any).x) / 2)
        .attr("y", d => ((d.source as any).y + (d.target as any).y) / 2);
    });

    // Drag function
    function drag(simulation: d3.Simulation<GraphNode, GraphLink>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [data, selectedNodeId, onNodeClick]);

  return (
    <Card className="w-full h-[calc(100vh-16rem)] bg-white/50 dark:bg-card/50 backdrop-blur-sm border overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </Card>
  );
}
