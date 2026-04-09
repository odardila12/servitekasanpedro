'use client';

import { X, SlidersHorizontal } from 'lucide-react';
import type { ActiveFilters } from '@/lib/filters/filterDefinitions';
import type { SortOption } from '@/lib/hooks/useProductFilters';

interface ProductSubheaderProps {
  category?: string;
  activeFilters: ActiveFilters;
  setFilter: (filterId: string, value: string, checked: boolean) => void;
  setPriceRange: (filterId: string, range: [number, number]) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
}

// Brands available per category — values must be lowercase to match FEATURED_PRODUCTS brand field
const BRAND_BY_CATEGORY: Record<string, { value: string; label: string }[]> = {
  llantas: [
    { value: 'michelin', label: 'Michelin' },
    { value: 'bridgestone', label: 'Bridgestone' },
    { value: 'pirelli', label: 'Pirelli' },
    { value: 'continental', label: 'Continental' },
    { value: 'goodyear', label: 'Goodyear' },
    { value: 'hankook', label: 'Hankook' },
    { value: 'yokohama', label: 'Yokohama' },
  ],
  baterias: [
    { value: 'moura', label: 'Moura' },
    { value: 'bosch', label: 'Bosch' },
    { value: 'varta', label: 'Varta' },
    { value: 'exide', label: 'Exide' },
    { value: 'optima', label: 'Optima' },
    { value: 'century', label: 'Century' },
    { value: 'acdelco', label: 'ACDelco' },
  ],
  lubricantes: [
    { value: 'castrol', label: 'Castrol' },
    { value: 'mobil', label: 'Mobil' },
    { value: 'shell', label: 'Shell' },
    { value: 'ypf', label: 'YPF' },
    { value: 'chevron', label: 'Chevron' },
  ],
  aceites: [
    { value: 'castrol', label: 'Castrol' },
    { value: 'mobil', label: 'Mobil' },
    { value: 'shell', label: 'Shell' },
    { value: 'ypf', label: 'YPF' },
    { value: 'chevron', label: 'Chevron' },
    { value: 'pennzoil', label: 'Pennzoil' },
    { value: 'bosch', label: 'Bosch' },
  ],
  filtros: [
    { value: 'mann', label: 'Mann' },
    { value: 'fram', label: 'Fram' },
    { value: 'wix', label: 'WIX' },
    { value: 'purolator', label: 'Purolator' },
    { value: 'kn', label: 'K&N' },
    { value: 'racor', label: 'Racor' },
    { value: 'acdelco', label: 'ACDelco' },
  ],
  servicios: [],
};

// Per-category dropdown config — values must match filterDefinitions options AND FEATURED_PRODUCTS data exactly
const FILTER_OPTIONS: Record<
  string,
  { label: string; filterId: string; options: { value: string; label: string }[] }
> = {
  viscosidad: {
    label: 'Grado Aceite',
    filterId: 'viscosidad',
    // values must match specs.viscosidad in FEATURED_PRODUCTS (no dash format for aceites category)
    options: [
      { value: '0W20', label: '0W-20' },
      { value: '0W40', label: '0W-40' },
      { value: '5W30', label: '5W-30' },
      { value: '5W40', label: '5W-40' },
      { value: '10W40', label: '10W-40' },
      { value: '15W40', label: '15W-40' },
      { value: '20W50', label: '20W-50' },
    ],
  },
  // brand is intentionally omitted here — resolved dynamically per category via BRAND_BY_CATEGORY

  tipo: {
    label: 'Tipo',
    filterId: 'tipo',
    // values must match filterDefinitions option values and FEATURED_PRODUCTS specs.tipo
    options: [
      { value: 'sintetico', label: 'Sintético' },
      { value: 'semisintetico', label: 'Semisintético' },
      { value: 'mineral', label: 'Mineral' },
      { value: 'convencional', label: 'Convencional' },
      { value: 'agm', label: 'AGM' },
      { value: 'gel', label: 'Gel' },
      { value: 'efb', label: 'EFB' },
    ],
  },
  ancho: {
    label: 'Ancho (mm)',
    filterId: 'ancho',
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
  // Filtros (auto parts filters) — uses same filterId 'tipo' as it maps to specs.tipo in FEATURED_PRODUCTS
  tipoFiltro: {
    label: 'Tipo Filtro',
    filterId: 'tipo',
    options: [
      { value: 'aire', label: 'Aire' },
      { value: 'aceite', label: 'Aceite' },
      { value: 'cabina', label: 'Cabina' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'gasolina', label: 'Gasolina' },
    ],
  },
};

type FilterKey = keyof typeof FILTER_OPTIONS | 'brand';

// Which dropdowns to show per category
// 'brand' is a special key resolved dynamically from BRAND_BY_CATEGORY
const VISIBLE_DROPDOWNS: Record<string, FilterKey[]> = {
  llantas: ['brand', 'ancho'],
  lubricantes: ['viscosidad', 'brand', 'tipo'],
  aceites: ['viscosidad', 'brand', 'tipo'],
  baterias: ['brand', 'tipo'],
  filtros: ['tipoFiltro', 'brand'],
  servicios: [],
};
const DEFAULT_DROPDOWNS: FilterKey[] = [];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating-desc', label: 'Mejor valorados' },
  { value: 'newest', label: 'Más recientes' },
];

