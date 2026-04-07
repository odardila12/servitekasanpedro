import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { CartProvider } from '@/lib/contexts/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsappContact } from '@/components/sections/WhatsappContact';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Serviteka San Pedro - Llantas, Baterías y Accesorios Automotrices',
  description: 'Serviteka San Pedro: expertos en llantas, baterías, lubricantes y servicio técnico automotriz de primera calidad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-neutral-50" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsappContact phoneNumber="573023456789" showLabel={true} />
        </CartProvider>
      </body>
    </html>
  );
}
