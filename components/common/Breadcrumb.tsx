'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

export function Breadcrumb({
  items,
  separator = '/',
}: BreadcrumbProps) {
  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-neutral-400 mx-1">{separator}</span>
            )}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'hover:text-primary transition-colors',
                    'hover:underline'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-900 font-semibold">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
