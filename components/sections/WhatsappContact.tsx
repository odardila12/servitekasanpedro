'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface WhatsappContactProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
  showLabel?: boolean;
}

export function WhatsappContact({
  phoneNumber = '573023456789',
  message = 'Hola, tengo una pregunta sobre los productos de Serviteka',
  position = 'bottom-right',
  showLabel = true,
}: WhatsappContactProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show floating button after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {isVisible && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onTouchStart={() => setShowTooltip(true)}
          onTouchEnd={() => setShowTooltip(false)}
          className={cn(
            'fixed z-40 flex items-center justify-center',
            'w-12 h-12 sm:w-14 sm:h-14',
            'rounded-full shadow-2xl',
            'bg-[#39a935] hover:bg-[#2d8a29]',
            'transition-all duration-300 hover:scale-110',
            'group',
            position === 'bottom-right' ? 'bottom-8 right-8' : 'bottom-8 left-8'
          )}
        >
          {/* Icon */}
          <Image
            src="/icons8-whatsapp.svg"
            alt="WhatsApp"
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10"
          />

          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-[#39a935] animate-pulse opacity-30" />

          {/* Tooltip */}
          {showTooltip && showLabel && (
            <div
              className={cn(
                'absolute -top-12 sm:-top-14 whitespace-nowrap',
                'bg-[#1a3a52] text-white text-xs sm:text-sm font-medium',
                'px-3 py-2 rounded-lg',
                'shadow-lg pointer-events-none',
                'animate-in fade-in duration-200',
                position === 'bottom-right' ? '-left-2' : '-right-2'
              )}
            >
              Hablamos por WhatsApp
              {/* Tooltip arrow */}
              <div
                className={cn(
                  'absolute top-full',
                  'border-4 border-transparent border-t-[#1a3a52]',
                  position === 'bottom-right' ? 'left-4' : 'right-4'
                )}
              />
            </div>
          )}
        </a>
      )}
    </>
  );
}
