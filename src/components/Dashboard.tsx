
import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import AlumniCard from './AlumniCard';
import FilterPanel from './FilterPanel';
import { 
  generateGraphData, alumni, departments, companies, 
  skills, events, getEntityById, GraphData, Person,
  GraphNode, GraphLink
} from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
  sidebarOpen: boolean;
  activeFilter: string | null;
  searchTerm: string;
}

export default function Dashboard({ sidebarOpen, activeFilter, searchTerm }: DashboardProps) {
  const [graphData, setGraphData] = useState<GraphData>(generateGraphData());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<Person[]>([]);
  const [filters, setFilters] = useState({
    departments: [] as string[],
    companies: [] as string[],
    skills: [] as string[],
    events: [] as string[]
  });

  // Apply active filter from sidebar
  useEffect(() => {
    let filteredData = generateGraphData();
    
    if (activeFilter) {
      switch(activeFilter) {
        case 'alumni':
          filteredData = {
            nodes: filteredData.nodes.filter(node => node.type === 'alumni'),
            links: []
          };
          break;
        case 'companies':
          filteredData = {
            nodes: filteredData.nodes.filter(node => node.type === 'company'),
            links: filteredData.links.filter(link => link.type === 'WORKS_AT')
          };
          break;
        case 'departments':
          filteredData = {
            nodes: filteredData.nodes.filter(node => node.type === 'department'),
            links: filteredData.links.filter(link => link.type === 'STUDIED_IN')
          };
          break;
        case 'skills':
          filteredData = {
            nodes: filteredData.nodes.filter(node => node.type === 'skill'),
            links: filteredData.links.filter(link => link.type === 'HAS_SKILL')
          };
          break;
        case 'events':
          filteredData = {
            nodes: filteredData.nodes.filter(node => node.type === 'event'),
            links: filteredData.links.filter(link => link.type === 'ATTENDED')
          };
          break;
      }
    }
    
    // Apply search term if provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = {
        nodes: filteredData.nodes.filter(node => 
          node.label.toLowerCase().includes(searchLower)
        ),
        links: filteredData.links.filter(link => {
          const sourceNode = typeof link.source === 'string' 
            ? filteredData.nodes.find(n => n.id === link.source) 
            : link.source;
          const targetNode = typeof link.target === 'string'
            ? filteredData.nodes.find(n => n.id === link.target)
            : link.target;
            
          if (!sourceNode || !targetNode) return false;
          
          const sourceLabel = typeof sourceNode === 'object' ? sourceNode.label : '';
          const targetLabel = typeof targetNode === 'object' ? targetNode.label : '';
          
          return (
            sourceLabel.toLowerCase().includes(searchLower) || 
            targetLabel.toLowerCase().includes(searchLower)
          );
        })
      };
    }
    
    // Apply detailed filters
    if (filters.departments.length || filters.companies.length || 
        filters.skills.length || filters.events.length) {
      // Filter nodes
      const keepNodes = new Set<string>();
      
      // Keep directly filtered nodes
      filteredData.nodes.forEach(node => {
        if (
          (node.type === 'department' && filters.departments.includes(node.id)) ||
          (node.type === 'company' && filters.companies.includes(node.id)) ||
          (node.type === 'skill' && filters.skills.includes(node.id)) ||
          (node.type === 'event' && filters.events.includes(node.id))
        ) {
          keepNodes.add(node.id);
        }
      });
      
      // Find connected alumni nodes
      filteredData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (keepNodes.has(sourceId)) keepNodes.add(targetId);
        if (keepNodes.has(targetId)) keepNodes.add(sourceId);
      });
      
      // Apply filters
      filteredData = {
        nodes: filteredData.nodes.filter(node => keepNodes.has(node.id)),
        links: filteredData.links.filter(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return keepNodes.has(sourceId) && keepNodes.has(targetId);
        })
      };
    }
    
    setGraphData(filteredData);
  }, [activeFilter, searchTerm, filters]);

  // Handle node selection
  useEffect(() => {
    if (selectedNodeId) {
      // Find all alumni connected to this node
      const relevantAlumni: Person[] = [];
      const graphAlumni = alumni.filter(a => {
        // Direct selection of an alumni
        if (a.id === selectedNodeId) {
          relevantAlumni.push(a);
          return true;
        }
        
        // Selection of a connected entity
        if (
          (a.department === selectedNodeId) ||
          (a.company === selectedNodeId) ||
          (a.skills.includes(selectedNodeId)) ||
          (a.events.includes(selectedNodeId))
        ) {
          relevantAlumni.push(a);
          return true;
        }
        
        return false;
      });
      
      setSelectedAlumni(relevantAlumni);
    } else {
      setSelectedAlumni([]);
    }
  }, [selectedNodeId]);

  const handleFilterChange = (type: 'departments' | 'companies' | 'skills' | 'events', id: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[type].includes(id)) {
        newFilters[type] = newFilters[type].filter(item => item !== id);
      } else {
        newFilters[type] = [...newFilters[type], id];
      }
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      departments: [],
      companies: [],
      skills: [],
      events: []
    });
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId || null);
  };

  return (
    <div className={`flex flex-col md:flex-row h-[calc(100vh-4rem)] transition-all duration-300 ${
      sidebarOpen ? 'ml-64' : 'ml-16'
    } p-4 gap-4`}>
      <div className="w-full md:w-3/4 h-full flex flex-col gap-4">
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="graph">Network Graph</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="graph" className="w-full h-full">
            <NetworkGraph 
              data={graphData} 
              selectedNodeId={selectedNodeId} 
              onNodeClick={handleNodeClick} 
            />
          </TabsContent>
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alumni.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companies.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departments.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedAlumni.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Selected Alumni</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedAlumni.map(person => (
                <AlumniCard 
                  key={person.id} 
                  alumni={person}
                  department={getEntityById(departments, person.department)}
                  company={getEntityById(companies, person.company)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-full md:w-1/4 h-full">
        <FilterPanel
          departments={departments}
          companies={companies}
          skills={skills}
          events={events}
          selectedFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
}
