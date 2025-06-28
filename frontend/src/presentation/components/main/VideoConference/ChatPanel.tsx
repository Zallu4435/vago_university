import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSend: (msg: string) => void;
  selfUser: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose, messages, onSend, selfUser }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-30 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-semibold">Chat</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[calc(100%-112px)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user === selfUser ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-500">{msg.user} • {msg.timestamp}</span>
            <span className={`px-3 py-2 rounded-lg ${msg.user === selfUser ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-900'}`}>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}; 