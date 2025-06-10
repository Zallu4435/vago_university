import React from 'react';
import { FiLock, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import { DiplomaCourse } from '../types/DiplomaTypes';

interface DiplomaCardProps {
  course: DiplomaCourse;
  index: number;
  styles: any;
  userAdmitted: boolean;
  completedChapters: Set<string>;
  onViewDetails: (course: DiplomaCourse) => void;
}

export const DiplomaCard: React.FC<DiplomaCardProps> = ({
  course,
  index,
  styles,
  userAdmitted,
  completedChapters,
  onViewDetails
}) => {
  const isAccessible = userAdmitted && !course.locked;
  const IconComponent = course.icon;
  const completedCount = course.chapters.filter(chapter => 
    completedChapters.has(`${course.id}-${chapter.id}`)
  ).length;
  const progressPercentage = (completedCount / course.chapters.length) * 100;
  
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${styles.cardHover} ${
        !isAccessible ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => isAccessible && onViewDetails(course)}
      aria-label={`View details for ${course.title}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 ${course.bgColor} opacity-90`} />
      
      {/* Content overlay */}
      <div className={`relative ${styles.card.background} ${styles.cardBorder} p-8 h-full`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-16 h-16 rounded-2xl ${course.color} flex items-center justify-center ${styles.textPrimary} ${styles.cardShadow} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-8 h-8" />
          </div>
          {!isAccessible && (
            <div className={`${styles.button.secondary} p-2 rounded-full`}>
              <FiLock className={`w-5 h-5 ${styles.icon.secondary}`} />
            </div>
          )}
        </div>
        
        {/* Course info */}
        <div className="mb-6">
          <h3 className={`text-2xl font-bold ${styles.textPrimary} mb-3 group-hover:${styles.accent} transition-colors`}>
            {course.title}
          </h3>
          <p className={`${styles.textSecondary} text-sm leading-relaxed mb-4`}>
            {course.description}
          </p>
          
          {/* Course stats */}
          <div className="flex items-center space-x-4 text-sm mb-4">
            <div className="flex items-center">
              <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
              <span className={`${styles.textSecondary}`}>{course.rating}</span>
            </div>
          </div>

          {/* Difficulty badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.difficulty === 'Beginner' ? styles.status.success :
              course.difficulty === 'Intermediate' ? styles.status.warning :
              styles.status.error
            } ${styles.badgeBackground}`}>
              {course.difficulty}
            </span>
            <span className={`${styles.textSecondary} text-xs`}>{completedCount}/{course.chapters.length} chapters</span>
          </div>

          {/* Progress bar */}
          <div className={`w-full ${styles.progress.background} rounded-full h-2 mb-4`}>
            <div
              className={`h-2 rounded-full ${course.color} transition-all duration-1000`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Action button */}
        <button
          disabled={!isAccessible}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
            isAccessible 
              ? `${course.color} ${styles.button.primary} ${styles.cardHover}`
              : `${styles.button.secondary} cursor-not-allowed`
          }`}
          aria-label={isAccessible ? progressPercentage > 0 ? 'Continue course' : 'Start course' : 'Access restricted'}
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