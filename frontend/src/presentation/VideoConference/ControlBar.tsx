import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaHandPaper, FaSmile, FaPhoneSlash, FaDesktop, FaCommentDots, FaUsers, FaCog, FaEllipsisH } from 'react-icons/fa';

interface ControlBarProps {
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleHand: () => void;
  onSendReaction: (emoji: string) => void;
  onLeave: () => void;
  onShareScreen: () => void;
  onToggleChat: () => void;
  onToggleOthers: () => void;
  micOn: boolean;
  cameraOn: boolean;
  handRaised: boolean;
}

const reactions = ['😊', '👍', '👏', '❤️', '😂', '🎉', '😮', '🤔'];

export const ControlBar: React.FC<ControlBarProps> = ({
  onToggleMic,
  onToggleCamera,
  onToggleHand,
  onSendReaction,
  onLeave,
  onShareScreen,
  onToggleChat,
  onToggleOthers,
  micOn,
  cameraOn,
  handRaised,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Determine if mobile (tailwind: <640px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close more modal
  React.useEffect(() => {
    if (showMore) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.more-modal') && !target.closest('.more-button')) {
          setShowMore(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMore]);

  return (
    <>
      {/* More Modal - Fixed position on right side */}
      {isMobile && showMore && (
        <div className="fixed bottom-24 right-4 bg-white rounded-xl shadow-2xl p-4 min-w-[200px] z-50 more-modal">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { onToggleHand(); setShowMore(false); }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${handRaised ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100'}`}
            >
              <FaHandPaper className="w-5 h-5" />
              <span className="font-medium">Raise Hand</span>
            </button>
            <button
              onClick={() => { onShareScreen(); setShowMore(false); }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaDesktop className="w-5 h-5" />
              <span className="font-medium">Share Screen</span>
            </button>
            <button
              onClick={() => { setShowReactions(!showReactions); setShowMore(false); }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaSmile className="w-5 h-5" />
              <span className="font-medium">Reactions</span>
            </button>
            <button 
              onClick={() => { onToggleChat(); setShowMore(false); }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaCommentDots className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </button>
            <button 
              onClick={() => { onToggleOthers(); setShowMore(false); }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaUsers className="w-5 h-5" />
              <span className="font-medium">Participants</span>
            </button>
            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <FaCog className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 px-6 py-4 z-50">
        {/* Reactions popover for mobile - shown above control bar */}
        {isMobile && showReactions && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white rounded-xl shadow-2xl p-3 flex gap-2 min-w-[200px] z-50">
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSendReaction(emoji);
                  setShowReactions(false);
                }}
                className="text-2xl p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center max-w-6xl mx-auto">
          {/* Center - Main Controls */}
          {/* On mobile only (< 640px), center the main 3 controls, put ellipsis to the right */}
          {isMobile ? (
            <div className="flex items-center gap-3 relative">
              <button
                onClick={onToggleMic}
                className={`p-4 rounded-full transition-all duration-200 ${
                  micOn 
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {micOn ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onToggleCamera}
                className={`p-4 rounded-full transition-all duration-200 ${
                  cameraOn 
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {cameraOn ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onLeave}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
              >
                <FaPhoneSlash className="w-5 h-5" />
              </button>
              {/* More button */}
              <button
                onClick={() => setShowMore((v) => !v)}
                className="p-4 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200 more-button"
                aria-label="More controls"
              >
                <FaEllipsisH className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // All other breakpoints (640px and above): full layout with all controls
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleMic}
                className={`p-4 rounded-full transition-all duration-200 ${
                  micOn 
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {micOn ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onToggleCamera}
                className={`p-4 rounded-full transition-all duration-200 ${
                  cameraOn 
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {cameraOn ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onShareScreen}
                className="p-4 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200"
              >
                <FaDesktop className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-4 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200"
                >
                  <FaSmile className="w-5 h-5" />
                </button>
                {showReactions && (
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl p-3 flex gap-2">
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onSendReaction(emoji);
                          setShowReactions(false);
                        }}
                        className="text-2xl p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onToggleHand}
                className={`p-4 rounded-full transition-all duration-200 ${
                  handRaised 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-gray-700/80 hover:bg-gray-600/80 text-white'
                }`}
              >
                <FaHandPaper className="w-5 h-5" />
              </button>
              <button
                onClick={onLeave}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
              >
                <FaPhoneSlash className="w-5 h-5" />
              </button>
              <button 
                onClick={onToggleChat}
                className="p-3 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200"
              >
                <FaCommentDots className="w-4 h-4" />
              </button>
              <button 
                onClick={onToggleOthers}
                className="p-3 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200"
              >
                <FaUsers className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200">
                <FaCog className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 