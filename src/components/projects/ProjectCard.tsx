import React from 'react';
import { Clock, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
    className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = ''}) => {
    // Get difficulty badge variant
    const getDifficultyVariant = () => {
        switch (project.difficulty) {
            case 'beginner':
                return 'success';
            case 'intermediate':
                return 'warning';
            case 'advanced':
                return 'error';
            default:
                return 'neutral';
        }
    };

    // Get status badge variant
    const getStatusVariant = () => {
        switch (project.status) {
            case 'open':
                return 'success';
            case 'in-progress':
                return 'warning';
            case 'completed':
                return 'neutral';
            default:
                return 'neutral';
        }
    };

    return (
        <Card 
            variant="hover"
            className={`overflow-hidden flex flex-col h-full transition-all duration-300 ${className}`}
        >
            {project.imageUrl && (
                <div className="w-full h-40 bg-neutral-800 overflow-hidden">
                    <img 
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                        <Badge variant={getStatusVariant()}>
                            {project.status === 'open' ? 'Open to Apply' : project.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </Badge>
                        <Badge variant={getDifficultyVariant()}>
                            {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                        </Badge>
                    </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-neutral-50 line-clamp-2">
                    {project.title}
                </h3>

                <p className="text-neutral-400 mb-4 line-clamp-3">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="primary" size="sm">
                            {skill}
                        </Badge>
                    ))}
                    {project.skills.length > 3 && (
                        <Badge variant="neutral" size="sm">
                            +{project.skills.length - 3} more
                        </Badge>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-800">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center text-sm text-neutral-400">
                            <Clock className="h-4 w-4 mr-1 text-custom-orange" />
                            <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-neutral-400">
                            <Users className="h-4 w-4 mr-1 text-custom-purple" />
                            <span>{project.assignedStudents.length}/{project.maxStudents} Students</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar 
                                size="sm"
                                src="https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/447268717_435077399234559_87444479210717093_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEtsubfHvWHEY0cwWd2PjIPXdjsTODRxD5d2OxM4NHEPp6kG3RcMEgVtEiI8ACB-mDt4EieApUWLjkYDWNaZP8q&_nc_ohc=K8m0ci0NIQ0Q7kNvwHw2zdb&_nc_oc=AdlcWOG46IooP8nfNsKRuyQYh4qO4c1IwwWDagVtrGtWVx0KL00UOjSDyYdbDW-WQC55Nz3ectCjijSHS61c1OoV&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=7ncyBNttSV0MrSdSariVpA&oh=00_AfInGg63JVFRI9P4NeYpbg_UvujNj0tGhG-dglgo0t1vZw&oe=682B7D3C"
                                alt="Mentor Name"
                            />
                            <div className="ml-2">
                                <p className="text-sm font-medium text-neutral-50">Mentor Name</p>
                                <p className="text-xs text-neutral-400">Senior Developer</p>
                            </div>
                        </div>

                        <Link to={`/projects/${project.id}`}>
                            <Button 
                                variant="primary"
                                size="sm"
                                rightIcon={<ExternalLink className="h-4 w-4" />}
                            >
                                View
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;