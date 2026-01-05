import React, { RefObject } from "react";
import { Idiom } from "@/types";
import { ChevronRightIcon } from "@/components/common/icons";

interface SearchSuggestionsProps {
  suggestions: Idiom[];
  selectedIndex: number;
  onSelect: (item: Idiom) => void;
  listRef: RefObject<HTMLDivElement | null>;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  listRef,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-white overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <div
        ref={listRef}
        className="p-3 space-y-1.5 max-h-[40vh] overflow-y-auto scrollbar-hide"
      >
        {suggestions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all duration-200 group/item ${
              selectedIndex === index
                ? "bg-red-50 scale-[1.02] shadow-sm"
                : "hover:bg-slate-50/80"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-hanzi font-bold text-xl transition-all duration-300 ${
                  selectedIndex === index
                    ? "bg-red-600 text-white rotate-6 shadow-lg shadow-red-200"
                    : "bg-slate-100 text-slate-400 group-hover/item:bg-white group-hover/item:text-slate-600"
                }`}
              >
                {item.hanzi.charAt(0)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-hanzi font-black text-slate-800 text-lg">
                    {item.hanzi}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      selectedIndex === index
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.pinyin}
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-medium line-clamp-1 group-hover/item:text-slate-500 transition-colors">
                  {item.vietnameseMeaning}
                </p>
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedIndex === index
                  ? "bg-white text-red-600 shadow-sm translate-x-1"
                  : "text-slate-200 group-hover/item:text-slate-400"
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
      <div className="bg-slate-50/50 backdrop-blur-md px-6 py-3 flex items-center justify-between border-t border-slate-100/50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Gợi ý thông minh
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 bg-white rounded-md border border-slate-200 shadow-sm">
              ↑↓
            </span>
            <span>Di chuyển</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center px-1.5 h-5 bg-white rounded-md border border-slate-200 shadow-sm capitalize">
              Enter
            </span>
            <span>Chọn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
