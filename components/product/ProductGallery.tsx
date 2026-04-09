'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const safeImages = images.length > 0 ? images : ['/placeholder.jpg'];
  const total = safeImages.length;

  const goTo = (index: number) => {
    setSelectedIndex(Math.max(0, Math.min(index, total - 1)));
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails — side on desktop, bottom on mobile */}
      <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[400px] shrink-0">
        {safeImages.map((src, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
              i === selectedIndex
                ? 'border-[#0F3E99] shadow-md scale-105'
                : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
            )}
            aria-label={`Ver imagen ${i + 1} de ${productName}`}
          >
            <Image
              src={src}
              alt={`${productName} - miniatura ${i + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="order-1 md:order-2 flex-1">
        <div
          className={cn(
            'relative rounded-xl overflow-hidden bg-neutral-100 cursor-zoom-in select-none',
            'transition-all duration-200',
            zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          )}
          style={{ aspectRatio: '1 / 1' }}
          onClick={() => setZoomed((z) => !z)}
        >
          <Image
            src={safeImages[selectedIndex]}
            alt={`${productName} - imagen ${selectedIndex + 1} de ${total}`}
            fill
            priority
            className={cn(
              'object-cover transition-transform duration-300',
              zoomed ? 'scale-150' : 'scale-100'
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Counter badge */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full pointer-events-none">
            {selectedIndex + 1} / {total}
          </div>

          {/* Prev / Next arrows — only when multiple images */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(selectedIndex - 1 >= 0 ? selectedIndex - 1 : total - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-neutral-700 transition-all duration-150"
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(selectedIndex + 1 < total ? selectedIndex + 1 : 0); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-neutral-700 transition-all duration-150"
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Zoom hint */}
        <p className="text-xs text-neutral-400 text-center mt-1">
          {zoomed ? 'Haz clic para alejar' : 'Haz clic para ampliar'}
        </p>
      </div>
    </div>
  );
}
