import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText as FileTextIcon,
  Search as SearchIcon,
  RefreshCcw as RefreshIcon,
  X as CloseIcon,
  Clock as ClockIcon,
  ChevronRight as ChevronRightIcon,
  FileText as DocumentIcon,
} from "lucide-react";
import { examPaperService, ExamPaper } from "@/services/api";
import { toast } from "@/libs/Toast";
import Pagination from "@/components/common/Pagination";

const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response: any = await examPaperService.getUserExams({
        page,
        limit: 9,
        search: searchTerm.trim() || undefined,
      });
      if (response && response.data) {
        setExams(response.data);
        setLastPage(response.meta?.lastPage || 1);
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đề thi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchExams();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-inter p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <DocumentIcon className="w-10 h-10 text-indigo-600" />
              Thư viện Đề Thi
            </h1>
            <p className="text-slate-500 mt-2 font-medium italic">
              Chọn đề thi và thử sức ngay hôm nay
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700 placeholder:text-slate-400"
            />
            {!!searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-lg text-slate-400"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={fetchExams}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshIcon
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[32px] p-6 h-64 animate-pulse border border-slate-100"
              />
            ))
          ) : exams.length > 0 ? (
            exams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => navigate(`/exams/${exam.id}`)}
                className="group bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                  <FileTextIcon className="w-32 h-32" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {exam.description || "Chưa có mô tả cho đề thi này."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <ClockIcon className="w-4 h-4" />
                      <span>45 Phút</span> {/* Placeholder duration */}
                    </div>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <FileTextIcon className="w-16 h-16 mb-4 opacity-20" />
              <p>Không tìm thấy đề thi nào phù hợp.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={page}
              totalPages={lastPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList;
