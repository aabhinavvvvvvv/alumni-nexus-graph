
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    onSearch(searchTerm);
  };
  
  return (
    <header className="bg-white dark:bg-card border-b border-border h-16 flex items-center px-4 md:px-6 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alumni Nexus Graph
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              name="search"
              placeholder="Search alumni, companies, skills..." 
              className="pl-10 w-64 lg:w-80"
            />
            <Button type="submit" variant="ghost" size="sm" className="absolute right-0 top-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
