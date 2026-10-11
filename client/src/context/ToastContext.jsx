import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckIcon, CloseIcon } from "../components/Icons.jsx";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++nextId.current;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  // Stable object so consumers can safely list it as an effect/callback dependency.
  const api = useMemo(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">
              {t.type === "success" ? <CheckIcon width={16} height={16} /> : "!"}
            </span>
            <span className="toast-msg">{t.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <CloseIcon width={14} height={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
