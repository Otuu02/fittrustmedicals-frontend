// src/components/ui/Toast.tsx
import React, { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}

export function Toast({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-green-50 border-green-200',
      icon: <Check size={20} className="text-green-600" />,
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
    },
    error: {
      bgColor: 'bg-red-50 border-red-200',
      icon: <AlertCircle size={20} className="text-red-600" />,
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
    },
    info: {
      bgColor: 'bg-blue-50 border-blue-200',
      icon: <Info size={20} className="text-blue-600" />,
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
    },
    warning: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle size={20} className="text-yellow-600" />,
      titleColor: 'text-yellow-900',
      messageColor: 'text-yellow-700',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`${config.bgColor} border rounded-lg p-4 flex items-start gap-4 animate-slide-in`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>

      <div className="flex-1">
        <p className={`font-semibold ${config.titleColor}`}>{title}</p>
        {message && (
          <p className={`text-sm mt-1 ${config.messageColor}`}>{message}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}