// Price defaults per category
const PRICE_MAX: Record<string, number> = {
  llantas: 700000,
  baterias: 700000,
  lubricantes: 200000,
  aceites: 60000,
  filtros: 100000,
  servicios: 250000,
};
const DEFAULT_PRICE_MAX = 500000;

const SELECT_CLASSES =
  'px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 bg-white ' +
  'hover:border-neutral-400 hover:shadow-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
  'transition-all duration-150 cursor-pointer appearance-none ' +
  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' fill=\'none\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%236b7280\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")] ' +
  'bg-no-repeat bg-[right_10px_center] pr-8';

const INPUT_CLASSES =
  'px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-700 bg-white ' +
  'placeholder:text-neutral-400 ' +
  'hover:border-neutral-400 hover:shadow-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
  'transition-all duration-150';

export default function ProductSubheader({
  category,
  activeFilters,
  setFilter,
  setPriceRange,
  clearAllFilters,
  hasActiveFilters,
  sortBy,
  setSortBy,
}: ProductSubheaderProps) {
  const visibleDropdowns =
    category && VISIBLE_DROPDOWNS[category]
      ? VISIBLE_DROPDOWNS[category]
      : DEFAULT_DROPDOWNS;

  const priceMax = category ? (PRICE_MAX[category] ?? DEFAULT_PRICE_MAX) : DEFAULT_PRICE_MAX;

  // Get currently selected single value for a filterId (first selected, or '')
  const getSelectedValue = (filterId: string): string => {
    const val = activeFilters[filterId];
    if (!val) return '';
    if (Array.isArray(val) && typeof val[0] === 'string') return val[0] as string;
    return '';
  };

  // Handle dropdown change: deselect old value, select new one
  const handleDropdownChange = (filterId: string, prev: string, next: string) => {
    if (prev) setFilter(filterId, prev, false);
    if (next) setFilter(filterId, next, true);
  };

  // Price range from activeFilters or defaults
  const priceRange = activeFilters['price'];
  const priceMin = Array.isArray(priceRange) && typeof priceRange[0] === 'number'
    ? (priceRange[0] as number)
    : 0;
  const priceMaxVal = Array.isArray(priceRange) && typeof priceRange[1] === 'number'
    ? (priceRange[1] as number)
    : priceMax;

  const handlePriceChange = (side: 'min' | 'max', raw: string) => {
    const parsed = parseInt(raw, 10);
    const val = isNaN(parsed) ? (side === 'min' ? 0 : priceMax) : parsed;
    const next: [number, number] =
      side === 'min' ? [val, priceMaxVal] : [priceMin, val];
    setPriceRange('price', next);
  };

  return (
    <div className="sticky top-24 z-40 bg-gradient-to-b from-white to-neutral-100 border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-3">
          {/* Scrollable filter row — horizontal scroll on mobile, wrap on desktop */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide md:flex-wrap md:overflow-visible">
            {/* Filter icon — visual anchor */}
            <SlidersHorizontal
              size={16}
              className="shrink-0 text-neutral-400"
              aria-hidden
            />

            {/* Dynamic dropdown filters */}
            {visibleDropdowns.map((key) => {
              // 'brand' is resolved per-category; all other keys come from FILTER_OPTIONS
              const isBrand = key === 'brand';
              const brandOptions = isBrand ? (BRAND_BY_CATEGORY[category ?? ''] ?? []) : [];
              // Skip brand dropdown when this category has no brands configured
              if (isBrand && brandOptions.length === 0) return null;

              const { label, filterId, options } = isBrand
                ? { label: 'Marca', filterId: 'brand', options: brandOptions }
                : FILTER_OPTIONS[key as keyof typeof FILTER_OPTIONS];
              const selected = getSelectedValue(filterId);
              const isActive = selected !== '';
              return (
                <select
                  key={key}
                  value={selected}
                  onChange={(e) => handleDropdownChange(filterId, selected, e.target.value)}
                  className={[
                    SELECT_CLASSES,
                    'shrink-0',
                    isActive
                      ? 'border-primary/60 bg-primary/5 text-primary font-medium ring-1 ring-primary/20'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={label}
                >
                  <option value="">{label}</option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              );
            })}

            {/* Price range */}
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                placeholder="$ Mín"
                value={priceMin === 0 ? '' : priceMin}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className={`${INPUT_CLASSES} w-24`}
                min={0}
                max={priceMax}
                aria-label="Precio mínimo"
              />
              <span className="text-neutral-400 text-xs font-medium">–</span>
              <input
                type="number"
                placeholder="$ Máx"
                value={priceMaxVal === priceMax ? '' : priceMaxVal}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className={`${INPUT_CLASSES} w-24`}
                min={0}
                max={priceMax}
                aria-label="Precio máximo"
              />
            </div>

            {/* Divider — hidden on mobile scroll */}
            <div className="hidden md:block h-6 w-px bg-neutral-200 mx-1 shrink-0" />

            {/* Sort selector — pushed to end on desktop */}
            <div className="flex items-center gap-1.5 shrink-0 md:ml-auto">
              <span className="hidden sm:inline text-xs text-neutral-500 font-medium whitespace-nowrap">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`${SELECT_CLASSES} shrink-0`}
                aria-label="Ordenar por"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear button — only visible when filters are active */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-lg border border-destructive/20 hover:border-destructive/30 transition-all duration-150"
                aria-label="Limpiar todos los filtros"
              >
                <X size={14} strokeWidth={2.5} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
