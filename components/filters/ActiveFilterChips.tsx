'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ActiveFilters, FilterDefinition } from '@/lib/filters/filterDefinitions';

interface ActiveFilterChipsProps {
  activeFilters: ActiveFilters;
  filterDefinitions: FilterDefinition[];
  onRemove: (filterId: string, value?: string) => void;
  onClearAll: () => void;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ActiveFilterChips({
  activeFilters,
  filterDefinitions,
  onRemove,
  onClearAll,
  className,
}: ActiveFilterChipsProps) {
  const chips: { filterId: string; value?: string; label: string }[] = [];

  for (const [filterId, filterValue] of Object.entries(activeFilters)) {
    const definition = filterDefinitions.find((f) => f.id === filterId);

    if (Array.isArray(filterValue)) {
      // Range filter [min, max]
      if (
        filterValue.length === 2 &&
        typeof filterValue[0] === 'number' &&
        typeof filterValue[1] === 'number'
      ) {
        const [min, max] = filterValue as [number, number];
        chips.push({
          filterId,
          label: `${definition?.label ?? filterId}: ${formatCurrency(min)} – ${formatCurrency(max)}`,
        });
      } else {
        // Checkbox multi-select
        for (const value of filterValue as string[]) {
          const option = definition?.options?.find((o) => o.value === value);
          chips.push({
            filterId,
            value,
            label: option?.label ?? value,
          });
        }
      }
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-xs font-medium text-neutral-500 shrink-0">
        Filtros:
      </span>

      {chips.map((chip) => (
        <button
          key={`${chip.filterId}-${chip.value ?? 'range'}`}
          onClick={() => onRemove(chip.filterId, chip.value)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1',
            'text-xs font-medium rounded-full',
            'bg-[#fca50f]/10 text-neutral-800 border border-[#fca50f]/30',
            'hover:bg-[#fca50f]/20 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fca50f]'
          )}
        >
          {chip.label}
          <span className="text-neutral-500 hover:text-neutral-900" aria-hidden="true">
            ×
          </span>
        </button>
      ))}

      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className={cn(
            'text-xs font-medium text-neutral-500',
            'hover:text-neutral-900 underline transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400'
          )}
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}
