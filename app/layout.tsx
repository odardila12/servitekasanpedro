import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { CartProvider } from '@/lib/contexts/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsappContact } from '@/components/sections/WhatsappContact';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Serviteka San Pedro - Llantas, Baterías y Accesorios Automotrices',
  description: 'Serviteka San Pedro: expertos en llantas, baterías, lubricantes y servicio técnico automotriz de primera calidad.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-neutral-50 font-inter" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsappContact phoneNumber="573205882008" message="Hola, tengo una pregunta sobre los productos de Serviteka San Pedro" />
        </CartProvider>
      </body>
    </html>
  );
}
