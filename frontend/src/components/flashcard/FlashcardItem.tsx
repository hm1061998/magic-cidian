import React from "react";
import { SpeakerWaveIcon, SpinnerIcon } from "@/components/common/icons";
import type { Idiom } from "@/types";

interface FlashcardItemProps {
  card: Idiom;
  isFlipped: boolean;
  isTransitioning: boolean;
  onFlip: () => void;
  onSpeak: (e: React.MouseEvent, text: string) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  card,
  isFlipped,
  isTransitioning,
  onFlip,
  onSpeak,
}) => {
  return (
    <div
      className="w-full aspect-[3/4] max-h-[500px] perspective-1000 cursor-pointer group mb-8 relative"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8">
          <span className="text-6xl md:text-8xl font-hanzi font-bold text-slate-800 mb-6 text-center">
            {card.hanzi}
          </span>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
            Chạm để lật
          </p>
          <button
            onClick={(e) => onSpeak(e, card.hanzi)}
            className="mt-8 p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all z-10"
          >
            <SpeakerWaveIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white text-center overflow-y-auto">
          {isTransitioning ? (
            <SpinnerIcon className="w-10 h-10 text-red-600" />
          ) : (
            <>
              <p className="text-2xl md:text-3xl font-medium mb-2 text-red-400">
                {card.pinyin}
              </p>
              <div className="h-px w-20 bg-white/20 my-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
                {card.vietnameseMeaning}
              </h2>
              <p className="text-slate-300 text-sm italic leading-relaxed px-2 mb-4">
                {card.figurativeMeaning}
              </p>
              {card.examples && card.examples[0] && (
                <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10 w-full text-left">
                  <p className="text-[10px] font-bold uppercase text-white/40 mb-1">
                    Ví dụ
                  </p>
                  <p className="font-hanzi text-sm md:text-base text-slate-200">
                    {card.examples[0].chinese}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;
