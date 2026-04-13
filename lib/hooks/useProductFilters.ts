'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ActiveFilters } from '@/lib/filters/filterDefinitions';

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface Product {
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
  category?: string;
  brand?: string;
  specs?: Record<string, string | undefined>;
}

interface UseProductFiltersResult {
  activeFilters: ActiveFilters;
  sortBy: SortOption;
  filteredProducts: Product[];
  resultCount: number;
  setFilter: (filterId: string, value: string, checked: boolean) => void;
  setPriceRange: (filterId: string, range: [number, number]) => void;
  removeFilter: (filterId: string, value?: string) => void;
  clearAllFilters: () => void;
  setSortBy: (sort: SortOption) => void;
  hasActiveFilters: boolean;
}

export function useProductFilters(
  products: Product[],
  initialFilters: ActiveFilters = {}
): UseProductFiltersResult {
  const [activeFilters, setActiveFilters] =
    useState<ActiveFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // Toggle a checkbox value on/off for a given filter id
  const setFilter = useCallback(
    (filterId: string, value: string, checked: boolean) => {
      setActiveFilters((prev) => {
        const existing = (prev[filterId] as string[] | undefined) ?? [];
        const next = checked
          ? [...existing, value]
          : existing.filter((v) => v !== value);

        if (next.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [filterId]: _removed, ...rest } = prev;
          return rest;
        }

        return { ...prev, [filterId]: next };
      });
    },
    []
  );

  // Set a range filter value
  const setPriceRange = useCallback(
    (filterId: string, range: [number, number]) => {
      setActiveFilters((prev) => ({ ...prev, [filterId]: range }));
    },
    []
  );

  // Remove one value from a filter, or the whole filter if no value given
  const removeFilter = useCallback((filterId: string, value?: string) => {
    setActiveFilters((prev) => {
      if (!value) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [filterId]: _removed, ...rest } = prev;
        return rest;
      }

      const existing = (prev[filterId] as string[] | undefined) ?? [];
      const next = existing.filter((v) => v !== value);

      if (next.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [filterId]: _removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [filterId]: next };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Apply filters and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply checkbox filters
    for (const [filterId, filterValue] of Object.entries(activeFilters)) {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        // Could be a range [min, max] tuple
        if (
          filterValue.length === 2 &&
          typeof filterValue[0] === 'number' &&
          typeof filterValue[1] === 'number'
        ) {
          const [min, max] = filterValue as [number, number];
          if (filterId === 'price') {
            result = result.filter((p) => p.price >= min && p.price <= max);
          }
        } else {
          // Checkbox multi-select
          const values = filterValue as string[];
          result = result.filter((p) => {
            if (filterId === 'brand') {
              return p.brand && values.includes(p.brand);
            }
            // For spec-based filters (ancho, perfil, rin, amperaje, tipo, viscosidad, volumen)
            return p.specs && values.includes(String(p.specs[filterId] ?? ''));
          });
        }
      }
    }

    // Apply sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'newest':
        // Keep insertion order as proxy for newest
        break;
      case 'relevance':
      default:
        break;
    }

    return result;
  }, [products, activeFilters, sortBy]);

  return {
    activeFilters,
    sortBy,
    filteredProducts,
    resultCount: filteredProducts.length,
    setFilter,
    setPriceRange,
    removeFilter,
    clearAllFilters,
    setSortBy,
    hasActiveFilters,
  };
}
