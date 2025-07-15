import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Quote, Star } from 'lucide-react';
import Avatar from '../common/Avatar';

interface Testimonial {
  id: string;
  content: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: '1',
        content: "I am a student too, and I wanted something real, not just academics. I am tired of feeling unprepared — despite all the grades. It started with frustration. It grew into a mission.",
        name: "Jan Matthew Vargas",
        role: "Computer Science Student-Founder",
        avatar: "https://scontent.fmnl33-5.fna.fbcdn.net/v/t39.30808-6/517747093_715434427865520_5616217978803779133_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGiEHBQq41lTJrhT5puug2JGhI_zs5jbDMaEj_OzmNsMw_VqQwE3ioDugcuM6umIkJ3RxziNjoBeb26Ne22SxuK&_nc_ohc=uIip0BTRh18Q7kNvwHUplqp&_nc_oc=AdloHDF3gwqijv1rlrMAwLGk4f1g7WKVt2QIREz0rhNrzdn2x86lNA_7Bm6mCqTD_DU&_nc_zt=23&_nc_ht=scontent.fmnl33-5.fna&_nc_gid=C7Nzd9BoRXe-nFhTOYXcCg&oh=00_AfTJvCXWCXSyJ469q6l-wIBdPsrpjg5UOl5REjEnSPbkBg&oe=687BD954",
        rating: 5,
      },
      {
        id: '2',
        content: "The path of startup we choose, for we've seen knowledge in classrooms can lose. Experience we seek, for knowledge alone won’t bring us to peak.",
        name: "Vince Maganaka",
        role: "Mechanical Engineer Student-Founder",
        avatar: "https://scontent.fcgy1-2.fna.fbcdn.net/v/t1.15752-9/518075110_765121679503912_4710610163261059985_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGPNNdKMFqqKoerJzKzDbuIpTORfzrrPC2lM5F_Ous8LYYasDc-OphWqvM_FNOKNdHwQ4PFaYuTA4g-FML9sq4D&_nc_ohc=w-0FI7ig1w4Q7kNvwFmPRBQ&_nc_oc=AdkCkRV_l_ToQ2i_Em0gUWRxRLKh1-iF2SUPpSQnFRpayw7fB1EQ_Iq7L8zB5d6mRM2WdcRutSJHHxHufikibbTB&_nc_zt=23&_nc_ht=scontent.fcgy1-2.fna&oh=03_Q7cD2wHrJ9dCWrtHlfvoOIVYDsOHJkdfExJ-V4vDr-E8NLQXdg&oe=689DD4DA",
        rating: 5,
      },
      {
        id: '3',
        content: "I used to feel stuck, tired of learning theories that didn’t help me in real life. But now, I’m finally gaining the skills that matter, and for once, I feel ready for what’s ahead.",
        name: "Erich Kaye Camagos",
        role: "Business Administration Student-Founder",
        avatar: "https://scontent.fmnl13-2.fna.fbcdn.net/v/t1.15752-9/516161461_1274769343996911_4756708407528807557_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeG3V7FKbPOGg1_UppPr6d67M-ewHbzMA7Yz57AdvMwDtkhNaTTEp0dllYkd1A1lt3UfZL_MYqbMIfzsxwzMVoGc&_nc_ohc=oiv4YeDYYqwQ7kNvwE7mrLu&_nc_oc=AdlwWzulc9LDtp9JWDiQpgItX5xKsoPfvRjXB9vBrTMJDJFSUdmYtEUosiPx4Tun497dW4oEuuIwlyMLXYT7cHu5&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&oh=03_Q7cD2wFGwc_Gx5gdwMkCdrmirrfpE8ZanQ5vEdjM3GDYZZofPQ&oe=689DC03B",
        rating: 4,
      },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const Testimonials: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const imageIndex = (page % testimonials.length + testimonials.length) % testimonials.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-50">Why are we doing this?</h2>
          <p className="mt-4 text-xl text-primary-200">
            Let us tell you why this matters to us and to thousands of students like you.
          </p>
        </div>

        <div className="relative">
          <div className="max-w-3xl mx-auto">
            <div className="relative h-[26rem] flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -10000) {
                      paginate(1);
                    } else if (swipe > 10000) {
                      paginate(-1);
                    }
                  }}
                  className="w-full absolute"
                >
                  <div className="w-full flex-shrink-0 px-4">
                    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-medium relative overflow-hidden">
                        <Quote className="absolute top-6 left-6 w-12 h-12 text-neutral-700/50" />
                        <div className="relative z-10">
                            
                            <p className="text-lg font-light italic leading-relaxed mb-6 text-neutral-200 h-32 overflow-y-auto">
                            "{testimonials[imageIndex].content}"
                            </p>
                            <div className="flex items-center">
                                <Avatar
                                    src={testimonials[imageIndex].avatar}
                                    alt={testimonials[imageIndex].name}
                                    size="lg"
                                />
                                <div className="ml-4 text-left">
                                    <p className="font-semibold text-lg text-white">{testimonials[imageIndex].name}</p>
                                    <p className="text-sm text-primary-300">{testimonials[imageIndex].role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    imageIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                  onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center">
              <button
                onClick={() => paginate(-1)}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors -ml-2"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => paginate(1)}
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