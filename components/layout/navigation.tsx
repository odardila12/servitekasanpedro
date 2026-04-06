'use client';

import React from 'react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Llantas', href: '/productos?category=llantas' },
  { label: 'Baterías', href: '/productos?category=baterias' },
  { label: 'Lubricantes', href: '/productos?category=lubricantes' },
  { label: 'Accesorios', href: '/productos?category=accesorios' },
];

export function Navigation() {
  return (
    <nav className="hidden lg:block bg-white border-b border-neutral-200">
      <div className="container flex gap-8 py-3">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm font-semibold text-neutral-700 hover:text-primary transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
