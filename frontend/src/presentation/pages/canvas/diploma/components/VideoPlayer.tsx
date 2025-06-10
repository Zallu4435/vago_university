import React, { useEffect } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiVolume2, FiSettings, FiMaximize2 } from 'react-icons/fi';

interface VideoPlayerProps {
  styles: any;
  isPlaying: boolean;
  videoProgress: number;
  onPlayPause: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  styles,
  isPlaying,
  videoProgress,
  onPlayPause
}) => {
  return (
    <div className={`relative ${styles.backgroundSecondary} rounded-2xl overflow-hidden aspect-video mb-6 group`}>
      {/* Video placeholder */}
      <div className={`absolute inset-0 ${styles.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full border-4 ${styles.borderSecondary} flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
            isPlaying ? styles.backgroundSecondary : `${styles.button.secondary} hover:${styles.backgroundSecondary} cursor-pointer`
          }`} onClick={onPlayPause}>
            {isPlaying ? (
              <FiPause className={`w-8 h-8 ${styles.textPrimary}`} />
            ) : (
              <FiPlay className={`w-8 h-8 ${styles.textPrimary} ml-1`} />
            )}
          </div>
          <p className={`${styles.textSecondary} text-sm`}>
            {isPlaying ? 'Playing...' : 'Click to play video'}
          </p>
        </div>
      </div>

      {/* Video controls */}
      <div className={`absolute bottom-0 left-0 right-0 ${styles.backgroundSecondary} p-4 transition-opacity duration-300 ${
        isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        {/* Progress bar */}
        <div className={`w-full ${styles.progress.background} rounded-full h-1 mb-3`}>
          <div
            className={`h-1 rounded-full ${styles.progress.fill} transition-all duration-300`}
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onPlayPause} className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
            </button>
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiSkipForward className="w-5 h-5" />
            </button>
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiVolume2 className="w-5 h-5" />
            </button>
            <span className={`${styles.textSecondary} text-sm`}>
              {Math.floor(videoProgress * 0.45)}/45:00
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiSettings className="w-5 h-5" />
            </button>
            <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
              <FiMaximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 