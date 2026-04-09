import { Star } from 'lucide-react';
import type { ProductReview } from '@/lib/types';

interface StarRatingProps {
  rating: number;
  size?: number;
}

function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-[#fca50f] text-[#fca50f]' : 'fill-neutral-200 text-neutral-200'}
        />
      ))}
    </div>
  );
}

interface ProductReviewsProps {
  reviews: ProductReview[];
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-3">Reseñas de clientes</h2>
        <p className="text-neutral-500 text-sm">No hay reseñas aún. ¡Sé el primero en opinar!</p>
      </div>
    );
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedAvg = Math.round(avgRating * 10) / 10;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Reseñas de clientes</h2>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
        <div className="text-center">
          <p className="text-4xl font-black text-neutral-900">{roundedAvg}</p>
          <StarRating rating={Math.round(avgRating)} size={18} />
          <p className="text-xs text-neutral-500 mt-1">{reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-semibold text-neutral-800 text-sm">{review.author}</p>
                <StarRating rating={review.rating} size={14} />
              </div>
              <time className="text-xs text-neutral-400 shrink-0">
                {new Date(review.date + 'T00:00:00').toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
