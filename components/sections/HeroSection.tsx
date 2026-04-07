'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/Button';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export function HeroSection({
  title = 'Serviteka San Pedro: Expertos Automotrices',
  subtitle = 'Llantas, baterías, lubricantes y servicio técnico de primera calidad para tu vehículo.',
  ctaText = 'Ver Servicios y Productos',
  ctaHref = '/productos',
  backgroundImage = 'https://picsum.photos/1920/600?random=hero',
}: HeroSectionProps) {
  return (
    <section className="relative w-full h-[500px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Serviteka San Pedro"
        fill
        className="object-cover object-center scale-105 animate-pulse-slow"
        priority
        sizes="100vw"
      />

      {/* Overlay - Navy to softer blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a52]/90 to-[#2a5c84]/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a52]/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center container">
        <div className="max-w-3xl text-left text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white border border-white/20 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
            Calidad Garantizada
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-2xl mb-10 text-slate-200 font-light max-w-2xl">
            {subtitle}
          </p>
          <div className="flex gap-4">
            <Button
              className="bg-[#f4c430]/90 backdrop-blur-md text-[#1a3a52] font-bold border border-white/30 shadow-lg hover:shadow-xl hover:bg-[#f4c430] text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-all duration-300"
              size="lg"
              onClick={() => (window.location.href = ctaHref)}
            >
              {ctaText}
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 text-lg px-8 py-6 rounded-2xl transition-all duration-300"
              size="lg"
              onClick={() => (window.location.href = '/contacto')}
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
