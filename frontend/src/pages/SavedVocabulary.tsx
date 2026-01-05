import React from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerIcon } from "@/components/common/icons";
import Pagination from "@/components/common/Pagination";
import BulkActionBar from "@/components/common/BulkActionBar";
import SelectAllCheckbox from "@/components/common/SelectAllCheckbox";
import { useSavedVocabulary } from "@/hooks/useSavedVocabulary";
import SavedHeader from "@/components/saved/SavedHeader";
import SavedItem from "@/components/saved/SavedItem";
import SavedEmptyState from "@/components/saved/SavedEmptyState";

interface SavedVocabularyProps {
  onBack: () => void;
}

const SavedVocabulary: React.FC<SavedVocabularyProps> = () => {
  const navigate = useNavigate();
  const {
    savedItems,
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
    handleRemove,
    handleBulkDelete,
    toggleSelectAll,
    toggleSelect,
    isAllSelected,
    isSomeSelected,
  } = useSavedVocabulary();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      <SavedHeader
        totalItems={totalItems}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Middle Section: Scrollable List */}
      <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar px-3 md:px-4 pb-6 pt-2">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <SpinnerIcon className="w-10 h-10 text-red-600 animate-spin mb-4" />
              <p className="font-bold text-xs uppercase tracking-widest">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : savedItems.length === 0 ? (
            <SavedEmptyState
              isFilterActive={false}
              filterText=""
              onExplore={() => navigate("/")}
            />
          ) : (
            <>
              <BulkActionBar
                selectedCount={selectedIds.length}
                onDelete={handleBulkDelete}
                onClearSelection={() => setSelectedIds([])}
                label="từ vựng"
                deleteLabel="Bỏ lưu đã chọn"
              />

              <SelectAllCheckbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={toggleSelectAll}
                subLabel={`(${filteredItems.length} mục)`}
                className="mb-4"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {filteredItems.map((item) => (
                  <SavedItem
                    key={item.hanzi}
                    item={item}
                    isSelected={selectedIds.includes(item.id!)}
                    onItemClick={(hanzi) =>
                      navigate(`/?query=${encodeURIComponent(hanzi)}`)
                    }
                    onRemove={handleRemove}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </div>
              {filteredItems.length === 0 && filter && (
                <SavedEmptyState
                  isFilterActive={true}
                  filterText={filter}
                  onExplore={() => {}}
                />
              )}
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

export default SavedVocabulary;
