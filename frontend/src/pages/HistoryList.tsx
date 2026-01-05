import React from "react";
import { SpinnerIcon } from "@/components/common/icons";
import type { Idiom } from "@/types";
import Pagination from "@/components/common/Pagination";
import BulkActionBar from "@/components/common/BulkActionBar";
import SelectAllCheckbox from "@/components/common/SelectAllCheckbox";
import { useHistory } from "@/hooks/useHistory";
import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryItem from "@/components/history/HistoryItem";
import HistoryEmptyState from "@/components/history/HistoryEmptyState";

interface HistoryListProps {
  onBack: () => void;
  onSelect: (idiom: Idiom) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onSelect }) => {
  const {
    historyItems,
    loading,
    filter,
    setFilter,
    selectedIds,
    setSelectedIds,
    page,
    setPage,
    totalPages,
    filteredItems,
    handleClearAll,
    handleBulkDelete,
    toggleSelectAll,
    toggleSelect,
    isAllSelected,
    isSomeSelected,
  } = useHistory();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      <HistoryHeader
        filter={filter}
        setFilter={setFilter}
        onClearAll={handleClearAll}
        showClearAll={historyItems.length > 0}
      />

      {/* Middle Section: Scrollable List */}
      <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar px-3 md:px-4 pb-6 pt-2">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <SpinnerIcon className="w-10 h-10 text-red-600 animate-spin mb-4" />
              <p className="font-bold text-xs uppercase tracking-widest">
                Đang tải lịch sử...
              </p>
            </div>
          ) : historyItems.length === 0 ? (
            <HistoryEmptyState isFilterActive={false} filterText="" />
          ) : (
            <>
              <BulkActionBar
                selectedCount={selectedIds.length}
                onDelete={handleBulkDelete}
                onClearSelection={() => setSelectedIds([])}
                label="mục"
              />

              <SelectAllCheckbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={toggleSelectAll}
                subLabel={`(${filteredItems.length} mục)`}
                className="mb-4"
              />

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                {filteredItems.map((item, index) => (
                  <HistoryItem
                    key={`${item.id}-${index}`}
                    item={item}
                    index={(page - 1) * 20 + index + 1}
                    isSelected={selectedIds.includes(item.id!)}
                    onSelect={onSelect}
                    onToggleSelect={toggleSelect}
                  />
                ))}
                {filteredItems.length === 0 && filter && (
                  <HistoryEmptyState
                    isFilterActive={true}
                    filterText={filter}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fixed Bottom Section */}
      {totalPages > 1 && (
        <div className="flex-none bg-white border-t border-slate-200 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
