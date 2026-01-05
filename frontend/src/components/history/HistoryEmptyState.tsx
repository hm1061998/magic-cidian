import React from "react";
import { HistoryIcon, SearchIcon } from "@/components/common/icons";

interface HistoryEmptyStateProps {
  isFilterActive: boolean;
  filterText: string;
}

const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({
  isFilterActive,
  filterText,
}) => {
  if (isFilterActive) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center">
        <SearchIcon className="w-10 h-10 mb-2 opacity-10" />
        <p className="text-sm italic">
          Không tìm thấy kết quả nào khớp với "{filterText}"
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white/40 rounded-3xl border border-slate-100 border-dashed">
      <HistoryIcon className="w-16 h-16 mb-4 opacity-10" />
      <p className="text-lg font-bold text-slate-300">Lịch sử trống</p>
      <p className="text-xs">Các từ bạn tra cứu sẽ xuất hiện tại đây.</p>
    </div>
  );
};

export default HistoryEmptyState;
