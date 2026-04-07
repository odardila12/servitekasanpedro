'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/Button';

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  badge?: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    image: 'https://picsum.photos/1920/700?random=carousel1',
    title: 'Llantas Premium para tu Vehículo',
    subtitle: 'Las mejores marcas internacionales con garantía y envío rápido a toda la región.',
    ctaText: 'Ver Llantas',
    ctaHref: '/categoria/llantas',
    badge: 'Calidad Garantizada',
  },
  {
    image: 'https://picsum.photos/1920/700?random=carousel2',
    title: 'Baterías de Larga Duración',
    subtitle: 'Baterías confiables para cualquier tipo de vehículo con instalación profesional.',
    ctaText: 'Ver Baterías',
    ctaHref: '/categoria/baterias',
    badge: 'Envío Rápido',
  },
  {
    image: 'https://picsum.photos/1920/700?random=carousel3',
    title: 'Lubricantes y Fluidos Especializados',
    subtitle: 'Mantén tu motor en óptimas condiciones con nuestros aceites y fluidos premium.',
    ctaText: 'Ver Lubricantes',
    ctaHref: '/categoria/lubricantes',
    badge: 'Mejor Precio',
  },
];

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  autoRotateInterval?: number;
}

export function HeroCarousel({
  slides = DEFAULT_SLIDES,
  autoRotateInterval = 5000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }, [currentIndex, slides.length, goToSlide]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }, [currentIndex, slides.length, goToSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoRotateInterval);
    return () => clearInterval(timer);
  }, [slides.length, autoRotateInterval]);

  const slide = slides[currentIndex];

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden">
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-[200ms]',
            i === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Subtle overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center container px-4 sm:px-6">
        <div
          className={cn(
            'max-w-3xl text-left text-white transition-opacity duration-200',
            isTransitioning ? 'opacity-0' : 'opacity-100'
          )}
        >
          {slide.badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-white/15 text-white border border-white/30 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 sm:mb-6 backdrop-blur-md shadow-sm">
              {slide.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-10 text-slate-100 font-light max-w-2xl drop-shadow-md">
            {slide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              className="bg-[#FFB81C] text-[#0F3E99] font-bold border-2 border-[#FFB81C] shadow-[0_4px_20px_rgba(255,184,28,0.4)] hover:shadow-[0_6px_30px_rgba(255,184,28,0.6)] hover:bg-opacity-90 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:scale-105 transition-all duration-200 text-sm sm:text-base"
              onClick={() => (window.location.href = slide.ctaHref)}
            >
              {slide.ctaText}
            </Button>
            <Button
              variant="outline"
              className="bg-white/15 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/25 hover:border-white/60 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-200 shadow-lg text-sm sm:text-base"
              onClick={() => (window.location.href = '/puntos-atencion')}
            >
              Puntos de Atención
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        aria-label="Diapositiva anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={goToNext}
        aria-label="Siguiente diapositiva"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-lg"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
}
