import React, { useState, useEffect } from "react";
import { SpinnerIcon } from "@/components/common/icons";
import { toast } from "@/libs/Toast";
import { useOutletContext } from "react-router-dom";
import { useFlashcards } from "@/hooks/useFlashcards";
import FlashcardHeader from "@/components/flashcard/FlashcardHeader";
import FlashcardEmptyState from "@/components/flashcard/FlashcardEmptyState";
import FlashcardCompletionState from "@/components/flashcard/FlashcardCompletionState";
import FlashcardItem from "@/components/flashcard/FlashcardItem";
import FlashcardRatingControls from "@/components/flashcard/FlashcardRatingControls";

interface FlashcardReviewProps {
  onBack: () => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ onBack }) => {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn: boolean }>();
  const [source, setSource] = useState<"all" | "saved">("all");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    reviewQueue,
    currentCard,
    loading,
    totalAvailableCards,
    handleRate,
    getNextIntervalLabel,
    loadData,
  } = useFlashcards(isLoggedIn, source);

  useEffect(() => {
    setIsTransitioning(true);
    setIsFlipped(false);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentCard]);

  const speak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    window.speechSynthesis.speak(u);
  };

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <SpinnerIcon className="w-10 h-10 text-red-600" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col h-full animate-pop p-3">
      <FlashcardHeader
        source={source}
        setSource={setSource}
        isLoggedIn={isLoggedIn}
        reviewQueueLength={reviewQueue.length}
        onSavedClickError={() =>
          toast.error("Vui lòng đăng nhập để sử dụng tính năng này.")
        }
      />

      {!currentCard ? (
        totalAvailableCards === 0 ? (
          <FlashcardEmptyState source={source} onBack={onBack} />
        ) : (
          <FlashcardCompletionState
            onReviewMore={() => loadData(true)}
            onBack={onBack}
          />
        )
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center pb-8">
          <FlashcardItem
            card={currentCard}
            isFlipped={isFlipped}
            isTransitioning={isTransitioning}
            onFlip={() => !isFlipped && setIsFlipped(true)}
            onSpeak={speak}
          />
          <FlashcardRatingControls
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(true)}
            onRate={async (e, rating) => {
              e.stopPropagation();
              await handleRate(rating);
            }}
            getNextIntervalLabel={getNextIntervalLabel}
          />
        </div>
      )}
    </div>
  );
};

export default FlashcardReview;
