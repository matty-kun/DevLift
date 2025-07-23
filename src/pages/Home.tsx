import React from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';
import Community from './Community';

const Home: React.FC = () => {
    return (
        <div className="bg-black">
            <Hero />
            <HowItWorks />
            <FeaturedProjects />
            <Testimonials />
            <Community />
            <CallToAction />
        </div>
    );
};

export default Home;