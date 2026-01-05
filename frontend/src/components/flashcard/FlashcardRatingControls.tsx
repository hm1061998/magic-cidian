import React from "react";

interface FlashcardRatingControlsProps {
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (e: React.MouseEvent, rating: 1 | 2 | 3) => void;
  getNextIntervalLabel: (rating: 1 | 2 | 3) => string;
}

const FlashcardRatingControls: React.FC<FlashcardRatingControlsProps> = ({
  isFlipped,
  onFlip,
  onRate,
  getNextIntervalLabel,
}) => {
  return (
    <div className="w-full max-w-md h-20">
      {isFlipped ? (
        <div className="grid grid-cols-3 gap-3 h-full animate-pop">
          <button
            onClick={(e) => onRate(e, 1)}
            className="flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl transition-all active:scale-95 border border-red-200"
          >
            <span className="font-bold text-sm">Học lại</span>
            <span className="text-[10px] opacity-70 font-medium">
              {getNextIntervalLabel(1)}
            </span>
          </button>
          <button
            onClick={(e) => onRate(e, 2)}
            className="flex flex-col items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-2xl transition-all active:scale-95 border border-sky-200"
          >
            <span className="font-bold text-sm">Dễ</span>
            <span className="text-[10px] opacity-70 font-medium">
              {getNextIntervalLabel(2)}
            </span>
          </button>
          <button
            onClick={(e) => onRate(e, 3)}
            className="flex flex-col items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-2xl transition-all active:scale-95 border border-emerald-200"
          >
            <span className="font-bold text-sm">Đơn giản</span>
            <span className="text-[10px] opacity-70 font-medium">
              {getNextIntervalLabel(3)}
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={onFlip}
          className="w-full h-full bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-all active:scale-[0.98]"
        >
          Xem đáp án
        </button>
      )}
    </div>
  );
};

export default FlashcardRatingControls;
