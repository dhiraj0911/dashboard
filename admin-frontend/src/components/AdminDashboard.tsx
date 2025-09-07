import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Company, Project, User } from '../types';
import { companyAPI, projectAPI, authAPI } from '../services/api';
import { Users, Building2, FolderOpen, LogOut } from 'lucide-react';
import UserManagement from './UserManagement';
import CompanyManagement from './CompanyManagement';
import ProjectManagement from './ProjectManagement';
import './AdminDashboard.css';

type TabType = 'users' | 'companies' | 'projects';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, companiesData, projectsData] = await Promise.all([
        authAPI.getUsers(),
        companyAPI.getCompanies(),
        projectAPI.getProjects()
      ]);
      setUsers(usersData);
      setCompanies(companiesData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="header-right">
          <span className="user-welcome">Welcome, {user?.email}</span>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="sidebar">
          <div className="nav-section">
            <h3>Management</h3>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              <span>Users</span>
              <span className="count">{users.length}</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'companies' ? 'active' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              <Building2 size={20} />
              <span>Companies</span>
              <span className="count">{companies.length}</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderOpen size={20} />
              <span>Projects</span>
              <span className="count">{projects.length}</span>
            </button>
          </div>
        </nav>

        <main className="main-content">
          {activeTab === 'users' && (
            <UserManagement 
              users={users} 
              companies={companies}
              projects={projects}
              onRefresh={loadData}
            />
          )}
          {activeTab === 'companies' && (
            <CompanyManagement 
              companies={companies} 
              onRefresh={loadData}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectManagement 
              projects={projects} 
              companies={companies}
              onRefresh={loadData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
