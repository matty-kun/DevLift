import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, max = 5 }) => {
  const [hovered, setHovered] = React.useState<number | null>(null);
  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              (hovered !== null ? star <= hovered : star <= value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-neutral-500'
            }`}
            fill={(hovered !== null ? star <= hovered : star <= value) ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
