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
    <div className={`relative ${styles.backgroundSecondary} rounded-2xl overflow-hidden aspect-video w-full max-w-2xl mx-auto mb-4 sm:mb-6 group`}>
      {/* Video placeholder */}
      <div className={`absolute inset-0 ${styles.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 ${styles.borderSecondary} flex items-center justify-center mb-2 sm:mb-4 mx-auto transition-all duration-300 ${
            isPlaying ? styles.backgroundSecondary : `${styles.button.secondary} hover:${styles.backgroundSecondary} cursor-pointer`
          }`} onClick={onPlayPause}>
            {isPlaying ? (
              <FiPause className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.textPrimary}`} />
            ) : (
              <FiPlay className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.textPrimary} ml-1`} />
            )}
          </div>
          <p className={`${styles.textSecondary} text-xs sm:text-sm`}>
            {isPlaying ? 'Playing...' : 'Click to play video'}
          </p>
        </div>
      </div>

      {/* Video controls */}
      <div className={`absolute bottom-0 left-0 right-0 ${styles.backgroundSecondary} p-2 sm:p-4 transition-opacity duration-300 ${
        isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        {/* Progress bar */}
        <div className={`w-full ${styles.progress.background} rounded-full h-1 mb-2 sm:mb-3`}>
          <div
            className={`h-1 rounded-full ${styles.progress.fill} transition-all duration-300`}
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={onPlayPause} className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              {isPlaying ? <FiPause className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiPlay className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiSkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiVolume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className={`${styles.textSecondary} text-xs sm:text-sm`}>
              {Math.floor(videoProgress * 0.45)}/45:00
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiSettings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiMaximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 