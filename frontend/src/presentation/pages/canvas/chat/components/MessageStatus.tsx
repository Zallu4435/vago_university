import React from 'react';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';
import { MessageStatusProps } from '../../../../../domain/types/canvas/chat';

export const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  switch (status) {
    case 'sending':
      return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
    case 'delivered':
      return <FiCheck className="w-3 h-3 text-gray-400" />;
    case 'read':
      return <FiCheckCircle className="w-3 h-3 text-blue-500" />;
    default:
      return null;
  }
}; 