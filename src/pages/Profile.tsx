import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { Calendar, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react';

const Profile: React.FC = () => {
    const { id } = useParams();

    // This would be replaced with actual data fetching from Supabase
    const profile = {
        name: "Alex Johnson",
        role: "Student",
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
        bio: "Computer Science student passionate about web development and AI. Currently building real-world experience through startup collaborations.",
        location: "San Francisco, CA",
        education: "BS Computer Science, Stanford University",
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
        projects: [
        {
            title: "E-Commerce Platform",
            status: "Completed",
            role: "Frontend Developer",
        },
        {
            title: "AI Chatbot Integration",
            status: "In Progress",
            role: "Full Stack Developer",
        }
        ]
    };


    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header*/}
            <Card className="mb-8">

            </Card>
          </div>
        </div>
      </div>
    )

};   
