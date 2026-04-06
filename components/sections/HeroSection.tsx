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
  title = 'Llantas, Baterías y Accesorios Automotrices',
  subtitle = 'Encuentra todo lo que necesitas para tu vehículo con los mejores precios',
  ctaText = 'Ver Catálogo',
  ctaHref = '/productos',
  backgroundImage = 'https://picsum.photos/1920/600?random=hero',
}: HeroSectionProps) {
  return (
    <section className="relative w-full h-96 sm:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Hero Banner"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-95">
            {subtitle}
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = ctaHref)}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
}
