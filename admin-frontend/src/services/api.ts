import axios from 'axios';
import { 
  AuthResponse, 
  LoginData, 
  CreateUserData, 
  CreateCompanyData, 
  CreateProjectData, 
  User, 
  Company, 
  Project 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getUserProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await api.post('/auth/users', data);
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  updateUserAccess: async (userId: string, data: { companies: string[], projects: string[] }): Promise<User> => {
    const response = await api.put(`/auth/users/${userId}/access`, data);
    return response.data;
  },
};

// Company API
export const companyAPI = {
  createCompany: async (data: CreateCompanyData): Promise<Company> => {
    const response = await api.post('/companies', data);
    return response.data;
  },

  getCompanies: async (): Promise<Company[]> => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompanyById: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  updateCompany: async (id: string, data: CreateCompanyData): Promise<Company> => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};

// Project API
export const projectAPI = {
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

export default api;
