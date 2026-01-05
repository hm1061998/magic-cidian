import React from "react";
import { BrainIcon } from "@/components/common/icons";

interface FlashcardCompletionStateProps {
  onReviewMore: () => void;
  onBack: () => void;
}

const FlashcardCompletionState: React.FC<FlashcardCompletionStateProps> = ({
  onReviewMore,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-slate-200 m-4 p-8 text-center">
      <BrainIcon className="w-20 h-20 mb-6 text-emerald-500 animate-bounce" />
      <h2 className="text-2xl font-hanzi font-bold text-slate-800 mb-2">
        Tuyệt vời!
      </h2>
      <p className="text-lg font-medium text-slate-600 mb-2">
        Bạn đã hoàn thành bài học hôm nay.
      </p>
      <p className="text-sm text-slate-400 mb-8">
        Hãy quay lại vào ngày mai để tối ưu khả năng ghi nhớ.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onReviewMore}
          className="w-full px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:border-red-300 hover:text-red-600 transition-all shadow-sm"
        >
          Ôn tập thêm 20 từ (Ngẫu nhiên)
        </button>
        <button
          onClick={onBack}
          className="w-full px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-black transition-all"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default FlashcardCompletionState;
