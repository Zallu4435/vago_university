import React from 'react';
import { TypingIndicatorProps } from '../../../../../domain/types/canvas/chat';

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ styles }) => (
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