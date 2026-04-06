'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SearchBar } from '@/components/common/SearchBar';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState(SAMPLE_PRODUCTS);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(SAMPLE_PRODUCTS);
      return;
    }

    const filtered = SAMPLE_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setResults(filtered);
  }, [searchQuery]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    // Update URL without navigation
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('q', q);
    window.history.replaceState({}, '', newUrl);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Busqueda' },
          ]}
        />
      </div>

      {/* Search Bar */}
      <div className="container mb-8">
        <div className="max-w-2xl">
          <SearchBar
            placeholder="Buscar productos..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="container mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Resultados para &ldquo;{searchQuery}&rdquo;
        </h1>
        <p className="text-neutral-600">
          {results.length} producto{results.length !== 1 ? 's' : ''} encontrado
          {results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Results */}
      <div className="container pb-12">
        {results.length > 0 ? (
          <ProductGrid
            products={results}
            onAddToCart={(id) => alert(`Producto ${id} agregado al carrito`)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-500 mb-4">
              No se encontraron resultados para &ldquo;{searchQuery}&rdquo;
            </p>
            <a
              href="/productos"
              className="text-primary hover:text-primary-700 underline"
            >
              Ver todos los productos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center text-neutral-500">Cargando...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
