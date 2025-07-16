import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import sign from '../../assets/DevLift Sign.svg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-neutral-900 text-neutral-300 py-16">
      <div className="container mx-auto px-4 py-8 border-t border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center">
              <img src={sign} alt="DevLift Sign" className="h-8 w-auto mr-2" />
              <span className="text-custom-cyan text-2xl font-bold">Dev<span className="text-custom-orange">Lift</span></span>
            </Link>
            <p className="mt-4 text-neutral-50 max-w-md">
              Connecting students with real-world startup projects and innovative founders to build skills, experience, and professional networks.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@devlift.com" className="text-neutral-400 hover:text-white transition-colors">
                  info@devlift.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-neutral-400 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <p className="text-neutral-400">
                  123 DevLift Street, Startup City, SC 12345
                </p>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-neutral-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} DevLift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;