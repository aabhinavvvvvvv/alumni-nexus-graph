
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Network, Users, Briefcase, GraduationCap, Award, Calendar, 
  Home, Filter, ChevronRight, ChevronLeft
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
}

export default function Sidebar({ 
  isOpen, 
  toggleSidebar, 
  activeFilter, 
  setActiveFilter 
}: SidebarProps) {
  return (
    <div 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar dark:bg-sidebar border-r border-border transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      } z-10`}
    >
      <div className="p-2 h-full flex flex-col">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 justify-end text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              !activeFilter && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter(null)}
          >
            <Home className="h-4 w-4 mr-2" />
            {isOpen && <span>Overview</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              activeFilter === 'network' && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter('network')}
          >
            <Network className="h-4 w-4 mr-2" />
            {isOpen && <span>Network</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              activeFilter === 'alumni' && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter('alumni')}
          >
            <Users className="h-4 w-4 mr-2" />
            {isOpen && <span>Alumni</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              activeFilter === 'companies' && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter('companies')}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            {isOpen && <span>Companies</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              activeFilter === 'departments' && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter('departments')}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            {isOpen && <span>Departments</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              activeFilter === 'skills' && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter('skills')}
          >
            <Award className="h-4 w-4 mr-2" />
            {isOpen && <span>Skills</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              activeFilter === 'events' && 'bg-sidebar-accent'
            }`}
            onClick={() => setActiveFilter('events')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isOpen && <span>Events</span>}
          </Button>
        </div>
        
        {isOpen && (
          <Card className="mt-auto p-3 bg-sidebar-accent border-sidebar-border">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-sidebar-foreground mr-2" />
              <h3 className="text-sm font-medium text-sidebar-foreground">Filter Legend</h3>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-alumni-blue-500 mr-2"></div>
                <span className="text-sidebar-foreground">Alumni</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-alumni-purple-500 mr-2"></div>
                <span className="text-sidebar-foreground">Company</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sidebar-foreground">Department</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
                <span className="text-sidebar-foreground">Skill</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-rose-400 mr-2"></div>
                <span className="text-sidebar-foreground">Event</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
