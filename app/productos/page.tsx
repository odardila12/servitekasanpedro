'use client';

import React from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { useProductFilters } from '@/lib/hooks/useProductFilters';

export default function ProductsPage() {
  const {
    filteredProducts,
    sortBy,
    setSortBy,
  } = useProductFilters(SAMPLE_PRODUCTS);

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
        {/* Sort */}
        <div className="flex justify-end mb-8">
          <SortDropdown
            onChange={(value) => setSortBy(value as Parameters<typeof setSortBy>[0])}
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
              No hay productos disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
