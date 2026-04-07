'use client';

import React, { useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Brand {
  name: string;
  logo: string;
}

const BRANDS: Brand[] = [
  { name: 'Michelin', logo: '/logos/michelin.png' },
  { name: 'Hankook', logo: '/logos/hankook.png' },
  { name: 'Continental', logo: '/logos/continental.png' },
  { name: 'Goodyear', logo: '/logos/goodyear.png' },
  { name: 'Bridgestone', logo: '/logos/bridgestone.png' },
  { name: 'Pirelli', logo: '/logos/pirelli.png' },
  { name: 'Bosch', logo: '/logos/bosch.png' },
  { name: 'Varta', logo: '/logos/varta.png' },
];

interface BrandCarouselProps {
  brands?: Brand[];
}

export function BrandCarousel({ brands = BRANDS }: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    slidesToScroll: 1,
    skipSnaps: false,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update selected index and scroll snaps
  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi || !isAutoScrolling) return;

    const scroll = () => {
      emblaApi.scrollNext();
    };

    autoScrollTimerRef.current = setInterval(scroll, 5000);

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [emblaApi, isAutoScrolling]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const handlePrevClick = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setIsAutoScrolling(false);
    }
  };

  const handleNextClick = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setIsAutoScrolling(false);
    }
  };

  const handleDotClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      setIsAutoScrolling(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
            Nuestras Marcas
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
            Trabajamos con las mejores marcas automotrices del mundo para garantizar calidad y durabilidad en cada producto.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Embla Carousel */}
          <div ref={emblaRef} className="overflow-hidden rounded-lg lg:rounded-xl">
            <div className="flex gap-4 sm:gap-6 lg:gap-8">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/5 min-w-0"
                >
                  <div
                    className={cn(
                      'flex items-center justify-center p-6 sm:p-8 lg:p-10',
                      'bg-gradient-to-br from-slate-50 to-slate-100',
                      'rounded-lg sm:rounded-xl',
                      'border border-slate-200/50 hover:border-[#FFB81C]/50',
                      'shadow-sm hover:shadow-md',
                      'transition-all duration-300 h-48 sm:h-56 lg:h-64',
                      'group/item cursor-pointer'
                    )}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-[80%] max-h-[80%] object-contain group-hover/item:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const textDiv = document.createElement('div');
                          textDiv.className = 'text-center text-[#0F3E99] font-semibold';
                          textDiv.textContent = brand.name;
                          parent.appendChild(textDiv);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Left */}
          <button
            onClick={handlePrevClick}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 lg:-translate-x-8',
              'bg-white hover:bg-[#0F3E99] text-[#0F3E99] hover:text-white',
              'rounded-full p-2 sm:p-3',
              'border border-slate-200 hover:border-[#0F3E99]',
              'shadow-md hover:shadow-lg',
              'transition-all duration-300 z-10',
              'opacity-0 sm:opacity-100 sm:group-hover:opacity-100'
            )}
            aria-label="Previous brands"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Buttons - Right */}
          <button
            onClick={handleNextClick}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 lg:translate-x-8',
              'bg-white hover:bg-[#0F3E99] text-[#0F3E99] hover:text-white',
              'rounded-full p-2 sm:p-3',
              'border border-slate-200 hover:border-[#0F3E99]',
              'shadow-md hover:shadow-lg',
              'transition-all duration-300 z-10',
              'opacity-0 sm:opacity-100 sm:group-hover:opacity-100'
            )}
            aria-label="Next brands"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Mobile Buttons - Always Visible on Mobile */}
          <div className="sm:hidden flex gap-3 justify-center mt-6">
            <button
              onClick={handlePrevClick}
              className="bg-[#0F3E99] text-white rounded-full p-2 hover:bg-[#FFB81C] transition-colors"
              aria-label="Previous brands"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextClick}
              className="bg-[#0F3E99] text-white rounded-full p-2 hover:bg-[#FFB81C] transition-colors"
              aria-label="Next brands"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-8 sm:mt-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                'h-2 sm:h-3 rounded-full transition-all duration-300',
                index === selectedIndex
                  ? 'bg-[#0F3E99] w-8 sm:w-10'
                  : 'bg-slate-300 w-2 sm:w-3 hover:bg-slate-400'
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-neutral-600 text-sm sm:text-base">
            <span className="font-semibold text-[#0F3E99]">+10 años</span> de experiencia distribuyendo productos de marcas líderes en el mercado automotriz.
          </p>
        </div>
      </div>
    </section>
  );
}
