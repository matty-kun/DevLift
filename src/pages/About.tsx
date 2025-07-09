import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const About: React.FC = () => (
  <div className="min-h-screen bg-black py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">About <span className="text-custom-cyan">Dev</span><span className="text-custom-orange">Lift</span></h1>
        <p className="text-lg text-white">Empowering students and startups to build the future together.</p>
      </div>
      <div className="bg-black/80 rounded-xl shadow-lg p-8 border border-custom-cyan mb-8">
        <h2 className="text-2xl font-semibold text-custom-orange mb-4">Our Mission</h2>
        <p className="text-white mb-4">
          To empower student-builders and startup founders to co-create real products, gain experience, and grow together through meaningful collaboration.
        </p>
        <h2 className="text-2xl font-semibold text-custom-purple mb-4 mt-8">Our Vision</h2>
        <p className="text-white mb-4">
          To become the world's leading platform for building the next generation of innovators, creating a world where anyone with an idea can build and anyone with skills can grow - no matter where they start.
        </p>
        <h2 className="text-2xl font-semibold text-custom-cyan mb-4 mt-8">Core Values</h2>
        <ul className="list-disc pl-6 text-white space-y-4 mb-4">
          <li>
            <span className="font-bold">Build with Purpose:</span> <span className="italic">We don't just ship features — we solve real problems. Every line of code, every message sent, and every project started has a reason behind it.</span>
          </li>
          <li>
            <span className="font-bold">Grow through Action:</span> <span className="italic">We learn by doing. We believe that real growth happens through execution — building, failing, and iterating quickly.</span>
          </li>
          <li>
            <span className="font-bold">Radical Collaboration:</span> <span className="italic">We create together, not just work together. Founders and students co-own outcomes, not just tasks.</span>
          </li>
          <li>
            <span className="font-bold">Be Resourceful, Be a Builder:</span> <span className="italic">We don't wait for perfect conditions. We solve problems with what we have — creatively and relentlessly.</span>
          </li>
          <li>
            <span className="font-bold">Earn Trust, Always:</span> <span className="italic">We lead with transparency, respect, and honesty. Whether you're a founder, a student, or a teammate — we do what's right, even when it's hard.</span>
          </li>
        </ul>
      </div>
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
