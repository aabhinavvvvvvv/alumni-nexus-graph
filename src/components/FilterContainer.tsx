import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Person, Department, Company, Skill, Event } from '@/data/types';
import NetworkGraph from './NetworkGraph';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { 
  getAlumni, 
  getDepartments, 
  getCompanies, 
  getSkills, 
  getEvents, 
  getGraphData 
} from '@/services/api';
import { toast } from "sonner";

interface FilterContainerProps {
  onFilteredResults: (results: Person[]) => void;
  showGraph: boolean;
  searchTerm: string;
}

export default function FilterContainer({ onFilteredResults, showGraph, searchTerm }: FilterContainerProps) {
  const currentYear = new Date().getFullYear();
  const [filters, setFilters] = useState({
    name: '',
    gradYearRange: [currentYear - 20, currentYear],
    departments: [] as string[],
    companies: [] as string[],
    skills: [] as string[],
    events: [] as string[],
  });
  const [graphData, setGraphData: React.Dispatch<React.SetStateAction<{ nodes: any[]; links: any[]; }>> = useState({ nodes: [], links: [] });

  // Fetch data from backend
  const { data: alumniData, isLoading: alumniLoading } = useQuery({
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

  // Apply search term from header
  useEffect(() => {
    if (searchTerm) {
      setFilters(prev => ({...prev, name: searchTerm}));
    }
  }, [searchTerm]);

  // Update graph data from API
  useEffect(() => {
    if (graphDataFromAPI) {
      setGraphData(graphDataFromAPI);
    }
  }, [graphDataFromAPI]);
  
  // Filter alumni based on criteria
  useEffect(() => {
    if (!alumniData) return;
    
    const filtered = alumniData.filter((person: Person) => {
      // Filter by name
      if (filters.name && !person.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // Filter by graduation year
      if (
        person.graduationYear < filters.gradYearRange[0] || 
        person.graduationYear > filters.gradYearRange[1]
      ) {
        return false;
      }
      
      // Filter by departments
      if (filters.departments.length > 0 && !filters.departments.includes(person.department)) {
        return false;
      }
      
      // Filter by companies
      if (filters.companies.length > 0 && !filters.companies.includes(person.company)) {
        return false;
      }
      
      // Filter by skills
      if (filters.skills.length > 0) {
        const hasSkill = filters.skills.some(skill => person.skills && person.skills.includes(skill));
        if (!hasSkill) return false;
      }
      
      // Filter by events
      if (filters.events.length > 0) {
        const hasEvent = filters.events.some(event => person.events && person.events.includes(event));
        if (!hasEvent) return false;
      }
      
      return true;
    });
    
    onFilteredResults(filtered);
    
    // Update graph data based on filtered alumni
    if (showGraph && graphDataFromAPI) {
      const filteredIds = new Set(filtered.map(person => person.id));
      const filteredData = { ...graphDataFromAPI };
      
      filteredData.nodes = filteredData.nodes.filter(node => {
        if (node.type === 'alumni') {
          return filteredIds.has(node.id);
        }
        return true;
      });
      
      filteredData.links = filteredData.links.filter(link => {
        const sourceId = typeof link.source === 'object' && link.source ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' && link.target ? link.target.id : link.target;
        
        if (!sourceId || !targetId) return false;
        
        if (link.type === 'WORKS_AT' || link.type === 'STUDIED_IN' || 
            link.type === 'HAS_SKILL' || link.type === 'ATTENDED') {
          return filteredIds.has(sourceId);
        }
        return true;
      });
      
      setGraphData(filteredData);
    }
  }, [filters, showGraph, onFilteredResults, alumniData, graphDataFromAPI]);
  
  const handleGradYearChange = (value: number[]) => {
    setFilters(prev => ({...prev, gradYearRange: value}));
  };
  
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
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({...prev, name: e.target.value}));
  };
  
  const handleClearFilters = () => {
    setFilters({
      name: '',
      gradYearRange: [currentYear - 20, currentYear],
      departments: [],
      companies: [],
      skills: [],
      events: []
    });
  };
  
  // Create badges for active filters
  const activeFilterBadges = () => {
    const badges = [];
    
    if (filters.name) {
      badges.push(
        <Badge key="name" variant="outline" className="bg-primary/10">
          Name: {filters.name}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => setFilters(prev => ({...prev, name: ''}))} 
          />
        </Badge>
      );
    }
    
    if (filters.gradYearRange[0] !== currentYear - 20 || filters.gradYearRange[1] !== currentYear) {
      badges.push(
        <Badge key="year" variant="outline" className="bg-primary/10">
          Grad Year: {filters.gradYearRange[0]} - {filters.gradYearRange[1]}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => setFilters(prev => ({...prev, gradYearRange: [currentYear - 20, currentYear]}))} 
          />
        </Badge>
      );
    }
    
    filters.departments.forEach(deptId => {
      const dept = departmentsData?.find(d => d.id === deptId);
      if (dept) {
        badges.push(
          <Badge key={`dept-${deptId}`} variant="outline" className="bg-blue-500/10">
            Dept: {dept.name}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange('departments', deptId)} 
            />
          </Badge>
        );
      }
    });
    
    filters.companies.forEach(compId => {
      const comp = companiesData?.find(c => c.id === compId);
      if (comp) {
        badges.push(
          <Badge key={`comp-${compId}`} variant="outline" className="bg-orange-500/10">
            Company: {comp.name}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange('companies', compId)} 
            />
          </Badge>
        );
      }
    });
    
    filters.skills.forEach(skillId => {
      const skill = skillsData?.find(s => s.id === skillId);
      if (skill) {
        badges.push(
          <Badge key={`skill-${skillId}`} variant="outline" className="bg-purple-500/10">
            Skill: {skill.name}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange('skills', skillId)} 
            />
          </Badge>
        );
      }
    });
    
    filters.events.forEach(eventId => {
      const event = eventsData?.find(e => e.id === eventId);
      if (event) {
        badges.push(
          <Badge key={`event-${eventId}`} variant="outline" className="bg-pink-500/10">
            Event: {event.name}
            <X 
              className="ml-1 h-3 w-3 cursor-pointer" 
              onClick={() => handleFilterChange('events', eventId)} 
            />
          </Badge>
        );
      }
    });
    
    return badges;
  };
  
  return (
    <div className="space-y-6">
      {/* Active filters display */}
      {activeFilterBadges().length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Active Filters:</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-xs h-8"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilterBadges()}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main filters */}
        <Card className="col-span-1 p-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name-search">Search by Name</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name-search"
                  type="text"
                  placeholder="Search alumni..."
                  value={filters.name}
                  onChange={handleNameChange}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Graduation Year Range</Label>
              <div className="pt-4 px-2">
                <Slider
                  min={currentYear - 50}
                  max={currentYear}
                  step={1}
                  value={filters.gradYearRange}
                  onValueChange={handleGradYearChange}
                  className="mb-6"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.gradYearRange[0]}</span>
                  <span>{filters.gradYearRange[1]}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" /> 
                Filter Categories
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Departments</Label>
                  <ScrollArea className="h-28 rounded-md border p-2">
                    <div className="space-y-2">
                      {departmentsData?.map((dept) => (
                        <div key={dept.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`dept-${dept.id}`} 
                            checked={filters.departments.includes(dept.id)}
                            onCheckedChange={() => handleFilterChange('departments', dept.id)}
                          />
                          <label 
                            htmlFor={`dept-${dept.id}`} 
                            className="text-sm cursor-pointer"
                          >
                            {dept.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Companies</Label>
                  <ScrollArea className="h-28 rounded-md border p-2">
                    <div className="space-y-2">
                      {companiesData?.map((company) => (
                        <div key={company.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`company-${company.id}`} 
                            checked={filters.companies.includes(company.id)}
                            onCheckedChange={() => handleFilterChange('companies', company.id)}
                          />
                          <label 
                            htmlFor={`company-${company.id}`} 
                            className="text-sm cursor-pointer"
                          >
                            {company.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Skills</Label>
                  <ScrollArea className="h-28 rounded-md border p-2">
                    <div className="space-y-2">
                      {skillsData?.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`skill-${skill.id}`} 
                            checked={filters.skills.includes(skill.id)}
                            onCheckedChange={() => handleFilterChange('skills', skill.id)}
                          />
                          <label 
                            htmlFor={`skill-${skill.id}`} 
                            className="text-sm cursor-pointer"
                          >
                            {skill.name}
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({skill.category})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Events</Label>
                  <ScrollArea className="h-28 rounded-md border p-2">
                    <div className="space-y-2">
                      {eventsData?.map((event) => (
                        <div key={event.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`event-${event.id}`} 
                            checked={filters.events.includes(event.id)}
                            onCheckedChange={() => handleFilterChange('events', event.id)}
                          />
                          <label 
                            htmlFor={`event-${event.id}`} 
                            className="text-sm cursor-pointer"
                          >
                            {event.name}
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({event.type})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Graph visualization or results area */}
        <div className="col-span-1 md:col-span-2">
          {showGraph ? (
            <Card className="w-full h-[500px] overflow-hidden">
              <NetworkGraph 
                data={graphData} 
                selectedNodeId={null}
                onNodeClick={() => {}}
              />
            </Card>
          ) : (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Graph visualization is hidden</h3>
              <p className="text-muted-foreground">
                Click the "Show Graph Visualization" button to see a network graph of the filtered alumni and their connections.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
