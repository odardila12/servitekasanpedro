'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Brand {
  name: string;
  logo: string;
}

const DEFAULT_BRANDS: Brand[] = [
  { name: 'Michelin', logo: '🏆' },
  { name: 'Bridgestone', logo: '🛣️' },
  { name: 'Continental', logo: '🌍' },
  { name: 'Pirelli', logo: '🔴' },
  { name: 'Goodyear', logo: '✈️' },
  { name: 'Bosch', logo: '⚡' },
  { name: 'Moura', logo: '🔋' },
  { name: 'Varta', logo: '💪' },
  { name: 'Castrol', logo: '🛢️' },
  { name: 'Shell', logo: '🐚' },
  { name: 'Mobil', logo: '🚗' },
  { name: 'Pennzoil', logo: '⭐' },
];

interface BrandSectionProps {
  brands?: Brand[];
}

export function BrandSection({ brands = DEFAULT_BRANDS }: BrandSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
            Marcas que Confiamos
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
            Trabajamos con las mejores marcas automotrices del mundo para garantizar calidad y durabilidad en cada producto.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-col items-center justify-center p-6 sm:p-8',
                'bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl',
                'border border-slate-200/50 hover:border-[#FFB81C]/50',
                'shadow-sm hover:shadow-md',
                'transition-all duration-200 hover:scale-105 hover:-translate-y-2',
                'group cursor-pointer'
              )}
            >
              {/* Logo/Icon */}
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                {brand.logo}
              </div>

              {/* Brand Name */}
              <h3 className="font-semibold text-sm sm:text-base text-center text-[#0F3E99] group-hover:text-[#FFB81C] transition-colors duration-200">
                {brand.name}
              </h3>

              {/* Decorative accent */}
              <div className="w-0 h-0.5 bg-[#FFB81C] mt-3 sm:mt-4 group-hover:w-full transition-all duration-200" />
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-neutral-600 text-sm sm:text-base">
            <span className="font-semibold text-[#0F3E99]">+10 años</span> de experiencia distribuyendo productos de marcas líderes en el mercado automotriz.
          </p>
        </div>
      </div>
    </section>
  );
}
