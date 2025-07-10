import React from 'react';
import { FiLock, FiClock, FiCheckCircle, FiBookmark } from 'react-icons/fi';
import { getChapterTypeIcon, getChapterTypeColor } from '../utils/diplomaUtils';
import { ChapterItemProps } from '../../../../../domain/types/canvas/diploma';

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  courseId,
  styles,
  isFirst,
  isPrevCompleted,
  isCompleted,
  isBookmarked,
  onViewChapter,
  onBookmark
}) => {
  const isAccessible = isFirst || isPrevCompleted;
  const TypeIcon = getChapterTypeIcon(chapter.type);
console.log(chapter, "chapter from chapter")
  return (
    <div 
      className={`group relative ${styles?.card?.background} rounded-2xl ${styles?.cardBorder} transition-all duration-300 ${styles?.cardHover} shadow-sm sm:shadow-md ${
        isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      } w-full sm:max-w-xl sm:mx-auto md:max-w-none md:w-auto`}
      onClick={() => isAccessible && onViewChapter(chapter)}
      aria-label={`View ${chapter.title}`}
    >
      <div className="py-4 px-3 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center flex-1 w-full">
            {/* Chapter status icon */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 ${
              isCompleted ? styles.status.success :
              isAccessible ? styles?.status?.info : styles?.button?.secondary
            }`}>
              {isCompleted ? (
                <FiCheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${styles?.status.success}`} />
              ) : !isAccessible ? (
                <FiLock className={`w-5 h-5 sm:w-6 sm:h-6 ${styles?.icon.secondary}`} />
              ) : (
                <TypeIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${getChapterTypeColor(chapter.type, styles)}`} />
              )}
            </div>

            {/* Chapter info */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold text-base sm:text-lg mb-1 ${isAccessible ? styles?.textPrimary : styles?.textSecondary}`}>
                {chapter.title}
              </h4>
              <p className="text-xs text-gray-500 mb-1 line-clamp-2">{chapter.description}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
                <div className="flex items-center">
                  <FiClock className={`w-4 h-4 mr-1 ${styles?.icon.secondary}`} />
                  <span className={`${styles?.textSecondary}`}>{chapter.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 mt-3 sm:mt-0 w-full sm:w-auto justify-end sm:justify-start">
            {/* Status badge */}
            {isCompleted && (
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${styles?.status.success} ${styles?.badgeBackground}`}>
                Completed
              </span>
            )}
            
            {/* Bookmark button */}
            {isAccessible && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(courseId, chapter._id || chapter.id);
                }}
                className={`p-2 rounded-lg transition-colors text-xs sm:text-sm ${
                  isBookmarked 
                    ? `${styles?.status.error} ${styles?.badgeBackground}`
                    : `${styles?.button.secondary} hover:${styles?.status.error}`
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <FiBookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 