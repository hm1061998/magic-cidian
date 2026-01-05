import React, { useEffect, useRef } from "react";
import { SpinnerIcon } from "@/components/common/icons";
import { useWordSearchGame } from "@/hooks/useWordSearchGame";
import GameHeader from "@/components/game/GameHeader";
import GameBoard from "@/components/game/GameBoard";
import GameWordList from "@/components/game/GameWordList";

interface WordSearchGameProps {
  onBack: () => void;
}

const WordSearchGame: React.FC<WordSearchGameProps> = () => {
  const {
    grid,
    words,
    foundWords,
    loading,
    startNewGame,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isCellSelected,
    GRID_SIZE,
  } = useWordSearchGame();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (
        containerRef.current &&
        containerRef.current.contains(e.target as Node)
      ) {
        // Prevent default touch actions while playing
      }
    };
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => document.removeEventListener("touchmove", preventDefault);
  }, []);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col animate-pop select-none p-4 md:p-8">
      <GameHeader onNewGame={startNewGame} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <SpinnerIcon className="w-10 h-10 text-red-600" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-16 w-full">
          <GameBoard
            grid={grid}
            GRID_SIZE={GRID_SIZE}
            isCellSelected={isCellSelected}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            containerRef={containerRef}
          />
          <GameWordList
            words={words}
            foundWords={foundWords}
            onNewGame={startNewGame}
          />
        </div>
      )}
    </div>
  );
};

export default WordSearchGame;
