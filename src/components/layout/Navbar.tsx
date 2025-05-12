import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MessageSquare, Bell, User, Search, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn] = useState(false); // Placeholder for authentication state

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <span className="text-primary-600 text-2xl font-bold">Dev<span className="text-accent-500">Lift</span></span>
                    </Link>
                </div>
                    
                {/* Desktop Navigation */} 
                <nav className="hidden md:flex items-center space-x-1">
                    <Link to="/projects" className="px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors">
                        Browse Projects
                    </Link>
                    <Link to="/startups" className="px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors">
                        Find Startups
                    </Link>
                    <div className="relative group">
                        <button className="px-3 py-2 text-neutral-700 hover:text-primary-600 hover:bg-neutral-60 rounded-lg transition-colors flex items-center">
                            Resources
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                    
                        <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-medium bg0white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-top-left">
                            <div className="py-2">
                                <Link to="/resources/guides" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600">
                                    Student Guides
                                </Link>
                                <Link to="/resources/templates" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600">
                                    Project Templates
                                </Link>
                                <Link to="/resources/learning" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600">
                                    Learning Resources
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Right Side Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <button className="text-neutral-600 hover:text-primary-600 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                                <Search className="h-5 w-5" />
                            </button>
                            <button className="text-neutral-600 hover:text-primary-600 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </button>
                            <button className="text-neutral-600 hover:text-primary-600 p-2 rounded-full hover:bg-neutral-100 transition-colors">
                                <Bell className="h-5 w-5" />
                            </button>
                            <div className="relative group">
                                <button className="flex items-center focus:outline-none">
                                    <Avatar size="sm" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" status="online" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-medium bg-white invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-top right">
                                    <div className="py-1">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover-text-primary-600">
                                            Your Profile
                                        </Link>
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600">
                                            Dashboard
                                        </Link>
                                        <Link>
                                        </Link>
                                    </div>

                                </div>

                            </div>
                        </>
                    )}

                </div>
            </div>
        </header>
    )
}