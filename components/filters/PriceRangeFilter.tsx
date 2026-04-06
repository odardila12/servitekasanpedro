'use client';

import React, { useState } from 'react';

interface PriceRangeFilterProps {
  onPriceChange?: (min: number, max: number) => void;
  minPrice?: number;
  maxPrice?: number;
}

export function PriceRangeFilter({
  onPriceChange,
  minPrice = 0,
  maxPrice = 1000000,
}: PriceRangeFilterProps) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const handleApply = () => {
    onPriceChange?.(min, max);
  };

  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">Rango de Precio</h4>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full px-3 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:border-primary"
          />
          <span className="flex items-center">-</span>
          <input
            type="number"
            placeholder="Máx"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full px-3 py-2 border-2 border-neutral-300 rounded text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={handleApply}
          className="w-full py-2 bg-primary text-white rounded font-semibold hover:bg-primary-700 transition-colors"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
