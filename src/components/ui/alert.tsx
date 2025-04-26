import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'warning';
  onClose?: () => void;
  className?: string;
  duration?: number;
}

export function Alert({
  message,
  type = 'error',
  onClose,
  className,
  duration = 5000,
}: AlertProps) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const baseStyles = 'fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 text-sm font-medium shadow-lg';
  const typeStyles = {
    error: 'bg-red-50 text-red-900 border border-red-200',
    success: 'bg-green-50 text-green-900 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border border-yellow-200',
  };

  return (
    <div className={cn(baseStyles, typeStyles[type], className)} role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}