import React from 'react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ProductsPageClient } from '@/components/product/ProductsPageClient';
import { getAllProducts } from '@/lib/products';

export default async function ProductsPage() {
  const products = await getAllProducts();

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
      </div>

      {/* Main Content */}
      <div className="container pb-12">
        <ProductsPageClient products={products} />
      </div>
    </div>
  );
}
