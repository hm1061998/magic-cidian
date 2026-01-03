import React from 'react';
import { createRoot } from 'react-dom/client';
import MediaPicker from '../components/MediaPicker';
import { MediaPickerConfig } from '../types';

export const mediaPickerService = {
  /**
   * Opens the Media Picker modal imperatively.
   * @param config Optional configuration like apiUrl
   * @returns a Promise that resolves to the selected URL (string) or null if cancelled.
   */
  open: (config?: MediaPickerConfig): Promise<string | null> => {
    return new Promise((resolve) => {
      // 1. Create a container element in the body
      const container = document.createElement('div');
      // Set an ID for debugging purposes
      container.id = 'media-picker-overlay-root';
      document.body.appendChild(container);
      
      // 2. Create a React Root
      const root = createRoot(container);

      // 3. Define cleanup function to unmount and remove DOM element
      const cleanup = () => {
        // Unmount React component
        root.unmount();
        // Remove div from DOM
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      };

      // 4. Callbacks for the component
      const handleClose = () => {
        cleanup();
        resolve(null);
      };

      const handleSelect = (url: string) => {
        cleanup();
        resolve(url);
      };

      // 5. Render the MediaPicker into the standalone root
      root.render(
        <React.StrictMode>
          <MediaPicker 
            onClose={handleClose} 
            onSelect={handleSelect} 
            config={config}
          />
        </React.StrictMode>
      );
    });
  }
};