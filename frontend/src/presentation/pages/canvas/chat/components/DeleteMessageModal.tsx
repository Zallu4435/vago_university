import React, { useRef, useEffect } from 'react';

interface DeleteMessageModalProps {
  isVisible: boolean;
  isSentMessage: boolean;
  onClose: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone?: () => void;
}

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
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white dark:bg-[#202c33] rounded-lg p-4 max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Delete Message</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              onDeleteForMe();
              onClose();
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded text-gray-900 dark:text-white"
          >
            Delete for me
          </button>
          {isSentMessage && onDeleteForEveryone && (
            <button
              onClick={() => {
                onDeleteForEveryone();
                onClose();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded text-red-600"
            >
              Delete for everyone
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded text-gray-500 dark:text-gray-400 mt-4 border-t border-gray-200 dark:border-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};