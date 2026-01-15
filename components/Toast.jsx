'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (message) => addToast({ message, type: 'success' }),
    error: (message) => addToast({ message, type: 'error' }),
    warning: (message) => addToast({ message, type: 'warning' }),
    info: (message) => addToast({ message, type: 'info' }),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-pb-green/20 border-pb-green/50 text-pb-green';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default:
        return 'bg-pb-bg-elevated border-pb-border text-pb-text';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-fade-in ${getTypeStyles(toast.type)}`}
        >
          <span className="text-lg">{getIcon(toast.type)}</span>
          <span className="flex-1 text-sm">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// Standalone toast function for use outside React
let toastFn = null;

export function setToastFunction(fn) {
  toastFn = fn;
}

export function showToast(message, type = 'info') {
  if (toastFn) {
    toastFn[type](message);
  } else {
    console.log(`[Toast ${type}]: ${message}`);
  }
}
