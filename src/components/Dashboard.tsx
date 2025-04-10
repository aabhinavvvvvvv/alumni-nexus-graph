import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import AlumniCard from './AlumniCard';
import FilterPanel from './FilterPanel';
import { 
  Person, Department, Company, GraphData, GraphNode, GraphLink
} from '@/data/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { 
  getAlumni, 
  getDepartments, 
  getCompanies, 
  getSkills, 
  getEvents, 
  getGraphData,
  getAlumniByDepartment,
  getAlumniByCompany,
  getAlumniBySkill,
  getAlumniByEvent
} from '@/services/api';
import { toast } from "sonner";

interface DashboardProps {
  sidebarOpen: boolean;
  activeFilter: string | null;
  searchTerm: string;
}

export default function Dashboard({ sidebarOpen, activeFilter, searchTerm }: DashboardProps) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<Person[]>([]);
  const [filters, setFilters] = useState({
    departments: [] as string[],
    companies: [] as string[],
    skills: [] as string[],
    events: [] as string[]
  });

  const { data: alumniData, isLoading: alumniLoading, error: alumniError } = useQuery({
    queryKey: ['alumni'],
    queryFn: getAlumni
  });

  const { data: departmentsData, isLoading: departmentsLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments
  });

  const { data: companiesData, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  });

  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });

  const { data: graphDataFromAPI, isLoading: graphLoading } = useQuery({
    queryKey: ['graphData'],
    queryFn: getGraphData
  });

  const isLoading = alumniLoading || departmentsLoading || companiesLoading || skillsLoading || eventsLoading || graphLoading;

  useEffect(() => {
    if (graphDataFromAPI) {
      setGraphData(graphDataFromAPI);
    }
  }, [graphDataFromAPI]);

  useEffect(() => {
    if (alumniError) {
      toast.error("Failed to load data from backend. Please check your connection.");
    }
  }, [alumniError]);

  useEffect(() => {
    if (!graphDataFromAPI) return;
    
    let filteredData = { ...graphDataFromAPI };
    
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
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = {
        nodes: filteredData.nodes.filter(node => 
          node.label.toLowerCase().includes(searchLower)
        ),
        links: filteredData.links.filter(link => {
          const sourceId = typeof link.source === 'string' 
            ? link.source 
            : (link.source as GraphNode).id;
          const targetId = typeof link.target === 'string'
            ? link.target
            : (link.target as GraphNode).id;
            
          const sourceNode = filteredData.nodes.find(n => n.id === sourceId);
          const targetNode = filteredData.nodes.find(n => n.id === targetId);
            
          if (!sourceNode || !targetNode) return false;
          
          return (
            sourceNode.label.toLowerCase().includes(searchLower) || 
            targetNode.label.toLowerCase().includes(searchLower)
          );
        })
      };
    }
    
    if (filters.departments.length || filters.companies.length || 
        filters.skills.length || filters.events.length) {
      const keepNodes = new Set<string>();
      
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
      
      filteredData.links.forEach(link => {
        const sourceId = typeof link.source === 'object' && link.source ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' && link.target ? link.target.id : link.target;
        
        if (sourceId && keepNodes.has(sourceId)) keepNodes.add(targetId || '');
        if (targetId && keepNodes.has(targetId)) keepNodes.add(sourceId || '');
      });
      
      filteredData = {
        nodes: filteredData.nodes.filter(node => keepNodes.has(node.id)),
        links: filteredData.links.filter(link => {
          const sourceId = typeof link.source === 'string' 
            ? link.source 
            : ((link.source as GraphNode)?.id || '');
          const targetId = typeof link.target === 'string'
            ? link.target
            : ((link.target as GraphNode)?.id || '');
          
          return keepNodes.has(sourceId) && keepNodes.has(targetId);
        })
      };
    }
    
    setGraphData(filteredData);
  }, [activeFilter, searchTerm, filters, graphDataFromAPI]);

  const fetchAlumniForNode = async (nodeId: string, nodeType: string) => {
    try {
      let alumni: Person[] = [];
      
      switch (nodeType) {
        case 'alumni':
          const person = await getAlumniById(nodeId);
          alumni = [person];
          break;
        case 'department':
          alumni = await getAlumniByDepartment(nodeId);
          break;
        case 'company':
          alumni = await getAlumniByCompany(nodeId);
          break;
        case 'skill':
          alumni = await getAlumniBySkill(nodeId);
          break;
        case 'event':
          alumni = await getAlumniByEvent(nodeId);
          break;
        default:
          break;
      }
      
      return alumni;
    } catch (error) {
      console.error("Error fetching alumni for node:", error);
      toast.error("Failed to load alumni data for this selection.");
      return [];
    }
  };

  useEffect(() => {
    if (selectedNodeId) {
      const selectedNode = graphData.nodes.find(node => node.id === selectedNodeId);
      if (selectedNode) {
        fetchAlumniForNode(selectedNodeId, selectedNode.type)
          .then(alumni => setSelectedAlumni(alumni));
      }
    } else {
      setSelectedAlumni([]);
    }
  }, [selectedNodeId, graphData.nodes]);

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

  const getEntityById = <T extends { id: string }>(
    entities: T[] | undefined,
    id: string
  ): T | undefined => {
    return entities?.find(entity => entity.id === id);
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
            {isLoading ? (
              <Card className="w-full h-full flex items-center justify-center">
                <p>Loading graph data...</p>
              </Card>
            ) : (
              <NetworkGraph 
                data={graphData} 
                selectedNodeId={selectedNodeId} 
                onNodeClick={handleNodeClick} 
              />
            )}
          </TabsContent>
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alumniData?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companiesData?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departmentsData?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventsData?.length || 0}</div>
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
                  department={getEntityById(departmentsData, person.department)}
                  company={getEntityById(companiesData, person.company)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-full md:w-1/4 h-full">
        {isLoading ? (
          <Card className="w-full h-full p-4 flex items-center justify-center">
            <p>Loading filter data...</p>
          </Card>
        ) : (
          <FilterPanel
            departments={departmentsData || []}
            companies={companiesData || []}
            skills={skillsData || []}
            events={eventsData || []}
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
}
