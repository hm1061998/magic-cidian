import React, { useState } from "react";
import {
  CloseIcon,
  ExclamationIcon,
  SpinnerIcon,
  CheckCircleIcon,
} from "@/components/common/icons";
import { createReport } from "@/services/api/reportService";
import { toast } from "@/libs/Toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  idiomId: string;
  idiomHanzi: string;
}

const REPORT_TYPES = [
  { value: "content_error", label: "Sai nội dung (nghĩa, pinyin...)" },
  { value: "audio_error", label: "Lỗi âm thanh/phát âm" },
  { value: "missing_info", label: "Thiếu thông tin quan trọng" },
  { value: "other", label: "Lỗi khác" },
];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  idiomId,
  idiomHanzi,
}) => {
  const [type, setType] = useState("content_error");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả lỗi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        idiomId,
        type,
        description,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setDescription("");
      }, 2000);
    } catch (error) {
      toast.error("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <ExclamationIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                Báo lỗi từ điển
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Từ: {idiomHanzi}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-800">Cảm ơn bạn!</h4>
              <p className="text-slate-500 text-center font-medium">
                Báo cáo của bạn đã được gửi đi. Ban quản trị sẽ sớm xem xét và
                điều chỉnh.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Loại lỗi
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {REPORT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={`flex items-center px-4 py-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                        type === t.value
                          ? "border-red-600 bg-red-50 text-red-700 shadow-md"
                          : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          type === t.value
                            ? "border-red-600"
                            : "border-slate-300"
                        }`}
                      >
                        {type === t.value && (
                          <div className="w-2 h-2 bg-red-600 rounded-full" />
                        )}
                      </div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vui lòng mô tả rõ lỗi bạn gặp phải..."
                  className="w-full h-32 p-4 rounded-2xl border-2 border-slate-100 focus:border-red-600 focus:outline-none transition-all resize-none font-medium text-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-slate-900/20"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="w-5 h-5" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi báo cáo"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
