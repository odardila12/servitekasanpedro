import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  productos: [
    { name: "Llantas", href: "/llantas" },
    { name: "Baterías", href: "/baterias" },
    { name: "Lubricantes", href: "/lubricantes" },
    { name: "Accesorios", href: "/accesorios" },
    { name: "Ofertas", href: "/ofertas" },
  ],
  servicios: [
    { name: "Alineación y Balanceo", href: "/servicios/alineacion" },
    { name: "Cambio de Aceite", href: "/servicios/cambio-aceite" },
    { name: "Instalación de Baterías", href: "/servicios/baterias" },
    { name: "Revisión General", href: "/servicios/revision" },
    { name: "Servicio a Domicilio", href: "/servicios/domicilio" },
  ],
  empresa: [
    { name: "Sobre Nosotros", href: "/nosotros" },
    { name: "Sucursales", href: "/sucursales" },
    { name: "Blog", href: "/blog" },
    { name: "Trabaja con Nosotros", href: "/empleos" },
    { name: "Contacto", href: "/contacto" },
  ],
  legal: [
    { name: "Términos y Condiciones", href: "/terminos" },
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "Política de Devoluciones", href: "/devoluciones" },
    { name: "Garantías", href: "/garantias" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">
                  S
                </span>
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight">Serviteka</p>
                <p className="text-xs text-sidebar-foreground/60 -mt-0.5">
                  San Pedro
                </p>
              </div>
            </Link>

            <p className="text-sm text-sidebar-foreground/70 mb-6 leading-relaxed">
              Tu centro de confianza para el cuidado integral de tu vehículo.
              Más de 15 años de experiencia nos respaldan.
            </p>

            <div className="space-y-3 text-sm">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sidebar-foreground/70 hover:text-primary transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Av. Vasconcelos 1234, Col. Del Valle
                  <br />
                  San Pedro Garza García, N.L. 66220
                </span>
              </a>
              <a
                href="tel:+528112345678"
                className="flex items-center gap-3 text-sidebar-foreground/70 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(81) 1234-5678</span>
              </a>
              <a
                href="mailto:info@serviteka.mx"
                className="flex items-center gap-3 text-sidebar-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@serviteka.mx</span>
              </a>
              <div className="flex items-center gap-3 text-sidebar-foreground/70">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Lun - Sáb: 8:00 - 20:00</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Productos
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-sidebar-foreground/70 mb-4">
              Recibe ofertas exclusivas y novedades
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="tu@email.com"
                className="bg-sidebar-accent border-sidebar-border rounded-xl h-11 text-sidebar-foreground placeholder:text-sidebar-foreground/40"
              />
              <Button className="w-full rounded-xl h-11">Suscribirse</Button>
            </form>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground/70 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sidebar-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-sidebar-foreground/50">
              © 2026 Serviteka San Pedro. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-sidebar-foreground/50 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
