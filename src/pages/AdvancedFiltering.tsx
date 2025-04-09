
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FilterContainer from '@/components/FilterContainer';
import { Button } from '@/components/ui/button';
import { Person } from '@/data/mockData';
import AlumniResults from '@/components/AlumniResults';
import { Link } from 'react-router-dom';

const AdvancedFiltering = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showGraph, setShowGraph] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredAlumni, setFilteredAlumni] = useState<Person[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    setIsLoggedIn(!!user);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  const handleFilteredResults = (results: Person[]) => {
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
              
              <div className="flex space-x-2">
                <Button 
                  onClick={toggleGraph} 
                  variant="outline"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {showGraph ? 'Hide Graph Visualization' : 'Show Graph Visualization'}
                </Button>
                
                <Link to={isLoggedIn ? "/profile" : "/login"}>
                  <Button variant="outline">
                    {isLoggedIn ? "My Profile" : "Alumni Login"}
                  </Button>
                </Link>
              </div>
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
