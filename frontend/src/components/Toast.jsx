import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icons from './Icons';

export const Toast = ({ message, type = 'info', onClose }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icons.Check className="w-4 h-4" />;
      case 'error':
        return <Icons.Alert className="w-4 h-4" />;
      case 'warning':
        return <Icons.Alert className="w-4 h-4" />;
      default:
        return <Icons.Bell className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`${getToastStyles()} text-white px-4 py-3 rounded-lg border shadow-lg flex items-center space-x-3 min-w-64`}
    >
      {getIcon()}
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <Icons.Close className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  </div>
);