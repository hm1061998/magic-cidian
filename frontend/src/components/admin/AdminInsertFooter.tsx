import React from "react";
import { PlusIcon, SpinnerIcon } from "@/components/common/icons";

interface AdminInsertFooterProps {
  loading: boolean;
  isEditing: boolean;
  onBack: () => void;
}

const AdminInsertFooter: React.FC<AdminInsertFooterProps> = ({
  loading,
  isEditing,
  onBack,
}) => {
  return (
    <div className="flex-none bg-white border-t border-slate-200 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 transition-all">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-wrap-reverse sm:flex-nowrap justify-end items-center gap-3 sm:gap-4">
        {isEditing && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 sm:flex-none px-8 py-3.5 font-black text-slate-400 hover:text-red-600 transition-all text-[10px] sm:text-xs uppercase tracking-[0.2em] outline-none"
          >
            Hủy bỏ
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-10 py-4 bg-red-700 text-white rounded-2xl font-black shadow-2xl shadow-red-200 hover:bg-red-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 text-xs sm:text-sm uppercase tracking-widest"
        >
          {loading ? (
            <SpinnerIcon className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>{isEditing ? "Cập nhật từ vựng" : "Lưu từ vựng mới"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminInsertFooter;
