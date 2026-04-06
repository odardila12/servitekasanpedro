'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  cartCount?: number;
  onSearch?: (query: string) => void;
}

export function Header({ cartCount = 0, onSearch }: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Pre-header (hidden on mobile) */}
      <div className="hidden sm:block bg-neutral-800 text-white text-sm py-2 px-4">
        <div className="container flex justify-between items-center">
          <div className="flex gap-6 text-xs">
            <span>Envío gratis en compras mayores a $200.000</span>
            <span>Garantía de satisfacción</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Mi Cuenta</a>
            <a href="#" className="hover:text-primary transition-colors">Favoritos</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        'sticky-header bg-white border-b border-neutral-200 transition-all duration-300',
        isSticky ? 'py-2 shadow-md' : 'py-4'
      )}>
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className={cn(
              'font-bold text-neutral-900 transition-all duration-300',
              isSticky ? 'text-lg' : 'text-2xl'
            )}>
              AutoPlanet
            </h1>
          </div>

          {/* Search Bar (hidden on very small mobile) */}
          <div className="hidden sm:flex flex-1 mx-6">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full bg-neutral-100 border-2 border-neutral-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <button className="ml-2 bg-primary text-white rounded-full px-4 py-2 hover:bg-primary-700 transition-colors">
              <span className="text-lg">🔍</span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-neutral-900 text-2xl"
            >
              ☰
            </button>

            {/* Cart Icon */}
            <button className="relative hover:text-primary transition-colors">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-alert text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search (visible only on mobile) */}
        <div className="sm:hidden px-4 pb-3">
          <div className="flex">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-neutral-100 border-2 border-neutral-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-primary"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="sm:hidden bg-neutral-50 border-t border-neutral-200 py-3">
            <div className="container flex flex-col gap-2">
              <a href="/productos" className="hover:text-primary transition-colors py-2">Llantas</a>
              <a href="/categoria/baterias" className="hover:text-primary transition-colors py-2">Baterías</a>
              <a href="/categoria/lubricantes" className="hover:text-primary transition-colors py-2">Lubricantes</a>
              <a href="/categoria/accesorios" className="hover:text-primary transition-colors py-2">Accesorios</a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
