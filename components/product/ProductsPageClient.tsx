'use client';

import React from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import type { Product } from '@/lib/types';

interface ProductsPageClientProps {
  products: Product[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const { filteredProducts, sortBy, setSortBy } = useProductFilters(products);

  return (
    <>
      {/* Sort */}
      <div className="flex justify-end mb-8">
        <SortDropdown
          onChange={(value) => setSortBy(value as Parameters<typeof setSortBy>[0])}
          defaultValue="relevance"
        />
      </div>

      {/* Count */}
      <p className="text-neutral-600 mb-6">
        {filteredProducts.length} productos encontrados
      </p>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid
          products={filteredProducts}
          onAddToCart={(id) => alert(`Producto ${id} agregado al carrito`)}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-500">
            No hay productos disponibles
          </p>
        </div>
      )}
    </>
  );
}
