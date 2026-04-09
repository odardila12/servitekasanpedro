'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthenticated'>('loading');

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) {
      setStatus('authorized');
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth');
        if (response.ok) {
          setStatus('authorized');
        } else {
          setStatus('unauthenticated');
          router.replace('/admin/login');
        }
      } catch {
        setStatus('unauthenticated');
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-neutral-800 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // On login page, render children without admin header
  if (isLoginPage) {
    return children;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-secondary font-bold text-lg">Serviteka San Pedro</span>
            <span className="text-white/60">/</span>
            <span className="text-white/80 text-sm font-medium">Admin</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/admin/productos" className="text-white/80 hover:text-white transition-colors">
              Productos
            </a>
            <a href="/admin/featured" className="text-white/80 hover:text-white transition-colors">
              Destacados
            </a>
            <a href="/" className="text-white/60 hover:text-white transition-colors text-xs">
              Ver tienda
            </a>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
