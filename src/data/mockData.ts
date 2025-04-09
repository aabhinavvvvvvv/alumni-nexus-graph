export interface Person {
  id: string;
  name: string;
  avatar: string;
  department: string;
  company: string;
  jobTitle: string;
  skills: string[];
  graduationYear: number;
  email: string;
  events: string[];
  bio?: string;
  role?: string;
}

export interface Department {
  id: string;
  name: string;
  faculty: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'alumni' | 'department' | 'company' | 'skill' | 'event';
  size?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'WORKS_AT' | 'STUDIED_IN' | 'HAS_SKILL' | 'ATTENDED';
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Mock Alumni Data
export const alumni: Person[] = [
  {
    id: 'a1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'd1',
    company: 'c1',
    jobTitle: 'Software Engineer',
    skills: ['s1', 's2', 's3'],
    graduationYear: 2018,
    email: 'sarah.j@example.com',
    events: ['e1', 'e3'],
    bio: 'Experienced software engineer with a passion for building user-friendly applications. Graduated from the Computer Science department with honors.',
    role: 'Full Stack Developer'
  },
  {
    id: 'a2',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'd1',
    company: 'c2',
    jobTitle: 'Data Scientist',
    skills: ['s2', 's4', 's5'],
    graduationYear: 2019,
    email: 'michael.c@example.com',
    events: ['e2', 'e3'],
    bio: 'Data scientist with a strong background in machine learning and AI. Enjoys working with large datasets to extract meaningful insights.',
    role: 'AI/ML Specialist'
  },
  {
    id: 'a3',
    name: 'Emily Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'd2',
    company: 'c3',
    jobTitle: 'UX Designer',
    skills: ['s6', 's7'],
    graduationYear: 2020,
    email: 'emily.r@example.com',
    events: ['e1', 'e4'],
    bio: 'UX designer focused on creating intuitive and accessible interfaces. Advocates for user-centered design in all projects.',
    role: 'Senior Designer'
  },
  {
    id: 'a4',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'd3',
    company: 'c1',
    jobTitle: 'Product Manager',
    skills: ['s8', 's9', 's3'],
    graduationYear: 2017,
    email: 'david.k@example.com',
    events: ['e2', 'e4'],
    bio: 'Product manager with experience in leading cross-functional teams. Passionate about building products that solve real user problems.',
    role: 'Product Lead'
  },
  {
    id: 'a5',
    name: 'Lisa Wang',
    avatar: 'https://i.pravatar.cc/150?img=9',
    department: 'd2',
    company: 'c4',
    jobTitle: 'Marketing Specialist',
    skills: ['s10', 's11'],
    graduationYear: 2021,
    email: 'lisa.w@example.com',
    events: ['e3', 'e4'],
    bio: 'Marketing specialist with a focus on digital campaigns and social media strategy. Always looking for innovative ways to engage audiences.',
    role: 'Digital Marketing Manager'
  },
  {
    id: 'a6',
    name: 'Robert Taylor',
    avatar: 'https://i.pravatar.cc/150?img=12',
    department: 'd4',
    company: 'c5',
    jobTitle: 'Financial Analyst',
    skills: ['s12', 's13'],
    graduationYear: 2019,
    email: 'robert.t@example.com',
    events: ['e1', 'e5'],
    bio: 'Financial analyst with expertise in investment analysis and financial modeling. Dedicated to finding value and managing risk.',
    role: 'Senior Financial Analyst'
  }
];

// Mock Departments
export const departments: Department[] = [
  { id: 'd1', name: 'Computer Science', faculty: 'Engineering' },
  { id: 'd2', name: 'Business Administration', faculty: 'Business' },
  { id: 'd3', name: 'Economics', faculty: 'Social Sciences' },
  { id: 'd4', name: 'Finance', faculty: 'Business' }
];

// Mock Companies
export const companies: Company[] = [
  { id: 'c1', name: 'Google', industry: 'Technology', location: 'Mountain View, CA' },
  { id: 'c2', name: 'Microsoft', industry: 'Technology', location: 'Redmond, WA' },
  { id: 'c3', name: 'Apple', industry: 'Technology', location: 'Cupertino, CA' },
  { id: 'c4', name: 'Facebook', industry: 'Technology', location: 'Menlo Park, CA' },
  { id: 'c5', name: 'JP Morgan', industry: 'Finance', location: 'New York, NY' }
];

// Mock Skills
export const skills: Skill[] = [
  { id: 's1', name: 'JavaScript', category: 'Programming' },
  { id: 's2', name: 'Python', category: 'Programming' },
  { id: 's3', name: 'React', category: 'Web Development' },
  { id: 's4', name: 'Data Analysis', category: 'Data Science' },
  { id: 's5', name: 'Machine Learning', category: 'Data Science' },
  { id: 's6', name: 'UI Design', category: 'Design' },
  { id: 's7', name: 'User Research', category: 'Design' },
  { id: 's8', name: 'Product Management', category: 'Management' },
  { id: 's9', name: 'Agile', category: 'Management' },
  { id: 's10', name: 'Digital Marketing', category: 'Marketing' },
  { id: 's11', name: 'Social Media', category: 'Marketing' },
  { id: 's12', name: 'Financial Modeling', category: 'Finance' },
  { id: 's13', name: 'Investment Analysis', category: 'Finance' }
];

// Mock Events
export const events: Event[] = [
  { id: 'e1', name: 'Annual Alumni Reunion', date: '2023-05-15', location: 'University Campus', type: 'Networking' },
  { id: 'e2', name: 'Tech Industry Panel', date: '2023-07-22', location: 'Virtual', type: 'Panel Discussion' },
  { id: 'e3', name: 'Career Fair 2023', date: '2023-09-10', location: 'University Campus', type: 'Career' },
  { id: 'e4', name: 'Leadership Workshop', date: '2023-11-05', location: 'Downtown Conference Center', type: 'Workshop' },
  { id: 'e5', name: 'Entrepreneurship Summit', date: '2024-01-20', location: 'Business School', type: 'Conference' }
];

// Generate Graph Data
export const generateGraphData = (): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  
  // Add Alumni Nodes
  alumni.forEach(person => {
    nodes.push({
      id: person.id,
      label: person.name,
      type: 'alumni',
      size: 10
    });
    
    // Add links to department
    links.push({
      source: person.id,
      target: person.department,
      type: 'STUDIED_IN',
      label: 'STUDIED_IN'
    });
    
    // Add links to company
    links.push({
      source: person.id,
      target: person.company,
      type: 'WORKS_AT',
      label: 'WORKS_AT'
    });
    
    // Add links to skills
    person.skills.forEach(skillId => {
      links.push({
        source: person.id,
        target: skillId,
        type: 'HAS_SKILL',
        label: 'HAS_SKILL'
      });
    });
    
    // Add links to events
    person.events.forEach(eventId => {
      links.push({
        source: person.id,
        target: eventId,
        type: 'ATTENDED',
        label: 'ATTENDED'
      });
    });
  });
  
