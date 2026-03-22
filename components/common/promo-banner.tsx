"use client";

import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white mb-4">
              <Timer className="h-4 w-4" />
              Oferta por tiempo limitado
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Hasta <span className="text-white/90">30% OFF</span> en llantas
              seleccionadas
            </h2>

            <p className="text-lg text-white/80 max-w-xl">
              Incluye alineación y balanceo gratis. Válido del 15 al 31 de marzo
              en todas nuestras sucursales.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 h-14 text-base font-semibold shadow-lg"
              asChild
            >
              <Link href="/ofertas">
                Ver ofertas
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 h-14 text-base font-semibold"
              asChild
            >
              <Link href="/llantas">Explorar llantas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
