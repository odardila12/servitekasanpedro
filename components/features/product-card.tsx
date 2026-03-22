"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  badgeColor?: "primary" | "destructive" | "secondary";
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card p-4 shadow-premium transition-all duration-300 hover:shadow-glass hover:-translate-y-1",
        className
      )}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discountPercentage && (
          <Badge className="bg-destructive text-destructive-foreground font-semibold px-2.5 py-1 rounded-lg">
            -{discountPercentage}%
          </Badge>
        )}
        {product.badge && (
          <Badge
            variant={
              product.badgeColor === "destructive" ? "destructive" : "secondary"
            }
            className={cn(
              "font-medium px-2.5 py-1 rounded-lg",
              product.badgeColor === "primary" &&
                "bg-primary text-primary-foreground"
            )}
          >
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Wishlist button */}
      <button className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <Link
        href={`/producto/${product.id}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-muted/30 mb-4"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Brand */}
        <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-foreground">
              ${product.price.toLocaleString("es-MX")}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString("es-MX")}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={cn(
                "inline-flex h-2 w-2 rounded-full",
                product.inStock ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {product.inStock ? "En existencia" : "Agotado"}
            </span>
          </div>

          {/* Add to cart button */}
          <Button
            className="w-full h-10 rounded-xl font-medium transition-all duration-200"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
