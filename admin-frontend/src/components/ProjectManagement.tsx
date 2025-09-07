import React, { useState } from 'react';
import { Project, Company, CreateProjectData } from '../types';
import { projectAPI } from '../services/api';
import { FolderOpen, Plus, Edit2, Trash2, Building2, ExternalLink } from 'lucide-react';
import './ProjectManagement.css';

interface ProjectManagementProps {
  projects: Project[];
  companies: Company[];
  onRefresh: () => void;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects, companies, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    powerbi_link: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await projectAPI.createProject(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', powerbi_link: '', company: '' });
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setLoading(true);
    setError('');

    try {
      await projectAPI.updateProject(editingProject._id, {
        name: formData.name,
        description: formData.description,
        powerbi_link: formData.powerbi_link
      });
      setEditingProject(null);
      setFormData({ name: '', description: '', powerbi_link: '', company: '' });
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectAPI.deleteProject(projectId);
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      powerbi_link: project.powerbi_link,
      company: typeof project.company === 'string' ? project.company : project.company._id
    });
  };

  const getCompanyName = (project: Project) => {
    if (typeof project.company === 'string') {
      const company = companies.find(c => c._id === project.company);
      return company?.name || 'Unknown Company';
    }
    return project.company.name;
  };

  return (
    <div className="project-management">
      <div className="section-header">
        <div className="header-left">
          <FolderOpen size={24} />
          <h2>Project Management</h2>
        </div>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {(showCreateForm || editingProject) && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
            <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter project description (optional)"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Power BI Link</label>
                <input
                  type="url"
                  value={formData.powerbi_link}
                  onChange={(e) => setFormData({ ...formData, powerbi_link: e.target.value })}
                  required
                  placeholder="https://app.powerbi.com/view?r=..."
                />
              </div>
              
              {!editingProject && (
                <div className="form-group">
                  <label>Company</label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProject(null);
                    setFormData({ name: '', description: '', powerbi_link: '', company: '' });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <div className="project-info">
                <FolderOpen size={20} />
                <h3>{project.name}</h3>
              </div>
              <div className="project-actions">
                <a 
                  href={project.powerbi_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-btn"
                  title="View Power BI Dashboard"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  className="edit-btn"
                  onClick={() => openEditForm(project)}
                  title="Edit Project"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProject(project._id)}
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="project-company">
              <Building2 size={16} />
              <span>{getCompanyName(project)}</span>
            </div>
            
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
            
            <div className="project-stats">
              <span>{project.users.length} Users Assigned</span>
            </div>

            <div className="project-link">
              <strong>Power BI Dashboard:</strong>
              <a 
                href={project.powerbi_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="powerbi-link"
              >
                View Dashboard <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <FolderOpen size={48} />
          <h3>No Projects Yet</h3>
          <p>Create your first project to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
