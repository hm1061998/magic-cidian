import { useState, useEffect, useCallback, useMemo } from "react";
import { modalService } from "@/libs/Modal";
import { toast } from "@/libs/Toast";
import {
  getMyReports,
  DictionaryReport,
  bulkDeleteReport,
} from "@/services/api/reportService";

export const useMyReports = (initialPage = 1) => {
  const [historyItems, setHistoryItems] = useState<DictionaryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounced search to avoid excessive API calls
  const [debouncedFilter, setDebouncedFilter] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyReports({
        page,
        limit: 20,
        filter: {
          idiomId: filter,
        },
      });
      setHistoryItems(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setSelectedIds([]);
    } catch (e) {
      toast.error("Không thể tải danh sách.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page to 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedFilter]);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một mục để xóa");
      return;
    }

    const confirmed = await modalService.danger(
      `Bạn có chắc chắn muốn xóa ${selectedIds.length} mục trong lịch sử đã chọn không?`,
      "Xác nhận xóa?"
    );

    if (!confirmed) return;

    try {
      await bulkDeleteReport(selectedIds);
      toast.success(`Đã xóa ${selectedIds.length} mục thành công!`);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại");
    }
  };

  const filteredItems = historyItems;

  const toggleSelectAll = useCallback(() => {
    if (
      filteredItems.length > 0 &&
      selectedIds.length === filteredItems.length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id!));
    }
  }, [filteredItems, selectedIds]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const isAllSelected = useMemo(
    () =>
      filteredItems.length > 0 && selectedIds.length === filteredItems.length,
    [filteredItems, selectedIds]
  );

  const isSomeSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length < filteredItems.length,
    [filteredItems, selectedIds]
  );

  return {
    historyItems,
    loading,
    filter,
    setFilter,
    selectedIds,
    setSelectedIds,
    page,
    setPage,
    totalPages,
    totalItems,
    filteredItems,
    handleBulkDelete,
    toggleSelectAll,
    toggleSelect,
    isAllSelected,
    isSomeSelected,
    loadData,
  };
};
