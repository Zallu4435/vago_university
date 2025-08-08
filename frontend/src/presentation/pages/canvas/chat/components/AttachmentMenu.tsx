import React, { useEffect, useRef } from 'react';
import { FiImage, FiCamera, FiFile, FiMapPin } from 'react-icons/fi';
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
      className="absolute left-0 bottom-full mb-2 shadow-xl rounded-xl border p-4 w-60 max-w-[90vw] bg-white dark:bg-[#202c33] border-gray-200 dark:border-[#2a3942] animate-fadeIn z-30"
      onClick={e => e.stopPropagation()}
    >
      <div className="grid grid-cols-1 gap-1">
        <button
          onClick={() => {
            onFileSelect();
            onClose();
          }}
          className={`flex items-center p-2 ${styles.card.hover} text-white rounded-lg transition-colors`}
        >
          <div className={`p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3`}>
            <FiImage className="w-6 h-6 text-blue-600" />
          </div>
          <span className={`text-base font-medium`}>Photos & Videos</span>
        </button>
        
        <button
          onClick={() => {
            onCameraSelect();
            onClose();
          }}
          className={`flex items-center p-2 ${styles.card.hover} text-white rounded-lg transition-colors`}
        >
          <div className={`p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3`}>
            <FiCamera className="w-6 h-6 text-green-600" />
          </div>
          <span className={`text-base font-medium`}>Camera</span>
        </button>
        
        <button
          className={`flex items-center p-2 ${styles.card.hover} text-white rounded-lg transition-colors`}
        >
          <div className={`p-2 bg-orange-100 dark:bg-orange-900 rounded-full mr-3`}>
            <FiFile className="w-6 h-6 text-orange-600" />
          </div>
          <span className={`text-base font-medium`}>Document</span>
        </button>

        <button
          className={`flex items-center p-2 ${styles.card.hover} text-white rounded-lg transition-colors`}
        >
          <div className={`p-2 bg-red-100 dark:bg-red-900 rounded-full mr-3`}>
            <FiMapPin className="w-6 h-6 text-red-600" />
          </div>
          <span className={`text-base font-medium`}>Location</span>
        </button>
      </div>
    </div>
  );
};