'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { ActiveFilterChips } from '@/components/filters/ActiveFilterChips';
import { ProductGridContainer } from '@/components/product/ProductGridContainer';
import { getProductsByCategory } from '@/lib/products';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import { getFiltersForCategory } from '@/lib/filters/filterDefinitions';
import ProductSubheader from '@/components/filters/ProductSubheader';
import type { Product } from '@/lib/types';

const SLUG = 'filtros';

export default function FiltrosPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsByCategory(SLUG).then(setCategoryProducts);
  }, []);

  const filterDefinitions = getFiltersForCategory(SLUG);

  const {
    activeFilters,
    sortBy,
    filteredProducts,
    setFilter,
    setPriceRange,
    removeFilter,
    clearAllFilters,
    setSortBy,
    hasActiveFilters,
  } = useProductFilters(categoryProducts);

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container px-4 sm:px-6 py-4 sm:py-5">
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Productos', href: '/productos' },
              { label: 'Filtros' },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
            Filtros
          </h1>
        </div>
      </div>

      {/* ── Quick filter subheader ───────────────────────────────────── */}
      <ProductSubheader
        category={SLUG}
        activeFilters={activeFilters}
        setFilter={setFilter}
        setPriceRange={setPriceRange}
        clearAllFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* ── Active filter chips ───────────────────────────────────────── */}
      {hasActiveFilters && (
        <div className="bg-white border-b border-neutral-100">
          <div className="container px-4 sm:px-6 py-3">
            <ActiveFilterChips
              activeFilters={activeFilters}
              filterDefinitions={filterDefinitions}
              onRemove={removeFilter}
              onClearAll={clearAllFilters}
            />
          </div>
        </div>
      )}

      {/* ── Main two-column layout ────────────────────────────────────── */}
      <div className="container px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6 xl:gap-8 items-start">
          <FilterSidebar
            categorySlug={SLUG}
            activeFilters={activeFilters}
            onCheckboxChange={setFilter}
            onRangeChange={setPriceRange}
            onClearAll={clearAllFilters}
            isMobileOpen={isFilterDrawerOpen}
            onMobileClose={() => setIsFilterDrawerOpen(false)}
          />

          <main className="flex-1 min-w-0">
            <ProductGridContainer
              products={filteredProducts}
              totalCount={categoryProducts.length}
              sortBy={sortBy}
              hasActiveFilters={hasActiveFilters}
              onSortChange={setSortBy}
              onClearFilters={clearAllFilters}
              onToggleFilterDrawer={() => setIsFilterDrawerOpen(true)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
