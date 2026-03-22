"use client";

import { useState } from "react";
import { Search, Car, CircleDot, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const searchTabs = [
  { id: "vehicle", label: "Por Vehículo", icon: Car },
  { id: "tire", label: "Por Medida", icon: CircleDot },
  { id: "battery", label: "Por Batería", icon: Battery },
];

const vehicleMakes = [
  "Acura",
  "Audi",
  "BMW",
  "Chevrolet",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Toyota",
  "Volkswagen",
];
const vehicleYears = Array.from({ length: 25 }, (_, i) =>
  (2025 - i).toString()
);

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("vehicle");

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      {/* Decorative elements */}
      <div aria-hidden="true" className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-xl" />
      <div aria-hidden="true" className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Instalación profesional incluida
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-sidebar-foreground leading-tight">
              Tu vehículo merece{" "}
              <span className="relative">
                <span className="text-gradient">lo mejor</span>
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 3 150 3 198 8"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-primary/30"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg text-sidebar-foreground/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Encuentra las mejores llantas, baterías y lubricantes para tu
              vehículo. Más de 15 años de experiencia respaldando cada kilómetro
              de tu camino.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Garantía extendida
              </div>
              <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Envío gratis +$2,000
              </div>
              <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Instalación incluida
              </div>
            </div>
          </div>

          {/* Right - Search widget */}
          <div className="relative">
            <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-premium">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Encuentra tu producto ideal
              </h2>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl">
                {searchTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search forms */}
              <div className="space-y-4">
                {activeTab === "vehicle" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0">
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleYears.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0">
                          <SelectValue placeholder="Marca" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleMakes.map((make) => (
                            <SelectItem key={make} value={make.toLowerCase()}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0">
                        <SelectValue placeholder="Modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-make">
                          Selecciona marca primero
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}

                {activeTab === "tire" && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <Input
                        placeholder="Ancho"
                        className="h-12 rounded-xl bg-muted/50 border-0 text-center"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        mm
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Perfil"
                        className="h-12 rounded-xl bg-muted/50 border-0 text-center"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        %
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Rin"
                        className="h-12 rounded-xl bg-muted/50 border-0 text-center"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        in
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "battery" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0">
                        <SelectValue placeholder="Tipo de vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="camioneta">Camioneta</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="moto">Motocicleta</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0">
                        <SelectValue placeholder="Marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleMakes.map((make) => (
                          <SelectItem key={make} value={make.toLowerCase()}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button className="w-full h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar productos
                </Button>
              </div>

              {/* Quick links */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  Búsquedas populares:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Llantas 205/55R16",
                    "Batería LTH",
                    "Aceite Mobil 5W-30",
                  ].map((term) => (
                    <button
                      key={term}
                      className="px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
