'use client';

import React from 'react';
import { CreditCard, Truck, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    icon: <CreditCard className="w-8 h-8 sm:w-10 sm:h-10" />,
    title: 'Múltiples Formas de Pago',
    description: 'Paga como prefieras',
    details: [
      'Tarjetas de crédito y débito',
      'Transferencia bancaria',
      'Efectivo contra entrega',
      'Billeteras digitales',
    ],
  },
  {
    icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10" />,
    title: 'Envíos a Nivel Nacional',
    description: 'Entrega rápida y segura',
    details: [
      'Cobertura en toda Colombia',
      'Envío 24-48 horas',
      'Rastreo en tiempo real',
      'Empaques resistentes',
    ],
  },
  {
    icon: <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10" />,
    title: 'Atención por WhatsApp',
    description: 'Soporte personalizado',
    details: [
      'Consultas instantáneas',
      'Asistencia técnica',
      'Órdenes de compra',
      'Seguimiento de pedidos',
    ],
  },
];

export function PaymentMethodsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
            Compra con Confianza
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto">
            Facilitamos tu experiencia de compra con opciones de pago flexibles, envíos rápidos y atención personalizada.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {PAYMENT_METHODS.map((method, index) => (
            <div
              key={index}
              className={cn(
                'relative p-8 sm:p-10 rounded-xl sm:rounded-2xl',
                'bg-white border-2 border-transparent',
                'hover:border-[#FFB81C] hover:shadow-xl',
                'transition-all duration-200 hover:-translate-y-2',
                'group'
              )}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB81C]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-200" />

              {/* Icon */}
              <div className="relative z-10 mb-6 inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFB81C]/20 to-[#FFB81C]/5 text-[#FFB81C] group-hover:bg-[#FFB81C] group-hover:text-white transition-all duration-200">
                {method.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F3E99] mb-2">
                  {method.title}
                </h3>
                <p className="text-neutral-600 text-base mb-6 font-medium">
                  {method.description}
                </p>

                {/* Details List */}
                <ul className="space-y-3">
                  {method.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-neutral-700">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FFB81C] text-[#0F3E99] text-xs font-bold mr-3 flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-sm sm:text-base">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#FFB81C] to-transparent group-hover:w-full transition-all duration-200 rounded-b-xl sm:rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-neutral-600 text-base sm:text-lg mb-6">
            ¿Preguntas? Estamos aquí para ayudarte
          </p>
          <a
            href="https://wa.me/573205882008"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 sm:py-4 bg-[#39a935] text-white font-bold rounded-xl sm:rounded-2xl hover:bg-[#2d8a29] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm sm:text-base"
          >
            <MessageCircle className="w-5 h-5" />
            Contacta por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
