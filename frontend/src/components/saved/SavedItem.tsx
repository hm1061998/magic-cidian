import React from "react";
import { TrashIcon } from "@/components/common/icons";
import type { Idiom } from "@/types";

interface SavedItemProps {
  item: Idiom;
  isSelected: boolean;
  onItemClick: (hanzi: string) => void;
  onRemove: (e: React.MouseEvent, id: string, hanzi: string) => void;
  onToggleSelect: (id: string) => void;
}

const SavedItem: React.FC<SavedItemProps> = ({
  item,
  isSelected,
  onItemClick,
  onRemove,
  onToggleSelect,
}) => {
  return (
    <div
      onClick={() => onItemClick(item.hanzi)}
      className={`bg-white p-5 rounded-2xl shadow-sm border cursor-pointer transition-all group relative overflow-hidden ${
        isSelected
          ? "border-indigo-400 bg-indigo-50/30 ring-2 ring-indigo-50 shadow-md"
          : "border-slate-200 hover:shadow-md hover:border-red-200"
      }`}
    >
      {/* Checkbox */}
      <div className="absolute top-4 left-4 z-10">
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
      </div>

      <div className="flex justify-between items-start mb-2 pl-6">
        <h2 className="text-2xl font-hanzi font-bold text-slate-800 group-hover:text-red-700 transition-colors">
          {item.hanzi}
        </h2>
        <button
          onClick={(e) => item.id && onRemove(e, item.id, item.hanzi)}
          className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          title="Bỏ lưu"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <p className="text-red-600 font-bold text-xs uppercase tracking-tight mb-2">
        {item.pinyin}
      </p>
      <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
        {item.vietnameseMeaning}
      </p>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end">
        <span className="text-[10px] text-red-600 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Xem chi tiết →
        </span>
      </div>
    </div>
  );
};

export default SavedItem;
