import { Styles } from '../types/ChatTypes';

export const getStyles = (isDarkMode: boolean): Styles => ({
  background: () => isDarkMode ? 'bg-gray-900' : 'bg-white',
  backgroundSecondary: () => isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
  card: {
    background: () => isDarkMode ? 'bg-gray-800' : 'bg-white',
    hover: () => isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  },
  text: {
    primary: () => isDarkMode ? 'text-white' : 'text-gray-900',
    secondary: () => isDarkMode ? 'text-gray-400' : 'text-gray-600',
    muted: () => isDarkMode ? 'text-gray-500' : 'text-gray-400'
  },
  border: () => isDarkMode ? 'border-gray-700' : 'border-gray-200',
  borderSecondary: () => isDarkMode ? 'border-gray-600' : 'border-gray-300',
  input: {
    background: () => isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    border: () => isDarkMode ? 'border-gray-600' : 'border-gray-300',
    focus: () => isDarkMode ? 'focus:border-blue-500' : 'focus:border-blue-400'
  },
  button: {
    primary: () => isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: () => isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  },
  message: {
    sent: () => isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
    received: () => isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
  },
  accent: () => isDarkMode ? 'from-blue-600 to-purple-600' : 'from-blue-400 to-purple-500'
});

export const formatMessageTime = (date: string | Date): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

  // Today
  if (diffInDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  
  // This week
  if (diffInDays < 7) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }
  
  // This year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }
  
  // Older
  return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatChatTime = (date: string | Date): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

  // Today
  if (diffInDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  
  // This week
  if (diffInDays < 7) {
    return messageDate.toLocaleDateString([], { weekday: 'short' });
  }
  
  // This year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }
  
  // Older
  return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export const shouldShowDateHeader = (currentMessage: any, previousMessage: any): boolean => {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.time);
  const previousDate = new Date(previousMessage.time);
  
  return currentDate.toDateString() !== previousDate.toDateString();
}; 