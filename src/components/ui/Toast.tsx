import { useEffect, useMemo } from "react";

type ToastProps = {
  message?: string;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: ToastProps) {
  const reward = useMemo(() => parseReward(message), [message]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast${reward ? " toast-reward" : ""}`} role="status" aria-live="polite">
      {reward ? (
        <>
          <span className="toast-reward-badge">+{reward.amount}</span>
          <span className="toast-copy">
            <strong>Koko score increased</strong>
            <span>{reward.metric}</span>
            <small>{message.replace(`Pet ${reward.metric} +${reward.amount}`, "").trim()}</small>
          </span>
        </>
      ) : (
        <span>{message}</span>
      )}
      <button onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}

function parseReward(message?: string): { metric: string; amount: number } | undefined {
  if (!message) return undefined;
  const match = message.match(/Pet (health|mood|energy|trust) \+(\d+)/i);
  if (!match) return undefined;
  return { metric: match[1], amount: Number(match[2]) };
}
