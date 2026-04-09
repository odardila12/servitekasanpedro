'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Rating } from '@/components/product/Rating';
import { useCart } from '@/lib/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
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
  slug,
  price,
  originalPrice,
  image,
  images,
  rating = 0,
  reviews = 0,
  badge,
  priority = false,
}: ProductCardProps) {
  const { items, addToCart, openCart, updateQuantity, removeFromCart } = useCart();
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
    openCart();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  function handleDecreaseQuantity() {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(id, cartItem.quantity - 1);
      } else {
        removeFromCart(id);
      }
    }
  }

  function handleIncreaseQuantity() {
    if (cartItem) {
      updateQuantity(id, cartItem.quantity + 1);
    }
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
    <Link href={`/productos/${slug}`}>
      <div
        className={cn(
          'bg-white rounded-3xl overflow-hidden transition-all duration-200',
          'shadow-sm hover:shadow-lg hover:-translate-y-2',
          'flex flex-col h-full cursor-pointer'
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
      {/* Image Container */}
      <div className="relative h-44 bg-neutral-100 overflow-hidden group shrink-0">
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
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
      <div className={cn('px-4 pb-4 flex flex-col flex-1', hasMultipleImages ? 'pt-3' : 'pt-4')}>
        {/* Product Name */}
        <h3 className={cn(
          'font-semibold text-sm text-neutral-900 line-clamp-2 min-h-10',
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
        <div className="mt-auto pt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold text-[#0F3E99]">
            ${price.toLocaleString('es-CO')}
          </span>
          {originalPrice && (
            <span className="text-xs text-neutral-500 line-through">
              ${originalPrice.toLocaleString('es-CO')}
            </span>
          )}
        </div>

        {/* CTA Button or Quantity Controls */}
        {!inCart ? (
          <button
            onClick={handleAddToCart}
            className={cn(
              'w-full mt-3 py-3 px-4 font-bold rounded-2xl',
              'transition-all duration-200 active:scale-95 text-sm',
              justAdded
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-[#FFB81C] text-[#0F3E99] hover:bg-opacity-90 hover:shadow-md'
            )}
            style={{ letterSpacing: '0.02em' }}
          >
            {justAdded ? '✓ AGREGADO' : 'AGREGAR'}
          </button>
        ) : (
          /* Inline quantity controls */
          <div className="w-full mt-3 flex items-center gap-2 bg-[#0F3E99] rounded-2xl p-2 border border-[#FFB81C]/40">
            <button
              onClick={handleDecreaseQuantity}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#062854] text-[#FFB81C] font-bold hover:bg-[#FFB81C] hover:text-[#0F3E99] transition-colors duration-200 rounded-lg text-lg leading-none"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="flex-1 text-center text-white font-bold text-base bg-[#062854] py-2 px-2 rounded-lg">
              {cartItem.quantity}
            </span>
            <button
              onClick={handleIncreaseQuantity}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#062854] text-[#FFB81C] font-bold hover:bg-[#FFB81C] hover:text-[#0F3E99] transition-colors duration-200 rounded-lg text-lg leading-none"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        )}
      </div>
      </div>
    </Link>
  );
}
