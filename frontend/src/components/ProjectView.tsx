import React, { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import './ProjectView.css';

interface ProjectViewProps {
  project: Project;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    window.open(project.powerbi_link, '_blank');
  };

  return (
    <div className={`modern-project-view ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="powerbi-container">
        <div className="powerbi-wrapper">
          {project.powerbi_link ? (
            <iframe
              key={refreshKey}
              src={project.powerbi_link}
              className="powerbi-iframe"
              title={`${project.name} - Power BI Dashboard`}
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="no-dashboard">
              <div className="no-dashboard-content">
                <ExternalLink size={64} />
                <h3>No Dashboard Available</h3>
                <p>This project doesn't have a Power BI dashboard configured yet.</p>
              </div>
            </div>
          )}
        </div>
        
        {project.powerbi_link && (
          <div className="powerbi-overlay">
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
