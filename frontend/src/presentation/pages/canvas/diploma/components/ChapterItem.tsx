import React from 'react';
import { FiLock, FiCheckCircle, FiBookmark, FiPlay } from 'react-icons/fi';
import { getChapterTypeIcon } from '../utils/diplomaUtils';
import { ChapterItemProps, ChapterType } from '../../../../../domain/types/canvas/diploma';

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  courseId,
  isFirst,
  isPrevCompleted,
  isCompleted,
  isBookmarked,
  onViewChapter,
  onBookmark
}) => {
  const isAccessible = isFirst || isPrevCompleted;
  const TypeIcon = getChapterTypeIcon(chapter.type as ChapterType);

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 ${
        isAccessible ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed opacity-60'
      } w-full`}
      onClick={() => isAccessible && onViewChapter(chapter)}
      aria-label={`View ${chapter.title}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : isAccessible 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {isCompleted ? (
              <FiCheckCircle className="w-6 h-6" />
            ) : !isAccessible ? (
              <FiLock className="w-6 h-6" />
            ) : (
              <TypeIcon className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className={`font-semibold text-lg leading-tight ${
                isAccessible 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {chapter.title}
              </h4>
              
              {isCompleted && (
                <span className="flex-shrink-0 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                  Completed
                </span>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
              {chapter.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {chapter.type && (
                  <div className="flex items-center gap-1.5">
                    <FiPlay className="w-4 h-4" />
                    <span className="capitalize">{chapter.type}</span>
                  </div>
                )}
              </div>
              
              {isAccessible && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmark(courseId, chapter._id || chapter.id);
                  }}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isBookmarked 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 