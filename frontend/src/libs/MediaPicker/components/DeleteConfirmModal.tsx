import React, { useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { MediaItem } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: MediaItem | null;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 flex justify-between items-start">
          <div className="bg-red-100 p-3 rounded-full">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this item?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete <span className="font-medium text-gray-800">"{item.name}"</span>?
            This action cannot be undone.
          </p>

          {item.type === 'folder' && (
            <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-700">
                    Warning: This is a folder. Deleting it will also remove all files and subfolders contained within it.
                </p>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-sm text-sm flex items-center justify-center gap-2
                ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 transition-colors'}`}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;