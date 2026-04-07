'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { PriceRangeFilter } from '@/components/filters/PriceRangeFilter';

interface FilterSidebarProps {
  onFilterChange?: (filters: Record<string, unknown>) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({
  onFilterChange,
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 1000000 },
  });

  const handleCategoryChange = (categories: string[]) => {
    const newFilters = { ...filters, categories };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (min: number, max: number) => {
    const newFilters = { ...filters, priceRange: { min, max } };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'sticky md:static top-0 left-0 max-h-screen w-64 bg-white z-40',
          'transition-transform duration-300 md:transition-none',
          'border-r border-neutral-200 p-4 md:p-6',
          'overflow-y-auto',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Close Button (Mobile) */}
        <button
          onClick={onMobileClose}
          className="md:hidden mb-4 text-2xl"
        >
          ✕
        </button>

        {/* Filters */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Filtros</h3>

          {/* Category Filter */}
          <CategoryFilter
            onCategoryChange={handleCategoryChange}
            selectedCategories={filters.categories}
          />

          {/* Price Range Filter */}
          <PriceRangeFilter
            onPriceChange={handlePriceChange}
            minPrice={filters.priceRange.min}
            maxPrice={filters.priceRange.max}
          />

          {/* Reset Button */}
          <button
            onClick={() => {
              const reset = {
                categories: [] as string[],
                priceRange: { min: 0, max: 1000000 },
              };
              setFilters(reset);
              onFilterChange?.(reset);
            }}
            className="w-full py-2 border-2 border-primary text-primary rounded-full hover:bg-primary-50 transition-colors font-semibold"
          >
            Limpiar Filtros
          </button>
        </div>
      </aside>
    </>
  );
}
