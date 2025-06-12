import React, { useEffect, useRef } from 'react';
import { FiImage, FiCamera, FiMic, FiFile, FiMapPin } from 'react-icons/fi';
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className={`${styles.card.background} rounded-xl shadow-lg border ${styles.border} p-4 w-80 max-w-[90vw]`}
        onClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              onFileSelect();
              onClose();
            }}
            className={`flex flex-col items-center p-4 ${styles.card.hover} rounded-lg transition-colors`}
          >
            <div className={`p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-3`}>
              <FiImage className="w-8 h-8 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${styles.text.primary}`}>Photos & Videos</span>
          </button>
          
          <button
            onClick={() => {
              onCameraSelect();
              onClose();
            }}
            className={`flex flex-col items-center p-4 ${styles.card.hover} rounded-lg transition-colors`}
          >
            <div className={`p-4 bg-green-100 dark:bg-green-900 rounded-full mb-3`}>
              <FiCamera className="w-8 h-8 text-green-600" />
            </div>
            <span className={`text-sm font-medium ${styles.text.primary}`}>Camera</span>
          </button>

          <button
            className={`flex flex-col items-center p-4 ${styles.card.hover} rounded-lg transition-colors`}
          >
            <div className={`p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-3`}>
              <FiMic className="w-8 h-8 text-purple-600" />
            </div>
            <span className={`text-sm font-medium ${styles.text.primary}`}>Voice Message</span>
          </button>

          <button
            className={`flex flex-col items-center p-4 ${styles.card.hover} rounded-lg transition-colors`}
          >
            <div className={`p-4 bg-orange-100 dark:bg-orange-900 rounded-full mb-3`}>
              <FiFile className="w-8 h-8 text-orange-600" />
            </div>
            <span className={`text-sm font-medium ${styles.text.primary}`}>Document</span>
          </button>

          <button
            className={`flex flex-col items-center p-4 ${styles.card.hover} rounded-lg transition-colors`}
          >
            <div className={`p-4 bg-red-100 dark:bg-red-900 rounded-full mb-3`}>
              <FiMapPin className="w-8 h-8 text-red-600" />
            </div>
            <span className={`text-sm font-medium ${styles.text.primary}`}>Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 