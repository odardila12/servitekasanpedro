'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
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
          ? 'py-4 bg-[#0F3E99]/95 backdrop-blur-md shadow-md border-b border-neutral-200'
          : 'py-6 bg-[#0F3E99] border-b border-neutral-200'
      )}>
        <div className="container flex items-center gap-4 h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/favicon.png"
                alt="Serviteka San Pedro"
                width={44}
                height={44}
                className={cn(
                  'rounded-lg transition-all duration-200',
                  isSticky ? 'w-10 h-10' : 'w-11 h-11'
                )}
                priority
              />
              <span className={cn(
                'font-bold text-white transition-all duration-200 hidden sm:inline',
                isSticky ? 'text-lg' : 'text-xl'
              )}
              style={{ letterSpacing: '0.01em' }}>
                Servi<span className="text-[#FFB81C]">teka</span> San Pedro
              </span>
            </Link>
          </div>

          {/* Center: Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchDropdown
              className="w-full"
              inputClassName="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFB81C] focus:bg-white/15 transition-all duration-200 pr-8"
              placeholder="Buscar llantas, baterías..."
            />
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* Agendar Cita — visible solo en lg+ */}
            <Link
              href="/puntos-atencion"
              className="hidden lg:flex items-center gap-2 bg-[#FFB81C] text-[#0F3E99] font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#FFB81C]/90 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
            >
              Agendar Cita
            </Link>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              aria-label={`Carrito de compras${itemCount > 0 ? ` - ${itemCount} artículos` : ''}`}
              className="relative text-white hover:text-[#FFB81C] transition-all duration-200 group flex items-center justify-center p-3 rounded-full bg-white/10 hover:bg-white/15"
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
                <span className="absolute -top-2 -right-2 bg-[#FFB81C] text-[#0F3E99] text-xs rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md border-2 border-[#0F3E99]">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Hamburger + Cart */}
          <div className="flex md:hidden items-center gap-3 ml-auto flex-shrink-0">
            {/* Cart Icon Mobile */}
            <button
              onClick={openCart}
              aria-label={`Carrito de compras${itemCount > 0 ? ` - ${itemCount} artículos` : ''}`}
              className="relative text-white hover:text-[#FFB81C] transition-all duration-200 group flex items-center justify-center p-2 rounded-full"
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
                <span className="absolute -top-2 -right-2 bg-[#FFB81C] text-[#0F3E99] text-xs rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md border-2 border-[#0F3E99]">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl hover:text-[#FFB81C] transition-colors duration-200"
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

              <div className="px-4 pt-4 pb-2 border-t border-white/20 mt-2">
                <Link
                  href="/puntos-atencion"
                  className="flex items-center justify-center w-full bg-[#FFB81C] text-[#0F3E99] font-bold px-5 py-4 rounded-2xl hover:bg-opacity-90 transition-colors duration-200"
                >
                  Puntos de Atención
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
