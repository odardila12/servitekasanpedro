'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Categories() {
  const categoryIcons: Record<string, string> = {
    llantas: '🛞',
    baterias: '🔋',
    lubricantes: '🛢️',
    accesorios: '🔧',
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            Nuestras Categorías
          </h2>
          <p className="text-neutral-600 text-lg">
            Explora nuestras principales categorías de productos
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <a
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className={cn(
                'group flex flex-col items-center justify-center p-6 sm:p-8',
                'bg-neutral-50 rounded-lg hover:bg-primary-50',
                'transition-all duration-300 hover:shadow-lg'
              )}
            >
              {/* Icon */}
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.slug] || '📦'}
              </div>

              {/* Name */}
              <h3 className="font-bold text-center text-neutral-900 group-hover:text-primary transition-colors">
                {category.name}
              </h3>

              {/* Count */}
              <p className="text-sm text-neutral-500 mt-2">
                {category.count} productos
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
