'use client';

import React from 'react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SAMPLE_PRODUCTS } from '@/lib/constants';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function LubricantesPage() {
  const products = SAMPLE_PRODUCTS.filter((p) => p.category === 'lubricantes');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#1a3a52] to-[#2d5a7b] text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4c430]/10 rounded-full blur-3xl -translate-y-1/2" />

        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
              🛢️ Lubricantes Premium
            </h1>
            <p className="text-lg sm:text-xl text-slate-100 leading-relaxed">
              Mantén tu motor en perfecto estado con nuestros lubricantes de calidad superior. Protección óptima para tu vehículo.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container px-4 sm:px-6 py-4 sm:py-6">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Categorías', href: '/productos' },
            { label: 'Lubricantes', href: '/categoria/lubricantes' },
          ]}
        />
      </div>

      {/* Features */}
      <section className="bg-slate-50 py-8 sm:py-12">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">✓</div>
              <h3 className="font-bold text-[#1a3a52] mb-2">Calidad Certificada</h3>
              <p className="text-sm text-neutral-600">Lubricantes certificados y aprobados por los principales fabricantes de vehículos.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-bold text-[#1a3a52] mb-2">Envío Rápido</h3>
              <p className="text-sm text-neutral-600">Entrega en 24-48 horas a cualquier parte de Colombia.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-[#1a3a52] mb-2">Mejor Precio</h3>
              <p className="text-sm text-neutral-600">Precios competitivos sin comprometer la calidad del producto.</p>
            </div>
            <div className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">👨‍🔧</div>
              <h3 className="font-bold text-[#1a3a52] mb-2">Asesoramiento</h3>
              <p className="text-sm text-neutral-600">Expertos disponibles para recomendarte el lubricante adecuado para tu motor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
              Nuestro Catálogo de Lubricantes
            </h2>
            <p className="text-neutral-600 text-lg">
              {products.length} productos disponibles
            </p>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a3a52] text-white py-12 sm:py-16">
        <div className="container px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Necesitas asesoramiento?</h2>
          <p className="text-lg text-slate-100 mb-8 max-w-2xl mx-auto">
            Nuestros expertos están disponibles para ayudarte a elegir el lubricante perfecto para tu vehículo.
          </p>
          <a
            href="https://wa.me/573023456789"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#f4c430] text-[#1a3a52] font-bold rounded-lg hover:bg-[#f0b800] transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Contáctanos por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
