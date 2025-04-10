
import { Department, Company, Skill, Event } from './types';

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
