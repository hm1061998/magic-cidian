import React from "react";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  SpinnerIcon,
  XCircleIcon,
} from "@/components/common/icons";
import { DictionaryReport } from "@/services/api/reportService";

interface HistoryItemProps {
  item: DictionaryReport;
  index: number;
  isSelected: boolean;
  onSelect: (report: DictionaryReport) => void;
  onToggleSelect: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  index,
  isSelected,
  onSelect,
  onToggleSelect,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
            <CheckCircleIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Đã xử lý
            </span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
            <XCircleIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Từ chối
            </span>
          </div>
        );
      case "processing":
        return (
          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
            <SpinnerIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Đang xem
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
            <ClockIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Đang chờ
            </span>
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`p-4 border-b border-slate-100 last:border-0 cursor-pointer transition-all flex items-center justify-between group ${
        isSelected ? "bg-indigo-50/50" : "hover:bg-slate-50/80"
      }`}
    >
      <div className="w-full flex items-center gap-4">
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
        <div className="w-full group">
          <div className="w-full flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-full">
                  {item.type === "content_error"
                    ? "Nội dung"
                    : item.type === "audio_error"
                    ? "Âm thanh"
                    : "Khác"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <h4 className="font-hanzi font-black text-slate-800 flex items-center gap-2 group-hover:text-red-600 transition-colors">
                {item.idiom?.hanzi}
                <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
            </div>
            {getStatusBadge(item.status)}
          </div>

          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 mb-3">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{item.description}"
            </p>
          </div>

          {item.adminNote && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" /> Phản hồi từ Admin:
              </p>
              <p className="text-xs font-bold text-emerald-700">
                {item.adminNote}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default HistoryItem;
