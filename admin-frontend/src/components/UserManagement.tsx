import React, { useState } from 'react';
import { User, Company, Project, CreateUserData } from '../types';
import { authAPI } from '../services/api';
import { Plus, Edit2, Users, Shield, Mail } from 'lucide-react';
import './UserManagement.css';

interface UserManagementProps {
  users: User[];
  companies: Company[];
  projects: Project[];
  onRefresh: () => void;
}

interface CompanyProjectSelection {
  companyId: string;
  projectIds: string[];
}

const UserManagement: React.FC<UserManagementProps> = ({ users, companies, projects, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    isAdmin: false,
    companies: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New state for step-by-step company-project selection
  const [companyProjectSelections, setCompanyProjectSelections] = useState<CompanyProjectSelection[]>([]);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
  const [currentProjectIds, setCurrentProjectIds] = useState<string[]>([]);

  // Helper function to get available projects for a specific company
  const getProjectsForCompany = (companyId: string) => {
    return projects.filter(project => {
      const projectCompanyId = typeof project.company === 'string' ? project.company : project.company._id;
      return projectCompanyId === companyId;
    });
  };

  // Helper function to get available companies (not yet selected)
  const getAvailableCompanies = () => {
    const selectedCompanyIds = companyProjectSelections.map(sel => sel.companyId);
    return companies.filter(company => !selectedCompanyIds.includes(company._id));
  };

  // Add company-project selection
  const addCompanyProjectSelection = () => {
    if (currentCompanyId && currentProjectIds.length > 0) {
      const newSelection: CompanyProjectSelection = {
        companyId: currentCompanyId,
        projectIds: currentProjectIds
      };
      
      const updatedSelections = [...companyProjectSelections, newSelection];
      setCompanyProjectSelections(updatedSelections);
      
      // Update form data
      const allCompanies = updatedSelections.map(sel => sel.companyId);
      const allProjects = updatedSelections.flatMap(sel => sel.projectIds);
      setFormData({
        ...formData,
        companies: allCompanies,
        projects: allProjects
      });
      
      // Reset current selection
      setCurrentCompanyId('');
      setCurrentProjectIds([]);
    }
  };

  // Remove company-project selection
  const removeCompanyProjectSelection = (companyId: string) => {
    const updatedSelections = companyProjectSelections.filter(sel => sel.companyId !== companyId);
    setCompanyProjectSelections(updatedSelections);
    
    // Update form data
    const allCompanies = updatedSelections.map(sel => sel.companyId);
    const allProjects = updatedSelections.flatMap(sel => sel.projectIds);
    setFormData({
      ...formData,
      companies: allCompanies,
      projects: allProjects
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ email: '', password: '', isAdmin: false, companies: [], projects: [] });
    setCompanyProjectSelections([]);
    setCurrentCompanyId('');
    setCurrentProjectIds([]);
    setError('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.createUser(formData);
      setShowCreateForm(false);
      resetForm();
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserAccess = async (userId: string, companies: string[], projects: string[]) => {
    try {
      await authAPI.updateUserAccess(userId, { companies, projects });
      setEditingUser(null);
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update user access');
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <div className="header-left">
          <Users size={24} />
          <h2>User Management</h2>
        </div>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  />
                  Admin User
                </label>
              </div>

              {/* Company-Project Selection Section */}
              <div className="form-section">
                <h4>Company & Project Access</h4>
                
                {/* Current Selection Area */}
                <div className="company-project-selector">
                  <div className="selector-row">
                    <div className="form-group">
                      <label>Select Company</label>
                      <select
                        value={currentCompanyId}
                        onChange={(e) => {
                          setCurrentCompanyId(e.target.value);
                          setCurrentProjectIds([]); // Reset projects when company changes
                        }}
                        className="company-select"
                      >
                        <option value="">Choose a company...</option>
                        {getAvailableCompanies().map(company => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {currentCompanyId && (
                      <div className="form-group">
                        <label>Select Projects for {companies.find(c => c._id === currentCompanyId)?.name}</label>
                        <div className="projects-multi-select">
                          {getProjectsForCompany(currentCompanyId).length === 0 ? (
                            <p className="no-projects">No projects available for this company</p>
                          ) : (
                            getProjectsForCompany(currentCompanyId).map(project => (
                              <label key={project._id} className="checkbox-label project-checkbox">
                                <input
                                  type="checkbox"
                                  checked={currentProjectIds.includes(project._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCurrentProjectIds([...currentProjectIds, project._id]);
                                    } else {
                                      setCurrentProjectIds(currentProjectIds.filter(id => id !== project._id));
                                    }
                                  }}
                                />
                                {project.name}
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {currentCompanyId && currentProjectIds.length > 0 && (
                      <button
                        type="button"
                        onClick={addCompanyProjectSelection}
                        className="add-selection-btn"
                      >
                        Add Company Access
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected Company-Project Combinations */}
                {companyProjectSelections.length > 0 && (
                  <div className="selected-combinations">
                    <h5>Selected Access:</h5>
                    {companyProjectSelections.map((selection) => {
                      const company = companies.find(c => c._id === selection.companyId);
                      return (
                        <div key={selection.companyId} className="company-selection-card">
                          <div className="company-header">
                            <strong>{company?.name}</strong>
                            <button
                              type="button"
                              onClick={() => removeCompanyProjectSelection(selection.companyId)}
                              className="remove-company-btn"
                            >
                              ×
                            </button>
                          </div>
                          <div className="projects-list">
                            {selection.projectIds.map(projectId => {
                              const project = projects.find(p => p._id === projectId);
                              return (
                                <span key={projectId} className="project-tag">
                                  {project?.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {getAvailableCompanies().length === 0 && companyProjectSelections.length > 0 && (
                  <div className="all-companies-selected">
                    ✓ All companies have been assigned
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-grid">
        {users.map(user => (
          <div key={user._id} className="user-card">
            <div className="user-header">
              <div className="user-info">
                <Mail size={16} />
                <span className="user-email">{user.email}</span>
                {user.isAdmin && (
                  <span className="admin-badge">
                    <Shield size={12} />
                    Admin
                  </span>
                )}
              </div>
              <button
                className="edit-btn"
                onClick={() => setEditingUser(user)}
              >
                <Edit2 size={16} />
              </button>
            </div>
            <div className="user-access">
              <div className="access-section">
                <strong>Companies ({user.companies.length})</strong>
                <div className="access-list">
                  {user.companies.map(company => (
                    <span key={company._id} className="access-tag company-tag">{company.name}</span>
                  ))}
                </div>
              </div>
              <div className="access-section">
                <strong>Projects ({user.projects.length})</strong>
                <div className="access-list">
                  {user.projects.map(project => {
                    let companyName = 'Unknown';
                    
                    if (typeof project.company === 'string') {
                      const foundCompany = companies.find(c => c._id === project.company);
                      companyName = foundCompany?.name || 'Unknown';
                    } else if (project.company && typeof project.company === 'object') {
                      companyName = project.company.name || 'Unknown';
                    }
                    
                    return (
                      <span key={project._id} className="access-tag project-tag">
                        {project.name}
                        <span className="project-company">({companyName})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User Access: {editingUser.email}</h3>
            <EditUserForm 
              user={editingUser}
              companies={companies}
              projects={projects}
              onUpdate={handleUpdateUserAccess}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Separate component for editing user access
interface EditUserFormProps {
  user: User;
  companies: Company[];
  projects: Project[];
  onUpdate: (userId: string, companies: string[], projects: string[]) => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, companies, projects, onUpdate, onCancel }) => {
  // Initialize with existing user's company-project combinations
  const initializeSelections = (): CompanyProjectSelection[] => {
    const userCompanyIds = user.companies.map(c => c._id);
    return userCompanyIds.map(companyId => ({
      companyId,
      projectIds: user.projects
        .filter(project => {
          const projectCompanyId = typeof project.company === 'string' ? project.company : project.company._id;
          return projectCompanyId === companyId;
        })
        .map(project => project._id)
    }));
  };

  const [companyProjectSelections, setCompanyProjectSelections] = useState<CompanyProjectSelection[]>(
    initializeSelections()
  );
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
  const [currentProjectIds, setCurrentProjectIds] = useState<string[]>([]);

  // Helper functions
  const getProjectsForCompany = (companyId: string) => {
    return projects.filter(project => {
      const projectCompanyId = typeof project.company === 'string' ? project.company : project.company._id;
      return projectCompanyId === companyId;
    });
  };

  const getAvailableCompanies = () => {
    const selectedCompanyIds = companyProjectSelections.map(sel => sel.companyId);
    return companies.filter(company => !selectedCompanyIds.includes(company._id));
  };

  const addCompanyProjectSelection = () => {
    if (currentCompanyId && currentProjectIds.length > 0) {
      const newSelection: CompanyProjectSelection = {
        companyId: currentCompanyId,
        projectIds: currentProjectIds
      };
      
      setCompanyProjectSelections([...companyProjectSelections, newSelection]);
      setCurrentCompanyId('');
      setCurrentProjectIds([]);
    }
  };

  const removeCompanyProjectSelection = (companyId: string) => {
    setCompanyProjectSelections(
      companyProjectSelections.filter(sel => sel.companyId !== companyId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allCompanies = companyProjectSelections.map(sel => sel.companyId);
    const allProjects = companyProjectSelections.flatMap(sel => sel.projectIds);
    onUpdate(user._id, allCompanies, allProjects);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <h4>Company & Project Access</h4>
        
        {/* Current Selection Area */}
        <div className="company-project-selector">
          <div className="selector-row">
            <div className="form-group">
              <label>Add Company</label>
              <select
                value={currentCompanyId}
                onChange={(e) => {
                  setCurrentCompanyId(e.target.value);
                  setCurrentProjectIds([]);
                }}
                className="company-select"
              >
                <option value="">Choose a company...</option>
                {getAvailableCompanies().map(company => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {currentCompanyId && (
              <div className="form-group">
                <label>Select Projects for {companies.find(c => c._id === currentCompanyId)?.name}</label>
                <div className="projects-multi-select">
                  {getProjectsForCompany(currentCompanyId).length === 0 ? (
                    <p className="no-projects">No projects available for this company</p>
                  ) : (
                    getProjectsForCompany(currentCompanyId).map(project => (
                      <label key={project._id} className="checkbox-label project-checkbox">
                        <input
                          type="checkbox"
                          checked={currentProjectIds.includes(project._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCurrentProjectIds([...currentProjectIds, project._id]);
                            } else {
                              setCurrentProjectIds(currentProjectIds.filter(id => id !== project._id));
                            }
                          }}
                        />
                        {project.name}
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {currentCompanyId && currentProjectIds.length > 0 && (
              <button
                type="button"
                onClick={addCompanyProjectSelection}
                className="add-selection-btn"
              >
                Add Company Access
              </button>
            )}
          </div>
        </div>

        {/* Selected Company-Project Combinations */}
        {companyProjectSelections.length > 0 && (
          <div className="selected-combinations">
            <h5>Current Access:</h5>
            {companyProjectSelections.map((selection) => {
              const company = companies.find(c => c._id === selection.companyId);
              return (
                <div key={selection.companyId} className="company-selection-card">
                  <div className="company-header">
                    <strong>{company?.name}</strong>
                    <button
                      type="button"
                      onClick={() => removeCompanyProjectSelection(selection.companyId)}
                      className="remove-company-btn"
                    >
                      ×
                    </button>
                  </div>
                  <div className="projects-list">
                    {selection.projectIds.map(projectId => {
                      const project = projects.find(p => p._id === projectId);
                      return (
                        <span key={projectId} className="project-tag">
                          {project?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {getAvailableCompanies().length === 0 && companyProjectSelections.length > 0 && (
          <div className="all-companies-selected">
            ✓ All companies have been assigned
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Update Access</button>
      </div>
    </form>
  );
};

export default UserManagement;
