import React from 'react';
import { FiLock, FiClock, FiUsers, FiStar, FiBook } from 'react-icons/fi';
import { DiplomaCourse } from '../types/DiplomaTypes';

interface DiplomaCardProps {
  course: DiplomaCourse;
  index: number;
  styles: any;
  userAdmitted: boolean;
  completedChapters: Set<string>;
  onViewDetails: (course: DiplomaCourse) => void;
  onStartCourse: (courseId: string) => void;
}

export const DiplomaCard: React.FC<DiplomaCardProps> = ({
  course,
  index,
  styles,
  userAdmitted,
  completedChapters,
  onViewDetails,
  onStartCourse
}) => {
  const isAccessible = userAdmitted && course.status === 'published';

  const totalVideos = typeof course.videoCount === 'number' ? course.videoCount : (course.chapters ? course.chapters.length : 0);
  const completedCount = typeof course.completedVideoCount === 'number'
    ? course.completedVideoCount
    : (course.chapters ? course.chapters.filter(chapter => completedChapters.has(String(chapter.id))).length : 0);
  const progressPercentage = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0;
  
  let progressColor = 'bg-red-500';
  if (progressPercentage > 66) {
    progressColor = 'bg-green-500';
  } else if (progressPercentage > 33) {
    progressColor = 'bg-yellow-400';
  }
  
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${styles.cardHover} ${
        !isAccessible ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } w-full max-w-md mx-auto md:max-w-none md:w-auto`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => isAccessible && onViewDetails(course)}
      aria-label={`View details for ${course.title}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 ${styles.card.background} opacity-90`} />
      
      {/* Content overlay */}
      <div className="relative p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${styles.accent} flex items-center justify-center ${styles.textPrimary} ${styles.cardShadow} group-hover:scale-110 transition-transform duration-300`}>
            <FiBook className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          {!isAccessible && (
            <div className={`${styles.button.secondary} p-2 rounded-full mt-2 sm:mt-0`}>
              <FiLock className={`w-5 h-5 ${styles.icon.secondary}`} />
            </div>
          )}
        </div>
        
        {/* Course info */}
        <div className="mb-4 sm:mb-6">
          <h3 className={`text-lg sm:text-2xl font-bold ${styles.textPrimary} mb-2 sm:mb-3 group-hover:${styles.accent} transition-colors`}>
            {course.title}
          </h3>
          <p className={`${styles.textSecondary} text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4`}>
            {course.description}
          </p>
          
          {/* Course stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm mb-2 sm:mb-4">
            <div className="flex items-center">
              <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>{course.category}</span>
            </div>
            <div className="flex items-center">
              <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>{course.instructor || 'No instructor'}</span>
            </div>
            <div className="flex items-center">
              <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
              <span className={`${styles.textSecondary}`}>{course.department || 'No department'}</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.status === 'published' ? styles.status.success :
              course.status === 'draft' ? styles.status.warning :
              styles.status.error
            } ${styles.badgeBackground}`}>
              {course.status}
            </span>
            <span className={`${styles.textSecondary} text-xs`}>{completedCount}/{totalVideos} videos</span>
          </div>

          {/* Progress label */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">
              {completedCount}/{totalVideos} videos completed
            </span>
            <span className={`text-xs font-semibold ${progressColor}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className={`w-full bg-gray-200 rounded-full h-2 mb-2 sm:mb-4`}>
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${progressColor}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action button */}
        <button
          disabled={!isAccessible}
          className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base ${
            isAccessible 
              ? `${styles.accent} ${styles.button.primary} ${styles.cardHover}`
              : `${styles.button.secondary} cursor-not-allowed`
          }`}
          aria-label={isAccessible ? progressPercentage > 0 ? 'Continue course' : 'Start course' : 'Access restricted'}
          onClick={e => {
            e.stopPropagation();
            if (isAccessible) onStartCourse(course.id);
          }}
        >
          {isAccessible ? (
            progressPercentage > 0 ? 'Continue Learning' : 'Start Course'
          ) : (
            'Access Restricted'
          )}
        </button>
      </div>
    </div>
  );
}; 