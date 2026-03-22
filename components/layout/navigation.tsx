"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Llantas",
    href: "/llantas",
    featured: [
      { name: "Llantas para Auto", href: "/llantas/auto" },
      { name: "Llantas para Camioneta", href: "/llantas/camioneta" },
      { name: "Llantas para SUV", href: "/llantas/suv" },
      { name: "Llantas Todo Terreno", href: "/llantas/todo-terreno" },
    ],
    brands: ["Michelin", "Bridgestone", "Goodyear", "Continental", "Pirelli"],
  },
  {
    name: "Baterías",
    href: "/baterias",
    featured: [
      { name: "Baterías para Auto", href: "/baterias/auto" },
      { name: "Baterías para Camioneta", href: "/baterias/camioneta" },
      { name: "Baterías AGM", href: "/baterias/agm" },
      { name: "Baterías EFB", href: "/baterias/efb" },
    ],
    brands: ["LTH", "AC Delco", "Bosch", "Motorcraft", "Optima"],
  },
  {
    name: "Lubricantes",
    href: "/lubricantes",
    featured: [
      { name: "Aceites de Motor", href: "/lubricantes/motor" },
      { name: "Aceites para Transmisión", href: "/lubricantes/transmision" },
      { name: "Líquido de Frenos", href: "/lubricantes/frenos" },
      { name: "Anticongelantes", href: "/lubricantes/anticongelante" },
    ],
    brands: ["Mobil 1", "Castrol", "Pennzoil", "Valvoline", "Shell"],
  },
  {
    name: "Accesorios",
    href: "/accesorios",
    featured: [
      { name: "Fundas y Tapetes", href: "/accesorios/fundas" },
      { name: "Limpieza Automotriz", href: "/accesorios/limpieza" },
      { name: "Herramientas", href: "/accesorios/herramientas" },
      { name: "Iluminación LED", href: "/accesorios/iluminacion" },
    ],
    brands: ["3M", "Armor All", "Meguiar's", "Chemical Guys", "WeatherTech"],
  },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const cartItemCount = 3;

  return (
    <>
      {/* Top bar */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a
                href="tel:+528112345678"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>(81) 1234-5678</span>
              </a>
              <span className="hidden sm:flex items-center gap-2 text-sidebar-foreground/70">
                <MapPin className="h-3.5 w-3.5" />
                San Pedro Garza García, N.L.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sidebar-foreground/70">
                Envío gratis en compras +$2,000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-50 glass-strong">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">
                  S
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-lg font-bold tracking-tight text-foreground">
                  Serviteka
                </p>
                <p className="text-xs text-muted-foreground -mt-0.5">
                  San Pedro
                </p>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    href={category.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                      activeCategory === category.name
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {category.name}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeCategory === category.name ? "rotate-180" : ""
                      )}
                    />
                  </Link>

                  {/* Mega menu */}
                  <div
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-300",
                      activeCategory === category.name
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                  >
                    <div className="w-[480px] rounded-2xl glass-strong p-6 shadow-premium">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                            Categorías
                          </h3>
                          <ul className="space-y-2">
                            {category.featured.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className="block py-1.5 text-sm text-foreground hover:text-primary transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                            Marcas Destacadas
                          </h3>
                          <ul className="space-y-2">
                            {category.brands.map((brand) => (
                              <li key={brand}>
                                <Link
                                  href={`${
                                    category.href
                                  }?marca=${brand.toLowerCase()}`}
                                  className="block py-1.5 text-sm text-foreground hover:text-primary transition-colors"
                                >
                                  {brand}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-border">
                        <Link
                          href={category.href}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Ver todos los {category.name.toLowerCase()} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/servicios"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
              >
                Servicios
              </Link>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-primary/10"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-background">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-[500px] border-t border-border" : "max-h-0"
          )}
        >
          <div className="px-4 py-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="block px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/servicios"
              className="block px-4 py-3 text-base font-medium text-foreground hover:bg-primary/5 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Servicios
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
