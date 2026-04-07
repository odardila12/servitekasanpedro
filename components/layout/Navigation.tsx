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
    <nav className="hidden lg:block glass-panel border-t-0 rounded-none rounded-b-2xl shadow-sm z-40 relative max-w-7xl mx-auto -mt-1">
      <div className="container flex gap-8 py-4 px-6 justify-center">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm font-bold text-navy-700 hover:text-primary transition-all duration-300 uppercase tracking-wider relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left pb-1"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
