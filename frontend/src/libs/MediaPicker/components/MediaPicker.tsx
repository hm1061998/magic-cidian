import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Upload,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { MediaItem, ViewMode, MediaPickerConfig } from "../types";
import { MediaApiService } from "../services/MediaApiService";
import Sidebar from "./Sidebar";
import FileList from "./FileList";
import Inspector from "./Inspector";
import UploadModal from "./UploadModal";
import CreateFolderModal from "./CreateFolderModal";
import MoveModal from "./MoveModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface MediaPickerProps {
  onClose: () => void;
  onSelect: (url: string) => void;
  config?: MediaPickerConfig;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  onClose,
  onSelect,
  config,
}) => {
  const [data, setData] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize API service based on config
  const api = useMemo(
    () => new MediaApiService(config?.apiUrl),
    [config?.apiUrl]
  );

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const items = await api.fetchMedia();
      setData(items);
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);

  // Filter data based on current folder and search
  const filteredItems = useMemo(() => {
    let items = data.filter((item) => item.parentId === currentFolderId);

    if (searchQuery.trim()) {
      // Global search behavior
      items = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [data, currentFolderId, searchQuery]);

  // Breadcrumb logic
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ id: null, name: "Home" }];
    if (!currentFolderId) return crumbs;

    let current = data.find((i) => i.id === currentFolderId);
    const path = [];
    while (current) {
      path.unshift({ id: current.id, name: current.name });
      current = data.find((i) => i.id === current?.parentId);
    }
    return [...crumbs, ...path];
  }, [data, currentFolderId]);

  const handleCreateFolder = async (name: string) => {
    try {
      const newFolder = await api.createFolder(name, currentFolderId);
      setData((prev) => [...prev, newFolder]);
    } catch (err) {
      alert("Failed to create folder");
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    try {
      const newFiles = await api.uploadFiles(files, currentFolderId);
      setData((prev) => [...prev, ...newFiles]);
      if (newFiles.length > 0) {
        setSelectedItem(newFiles[0]);
      }
    } catch (err) {
      console.error("Upload error", err);
      throw err;
    }
  };

  const handleMoveItem = async (targetFolderId: string | null) => {
    if (!selectedItem) return;

    try {
      await api.moveItem(selectedItem.id, targetFolderId);
      // Update local state by changing parentId of the selected item
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, parentId: targetFolderId }
            : item
        )
      );

      // If we moved it out of the current view, deselect it
      if (currentFolderId !== targetFolderId) {
        setSelectedItem(null);
      }
    } catch (error) {
      alert("Failed to move item.");
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      await api.deleteItem(selectedItem.id);

      // Optimistic UI update: Remove item and any potential children (if folder) from local state
      // In a real app we might just refetch, but filtering is faster
      const removeIds = new Set([selectedItem.id]);

      // If folder, we need to find children to remove from local view too (simple recursion)
      if (selectedItem.type === "folder") {
        const findChildren = (parentId: string) => {
          data.forEach((d) => {
            if (d.parentId === parentId) {
              removeIds.add(d.id);
              if (d.type === "folder") findChildren(d.id);
            }
          });
        };
        findChildren(selectedItem.id);
      }

      setData((prev) => prev.filter((item) => !removeIds.has(item.id)));
      setSelectedItem(null);
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <LayoutGrid size={18} />
            </div>
            <span>Media Library</span>
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-gray-400 ml-2" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border rounded-lg text-sm w-64 transition-all outline-none"
              />
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Upload</span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar / Breadcrumbs */}
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 shrink-0 text-sm">
          <div className="flex items-center text-gray-600 overflow-hidden">
            {breadcrumbs.map((crumb, idx) => (
              <div
                key={crumb.id || "root"}
                className="flex items-center whitespace-nowrap"
              >
                {idx > 0 && (
                  <ChevronRight size={14} className="mx-1 text-gray-400" />
                )}
                <button
                  onClick={() => {
                    setCurrentFolderId(crumb.id);
                    setSelectedItem(null);
                    setSearchQuery("");
                  }}
                  className={`hover:text-blue-600 transition-colors ${
                    idx === breadcrumbs.length - 1
                      ? "font-semibold text-gray-900"
                      : ""
                  }`}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md ${
                  viewMode === "list"
                    ? "bg-gray-100 text-blue-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar
            folders={data}
            currentFolderId={currentFolderId}
            onNavigate={(id) => {
              setCurrentFolderId(id);
              setSelectedItem(null);
              setSearchQuery("");
            }}
            onCreateFolder={() => setIsCreateFolderModalOpen(true)}
          />

          <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
            {isLoading && data.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="flex flex-col items-center">
                  <Loader2
                    size={32}
                    className="animate-spin text-blue-600 mb-2"
                  />
                  <p className="text-gray-500 text-sm">Loading media...</p>
                </div>
              </div>
            ) : (
              <FileList
                items={filteredItems}
                viewMode={viewMode}
                selectedItem={selectedItem}
                onSelect={(item) => setSelectedItem(item)}
                onNavigate={(id) => {
                  setCurrentFolderId(id);
                  setSelectedItem(null);
                  setSearchQuery("");
                }}
              />
            )}
          </div>

          {/* Right Panel */}
          {selectedItem && (
            <Inspector
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onInsert={(url) => {
                onSelect(url);
                onClose();
              }}
              onMove={() => setIsMoveModalOpen(true)}
              onDelete={() => setIsDeleteModalOpen(true)}
            />
          )}
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFiles}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <MoveModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onMove={handleMoveItem}
        itemToMove={selectedItem}
        folders={data}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        item={selectedItem}
      />
    </div>
  );
};

export default MediaPicker;
