'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { FilterDefinition, ActiveFilters } from '@/lib/filters/filterDefinitions';

interface FilterGroupProps {
  filter: FilterDefinition;
  activeFilters: ActiveFilters;
  onCheckboxChange: (filterId: string, value: string, checked: boolean) => void;
  onRangeChange: (filterId: string, range: [number, number]) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function FilterGroup({
  filter,
  activeFilters,
  onCheckboxChange,
  onRangeChange,
}: FilterGroupProps) {
  const selectedValues = (activeFilters[filter.id] as string[] | undefined) ?? [];
  const rangeValue = activeFilters[filter.id] as [number, number] | undefined;

  return (
    <div className="border-b border-neutral-100 last:border-b-0 pb-4 last:pb-0">
      {/* Header — label only, no toggle */}
      <div className="py-2">
        <span className="text-sm font-semibold text-neutral-800">{filter.label}</span>
      </div>

      {/* Content — always visible */}
      <div className="mt-1 space-y-1.5">
        {filter.type === 'checkbox' && filter.options && (
          <>
            {filter.options.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      onCheckboxChange(filter.id, option.value, e.target.checked)
                    }
                    className="w-4 h-4 rounded border-neutral-300 accent-[#fca50f] cursor-pointer"
                  />
                  <span
                    className={cn(
                      'text-sm transition-colors',
                      isChecked
                        ? 'text-neutral-900 font-medium'
                        : 'text-neutral-600 group-hover:text-neutral-900'
                    )}
                  >
                    {option.label}
                    {option.count !== undefined && (
                      <span className="text-neutral-400 ml-1">
                        ({option.count})
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </>
        )}

        {filter.type === 'range' && (
          <div className="space-y-3 pt-1">
            {/* Single price range label */}
            <div className="text-xs text-neutral-500 font-medium">
              {formatCurrency(rangeValue?.[0] ?? filter.min ?? 0)}
              {' — '}
              {formatCurrency(rangeValue?.[1] ?? filter.max ?? 0)}
            </div>
            {/* Single range slider */}
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step ?? 1}
              value={rangeValue?.[1] ?? filter.max ?? 0}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                const currentMin = filter.min ?? 0;
                onRangeChange(filter.id, [currentMin, newMax]);
              }}
              className="w-full accent-[#fca50f] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{formatCurrency(filter.min ?? 0)}</span>
              <span>{formatCurrency(filter.max ?? 0)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
