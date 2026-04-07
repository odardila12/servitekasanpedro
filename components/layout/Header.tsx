'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HeaderProps {
  cartCount?: number;
  onSearch?: (query: string) => void;
}

export function Header({ cartCount = 0, onSearch }: HeaderProps) {
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
            <Link href="/cuenta" className="hover:text-[#f4c430] transition-colors duration-300">Mi Cuenta</Link>
            <Link href="/favoritos" className="hover:text-[#f4c430] transition-colors duration-300">Favoritos</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isSticky 
          ? 'py-3 bg-[#1a3a52]/80 backdrop-blur-md shadow-lg border-b border-white/10' 
          : 'py-5 bg-[#1a3a52] border-b border-white/5'
      )}>
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className={cn(
                'font-bold text-white transition-all duration-300 tracking-tight',
                isSticky ? 'text-xl' : 'text-2xl'
              )}>
                Servi<span className="text-[#f4c430]">teka</span>
              </h1>
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
            
            {/* Search Icon / Bar (Simplified for space) */}
            <div className="hidden sm:flex relative w-48 lg:w-64">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#f4c430] focus:bg-white/20 transition-all duration-300"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#f4c430] transition-colors duration-300">
                <span className="text-sm">🔍</span>
              </button>
            </div>

            {/* CTA Button */}
            <Link 
              href="/citas" 
              className="hidden lg:flex items-center justify-center bg-[#f4c430] text-[#1a3a52] font-bold px-5 py-2 rounded-2xl hover:bg-white transition-colors duration-300"
              style={{ borderRadius: '16px' }}
            >
              Agendar Cita
            </Link>

            {/* Cart Icon */}
            <button className="relative text-white hover:text-[#f4c430] transition-colors duration-300 group">
              <span className="text-2xl group-hover:scale-110 inline-block transition-transform duration-300">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
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
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#f4c430] focus:bg-white/20 transition-all duration-300"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
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
                  href="/citas" 
                  className="flex items-center justify-center w-full bg-[#f4c430] text-[#1a3a52] font-bold px-5 py-3 rounded-2xl hover:bg-white transition-colors duration-300"
                  style={{ borderRadius: '12px' }}
                >
                  Agendar Cita
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
