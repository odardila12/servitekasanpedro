'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProductGrid } from '@/components/product/ProductGrid';
import { EmptyState } from '@/components/product/EmptyState';
import type { SortOption } from '@/lib/hooks/useProductFilters';
import type { Product } from '@/lib/hooks/useProductFilters';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating-desc', label: 'Mejor valorados' },
  { value: 'newest', label: 'Más recientes' },
];

interface ProductGridContainerProps {
  products: Product[];
  totalCount: number;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
  onToggleFilterDrawer: () => void;
  className?: string;
}

export function ProductGridContainer({
  products,
  totalCount,
  sortBy,
  hasActiveFilters,
  onSortChange,
  onClearFilters,
  onToggleFilterDrawer,
  className,
}: ProductGridContainerProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left: count + mobile filter toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile filter button — visible only below desktop */}
          <button
            onClick={onToggleFilterDrawer}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              'border-2 border-neutral-200 bg-white text-neutral-700',
              'hover:border-[#fca50f] hover:text-[#fca50f] transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fca50f]',
              // hide on large desktop (sidebar visible), show on tablet/mobile
              'xl:hidden'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#fca50f]" aria-hidden="true" />
            )}
          </button>

          <p className="text-sm text-neutral-500">
            <span className="font-semibold text-neutral-800">{products.length}</span>
            {' '}
            {products.length === totalCount ? (
              <>producto{products.length !== 1 ? 's' : ''}</>
            ) : (
              <>de {totalCount} producto{totalCount !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>

        {/* Right: sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-neutral-500 shrink-0">
            Ordenar:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={cn(
              'text-sm font-medium text-neutral-700 bg-white',
              'border-2 border-neutral-200 rounded-lg px-3 py-2',
              'hover:border-[#fca50f] transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fca50f]',
              'cursor-pointer'
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
      )}
    </div>
  );
}
