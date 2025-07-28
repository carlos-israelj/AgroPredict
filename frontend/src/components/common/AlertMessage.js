import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const AlertMessage = ({ type = 'info', message, onClose, autoClose = true }) => {
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          className: 'bg-green-50 text-green-700 border-green-200',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          icon: AlertCircle,
          className: 'bg-red-50 text-red-700 border-red-200',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          iconColor: 'text-yellow-600'
        };
      default:
        return {
          icon: Info,
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          iconColor: 'text-blue-600'
        };
    }
  };

  const { icon: Icon, className, iconColor } = getAlertConfig();

  // Auto-close después de 5 segundos para mensajes de éxito
  React.useEffect(() => {
    if (autoClose && type === 'success' && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, type, onClose]);

  if (!message) return null;

  return (
    <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 border ${className}`}>
      <Icon size={16} className={iconColor} />
      <span className="flex-1 text-sm">{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 ml-2 text-lg font-bold leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default AlertMessage;