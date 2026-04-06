'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (id: string) => void;
  className?: string;
}

export function ProductGrid({ products, onAddToCart, className }: ProductGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      'gap-2 lg:gap-5',
      className
    )}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
        >
          <ProductCard
            {...product}
            onAddToCart={onAddToCart}
          />
        </div>
      ))}
    </div>
  );
}
