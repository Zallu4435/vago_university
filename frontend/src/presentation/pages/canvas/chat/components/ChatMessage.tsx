import React, { useState, useRef, useEffect } from 'react';
import { Message, Styles } from '../types/ChatTypes';
import { formatMessageTime, shouldShowDateHeader } from '../utils/chatUtils';
import { FiCheck, FiCheckCircle, FiMoreVertical, FiTrash2, FiEdit2, FiShare2, FiCornerUpLeft, FiSmile } from 'react-icons/fi';
import { MessageStatus } from './MessageStatus';
import { EmojiPicker } from './EmojiPicker';
import { chatService } from '../services/chatService';
import { toast } from 'react-hot-toast';

interface Reaction {
  emoji: string;
  userId: string;
}

interface ReactionData {
  userIds: string[];
  users: string[];
}

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
  previousMessage?: Message;
  onReply: (message: Message) => void;
  onForward: (messageId: string) => void;
  onDelete: (messageId: string, deleteForEveryone: boolean) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  styles: {
    messageContainer: string;
    messageContent: string;
    messageText: string;
    messageTime: string;
    messageStatus: string;
    background: string;
    backgroundSecondary: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    hover: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  previousMessage,
  styles,
  onReaction,
  onRemoveReaction,
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
  const [showReactions, setShowReactions] = useState(false);
  const reactionsRef = useRef<HTMLDivElement>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (deleteOptionsRef.current && !deleteOptionsRef.current.contains(event.target as Node)) {
        setShowDeleteOptions(false);
      }
      if (reactionsRef.current && !reactionsRef.current.contains(event.target as Node)) {
        setShowReactions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleAddReaction = (emoji: string) => {
    onReaction(message.id, emoji);
  };

  const handleRemoveReaction = async (emoji: string) => {
    try {
      await chatService.removeReaction(message.id, currentUserId);
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Failed to remove reaction');
    }
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
    if (!message.reactions || Object.keys(message.reactions).length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(
          message.reactions.reduce((acc: { [key: string]: ReactionData }, reaction: Reaction) => {
            if (!acc[reaction.emoji]) {
              acc[reaction.emoji] = { userIds: [], users: [] };
            }
            acc[reaction.emoji].userIds.push(reaction.userId);
            acc[reaction.emoji].users.push(`User ${reaction.userId.slice(-4)}`);
            return acc;
          }, {})
        ).map(([emoji, data]) => {
          const reactionData = data as ReactionData;
          return (
            <div
              key={emoji}
              className="group relative inline-block"
            >
              <div
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs cursor-pointer ${
                  reactionData.userIds.includes(currentUserId)
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (reactionData.userIds.includes(currentUserId)) {
                    handleRemoveReaction(emoji);
                  }
                }}
              >
                <span>{emoji}</span>
                {reactionData.userIds.length > 1 && (
                  <span className="text-[10px] font-medium">{reactionData.userIds.length}</span>
                )}
              </div>
              {/* Tooltip showing who reacted */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                  {reactionData.users.join(', ')}
                </div>
                <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
              </div>
            </div>
          );
        })}
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

  const renderReplyContent = () => {
    if (!message.replyTo) return null;

    return (
      <div className="mb-1 text-sm text-gray-500 border-l-2 border-gray-300 pl-2">
        <div className="font-medium">{message.replyTo.senderId === currentUserId ? 'You' : message.replyTo.senderName}</div>
        <div className="truncate">{message.replyTo.content}</div>
      </div>
    );
  };

  const renderMessageContent = () => {
    if (message.isDeleted) {
      return (
        <div className="relative">
          <p className="text-sm pr-8 text-gray-500 italic">This message was deleted</p>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="relative">
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEdit();
              } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedContent(message.content);
              }
            }}
            className="w-full p-1 text-sm border rounded"
            autoFocus
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <p className="text-sm pr-8">{message.content}</p>
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-1" ref={reactionsRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReactions(!showReactions);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <span>Reactions</span>
              <span className="text-gray-400">•</span>
              <span>{message.reactions.length}</span>
            </button>
            {showReactions && (
              <div className="absolute mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                {Object.entries(
                  message.reactions.reduce((acc: { [key: string]: ReactionData }, reaction: Reaction) => {
                    if (!acc[reaction.emoji]) {
                      acc[reaction.emoji] = { userIds: [], users: [] };
                    }
                    acc[reaction.emoji].userIds.push(reaction.userId);
                    acc[reaction.emoji].users.push(`User ${reaction.userId.slice(-4)}`);
                    return acc;
                  }, {})
                ).map(([emoji, data]) => {
                  const reactionData = data as ReactionData;
                  return (
                    <div key={emoji} className="flex items-center gap-2 py-1">
                      <span className="text-lg">{emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm text-gray-700">{reactionData.users.join(', ')}</div>
                      </div>
                      {reactionData.userIds.includes(currentUserId) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveReaction(emoji);
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* Add reaction button */}
        <div className="absolute right-0 top-0 hidden group-hover:flex items-center">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="Add reaction"
            >
              <FiSmile className="w-4 h-4" />
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                styles={styles}
                show={showEmojiPicker}
                onEmojiSelect={(emoji) => {
                  handleAddReaction(emoji);
                  setShowEmojiPicker(false);
                }}
                onClose={() => setShowEmojiPicker(false)}
                position={message.senderId === currentUserId ? 'top' : 'bottom'}
              />
            )}
          </div>
        </div>
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
          className={`relative max-w-[70%] rounded-lg px-3 py-2 ${
            message.senderId === currentUserId 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
          }`}
        >
          {renderForwardedFrom()}
          {renderReplyTo()}
          {renderMessageContent()}
          
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
            <div ref={menuRef} className="absolute top-8 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
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
                  onReply(message);
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
            </div>
          )}

          {/* Delete Options */}
          {showDeleteOptions && (
            <div ref={deleteOptionsRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm w-full mx-4">
                <h3 className="text-lg font-medium mb-4">Delete Message</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleDelete(false)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Delete for me
                  </button>
                  {message.senderId === currentUserId && (
                    <button
                      onClick={() => handleDelete(true)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
                    >
                      Delete for everyone
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};