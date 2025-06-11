import React, { useState, useRef, useEffect } from 'react';
import { FiPaperclip, FiMic, FiSmile, FiSend, FiCamera, FiX } from 'react-icons/fi';
import { Styles, Message } from '../types/ChatTypes';
import { EmojiPicker } from './EmojiPicker';
import { AttachmentMenu } from './AttachmentMenu';

interface ChatInputProps {
  styles: Styles;
  onSendMessage: (text: string) => void;
  onFileSelect: (file: File) => void;
  onCameraSelect: () => void;
  onTyping: (isTyping: boolean) => void;
  replyToMessage: Message | null;
  onCancelReply: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  styles,
  onSendMessage,
  onFileSelect,
  onCameraSelect,
  onTyping,
  replyToMessage,
  onCancelReply
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTyping(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
    setShowEmojiPicker(false); // Close emoji picker if open
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachmentMenu(false); // Close attachment menu if open
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative">
      {/* Reply preview */}
      {replyToMessage && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Replying to {replyToMessage.senderName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {replyToMessage.content}
            </div>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={handleChange}
            placeholder={replyToMessage ? "Write a reply..." : "Type a message..."}
            className={`w-full px-4 py-3 rounded-lg resize-none ${styles?.input?.background} ${styles?.input?.border} focus:outline-none focus:ring-2 ${styles?.input?.focus}`}
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          {/* Emoji picker */}
          <EmojiPicker
            styles={styles}
            show={showEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <label
            htmlFor="file-upload"
            className={`p-2 rounded-full cursor-pointer hover:bg-opacity-80 ${styles?.button?.secondary}`}
          >
            <FiPaperclip className="w-5 h-5" />
          </label>

          <button
            type="button"
            onClick={handleEmojiClick}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
            title="Add emoji"
          >
            <FiSmile className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onCameraSelect}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
            title="Take photo"
          >
            <FiCamera className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-2 rounded-full transition-colors duration-200 ${
              message.trim()
                ? `${styles?.button?.primary}`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Attachment menu */}
      <AttachmentMenu
        styles={styles}
        showAttachmentMenu={showAttachmentMenu}
        onFileSelect={() => {
          fileInputRef.current?.click();
          setShowAttachmentMenu(false);
        }}
        onCameraSelect={() => {
          onCameraSelect();
          setShowAttachmentMenu(false);
        }}
        onClose={() => setShowAttachmentMenu(false)}
      />
    </div>
  );
}; 