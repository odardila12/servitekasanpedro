'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryLink {
  image: string;
  alt: string;
  href: string;
  cta: string;
}

const CATEGORIES: CategoryLink[] = [
  {
    image: '/images/categories/baterias.webp',
    alt: 'Baterías',
    href: '/categoria/baterias',
    cta: 'VER BATERÍAS',
  },
  {
    image: '/images/categories/llantas.webp',
    alt: 'Llantas',
    href: '/categoria/llantas',
    cta: 'VER LLANTAS',
  },
  {
    image: '/images/categories/lubricantes.webp',
    alt: 'Lubricantes',
    href: '/categoria/lubricantes',
    cta: 'VER LUBRICANTES',
  },
];

export function CategoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
    goToSlide(prevIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % CATEGORIES.length;
    goToSlide(nextIndex);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentCategory = CATEGORIES[currentIndex];

  return (
    <section className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-gray-100">
      {/* Background Images - show all with opacity transition */}
      {CATEGORIES.map((category, i) => (
        <a
          key={i}
          href={category.href}
          className={cn(
            'absolute inset-0 transition-opacity duration-300 cursor-pointer group',
            i === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <Image
            src={category.image}
            alt={category.alt}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
            quality={85}
          />

          {/* CTA Overlay */}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 group-hover:from-black/70">
            <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl pb-6 sm:pb-8 lg:pb-10 drop-shadow-lg text-center px-4">
              {category.cta}
            </span>
          </div>
        </a>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        aria-label="Categoría anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={goToNext}
        aria-label="Siguiente categoría"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-lg"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {CATEGORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ir a categoría ${i + 1}`}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              i === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  );
}
