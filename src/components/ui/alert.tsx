import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export interface AlertProps {
  message: string;
  description?: string;
  type?: 'error' | 'success' | 'warning' | 'info' | 'loading';
  onClose?: () => void;
  className?: string;
  duration?: number;
  showIcon?: boolean;
  showCloseButton?: boolean;
}

const AlertIcons = {
  error: <AlertCircle className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <AlertCircle className="h-5 w-5" />,
  loading: <Loader2 className="h-5 w-5 animate-spin" />,
};

const AlertTitles = {
  error: 'Error',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
  loading: 'Loading...',
};

export function Alert({
  message,
  description,
  type = 'info',
  onClose,
  className,
  duration = 5000,
  showIcon = true,
  showCloseButton = true,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    if (onClose) {
      setIsExiting(true);
      // Wait for animation to complete before calling onClose
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }
  };

  const baseStyles = 'fixed right-4 z-50 flex w-full max-w-md overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out';
  const typeStyles = {
    error: 'bg-red-50 text-red-900 border-l-4 border-red-500',
    success: 'bg-green-50 text-green-900 border-l-4 border-green-500',
    warning: 'bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500',
    info: 'bg-blue-50 text-blue-900 border-l-4 border-blue-500',
    loading: 'bg-gray-50 text-gray-900 border-l-4 border-gray-500',
  };

  const iconColors = {
    error: 'text-red-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    loading: 'text-gray-500',
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        baseStyles,
        typeStyles[type],
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
        className
      )}
      role="alert"
      style={{
        top: '1.5rem',
        right: '1rem',
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
      }}
    >
      <div className="flex w-full flex-col p-4">
        <div className="flex items-start">
          {showIcon && (
            <div className={cn("flex-shrink-0 mr-3 mt-0.5", iconColors[type])}>
              {AlertIcons[type]}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold">
              {AlertTitles[type]}
            </h3>
            <div className="text-sm text-gray-700 mt-1">
              {message}
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
          {showCloseButton && onClose && (
            <button
              onClick={handleClose}
              className="ml-4 -mr-1.5 -mt-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full p-1 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Toast component for global notifications
export function Toast({ message, type = 'info', duration = 3000, onClose }: Omit<AlertProps, 'className'>) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'fixed bottom-4 right-4 z-50 rounded-md p-4 shadow-lg transition-all duration-300',
        {
          'bg-green-100 text-green-900': type === 'success',
          'bg-red-100 text-red-900': type === 'error',
          'bg-yellow-100 text-yellow-900': type === 'warning',
          'bg-blue-100 text-blue-900': type === 'info',
        },
        isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
      )}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {type === 'success' && <CheckCircle2 className="h-5 w-5" />}
          {type === 'error' && <AlertCircle className="h-5 w-5" />}
          {type === 'warning' && <AlertTriangle className="h-5 w-5" />}
          {type === 'info' && <AlertCircle className="h-5 w-5" />}
          {type === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 -mr-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}