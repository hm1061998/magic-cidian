import React, { useState } from 'react';
import { FolderInput, X, Folder, HardDrive, Check } from 'lucide-react';
import { MediaItem } from '../types';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string | null) => Promise<void>;
  itemToMove: MediaItem | null;
  folders: MediaItem[];
}

const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, onMove, itemToMove, folders }) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !itemToMove) return null;

  // Initialize selection with current parent if undefined
  const currentTargetId = selectedTargetId === undefined ? itemToMove.parentId : selectedTargetId;

  // Filter folders:
  // 1. Must be a folder
  // 2. Cannot be the item itself (if moving a folder)
  const availableFolders = folders.filter(f => f.type === 'folder' && f.id !== itemToMove.id);

  const handleMove = async () => {
    if (currentTargetId === undefined) return;
    
    setIsSubmitting(true);
    try {
      await onMove(currentTargetId);
      onClose();
    } catch (error) {
      console.error("Move failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FolderInput size={18} className="text-blue-600" />
            Move Item
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 bg-blue-50 border-b border-blue-100 shrink-0">
            <p className="text-sm text-blue-800">
                Moving <span className="font-semibold">"{itemToMove.name}"</span> to:
            </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Root Option */}
            <button
                onClick={() => setSelectedTargetId(null)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors border ${
                    currentTargetId === null 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-transparent hover:bg-gray-100 text-gray-700'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${currentTargetId === null ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <HardDrive size={18} className={currentTargetId === null ? 'text-blue-600' : 'text-gray-500'} />
                    </div>
                    <span>All Files (Root)</span>
                </div>
                {currentTargetId === null && <Check size={16} className="text-blue-600" />}
            </button>

            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">Folders</div>
            
            {availableFolders.map(folder => (
                <button
                    key={folder.id}
                    onClick={() => setSelectedTargetId(folder.id)}
                    disabled={folder.id === itemToMove.parentId} // Visually disable current folder
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors border ${
                        currentTargetId === folder.id 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                        : folder.id === itemToMove.parentId
                            ? 'opacity-50 cursor-default bg-gray-50 border-transparent'
                            : 'bg-white border-transparent hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-3 truncate">
                        <Folder size={18} className={currentTargetId === folder.id ? 'fill-blue-200 text-blue-600' : 'fill-gray-200 text-gray-400'} />
                        <span className="truncate">{folder.name}</span>
                        {folder.id === itemToMove.parentId && <span className="text-xs text-gray-400 ml-2">(Current)</span>}
                    </div>
                    {currentTargetId === folder.id && <Check size={16} className="text-blue-600" />}
                </button>
            ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleMove}
            disabled={isSubmitting || currentTargetId === itemToMove.parentId}
            className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2
              ${(isSubmitting || currentTargetId === itemToMove.parentId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-colors'}`}
          >
            {isSubmitting ? 'Moving...' : 'Move Here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;