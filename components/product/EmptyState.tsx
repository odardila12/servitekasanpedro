'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function EmptyState({
  onClearFilters,
  hasActiveFilters = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-neutral-800 mb-2">
        {hasActiveFilters
          ? 'Sin resultados para estos filtros'
          : 'No hay productos disponibles'}
      </h3>

      <p className="text-sm text-neutral-500 max-w-xs mb-6">
        {hasActiveFilters
          ? 'Probá con otros filtros o amplí la búsqueda para ver más opciones.'
          : 'Volvé pronto, estamos actualizando el catálogo.'}
      </p>

      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className={cn(
            'px-5 py-2.5 rounded-full text-sm font-semibold',
            'border-2 border-[#fca50f] text-[#fca50f]',
            'hover:bg-[#fca50f] hover:text-white',
            'transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fca50f]'
          )}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
