'use client';

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { ActiveFilterChips } from '@/components/filters/ActiveFilterChips';
import { ProductGridContainer } from '@/components/product/ProductGridContainer';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import { getFiltersForCategory } from '@/lib/filters/filterDefinitions';

const SLUG = 'llantas';

export default function LlantasPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categoryProducts = SAMPLE_PRODUCTS.filter((p) => p.category === SLUG);
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
              { label: 'Llantas' },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
            Llantas
          </h1>
        </div>
      </div>

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
