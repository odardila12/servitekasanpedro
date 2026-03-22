"use client";

import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  // Placeholder for cart functionality
  return (
    <div className="min-h-screen bg-[oklch(0.13_0.01_250)]">
      <Navigation />
      <main className="min-h-screen">
        <div className="container mx-auto py-16 px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[oklch(0.65_0.2_250)] hover:text-[oklch(0.7_0.2_250)] mb-8 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>

          <div className="text-center py-20">
            <ShoppingCart className="size-16 mx-auto mb-6 text-gray-400" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-400 mb-8">
              Comienza a agregar productos a tu carrito
            </p>
            <Button
              asChild
              className="bg-[oklch(0.65_0.2_250)] hover:bg-[oklch(0.7_0.2_250)] text-white rounded-lg"
            >
              <Link href="/">Volver a comprar</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
