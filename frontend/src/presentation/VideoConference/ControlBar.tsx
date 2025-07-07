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

const reactions = ['😊', '👍', '👏', '❤️', '😂', '🎉', '😮', '🤔', '👌', '🔥', '💯', '🎯'];

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  React.useEffect(() => {
    if (showReactions) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.reactions-modal') && !target.closest('.reactions-button')) {
          setShowReactions(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showReactions]);

  const handleReactionClick = (emoji: string) => {
    onSendReaction(emoji);
    setShowReactions(false);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleHandRaise = () => {
    onToggleHand();

    if (navigator.vibrate) {
      navigator.vibrate(handRaised ? 100 : [50, 50, 50]);
    }
  };

  return (
    <>
      {isMobile && showMore && (
        <div className="fixed bottom-24 right-4 bg-white rounded-xl shadow-2xl p-4 min-w-[200px] z-50 more-modal">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { handleHandRaise(); setShowMore(false); }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${handRaised
                  ? 'bg-yellow-100 text-yellow-700 shadow-md transform scale-105'
                  : 'hover:bg-gray-100'
                }`}
            >
              <FaHandPaper className={`w-5 h-5 ${handRaised ? 'animate-pulse' : ''}`} />
              <span className="font-medium">
                {handRaised ? 'Lower Hand' : 'Raise Hand'}
              </span>
              {handRaised && (
                <span className="ml-auto text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                  Active
                </span>
              )}
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
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors reactions-button"
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
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-white rounded-xl shadow-2xl p-4 min-w-[300px] z-50 reactions-modal">

            <div className="flex gap-2">
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="text-2xl p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center max-w-6xl mx-auto">
          {/* Center - Main Controls */}
          {/* On mobile only (< 640px), center the main 3 controls, put ellipsis to the right */}
          {isMobile ? (
            <div className="flex items-center gap-3 relative">
              <button
                onClick={onToggleMic}
                className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${micOn
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white shadow-lg'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                  }`}
              >
                {micOn ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onToggleCamera}
                className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${cameraOn
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white shadow-lg'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                  }`}
              >
                {cameraOn ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onLeave}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <FaPhoneSlash className="w-5 h-5" />
              </button>
              {/* More button */}
              <button
                onClick={() => setShowMore((v) => !v)}
                className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 more-button shadow-lg ${showMore
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-700/80 hover:bg-gray-600/80 text-white'
                  }`}
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
                className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${micOn
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white shadow-lg'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                  }`}
              >
                {micOn ? <FaMicrophone className="w-5 h-5" /> : <FaMicrophoneSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onToggleCamera}
                className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${cameraOn
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white shadow-lg'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                  }`}
              >
                {cameraOn ? <FaVideo className="w-5 h-5" /> : <FaVideoSlash className="w-5 h-5" />}
              </button>
              <button
                onClick={onShareScreen}
                className="p-4 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <FaDesktop className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 reactions-button shadow-lg ${showReactions
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-700/80 hover:bg-gray-600/80 text-white'
                    }`}
                >
                  <FaSmile className="w-5 h-5" />
                </button>
                {showReactions && (
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl p-4 reactions-modal">
                    <div className="text-center text-sm text-gray-600 mb-3 font-medium">
                      Send a reaction
                    </div>
                    <div className="flex gap-2">
                      {reactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReactionClick(emoji)}
                          className="text-2xl p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleHandRaise}
                className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${handRaised
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse'
                    : 'bg-gray-700/80 hover:bg-gray-600/80 text-white'
                  }`}
              >
                <FaHandPaper className={`w-5 h-5 ${handRaised ? 'animate-bounce' : ''}`} />
              </button>
              <button
                onClick={onLeave}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <FaPhoneSlash className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleChat}
                className="p-3 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <FaCommentDots className="w-4 h-4" />
              </button>
              <button
                onClick={onToggleOthers}
                className="p-3 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <FaUsers className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-full bg-gray-700/80 hover:bg-gray-600/80 text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
                <FaCog className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};