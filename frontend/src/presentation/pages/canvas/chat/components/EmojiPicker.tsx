import React, { useEffect, useRef } from 'react';
import { Styles } from '../types/ChatTypes';

interface EmojiPickerProps {
  styles: Styles;
  show: boolean;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

const EMOJIS = [
  '😊', '😂', '❤️', '👍', '🎉', '🔥', '👏', '🙌', '🤔', '😎',
  '😍', '🥰', '😘', '😋', '🤣', '😅', '😭', '😢', '😡', '😤',
  '😴', '🤗', '🤫', '🤐', '🤯', '😱', '😨', '😰', '😥', '😓',
  '🤩', '🤪', '😇', '🥳', '😎', '🤓', '🧐', '😕', '🤨', '😐'
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  styles,
  show,
  onEmojiSelect,
  onClose,
  position = 'top'
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1.5 z-50"
      style={{
        width: '200px',
        [position === 'top' ? 'bottom' : 'top']: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: position === 'bottom' ? '4px' : '0',
        marginBottom: position === 'top' ? '4px' : '0'
      }}
    >
      <div className="grid grid-cols-8 gap-0.5">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-base"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}; 