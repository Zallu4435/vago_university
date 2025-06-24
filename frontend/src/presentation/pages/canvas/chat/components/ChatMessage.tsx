import React, { useState, useRef, useEffect, ForwardedRef } from 'react';
import { Message, Styles } from '../types/ChatTypes';
import { formatMessageTime, shouldShowDateHeader } from '../utils/chatUtils';
import { FiCheck, FiMoreVertical, FiShare2, FiCornerUpLeft, FiSmile, FiFile, FiChevronDown } from 'react-icons/fi';
import { EmojiPicker } from './EmojiPicker';
import { MessageDropdown } from './MessageDropdown';
import { DeleteMessageModal } from './DeleteMessageModal';
import { MessageReactionsModal } from './MessageReactionsModal';
import { ImagePreviewModal } from './ImagePreviewModal';
import { useChatMutations } from '../hooks/useChatMutations';


// Simple time-only formatter for message bubbles
const formatMessageTimeOnly = (date: string | Date): string => {
  const messageDate = new Date(date);
  return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

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
  styles: Styles;
}

const ChatMessageComponent = ({
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
}: ChatMessageProps, ref: ForwardedRef<HTMLDivElement>) => {

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const reactionIconRef = useRef<HTMLDivElement | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  const { editMessage, deleteMessage, forwardMessage, addReaction, removeReaction } = useChatMutations(message.chatId, currentUserId);

  const handleOpenReactionsModal = (event: React.MouseEvent) => {
    // Use the bounding rect of the reaction icon for precise positioning
    const rect = reactionIconRef.current?.getBoundingClientRect();
    if (rect) {
      setModalPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY + 8 // 8px below the icon
      });
    } else {
      setModalPosition({ x: event.clientX, y: event.clientY });
    }
    setShowReactionsModal(true);
  };

  const handleEdit = () => {
    if (editedContent.trim() && editedContent !== message.content) {
      editMessage.mutate({ chatId: message.chatId, messageId: message.id, newContent: editedContent });
    }
    setIsEditing(false);
  };

  const handleAddReaction = (emoji: string) => {
    addReaction.mutate({ messageId: message.id, emoji, userId: currentUserId });
    setShowEmojiPicker(false);
  };

  const handleRemoveReaction = (emoji: string) => {
    removeReaction.mutate({ messageId: message.id, userId: currentUserId });
    setShowReactionsModal(false);
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewImageUrl(imageUrl);
    setShowImagePreview(true);
  };

  const handleDeleteForMe = () => {
    onDelete(message.id, false);
  };

  const handleDeleteForEveryone = () => {
    onDelete(message.id, true);
  };

  const renderStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <FiCheck className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return (
          <>
            <FiCheck className="w-3 h-3 text-gray-400" />
            <FiCheck className="w-3 h-3 -ml-1 text-gray-400" />
          </>
        );
      case 'read':
        return (
          <>
            <FiCheck className="w-3 h-3 text-blue-500" />
            <FiCheck className="w-3 h-3 -ml-1 text-blue-500" />
          </>
        );
      default:
        return null;
    }
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0 || message.isDeleted) return null;

    const isSentMessage = message.senderId === currentUserId;

    // Group reactions by emoji for display
    const groupedReactions = message.reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = { userIds: [], users: [] };
      }
      acc[reaction.emoji].userIds.push(reaction.userId);
      acc[reaction.emoji].users.push(`User ${reaction.userId.slice(-4)}`);
      return acc;
    }, {} as { [key: string]: { userIds: string[], users: string[] } });

    return (
      <div
        ref={reactionIconRef}
        className={`absolute -bottom-2 ${isSentMessage ? 'right-2' : 'left-2'} z-10`}
        onClick={handleOpenReactionsModal}
      >
        <div className="flex flex-wrap gap-1">
          {Object.entries(groupedReactions).map(([emoji, data]) => (
            <div key={emoji} className="group relative inline-block">
              <div
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs cursor-pointer shadow-sm border ${
                  data.userIds.includes(currentUserId)
                    ? 'bg-blue-100 text-blue-600 border-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 dark:bg-[#2a3942] dark:text-gray-300 dark:border-gray-600'
                }`}
              >
                <span>{emoji}</span>
                {data.userIds.length > 1 && (
                  <span className="text-[10px] font-medium">{data.userIds.length}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReplyTo = () => {
    if (!message.replyTo) return null;

    const replyTo = typeof message.replyTo === 'string' 
      ? { id: message.replyTo, content: '', senderId: '', senderName: 'Unknown', type: 'text' as const, createdAt: '' }
      : message.replyTo;

    return (
      <div className="mb-2 p-2 bg-black bg-opacity-10 rounded-lg flex items-start">
        <FiCornerUpLeft className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
          <div className="font-medium text-xs opacity-75 mb-1">
            {replyTo.senderId === currentUserId ? 'You' : replyTo.senderName}
          </div>
          <div className="truncate">{replyTo.content}</div>
        </div>
      </div>
    );
  };

  const renderForwardedFrom = () => {
    if (!message.forwardedFrom) return null;

    return (
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic opacity-75">
        Forwarded from {message.forwardedFrom.chatName}
      </div>
    );
  };

  const renderMediaGrid = () => {
    const imageAttachments = message.attachments?.filter(att => att.type === 'image') || [];
    if (imageAttachments.length === 0) return null;

    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-2', // First image takes full width
      4: 'grid-cols-2',
    };

    const imageClasses = {
      1: 'max-w-sm w-full',
      2: 'w-full max-h-48 object-cover',
      3: 'w-full max-h-48 object-cover',
      4: 'w-full max-h-40 object-cover',
    };

    return (
      <div className="mt-2">
        <div className={`grid ${gridClasses[Math.min(imageAttachments.length, 4) as keyof typeof gridClasses]} gap-1`}>
          {imageAttachments.map((attachment, idx) => {
            // For 3 images, make the first one full width
            const isFullWidth = imageAttachments.length === 3 && idx === 0;
            const gridColumnClass = isFullWidth ? 'col-span-2' : '';

            return (
              <div 
                key={attachment.id || attachment.url} 
                className={`relative group ${gridColumnClass} ${idx >= 4 ? 'hidden' : ''}`}
              >
                <div onClick={(e) => handleImageClick(e, attachment.url)} className="cursor-pointer">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className={`rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                      imageClasses[Math.min(imageAttachments.length, 4) as keyof typeof imageClasses]
                    }`}
                  />
                  {idx === 3 && imageAttachments.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-medium">+{imageAttachments.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Show caption/content below the image grid if present */}
        {message.content && message.content.trim() && (
          <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 break-words px-1">
            {message.content}
          </div>
        )}
      </div>
    );
  };

  const renderMessageContent = () => {
    if (message.isDeleted) {
      return (
        <div className="pr-12 pb-1">
          <p className="text-sm text-gray-500 italic">This message was deleted</p>
          {/* Time and status */}
          <div className="flex items-center justify-end space-x-1 mt-1">
            <span className="text-xs text-gray-400">
              {formatMessageTimeOnly(message.createdAt)}
            </span>
            {message.senderId === currentUserId && (
              <div className="flex items-center">
                {renderStatusIcon()}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="pr-12 pb-1">
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit();
              else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedContent(message.content);
              }
            }}
            className="w-full p-1 text-sm border rounded bg-transparent"
            autoFocus
          />
          {/* Time and status */}
          <div className="flex items-center justify-end space-x-1 mt-1">
            <span className="text-xs text-gray-400">
              {formatMessageTimeOnly(message.createdAt)}
            </span>
            {message.senderId === currentUserId && (
              <div className="flex items-center">
                {renderStatusIcon()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Only show content in the main bubble if there are no image attachments */}
        {!(message.attachments && message.attachments.some(att => att.type === 'image')) && (
          <div className="pr-12 pb-1">
            <p className="text-sm break-words leading-relaxed">{message.content}</p>
          </div>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {/* Render image grid if there are image attachments */}
            {message.attachments.some(att => att.type === 'image') ? (
              renderMediaGrid()
            ) : (
              /* Render other attachment types */
              message.attachments.map((attachment, idx) => {
                switch (attachment.type) {
                  case 'video':
                    return (
                      <div key={attachment.id} className="relative">
                        <video
                          src={attachment.url}
                          controls
                          className="max-w-sm rounded-lg"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  case 'audio':
                    return (
                      <div key={attachment.id} className="relative">
                        <audio
                          src={attachment.url}
                          controls
                          className="w-full"
                        >
                          Your browser does not support the audio tag.
                        </audio>
                      </div>
                    );
                  case 'document':
                    return (
                      <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded-lg">
                        <FiFile className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{(attachment.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <a
                          href={attachment.url}
                          download={attachment.name}
                          className="flex-shrink-0 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    );
                  default:
                    return null;
                }
              })
            )}
          </div>
        )}

        {/* Time and status at bottom right - positioned within the content flow */}
        <div className="flex items-center justify-end space-x-1">
          <span className={`text-xs ${
            isSentMessage 
              ? 'text-white text-opacity-70' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatMessageTimeOnly(message.createdAt)}
          </span>
          {message.senderId === currentUserId && (
            <div className="flex items-center">
              {renderStatusIcon()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const isSentMessage = message.senderId === currentUserId;

  return (
    <div ref={ref}>
      {shouldShowDateHeader(message, previousMessage) && (
        <div className="flex justify-center my-4">
          <div className="px-4 py-1 rounded-full bg-gray-200 dark:bg-[#2a3942] text-sm text-gray-600 dark:text-gray-400">
            {formatMessageTime(message.createdAt)}
          </div>
        </div>
      )}
      
      <div className={`group relative flex mb-4 ${isSentMessage ? 'justify-end' : 'justify-start'}`}>
        {/* Hover actions positioned on the left for sent messages */}
        {isSentMessage && !message.isDeleted && (
          <div className="flex items-center space-x-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => forwardMessage.mutate({ messageId: message.id, targetChatId: '' })}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a3942] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Forward"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a3942] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="React"
            >
              <FiSmile className="w-4 h-4" />
            </button>
          </div>
        )}

          <div className="relative">
          <div
            className={`relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 ${
              isSentMessage
                ? 'bg-[#005c4b] text-white rounded-br-none'
                : 'bg-white dark:bg-[#2a3942] text-gray-900 dark:text-white rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-600'
            }`}
          >
            {/* Spinner overlay while sending */}
            {message.status === 'sending' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded-lg z-10">
                <div className="animate-spin h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full" />
              </div>
            )}

            {/* Tail for message bubble */}
            <div
              className={`absolute w-0 h-0 bottom-0 ${
                isSentMessage
                  ? 'right-0 border-l-[8px] border-l-[#005c4b] border-b-[8px] border-b-transparent'
                  : 'left-0 border-r-[8px] border-r-white dark:border-r-[#2a3942] border-b-[8px] border-b-transparent'
              }`}
            />

            {renderForwardedFrom()}
            {renderReplyTo()}
            {renderMessageContent()}

            {/* WhatsApp-style dropdown arrow button */}
            {!message.isDeleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-full bg-white dark:bg-[#202c33] shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#2a3942]"
                title="More options"
              >
                <FiChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}

            {!message.isDeleted && (
              <MessageDropdown
                message={message}
                currentUserId={currentUserId}
                isVisible={showMenu}
                onClose={() => setShowMenu(false)}
                onReact={() => setShowEmojiPicker(true)}
                onReply={() => onReply(message)}
                onForward={() => forwardMessage.mutate({ messageId: message.id, targetChatId: '' })}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeleteForMe}
                onShowDeleteOptions={() => setShowDeleteOptions(true)}
              />
            )}

            {showEmojiPicker && !message.isDeleted && (
              <EmojiPicker
                styles={styles}
                show={showEmojiPicker}
                onEmojiSelect={handleAddReaction}
                onClose={() => setShowEmojiPicker(false)}
                position={isSentMessage ? 'top' : 'bottom'}
              />
            )}
          </div>

          {/* Reactions positioned below/over the message bubble */}
          {renderReactions()}
        </div>

        {/* Hover actions positioned on the right for received messages */}
        {!isSentMessage && !message.isDeleted && (
          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a3942] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="React"
            >
              <FiSmile className="w-4 h-4" />
            </button>
            <button
              onClick={() => forwardMessage.mutate({ messageId: message.id, targetChatId: '' })}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#2a3942] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Forward"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <DeleteMessageModal
        isVisible={showDeleteOptions}
        isSentMessage={isSentMessage}
        onClose={() => setShowDeleteOptions(false)}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={isSentMessage ? handleDeleteForEveryone : undefined}
      />

      {showImagePreview && (
        <ImagePreviewModal
          imageUrl={previewImageUrl}
          onClose={() => setShowImagePreview(false)}
        />
      )}

      <MessageReactionsModal
        isVisible={showReactionsModal}
        onClose={() => setShowReactionsModal(false)}
        reactions={
          (message.reactions || []).map(reaction => ({
            emoji: reaction.emoji,
            userId: reaction.userId,
            userName: `User ${reaction.userId.slice(-4)}`
          }))
        }
        currentUserId={currentUserId}
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
        position={modalPosition}
      />
    </div>
  );
};

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(ChatMessageComponent);