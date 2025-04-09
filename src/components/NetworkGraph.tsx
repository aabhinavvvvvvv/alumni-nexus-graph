
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface NetworkGraphProps {
  data: GraphData;
  selectedNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
}

export default function NetworkGraph({ data, selectedNodeId, onNodeClick }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  
  // Function to update the graph
  const updateGraph = () => {
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
      .scaleExtent([0.2, 5]) // Allow more zoom levels
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
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
      return sourceId && targetId && nodeIds.has(sourceId as string) && nodeIds.has(targetId as string);
    });

    const simulation = d3.forceSimulation(nodesCopy)
      .force("link", d3.forceLink<GraphNode, GraphLink>(validLinks)
        .id(d => d.id)
        .distance(120) // Increase distance between nodes
      )
      .force("charge", d3.forceManyBody().strength(-350)) // Stronger repulsion force
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: GraphNode) => (d.size || 5) * 2));

    // Save the simulation for later use
    simulationRef.current = simulation;

    // Draw links with curved paths
    const link = g.append("g")
      .selectAll("path")
      .data(validLinks)
      .enter()
      .append("path")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5) // Thicker lines
      .attr("fill", "none");

    // Add arrowhead markers for directed links
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // Position slightly away from the target node
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Apply the marker to all links
    link.attr("marker-end", "url(#end)");

    // Add link labels
    const linkLabel = g.append("g")
      .selectAll("text")
      .data(validLinks)
      .enter()
      .append("text")
      .text(d => d.label || d.type || "")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("dy", -3)
      .attr("fill", "#555")
      .attr("opacity", 0) // Start hidden
      .attr("class", "link-label")
      .on("mouseover", function() {
        d3.select(this).attr("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", showLabels ? 0.7 : 0);
      });

    // Draw nodes with different colors based on type
    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodesCopy)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .attr("cursor", "pointer")
      .call(drag(simulation) as any);

    // Add circle for each node
    nodeGroup.append("circle")
      .attr("r", d => (d.size || 5) * 1.2) // Slightly larger nodes
      .attr("class", d => `node-${d.type}`)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("fill", d => {
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
      nodeGroup.attr("opacity", d => d.id === selectedNodeId ? 1 : 0.3);
      link.attr("opacity", d => {
        const sourceId = typeof d.source === 'object' && d.source ? d.source.id : d.source;
        const targetId = typeof d.target === 'object' && d.target ? d.target.id : d.target;
        return (sourceId === selectedNodeId) || (targetId === selectedNodeId) ? 1 : 0.1;
      });
    } else {
      nodeGroup.attr("opacity", 1);
      link.attr("opacity", 0.6);
    }

    // Add labels to nodes
    const label = nodeGroup.append("text")
      .text(d => d.label)
      .attr("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", d => -(d.size || 5) - 8)
      .attr("font-weight", d => d.id === selectedNodeId ? "bold" : "normal")
      .attr("opacity", d => showLabels || d.id === selectedNodeId ? 0.9 : 0);

    // Add tooltips
    nodeGroup.append("title")
      .text(d => `${d.label} (${d.type})`);

    // Add click handler
    nodeGroup.on("click", (event, d) => {
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
      // Update link paths - using curved paths for better visualization
      link.attr("d", (d: any) => {
        const sourceX = d.source.x || 0;
        const sourceY = d.source.y || 0;
        const targetX = d.target.x || 0;
        const targetY = d.target.y || 0;
        
        // Create a slight curve for all links
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dr = Math.sqrt(dx * dx + dy * dy) * 2;
        
        return `M${sourceX},${sourceY}A${dr},${dr} 0 0,1 ${targetX},${targetY}`;
      });

      // Update node positions
      nodeGroup.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
        
      // Update link label positions
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
            ? (source.y + target.y) / 2 - 10 : 0;
        });
    });
  };

  // Create drag behavior function
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

  // Handle zoom controls
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const currentZoom = d3.zoomTransform(svg.node() as any);
    svg.transition().duration(300).call(
      (d3.zoom<SVGSVGElement, unknown>() as any).transform,
      d3.zoomIdentity.translate(currentZoom.x, currentZoom.y).scale(currentZoom.k * 1.3)
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const currentZoom = d3.zoomTransform(svg.node() as any);
    svg.transition().duration(300).call(
      (d3.zoom<SVGSVGElement, unknown>() as any).transform,
      d3.zoomIdentity.translate(currentZoom.x, currentZoom.y).scale(currentZoom.k / 1.3)
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(
      (d3.zoom<SVGSVGElement, unknown>() as any).transform,
      d3.zoomIdentity
    );
    updateGraph(); // Re-render the graph
  };

  const toggleLabels = () => {
    setShowLabels(!showLabels);
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll(".node-group text")
        .transition()
        .duration(300)
        .attr("opacity", !showLabels ? 0.9 : 0);
      
      svg.selectAll(".link-label")
        .transition()
        .duration(300)
        .attr("opacity", !showLabels ? 0.7 : 0);
    }
  };

  // Update the graph when data or selectedNodeId changes
  useEffect(() => {
    updateGraph();
    
    // Cleanup function
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data, selectedNodeId, onNodeClick]);

  return (
    <Card className="w-full h-full bg-white/50 dark:bg-card/50 backdrop-blur-sm border overflow-hidden flex flex-col">
      <div className="p-2 flex gap-2 justify-end bg-muted/30">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4 mr-1" />
          Zoom In
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4 mr-1" />
          Zoom Out
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleLabels}
        >
          {showLabels ? "Hide Labels" : "Show Labels"}
        </Button>
      </div>
      <div className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full" />
        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#9b87f5]"></span>
            <span>Alumni</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#0EA5E9]"></span>
            <span>Department</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#F97316]"></span>
            <span>Company</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
            <span>Skill</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D946EF]"></span>
            <span>Event</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
