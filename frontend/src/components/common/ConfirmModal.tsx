import React, { useState, useEffect } from "react";
import { modalService, ModalState } from "@/services/ui/modalService";
import { SpinnerIcon, ExclamationIcon, QuestionMarkIcon } from "./icons";

const ConfirmModal: React.FC = () => {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    options: { message: "" },
    isProcessing: false,
  });

  useEffect(() => {
    // Đăng ký nhận thông báo từ service
    const unsubscribe = modalService.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  if (!state.isOpen) return null;

  const {
    title = "Xác nhận",
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    type = "info",
  } = state.options;

  // Color & Icon schemes for Premium look
  const schemes = {
    danger: {
      accent: "from-red-500 to-rose-600",
      light: "bg-red-50",
      text: "text-red-600",
      glow: "shadow-red-500/20",
      icon: <ExclamationIcon className="w-8 h-8" />,
    },
    warning: {
      accent: "from-amber-400 to-orange-500",
      light: "bg-amber-50",
      text: "text-amber-600",
      glow: "shadow-amber-500/20",
      icon: <ExclamationIcon className="w-8 h-8" />,
    },
    info: {
      accent: "from-blue-500 to-indigo-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      glow: "shadow-blue-500/20",
      icon: <QuestionMarkIcon className="w-8 h-8" />,
    },
  };

  const s = schemes[type || "info"];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]"
        onClick={() => !state.isProcessing && modalService.handleCancel()}
      />

      {/* Hero Modal Card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] max-w-[420px] w-full border border-white/40 animate-[pop_0.4s_cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden">
        {/* Top Decorative Line */}
        <div className={`h-2.5 w-full bg-gradient-to-r ${s.accent}`} />

        <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
          {/* Animated Icon Area */}
          <div className="relative mb-8 group">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${s.accent} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
            ></div>
            <div
              className={`relative w-24 h-24 ${s.light} ${s.text} rounded-3xl flex items-center justify-center shadow-inner ring-4 ring-white`}
            >
              <div className="animate-[pulse_2s_infinite]">{s.icon}</div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-10 px-2 lg:px-4">
            {message}
          </p>

          <div className="flex w-full flex-col sm:flex-row gap-4">
            {cancelText && (
              <button
                onClick={() => modalService.handleCancel()}
                disabled={state.isProcessing}
                className="flex-1 order-2 sm:order-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => modalService.handleConfirm()}
              disabled={state.isProcessing}
              className={`flex-1 order-1 sm:order-2 py-4 bg-gradient-to-br ${s.accent} text-white font-black rounded-2xl shadow-xl ${s.glow} transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group border border-white/10`}
            >
              {state.isProcessing ? (
                <SpinnerIcon className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>{confirmText}</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
