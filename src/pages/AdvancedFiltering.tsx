
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FilterContainer from '@/components/FilterContainer';
import { Button } from '@/components/ui/button';
import { Alumni } from '@/data/mockData';
import AlumniResults from '@/components/AlumniResults';

const AdvancedFiltering = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showGraph, setShowGraph] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  const handleFilteredResults = (results: Alumni[]) => {
    setFilteredAlumni(results);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onSearch={handleSearch} />
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          activeFilter={null}
          setActiveFilter={() => {}}
        />
        <div className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Advanced Alumni Filtering</h1>
              <Button 
                onClick={toggleGraph} 
                variant="outline"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {showGraph ? 'Hide Graph Visualization' : 'Show Graph Visualization'}
              </Button>
            </div>
            
            <FilterContainer 
              onFilteredResults={handleFilteredResults} 
              showGraph={showGraph}
              searchTerm={searchTerm}
            />
            
            <AlumniResults alumni={filteredAlumni} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltering;
