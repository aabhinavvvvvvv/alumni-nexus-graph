
import { alumni } from './alumniData';
import { skills, events } from './entitiesData';
import { Person, Skill, Event } from './types';

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
