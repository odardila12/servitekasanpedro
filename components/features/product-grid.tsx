"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/types";

const products: Product[] = [
  {
    id: 1,
    name: "Llanta Michelin Primacy 4+ 205/55R16",
    brand: "Michelin",
    category: "Llantas",
    price: 2849,
    originalPrice: 3499,
    discount: 19,
    rating: 4.8,
    reviews: 234,
    image: "/images/products/tire-premium.jpg",
    tags: ["Mas vendido", "Instalacion gratis"],
    inStock: true,
    freeInstall: true,
  },
  {
    id: 2,
    name: "Bateria LTH Hi-TEC H-42-550",
    brand: "LTH",
    category: "Baterias",
    price: 2199,
    originalPrice: 2899,
    discount: 24,
    rating: 4.7,
    reviews: 189,
    image: "/images/products/battery-premium.jpg",
    tags: ["30% OFF"],
    inStock: true,
    freeInstall: true,
  },
  {
    id: 3,
    name: "Aceite Mobil 1 Sintetico 5W-30 (4.73L)",
    brand: "Mobil 1",
    category: "Lubricantes",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.9,
    reviews: 456,
    image: "/images/products/oil-synthetic.jpg",
    tags: ["Premium", "Full Sintetico"],
    inStock: true,
    freeInstall: false,
  },
  {
    id: 4,
    name: "Balatas Ceramicas Bosch QuietCast",
    brand: "Bosch",
    category: "Accesorios",
    price: 1349,
    originalPrice: 1799,
    discount: 25,
    rating: 4.6,
    reviews: 127,
    image: "/images/products/brake-pads.jpg",
    tags: ["Ceramicas"],
    inStock: true,
    freeInstall: true,
  },
  {
    id: 5,
    name: "Filtro de Aire K&N Alto Flujo",
    brand: "K&N",
    category: "Accesorios",
    price: 749,
    originalPrice: 999,
    discount: 25,
    rating: 4.5,
    reviews: 98,
    image: "/images/products/air-filter.jpg",
    tags: ["Alto rendimiento"],
    inStock: true,
    freeInstall: false,
  },
  {
    id: 6,
    name: "Plumas Bosch Aerotwin 22/19",
    brand: "Bosch",
    category: "Accesorios",
    price: 449,
    originalPrice: 599,
    discount: 25,
    rating: 4.4,
    reviews: 76,
    image: "/images/products/wiper-blades.jpg",
    tags: ["Par completo"],
    inStock: true,
    freeInstall: true,
  },
  {
    id: 7,
    name: "Anticongelante Prestone 50/50 (3.78L)",
    brand: "Prestone",
    category: "Lubricantes",
    price: 329,
    originalPrice: 449,
    discount: 27,
    rating: 4.7,
    reviews: 143,
    image: "/images/products/coolant.jpg",
    tags: ["Universal"],
    inStock: true,
    freeInstall: false,
  },
  {
    id: 8,
    name: "Llanta Continental PremiumContact 6",
    brand: "Continental",
    category: "Llantas",
    price: 3299,
    originalPrice: 4199,
    discount: 21,
    rating: 4.9,
    reviews: 312,
    image: "/images/products/tire-premium.jpg",
    tags: ["Premium", "Instalacion gratis"],
    inStock: true,
    freeInstall: true,
  },
];

const filterCategories = [
  { name: "Todas", count: 8 },
  { name: "Llantas", count: 2 },
  { name: "Baterias", count: 1 },
  { name: "Lubricantes", count: 2 },
  { name: "Accesorios", count: 3 },
];

const filterBrands = [
  "Michelin",
  "LTH",
  "Mobil 1",
  "Bosch",
  "K&N",
  "Continental",
  "Prestone",
];

const priceRanges = [
  { label: "Menos de $500", min: 0, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "$1,000 - $2,000", min: 1000, max: 2000 },
  { label: "$2,000 - $3,000", min: 2000, max: 3000 },
  { label: "Mas de $3,000", min: 3000, max: Infinity },
];

interface ProductGridProps {
  category?: string;
}

