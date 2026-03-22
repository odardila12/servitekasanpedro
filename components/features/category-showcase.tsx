"use client";

import Link from "next/link";
import {
  CircleDot,
  Battery,
  Droplets,
  Wrench,
  ChevronRight,
} from "lucide-react";

const categoryIconMap: Record<string, any> = {
  Wheel: CircleDot,
  Zap: Battery,
  Droplet: Droplets,
  Settings: Wrench,
};

const categoryConfig: Record<
  string,
  {
    count: string;
    gradient: string;
    iconColor: string;
    borderColor: string;
  }
> = {
  llantas: {
    count: "2,400+",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  baterias: {
    count: "850+",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
    borderColor: "border-accent/20",
  },
  lubricantes: {
    count: "1,200+",
    gradient: "from-success/20 to-success/5",
    iconColor: "text-success",
    borderColor: "border-success/20",
  },
  accesorios: {
    count: "3,500+",
    gradient: "from-destructive/20 to-destructive/5",
    iconColor: "text-destructive",
    borderColor: "border-destructive/20",
  },
};

import { CATEGORIES } from "@/lib/constants";

const categories = CATEGORIES.map((cat) => ({
  ...cat,
  ...categoryConfig[cat.slug],
  icon: categoryIconMap[cat.icon],
}));

export function CategoryShowcase() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight text-balance">
              Explora por Categoria
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Encuentra exactamente lo que necesitas para tu vehiculo
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Ver todas
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/${cat.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.borderColor} p-6 lg:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
            >
              <div className="relative z-10">
                <div
                  className={`size-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ${cat.iconColor}`}
                >
                  <cat.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {cat.count} productos
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
              {/* Decorative glow */}
              <div
                className={`absolute -bottom-12 -right-12 size-32 rounded-full bg-gradient-to-br ${cat.gradient} blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
