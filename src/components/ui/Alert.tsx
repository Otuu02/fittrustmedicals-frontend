'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: React.ReactNode; // 🔥 CHANGED: Allow ReactNode instead of just string
  title?: string;
  onClose?: () => void;
  closeable?: boolean;
}

export function Alert({
  type = 'info',
  message,
  title,
  onClose,
  closeable = true,
  className,
}: AlertProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle size={20} className="text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle size={20} className="text-red-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle size={20} className="text-yellow-600" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info size={20} className="text-blue-600" />,
    },
  };

  const styles = config[type];

  return (
    <div
      className={clsx(
        'border rounded-lg p-4 flex items-start gap-3',
        styles.bg,
        styles.border,
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>

      <div className="flex-grow">
        {title && (
          <h3 className={clsx('font-bold mb-1 text-sm', styles.text)}>{title}</h3>
        )}
        {/* 🔥 FIXED: Use div instead of p to avoid hydration error */}
        <div className={clsx('text-sm', styles.text)}>{message}</div>
      </div>

      {closeable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}