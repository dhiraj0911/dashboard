export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  companies: Company[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  description?: string;
  projects: Project[];
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  powerbi_link: string;
  company: Company | string;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  isAdmin?: boolean;
  companies?: string[];
  projects?: string[];
}
