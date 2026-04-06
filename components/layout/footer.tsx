'use client';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-16">
      <div className="container py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h4 className="font-bold text-lg mb-4">AutoPlanet</h4>
            <p className="text-sm text-neutral-400">
              Tu tienda online de confianza para llantas, baterías, lubricantes y accesorios automotrices.
            </p>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h4 className="font-bold text-lg mb-4">Comprar</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Llantas</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Baterías</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Lubricantes</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Accesorios</a></li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Soporte</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Rastrear Pedido</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-400">
            <p>&copy; 2026 AutoPlanet. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
