import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  HistoryIcon,
  BookmarkIconFilled,
  SpeakerWaveIcon,
  BrainIcon,
  PlusIcon,
} from "../components/icons";
import { fetchStoredIdioms } from "../services/idiomService";
import type { Idiom } from "../types";

interface FlashcardReviewProps {
  onBack: () => void;
}

// Cấu trúc dữ liệu cho tiến độ học tập (Lưu trong localStorage)
interface SRSProgress {
  interval: number; // Số ngày cho lần ôn tiếp theo
  repetition: number; // Số lần ôn tập thành công liên tiếp
  efactor: number; // Hệ số dễ (Ease Factor), mặc định 2.5
  nextReviewDate: number; // Timestamp của lần ôn tới
}

interface SRSDataMap {
  [hanzi: string]: SRSProgress;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ onBack }) => {
  const [reviewQueue, setReviewQueue] = useState<Idiom[]>([]);
  const [currentCard, setCurrentCard] = useState<Idiom | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"all" | "saved">("all");
  const [srsData, setSrsData] = useState<SRSDataMap>({});
  const [totalAvailableCards, setTotalAvailableCards] = useState(0);

  // Trạng thái để tắt animation khi chuyển thẻ (tránh lộ đáp án)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Tải dữ liệu khi thay đổi nguồn hoặc mount
  useEffect(() => {
    loadData();
  }, [source]);

  // Cập nhật thẻ hiện tại khi hàng đợi thay đổi
  useEffect(() => {
    // 1. Tắt animation và reset về mặt trước ngay lập tức
    setIsTransitioning(true);
    setIsFlipped(false);

    // 2. Cập nhật nội dung thẻ
    if (reviewQueue.length > 0) {
      setCurrentCard(reviewQueue[0]);
    } else {
      setCurrentCard(null);
    }

    // 3. Bật lại animation sau khi DOM đã cập nhật (tránh chớp nhoáng)
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [reviewQueue]);

  const loadData = async (forceReview = false) => {
    setLoading(true);

    // 1. Tải tiến độ học tập từ localStorage
    let progressMap: SRSDataMap = {};
    try {
      const storedProgress = localStorage.getItem("srs_progress");
      if (storedProgress) {
        progressMap = JSON.parse(storedProgress);
      }
    } catch (e) {
      console.error("Lỗi đọc SRS progress", e);
    }
    setSrsData(progressMap);

    // 2. Tải danh sách từ vựng gốc
    let allCards: Idiom[] = [];
    if (source === "saved") {
      const data = localStorage.getItem("saved_words");
      allCards = data ? JSON.parse(data) : [];
    } else {
      try {
        const response = await fetchStoredIdioms(1, 1000); // Lấy số lượng lớn để lọc
        allCards = response.data;
      } catch (err) {
        console.error(err);
      }
    }

    setTotalAvailableCards(allCards.length);

    // 3. Lọc thẻ
    let queue: Idiom[] = [];

    if (forceReview) {
      // Nếu chọn ôn tập cưỡng ép: Lấy ngẫu nhiên 20 thẻ bất kể tiến độ
      queue = allCards.sort(() => 0.5 - Math.random()).slice(0, 20);
    } else {
      // Mặc định: Lọc ra các thẻ cần học (Due cards) hoặc thẻ mới (New cards)
      const now = Date.now();
      const dueCards = allCards.filter((card) => {
        const progress = progressMap[card.hanzi];
        // Nếu chưa học bao giờ (New) -> Học
        if (!progress) return true;
        // Nếu đã đến hạn ôn tập (Due) -> Học
        return progress.nextReviewDate <= now;
      });

      // Sắp xếp: Thẻ cần ôn gấp lên trước
      dueCards.sort((a, b) => {
        const progA = progressMap[a.hanzi]?.nextReviewDate || 0;
        const progB = progressMap[b.hanzi]?.nextReviewDate || 0;
        return progA - progB;
      });

      // Giới hạn phiên học (ví dụ: 20 từ mỗi lần)
      queue = dueCards.slice(0, 20);
    }

    setReviewQueue(queue);
    setLoading(false);
  };

  const saveProgress = (hanzi: string, progress: SRSProgress) => {
    const newMap = { ...srsData, [hanzi]: progress };
    setSrsData(newMap);
    localStorage.setItem("srs_progress", JSON.stringify(newMap));
  };

  // Thuật toán SRS (SuperMemo-2 Simplied)
  // rating: 1 = Học lại (Again), 2 = Dễ (Good), 3 = Đơn giản (Easy)
  const handleRate = (e: React.MouseEvent, rating: 1 | 2 | 3) => {
    e.stopPropagation();
    if (!currentCard) return;

    const existing = srsData[currentCard.hanzi] || {
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      nextReviewDate: 0,
    };
    let { interval, repetition, efactor } = existing;
    let nextReviewDate = Date.now();

    if (rating === 1) {
      // Học lại: Reset interval, giữ nguyên hoặc giảm nhẹ EFactor
      repetition = 0;
      interval = 0;

      // Lưu trạng thái "quên" ngay lập tức
      saveProgress(currentCard.hanzi, {
        interval,
        repetition,
        efactor,
        nextReviewDate,
      });

      // Logic đặc biệt: Đẩy xuống cuối hàng đợi hiện tại để ôn lại ngay trong phiên này
      setReviewQueue((prev) => {
        const remaining = prev.slice(1);
        return [...remaining, currentCard];
      });
      return;
    }

    // Dễ hoặc Đơn giản: Tăng EFactor và Interval
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }

    // Điều chỉnh EFactor & Interval Bonus
    if (rating === 3) {
      efactor += 0.15; // Thưởng cho Easy
      interval = Math.round(interval * 1.3); // Bonus ngày
    }

    // Đảm bảo EFactor không quá thấp
    if (efactor < 1.3) efactor = 1.3;

    repetition += 1;

    // Tính thời gian review tiếp theo
    nextReviewDate += interval * 24 * 60 * 60 * 1000;

    saveProgress(currentCard.hanzi, {
      interval,
      repetition,
      efactor,
      nextReviewDate,
    });

    // Chuyển sang thẻ tiếp theo
    setReviewQueue((prev) => prev.slice(1));
  };

  const speak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    window.speechSynthesis.speak(u);
  };

  const getNextIntervalLabel = (rating: 1 | 2 | 3) => {
    if (!currentCard) return "";
    const existing = srsData[currentCard.hanzi] || {
      interval: 0,
      repetition: 0,
      efactor: 2.5,
    };

    if (rating === 1) return "< 1m";

    let interval = 1;
    let efactor = existing.efactor;

    if (existing.repetition === 0) interval = 1;
    else if (existing.repetition === 1) interval = 6;
    else interval = Math.round(existing.interval * efactor);

    if (rating === 3) interval = Math.round(interval * 1.5); // Ước lượng bonus cho Easy

    if (interval === 1) return "1 ngày";
    return `${interval} ngày`;
  };

  const handleForceReview = () => {
    loadData(true);
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent animate-spin rounded-full" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col h-full animate-pop">
      <div className="flex justify-between items-center mb-6">
        <div className="px-4 py-1.5" />

        {/* Toggle Source */}
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

        <div className="w-10 flex justify-end">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-white px-2 py-1 rounded-lg border">
            <BrainIcon className="w-3 h-3" />
            <span>{reviewQueue.length}</span>
          </div>
        </div>
      </div>

      {!currentCard ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-3xl border border-slate-200 m-4 p-8 text-center">
          {totalAvailableCards === 0 ? (
            // Trường hợp 1: Không có từ nào trong kho (Source trống)
            <>
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
            </>
          ) : (
            // Trường hợp 2: Có từ, nhưng đã học hết theo SRS (Finish)
            <>
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
                  onClick={handleForceReview}
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
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center pb-8">
          <div
            className="w-full aspect-[3/4] max-h-[500px] perspective-1000 cursor-pointer group mb-8 relative"
            onClick={() => !isFlipped && setIsFlipped(true)}
          >
            <div
              className={`relative w-full h-full transition-transform transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Mặt trước */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8">
                <span className="text-6xl md:text-8xl font-hanzi font-bold text-slate-800 mb-6 text-center">
                  {currentCard.hanzi}
                </span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                  Chạm để lật
                </p>
                <button
                  onClick={(e) => speak(e, currentCard.hanzi)}
                  className="mt-8 p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all z-10"
                >
                  <SpeakerWaveIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Mặt sau */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 bg-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white text-center overflow-y-auto`}
              >
                {!isTransitioning && (
                  <React.Fragment>
                    <p className="text-2xl md:text-3xl font-medium mb-2 text-red-400">
                      {currentCard.pinyin}
                    </p>
                    <div className="h-px w-20 bg-white/20 my-4" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
                      {currentCard.vietnameseMeaning}
                    </h2>
                    <p className="text-slate-300 text-sm italic leading-relaxed px-2 mb-4">
                      {currentCard.figurativeMeaning}
                    </p>
                    {currentCard.examples && currentCard.examples[0] && (
                      <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10 w-full text-left">
                        <p className="text-[10px] font-bold uppercase text-white/40 mb-1">
                          Ví dụ
                        </p>
                        <p className="font-hanzi text-sm md:text-base text-slate-200">
                          {currentCard.examples[0].chinese}
                        </p>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md h-20">
            {isFlipped ? (
              <div className="grid grid-cols-3 gap-3 h-full animate-pop">
                <button
                  onClick={(e) => handleRate(e, 1)}
                  className="flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl transition-all active:scale-95 border border-red-200"
                >
                  <span className="font-bold text-sm">Học lại</span>
                  <span className="text-[10px] opacity-70 font-medium">
                    {getNextIntervalLabel(1)}
                  </span>
                </button>

                <button
                  onClick={(e) => handleRate(e, 2)}
                  className="flex flex-col items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-2xl transition-all active:scale-95 border border-sky-200"
                >
                  <span className="font-bold text-sm">Dễ</span>
                  <span className="text-[10px] opacity-70 font-medium">
                    {getNextIntervalLabel(2)}
                  </span>
                </button>

                <button
                  onClick={(e) => handleRate(e, 3)}
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
                onClick={() => setIsFlipped(true)}
                className="w-full h-full bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-all active:scale-[0.98]"
              >
                Xem đáp án
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardReview;
