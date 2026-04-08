'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CategoryFilters } from '@/components/filters/CategoryFilters';
import type { ActiveFilters } from '@/lib/filters/filterDefinitions';

interface FilterSidebarProps {
  categorySlug: string;
  activeFilters: ActiveFilters;
  onCheckboxChange: (filterId: string, value: string, checked: boolean) => void;
  onRangeChange: (filterId: string, range: [number, number]) => void;
  onClearAll: () => void;
  // Mobile drawer
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({
  categorySlug,
  activeFilters,
  onCheckboxChange,
  onRangeChange,
  onClearAll,
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const sidebarContent = (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-neutral-900">Filtros</h3>
        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className={cn(
              'xl:hidden -mr-1 p-1.5 rounded-lg',
              'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100',
              'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400'
            )}
            aria-label="Cerrar filtros"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <CategoryFilters
        categorySlug={categorySlug}
        activeFilters={activeFilters}
        onCheckboxChange={onCheckboxChange}
        onRangeChange={onRangeChange}
        onClearAll={onClearAll}
      />
    </div>
  );

  return (
    <>
      {/* ── Desktop: sticky sidebar (xl and above) ───────────────────────── */}
      <aside
        className={cn(
          'hidden xl:block',
          'w-56 shrink-0',
          'sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto',
          'bg-white border border-neutral-200 rounded-xl shadow-sm'
        )}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile/Tablet: slide-in drawer (below xl) ────────────────────── */}
      <>
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-black/40 z-40 xl:hidden',
            'transition-opacity duration-300',
            isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          onClick={onMobileClose}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
          className={cn(
            'fixed top-0 left-0 h-full w-72 bg-white z-50 xl:hidden',
            'shadow-2xl overflow-y-auto',
            'transition-transform duration-300 ease-in-out',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          aria-label="Filtros"
        >
          {sidebarContent}
        </aside>
      </>
    </>
  );
}
