import React, { useState, useRef, useEffect } from 'react';
import { 
  FiSearch, FiMoreVertical, FiSmile, FiPaperclip, FiSend, FiPhone, FiVideo, 
  FiCamera, FiImage, FiX, FiRotateCw, FiCrop, FiDownload, FiArrowLeft,
  FiMic, FiPlus, FiHeart, FiThumbsUp, FiCheck, FiCheckCircle , FiUsers,
  FiSettings, FiMoon, FiSun, FiBell, FiArchive
} from 'react-icons/fi';

const ChatInterface = () => {
  // Enhanced state management
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set([1, 3, 4]));

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How's your day going? 😊", sent: false, time: "10:30 AM", type: 'text', status: 'read', reactions: [] },
    { id: 2, text: "Pretty good! Just finished the project presentation. How about you?", sent: true, time: "10:32 AM", type: 'text', status: 'read', reactions: [] },
    { id: 3, text: "That's awesome! I'd love to hear about it sometime. 🎉", sent: false, time: "10:35 AM", type: 'text', status: 'read', reactions: ['👍'] },
    { id: 4, text: "Definitely! Let's catch up over coffee this weekend?", sent: true, time: "10:36 AM", type: 'text', status: 'delivered', reactions: [] },
    { id: 5, text: "Sounds perfect! I know a great new place downtown. ☕", sent: false, time: "10:38 AM", type: 'text', status: 'read', reactions: ['❤️'] }
  ]);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const chats = [
    {
      id: 1,
      name: "Sarah Wilson",
      lastMessage: "Sounds perfect! I know a great new place downtown.",
      time: "10:38 AM",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      online: true,
      unread: 0,
      typing: false
    },
    {
      id: 2,
      name: "Design Team",
      lastMessage: "The new mockups look fantastic!",
      time: "9:45 AM",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=face",
      online: false,
      unread: 3,
      typing: false,
      isGroup: true
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "Thanks for the help with the code review",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      online: true,
      unread: 0,
      typing: false
    },
    {
      id: 4,
      name: "Marketing Group",
      lastMessage: "Campaign results are in - great success!",
      time: "Monday",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      online: true,
      unread: 1,
      typing: false,
      isGroup: true
    }
  ];

  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '☕', '🚀'];

  // Dynamic styles based on theme
  const getStyles = () => ({
    background: isDarkMode ? 'bg-gray-900' : 'bg-white',
    backgroundSecondary: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    card: {
      background: isDarkMode ? 'bg-gray-800' : 'bg-white',
      hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
    },
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-500' : 'text-gray-400'
    },
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderSecondary: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    input: {
      background: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
      border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
      focus: isDarkMode ? 'focus:border-blue-500' : 'focus:border-blue-400'
    },
    button: {
      primary: isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
    },
    message: {
      sent: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
      received: isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
    },
    accent: isDarkMode ? 'from-blue-600 to-purple-600' : 'from-blue-400 to-purple-500'
  });

  const styles = getStyles();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sending',
        reactions: []
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Simulate typing indicator for other user
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    }
    
    // Clear existing timeout and set new one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const addReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingIndex = reactions.indexOf(emoji);
        if (existingIndex > -1) {
          reactions.splice(existingIndex, 1);
        } else {
          reactions.push(emoji);
        }
        return { ...msg, reactions: [...reactions] };
      }
      return msg;
    }));
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MessageStatus = ({ status }) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'delivered':
        return <FiCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <FiCheckCircle  className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className={`max-w-xs rounded-2xl ${styles.message.received} rounded-bl-md px-4 py-3`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );

  const EmojiPicker = () => {
    if (!showEmojiPicker) return null;

    return (
      <div className={`absolute bottom-12 right-16 ${styles.card.background} rounded-xl shadow-lg border ${styles.border} p-3 z-20`}>
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                setMessage(prev => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const AttachmentMenu = () => {
    if (!showAttachmentMenu) return null;

    return (
      <div className={`absolute bottom-12 left-0 ${styles.card.background} rounded-xl shadow-lg border ${styles.border} p-2 z-10 min-w-48`}>
        <button
          onClick={() => {
            fileInputRef.current?.click();
            setShowAttachmentMenu(false);
          }}
          className={`flex items-center space-x-3 w-full p-3 ${styles.card.hover} rounded-lg transition-colors text-left`}
        >
          <div className={`p-2 bg-blue-100 dark:bg-blue-900 rounded-full`}>
            <FiImage className="w-4 h-4 text-blue-600" />
          </div>
          <span className={`text-sm font-medium ${styles.text.primary}`}>Photos & Videos</span>
        </button>

        <button
          onClick={() => {
            cameraInputRef.current?.click();
            setShowAttachmentMenu(false);
          }}
          className={`flex items-center space-x-3 w-full p-3 ${styles.card.hover} rounded-lg transition-colors text-left`}
        >
          <div className={`p-2 bg-green-100 dark:bg-green-900 rounded-full`}>
            <FiCamera className="w-4 h-4 text-green-600" />
          </div>
          <span className={`text-sm font-medium ${styles.text.primary}`}>Camera</span>
        </button>

        <button
          className={`flex items-center space-x-3 w-full p-3 ${styles.card.hover} rounded-lg transition-colors text-left`}
        >
          <div className={`p-2 bg-purple-100 dark:bg-purple-900 rounded-full`}>
            <FiMic className="w-4 h-4 text-purple-600" />
          </div>
          <span className={`text-sm font-medium ${styles.text.primary}`}>Voice Message</span>
        </button>
      </div>
    );
  };

  return (
    <div className={`flex h-screen ${styles.background} transition-colors duration-300`}>
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" />

      {/* Sidebar */}
      <div className={`w-full md:w-2/5 ${styles.backgroundSecondary} border-r ${styles.border} flex flex-col transition-colors duration-300 ${selectedChat !== null ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className={`p-4 border-b ${styles.border}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-xl font-bold ${styles.text.primary}`}>Messages</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 ${styles.card.hover} rounded-full transition-colors`}
              >
                {isDarkMode ? <FiSun className={`${styles.text.primary} w-5 h-5`} /> : <FiMoon className={`${styles.text.primary} w-5 h-5`} />}
              </button>
              <button className={`p-2 ${styles.card.hover} rounded-full transition-colors`}>
                <FiSettings className={`${styles.text.primary} w-5 h-5`} />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.text.secondary} w-4 h-4`} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${styles.input.background} border ${styles.input.border} rounded-xl text-sm focus:outline-none ${styles.input.focus} transition-colors`}
            />
          </div>
        </div>

        {/* Online Users */}
        <div className="p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {chats.filter(chat => chat.online).map((chat) => (
              <div key={chat.id} className="flex flex-col items-center space-y-1 min-w-0">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <span className={`text-xs ${styles.text.secondary} truncate w-16 text-center`}>
                  {chat.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(index)}
              className={`p-4 cursor-pointer ${styles.card.hover} transition-all duration-200 border-l-4 ${
                selectedChat === index 
                  ? `border-l-blue-500 ${styles.card.background}` 
                  : 'border-l-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                  {chat.isGroup && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUsers className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${styles.text.primary} text-sm truncate`}>
                      {chat.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${styles.text.secondary} flex-shrink-0`}>
                        {chat.time}
                      </span>
                      {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {chat.unread > 9 ? '9+' : chat.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs ${styles.text.secondary} mt-1 truncate`}>
                    {chat.typing ? (
                      <span className="text-blue-500 italic">Typing...</span>
                    ) : (
                      chat.lastMessage
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${selectedChat !== null ? 'flex' : 'hidden md:flex'}`}>
        {selectedChat !== null ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b ${styles.border} ${styles.card.background}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    className="md:hidden p-2 rounded-lg"
                    onClick={() => setSelectedChat(null)}
                  >
                    <FiArrowLeft className={`${styles.text.primary} w-5 h-5`} />
                  </button>
                  <div className="relative">
                    <img
                      src={chats[selectedChat].avatar}
                      alt={chats[selectedChat].name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {chats[selectedChat].online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h2 className={`font-semibold ${styles.text.primary} text-sm`}>
                      {chats[selectedChat].name}
                    </h2>
                    <p className={`text-xs ${chats[selectedChat].online ? 'text-green-500' : styles.text.secondary}`}>
                      {chats[selectedChat].online ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 ${styles.text.primary} ${styles.card.hover} rounded-lg transition-colors`}>
                    <FiPhone className="w-4 h-4" />
                  </button>
                  <button className={`p-2 ${styles.text.primary} ${styles.card.hover} rounded-lg transition-colors`}>
                    <FiVideo className="w-4 h-4" />
                  </button>
                  <button className={`p-2 ${styles.text.primary} ${styles.card.hover} rounded-lg transition-colors`}>
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-auto p-4 space-y-4 ${styles.backgroundSecondary}`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`max-w-[70%] md:max-w-xs lg:max-w-md`}>
                    <div
                      className={`rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        msg.sent
                          ? `${styles.message.sent} rounded-br-md`
                          : `${styles.message.received} rounded-bl-md`
                      }`}
                    >
                      {msg.type === 'image' ? (
                        <div className="p-1">
                          <img
                            src={msg.imageUrl}
                            alt={msg.imageName}
                            className="w-full rounded-xl max-w-64 cursor-pointer hover:opacity-90 transition-opacity"
                          />
                          {msg.text && (
                            <div className="px-3 pb-2 pt-1">
                              <p className="text-sm">{msg.text}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-3">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Message reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex space-x-1 mt-1 px-2">
                        {msg.reactions.map((reaction, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 ${styles.card.background} rounded-full border ${styles.border} cursor-pointer hover:scale-110 transition-transform`}
                            onClick={() => addReaction(msg.id, reaction)}
                          >
                            {reaction}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Time and status */}
                    <div className={`flex items-center justify-between mt-1 px-2 ${msg.sent ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-xs ${styles.text.muted}`}>{msg.time}</span>
                      {msg.sent && (
                        <div className="ml-2">
                          <MessageStatus status={msg.status} />
                        </div>
                      )}
                    </div>
                    
                    {/* Quick reactions (show on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                      <div className="flex space-x-1 justify-center">
                        {['👍', '❤️', '😂', '😮', '😢'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(msg.id, emoji)}
                            className={`w-6 h-6 ${styles.card.background} border ${styles.border} rounded-full text-xs hover:scale-125 transition-transform flex items-center justify-center`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${styles.border} ${styles.card.background} relative`}>
              <AttachmentMenu />
              <EmojiPicker />
              
              <div className="flex items-end space-x-3">
                <button
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className={`p-3 ${styles.text.primary} ${styles.card.hover} rounded-full transition-colors`}
                >
                  <FiPaperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className={`w-full px-4 py-3 ${styles.input.background} border ${styles.input.border} rounded-2xl text-sm focus:outline-none ${styles.input.focus} resize-none transition-colors`}
                    style={{ maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-3 ${styles.text.primary} ${styles.card.hover} rounded-full transition-colors`}
                >
                  <FiSmile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    message.trim() 
                      ? `${styles.button.primary} shadow-lg hover:shadow-xl transform hover:scale-105` 
                      : `${styles.button.secondary} cursor-not-allowed`
                  }`}
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Welcome screen
          <div className={`flex-1 flex items-center justify-center ${styles.backgroundSecondary}`}>
            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${styles.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <FiSend className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${styles.text.primary} mb-2`}>
                Welcome to Chat
              </h2>
              <p className={`${styles.text.secondary} max-w-md`}>
                Select a conversation from the sidebar to start messaging, or create a new chat to connect with friends.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;