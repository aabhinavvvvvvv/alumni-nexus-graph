
// Export all types
export * from './types';

// Export data arrays
export { alumni } from './alumniData';
export { departments, companies, skills, events } from './entitiesData';

// Export utility functions
export { generateGraphData } from './graphUtils';
export { 
  getEntityById, 
  queryAlumniByDepartment, 
  queryAlumniByCompany,
  queryAlumniBySkill,
  queryAlumniByEvent,
  queryCommonSkills,
  queryCommonEvents
} from './queryUtils';
