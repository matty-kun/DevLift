import React from 'react';

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
          DevLift connects ambitious students with innovative startup founders, providing real-world experience and accelerating product development. We believe in hands-on learning, collaboration, and building a supportive tech community.
        </p>
        <h2 className="text-2xl font-semibold text-custom-purple mb-4 mt-8">Our Vision</h2>
        <p className="text-white mb-4">
          To become the leading platform where students launch their careers and startups find the talent they need to grow. We envision a world where learning and building go hand in hand, and everyone has the opportunity to make an impact.
        </p>
      </div>
      <div className="bg-black/80 rounded-xl shadow-lg p-8 border border-custom-purple">
        <h2 className="text-2xl font-semibold text-custom-cyan mb-4">Meet the Team</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Founder" className="w-20 h-20 rounded-full object-cover border-2 border-custom-cyan mb-2" />
            <span className="text-white font-bold">Matthew Vargas</span>
            <span className="text-custom-cyan text-sm">Product & Vision</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Co-Founder" className="w-20 h-20 rounded-full object-cover border-2 border-custom-orange mb-2" />
            <span className="text-white font-bold">Vince Maganaka</span>
            <span className="text-custom-orange text-sm">Engineering</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Community Lead" className="w-20 h-20 rounded-full object-cover border-2 border-custom-purple mb-2" />
            <span className="text-white font-bold">Kaye Camagos</span>
            <span className="text-custom-purple text-sm">Community</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;
