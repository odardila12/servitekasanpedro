'use client';

import React, { useState } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(SAMPLE_PRODUCTS);
  const [sortBy, setSortBy] = useState('relevance');

  const handleFilterChange = (filters: Record<string, unknown>) => {
    let products = [...SAMPLE_PRODUCTS];

    const f = filters as {
      categories?: string[];
      priceRange?: { min: number; max: number };
    };

    // Filter by category
    if (f.categories && f.categories.length > 0) {
      products = products.filter((p) =>
        (f.categories as string[]).includes(p.category)
      );
    }

    // Filter by price range
    if (f.priceRange) {
      products = products.filter(
        (p) =>
          p.price >= (f.priceRange as { min: number; max: number }).min &&
          p.price <= (f.priceRange as { min: number; max: number }).max
      );
    }

    // Apply sort
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(products);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Productos' },
          ]}
        />
      </div>

      {/* Page Header */}
      <div className="container mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Todos los Productos
        </h1>
        <p className="text-neutral-600">
          {filteredProducts.length} productos encontrados
        </p>
      </div>

      {/* Main Content */}
      <div className="container pb-12">
        <div className="flex gap-6">
          {/* Sidebar Toggle (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              'md:hidden fixed bottom-6 right-6 z-40',
              'bg-primary text-white rounded-full w-14 h-14',
              'flex items-center justify-center font-bold text-lg',
              'hover:bg-primary-700 transition-colors'
            )}
          >
            F
          </button>

          {/* Sidebar */}
          <FilterSidebar
            onFilterChange={handleFilterChange}
            isMobileOpen={isSidebarOpen}
            onMobileClose={() => setIsSidebarOpen(false)}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-end mb-8">
              <SortDropdown
                onChange={(value) => setSortBy(value)}
                defaultValue="relevance"
              />
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onAddToCart={(id) =>
                  alert(`Producto ${id} agregado al carrito`)
                }
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-neutral-500">
                  No hay productos que coincidan con tus filtros
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
