'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Categories() {
  const categoryIcons: Record<string, string> = {
    llantas: '🛞',
    baterias: '🔋',
    lubricantes: '🛢️',
    servicios: '🔧',
    filtros: '🔩',
    aceites: '🫙',
  };

  const filteredCategories = CATEGORIES;

  return (
    <section className="py-12 sm:py-16 bg-slate-50">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((category) => (
            <a
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className={cn(
                'group flex flex-col items-center justify-center p-8 sm:p-10 relative overflow-hidden',
                'bg-white/70 backdrop-blur-md border border-white/50 rounded-xl',
                'shadow-sm hover:shadow-lg',
                'transition-transform duration-200 hover:scale-105'
              )}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Decorative border */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FFB81C] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

              {/* Icon */}
              <div className="text-5xl sm:text-6xl mb-6 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200 filter drop-shadow-md">
                {categoryIcons[category.slug] || '📦'}
              </div>

              {/* Name */}
              <h3 className="font-bold text-lg text-center text-[#0F3E99] transition-colors relative z-10 tracking-tight">
                {category.name}
              </h3>

              {/* Count */}
              <p className="text-sm font-medium text-slate-500 mt-3 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all duration-200 relative z-10">
                {category.count} productos
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
