
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onSearch={handleSearch} />
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} p-4 w-full`}>
          <div className="mb-4 flex justify-between">
            <Link to="/advanced-filtering">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Advanced Filtering
              </Button>
            </Link>
            
            <Link to={isLoggedIn ? "/profile" : "/login"}>
              <Button variant="outline">
                {isLoggedIn ? "My Profile" : "Alumni Login"}
              </Button>
            </Link>
          </div>
          <Dashboard 
            sidebarOpen={sidebarOpen} 
            activeFilter={activeFilter} 
            searchTerm={searchTerm} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
