import React from "react";
import { BookmarkIconFilled, SearchIcon } from "@/components/common/icons";

interface SavedHeaderProps {
  totalItems: number;
  filter: string;
  setFilter: (val: string) => void;
}

const SavedHeader: React.FC<SavedHeaderProps> = ({
  totalItems,
  filter,
  setFilter,
}) => {
  return (
    <div className="flex-none bg-white border-b border-slate-200 shadow-sm z-10 px-4 py-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-hanzi font-bold text-slate-800 flex items-center gap-2">
            <BookmarkIconFilled className="w-6 h-6 text-red-600" />
            Từ vựng đã lưu
            <span className="ml-2 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] rounded-full border border-red-100 uppercase tracking-widest font-black">
              {totalItems} mục
            </span>
          </h1>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm trong danh sách đã lưu..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-slate-50 transition-all text-sm"
          />
          <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default SavedHeader;
