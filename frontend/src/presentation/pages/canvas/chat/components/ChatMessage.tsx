import React, { useState } from 'react';
import { Message, Styles } from '../types/ChatTypes';
import { formatMessageTime, shouldShowDateHeader } from '../utils/chatUtils';
import { FiCheck, FiCheckCircle, FiMoreVertical, FiTrash2, FiEdit2, FiShare2, FiCornerUpLeft } from 'react-icons/fi';
import { MessageStatus } from './MessageStatus';
import { EmojiPicker } from './EmojiPicker';

interface ChatMessageProps {
  message: Message;
  previousMessage?: Message;
  styles: Styles;
  onReaction: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string, deleteForEveryone: boolean) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onReply: (messageId: string) => void;
  onForward: (messageId: string) => void;
  currentUserId: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  previousMessage,
  styles,
  onReaction,
  onDelete,
  onEdit,
  onReply,
  onForward,
  currentUserId
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleDelete = (deleteForEveryone: boolean) => {
    onDelete(message.id, deleteForEveryone);
    setShowDeleteOptions(false);
    setShowMenu(false);
  };

  const handleEdit = () => {
    if (editedContent.trim() && editedContent !== message.content) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const renderStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return (
          <div className="flex items-center">
            <FiCheck className="w-3 h-3 text-gray-400" />
          </div>
        );
      case 'delivered':
        return (
          <div className="flex items-center">
            <FiCheck className="w-3 h-3 text-gray-400" />
            <FiCheck className="w-3 h-3 -ml-1 text-gray-400" />
          </div>
        );
      case 'read':
        return (
          <div className="flex items-center">
            <FiCheck className="w-3 h-3 text-blue-500" />
            <FiCheck className="w-3 h-3 -ml-1 text-blue-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderReactions = () => {
    if (!message.reactions?.length) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {message.reactions.map(reaction => (
          <span
            key={reaction.id}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
          >
            {reaction.emoji} {reaction.count}
          </span>
        ))}
      </div>
    );
  };

  const renderReplyTo = () => {
    if (!message.replyTo) return null;

    const replyTo = typeof message.replyTo === 'string' 
      ? { id: message.replyTo, content: '', senderId: '', senderName: 'Unknown', type: 'text' as const, createdAt: '' }
      : message.replyTo;

    return (
      <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        Replying to {replyTo.senderName}
      </div>
    );
  };

  const renderForwardedFrom = () => {
    if (!message.forwardedFrom) return null;

    return (
      <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        Forwarded from {message.forwardedFrom.chatName}
      </div>
    );
  };

  return (
    <>
      {shouldShowDateHeader(message, previousMessage) && (
        <div className="flex justify-center my-4">
          <div className="px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
            {formatMessageTime(message.createdAt)}
          </div>
        </div>
      )}
      
      <div className={`group relative flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'} mb-2`}>
        <div
          className={`relative max-w-[70%] rounded-lg px-4 py-2 ${
            message.senderId === currentUserId ? styles.message.sent : styles.message.received
          }`}
        >
          {renderForwardedFrom()}
          {renderReplyTo()}
          
          {message.isDeleted ? (
            <p className="text-sm text-gray-500 italic">This message was deleted</p>
          ) : isEditing ? (
            <div className="flex items-center space-x-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                rows={1}
                autoFocus
              />
              <button
                onClick={handleEdit}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-sm break-words">{message.content}</p>
          )}
          
          {renderReactions()}
          
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span className="text-xs text-gray-500">
              {formatMessageTime(message.createdAt)}
            </span>
            {message.senderId === currentUserId && (
              <div className="ml-1">
                {renderStatusIcon()}
              </div>
            )}
          </div>

          {/* Message Menu */}
          {!message.isDeleted && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Message Menu Dropdown */}
          {showMenu && (
            <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
              {message.senderId === currentUserId && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteOptions(true)}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  onReply(message.id);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                <FiCornerUpLeft className="w-4 h-4 mr-2" />
                Reply
              </button>
              <button
                onClick={() => {
                  onForward(message.id);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                <FiShare2 className="w-4 h-4 mr-2" />
                Forward
              </button>
              <button
                onClick={() => {
                  setShowEmojiPicker(true);
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                <span className="mr-2">😀</span>
                React
              </button>
            </div>
          )}

          {/* Delete Options */}
          {showDeleteOptions && (
            <div className="absolute top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-20">
              <button
                onClick={() => handleDelete(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                Delete for me
              </button>
              <button
                onClick={() => handleDelete(true)}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                Delete for everyone
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker
                styles={styles}
                show={showEmojiPicker}
                onEmojiSelect={(emoji) => {
                  onReaction(message.id, emoji);
                  setShowEmojiPicker(false);
                }}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 