import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import { ChatPanelProps } from '../../../domain/types/videoConference';

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, messages, onSend }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-[calc(100vh-96px)] w-80 bg-white shadow-2xl transform transition-transform duration-300 z-30 flex flex-col ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <FaCommentDots className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Messages</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <FaCommentDots className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                  {msg.user.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900 truncate">{msg.user}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{msg.timestamp}</span>
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-sm p-3 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send a message to everyone"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              newMessage.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}; 