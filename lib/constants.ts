export const CATEGORIES = [
  {
    id: "llantas",
    name: "Llantas",
    slug: "llantas",
    description: "Llantas de alta calidad para todo tipo de vehículos",
    icon: "Wheel",
  },
  {
    id: "baterias",
    name: "Baterías",
    slug: "baterias",
    description: "Baterías premium con garantía extendida",
    icon: "Zap",
  },
  {
    id: "lubricantes",
    name: "Lubricantes",
    slug: "lubricantes",
    description: "Aceites y lubricantes de marcas reconocidas",
    icon: "Droplet",
  },
  {
    id: "accesorios",
    name: "Accesorios",
    slug: "accesorios",
    description: "Accesorios automotrices variados",
    icon: "Settings",
  },
];

// Subcategorías por categoría principal
export const SUBCATEGORIES: Record<string, Array<{ id: string; name: string; slug: string; description: string }>> = {
  llantas: [
    { id: "llantas-auto", name: "Llantas para Auto", slug: "llantas/auto", description: "Llantas diseñadas para vehículos sedán y compactos" },
    { id: "llantas-camioneta", name: "Llantas para Camioneta", slug: "llantas/camioneta", description: "Llantas reforzadas para camionetas y pickups" },
    { id: "llantas-suv", name: "Llantas para SUV", slug: "llantas/suv", description: "Llantas de alto rendimiento para SUV y crossovers" },
    { id: "llantas-todo-terreno", name: "Llantas Todo Terreno", slug: "llantas/todo-terreno", description: "Llantas para aventura y terrenos difíciles" },
  ],
  baterias: [
    { id: "baterias-auto", name: "Baterías para Auto", slug: "baterias/auto", description: "Baterías estándar para automóviles" },
    { id: "baterias-camioneta", name: "Baterías para Camioneta", slug: "baterias/camioneta", description: "Baterías de alta capacidad para camionetas" },
    { id: "baterias-agm", name: "Baterías AGM", slug: "baterias/agm", description: "Baterías AGM para sistemas de energía avanzados" },
    { id: "baterias-efb", name: "Baterías EFB", slug: "baterias/efb", description: "Baterías EFB para vehículos con tecnología start-stop" },
  ],
  lubricantes: [
    { id: "lubricantes-motor", name: "Aceites de Motor", slug: "lubricantes/motor", description: "Aceites de motor sintético y mineral" },
    { id: "lubricantes-transmision", name: "Aceites para Transmisión", slug: "lubricantes/transmision", description: "Aceites especializados para transmisiones automáticas y manuales" },
    { id: "lubricantes-frenos", name: "Líquido de Frenos", slug: "lubricantes/frenos", description: "Líquidos de frenos de alta calidad" },
    { id: "lubricantes-anticongelante", name: "Anticongelantes", slug: "lubricantes/anticongelante", description: "Líquidos refrigerantes para sistema de enfriamiento" },
  ],
  accesorios: [
    { id: "accesorios-fundas", name: "Fundas y Tapetes", slug: "accesorios/fundas", description: "Fundas protectoras y tapetes automotrices" },
    { id: "accesorios-limpieza", name: "Limpieza Automotriz", slug: "accesorios/limpieza", description: "Productos de limpieza y detallado automotriz" },
    { id: "accesorios-herramientas", name: "Herramientas", slug: "accesorios/herramientas", description: "Herramientas para mantenimiento y reparación" },
    { id: "accesorios-iluminacion", name: "Iluminación LED", slug: "accesorios/iluminacion", description: "Sistemas de iluminación LED para vehículos" },
  ],
};

export const BRANDS = [
  "Michelin",
  "Bridgestone",
  "Continental",
  "Pirelli",
  "Goodyear",
  "LTH",
  "Mobil 1",
  "Castrol",
  "Shell",
  "YPF",
];

export const PRICE_RANGES = [
  { label: "Menos de $500", min: 0, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "$1000 - $2000", min: 1000, max: 2000 },
  { label: "$2000 - $5000", min: 2000, max: 5000 },
  { label: "Más de $5000", min: 5000, max: Infinity },
];
