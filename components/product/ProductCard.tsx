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
        'bg-white rounded-3xl overflow-hidden transition-all duration-200',
        'shadow-sm hover:shadow-lg hover:-translate-y-2',
        'flex flex-col h-full'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 bg-neutral-100 overflow-hidden group shrink-0">
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
          <div className="absolute top-3 right-3 bg-[#0F3E99] text-[#FFB81C] text-xs font-bold px-3 py-2 rounded-full shadow-md z-10">
            x{cartItem.quantity}
          </div>
        )}


      </div>



      {/* Content */}
      <div className={cn('px-6 pb-6 flex flex-col flex-1', hasMultipleImages ? 'pt-4' : 'pt-6')}>
        {/* Product Name */}
        <h3 className={cn(
          'font-semibold text-base text-neutral-900 min-h-12',
          'transition-colors duration-200',
          isHovering ? 'text-[#0F3E99]' : ''
        )}
        style={{ letterSpacing: '0.01em' }}>
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <Rating rating={rating} reviews={reviews} />
        )}

        {/* Price */}
        <div className="mt-auto pt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-[#0F3E99]">
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
            'w-full mt-6 py-4 px-4 font-bold rounded-2xl',
            'transition-all duration-200 active:scale-95 text-sm',
            justAdded
              ? 'bg-green-500 text-white shadow-md'
              : inCart
              ? 'bg-[#0F3E99] text-[#FFB81C] hover:bg-opacity-90 shadow-md'
              : 'bg-[#FFB81C] text-[#0F3E99] hover:bg-opacity-90 hover:shadow-md'
          )}
          style={{ letterSpacing: '0.02em' }}
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
