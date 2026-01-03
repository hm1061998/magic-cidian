export type MediaType = 'image' | 'video' | 'folder';

export interface MediaItem {
  id: string;
  parentId: string | null; // null for root
  name: string;
  type: MediaType;
  url?: string; // Only for files
  size?: number; // In bytes
  dimensions?: { width: number; height: number }; // Only for images/videos
  thumbnail?: string;
  createdAt: string;
  duration?: string; // For videos
}

export interface ResizeOption {
  label: string;
  value: string; // 'original' | 'large' | 'medium' | 'thumbnail' | 'custom'
  width?: number;
  height?: number;
}

export interface Breadcrumb {
  id: string | null;
  name: string;
}

export type ViewMode = 'grid' | 'list';

export interface MediaPickerConfig {
  apiUrl?: string;
  token?: string; // Future proofing for auth headers
}