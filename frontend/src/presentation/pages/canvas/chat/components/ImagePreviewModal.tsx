import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div
        ref={modalRef}
        className="relative bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-w-2xl w-full max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
          <h3 className="text-lg font-medium text-white">Image Preview</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close preview"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 bg-gray-900 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-2 w-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain rounded select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};