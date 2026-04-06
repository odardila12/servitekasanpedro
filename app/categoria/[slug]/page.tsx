'use client';

import React from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/constants';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const products = SAMPLE_PRODUCTS.filter((p) => p.category === categorySlug);

  if (!category) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Categoria no encontrada
        </h1>
        <a
          href="/productos"
          className="text-primary hover:text-primary-700 underline"
        >
          Volver a Productos
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Productos', href: '/productos' },
            { label: category.name },
          ]}
        />
      </div>

      {/* Category Header */}
      <div className="container mb-12">
        <div className="bg-gradient-to-r from-primary to-primary-700 text-white rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
          <p className="text-lg opacity-90">
            {products.length} productos disponibles
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="container pb-12">
        {products.length > 0 ? (
          <ProductGrid
            products={products}
            onAddToCart={(id) => alert(`Producto ${id} agregado al carrito`)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-500">
              No hay productos en esta categoria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
