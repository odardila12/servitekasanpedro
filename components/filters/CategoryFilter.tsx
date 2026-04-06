'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  onCategoryChange?: (categories: string[]) => void;
  selectedCategories?: string[];
}

export function CategoryFilter({
  onCategoryChange,
  selectedCategories = [],
}: CategoryFilterProps) {
  const handleToggle = (slug: string) => {
    const updated = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    onCategoryChange?.(updated);
  };

  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">Categorías</h4>
      <div className="space-y-2">
        {CATEGORIES.map((category) => (
          <label
            key={category.slug}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.slug)}
              onChange={() => handleToggle(category.slug)}
              className={cn(
                'w-4 h-4 rounded border-2 border-neutral-300',
                'cursor-pointer accent-primary'
              )}
            />
            <span className="text-sm text-neutral-700">
              {category.name}
              <span className="text-neutral-500 ml-1">({category.count})</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
