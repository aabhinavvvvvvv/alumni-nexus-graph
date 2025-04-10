
import axios from 'axios';

// Create API instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions for alumni data
export const getAlumni = async () => {
  const response = await api.get('/alumni');
  return response.data;
};

export const getAlumniById = async (id: string) => {
  const response = await api.get(`/alumni/${id}`);
  return response.data;
};

export const getAlumniByDepartment = async (departmentId: string) => {
  const response = await api.get(`/alumni/department/${departmentId}`);
  return response.data;
};

export const getAlumniByCompany = async (companyId: string) => {
  const response = await api.get(`/alumni/company/${companyId}`);
  return response.data;
};

export const getAlumniBySkill = async (skillId: string) => {
  const response = await api.get(`/alumni/skill/${skillId}`);
  return response.data;
};

export const getAlumniByEvent = async (eventId: string) => {
  const response = await api.get(`/alumni/event/${eventId}`);
  return response.data;
};

// API functions for entity data
export const getDepartments = async () => {
  const response = await api.get('/departments');
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get('/companies');
  return response.data;
};

export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// API function for graph data
export const getGraphData = async () => {
  const response = await api.get('/graph');
  return response.data;
};

// Authentication
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: 'Could not connect to backend' };
  }
};
