import React from "react";
import { ChevronRightIcon } from "@/components/common/icons";
import type { Idiom } from "@/types";

interface HistoryItemProps {
  item: Idiom;
  index: number;
  isSelected: boolean;
  onSelect: (idiom: Idiom) => void;
  onToggleSelect: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  index,
  isSelected,
  onSelect,
  onToggleSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`p-4 border-b border-slate-100 last:border-0 cursor-pointer transition-all flex items-center justify-between group ${
        isSelected ? "bg-indigo-50/50" : "hover:bg-slate-50/80"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Individual Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect(item.id!);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        />

        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
          {index}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-hanzi font-bold text-slate-800 group-hover:text-red-700 transition-colors">
              {item.hanzi}
            </span>
            <span className="text-xs text-red-600 font-bold uppercase tracking-tight">
              {item.pinyin}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 font-medium italic">
            {item.vietnameseMeaning}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default HistoryItem;
