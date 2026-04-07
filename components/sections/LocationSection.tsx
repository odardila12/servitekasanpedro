'use client';

import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationSectionProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapsEmbedUrl?: string;
}

export function LocationSection({
  address = 'Cra. 29 #39-01, Sur Orient, Barranquilla, Atlántico',
  phone = '+57 320 5882008',
  email = 'sanpedro@serviteka.com',
  hours = 'Lun - Sab: 8:00 AM - 6:00 PM | Dom: 9:00 AM - 2:00 PM',
  mapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.3156282846047!2d-74.79619!3d10.971111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef42d0000000001%3A0x0!2sBarranquilla%2C%20Atlantico!5e0!3m2!1ses!2sco!4v1234567890',
}: LocationSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left - Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
                Visítanos
              </h2>
              <p className="text-neutral-600 text-base sm:text-lg">
                Estamos ubicados en el corazón de San Pedro, listos para atender tus necesidades automotrices.
              </p>
            </div>

            {/* Contact Items */}
            <div className="space-y-6 sm:space-y-8">
              {/* Address */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#f4c430]/20 text-[#f4c430]">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg sm:text-xl text-[#1a3a52] mb-1 sm:mb-2">
                    Dirección
                  </h3>
                  <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#f4c430]/20 text-[#f4c430]">
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg sm:text-xl text-[#1a3a52] mb-1 sm:mb-2">
                    Teléfono
                  </h3>
                  <a
                    href={`tel:${phone}`}
                    className="text-neutral-700 hover:text-[#f4c430] text-base sm:text-lg transition-colors duration-300 font-medium"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#f4c430]/20 text-[#f4c430]">
                    <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg sm:text-xl text-[#1a3a52] mb-1 sm:mb-2">
                    Email
                  </h3>
                  <a
                    href={`mailto:${email}`}
                    className="text-neutral-700 hover:text-[#f4c430] text-base sm:text-lg transition-colors duration-300 font-medium"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#f4c430]/20 text-[#f4c430]">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg sm:text-xl text-[#1a3a52] mb-1 sm:mb-2">
                    Horario
                  </h3>
                  <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                    {hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Map */}
          <div className="relative h-96 sm:h-[450px] lg:h-[550px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200">
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
