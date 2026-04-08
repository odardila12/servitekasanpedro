'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { FilterDefinition, ActiveFilters } from '@/lib/filters/filterDefinitions';

interface FilterGroupProps {
  filter: FilterDefinition;
  activeFilters: ActiveFilters;
  onCheckboxChange: (filterId: string, value: string, checked: boolean) => void;
  onRangeChange: (filterId: string, range: [number, number]) => void;
  defaultOpen?: boolean;
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
  defaultOpen = true,
}: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const selectedValues = (activeFilters[filter.id] as string[] | undefined) ?? [];
  const rangeValue = activeFilters[filter.id] as [number, number] | undefined;

  return (
    <div className="border-b border-neutral-100 last:border-b-0 pb-4 last:pb-0">
      {/* Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full flex items-center justify-between py-2',
          'text-sm font-semibold text-neutral-800',
          'hover:text-neutral-900 transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        )}
        aria-expanded={isOpen}
      >
        <span>{filter.label}</span>
        <span
          className={cn(
            'text-neutral-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="mt-2 space-y-1.5">
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
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{formatCurrency(rangeValue?.[0] ?? filter.min ?? 0)}</span>
                <span>{formatCurrency(rangeValue?.[1] ?? filter.max ?? 0)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-neutral-500 w-8 shrink-0">Min</label>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step ?? 1}
                    value={rangeValue?.[0] ?? filter.min ?? 0}
                    onChange={(e) => {
                      const newMin = Number(e.target.value);
                      const currentMax = rangeValue?.[1] ?? filter.max ?? 0;
                      onRangeChange(filter.id, [newMin, Math.max(newMin, currentMax)]);
                    }}
                    className="w-full accent-[#fca50f] cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-neutral-500 w-8 shrink-0">Max</label>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    step={filter.step ?? 1}
                    value={rangeValue?.[1] ?? filter.max ?? 0}
                    onChange={(e) => {
                      const newMax = Number(e.target.value);
                      const currentMin = rangeValue?.[0] ?? filter.min ?? 0;
                      onRangeChange(filter.id, [Math.min(currentMin, newMax), newMax]);
                    }}
                    className="w-full accent-[#fca50f] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
