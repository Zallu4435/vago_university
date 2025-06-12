import React from 'react';
import { FiX } from 'react-icons/fi';
import { Message } from '../types/ChatTypes';

interface MediaPreviewProps {
  message: Message;
  onClose: () => void;
  styles: any;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ message, onClose, styles }) => {
  if (!message.attachments?.length) return null;

  const attachment = message.attachments[0];
  const isImage = attachment.type === 'image';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <FiX className="w-6 h-6" />
        </button>

        {isImage ? (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        ) : attachment.type === 'video' ? (
          <video
            src={attachment.url}
            controls
            className="max-w-full max-h-[90vh] rounded-lg"
          />
        ) : attachment.type === 'audio' ? (
          <audio
            src={attachment.url}
            controls
            className="w-full"
          />
        ) : (
          <div className={`${styles.card.background} p-4 rounded-lg`}>
            <a
              href={attachment.url}
              download={attachment.name}
              className="text-blue-500 hover:text-blue-600"
            >
              Download {attachment.name}
            </a>
          </div>
        )}

        <div className={`absolute bottom-4 left-4 right-4 ${styles.card.background} p-3 rounded-lg opacity-90`}>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(message.createdAt).toLocaleString()}
          </p>
          {message.senderName && (
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {message.senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 