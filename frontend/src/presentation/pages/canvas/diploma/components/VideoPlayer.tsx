import React from 'react';
import { FiPlay, FiPause, FiSkipForward, FiVolume2, FiSettings, FiMaximize2 } from 'react-icons/fi';
import { VideoPlayerProps } from '../../../../../domain/types/canvas/diploma';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  styles,
  isPlaying,
  videoProgress,
  onPlayPause
}) => {
  return (
    <div className={`relative ${styles.backgroundSecondary} rounded-2xl overflow-hidden aspect-video w-full max-w-4xl mx-auto mb-6 group`}>
      {/* Video placeholder */}
      <div className={`absolute inset-0 ${styles.background} flex items-center justify-center`}>
        <div className="text-center">
          <div 
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${styles.borderSecondary} flex items-center justify-center mb-4 mx-auto transition-all duration-300 cursor-pointer hover:scale-110 hover:${styles.border} ${
              isPlaying 
                ? `${styles.backgroundSecondary} ${styles.border}` 
                : `${styles.button?.secondary} hover:${styles.backgroundSecondary}`
            }`} 
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <FiPause className={`w-8 h-8 sm:w-10 sm:h-10 ${styles.textPrimary}`} />
            ) : (
              <FiPlay className={`w-8 h-8 sm:w-10 sm:h-10 ${styles.textPrimary} ml-1`} />
            )}
          </div>
          <p className={`${styles.textSecondary} text-sm sm:text-base font-medium`}>
            {isPlaying ? 'Video is playing...' : 'Click to start video'}
          </p>
        </div>
      </div>

      {/* Video controls overlay */}
      <div className={`absolute bottom-0 left-0 right-0 ${styles.backgroundSecondary} bg-opacity-90 p-4 sm:p-6 transition-opacity duration-300 ${
        isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        {/* Progress bar */}
        <div className={`w-full ${styles.progress?.background || 'bg-gray-200'} rounded-full h-2 mb-4`}>
          <div
            className={`h-2 rounded-full ${styles.progress?.fill || 'bg-blue-500'} transition-all duration-300 shadow-lg`}
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onPlayPause} 
              className={`p-2 rounded-lg ${styles.button?.secondary} hover:${styles.button?.primary} transition-colors duration-200 ${styles.textPrimary} hover:scale-110`}
            >
              {isPlaying ? (
                <FiPause className="w-5 h-5" />
              ) : (
                <FiPlay className="w-5 h-5" />
              )}
            </button>
            
            <button className={`p-2 rounded-lg ${styles.button?.secondary} hover:${styles.button?.primary} transition-colors duration-200 ${styles.textPrimary} hover:scale-110`}>
              <FiSkipForward className="w-5 h-5" />
            </button>
            
            <button className={`p-2 rounded-lg ${styles.button?.secondary} hover:${styles.button?.primary} transition-colors duration-200 ${styles.textPrimary} hover:scale-110`}>
              <FiVolume2 className="w-5 h-5" />
            </button>
            
            <span className={`${styles.textSecondary} text-sm font-medium px-3 py-1 ${styles.badgeBackground || styles.background} rounded-lg`}>
              {Math.floor(videoProgress * 0.45)}:00 / 45:00
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-lg ${styles.button?.secondary} hover:${styles.button?.primary} transition-colors duration-200 ${styles.textPrimary} hover:scale-110`}>
              <FiSettings className="w-5 h-5" />
            </button>
            
            <button className={`p-2 rounded-lg ${styles.button?.secondary} hover:${styles.button?.primary} transition-colors duration-200 ${styles.textPrimary} hover:scale-110`}>
              <FiMaximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 