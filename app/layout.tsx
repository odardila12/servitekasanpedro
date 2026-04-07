import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AutoPlanet - Llantas, Baterías y Accesorios Automotrices',
  description: 'Compra llantas, baterías, lubricantes y accesorios automotrices en línea con envío rápido.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-neutral-50" suppressHydrationWarning>
        <Header cartCount={0} />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
