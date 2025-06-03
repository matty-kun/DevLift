import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Calendar, MapPin, Briefcase, Link as LinkIcon, Edit, Mail, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
    const { id } = useParams();
    const { user, userType } = useAuth();
    const navigate = useNavigate();
    const isOwnProfile = !id;

    useEffect(() => {
        if (isOwnProfile && !user) {
            navigate('/sign-in');
        }
    }, [isOwnProfile, user, navigate]);

    // This would be replaced with actual data fetching from Supabase
    const profile = {
        name: isOwnProfile ? "Your Name" : "Alex Johnson",
        role: userType || "Student",
        bio: "Computer Science student passionate about web development and AI. Currently building real-world experience through startup collaborations.",
        location: "San Francisco, CA",
        education: "BS Computer Science, Stanford University",
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
        projects: [
            {
                title: "E-Commerce Platform",
                status: "Completed",
                role: "Frontend Developer",
            },
            {
                title: "AI Chatbot Integration",
                status: "In Progress",
                role: "Full Stack Developer",
            }
        ],
        links: [
            { name: "GitHub", url: "https://github.com" },
            { name: "LinkedIn", url: "https://linkedin.com" },
            { name: "Portfolio", url: "https://portfolio.com" }
        ]
    };

    const getSkillColor = (index: number) => {
        const colors = ["custom-cyan", "custom-purple", "custom-orange"];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <Card className="mb-8 border border-gray-800">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                                        <p className="text-custom-cyan">{profile.role}</p>
                                    </div>
                                    {isOwnProfile && (
                                        <Button variant="outline" className="mt-4 md:mt-0 border-custom-cyan text-custom-cyan">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                                <p className="mt-4 text-gray-300">{profile.bio}</p>
                                <div className="mt-4 flex flex-wrap gap-4">
                                    <div className="flex items-center text-gray-400">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{profile.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <Briefcase className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{profile.education}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Skills and Projects */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-8">
                            {/* Skills */}
                            <Card className="border border-gray-800">
                                <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span 
                                            key={skill} 
                                            className={`bg-${getSkillColor(index)}/20 text-${getSkillColor(index)} text-xs px-3 py-1 rounded-full`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Links */}
                            <Card className="border border-gray-800">
                                <h2 className="text-xl font-semibold text-white mb-4">Links</h2>
                                <ul className="space-y-3">
                                    {profile.links.map((link, index) => (
                                        <li key={index}>
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors"
                                            >
                                                <LinkIcon className="h-4 w-4 mr-2" />
                                                <span>{link.name}</span>
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Contact */}
                            {!isOwnProfile && (
                                <Card className="border border-gray-800">
                                    <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
                                    <Button variant="primary" className="w-full">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Message
                                    </Button>
                                </Card>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            {/* Projects */}
                            <Card className="border border-gray-800">
                                <h2 className="text-xl font-semibold text-white mb-4">Projects</h2>
                                {profile.projects.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.projects.map((project, index) => (
                                            <div key={index} className="p-4 border border-gray-800 rounded-lg hover:border-custom-cyan transition-colors">
                                                <div className="flex justify-between">
                                                    <h3 className="font-medium text-white">{project.title}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        project.status === 'Completed' 
                                                            ? 'bg-green-500/20 text-green-500' 
                                                            : 'bg-custom-orange/20 text-custom-orange'
                                                    }`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 mt-2">Role: {project.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No projects yet</p>
                                        {isOwnProfile && (
                                            <Button variant="outline" className="mt-4 border-custom-cyan text-custom-cyan">
                                                Browse Projects
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;   
