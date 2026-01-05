import React from "react";
import { ToastMessage } from "../types";

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  if (!toasts || toasts?.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-1000 flex flex-col gap-3 pointer-events-none">
      {toasts?.map((t) => (
        <div
          key={t.id}
          className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-lg animate-pop pointer-events-auto transition-all transform hover:scale-105 ${
            t.type === "success"
              ? "bg-emerald-500/95 border-emerald-400 text-white"
              : t.type === "error"
              ? "bg-red-600/95 border-red-500 text-white"
              : t.type === "warning"
              ? "bg-amber-500/95 border-amber-400 text-white"
              : "bg-slate-800/95 border-slate-700 text-white"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            {t.type === "success"
              ? "✓"
              : t.type === "error"
              ? "✕"
              : t.type === "warning"
              ? "⚠"
              : "ℹ"}
          </div>
          <p className="font-bold text-sm leading-tight">{t.message}</p>
          <button
            onClick={() => onRemove(t.id)}
            className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
