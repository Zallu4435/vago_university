import React from 'react';
import { FiLock, FiClock, FiCheckCircle, FiBookmark } from 'react-icons/fi';
import { Chapter } from '../types/DiplomaTypes';
import { getChapterTypeIcon, getChapterTypeColor } from '../utils/diplomaUtils';

interface ChapterItemProps {
  chapter: Chapter;
  courseId: number;
  styles: any;
  isFirst: boolean;
  isPrevCompleted: boolean;
  isCompleted: boolean;
  isBookmarked: boolean;
  onViewChapter: (chapter: Chapter) => void;
  onBookmark: (courseId: number, chapterId: number) => void;
}

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

  return (
    <div 
      className={`group relative ${styles.card.background} rounded-2xl ${styles.cardBorder} transition-all duration-300 ${styles.cardHover} ${
        isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      }`}
      onClick={() => isAccessible && onViewChapter(chapter)}
      aria-label={`View ${chapter.title}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            {/* Chapter status icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
              isCompleted ? styles.status.success :
              isAccessible ? styles.status.info : styles.button.secondary
            }`}>
              {isCompleted ? (
                <FiCheckCircle className={`w-6 h-6 ${styles.status.success}`} />
              ) : !isAccessible ? (
                <FiLock className={`w-6 h-6 ${styles.icon.secondary}`} />
              ) : (
                <TypeIcon className={`w-6 h-6 ${getChapterTypeColor(chapter.type, styles)}`} />
              )}
            </div>

            {/* Chapter info */}
            <div className="flex-1">
              <h4 className={`font-semibold text-lg mb-1 ${isAccessible ? styles.textPrimary : styles.textSecondary}`}>
                {chapter.title}
              </h4>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                  <span className={`${styles.textSecondary}`}>{chapter.duration}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChapterTypeColor(chapter.type, styles)} ${styles.badgeBackground}`}>
                  {chapter.type}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Status badge */}
            {isCompleted && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles.status.success} ${styles.badgeBackground}`}>
                Completed
              </span>
            )}
            
            {/* Bookmark button */}
            {isAccessible && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(courseId, chapter.id);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? `${styles.status.error} ${styles.badgeBackground}`
                    : `${styles.button.secondary} hover:${styles.status.error}`
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 