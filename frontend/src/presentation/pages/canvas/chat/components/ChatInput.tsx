import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiSmile, FiPaperclip, FiX, FiCornerUpLeft } from 'react-icons/fi';
import { EmojiPicker } from './EmojiPicker';
import { AttachmentMenu } from './AttachmentMenu';
import { Styles, Message } from '../types/ChatTypes';
import { MediaPreview } from './MediaPreview';
import { useChatMutations } from '../hooks/useChatMutations';
import { toast } from 'react-hot-toast';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File, replyTo?: Message) => void;
  onTyping: (isTyping: boolean) => void;
  styles: Styles;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
  selectedChatId: string | null;
  currentUserId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  styles,
  replyToMessage,
  onCancelReply,
  selectedChatId,
  currentUserId
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const attachmentRef = useRef<HTMLButtonElement>(null);
  const emojiRef = useRef<HTMLButtonElement>(null);

  const { sendFile, sendMessage } = useChatMutations(selectedChatId || undefined, currentUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFiles.length > 0) {
      onSendMessage(message.trim(), selectedFiles.length > 0 ? selectedFiles[0] : undefined, replyToMessage || undefined);
      setMessage('');
      setSelectedFiles([]);
      setPreviewUrls([]);
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
    onTyping(false);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setSelectedFiles(prev => [...prev, ...files]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      if (files.some(file => file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        setShowMediaPreview(true);
      }
    }
  };

  const handleCameraSelect = () => {
    // Camera handling logic
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const clearSelectedFiles = () => {
    selectedFiles.forEach((_, idx) => {
      if (previewUrls[idx]) URL.revokeObjectURL(previewUrls[idx]);
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleSendMedia = (caption: string) => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        onSendMessage(caption, file, replyToMessage || undefined);
      });
      setMessage('');
      clearSelectedFiles();
      setShowMediaPreview(false);
    }
  };

  const handleCloseMediaPreview = () => {
    setShowMediaPreview(false);
    clearSelectedFiles();
  };

  const handleAddMoreFiles = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveMedia = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendAllMedia = async (media: { url: string; name: string; type: string; caption: string }[]) => {
    if (!selectedChatId || selectedFiles.length === 0) return;
    onSendMessage(media[0]?.caption || '', selectedFiles, replyToMessage || undefined);
    setMessage('');
    clearSelectedFiles();
    setShowMediaPreview(false);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="relative bg-white dark:bg-[#202c33] p-2">
      {replyToMessage && (
        <div className="absolute bottom-full left-0 right-0 p-3 bg-white dark:bg-[#2a3942] border border-gray-200 dark:border-[#2a3942] rounded-t-xl max-w-xs mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <FiCornerUpLeft className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Replying to {replyToMessage.senderName}</span>
            </div>
            <button
              onClick={onCancelReply}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {replyToMessage.content}
          </div>
        </div>
      )}

      {showMediaPreview && selectedFiles.length > 0 && (
        <MediaPreview
          message={{ attachments: selectedFiles.map((file, idx) => ({ url: previewUrls[idx], name: file.name, type: file.type.startsWith('image/') ? 'image' : 'video' })) }}
          onClose={handleCloseMediaPreview}
          styles={styles}
          onAddMore={handleAddMoreFiles}
          onRemoveMedia={handleRemoveMedia}
          onSendMedia={handleSendAllMedia}
        />
      )}

      {selectedFiles.length > 0 && selectedFiles.every(file => !(file.type.startsWith('image/') || file.type.startsWith('video/'))) && (
        <div className="absolute bottom-full left-0 right-0 p-3 bg-white dark:bg-[#2a3942] border border-gray-200 dark:border-[#2a3942] rounded-t-xl max-w-xs mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedFiles.map(f => f.name).join(', ')}</span>
            <button
              onClick={clearSelectedFiles}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 bg-white dark:bg-[#2a3942] rounded-xl shadow-sm">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          multiple
        />

        <button
          ref={attachmentRef}
          type="button"
          onClick={handleAttachmentClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c3e50]"
        >
          <FiPaperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          ref={emojiRef}
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c3e50]"
        >
          <FiSmile className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!message.trim() && selectedFiles.length === 0}
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>

      {showEmojiPicker && (
        <div
          className="absolute left-0 bottom-full mb-102 z-30 w-full rounded-xl shadow-xl bg-white dark:bg-[#202c33]"
        >
          <EmojiPicker
            show={showEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            styles={styles}
            position="bottom"
          />
        </div>
      )}

      {showAttachmentMenu && (
        <div
          className="absolute bottom-full left-0 transform translate-x-0"
          style={{ transform: 'translateX(-50%)' }}
        >
          <AttachmentMenu
            styles={styles}
            showAttachmentMenu={showAttachmentMenu}
            onFileSelect={handleFileSelect}
            onCameraSelect={handleCameraSelect}
            onClose={() => setShowAttachmentMenu(false)}
          />
        </div>
      )}
    </div>
  );
};