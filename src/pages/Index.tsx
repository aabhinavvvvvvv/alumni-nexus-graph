
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
        <Dashboard 
          sidebarOpen={sidebarOpen} 
          activeFilter={activeFilter} 
          searchTerm={searchTerm} 
        />
      </div>
    </div>
  );
};

export default Index;
