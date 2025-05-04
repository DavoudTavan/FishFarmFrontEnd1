import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="ml-2" />;
      case 'danger':
        return <AlertCircle size={18} className="ml-2" />;
      case 'info':
      case 'warning':
        return <Info size={18} className="ml-2" />;
      default:
        return null;
    }
  };

  return (
    <div className={`alert alert-${type} flex items-start`}>
      <div className="flex items-center flex-1">
        {getIcon()}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer p-1 hover:opacity-75"
          aria-label="بستن"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;