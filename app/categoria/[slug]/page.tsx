'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { ActiveFilterChips } from '@/components/filters/ActiveFilterChips';
import { ProductGridContainer } from '@/components/product/ProductGridContainer';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/constants';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import { getFiltersForCategory } from '@/lib/filters/filterDefinitions';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.category === categorySlug
  );

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

  const filterDefinitions = getFiltersForCategory(categorySlug);

  if (!category) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Categoría no encontrada
        </h1>
        <a
          href="/productos"
          className="text-[#fca50f] hover:underline"
        >
          Volver a Productos
        </a>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container px-4 sm:px-6 py-4 sm:py-5">
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Productos', href: '/productos' },
              { label: category.name },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
            {category.name}
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
          {/* Filter sidebar (desktop sticky, mobile drawer) */}
          <FilterSidebar
            categorySlug={categorySlug}
            activeFilters={activeFilters}
            onCheckboxChange={setFilter}
            onRangeChange={setPriceRange}
            onClearAll={clearAllFilters}
            isMobileOpen={isFilterDrawerOpen}
            onMobileClose={() => setIsFilterDrawerOpen(false)}
          />

          {/* Product grid */}
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
