import React from "react";
import { ExclamationIcon, SearchIcon } from "@/components/common/icons";

interface EmptyStateProps {
  isFilterActive: boolean;
  filterText: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
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
      <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExclamationIcon className="w-6 h-6" />
      </div>
      <p className="text-slate-500 font-medium">
        Bạn chưa gửi báo cáo lỗi nào.
      </p>
    </div>
  );
};

export default EmptyState;
