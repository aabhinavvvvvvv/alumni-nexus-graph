
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Mail, GraduationCap } from 'lucide-react';
import { Person, Department, Company } from '@/data/mockData';

interface AlumniCardProps {
  alumni: Person;
  department?: Department;
  company?: Company;
}

export default function AlumniCard({ alumni, department, company }: AlumniCardProps) {
  const initials = alumni.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={alumni.avatar} alt={alumni.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{alumni.name}</h3>
            <p className="text-sm text-muted-foreground">{alumni.jobTitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <GraduationCap className="h-4 w-4 mr-2 text-alumni-purple-500" />
            <span>{department?.name || 'Department'}</span>
          </div>
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-alumni-blue-500" />
            <span>{company?.name || 'Company'}</span>
          </div>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Graduation:</span> {alumni.graduationYear}
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {alumni.skills.slice(0, 3).map((skillId) => (
            <Badge key={skillId} variant="outline" className="bg-alumni-purple-50 text-alumni-purple-700">
              Skill {skillId}
            </Badge>
          ))}
          {alumni.skills.length > 3 && (
            <Badge variant="outline" className="bg-alumni-blue-50 text-alumni-blue-700">
              +{alumni.skills.length - 3} more
            </Badge>
          )}
        </div>
        <Button variant="outline" className="w-full text-sm mt-2">
          <Mail className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </CardContent>
    </Card>
  );
}
