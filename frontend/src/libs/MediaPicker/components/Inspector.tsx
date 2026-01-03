import React, { useState, useEffect } from 'react';
import { MediaItem, ResizeOption } from '../types';
import { X, Check, Image as ImageIcon, Video, Calendar, HardDrive, Maximize, FolderInput, Trash2 } from 'lucide-react';

interface InspectorProps {
  item: MediaItem | null;
  onClose: () => void;
  onInsert: (url: string) => void;
  onMove: () => void;
  onDelete: () => void;
}

const Inspector: React.FC<InspectorProps> = ({ item, onClose, onInsert, onMove, onDelete }) => {
  const [resizeMode, setResizeMode] = useState<string>('original');
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);

  useEffect(() => {
    if (item?.dimensions) {
      setCustomWidth(item.dimensions.width);
      setCustomHeight(item.dimensions.height);
      setResizeMode('original');
    }
  }, [item]);

  if (!item) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
        <ImageIcon size={48} className="mb-4 opacity-20" />
        <p>Select an image or video to view details and options.</p>
      </div>
    );
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return '--';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleInsert = () => {
    if (!item.url) return;
    
    let finalUrl = item.url;
    
    // Logic to simulate resize parameter appending
    if (item.type === 'image') {
      const params = new URLSearchParams();
      
      if (resizeMode !== 'original') {
         if (resizeMode === 'custom') {
             if (customWidth) params.append('w', customWidth.toString());
             if (customHeight) params.append('h', customHeight.toString());
         } else if (resizeMode === 'large') {
             params.append('w', '1200');
         } else if (resizeMode === 'medium') {
             params.append('w', '800');
         } else if (resizeMode === 'thumbnail') {
             params.append('w', '150');
             params.append('h', '150');
         }
         finalUrl = `${item.url}?${params.toString()}`;
      }
    }
    
    onInsert(finalUrl);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col overflow-y-auto shadow-xl z-20">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-700">Details</h3>
        <div className="flex items-center gap-1">
            <button 
                onClick={onMove} 
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Move to folder"
            >
                <FolderInput size={18} />
            </button>
            <button 
                onClick={onDelete} 
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete item"
            >
                <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <X size={18} />
            </button>
        </div>
      </div>

      <div className="p-4 flex-1">
        {/* Preview */}
        <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 flex items-center justify-center relative group">
          {item.type === 'video' ? (
             <div className="relative w-full aspect-video bg-black">
                <video src={item.url} className="w-full h-full object-contain" controls />
             </div>
          ) : (
            <img src={item.url} alt={item.name} className="w-full h-auto max-h-48 object-contain" />
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-3 mb-6">
          <div className="text-sm font-medium text-gray-900 break-words">{item.name}</div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
                <HardDrive size={14} className="text-gray-400" />
                <span>{formatSize(item.size)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span>{item.createdAt}</span>
            </div>
            {item.dimensions && (
                <div className="flex items-center gap-2 col-span-2">
                    <Maximize size={14} className="text-gray-400" />
                    <span>{item.dimensions.width} x {item.dimensions.height} px</span>
                </div>
            )}
            {item.duration && (
                <div className="flex items-center gap-2 col-span-2">
                    <Video size={14} className="text-gray-400" />
                    <span>Duration: {item.duration}</span>
                </div>
            )}
          </div>
        </div>

        <hr className="my-4 border-gray-100" />

        {/* Action / Resize Form */}
        {item.type === 'image' && (
            <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Output Settings</h4>
            
            <div className="space-y-2">
                <label className="text-sm text-gray-600 block">Size Presets</label>
                <select 
                    value={resizeMode} 
                    onChange={(e) => setResizeMode(e.target.value)}
                    className="w-full border border-gray-300 rounded-md text-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                    <option value="original">Original ({item.dimensions?.width}x{item.dimensions?.height})</option>
                    <option value="large">Large (1200px width)</option>
                    <option value="medium">Medium (800px width)</option>
                    <option value="thumbnail">Thumbnail (150x150)</option>
                    <option value="custom">Custom Dimensions</option>
                </select>
            </div>

            {resizeMode === 'custom' && (
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
                        <input 
                            type="number" 
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" 
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
                        <input 
                            type="number" 
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" 
                        />
                    </div>
                </div>
            )}
            </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button 
          onClick={handleInsert}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Select & Insert
        </button>
      </div>
    </div>
  );
};

export default Inspector;