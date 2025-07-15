import React from 'react';
import { Clock, Users, ExternalLink, Zap } from 'lucide-react';
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
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                    <div className="flex items-center">
                        <Avatar 
                            size="md"
                            src="https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/516161461_1274769343996911_4756708407528807557_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeG3V7FKbPOGg1_UppPr6d67M-ewHbzMA7Yz57AdvMwDtkhNaTTEp0dllYkd1A1lt3UfZL_MYqbMIfzsxwzMVoGc&_nc_ohc=oiv4YeDYYqwQ7kNvwE7mrLu&_nc_oc=AdlwWzulc9LDtp9JWDiQpgItX5xKsoPfvRjXB9vBrTMJDJFSUdmYtEUosiPx4Tun497dW4oEuuIwlyMLXYT7cHu5&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&oh=03_Q7cD2wFGwc_Gx5gdwMkCdrmirrfpE8ZanQ5vEdjM3GDYZZofPQ&oe=689DC03B"
                            alt="Mentor Name"
                        />
                        <div className="ml-3">
                            <p className="font-semibold text-white">Mentor Name</p>
                            <p className="text-xs text-neutral-500">Senior Developer</p>
                        </div>
                    </div>

                    <Link to={`/projects/${project.id}`}>
                        <Button 
                            variant="outline"
                            size="sm"
                            className="border-custom-cyan text-custom-cyan group-hover:bg-custom-cyan group-hover:text-black transition-colors duration-300"
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Apply Now
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;
