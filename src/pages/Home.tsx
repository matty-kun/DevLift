import React from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

const Home: React.FC = () => {
    const homeActionButtons = (
        <div className="flex items-center gap-4">
            <Button to="/sign-in" variant="outline">Sign In</Button>
            <Button to="/sign-up" variant="primary">Sign Up</Button>
        </div>
    );

    return (
        <div className="bg-black">
            <Navbar actionButtons={homeActionButtons} />
            <Hero />
            <HowItWorks />
            <FeaturedProjects />
            <Testimonials />
            <CallToAction />
            <Footer />
        </div>
    );
};

export default Home;
