import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import Icon from './Icon';

export default function ToastStack() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: { id: number; message: string; type: 'success' | 'error' | 'info' }; onRemove: () => void }) {
  useEffect(() => {
    // Allows the element to animate out before the parent removes it
    return () => {};
  }, []);

  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span className="toast-icon">
        {toast.type === 'success' && <Icon name="check" size={14} />}
        {toast.type === 'error' && <Icon name="x" size={14} />}
        {toast.type === 'info' && <Icon name="spark" size={14} />}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onRemove} aria-label="Dismiss notification">
        <Icon name="x" size={13} />
      </button>
    </div>
  );
}
