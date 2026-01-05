import React from "react";
import { BookmarkIconFilled, PlusIcon } from "@/components/common/icons";

interface FlashcardEmptyStateProps {
  source: "all" | "saved";
  onBack: () => void;
}

const FlashcardEmptyState: React.FC<FlashcardEmptyStateProps> = ({
  source,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-slate-200 m-4 p-8 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <BookmarkIconFilled className="w-8 h-8 text-slate-300" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Chưa có từ vựng nào
      </h2>
      <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
        {source === "saved"
          ? "Bạn chưa lưu từ vựng nào. Hãy tra cứu và thả tim để lưu từ."
          : "Kho từ vựng hệ thống đang trống."}
      </p>
      <button
        onClick={onBack}
        className="px-6 py-3 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 transition-all flex items-center gap-2"
      >
        <PlusIcon className="w-5 h-5" /> Thêm từ mới ngay
      </button>
    </div>
  );
};

export default FlashcardEmptyState;
