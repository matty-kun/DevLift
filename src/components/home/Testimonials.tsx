import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import Avatar from '../common/Avatar';

interface Testimonial {
  id: string;
  content: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  {/* These are just sample testimonials */}
  const testimonials: Testimonial[] = [
    {
      id: '1',
      content: "Working on real-world projects through ProjectConnect completely transformed my job prospects. I built actual experience that made my resume stand out, and my mentor became an invaluable connection who eventually recommended me for my first job.",
      name: "Alex Johnson",
      role: "Computer Science Student",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
    },
    {
      id: '2',
      content: "As a mentor, I've found incredible satisfaction in guiding students through real-world challenges. The platform makes it easy to find talented, motivated students who bring fresh perspectives to projects while gaining practical experience.",
      name: "Priya Sharma",
      role: "Senior Product Manager at TechCorp",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 5,
    },
    {
      id: '3',
      content: "My university education gave me theory, but ProjectConnect gave me practice. The e-commerce app I built with my mentor's guidance became the centerpiece of my portfolio and impressed every interviewer I met.",
      name: "Marcus Williams",
      role: "Recent Graduate, now Frontend Developer",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      rating: 4,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-50">What Our Community Says</h2>
          <p className="mt-4 text-xl text-primary-200">
            Real stories from students and mentors who've experienced the power of project-based learning.
          </p>
        </div>

        <div className="relative">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-soft">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-lg leading-relaxed mb-6 text-center">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center justify-center">
                        <Avatar 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          size="md"
                        />
                        <div className="ml-3 text-center sm:text-left">
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-primary-200">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center">
              <button
                onClick={prevTestimonial}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors -ml-2"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors -mr-2"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;