import React from 'react';
import Star from '../common/StarRating';

interface Review {
  id: number;
  founder: string;
  rating: number;
  review: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-custom-cyan mb-3">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="bg-neutral-800 rounded-lg p-8 text-center">
          <p className="text-neutral-400">No reviews yet. Be the first to leave a review!</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {reviews.map(r => (
            <li key={r.id} className="bg-neutral-800 rounded-lg p-6 flex gap-4">
              <img 
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${r.founder}`}
                alt={r.founder}
                className="h-12 w-12 rounded-full object-cover border-2 border-custom-cyan/50"
              />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-lg text-white">{r.founder}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
                        fill={i < r.rating ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-neutral-300 leading-relaxed">{r.review}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsSection;