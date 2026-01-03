import { MediaItem } from '../types';
import { INITIAL_DATA } from '../data/mockData';

// --- Fallback In-Memory Storage ---
// This ensures the app works even if the backend is not running.
// We keep this outside the class so data persists across re-renders/re-opens of the service
let localData: MediaItem[] = [...INITIAL_DATA];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MediaApiService {
  private baseUrl: string;

  constructor(apiUrl?: string) {
    // Default to localhost if not provided
    this.baseUrl = apiUrl || 'http://localhost:4000/media';
  }

  /**
   * Fetch all media items
   * Tries the backend first, falls back to local data on error.
   */
  async fetchMedia(): Promise<MediaItem[]> {
    try {
      const res = await fetch(this.baseUrl);
      if (!res.ok) throw new Error('Failed to connect to backend');
      return await res.json();
    } catch (error) {
      console.warn(`Backend unreachable at ${this.baseUrl} (fetching media). Falling back to local mock data.`);
      await delay(600); // Simulate network latency
      return [...localData];
    }
  }

  /**
   * Create a new folder
   */
  async createFolder(name: string, parentId: string | null): Promise<MediaItem> {
    try {
      const res = await fetch(`${this.baseUrl}/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId }),
      });
      if (!res.ok) throw new Error('Backend failed');
      return await res.json();
    } catch (error) {
      console.warn('Backend unreachable (create folder). Using local mock.');
      await delay(400);
      
      const newFolder: MediaItem = {
        id: `f-${Date.now()}`,
        parentId,
        name,
        type: 'folder',
        size: 0,
        createdAt: new Date().toISOString().split('T')[0],
        dimensions: { width: 0, height: 0 }
      };
      localData.push(newFolder);
      return newFolder;
    }
  }

  /**
   * Upload files
   */
  async uploadFiles(files: File[], parentId: string | null): Promise<MediaItem[]> {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('parentId', parentId === null ? 'null' : parentId);

      const res = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Backend failed');
      return await res.json();
    } catch (error) {
      console.warn('Backend unreachable (upload). Using local mock.');
      await delay(1200);

      const newItems: MediaItem[] = files.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentId,
        name: file.name,
        type: file.type.startsWith('video') ? 'video' : 'image',
        // Use Blob URL for immediate local preview since we can't upload to server
        url: URL.createObjectURL(file), 
        thumbnail: file.type.startsWith('image') ? URL.createObjectURL(file) : undefined,
        size: file.size,
        dimensions: { width: 800, height: 600 }, // Mock dimensions
        createdAt: new Date().toISOString().split('T')[0]
      }));

      localData = [...localData, ...newItems];
      return newItems;
    }
  }

  /**
   * Move an item to a new folder
   */
  async moveItem(itemId: string, newParentId: string | null): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/${itemId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newParentId }),
      });
      if (!res.ok) throw new Error('Backend failed');
    } catch (error) {
      console.warn('Backend unreachable (move). Using local mock.');
      await delay(300);
      localData = localData.map(item => 
        item.id === itemId 
          ? { ...item, parentId: newParentId } 
          : item
      );
    }
  }

  /**
   * Delete an item
   */
  async deleteItem(itemId: string): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Backend failed');
    } catch (error) {
      console.warn('Backend unreachable (delete). Using local mock.');
      await delay(500);
      
      const itemToDelete = localData.find(i => i.id === itemId);
      if (!itemToDelete) return;

      // Recursive delete for local mock
      const deleteRecursive = (id: string) => {
          // Remove the item
          localData = localData.filter(i => i.id !== id);
          
          // Find children
          const children = localData.filter(i => i.parentId === id);
          children.forEach(c => deleteRecursive(c.id));
      };
      
      deleteRecursive(itemId);
    }
  }
}