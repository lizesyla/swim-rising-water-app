import { useEffect } from 'react';
import { IconCheck, IconAlert, IconClose } from './Icons';

const ICONS = {
  success: IconCheck,
  error: IconAlert,
  info: IconAlert,
};

export default function Toast({ id, message, type = 'info', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4200);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const Icon = ICONS[type] || ICONS.info;

  return (
    <div className={`toast toast--${type}`} role="status">
      <span className="toast-icon" aria-hidden="true">
        <Icon size={14} />
      </span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-dismiss"
        onClick={() => onDismiss(id)}
        aria-label="Mbyll njoftimin"
      >
        <IconClose size={12} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
