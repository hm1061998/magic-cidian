import React from "react";
import { PuzzlePieceIcon } from "@/components/common/icons";

interface GameHeaderProps {
  onNewGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onNewGame }) => {
  return (
    <div className="flex justify-between items-center mb-6 md:mb-10">
      <h1 className="text-2xl md:text-3xl font-bold font-hanzi flex items-center gap-3 text-slate-800">
        <PuzzlePieceIcon className="w-8 h-8 text-red-600" />
        Tìm chữ Hán
      </h1>
      <button
        onClick={onNewGame}
        className="text-sm font-bold bg-slate-800 text-white px-4 py-2 rounded-xl active:scale-95 transition-transform hover:bg-black"
      >
        Ván mới
      </button>
    </div>
  );
};

export default GameHeader;
