import React from 'react';
import { Clock, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import { Project } from '../../types';
import projectPlaceholder from '../../assets/project-placeholder.svg';

interface ProjectCardProps {
    project: Project;
    className?: string;
    ctaLabel?: string; // default: "Apply Now"
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = '', ctaLabel }) => {
    // Debug: log received skills
    console.log('[ProjectCard] Skills for project', project.title, project.skills);
    const getDifficultyVariant = () => {
        switch (project.difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'neutral';
        }
    };

    return (
        <Card 
            variant="border"
            className={`group relative flex flex-col h-full overflow-hidden rounded-xl border-neutral-800 bg-neutral-900 shadow-lg transition-all duration-300 hover:border-custom-cyan hover:shadow-custom-cyan/20 hover:-translate-y-1 ${className}`}
        >
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={(project.imageUrl && project.imageUrl.trim() !== '') ? project.imageUrl : projectPlaceholder}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        // Two-step fallback: first try Unsplash, then local placeholder
                        if (target.dataset.fallbackStep === 'unsplash') {
                            target.src = projectPlaceholder;
                            target.dataset.fallbackStep = 'placeholder';
                            return;
                        }
                        if (target.src !== projectPlaceholder) {
                            target.src = `https://source.unsplash.com/800x600/?technology,${encodeURIComponent(project.title)}`;
                            target.dataset.fallbackStep = 'unsplash';
                        } else {
                            // As a last resort, keep the placeholder
                            target.dataset.fallbackStep = 'placeholder';
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                <div className="absolute top-3 right-3">
                    <Badge variant={getDifficultyVariant()} size="sm" className="capitalize">
                        {project.difficulty}
                    </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-custom-cyan transition-colors duration-300">
                        {project.title}
                    </h3>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <p className="mb-4 text-neutral-400 line-clamp-3 flex-1">
                    {project.description}
                </p>

                <div className="mb-5 flex flex-wrap gap-2">
                    {project.skills.length > 0 ? (
                        <>
                            {project.skills.slice(0, 4).map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary" size="sm" className="font-medium">
                                    {skill}
                                </Badge>
                            ))}
                            {project.skills.length > 4 && (
                                <Badge variant="neutral" size="sm">
                                    +{project.skills.length - 4} more
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="text-xs text-neutral-500 italic">No skills listed</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-neutral-400 mb-5">
                    <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-custom-orange" />
                        <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-custom-purple" />
                        <span>{project.assignedStudents.length}/{project.maxStudents} Students</span>
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-neutral-800 pt-4">
                    <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                            <Avatar 
                                size="md"
                                src={project.mentor?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${project.mentorId}`}
                                alt={project.mentor?.full_name || 'Mentor'}
                            />
                            <div className="ml-3">
                                <p className="font-semibold text-white">{project.mentor?.full_name || 'Mentor'}</p>
                                <p className="text-xs text-neutral-500">Founder</p>
                            </div>
                        </div>
                        <Link to={`/projects/${project.id}`}>
                            <Button 
                                variant="outline"
                                size="sm"
                                className="border-custom-cyan text-custom-cyan group-hover:bg-custom-cyan group-hover:text-black transition-colors duration-300 ml-4"
                            >
                                <Zap className="mr-1 h-4 w-4" />
                                {ctaLabel ?? 'Apply'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;
