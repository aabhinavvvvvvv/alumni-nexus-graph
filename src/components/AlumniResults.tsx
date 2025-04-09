
import React from 'react';
import { Alumni } from '@/data/mockData';
import AlumniCard from './AlumniCard';
import { getEntityById, departments, companies } from '@/data/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AlumniResultsProps {
  alumni: Alumni[];
}

export default function AlumniResults({ alumni }: AlumniResultsProps) {
  if (alumni.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">
            No alumni match the current filters. Try adjusting your criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Results ({alumni.length} alumni)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumni.map(person => (
              <AlumniCard 
                key={person.id} 
                alumni={person}
                department={getEntityById(departments, person.department)}
                company={getEntityById(companies, person.company)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
