import React, { useEffect } from 'react';
import { FiPlay, FiVideo } from 'react-icons/fi';
import { IoCloseOutline as X } from 'react-icons/io5';

interface Video {
  id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: string;
  courseId: string;
  description: string;
}

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ isOpen, onClose, video }) => {
  // Prevent backend scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-3xl max-h-[80vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center text-xl shadow-lg border border-purple-500/30">
                <FiVideo />
              </div>
              <div>
                <h2 className="text-sm font-bold text-purple-100">Video Preview: {video.title}</h2>
                <p className="text-purple-300 text-xs">View video details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={20} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-120px)] custom-scrollbar">
          <div className="bg-gray-900 rounded-lg aspect-[16/9] h-40 flex items-center justify-center">
            <FiPlay className="h-12 w-12 text-purple-400 opacity-75" />
          </div>
          <div className="space-y-2 text-xs text-purple-300">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Duration:</span>
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Module:</span>
              <span>{video.module}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs inline-flex items-center ${
                  video.status === 'Published'
                    ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                }`}
              >
                <span
                  className="h-1 w-1 rounded-full mr-1"
                  style={{ boxShadow: `0 0 6px currentColor`, backgroundColor: 'currentColor' }}
                ></span>
                {video.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Uploaded:</span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
          {video.description && (
            <div>
              <span className="font-medium text-white text-xs">Description:</span>
              <p className="mt-1 text-purple-300 text-xs max-h-20 overflow-y-auto custom-scrollbar">
                {video.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default VideoPreviewModal;