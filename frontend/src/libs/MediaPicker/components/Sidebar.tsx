import React from 'react';
import { Folder, HardDrive, Plus } from 'lucide-react';
import { MediaItem } from '../types';

interface SidebarProps {
  folders: MediaItem[];
  currentFolderId: string | null;
  onNavigate: (folderId: string | null) => void;
  onCreateFolder: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ folders, currentFolderId, onNavigate, onCreateFolder }) => {
  // Simple flat list for this demo, filtering only root folders or folders within folders could be recursive
  // For this MVP, we show a "All Files" root and then a list of all folders available to jump to
  
  const allFolders = folders.filter(f => f.type === 'folder');

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Library</h2>
        <button 
          onClick={onCreateFolder}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
          title="New Folder"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <button
          onClick={() => onNavigate(null)}
          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentFolderId === null 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <HardDrive size={18} />
          <span>All Files</span>
        </button>

        <div className="pt-2">
           <div className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase">Folders</div>
           {allFolders.map(folder => (
             <button
                key={folder.id}
                onClick={() => onNavigate(folder.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentFolderId === folder.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
             >
               <Folder size={18} className={currentFolderId === folder.id ? 'fill-blue-200' : 'fill-gray-200'} />
               <span className="truncate">{folder.name}</span>
             </button>
           ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Storage Used</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="text-xs font-medium text-gray-700">4.5 GB / 10 GB</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;