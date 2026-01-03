import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUploadClick = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(10); // Start progress

    // Simulate progress visual before the actual await finishes
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    try {
      await onUpload(files);
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setUploading(false);
        setFiles([]);
        setProgress(0);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Upload failed", error);
      clearInterval(interval);
      setUploading(false);
      alert("Failed to upload files. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800">Upload Media</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!uploading ? (
            <>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <UploadCloud size={32} className="text-blue-600" />
                </div>
                <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">SVG, PNG, JPG or MP4 (max. 50MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected Files ({files.length})</h4>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-100">
                      <File size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 truncate flex-1">{file.name}</span>
                      <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
               <div className="w-16 h-16 mb-4 relative flex items-center justify-center">
                  <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} className="transition-all duration-300 ease-out" />
                  </svg>
                  <span className="absolute text-sm font-bold text-blue-600">{progress}%</span>
               </div>
               <p className="text-gray-800 font-medium text-lg">Uploading files...</p>
               <p className="text-gray-500 text-sm mt-1">Please wait while we process your assets.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors text-sm"
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            onClick={handleUploadClick}
            disabled={files.length === 0 || uploading}
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm text-sm flex items-center gap-2
              ${(files.length === 0 || uploading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 transition-colors'}`}
          >
            {uploading ? 'Processing...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;