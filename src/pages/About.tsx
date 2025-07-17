import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import VisionAndMission from '../components/home/VisionAndMission';

const About: React.FC = () => (
  <div className="min-h-screen bg-black py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">About <span className="text-custom-cyan">Dev</span><span className="text-custom-orange">Lift</span></h1>
        <p className="text-lg text-white">Empowering students and startups to build the future together.</p>
      </div>
      <VisionAndMission />
      <div className="bg-black/80 rounded-xl shadow-lg p-8 border border-custom-purple mb-8">
        <h2 className="text-2xl font-semibold text-custom-cyan mb-4">Meet the Team</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Founder" className="w-20 h-20 rounded-full object-cover border-2 border-custom-cyan mb-2" />
            <span className="text-white font-bold">Matthew Vargas</span>
            <span className="text-custom-cyan text-sm">Chief Executive Officer</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Co-Founder" className="w-20 h-20 rounded-full object-cover border-2 border-custom-orange mb-2" />
            <span className="text-white font-bold">Vince Maganaka</span>
            <span className="text-custom-orange text-sm">Chief Operations Officer</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Community Lead" className="w-20 h-20 rounded-full object-cover border-2 border-custom-purple mb-2" />
            <span className="text-white font-bold">Kaye Camagos</span>
            <span className="text-custom-purple text-sm">Chief Business Officer</span>
          </div>
        </div>
      </div>
      <div className="bg-black/80 rounded-xl shadow-lg p-8 border border-custom-orange">
        <h2 className="text-2xl font-semibold text-custom-purple mb-4">Contact Us</h2>
        <div className="space-y-4 text-white">
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-custom-cyan" />
            <a href="mailto:contact@devlift.com" className="hover:text-custom-cyan transition-colors">contact@devlift.com</a>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-custom-orange" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-custom-purple" />
            <span>123 Innovation Drive, Tech City, 12345</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
