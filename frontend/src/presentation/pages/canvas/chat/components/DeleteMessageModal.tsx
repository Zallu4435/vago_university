import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DeleteMessageModalProps } from '../../../../../domain/types/canvas/chat';

export const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
  isVisible,
  isSentMessage,
  onClose,
  onDeleteForMe,
  onDeleteForEveryone,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div ref={modalRef} className="bg-white dark:bg-[#202c33] rounded-lg p-4 md:p-6 max-w-sm w-full mx-2 md:mx-4 shadow-xl">
        <h3 className="text-lg md:text-xl font-medium mb-4 md:mb-6 text-gray-900 dark:text-white">Delete Message</h3>
        <div className="space-y-2 md:space-y-3">
          <button
            onClick={() => {
              onDeleteForMe();
              onClose();
            }}
            className="w-full px-4 py-3 md:py-4 text-left hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg text-gray-900 dark:text-white text-sm md:text-base transition-colors"
          >
            Delete for me
          </button>
          {isSentMessage && onDeleteForEveryone && (
            <button
              onClick={() => {
                onDeleteForEveryone();
                onClose();
              }}
              className="w-full px-4 py-3 md:py-4 text-left hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg text-red-600 text-sm md:text-base transition-colors"
            >
              Delete for everyone
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 md:py-4 text-left hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg text-gray-500 dark:text-gray-400 mt-4 md:mt-6 border-t border-gray-200 dark:border-gray-600 text-sm md:text-base transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};