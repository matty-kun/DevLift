import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, BookOpen, Users, Briefcase, BarChart3 } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { user, userType, loading } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!loading && !user) {
    //         navigate('/sign-in');
    //     }
    // }, [loading, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-cyan"></div>
            </div>
        );
    }

    // if (!user) return null;

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        {userType === 'student' ? 'Student Dashboard' : 'Founder Dashboard'}
                    </h1>
                    <p className="mt-2 text-custom-cyan">
                        {userType === 'student'
                            ? 'Find projects and build your portfolio'
                            : 'Manage your projects and find talented students'}
                    </p>
                </div>

                {userType === 'student' ? <StudentDashboard /> : <FounderDashboard />}
            </div>
        </div>
    );
};

const StudentDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card className="border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Recommended Projects</h2>
                        <Button variant="outline" size="sm" className="border-custom-cyan text-custom-cyan">
                            <Search className="h-4 w-4 mr-2" />
                            Browse All
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-800 rounded-lg hover:border-custom-cyan transition-colors">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-medium text-white">Mobile App Development</h3>
                                    <p className="text-sm text-gray-400 mt-1">Help build a React Native app for a fitness startup</p>
                                </div>
                                <div className="bg-custom-purple/20 text-custom-purple text-xs px-2 py-1 rounded-full h-fit">
                                    React Native
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-gray-700"></div>
                                    <span className="text-xs text-gray-400 ml-2">FitTech Startup</span>
                                </div>
                                <Button variant="primary" size="sm">Apply</Button>
                            </div>
                        </div>
                        
                        <div className="p-4 border border-gray-800 rounded-lg hover:border-custom-cyan transition-colors">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="font-medium text-white">UI/UX Design for SaaS</h3>
                                    <p className="text-sm text-gray-400 mt-1">Design user interfaces for a new SaaS platform</p>
                                </div>
                                <div className="bg-custom-orange/20 text-custom-orange text-xs px-2 py-1 rounded-full h-fit">
                                    Figma
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-gray-700"></div>
                                    <span className="text-xs text-gray-400 ml-2">CloudSoft Inc.</span>
                                </div>
                                <Button variant="primary" size="sm">Apply</Button>
                            </div>
                        </div>
                    </div>
                </Card>
                
                <Card className="border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Your Applications</h2>
                    </div>
                    
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-white font-medium">No applications yet</h3>
                        <p className="text-gray-400 text-sm mt-1">Start applying to projects to build your portfolio</p>
                        <Button variant="outline" className="mt-4 border-custom-cyan text-custom-cyan">
                            Browse Projects
                        </Button>
                    </div>
                </Card>
            </div>
            
            <div className="space-y-6">
                <Card className="border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Your Profile</h2>
                        <Button variant="ghost" size="sm" className="text-custom-cyan">
                            Edit
                        </Button>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full bg-gray-700 mb-4"></div>
                        <h3 className="text-white font-medium">Your Name</h3>
                        <p className="text-gray-400 text-sm">Student</p>
                        
                        <div className="w-full border-t border-gray-800 my-4 pt-4">
                            <h4 className="text-sm font-medium text-white mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-custom-cyan/20 text-custom-cyan text-xs px-2 py-1 rounded-full">
                                    React
                                </span>
                                <span className="bg-custom-purple/20 text-custom-purple text-xs px-2 py-1 rounded-full">
                                    TypeScript
                                </span>
                                <span className="bg-custom-orange/20 text-custom-orange text-xs px-2 py-1 rounded-full">
                                    UI Design
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
                
                <Card className="border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors">
                                <Search className="h-4 w-4 mr-2" />
                                <span>Browse Projects</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Find Startups</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span>Learning Resources</span>
                            </a>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

const FounderDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card className="border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Your Projects</h2>
                        <Button variant="primary" size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Project
                        </Button>
                    </div>
                    
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-white font-medium">No projects yet</h3>
                        <p className="text-gray-400 text-sm mt-1">Create your first project to find talented students</p>
                        <Button variant="primary" className="mt-4">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Project
                        </Button>
                    </div>
                </Card>
                
                <Card className="border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
                    </div>
                    
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                            <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-white font-medium">No applications yet</h3>
                        <p className="text-gray-400 text-sm mt-1">Create a project to start receiving applications</p>
                    </div>
                </Card>
            </div>
            
            <div className="space-y-6">
                <Card className="border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Your Profile</h2>
                        <Button variant="ghost" size="sm" className="text-custom-cyan">
                            Edit
                        </Button>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full bg-gray-700 mb-4"></div>
                        <h3 className="text-white font-medium">Your Startup</h3>
                        <p className="text-gray-400 text-sm">Founder</p>
                        
                        <div className="w-full border-t border-gray-800 my-4 pt-4">
                            <h4 className="text-sm font-medium text-white mb-2">About</h4>
                            <p className="text-gray-400 text-sm">
                                Add information about your startup to attract talented students.
                            </p>
                        </div>
                    </div>
                </Card>
                
                <Card className="border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-custom-cyan/20 mb-2 mx-auto">
                                <Briefcase className="h-5 w-5 text-custom-cyan" />
                            </div>
                            <p className="text-2xl font-bold text-white text-center">0</p>
                            <p className="text-xs text-gray-400 text-center">Active Projects</p>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-custom-orange/20 mb-2 mx-auto">
                                <Users className="h-5 w-5 text-custom-orange" />
                            </div>
                            <p className="text-2xl font-bold text-white text-center">0</p>
                            <p className="text-xs text-gray-400 text-center">Applications</p>
                        </div>
                    </div>
                </Card>
                
                <Card className="border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                <span>Create Project</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Browse Students</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-gray-400 hover:text-custom-cyan transition-colors">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                <span>Project Analytics</span>
                            </a>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard; 