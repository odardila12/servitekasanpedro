'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface WhatsappContactProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function WhatsappContact({
  phoneNumber = '573023456789',
  message = 'Hola, tengo una pregunta sobre los productos de Serviteka San Pedro',
  position = 'bottom-right',
}: WhatsappContactProps) {

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
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
    </a>
  );
}
