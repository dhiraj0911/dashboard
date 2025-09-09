import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Company, Project } from '../types';
import Sidebar from './Sidebar';
import ProjectView from './ProjectView';
import { LogOut, Menu, X, BarChart3, Building2, FolderOpen, User, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (user) {
      // Use the companies data directly from the user profile which includes populated projects
      setUserCompanies(user.companies);

      // Auto-select first project if available
      if (user.companies.length > 0) {
        const firstCompanyWithProjects = user.companies.find(c => c.projects && c.projects.length > 0);
        if (firstCompanyWithProjects && !selectedProject) {
          setSelectedProject(firstCompanyWithProjects.projects[0]);
        }
      }
    }
  }, [user, selectedProject]);

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const totalProjects = user.projects.length;
  const totalCompanies = user.companies.length;

  return (
    <div className="modern-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button 
            className="sidebar-toggle-btn"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          >
            {sidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          <div className="brand">
            <BarChart3 size={28} className="brand-icon" />
            <h2>Dashboard</h2>
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user.email}</span>
              <span className="user-role">{user.isAdmin ? 'Administrator' : 'User'}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        
        {sidebarVisible && (
          <Sidebar 
            companies={userCompanies}
            onProjectSelect={(project) => {
              setSelectedProject(project);
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
            selectedProject={selectedProject}
            isOpen={sidebarOpen}
          />
        )}
        
        <main className={`main-content ${!sidebarVisible ? 'full-width' : ''}`}>
          {selectedProject ? (
            <ProjectView project={selectedProject} />
          ) : (
            <div className="welcome-card">
              <div className="welcome-content">
                <div className="welcome-icon">
                  <BarChart3 size={64} />
                </div>
                <h2>Welcome to your Dashboard</h2>
                <p>Select a project from the sidebar to view your analytics and insights.</p>
                {totalProjects === 0 && (
                  <div className="no-access-message">
                    <p>You don't have access to any projects yet.</p>
                    <p>Please contact your administrator to get access.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
