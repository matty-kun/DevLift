import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import sign from '../../assets/DevLift Sign.svg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-neutral-900 text-neutral-300 py-10">

        <hr className="my-8 border-neutral-800" />

        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} DevLift. All rights reserved.
          </p>
        </div>
    </footer>
  );
};

export default Footer;