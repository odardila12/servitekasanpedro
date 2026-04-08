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
    <nav className="hidden md:block sticky top-[64px] z-40 bg-white border-b border-neutral-100 shadow-sm w-full">
      <div className="container px-4 sm:px-6 flex items-center justify-center gap-6 sm:gap-8 h-14">
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="text-[#0F3E99] font-medium text-sm sm:text-base hover:text-[#FFB81C] transition-colors duration-300 whitespace-nowrap py-4"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
