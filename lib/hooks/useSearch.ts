'use client';

import { useState, useEffect, useMemo } from 'react';
import { SAMPLE_PRODUCTS } from '@/lib/constants';

export interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export function useSearch(query: string): { results: SearchProduct[]; loading: boolean } {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query === debouncedQuery) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return SAMPLE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  return { results, loading };
}
