import React, { useState } from 'react';
import { Company, Project } from '../types';
import { Building2, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  companies: Company[];
  onProjectSelect: (project: Project) => void;
  selectedProject: Project | null;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ companies, onProjectSelect, selectedProject, isOpen = true }) => {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  const toggleCompanyExpansion = (companyId: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedCompanies(newExpanded);
  };
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
            {companies.map((company) => {
              const isExpanded = expandedCompanies.has(company._id);
              const projectCount = company.projects?.length || 0;
              
              return (
                <div key={company._id} className="company-section">
                  <button 
                    className="company-header"
                    onClick={() => toggleCompanyExpansion(company._id)}
                  >
                    <div className="company-header-content">
                      <Building2 size={18} />
                      <h4 className="company-name">{company.name}</h4>
                      <span className="project-count">{projectCount}</span>
                    </div>
                    <div className="expand-icon">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <>
                      {projectCount === 0 ? (
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
