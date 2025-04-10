
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
  source: string;
  target: string;
  type: 'WORKS_AT' | 'STUDIED_IN' | 'HAS_SKILL' | 'ATTENDED';
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
