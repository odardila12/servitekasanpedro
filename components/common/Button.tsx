'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-secondary text-primary hover:bg-opacity-90',
    secondary: 'bg-primary text-white hover:bg-opacity-90',
    outline: 'border-2 border-primary text-primary hover:bg-primary-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={cn(
        'font-bold rounded-2xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        loading && 'opacity-75',
        className
      )}
      style={{ letterSpacing: '0.02em' }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block animate-spin">⏳</span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
