'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Rating } from '@/components/product/Rating';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 0,
  reviews = 0,
  badge,
  onAddToCart,
}: ProductCardProps) {
  const [isHovering, setIsHovering] = React.useState(false);
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        'bg-white rounded-lg overflow-hidden transition-all duration-300',
        isHovering ? 'shadow-lg' : 'shadow-sm'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 bg-neutral-100 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className={cn(
            'object-cover transition-transform duration-500',
            isHovering ? 'scale-105' : 'scale-100'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge */}
        {badge && (
          <Badge variant="sale" value={`-${discountPercent}%`} />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className={cn(
          'font-semibold text-base text-neutral-900 min-h-12 overflow-hidden',
          'transition-colors duration-300',
          isHovering ? 'text-primary' : ''
        )}>
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <Rating rating={rating} reviews={reviews} />
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-black text-cta">
            ${price.toLocaleString('es-CO')}
          </span>
          {originalPrice && (
            <span className="text-sm text-neutral-500 line-through">
              ${originalPrice.toLocaleString('es-CO')}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onAddToCart?.(id)}
          className={cn(
            'w-full mt-4 py-3 px-4 bg-cta text-white font-bold rounded-full',
            'transition-all duration-300 hover:bg-cta-700 active:scale-95',
            'text-sm'
          )}
        >
          AGREGAR
        </button>
      </div>
    </div>
  );
}
