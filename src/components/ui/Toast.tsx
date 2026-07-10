type ToastProps = {
  message?: string;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) return null;

  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
