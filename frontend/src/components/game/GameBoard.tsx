import React from "react";

interface GameBoardProps {
  grid: string[][];
  GRID_SIZE: number;
  isCellSelected: (r: number, c: number) => boolean;
  onPointerDown: (e: React.PointerEvent, r: number, c: number) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  GRID_SIZE,
  isCellSelected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  containerRef,
}) => {
  return (
    <div className="flex-1 w-full flex justify-center md:justify-end">
      <div
        ref={containerRef}
        className="grid gap-1 md:gap-2 bg-slate-200 p-2 md:p-3 rounded-xl shadow-inner select-none touch-none w-full"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          aspectRatio: "1/1",
          maxWidth: "700px",
        }}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerMove={onPointerMove}
      >
        {grid.map((row, r) =>
          row.map((char, c) => (
            <div
              key={`${r}-${c}`}
              data-cell="true"
              data-row={r}
              data-col={c}
              className={`
                flex items-center justify-center 
                text-lg md:text-4xl font-hanzi font-bold 
                rounded-md md:rounded-lg transition-all cursor-pointer shadow-sm
                ${
                  isCellSelected(r, c)
                    ? "bg-red-500 text-white scale-105 shadow-md z-10"
                    : "bg-white text-slate-700 hover:bg-red-50"
                }
              `}
              onPointerDown={(e) => onPointerDown(e, r, c)}
            >
              {char}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
