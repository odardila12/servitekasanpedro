'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSearch } from '@/lib/hooks/useSearch';

interface SearchDropdownProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function SearchDropdown({
  className,
  inputClassName,
  placeholder = 'Buscar...',
}: SearchDropdownProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, loading } = useSearch(query);

  const topResults = results.slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function navigate(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    setQuery('');
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      navigate(query);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClassName}
      />
      <button
        type="button"
        onClick={() => navigate(query)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#f4c430] transition-colors duration-300"
        aria-label="Buscar"
      >
        <span className="text-sm">🔍</span>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-xl z-[200] overflow-hidden">
          {loading ? (
            <div className="px-4 py-3 text-sm text-neutral-500">Buscando...</div>
          ) : topResults.length > 0 ? (
            <ul>
              {topResults.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onMouseDown={() => navigate(product.name)}
                    className="w-full text-left px-4 py-3 text-sm text-neutral-800 hover:bg-amber-50 transition-colors duration-150 flex items-center gap-3 border-b border-neutral-100 last:border-b-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="rounded-md object-cover w-9 h-9 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-neutral-500 capitalize">{product.category}</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-[#1E7A2E] flex-shrink-0">
                      ${product.price.toLocaleString('es-CO')}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onMouseDown={() => navigate(query)}
                  className="w-full text-center px-4 py-2.5 text-xs text-[#1a3a52] font-semibold hover:bg-neutral-50 transition-colors duration-150"
                >
                  Ver todos los resultados para &ldquo;{query}&rdquo;
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-neutral-500">
              No hay resultados para &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
