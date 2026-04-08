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
  { label: 'Servicios', href: '/productos?category=servicios' },
];

export function Navigation() {
  return null;
}
