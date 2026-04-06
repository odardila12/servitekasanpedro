'use client';

import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Rating } from '@/components/product/Rating';
import { SearchBar } from '@/components/common/SearchBar';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { Categories } from '@/components/sections/Categories';
import { HeroSection } from '@/components/sections/HeroSection';
import { SAMPLE_PRODUCTS } from '@/lib/constants';

export default function ShowcasePage() {
  return (
    <div className="space-y-16">
      {/* Title */}
      <div className="container py-12">
        <h1 className="text-5xl font-bold mb-4">Componentes Disponibles</h1>
        <p className="text-xl text-neutral-600">
          Librería de componentes reutilizables para landing pages y ecommerce
        </p>
      </div>

      {/* 1. Buttons */}
      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">Botones</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Outline</Button>
          <Button disabled>Deshabilitado</Button>
          <Button loading>Cargando...</Button>
        </div>
      </section>

      {/* 2. Badges */}
      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <div className="relative p-4 bg-neutral-100 rounded">
            <Badge variant="sale" value="-20%" position="top-right" />
          </div>
          <div className="relative p-4 bg-neutral-100 rounded">
            <Badge variant="new" value="NUEVO" position="top-right" />
          </div>
        </div>
      </section>

      {/* 3. Rating */}
      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">Ratings</h2>
        <div className="flex gap-8">
          <div>
            <Rating rating={5} reviews={120} />
          </div>
          <div>
            <Rating rating={3.5} reviews={45} />
          </div>
          <div>
            <Rating rating={2} reviews={12} />
          </div>
        </div>
      </section>

      {/* 4. SearchBar */}
      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">Search Bar</h2>
        <div className="max-w-md">
          <SearchBar placeholder="Buscar productos..." />
        </div>
      </section>

      {/* 5. SortDropdown */}
      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">Sort Dropdown</h2>
        <div className="max-w-sm">
          <SortDropdown />
        </div>
      </section>

      {/* 6. ProductCard */}
      <section className="container space-y-6">
        <h2 className="text-3xl font-bold">Product Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={(id) => alert(`Producto ${id} agregado`)}
            />
          ))}
        </div>
      </section>

      {/* 7. Categories */}
      <section className="space-y-6">
        <div className="container">
          <h2 className="text-3xl font-bold">Categories Grid</h2>
        </div>
        <Categories />
      </section>

      {/* 8. HeroSection */}
      <section className="space-y-6">
        <div className="container">
          <h2 className="text-3xl font-bold mb-6">Hero Section</h2>
        </div>
        <HeroSection />
      </section>

      {/* Spacing */}
      <div className="h-12" />
    </div>
  );
}
