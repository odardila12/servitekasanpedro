'use client';

import React from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FEATURED_PRODUCTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function FeaturedProducts({
  title = 'Productos Destacados',
  subtitle = 'Nuestras ofertas especiales del mes',
  limit = 6,
}: FeaturedProductsProps) {
  const featured = FEATURED_PRODUCTS.slice(0, limit).map((p) => ({
    ...p,
    originalPrice: p.originalPrice ?? undefined,
    badge: p.badge ?? undefined,
  }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={featured}
          onAddToCart={(id) => console.log(`Added to cart: ${id}`)}
        />

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="/productos"
            className={cn(
              'inline-block px-8 py-3 border-2 border-primary text-primary',
              'rounded-full font-bold hover:bg-primary-50',
              'transition-colors duration-300'
            )}
          >
            Ver Todos los Productos
          </a>
        </div>
      </div>
    </section>
  );
}
