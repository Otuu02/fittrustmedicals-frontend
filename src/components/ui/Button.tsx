'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      fullWidth = false,
      disabled = false,
      href,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isLoadingState = isLoading || loading;

    const baseStyles =
      'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';

    const variantStyles = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed',
      secondary:
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed',
      outline:
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const buttonClass = clsx(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      isLoadingState && 'opacity-75 cursor-not-allowed',
      className
    );

    const buttonContent = isLoadingState ? (
      <>
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        Loading...
      </>
    ) : (
      children
    );

    if (href) {
      return (
        <Link href={href}>
          <button
            className={buttonClass}
            disabled={disabled || isLoadingState}
            {...props}
          >
            {buttonContent}
          </button>
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClass}
        disabled={disabled || isLoadingState}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';