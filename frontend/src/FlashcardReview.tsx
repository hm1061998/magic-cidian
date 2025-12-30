import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  HistoryIcon,
  BookmarkIconFilled,
  SpeakerWaveIcon,
} from "../components/icons";
import { fetchStoredIdioms } from "../services/idiomService";
import type { Idiom } from "../types";

interface FlashcardReviewProps {
  onBack: () => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Idiom[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"all" | "saved">("all");

  useEffect(() => {
    loadData();
  }, [source]);

  const loadData = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);

    if (source === "saved") {
      const data = localStorage.getItem("saved_words");
      setCards(data ? JSON.parse(data) : []);
      setLoading(false);
    } else {
      try {
        const response = await fetchStoredIdioms(1, 100);
        setCards(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const speak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    window.speechSynthesis.speak(u);
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent animate-spin rounded-full" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col h-full animate-pop">
      <div className="flex justify-between items-center mb-8">
        <div className="flex bg-white p-1 rounded-full border shadow-sm">
          <button
            onClick={() => setSource("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              source === "all"
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-500"
            }`}
          >
            <HistoryIcon className="w-3.5 h-3.5" /> Tất cả
          </button>
          <button
            onClick={() => setSource("saved")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              source === "saved"
                ? "bg-red-600 text-white shadow-md"
                : "text-slate-500"
            }`}
          >
            <BookmarkIconFilled className="w-3.5 h-3.5" /> Đã lưu
          </button>
        </div>
        <div className="w-10" />
      </div>

      {cards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <p className="text-lg font-medium">
            Không có thẻ từ nào để hiển thị.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
            Thẻ {currentIndex + 1} / {cards.length}
          </p>

          <div
            className="w-full aspect-[3/4] max-h-[500px] perspective-1000 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Mặt trước */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8">
                <span className="text-8xl md:text-9xl font-hanzi font-bold text-slate-800 mb-6">
                  {cards[currentIndex].hanzi}
                </span>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                  Nhấn để lật thẻ
                </p>
                <button
                  onClick={(e) => speak(e, cards[currentIndex].hanzi)}
                  className="mt-8 p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <SpeakerWaveIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Mặt sau */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-red-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white text-center">
                <p className="text-2xl md:text-3xl font-medium mb-2">
                  {cards[currentIndex].pinyin}
                </p>
                <div className="h-px w-20 bg-white/30 my-6" />
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  {cards[currentIndex].vietnameseMeaning}
                </h2>
                <p className="text-red-100/80 text-sm md:text-lg italic leading-relaxed px-4">
                  {cards[currentIndex].figurativeMeaning}
                </p>
                {cards[currentIndex].examples &&
                  cards[currentIndex].examples[0] && (
                    <div className="mt-8 p-4 bg-black/10 rounded-2xl border border-white/10 w-full text-left">
                      <p className="text-xs font-bold uppercase text-white/50 mb-1">
                        Ví dụ
                      </p>
                      <p className="font-hanzi text-sm md:text-base">
                        {cards[currentIndex].examples[0].chinese}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={handlePrev}
              className="w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
            </button>
            <button
              onClick={handleShuffle}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:bg-black transition-all active:scale-95"
            >
              Xáo trộn
            </button>
            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all rotate-180 active:scale-95 shadow-sm"
            >
              <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardReview;
