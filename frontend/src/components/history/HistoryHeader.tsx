import React from "react";
import { HistoryIcon, SearchIcon } from "@/components/common/icons";

interface HistoryHeaderProps {
  filter: string;
  setFilter: (val: string) => void;
  onClearAll: () => void;
  showClearAll: boolean;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  filter,
  setFilter,
  onClearAll,
  showClearAll,
}) => {
  return (
    <div className="flex-none bg-white border-b border-slate-200 shadow-sm z-10 px-4 py-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-hanzi font-bold text-slate-800 flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-slate-600" />
            Lịch sử tra cứu
          </h1>
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Tìm trong lịch sử..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-slate-50 transition-all text-sm"
            />
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {showClearAll && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-full hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap uppercase tracking-wider"
            >
              Xóa sạch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryHeader;
