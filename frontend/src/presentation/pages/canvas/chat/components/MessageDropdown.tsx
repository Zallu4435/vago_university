import React, { useRef, useEffect } from 'react';
import { FiSmile, FiCornerUpLeft, FiShare2, FiEdit2, FiTrash2, FiInfo, FiDownload, FiPaperclip, FiStar } from 'react-icons/fi';
import { Message } from '../types/ChatTypes';

interface MessageDropdownProps {
  message: Message;
  currentUserId: string;
  isVisible: boolean;
  onClose: () => void;
  onReact: () => void;
  onReply: () => void;
  onForward: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShowDeleteOptions: () => void;
}

export const MessageDropdown: React.FC<MessageDropdownProps> = ({
  message,
  currentUserId,
  isVisible,
  onClose,
  onReact,
  onReply,
  onForward,
  onEdit,
  onDelete,
  onShowDeleteOptions
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isSentMessage = message.senderId === currentUserId;

  return (
    <div
      ref={menuRef}
      className={`absolute top-8 ${isSentMessage ? 'right-0' : 'left-0'} bg-white dark:bg-[#202c33] rounded-lg shadow-lg py-1 z-10 w-48 border border-gray-200 dark:border-gray-600`}
    >
      <button
        onClick={() => {
          onReact();
          onClose();
        }}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
      >
        <FiSmile className="w-4 h-4 mr-3" />
        React
      </button>
      
      <button
        onClick={() => {
          onReply();
          onClose();
        }}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
      >
        <FiCornerUpLeft className="w-4 h-4 mr-3" />
        Reply
      </button>
      
      <button
        onClick={() => {
          onForward();
          onClose();
        }}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
      >
        <FiShare2 className="w-4 h-4 mr-3" />
        Forward
      </button>

      {/* Edit option - only for sent messages */}
      {isSentMessage && (
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
        >
          <FiEdit2 className="w-4 h-4 mr-3" />
          Edit
        </button>
      )}

      {/* Delete options */}
      {isSentMessage ? (
        // For sent messages, show delete with options
        <button
          onClick={onShowDeleteOptions}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
        >
          <FiTrash2 className="w-4 h-4 mr-3" />
          Delete
        </button>
      ) : (
        // For received messages, show only "Delete for me"
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
        >
          <FiTrash2 className="w-4 h-4 mr-3" />
          Delete for me
        </button>
      )}

      <button
        onClick={onClose}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
      >
        <FiInfo className="w-4 h-4 mr-3" />
        Info
      </button>

      {message.attachments && message.attachments.length > 0 && (
        <a
          href={message.attachments[0].url}
          download={message.attachments[0].name}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
        >
          <FiDownload className="w-4 h-4 mr-3" />
          Download
        </a>
      )}

      <button
        onClick={onClose}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
      >
        <FiPaperclip className="w-4 h-4 mr-3" />
        Pin
      </button>

      <button
        onClick={onClose}
        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full text-left"
      >
        <FiStar className="w-4 h-4 mr-3" />
        Star
      </button>
    </div>
  );
};