'use client';

import React from 'react';

const sections = [
  {
    title: 'Personalizar Colores',
    description: 'Todos los colores del proyecto se definen en un único lugar mediante tokens CSS.',
    steps: [
      'Abrí el archivo styles/globals.css',
      'Editá los valores bajo el bloque @theme { ... }',
      'Los cambios se propagan automáticamente a todos los componentes',
    ],
    code: `/* styles/globals.css */
@theme {
  --color-primary: #fca50f;   /* Color primario (naranja) */
  --color-cta: #6a9d15;       /* Color de acción (verde) */
  --color-alert: #dc241f;     /* Color de alerta (rojo) */
}`,
  },
  {
    title: 'Agregar Productos',
    description: 'El catálogo de productos se administra desde un único archivo de constantes.',
    steps: [
      'Abrí el archivo lib/constants.ts',
      'Agregá un nuevo objeto al array SAMPLE_PRODUCTS',
      'Seguí la estructura de los productos existentes',
    ],
    code: `// lib/constants.ts
export const SAMPLE_PRODUCTS = [
  {
    id: '99',
    name: 'Mi Nuevo Producto',
    slug: 'mi-nuevo-producto',
    category: 'llantas', // llantas | baterias | lubricantes | servicios
    price: 150000,
    originalPrice: 180000, // null si no hay descuento
    image: 'https://images.unsplash.com/photo-xxx?w=800&h=800&fit=crop',
    rating: 4.5,
    reviews: 10,
    badge: '-17%', // null si no tiene badge
  },
];`,
  },
  {
    title: 'Modificar Layouts',
    description: 'Los layouts usan clases de Tailwind CSS con el sistema de breakpoints del proyecto.',
    steps: [
      'Breakpoints: sm=550px, md=768px, lg=850px, xl=1200px',
      'Usá clases responsivas: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      'El contenedor max-width está en .container (max-w-6xl, centrado)',
    ],
    code: `/* Breakpoints definidos en @theme */
--breakpoint-sm: 550px;   /* Tablet pequeña */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 850px;   /* Desktop */
--breakpoint-xl: 1200px;  /* Desktop wide */`,
  },
  {
    title: 'Componentes y Props',
    description: 'Referencia rápida de los componentes disponibles y sus props principales.',
    steps: [],
    code: `// ProductCard
<ProductCard
  id="1"
  name="Llanta Michelin"
  price={450000}
  originalPrice={550000}   // opcional
  image="https://..."
  rating={4.5}             // opcional
  reviews={23}             // opcional
  badge="-18%"             // opcional
  onAddToCart={(id) => {}} // opcional
/>

// Button
<Button variant="primary|secondary|outline" size="sm|md|lg" loading={false}>
  Texto
</Button>

// Badge
<Badge variant="sale|new" value="-20%" position="top-right|top-left" />

// Rating
<Rating rating={4.5} reviews={23} />

// SearchBar
<SearchBar placeholder="Buscar..." onSearch={(q) => {}} />`,
  },
];

export default function DocsPage() {
  return (
    <div className="container py-12 space-y-12">
      <div>
        <h1 className="text-5xl font-bold mb-4">Documentación</h1>
        <p className="text-xl text-neutral-600">
          Guía de personalización y referencia de componentes del proyecto AutoPlanet
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900">{section.title}</h2>
          <p className="text-neutral-600">{section.description}</p>

          {section.steps.length > 0 && (
            <ol className="list-decimal list-inside space-y-1 text-neutral-700">
              {section.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}

          <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-6 overflow-x-auto text-sm leading-relaxed">
            <code>{section.code}</code>
          </pre>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Páginas Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { path: '/', label: 'Home', desc: 'Hero + Categorías + Productos destacados' },
            { path: '/productos', label: 'Catálogo', desc: 'Grid completo con filtros laterales' },
            { path: '/categoria/llantas', label: 'Categoría', desc: 'Productos filtrados por categoría' },
            { path: '/buscar', label: 'Búsqueda', desc: 'Resultados de búsqueda por query' },
            { path: '/productos/[id]', label: 'Detalle', desc: 'Vista detallada de un producto' },
            { path: '/showcase', label: 'Showcase', desc: 'Galería de todos los componentes' },
          ].map((page) => (
            <a
              key={page.path}
              href={page.path === '/productos/[id]' ? '/productos/1' : page.path}
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-primary-50 hover:shadow-md transition-all duration-200 group"
            >
              <code className="text-sm font-mono text-primary group-hover:text-primary-700">
                {page.path}
              </code>
              <p className="font-semibold mt-1 text-neutral-900">{page.label}</p>
              <p className="text-sm text-neutral-500 mt-1">{page.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
