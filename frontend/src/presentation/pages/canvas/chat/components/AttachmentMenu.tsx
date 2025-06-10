import React, { useEffect, useRef } from 'react';
import { FiImage, FiCamera, FiMic } from 'react-icons/fi';
import { Styles } from '../types/ChatTypes';

interface AttachmentMenuProps {
  styles: Styles;
  showAttachmentMenu: boolean;
  onFileSelect: () => void;
  onCameraSelect: () => void;
  onClose: () => void;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  styles,
  showAttachmentMenu,
  onFileSelect,
  onCameraSelect,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (showAttachmentMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachmentMenu, onClose]);

  if (!showAttachmentMenu) return null;
  
  return (
    <div 
      ref={menuRef}
      className={`absolute bottom-full left-0 mb-2 ${styles.card.background} rounded-xl shadow-lg border ${styles.border} p-2 z-50 min-w-48`}
    >
      <button
        onClick={() => {
          onFileSelect();
          onClose();
        }}
        className={`flex items-center space-x-3 w-full p-3 ${styles.card.hover} rounded-lg transition-colors text-left`}
      >
        <div className={`p-2 bg-blue-100 dark:bg-blue-900 rounded-full`}>
          <FiImage className="w-4 h-4 text-blue-600" />
        </div>
        <span className={`text-sm font-medium ${styles.text.primary}`}>Photos & Videos</span>
      </button>
      
      <button
        onClick={() => {
          onCameraSelect();
          onClose();
        }}
        className={`flex items-center space-x-3 w-full p-3 ${styles.card.hover} rounded-lg transition-colors text-left`}
      >
        <div className={`p-2 bg-green-100 dark:bg-green-900 rounded-full`}>
          <FiCamera className="w-4 h-4 text-green-600" />
        </div>
        <span className={`text-sm font-medium ${styles.text.primary}`}>Camera</span>
      </button>

      <button
        className={`flex items-center space-x-3 w-full p-3 ${styles.card.hover} rounded-lg transition-colors text-left`}
      >
        <div className={`p-2 bg-purple-100 dark:bg-purple-900 rounded-full`}>
          <FiMic className="w-4 h-4 text-purple-600" />
        </div>
        <span className={`text-sm font-medium ${styles.text.primary}`}>Voice Message</span>
      </button>
    </div>
  );
}; 