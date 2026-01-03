import { MediaItem } from '../types';

export const INITIAL_DATA: MediaItem[] = [
  // Root Folders
  { id: 'f1', parentId: null, name: 'Marketing Assets', type: 'folder', size: 0, createdAt: '2023-10-01', dimensions: { width: 0, height: 0 } },
  { id: 'f2', parentId: null, name: 'Product Images', type: 'folder', size: 0, createdAt: '2023-10-05', dimensions: { width: 0, height: 0 } },
  { id: 'f3', parentId: null, name: 'User Uploads', type: 'folder', size: 0, createdAt: '2023-10-10', dimensions: { width: 0, height: 0 } },

  // Marketing Assets Folder
  { id: 'img1', parentId: 'f1', name: 'banner_hero_v2.jpg', type: 'image', url: 'https://picsum.photos/id/12/1200/600', thumbnail: 'https://picsum.photos/id/12/300/150', size: 2500000, dimensions: { width: 1200, height: 600 }, createdAt: '2023-10-12' },
  { id: 'img2', parentId: 'f1', name: 'social_post_instagram.png', type: 'image', url: 'https://picsum.photos/id/24/1080/1080', thumbnail: 'https://picsum.photos/id/24/300/300', size: 1800000, dimensions: { width: 1080, height: 1080 }, createdAt: '2023-10-13' },
  { id: 'vid1', parentId: 'f1', name: 'campaign_teaser.mp4', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://picsum.photos/id/30/300/200', size: 15400000, dimensions: { width: 1920, height: 1080 }, duration: '0:15', createdAt: '2023-10-14' },

  // Product Images Folder
  { id: 'f4', parentId: 'f2', name: 'Summer Collection', type: 'folder', size: 0, createdAt: '2023-11-01', dimensions: { width: 0, height: 0 } },
  { id: 'img3', parentId: 'f2', name: 'product_shoe_red.jpg', type: 'image', url: 'https://picsum.photos/id/40/800/800', thumbnail: 'https://picsum.photos/id/40/200/200', size: 900000, dimensions: { width: 800, height: 800 }, createdAt: '2023-11-02' },
  
  // Summer Collection Subfolder
  { id: 'img4', parentId: 'f4', name: 'beach_lifestyle.jpg', type: 'image', url: 'https://picsum.photos/id/55/1600/900', thumbnail: 'https://picsum.photos/id/55/320/180', size: 3200000, dimensions: { width: 1600, height: 900 }, createdAt: '2023-11-05' },

  // Root Files
  { id: 'img5', parentId: null, name: 'logo_transparent.png', type: 'image', url: 'https://picsum.photos/id/60/400/100', thumbnail: 'https://picsum.photos/id/60/400/100', size: 120000, dimensions: { width: 400, height: 100 }, createdAt: '2023-09-15' },
];