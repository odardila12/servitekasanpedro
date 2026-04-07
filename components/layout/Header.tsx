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
      {/* Pre-header (hidden on mobile) */}
      <div className="hidden sm:block bg-[#112636] text-white text-sm py-2 px-4">
        <div className="container flex justify-between items-center">
          <div className="flex gap-6 text-xs text-neutral-300">
            <span>Envío gratis en compras mayores a $200.000</span>
            <span>Garantía de satisfacción</span>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <Link href="/puntos-atencion" className="hover:text-[#f4c430] transition-colors duration-300">Puntos de Atención</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header suppressHydrationWarning className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isSticky
          ? 'py-3 bg-[#1a3a52]/80 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'py-5 bg-[#1a3a52] border-b border-white/5'
      )}>
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/favicon.ico"
                alt="Serviteka San Pedro"
                width={40}
                height={40}
                className={cn(
                  'rounded-md transition-all duration-300',
                  isSticky ? 'w-8 h-8' : 'w-10 h-10'
                )}
                priority
              />
              <span className={cn(
                'font-bold text-white transition-all duration-300 tracking-tight',
                isSticky ? 'text-xl' : 'text-2xl'
              )}>
                Servi<span className="text-[#f4c430]">teka</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 mx-8">
            <Link href="/productos" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300">Llantas</Link>
            <Link href="/categoria/baterias" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300">Baterías</Link>
            <Link href="/categoria/lubricantes" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300">Lubricantes</Link>
            <Link href="/categoria/accesorios" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300">Accesorios</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 sm:gap-6">



            {/* CTA Button */}
            <Link
              href="/puntos-atencion"
              className="hidden lg:flex items-center justify-center bg-[#f4c430] text-[#1a3a52] font-bold px-5 py-2 rounded-2xl hover:bg-white transition-colors duration-300"
              style={{ borderRadius: '16px' }}
            >
              Puntos de Atención
            </Link>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              aria-label={`Carrito de compras${itemCount > 0 ? ` - ${itemCount} artículos` : ''}`}
              className="relative text-white hover:text-[#f4c430] transition-colors duration-300 group"
            >
              <span className="text-2xl group-hover:scale-110 inline-block transition-transform duration-300">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f4c430] text-[#1a3a52] text-xs rounded-full w-5 h-5 flex items-center justify-center font-black shadow-sm">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white text-2xl hover:text-[#f4c430] transition-colors duration-300 ml-2"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Search (visible only on mobile) */}
        <div className="sm:hidden px-4 pb-2 pt-2">
          <SearchDropdown
            className="w-full"
            inputClassName="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#f4c430] focus:bg-white/20 transition-all duration-300 pr-8"
            placeholder="Buscar..."
          />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-[#1a3a52] border-t border-white/10 py-3 absolute w-full left-0 shadow-xl">
            <div className="container flex flex-col gap-1">
              <Link href="/productos" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/5">Llantas</Link>
              <Link href="/categoria/baterias" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/5">Baterías</Link>
              <Link href="/categoria/lubricantes" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/5">Lubricantes</Link>
              <Link href="/categoria/accesorios" className="text-white hover:text-[#f4c430] font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-white/5">Accesorios</Link>
              <div className="px-4 pt-4 pb-2 border-t border-white/10 mt-2">
                <Link
                  href="/puntos-atencion"
                  className="flex items-center justify-center w-full bg-[#f4c430] text-[#1a3a52] font-bold px-5 py-3 rounded-2xl hover:bg-white transition-colors duration-300"
                  style={{ borderRadius: '12px' }}
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
