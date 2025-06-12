import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiSmile, FiPaperclip, FiX, FiCornerUpLeft } from 'react-icons/fi';
import { EmojiPicker } from './EmojiPicker';
import { AttachmentMenu } from './AttachmentMenu';
import { Styles, Message } from '../types/ChatTypes';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File, replyTo?: Message) => void;
  onTyping: (isTyping: boolean) => void;
  styles: Styles;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  styles,
  replyToMessage,
  onCancelReply
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSendMessage(message.trim(), selectedFile || undefined, replyToMessage || undefined);
      setMessage('');
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCameraSelect = () => {
    // Camera handling logic
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="relative">
      {replyToMessage && (
        <div className={`absolute bottom-full left-0 right-0 p-4 ${styles.card.background} border ${styles.border} rounded-t-lg`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FiCornerUpLeft className="text-gray-500" />
              <span className="text-sm font-medium">Replying to {replyToMessage.senderName}</span>
            </div>
            <button
              onClick={onCancelReply}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {replyToMessage.content}
          </div>
        </div>
      )}

      {selectedFile && (
        <div className={`absolute bottom-full left-0 right-0 p-4 ${styles.card.background} border ${styles.border} rounded-t-lg`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <button
              onClick={clearSelectedFile}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          {previewUrl && selectedFile.type.startsWith('image/') && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 rounded-lg object-contain"
            />
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        
        <button
          type="button"
          onClick={handleAttachmentClick}
          className={`p-2 rounded-full ${styles.button.secondary}`}
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-full ${styles.button.secondary}`}
        >
          <FiSmile className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className={`flex-1 p-2 rounded-lg ${styles.input.background} ${styles.input.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        <button
          type="submit"
          disabled={!message.trim() && !selectedFile}
          className={`p-2 rounded-full ${styles.button.primary} disabled:opacity-50`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>

      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-2">
          <EmojiPicker
            show={showEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            styles={styles}
            position="bottom"
          />
        </div>
      )}

      <AttachmentMenu
        styles={styles}
        showAttachmentMenu={showAttachmentMenu}
        onFileSelect={handleFileSelect}
        onCameraSelect={handleCameraSelect}
        onClose={() => setShowAttachmentMenu(false)}
      />
    </div>
  );
}; 