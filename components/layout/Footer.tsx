'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#1a3a52] text-neutral-300 mt-20 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f4c430]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      
      <div className="container py-16 relative z-10">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - About */}
          <div>
            <div className="mb-6">
              <Image
                src="/favicon.png"
                alt="Logo de Serviteka San Pedro"
                width={40}
                height={40}
                className="w-10 h-10 rounded-md"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Tu centro automotriz de confianza en San Pedro. Expertos en llantas, baterías, lubricantes y servicio técnico especializado.
            </p>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#f4c430]">Categorías</h4>
            <ul className="text-sm space-y-3">
              <li><Link href="/categoria/llantas" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Llantas</Link></li>
              <li><Link href="/categoria/baterias" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Baterías</Link></li>
              <li><Link href="/categoria/lubricantes" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Lubricantes</Link></li>
              <li><Link href="/productos" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Todos los Productos</Link></li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#f4c430]">Soporte</h4>
            <ul className="text-sm space-y-3">
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Centro de Ayuda</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Rastrear Pedido</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Devoluciones</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Contacto</Link></li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#f4c430]">Legal</h4>
            <ul className="text-sm space-y-3">
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Términos de Servicio</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Privacidad</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-[#f4c430] transition-colors duration-300 inline-block hover:translate-x-1 transform">Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white/70">
            <p>&copy; {new Date().getFullYear()} Serviteka San Pedro. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-6 sm:mt-0">
              <Link href="#" className="hover:text-[#f4c430] transition-colors duration-300 hover:scale-110 transform">Facebook</Link>
              <Link href="#" className="hover:text-[#f4c430] transition-colors duration-300 hover:scale-110 transform">Instagram</Link>
              <Link href="#" className="hover:text-[#f4c430] transition-colors duration-300 hover:scale-110 transform">WhatsApp</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
