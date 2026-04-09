'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CATEGORIES } from '@/lib/constants';
import { getAllProducts } from '@/lib/products';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

const PRICE_RANGES = [
  { label: 'Todos los precios', min: 0, max: Infinity },
  { label: 'Hasta $100.000', min: 0, max: 100000 },
  { label: '$100.000 - $300.000', min: 100000, max: 300000 },
  { label: '$300.000 - $500.000', min: 300000, max: 500000 },
  { label: 'Más de $500.000', min: 500000, max: Infinity },
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Load merged product set on mount
  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);

  // Sync query from URL on navigation
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const priceRange = PRICE_RANGES[selectedPriceIndex];

  const results = allProducts.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
    return matchesQuery && matchesCategory && matchesPrice;
  });

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Búsqueda' },
          ]}
        />
      </div>

      {/* Results header */}
      <div className="container mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">
          {searchQuery ? (
            <>
              Resultados para{' '}
              <span className="text-[#f4c430]">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : (
            'Todos los productos'
          )}
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          {results.length} producto{results.length !== 1 ? 's' : ''} encontrado
          {results.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="container pb-16 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-60 flex-shrink-0">
          {/* Category Filter */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 mb-4">
            <h3 className="font-semibold text-neutral-800 mb-3 text-sm uppercase tracking-wide">
              Categoría
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory('')}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                    selectedCategory === ''
                      ? 'bg-[#1a3a52] text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  )}
                >
                  Todas las categorías
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 flex justify-between items-center',
                      selectedCategory === cat.slug
                        ? 'bg-[#1a3a52] text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    )}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={cn(
                        'text-xs rounded-full px-2 py-0.5',
                        selectedCategory === cat.slug
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-100 text-neutral-500'
                      )}
                    >
                      {allProducts.filter((p) => p.category === cat.slug).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Filter */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-800 mb-3 text-sm uppercase tracking-wide">
              Precio
            </h3>
            <ul className="space-y-1">
              {PRICE_RANGES.map((range, i) => (
                <li key={i}>
                  <button
                    onClick={() => setSelectedPriceIndex(i)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                      selectedPriceIndex === i
                        ? 'bg-[#1a3a52] text-white font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    )}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 min-w-0">
          {results.length > 0 ? (
            <ProductGrid
              products={results}
              onAddToCart={(id) => alert(`Producto ${id} agregado al carrito`)}
            />
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-xl font-semibold text-neutral-700 mb-2">
                No hay resultados
              </p>
              <p className="text-neutral-500 text-sm mb-6">
                {searchQuery
                  ? `No encontramos productos para "${searchQuery}"`
                  : 'No hay productos con los filtros seleccionados'}
              </p>
              <a
                href="/productos"
                className="text-sm font-semibold text-[#1a3a52] underline hover:text-[#f4c430] transition-colors"
              >
                Ver todos los productos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 text-center text-neutral-500">
          Cargando...
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
