'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/Button';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  badge?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: 'https://picsum.photos/1920/700?random=hero1',
    title: 'Serviteka San Pedro: Expertos Automotrices',
    subtitle: 'Llantas, baterías, lubricantes y servicio técnico de primera calidad para tu vehículo.',
    ctaText: 'Ver Servicios y Productos',
    ctaHref: '/productos',
    badge: 'Calidad Garantizada',
  },
  {
    image: 'https://picsum.photos/1920/700?random=hero2',
    title: 'Llantas para Todo Tipo de Vehículo',
    subtitle: 'Encontrá la llanta perfecta para tu auto, camioneta o camión con las mejores marcas.',
    ctaText: 'Ver Llantas',
    ctaHref: '/productos',
    badge: 'Envío Rápido',
  },
  {
    image: 'https://picsum.photos/1920/700?random=hero3',
    title: 'Baterías y Lubricantes de Primera',
    subtitle: 'Mantenimiento completo para que tu vehículo siempre esté en óptimas condiciones.',
    ctaText: 'Ver Baterías',
    ctaHref: '/categoria/baterias',
    badge: 'Mejor Precio',
  },
  {
    image: 'https://picsum.photos/1920/700?random=hero4',
    title: 'Servicio Técnico Especializado',
    subtitle: 'Técnicos certificados con años de experiencia atendiendo en San Pedro y la región.',
    ctaText: 'Puntos de Atención',
    ctaHref: '/puntos-atencion',
    badge: 'Atención Personalizada',
  },
];

interface HeroSectionProps {
  slides?: HeroSlide[];
  autoRotateInterval?: number;
}

export function HeroSection({
  slides = DEFAULT_SLIDES,
  autoRotateInterval = 5000,
}: HeroSectionProps) {
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
    <section className="relative w-full h-[500px] lg:h-[700px] overflow-hidden">
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

      {/* Subtle overlay only for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center container">
        <div
          className={cn(
            'max-w-3xl text-left text-white transition-opacity duration-200',
            isTransitioning ? 'opacity-0' : 'opacity-100'
          )}
        >
          {slide.badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-white/15 text-white border border-white/30 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
              {slide.badge}
            </span>
          )}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
            {slide.title}
          </h2>
          <p className="text-lg sm:text-2xl mb-10 text-slate-100 font-light max-w-2xl drop-shadow-md">
            {slide.subtitle}
          </p>
          <div className="flex gap-4">
            <Button
              className="bg-[#f4c430] text-[#1a3a52] font-bold border-2 border-[#f4c430] shadow-[0_4px_20px_rgba(244,196,48,0.4)] hover:shadow-[0_6px_30px_rgba(244,196,48,0.6)] hover:bg-[#f0b800] text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-all duration-300"
              size="lg"
              onClick={() => (window.location.href = slide.ctaHref)}
            >
              {slide.ctaText}
            </Button>
            <Button
              variant="outline"
              className="bg-white/15 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/25 hover:border-white/60 text-lg px-8 py-6 rounded-2xl transition-all duration-300 shadow-lg"
              size="lg"
              onClick={() => (window.location.href = '/puntos-atencion')}
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        aria-label="Imagen anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        aria-label="Siguiente imagen"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 backdrop-blur-sm shadow-lg"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots / Bullets */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ir a imagen ${i + 1}`}
            className={cn(
              'transition-all duration-300 rounded-full',
              i === currentIndex
                ? 'w-8 h-3 bg-[#f4c430] shadow-[0_0_8px_rgba(244,196,48,0.7)]'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            )}
          />
        ))}
      </div>

      {/* Slide counter (optional, subtle) */}
      <div className="absolute bottom-6 right-4 sm:right-6 z-10 text-white/50 text-sm font-mono">
        {currentIndex + 1} / {slides.length}
      </div>
    </section>
  );
}
