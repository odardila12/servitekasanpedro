'use client';

import React from 'react';
import Link from 'next/link';

const categories = [
  { label: 'Llantas', href: '/productos' },
  { label: 'Baterías', href: '/categoria/baterias' },
  { label: 'Lubricantes', href: '/categoria/lubricantes' },
  { label: 'Filtros', href: '/categoria/filtros' },
  { label: 'Aceites', href: '/categoria/aceites' },
  { label: 'Servicios', href: '/categoria/servicios' },
];

export function SubHeader() {
  return (
    <nav className="hidden md:block sticky top-16 z-40 bg-[#1a3a52] border-t border-white/10">
      <div className="container px-4 sm:px-6 flex items-center gap-6 sm:gap-8 h-16">
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="text-white font-medium text-sm sm:text-base hover:text-[#f4c430] transition-colors duration-300 whitespace-nowrap py-4"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
