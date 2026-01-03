import React from 'react';
import { MediaItem, ViewMode } from '../types';
import { Folder, FileImage, FileVideo, MoreVertical, PlayCircle } from 'lucide-react';

interface FileListProps {
  items: MediaItem[];
  viewMode: ViewMode;
  selectedItem: MediaItem | null;
  onSelect: (item: MediaItem) => void;
  onNavigate: (folderId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ items, viewMode, selectedItem, onSelect, onNavigate }) => {
  
  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return '';
    if (bytes === 0) return '--';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (items.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Folder size={64} className="mb-4 opacity-20" />
            <p>This folder is empty</p>
        </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="overflow-y-auto h-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Modified</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => item.type === 'folder' ? onNavigate(item.id) : onSelect(item)}
                className={`cursor-pointer hover:bg-gray-50 ${selectedItem?.id === item.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded bg-gray-100 text-gray-500">
                        {item.type === 'folder' ? <Folder size={18} className="fill-yellow-400 text-yellow-600" /> : 
                         item.type === 'video' ? <FileVideo size={18} className="text-purple-500"/> : 
                         <img src={item.thumbnail || item.url} className="h-8 w-8 object-cover rounded" alt="" />}
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${selectedItem?.id === item.id ? 'text-blue-700' : 'text-gray-900'}`}>{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatSize(item.size)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto h-full content-start">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => item.type === 'folder' ? onNavigate(item.id) : onSelect(item)}
          className={`group relative rounded-lg border cursor-pointer transition-all duration-200 
            ${selectedItem?.id === item.id 
              ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'}`}
        >
          <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center relative">
            {item.type === 'folder' ? (
              <Folder size={64} className="text-yellow-400 fill-yellow-100" />
            ) : (
              <img 
                src={item.thumbnail || item.url} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            )}
            
            {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <PlayCircle size={32} className="text-white fill-black/50" />
                </div>
            )}
             {item.type === 'video' && (
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {item.duration}
                </span>
            )}
          </div>
          
          <div className="p-3">
            <p className={`text-sm font-medium truncate ${selectedItem?.id === item.id ? 'text-blue-700' : 'text-gray-700'}`}>
                {item.name}
            </p>
            <p className="text-xs text-gray-400 mt-1 flex justify-between">
                <span>{item.type === 'folder' ? item.createdAt : formatSize(item.size)}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;