export function ProductGrid({ category }: ProductGridProps = {}) {
  const [activeCategory, setActiveCategory] = useState(
    category ? category.charAt(0).toUpperCase() + category.slice(1) : "Todas"
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Memoized filtered products to avoid recalculating on every render
  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (activeCategory !== "Todas" && p.category !== activeCategory)
          return false;
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand))
          return false;
        if (selectedPrice) {
          const range = priceRanges.find((r) => r.label === selectedPrice);
          if (range && (p.price < range.min || p.price > range.max))
            return false;
        }
        return true;
      }),
    [activeCategory, selectedBrands, selectedPrice]
  );

  // Memoized callbacks to prevent child re-renders
  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  return (
    <section className="py-16 lg:py-20" id="productos">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight text-balance">
              Productos Destacados
            </h2>
            <p className="mt-2 text-white/40 text-sm">
              Las mejores ofertas seleccionadas para ti
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="lg:hidden rounded-xl border-white/10 text-white/60 hover:text-white hover:bg-white/5 bg-transparent"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal className="size-4 mr-2" />
              Filtrar
            </Button>
            <a
              href="#"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[oklch(0.65_0.2_250)] hover:text-[oklch(0.7_0.2_250)] transition-colors"
            >
              Ver todo
              <ChevronRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
              {/* Categories filter */}
              <div>
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Categorias
                </h3>
                <div className="space-y-1">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-300",
                        activeCategory === cat.name
                          ? "bg-[oklch(0.65_0.2_250)]/15 text-white font-medium"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-white/30">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Brand filter */}
              <div>
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Marcas
                </h3>
                <div className="space-y-1">
                  {filterBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-xl transition-all duration-300",
                        selectedBrands.includes(brand)
                          ? "text-white bg-white/5"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div
                        className={cn(
                          "size-4 rounded border flex items-center justify-center transition-all",
                          selectedBrands.includes(brand)
                            ? "bg-[oklch(0.65_0.2_250)] border-[oklch(0.65_0.2_250)]"
                            : "border-white/20"
                        )}
                      >
                        {selectedBrands.includes(brand) && (
                          <Check className="size-3 text-white" />
                        )}
                      </div>
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Price filter */}
              <div>
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Precio
                </h3>
                <div className="space-y-1">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setSelectedPrice(
                          selectedPrice === range.label ? null : range.label
                        )
                      }
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-xl transition-all duration-300",
                        selectedPrice === range.label
                          ? "text-white bg-white/5"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div
                        className={cn(
                          "size-4 rounded-full border flex items-center justify-center transition-all",
                          selectedPrice === range.label
                            ? "bg-[oklch(0.65_0.2_250)] border-[oklch(0.65_0.2_250)]"
                            : "border-white/20"
                        )}
                      >
                        {selectedPrice === range.label && (
                          <div className="size-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(selectedBrands.length > 0 ||
                selectedPrice ||
                activeCategory !== "Todas") && (
                <Button
                  variant="ghost"
                  className="w-full text-white/40 hover:text-white hover:bg-white/5 rounded-xl text-sm"
                  onClick={() => {
                    setActiveCategory("Todas");
                    setSelectedBrands([]);
                    setSelectedPrice(null);
                  }}
                >
                  <X className="size-3.5 mr-1.5" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-[oklch(0.15_0.01_250)] p-6 overflow-y-auto animate-in slide-in-from-left">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Filtros</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/50 hover:text-white rounded-xl"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="size-5" />
                  </Button>
                </div>
                {/* Same filter content as desktop */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                      Categorias
                    </h3>
                    <div className="space-y-1">
                      {filterCategories.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setActiveCategory(cat.name);
                            setSidebarOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-xl transition-all",
                            activeCategory === cat.name
                              ? "bg-[oklch(0.65_0.2_250)]/15 text-white font-medium"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs text-white/30">
                            {cat.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                      Marcas
                    </h3>
                    <div className="space-y-1">
                      {filterBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={cn(
                            "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-xl transition-all",
                            selectedBrands.includes(brand)
                              ? "text-white bg-white/5"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <div
                            className={cn(
                              "size-4 rounded border flex items-center justify-center transition-all",
                              selectedBrands.includes(brand)
                                ? "bg-[oklch(0.65_0.2_250)] border-[oklch(0.65_0.2_250)]"
                                : "border-white/20"
                            )}
                          >
                            {selectedBrands.includes(brand) && (
                              <Check className="size-3 text-white" />
                            )}
                          </div>
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-white/40">
                <span className="text-white font-medium">
                  {filteredProducts.length}
                </span>{" "}
                productos encontrados
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30 hidden sm:block">
                  Ordenar por:
                </span>
                <button className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
                  Mas relevantes
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <SlidersHorizontal className="size-7 text-white/20" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Sin resultados
                </h3>
                <p className="text-sm text-white/40 max-w-sm">
                  No se encontraron productos con los filtros seleccionados.
                  Intenta con otros criterios.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const ProductCard = React.memo(
  ({
    product,
    isFavorite,
    onToggleFavorite,
  }: {
    product: Product;
    isFavorite: boolean;
    onToggleFavorite: () => void;
  }) => (
    <div className="group glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.02]">
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-white/[0.02] p-6 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[oklch(0.55_0.24_27)] to-[oklch(0.60_0.22_15)] text-white text-xs font-bold shadow-lg shadow-[oklch(0.55_0.24_27)]/30">
              -{product.discount}% OFF
            </div>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={onToggleFavorite}
          className={cn(
            "absolute top-4 right-4 size-9 rounded-xl flex items-center justify-center transition-all duration-300",
            isFavorite
              ? "bg-[oklch(0.55_0.24_27)] text-white shadow-lg shadow-[oklch(0.55_0.24_27)]/30"
              : "glass text-white/40 hover:text-white hover:bg-white/10"
          )}
        >
          <Heart className={cn("size-4", isFavorite && "fill-current")} />
          <span className="sr-only">Agregar a favoritos</span>
        </button>

        {/* Quick tags */}
        {product.tags.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-[10px] font-medium text-white/80 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        <span className="text-[10px] font-semibold text-[oklch(0.65_0.2_250)] uppercase tracking-wider">
          {product.brand}
        </span>

        {/* Name */}
        <h3 className="mt-1.5 text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < Math.floor(product.rating)
                    ? "text-[oklch(0.75_0.18_55)] fill-[oklch(0.75_0.18_55)]"
                    : "text-white/10"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-white/40">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-4">
          <span className="text-xl font-bold text-white">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-white/30 line-through mb-0.5">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Install badge */}
        {product.freeInstall && (
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-emerald-400/80">
            <Check className="size-3" />
            Instalacion gratis incluida
          </div>
        )}

        {/* Add to cart */}
        <Button className="w-full mt-4 h-11 bg-white/5 hover:bg-[oklch(0.65_0.2_250)] text-white/80 hover:text-white border border-white/10 hover:border-[oklch(0.65_0.2_250)] rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[oklch(0.65_0.2_250)]/20">
          <ShoppingCart className="size-4 mr-2" />
          Agregar al Carrito
        </Button>
      </div>
    </div>
  )
);
