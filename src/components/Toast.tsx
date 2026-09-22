"use client";

import { useState, createContext, useContext, useCallback, ReactNode } from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-cpd-success shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-cpd-danger shrink-0" />,
    info: <Info className="w-4 h-4 text-cpd-accent shrink-0" />,
  };

  const borderMap = {
    success: "border-l-2 border-l-cpd-success",
    error: "border-l-2 border-l-cpd-danger",
    info: "border-l-2 border-l-cpd-accent",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 pl-3 pr-2 py-2.5 glass-strong rounded-xl shadow-2xl shadow-black/30 animate-slide-in-right min-w-[280px] max-w-[400px] ${borderMap[t.type]}`}
          >
            {iconMap[t.type]}
            <span className="text-[12px] text-cpd-text font-medium flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="p-1 rounded-md text-cpd-text-muted hover:text-cpd-text hover:bg-cpd-bg-primary transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
