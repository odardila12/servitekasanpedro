'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
}

export function SearchBar({
  placeholder = 'Buscar llantas, baterías...',
  onSearch,
  onSuggestionSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    'Llantas Michelin',
    'Batería 60Ah',
    'Aceite 10W40',
    'Filtro aire',
    'Bujías',
  ];

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={cn(
            'w-full bg-white border-2 border-neutral-300 rounded-full',
            'px-4 py-2 text-sm focus:outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary-100',
            'transition-colors duration-300'
          )}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-700 transition-colors"
        >
          🔍
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredSuggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(suggestion);
                onSuggestionSelect?.(suggestion);
                setShowSuggestions(false);
              }}
              className={cn(
                'w-full text-left px-4 py-3 text-sm',
                'hover:bg-primary-50 transition-colors',
                'border-b border-neutral-100 last:border-b-0'
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
