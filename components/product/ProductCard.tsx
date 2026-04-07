'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Rating } from '@/components/product/Rating';
import { useCart } from '@/lib/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  badge?: string;
  /** @deprecated — cart is managed via CartContext; this prop is ignored */
  onAddToCart?: (id: string) => void;
  priority?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  images,
  rating = 0,
  reviews = 0,
  badge,
  priority = false,
}: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [isHovering, setIsHovering] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

  const galleryImages = images && images.length > 0 ? images : [image];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const cartItem = items.find((item) => item.id === id);
  const inCart = !!cartItem;

  function handleAddToCart() {
    addToCart({ id, name, price, image });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  const goToIndex = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToIndex((activeIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToIndex((activeIndex + 1) % galleryImages.length);
  };

  const hasMultipleImages = galleryImages.length > 1;

  return (
    <div
      className={cn(
        'bg-white rounded-2xl overflow-hidden transition-all duration-300',
        'shadow-md hover:shadow-xl hover:-translate-y-1'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 bg-neutral-100 overflow-hidden group">
        <Image
          src={galleryImages[activeIndex]}
          alt={`${name} - imagen ${activeIndex + 1}`}
          fill
          priority={priority}
          className={cn(
            'object-cover transition-all duration-300',
            isHovering && !isTransitioning ? 'scale-105' : 'scale-100',
            isTransitioning ? 'opacity-0' : 'opacity-100'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge */}
        {badge && (
          <Badge variant="sale" value={`-${discountPercent}%`} />
        )}

        {/* In-cart indicator */}
        {inCart && (
          <div className="absolute top-2 right-2 bg-[#1a3a52] text-[#f4c430] text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
            x{cartItem.quantity}
          </div>
        )}

        {/* Arrow navigation */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goPrev}
              aria-label="Imagen anterior"
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 z-10',
                'w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm',
                'flex items-center justify-center shadow-md',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                'hover:bg-white active:scale-90 text-[#1a3a52] font-bold text-lg leading-none'
              )}
            >
              &#8249;
            </button>
            <button
              onClick={goNext}
              aria-label="Imagen siguiente"
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 z-10',
                'w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm',
                'flex items-center justify-center shadow-md',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                'hover:bg-white active:scale-90 text-[#1a3a52] font-bold text-lg leading-none'
              )}
            >
              &#8250;
            </button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goToIndex(i); }}
                aria-label={`Ver imagen ${i + 1}`}
                className={cn(
                  'rounded-full transition-all duration-200',
                  i === activeIndex
                    ? 'w-4 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        )}
      </div>



      {/* Content */}
      <div className={cn('px-5 pb-5', hasMultipleImages ? 'pt-3' : 'pt-5')}>
        {/* Product Name */}
        <h3 className={cn(
          'font-semibold text-base text-neutral-900 min-h-12',
          'transition-colors duration-300',
          isHovering ? 'text-[#1a3a52]' : ''
        )}>
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <Rating rating={rating} reviews={reviews} />
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-black text-[#1a3a52]">
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
          onClick={handleAddToCart}
          className={cn(
            'w-full mt-4 py-3 px-4 font-bold rounded-xl',
            'transition-all duration-300 active:scale-95 text-sm',
            justAdded
              ? 'bg-green-500 text-white shadow-md shadow-green-200'
              : inCart
              ? 'bg-[#1a3a52] text-[#f4c430] hover:bg-[#0d2233] shadow-md'
              : 'bg-[#f4c430] text-[#1a3a52] hover:bg-[#e3b52d] hover:shadow-md'
          )}
        >
          {justAdded
            ? '✓ AGREGADO'
            : inCart
            ? `EN CARRITO (${cartItem.quantity})`
            : 'AGREGAR'}
        </button>
      </div>
    </div>
  );
}
