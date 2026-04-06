'use client';

interface RatingProps {
  rating: number;
  reviews: number;
}

export function Rating({ rating, reviews }: RatingProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < Math.round(rating) ? 'text-primary text-lg' : 'text-neutral-300 text-lg'}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-neutral-500">({reviews})</span>
    </div>
  );
}
