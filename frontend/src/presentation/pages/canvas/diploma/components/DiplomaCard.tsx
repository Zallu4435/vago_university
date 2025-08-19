import React from 'react';
import { FiUsers, FiStar, FiBook } from 'react-icons/fi';
import { DiplomaCardProps } from '../../../../../domain/types/canvas/diploma';

export const DiplomaCard: React.FC<DiplomaCardProps> = ({
  course,
  index,
  styles,
  completedChapters,
  onViewDetails,
  onStartCourse
}) => {
  const displayDepartment = course.department || course.category || 'General';
  const displayInstructor = course.instructor as string | undefined;

  const totalVideos = course.videoCount || 
    (course.chapters ? course.chapters.length : 0) || 
    (course.totalVideos || 0);
  
  const completedCount = course.completedVideoCount || 
    (course.chapters ? course.chapters.filter(chapter => completedChapters.has(String(chapter.id))).length : 0) ||
    0;
  
  const validTotalVideos = Math.max(0, Number(totalVideos) || 0);
  const validCompletedCount = Math.max(0, Number(completedCount) || 0);
  
  const progressPercentage = validTotalVideos > 0 ? (validCompletedCount / validTotalVideos) * 100 : 0;
  
  let progressColor = 'bg-red-500';
  let progressTextColor = 'text-red-600';
  if (progressPercentage > 66) {
    progressColor = 'bg-green-500';
    progressTextColor = 'text-green-600';
  } else if (progressPercentage > 33) {
    progressColor = 'bg-yellow-500';
    progressTextColor = 'text-yellow-600';
  }
  
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${styles.cardHover} w-full max-w-md mx-auto md:max-w-none md:w-auto bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onViewDetails(course)}
      aria-label={`View details for ${course.title}`}
    >
      <div className="relative p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl ${styles.accent} flex items-center justify-center ${styles.textPrimary} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <FiBook className="w-7 h-7" />
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            course.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            course.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {course.status as string}
          </span>
        </div>
        
        <h3 className={`text-xl font-bold ${styles.textPrimary} mb-3 group-hover:${styles.accent} transition-colors duration-300 line-clamp-2`}>
          {course.title}
        </h3>
        <p className={`${styles.textSecondary} text-sm leading-relaxed mb-4 line-clamp-3`}>
          {course.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
          {displayInstructor && (
            <div className="flex items-center gap-1.5">
              <FiUsers className={`w-4 h-4 ${styles.icon?.secondary || 'text-gray-500'}`} />
              <span className={`${styles.textSecondary} font-medium`}>{displayInstructor}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FiStar className="w-4 h-4 text-yellow-500" />
            <span className={`${styles.textSecondary} font-medium`}>{displayDepartment as string}</span>
          </div>
        </div>

        {validTotalVideos > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${styles.textSecondary} font-medium`}>
                {validCompletedCount}/{validTotalVideos} videos completed
              </span>
              <span className={`text-sm font-bold ${progressTextColor}`}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${progressColor} shadow-sm`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">
            {validTotalVideos} {validTotalVideos === 1 ? 'video' : 'videos'}
          </span>
          {course.duration && (
            <span className="font-medium">{String(course.duration)}</span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 text-sm ${
            validTotalVideos > 0 
              ? `${styles.accent} ${styles.button?.primary || 'bg-blue-600 text-white hover:bg-blue-700'} hover:shadow-lg transform hover:-translate-y-0.5`
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={validTotalVideos === 0}
          aria-label={validTotalVideos > 0 ? (progressPercentage > 0 ? 'Continue course' : 'Start course') : 'No videos available'}
          onClick={e => {
            e.stopPropagation();
            if (validTotalVideos > 0) {
              onStartCourse(course.id);
            }
          }}
        >
          {validTotalVideos === 0 
            ? 'No Videos Available' 
            : progressPercentage > 0 
              ? 'Continue Learning' 
              : 'Start Course'
          }
        </button>
      </div>
    </div>
  );
};