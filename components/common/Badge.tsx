'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'sale' | 'new' | 'hot' | 'default';
  value: string;
  position?: 'top-right' | 'bottom-left';
}

export function Badge({
  variant = 'default',
  value,
  position = 'top-right',
}: BadgeProps) {
  const variantClasses = {
    sale: 'bg-alert text-white font-bold text-xs',
    new: 'bg-primary text-white font-bold text-xs',
    hot: 'bg-orange-500 text-white font-bold text-xs',
    default: 'bg-primary text-white font-semibold text-xs',
  };

  const positionClasses = {
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
  };

  return (
    <div className={cn(
      'absolute inline-block px-3 py-1 rounded-full',
      variantClasses[variant],
      positionClasses[position],
      'z-10'
    )}>
      {value}
    </div>
  );
}
