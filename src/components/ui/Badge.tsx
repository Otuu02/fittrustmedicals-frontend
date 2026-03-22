// src/components/ui/Badge.tsx
import clsx from 'clsx';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;  // NEW: Added className prop for flexibility
}

export function Badge({ label, variant = 'primary', className }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <span 
      className={clsx(
        'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
        variantClasses[variant],
        className  // NEW: Merge the passed className
      )}
    >
      {label}
    </span>
  );
}