  // Add Department Nodes
  departments.forEach(dept => {
    nodes.push({
      id: dept.id,
      label: dept.name,
      type: 'department',
      size: 8
    });
  });
  
  // Add Company Nodes
  companies.forEach(company => {
    nodes.push({
      id: company.id,
      label: company.name,
      type: 'company',
      size: 8
    });
  });
  
  // Add Skill Nodes
  skills.forEach(skill => {
    nodes.push({
      id: skill.id,
      label: skill.name,
      type: 'skill',
      size: 5
    });
  });
  
  // Add Event Nodes
  events.forEach(event => {
    nodes.push({
      id: event.id,
      label: event.name,
      type: 'event',
      size: 7
    });
  });
  
  return { nodes, links };
};

// Helper function to get entity by ID
export const getEntityById = <T extends { id: string }>(
  entities: T[],
  id: string
): T | undefined => {
  return entities.find(entity => entity.id === id);
};

// Queries for the graph
export const queryAlumniByDepartment = (departmentId: string): Person[] => {
  return alumni.filter(person => person.department === departmentId);
};

export const queryAlumniByCompany = (companyId: string): Person[] => {
  return alumni.filter(person => person.company === companyId);
};

export const queryAlumniBySkill = (skillId: string): Person[] => {
  return alumni.filter(person => person.skills.includes(skillId));
};

export const queryAlumniByEvent = (eventId: string): Person[] => {
  return alumni.filter(person => person.events.includes(eventId));
};

export const queryCommonSkills = (alumniIds: string[]): Skill[] => {
  if (!alumniIds.length) return [];
  
  const skillSets = alumniIds.map(id => {
    const person = alumni.find(a => a.id === id);
    return new Set(person?.skills || []);
  });
  
  const commonSkillIds = [...skillSets[0]].filter(skillId => 
    skillSets.every(set => set.has(skillId))
  );
  
  return skills.filter(skill => commonSkillIds.includes(skill.id));
};

export const queryCommonEvents = (alumniIds: string[]): Event[] => {
  if (!alumniIds.length) return [];
  
  const eventSets = alumniIds.map(id => {
    const person = alumni.find(a => a.id === id);
    return new Set(person?.events || []);
  });
  
  const commonEventIds = [...eventSets[0]].filter(eventId => 
    eventSets.every(set => set.has(eventId))
  );
  
  return events.filter(event => commonEventIds.includes(event.id));
};
