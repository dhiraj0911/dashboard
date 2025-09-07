import React, { useState } from 'react';
import { Company, CreateCompanyData } from '../types';
import { companyAPI } from '../services/api';
import { Building2, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import './CompanyManagement.css';

interface CompanyManagementProps {
  companies: Company[];
  onRefresh: () => void;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ companies, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CreateCompanyData>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await companyAPI.createCompany(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '' });
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    setLoading(true);
    setError('');

    try {
      await companyAPI.updateCompany(editingCompany._id, formData);
      setEditingCompany(null);
      setFormData({ name: '', description: '' });
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('Are you sure you want to delete this company? This will also remove all associated projects.')) {
      return;
    }

    try {
      await companyAPI.deleteCompany(companyId);
      onRefresh();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete company');
    }
  };

  const openEditForm = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description || ''
    });
  };

  return (
    <div className="company-management">
      <div className="section-header">
        <div className="header-left">
          <Building2 size={24} />
          <h2>Company Management</h2>
        </div>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={18} />
          Create Company
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {(showCreateForm || editingCompany) && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingCompany ? 'Edit Company' : 'Create New Company'}</h3>
            <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter company name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter company description (optional)"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCompany(null);
                    setFormData({ name: '', description: '' });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingCompany ? 'Update Company' : 'Create Company')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="companies-grid">
        {companies.map(company => (
          <div key={company._id} className="company-card">
            <div className="company-header">
              <div className="company-info">
                <Building2 size={20} />
                <h3>{company.name}</h3>
              </div>
              <div className="company-actions">
                <button
                  className="edit-btn"
                  onClick={() => openEditForm(company)}
                  title="Edit Company"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCompany(company._id)}
                  title="Delete Company"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {company.description && (
              <p className="company-description">{company.description}</p>
            )}
            
            <div className="company-stats">
              <div className="stat">
                <FolderOpen size={16} />
                <span>{company.projects.length} Projects</span>
              </div>
              <div className="stat">
                <Building2 size={16} />
                <span>{company.users.length} Users</span>
              </div>
            </div>

            {company.projects.length > 0 && (
              <div className="company-projects">
                <h4>Projects:</h4>
                <div className="project-tags">
                  {company.projects.map(project => (
                    <span key={project._id} className="project-tag">
                      {project.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="empty-state">
          <Building2 size={48} />
          <h3>No Companies Yet</h3>
          <p>Create your first company to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
