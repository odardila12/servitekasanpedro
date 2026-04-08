// Filter system type definitions and per-category configs

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'toggle';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface CategoryFilterConfig {
  id: string;
  filters: FilterDefinition[];
}

export type ActiveFilters = Record<string, string[] | [number, number]>;

// ─── Llantas ──────────────────────────────────────────────────────────────────

const llantasFilters: FilterDefinition[] = [
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox',
    options: [
      { value: 'michelin', label: 'Michelin' },
      { value: 'bridgestone', label: 'Bridgestone' },
      { value: 'continental', label: 'Continental' },
      { value: 'pirelli', label: 'Pirelli' },
      { value: 'goodyear', label: 'Goodyear' },
      { value: 'hankook', label: 'Hankook' },
      { value: 'yokohama', label: 'Yokohama' },
      { value: 'kumho', label: 'Kumho' },
      { value: 'dunlop', label: 'Dunlop' },
      { value: 'falken', label: 'Falken' },
      { value: 'toyo', label: 'Toyo' },
      { value: 'nexen', label: 'Nexen' },
      { value: 'cooper', label: 'Cooper' },
      { value: 'bfgoodrich', label: 'BFGoodrich' },
      { value: 'nitto', label: 'Nitto' },
    ],
  },
  {
    id: 'ancho',
    label: 'Ancho (mm)',
    type: 'checkbox',
    options: [
      { value: '175', label: '175' },
      { value: '185', label: '185' },
      { value: '195', label: '195' },
      { value: '205', label: '205' },
      { value: '215', label: '215' },
      { value: '225', label: '225' },
      { value: '235', label: '235' },
      { value: '245', label: '245' },
      { value: '255', label: '255' },
    ],
  },
  {
    id: 'perfil',
    label: 'Perfil',
    type: 'checkbox',
    options: [
      { value: '35', label: '35' },
      { value: '40', label: '40' },
      { value: '45', label: '45' },
      { value: '50', label: '50' },
      { value: '55', label: '55' },
      { value: '60', label: '60' },
      { value: '65', label: '65' },
    ],
  },
  {
    id: 'rin',
    label: 'Rin',
    type: 'checkbox',
    options: [
      { value: 'R14', label: 'R14' },
      { value: 'R15', label: 'R15' },
      { value: 'R16', label: 'R16' },
      { value: 'R17', label: 'R17' },
      { value: 'R18', label: 'R18' },
      { value: 'R19', label: 'R19' },
      { value: 'R20', label: 'R20' },
    ],
  },
  {
    id: 'price',
    label: 'Precio',
    type: 'range',
    min: 0,
    max: 700000,
    step: 10000,
    unit: 'COP',
  },
];

// ─── Baterias ─────────────────────────────────────────────────────────────────

const bateriasFilters: FilterDefinition[] = [
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox',
    options: [
      { value: 'moura', label: 'Moura' },
      { value: 'bosch', label: 'Bosch' },
      { value: 'varta', label: 'Varta' },
      { value: 'acdelco', label: 'ACDelco' },
      { value: 'exide', label: 'Exide' },
      { value: 'optima', label: 'Optima' },
      { value: 'century', label: 'Century' },
    ],
  },
  {
    id: 'amperaje',
    label: 'Amperaje',
    type: 'checkbox',
    options: [
      { value: '50Ah', label: '50 Ah' },
      { value: '55Ah', label: '55 Ah' },
      { value: '60Ah', label: '60 Ah' },
      { value: '68Ah', label: '68 Ah' },
      { value: '70Ah', label: '70 Ah' },
      { value: '75Ah', label: '75 Ah' },
      { value: '80Ah', label: '80 Ah' },
    ],
  },
  {
    id: 'tipo',
    label: 'Tipo',
    type: 'checkbox',
    options: [
      { value: 'convencional', label: 'Convencional' },
      { value: 'agm', label: 'AGM' },
      { value: 'gel', label: 'Gel' },
      { value: 'efb', label: 'EFB' },
    ],
  },
  {
    id: 'price',
    label: 'Precio',
    type: 'range',
    min: 0,
    max: 700000,
    step: 10000,
    unit: 'COP',
  },
];

// ─── Lubricantes ──────────────────────────────────────────────────────────────

const lubricantesFilters: FilterDefinition[] = [
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox',
    options: [
      { value: 'mobil', label: 'Mobil' },
      { value: 'castrol', label: 'Castrol' },
      { value: 'shell', label: 'Shell' },
      { value: 'pennzoil', label: 'Pennzoil' },
      { value: 'peak', label: 'PEAK' },
    ],
  },
  {
    id: 'viscosidad',
    label: 'Viscosidad',
    type: 'checkbox',
    options: [
      { value: '5W-20', label: '5W-20' },
      { value: '5W-30', label: '5W-30' },
      { value: '5W-40', label: '5W-40' },
      { value: '10W-30', label: '10W-30' },
      { value: '10W-40', label: '10W-40' },
      { value: '15W-40', label: '15W-40' },
    ],
  },
  {
    id: 'tipo',
    label: 'Tipo',
    type: 'checkbox',
    options: [
      { value: 'sintetico', label: 'Sintético' },
      { value: 'semisintetico', label: 'Semisintético' },
      { value: 'mineral', label: 'Mineral' },
    ],
  },
  {
    id: 'volumen',
    label: 'Volumen',
    type: 'checkbox',
    options: [
      { value: '1L', label: '1 Litro' },
      { value: '4L', label: '4 Litros' },
      { value: '5L', label: '5 Litros' },
    ],
  },
  {
    id: 'price',
    label: 'Precio',
    type: 'range',
    min: 0,
    max: 200000,
    step: 5000,
    unit: 'COP',
  },
];

// ─── Accesorios ───────────────────────────────────────────────────────────────

const accesoriosFilters: FilterDefinition[] = [
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox',
    options: [
      { value: 'generico', label: 'Genérico' },
      { value: 'racing', label: 'Racing' },
      { value: 'premium', label: 'Premium' },
    ],
  },
  {
    id: 'price',
    label: 'Precio',
    type: 'range',
    min: 0,
    max: 200000,
    step: 5000,
    unit: 'COP',
  },
];

// ─── Registry ────────────────────────────────────────────────────────────────

export const CATEGORY_FILTER_CONFIGS: Record<string, CategoryFilterConfig> = {
  llantas: { id: 'llantas', filters: llantasFilters },
  baterias: { id: 'baterias', filters: bateriasFilters },
  lubricantes: { id: 'lubricantes', filters: lubricantesFilters },
  accesorios: { id: 'accesorios', filters: accesoriosFilters },
};

export function getFiltersForCategory(slug: string): FilterDefinition[] {
  return CATEGORY_FILTER_CONFIGS[slug]?.filters ?? [];
}
