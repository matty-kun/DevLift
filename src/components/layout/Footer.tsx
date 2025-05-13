import React from "react";
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-neutral-900 text-neutral-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols01 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Logo and Description */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center">
                            <span className="text-white text-2xl font-bold">Dev<span className="text-accent-400">Lift</span></span>
                        </Link>
                        <p className="mt-4 text-neutral-400 max-w-md">
                            Connecting students with real-world startup projects and innovative founders to build skills, experience, and professional networks.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5"/>
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5"/>
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5"/>
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5"/>
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5"/>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-white font-medium text-lg mb-4">For Students</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/projects" className="text-neutral-400 hover:text-white transition-colors">
                                    Browse Projects
                                </Link>
                            </li>
                            <li>
                                <Link to="/startups" className="text-neutral-400 hover:text-white transition-colors">
                                    Find Startups
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-neutral-400 hover:text-white transition-colors">
                                    Learning Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/portfolio" className="text-neutral-400 hover:text-white transition-colors">
                                    Build Portfolio
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium text-lg mb-4">For Founders</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/post-project" className="text-neutral-400 hover:text-white transition-colors">
                                    Post a Project
                                </Link>
                            </li>
                            <li>
                                <Link to="/founder-guide" className="text-neutral-400 hover:text-white transition-colors">
                                    Founder Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link to="/success-stories" className="text-neutral-400 hover:text-white transition-colors">
                                    Success Stories
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq-founders" className="text-neutral-400 hover:text-white transition-colors">
                                    FAQs for Founders
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium text-lg mg-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="text-neutral-400 hover:text-white transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-8 border-neutral-800"/>

                <div className="flex flex-col md:glex-row justify-between items-center">
                    <p className="text-neutral-500 text-sm">
                        &copy; {new Date().getFullYear()} DevLift. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link to="/privacy" className="text-neutral-500 hover:text-white text-sm transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-neutral-500 hover:text-white text-sm transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="text-neutral-500 hover:text-white text-sm transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;