import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Pencil, Trash2, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type ProjectRow = {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'completed' | null;
  created_at: string;
  header_image_url?: string | null;
};

interface FounderProjectCardProps {
  project: ProjectRow;
  applicantCount: number;
  onDelete: (projectId: string) => void;
}

const mapStatus = (s: ProjectRow['status']) => {
  if (s === 'in_progress') return 'In Progress';
  if (s === 'completed') return 'Completed';
  return 'Open';
};

const FounderProjectCard: React.FC<FounderProjectCardProps> = ({ project, applicantCount, onDelete }) => {
  const getStatusClass = () => {
    switch (project.status) {
      case 'open': return 'bg-green-500/80 border-green-400/90 text-white';
      case 'in_progress': return 'bg-yellow-500/80 border-yellow-400/90 text-black';
      case 'completed': return 'bg-red-500/80 border-red-400/90 text-white';
      default: return 'bg-gray-500/80 border-gray-400/90 text-white';
    }
  };

  const timeAgo = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-lg transition-all duration-300 hover:border-custom-cyan hover:shadow-custom-cyan/20 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={project.header_image_url || `https://source.unsplash.com/800x600/?${encodeURIComponent(project.title)}`}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusClass()}`}>
            {mapStatus(project.status)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-custom-cyan transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex items-center text-custom-orange">
            <Users className="mr-2 h-5 w-5" />
            <span className="text-lg font-bold">{applicantCount}</span>
            <span className="ml-1.5 text-sm text-neutral-400"> {applicantCount === 1 ? 'Applicant' : 'Applicants'}</span>
        </div>
        <div className="flex items-center text-sm text-neutral-500 mt-4">
            <Clock className="mr-2 h-4 w-4" />
            <span>Posted {timeAgo}</span>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="flex items-center justify-around gap-2 border-t border-neutral-800 px-2 py-3">
        <Link to={`/projects/${project.id}/applications`} className="flex flex-col items-center group text-custom-cyan hover:text-custom-cyan/80 transition-colors px-3 py-1 rounded-md hover:bg-neutral-800">
          <FileText className="h-5 w-5" />
          <span className="text-xs font-semibold mt-1">Applications</span>
        </Link>
        <Link to={`/founders/projects/${project.id}/edit`} className="flex flex-col items-center group text-custom-orange hover:text-custom-orange/80 transition-colors px-3 py-1 rounded-md hover:bg-neutral-800">
          <Pencil className="h-5 w-5" />
          <span className="text-xs font-semibold mt-1">Edit</span>
        </Link>
        <button onClick={() => onDelete(project.id)} className="flex flex-col items-center group text-custom-purple hover:text-custom-purple/80 transition-colors px-3 py-1 rounded-md hover:bg-neutral-800">
          <Trash2 className="h-5 w-5" />
          <span className="text-xs font-semibold mt-1">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default FounderProjectCard;
