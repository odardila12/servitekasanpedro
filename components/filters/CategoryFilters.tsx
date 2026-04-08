'use client';

import React from 'react';
import { FilterGroup } from '@/components/filters/FilterGroup';
import { getFiltersForCategory } from '@/lib/filters/filterDefinitions';
import type { ActiveFilters } from '@/lib/filters/filterDefinitions';

interface CategoryFiltersProps {
  categorySlug: string;
  activeFilters: ActiveFilters;
  onCheckboxChange: (filterId: string, value: string, checked: boolean) => void;
  onRangeChange: (filterId: string, range: [number, number]) => void;
  onClearAll: () => void;
}

export function CategoryFilters({
  categorySlug,
  activeFilters,
  onCheckboxChange,
  onRangeChange,
  onClearAll,
}: CategoryFiltersProps) {
  const filters = getFiltersForCategory(categorySlug);

  if (filters.length === 0) {
    return (
      <div className="text-sm text-neutral-500 py-4">
        No hay filtros disponibles para esta categoría.
      </div>
    );
  }

  const hasActive = Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-4">
      {/* Filter groups */}
      {filters.map((filter, index) => (
        <FilterGroup
          key={filter.id}
          filter={filter}
          activeFilters={activeFilters}
          onCheckboxChange={onCheckboxChange}
          onRangeChange={onRangeChange}
          defaultOpen={index < 2}
        />
      ))}

      {/* Reset button */}
      {hasActive && (
        <button
          onClick={onClearAll}
          className="w-full mt-2 py-2 text-sm font-semibold rounded-full border-2 border-[#fca50f] text-[#fca50f] hover:bg-[#fca50f] hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fca50f]"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
