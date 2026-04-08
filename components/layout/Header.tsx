'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SearchDropdown } from '@/components/search/SearchDropdown';
import { useCart } from '@/lib/contexts/CartContext';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header suppressHydrationWarning className={cn(
        'sticky top-0 z-50 transition-all duration-200',
        isSticky
          ? 'py-4 bg-primary-600/95 backdrop-blur-md'
          : 'py-6 bg-primary-600'
      )}>
        <div className="container flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="Serviteka San Pedro"
                className="w-28 h-20"
              />
              <span className={cn(
                'font-bold text-white transition-all duration-200 hidden sm:inline',
                isSticky ? 'text-lg' : 'text-xl'
              )}
              style={{ letterSpacing: '0.01em' }}>
                Servi<span className="text-secondary-500">teka</span> San Pedro
              </span>
            </Link>
          </div>

          {/* Center: Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 justify-center">
            <SearchDropdown
              className="w-full"
              inputClassName="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFB81C] focus:bg-white/15 transition-all duration-200 pr-8"
              placeholder="Buscar llantas, baterías..."
            />
          </div>

          {/* Right: Cart Icon Only */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {/* Cart Icon */}
            <button
              onClick={openCart}
              aria-label={`Carrito de compras${itemCount > 0 ? ` - ${itemCount} artículos` : ''}`}
              className="relative text-white hover:text-secondary-500 transition-all duration-200 group flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/15"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-primary-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md border-2 border-primary-600">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Hamburger + Cart */}
          <div className="flex md:hidden items-center gap-3 ml-auto shrink-0">
            {/* Cart Icon Mobile */}
            <button
              onClick={openCart}
              aria-label={`Carrito de compras${itemCount > 0 ? ` - ${itemCount} artículos` : ''}`}
              className="relative text-white hover:text-secondary-500 transition-all duration-200 group flex items-center justify-center p-2 rounded-full"
            >
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-primary-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md border-2 border-primary-600">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl hover:text-secondary-500 transition-colors duration-200"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-[#0F3E99] border-t border-white/20 py-4 absolute w-full left-0 shadow-lg">
            <div className="container flex flex-col gap-2">
              {/* Mobile Search */}
              <div className="px-4 pb-4 border-b border-white/20">
                <SearchDropdown
                  className="w-full"
                  inputClassName="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFB81C] focus:bg-white/15 transition-all duration-200 pr-8"
                  placeholder="Buscar..."
                />
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* SubHeader - Desktop Categories */}
      <nav className="hidden md:block bg-white sticky top-20 z-40" style={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)' }}>
        <div className="container flex items-center justify-center gap-8 sm:gap-10 h-20 px-4 sm:px-6">
          <Link href="/productos" className="text-primary-600 font-medium text-sm sm:text-base hover:text-secondary-500 transition-colors duration-300 whitespace-nowrap py-6">
            Llantas
          </Link>
          <Link href="/categoria/baterias" className="text-primary-600 font-medium text-sm sm:text-base hover:text-secondary-500 transition-colors duration-300 whitespace-nowrap py-6">
            Baterías
          </Link>
          <Link href="/categoria/lubricantes" className="text-primary-600 font-medium text-sm sm:text-base hover:text-secondary-500 transition-colors duration-300 whitespace-nowrap py-4">
            Lubricantes
          </Link>
          <Link href="/categoria/filtros" className="text-primary-600 font-medium text-sm sm:text-base hover:text-secondary-500 transition-colors duration-300 whitespace-nowrap py-4">
            Filtros
          </Link>
          <Link href="/categoria/aceites" className="text-primary-600 font-medium text-sm sm:text-base hover:text-secondary-500 transition-colors duration-300 whitespace-nowrap py-4">
            Aceites
          </Link>
          <Link href="/categoria/servicios" className="text-primary-600 font-medium text-sm sm:text-base hover:text-secondary-500 transition-colors duration-300 whitespace-nowrap py-4">
            Servicios
          </Link>
        </div>
      </nav>
    </>
  );
}
