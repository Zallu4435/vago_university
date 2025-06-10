import React, { useEffect, useRef } from 'react';
import { Styles } from '../types/ChatTypes';

interface EmojiPickerProps {
  styles: Styles;
  show: boolean;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '👏', '🙌', '🤔', '😎'];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  styles,
  show,
  onEmojiSelect,
  onClose
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
      className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg border ${styles.border} ${styles.background} z-50`}
    >
      <div className="grid grid-cols-5 gap-1">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles.button.secondary}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}; 