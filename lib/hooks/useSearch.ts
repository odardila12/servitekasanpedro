'use client';

import { useState, useEffect, useMemo } from 'react';
import { FEATURED_PRODUCTS } from '@/lib/constants';
import type { Product } from '@/lib/types';

export function useSearch(query: string): { results: Product[]; loading: boolean } {
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
    return FEATURED_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  return { results, loading };
}
