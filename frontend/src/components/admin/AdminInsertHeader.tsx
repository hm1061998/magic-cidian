import React from "react";
import { ArrowLeftIcon } from "@/components/common/icons";

interface AdminInsertHeaderProps {
  onBack: () => void;
  isEditing: boolean;
}

const AdminInsertHeader: React.FC<AdminInsertHeaderProps> = ({
  onBack,
  isEditing,
}) => {
  return (
    <div className="flex-none bg-white border-b border-slate-200 shadow-sm z-10 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              title="Quay lại"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            {isEditing ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AdminInsertHeader;
