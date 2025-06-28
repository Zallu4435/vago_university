import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaHandPaper, FaSmile, FaPhoneSlash, FaDesktop } from 'react-icons/fa';

interface ControlBarProps {
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleHand: () => void;
  onSendReaction: (emoji: string) => void;
  onLeave: () => void;
  onShareScreen?: () => void;
  micOn: boolean;
  cameraOn: boolean;
  handRaised: boolean;
}

const reactions = ['👍', '😂', '👏', '❤️', '🎉'];

export const ControlBar: React.FC<ControlBarProps> = ({
  onToggleMic,
  onToggleCamera,
  onToggleHand,
  onSendReaction,
  onLeave,
  onShareScreen,
  micOn,
  cameraOn,
  handRaised,
}) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center items-center bg-black bg-opacity-80 py-3 z-20 gap-4">
      <button
        className={`p-3 rounded-full ${micOn ? 'bg-gray-700' : 'bg-red-600'} text-white hover:scale-110 transition`}
        onClick={onToggleMic}
        aria-label="Toggle microphone"
      >
        {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>
      <button
        className={`p-3 rounded-full ${cameraOn ? 'bg-gray-700' : 'bg-red-600'} text-white hover:scale-110 transition`}
        onClick={onToggleCamera}
        aria-label="Toggle camera"
      >
        {cameraOn ? <FaVideo /> : <FaVideoSlash />}
      </button>
      <button
        className={`p-3 rounded-full ${handRaised ? 'bg-yellow-400' : 'bg-gray-700'} text-white hover:scale-110 transition`}
        onClick={onToggleHand}
        aria-label="Raise hand"
      >
        <FaHandPaper />
      </button>
      <div className="relative">
        <button
          className="p-3 rounded-full bg-gray-700 text-white hover:scale-110 transition"
          onClick={() => setShowReactions((v) => !v)}
          aria-label="Send reaction"
        >
          <FaSmile />
        </button>
        {showReactions && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white rounded shadow flex gap-2 p-2 z-30">
            {reactions.map((emoji) => (
              <button
                key={emoji}
                className="text-2xl hover:scale-125 transition"
                onClick={() => {
                  onSendReaction(emoji);
                  setShowReactions(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      {onShareScreen && (
        <button
          className="p-3 rounded-full bg-gray-700 text-white hover:scale-110 transition"
          onClick={onShareScreen}
          aria-label="Share screen"
        >
          <FaDesktop />
        </button>
      )}
      <button
        className="p-3 rounded-full bg-red-600 text-white hover:scale-110 transition"
        onClick={onLeave}
        aria-label="Leave call"
      >
        <FaPhoneSlash />
      </button>
    </div>
  );
}; 