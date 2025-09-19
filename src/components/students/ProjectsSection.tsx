import React from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';

interface Project {
  id: number;
  title: string;
  description: string;
  liveUrl?: string;
  repoUrl?: string;
  status: 'Completed' | 'In Progress';
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-custom-cyan mb-3">Projects</h2>
      <div className="space-y-6">
        {projects.map(item => (
          <div key={item.id} className="bg-neutral-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <Badge variant={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</Badge>
            </div>
            <p className="text-neutral-300 mb-4">{item.description}</p>
            <div className="flex gap-4">
              {item.liveUrl && <Button variant="secondary" onClick={() => window.open(item.liveUrl, '_blank')}>Live Project</Button>}
              {item.repoUrl && <Button variant="secondary" onClick={() => window.open(item.repoUrl, '_blank')}>Code Repo</Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;