
import { GraphData, GraphNode, GraphLink } from './types';
import { alumni } from './alumniData';
import { departments, companies, skills, events } from './entitiesData';

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
