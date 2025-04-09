
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
    if (!svgRef.current) return;

    // Clear any existing graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Check if we have valid data to render
    if (!data.nodes || data.nodes.length === 0) {
      // Display a message when no data is available
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);
        
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("No data to display. Try adjusting your filters.");
        
      return;
    }

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

    // Create a force simulation with a deep copy of the nodes to avoid modification of props
    const nodesCopy = data.nodes.map(node => ({...node})); 
    const linksCopy = data.links.map(link => ({...link}));

    // Make sure all nodes have ids and all links reference nodes that exist
    const nodeIds = new Set(nodesCopy.map(node => node.id));
    const validLinks = linksCopy.filter(link => {
      const sourceId = typeof link.source === 'object' && link.source ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' && link.target ? link.target.id : link.target;
      return sourceId && targetId && nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    const simulation = d3.forceSimulation(nodesCopy)
      .force("link", d3.forceLink<GraphNode, GraphLink>(validLinks)
        .id(d => d.id)
        .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.size * 2));

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(validLinks)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Add link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(validLinks)
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
      .data(nodesCopy)
      .enter()
      .append("circle")
      .attr("r", d => d.size || 5)
      .attr("class", d => `node-${d.type}`)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .call(drag(simulation) as any);

    // Add node colors based on type
    node.attr("fill", d => {
      switch (d.type) {
        case 'alumni': return "#9b87f5"; // Primary Purple
        case 'department': return "#0EA5E9"; // Ocean Blue
        case 'company': return "#F97316"; // Bright Orange
        case 'skill': return "#8B5CF6"; // Vivid Purple
        case 'event': return "#D946EF"; // Magenta Pink
        default: return "#8E9196"; // Neutral Gray
      }
    });

    // Add a highlight effect for the selected node
    if (selectedNodeId) {
      node.attr("opacity", d => d.id === selectedNodeId ? 1 : 0.3);
      link.attr("opacity", d => {
        const sourceId = typeof d.source === 'object' && d.source ? d.source.id : d.source;
        const targetId = typeof d.target === 'object' && d.target ? d.target.id : d.target;
        return (sourceId && sourceId === selectedNodeId) || (targetId && targetId === selectedNodeId) ? 1 : 0.1;
      });
    } else {
      node.attr("opacity", 1);
      link.attr("opacity", 0.6);
    }

    // Add labels to nodes
    const label = g.append("g")
      .selectAll("text")
      .data(nodesCopy)
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
        .attr("x1", d => {
          const source = d.source as any;
          return source && typeof source.x === 'number' ? source.x : 0;
        })
        .attr("y1", d => {
          const source = d.source as any;
          return source && typeof source.y === 'number' ? source.y : 0;
        })
        .attr("x2", d => {
          const target = d.target as any;
          return target && typeof target.x === 'number' ? target.x : 0;
        })
        .attr("y2", d => {
          const target = d.target as any;
          return target && typeof target.y === 'number' ? target.y : 0;
        });

      node
        .attr("cx", d => d.x !== undefined ? d.x : 0)
        .attr("cy", d => d.y !== undefined ? d.y : 0);

      label
        .attr("x", d => d.x !== undefined ? d.x : 0)
        .attr("y", d => d.y !== undefined ? d.y : 0);
        
      linkLabel
        .attr("x", d => {
          const source = d.source as any;
          const target = d.target as any;
          return source && target && typeof source.x === 'number' && typeof target.x === 'number' 
            ? (source.x + target.x) / 2 : 0;
        })
        .attr("y", d => {
          const source = d.source as any;
          const target = d.target as any;
          return source && target && typeof source.y === 'number' && typeof target.y === 'number'
            ? (source.y + target.y) / 2 : 0;
        });
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
    <Card className="w-full h-full bg-white/50 dark:bg-card/50 backdrop-blur-sm border overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </Card>
  );
}
