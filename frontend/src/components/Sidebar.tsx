import React from 'react';
import { Company, Project } from '../types';
import { Building2, FolderOpen, ChevronRight } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  companies: Company[];
  onProjectSelect: (project: Project) => void;
  selectedProject: Project | null;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ companies, onProjectSelect, selectedProject, isOpen = true }) => {
  return (
    <aside className={`modern-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Your Projects</h3>
      </div>
      
      <div className="sidebar-content">
        {companies.length === 0 ? (
          <div className="no-access">
            <div className="no-access-icon">
              <FolderOpen size={48} />
            </div>
            <h4>No Access</h4>
            <p>No companies or projects assigned to your account.</p>
            <p>Contact your administrator for access.</p>
          </div>
        ) : (
          <div className="companies-list">
            {companies.map((company) => (
              <div key={company._id} className="company-section">
                <div className="company-header">
                  <Building2 size={18} />
                  <h4 className="company-name">{company.name}</h4>
                  <span className="project-count">{company.projects.length}</span>
                </div>
                
                {company.projects.length === 0 ? (
                  <div className="no-projects">
                    <p>No projects available</p>
                  </div>
                ) : (
                  <div className="projects-list">
                    {company.projects.map((project) => (
                      <button
                        key={project._id}
                        className={`project-item ${selectedProject?._id === project._id ? 'active' : ''}`}
                        onClick={() => onProjectSelect(project)}
                      >
                        <div className="project-content">
                          <FolderOpen size={16} />
                          <span className="project-name">{project.name}</span>
                        </div>
                        <ChevronRight size={16} className="project-arrow" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
