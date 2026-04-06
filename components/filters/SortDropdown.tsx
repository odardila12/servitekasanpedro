'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options?: SortOption[];
  onChange?: (value: string) => void;
  defaultValue?: string;
}

const DEFAULT_OPTIONS: SortOption[] = [
  { label: 'Relevancia', value: 'relevance' },
  { label: 'Precio: Menor a Mayor', value: 'price-asc' },
  { label: 'Precio: Mayor a Menor', value: 'price-desc' },
  { label: 'Más Vendidos', value: 'bestseller' },
  { label: 'Más Reciente', value: 'newest' },
];

export function SortDropdown({
  options = DEFAULT_OPTIONS,
  onChange,
  defaultValue = 'relevance',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const selectedLabel = options.find((opt) => opt.value === selected)?.label || 'Ordenar';

  const handleSelect = (value: string) => {
    setSelected(value);
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-2 border-2 border-neutral-300 rounded-lg',
          'bg-white text-left text-sm font-semibold',
          'hover:border-primary transition-colors',
          'flex items-center justify-between'
        )}
      >
        {selectedLabel}
        <span className={cn('transition-transform duration-300', isOpen ? 'rotate-180' : '')}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-neutral-300 rounded-lg shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'w-full text-left px-4 py-3 text-sm',
                'hover:bg-primary-50 transition-colors',
                'border-b border-neutral-100 last:border-b-0',
                selected === option.value && 'bg-primary-50 font-semibold text-primary'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
