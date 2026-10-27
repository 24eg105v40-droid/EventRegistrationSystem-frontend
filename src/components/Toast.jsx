import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const { type, message } = notification;

  const icons = {
    success: <CheckCircle2 className="toast-icon success" size={20} />,
    error: <AlertCircle className="toast-icon error" size={20} />,
    info: <Info className="toast-icon info" size={20} />
  };

  return (
    <div className={`toast toast-${type || 'info'}`}>
      <div className="toast-content">
        {icons[type] || icons.info}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
