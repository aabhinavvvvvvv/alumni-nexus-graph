
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Department, Company, Skill, Event } from '@/data/mockData';

interface FilterPanelProps {
  departments: Department[];
  companies: Company[];
  skills: Skill[];
  events: Event[];
  selectedFilters: {
    departments: string[];
    companies: string[];
    skills: string[];
    events: string[];
  };
  onFilterChange: (type: 'departments' | 'companies' | 'skills' | 'events', id: string) => void;
  onClearFilters: () => void;
}

export default function FilterPanel({
  departments,
  companies,
  skills,
  events,
  selectedFilters,
  onFilterChange,
  onClearFilters
}: FilterPanelProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Departments</h4>
              <div className="space-y-1">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`dept-${dept.id}`} 
                      checked={selectedFilters.departments.includes(dept.id)}
                      onCheckedChange={() => onFilterChange('departments', dept.id)}
                    />
                    <Label htmlFor={`dept-${dept.id}`} className="text-sm">{dept.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Companies</h4>
              <div className="space-y-1">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`company-${company.id}`} 
                      checked={selectedFilters.companies.includes(company.id)}
                      onCheckedChange={() => onFilterChange('companies', company.id)}
                    />
                    <Label htmlFor={`company-${company.id}`} className="text-sm">{company.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Skills</h4>
              <div className="space-y-1">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`skill-${skill.id}`} 
                      checked={selectedFilters.skills.includes(skill.id)}
                      onCheckedChange={() => onFilterChange('skills', skill.id)}
                    />
                    <Label htmlFor={`skill-${skill.id}`} className="text-sm">
                      {skill.name}
                      <span className="ml-1 text-xs text-muted-foreground">({skill.category})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Events</h4>
              <div className="space-y-1">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`event-${event.id}`} 
                      checked={selectedFilters.events.includes(event.id)}
                      onCheckedChange={() => onFilterChange('events', event.id)}
                    />
                    <Label htmlFor={`event-${event.id}`} className="text-sm">
                      {event.name}
                      <span className="ml-1 text-xs text-muted-foreground">({event.type})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
