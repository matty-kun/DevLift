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
                        <p></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}