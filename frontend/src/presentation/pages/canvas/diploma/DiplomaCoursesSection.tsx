import React, { useState } from 'react';
import { 
  FiArrowLeft, FiBookOpen, FiAward, FiHeart, FiShare2, FiDownload, FiBookmark, FiCheckCircle,
  FiClock, FiUsers, FiStar, FiEye, FiTrendingUp, FiCode, FiBarChart
} from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';
import { ViewMode } from './types/DiplomaTypes';
import { DiplomaCard } from './components/DiplomaCard';
import { ChapterItem } from './components/ChapterItem';
import { VideoPlayer } from './components/VideoPlayer';
import { useDiplomaManagement } from '../../../../application/hooks/useDiplomaManagement';

const DiplomaCoursesSection = () => {
  const { styles } = usePreferences();
  const [currentView, setCurrentView] = useState<ViewMode>('courses');
  const [userAdmitted, setUserAdmitted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const {
    courses,
    isLoading,
    selectedCourse,
    selectedChapter,
    completedChapters,
    bookmarkedChapters,
    updateProgress,
    markChapterComplete,
    toggleBookmark,
    handleViewCourse,
    handleViewChapter,
    setSelectedCourseId,
    setSelectedChapterId
  } = useDiplomaManagement();

  const handleViewDetails = (course: any) => {
    handleViewCourse(course.id);
    setCurrentView('details');
  };

  const handleCompleteChapter = () => {
    if (selectedCourse && selectedChapter) {
      markChapterComplete({ courseId: selectedCourse.id, chapterId: selectedChapter.id });
    }
  };

  const handleBookmark = (courseId: string, chapterId: string) => {
    toggleBookmark({ courseId, chapterId });
  };

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
    if (selectedCourse && selectedChapter) {
      updateProgress({ courseId: selectedCourse.id, chapterId: selectedChapter.id, progress });
    }
  };

  const renderCoursesList = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${styles.accent} rounded-2xl mb-6`}>
            <FiAward className={`w-8 h-8 ${styles.textPrimary}`} />
          </div>
          <h1 className={`text-5xl font-bold ${styles.textPrimary} mb-4`}>Diploma Courses</h1>
          <p className={`text-xl ${styles.textSecondary} max-w-2xl mx-auto`}>
            Advance your career with our comprehensive diploma programs designed by industry experts
          </p>
        </div>
        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <DiplomaCard
              key={course.id}
              course={course}
              index={index}
              styles={styles}
              userAdmitted={userAdmitted}
              completedChapters={completedChapters}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourseDetails = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => setCurrentView('courses')}
          className={`flex items-center ${styles.textPrimary} hover:${styles.accent} mb-8 transition-colors group`}
          aria-label="Back to courses"
        >
          <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </button>

        {/* Course header */}
        <div className={`${styles.card.background} rounded-3xl p-8 ${styles.cardBorder} mb-8`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className={`w-20 h-20 rounded-2xl ${selectedCourse?.color || styles.accent} flex items-center justify-center ${styles.textPrimary} ${styles.cardShadow}`}>
                {selectedCourse?.icon && React.createElement(selectedCourse.icon, { className: 'w-10 h-10' })}
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${styles.textPrimary} mb-2`}>{selectedCourse?.title}</h1>
                <p className={`${styles.textSecondary} text-lg mb-4`}>{selectedCourse?.description}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    <span className={`${styles.textSecondary}`}>{selectedCourse?.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    <span className={`${styles.textSecondary}`}>{selectedCourse?.students?.toLocaleString() || 0} students</span>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className={`${styles.textPrimary} font-medium`}>{selectedCourse?.rating || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className={`${styles.button.secondary} p-3 rounded-xl transition-colors`} aria-label="Like course">
                <FiHeart className={`w-5 h-5 ${styles.icon.secondary}`} />
              </button>
              <button className={`${styles.button.secondary} p-3 rounded-xl transition-colors`} aria-label="Share course">
                <FiShare2 className={`w-5 h-5 ${styles.icon.secondary}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Chapters section */}
        <div className={`${styles.card.background} rounded-3xl p-8 ${styles.cardBorder}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${styles.textPrimary} flex items-center`}>
              <FiBookOpen className={`w-6 h-6 mr-3 ${styles.accent}`} />
              Course Chapters
            </h2>
            <div className={`${styles.textSecondary} text-sm`}>
              {completedChapters.size} of {selectedCourse?.chapters?.length || 0} completed
            </div>
          </div>
        
          <div className="space-y-4">
            {selectedCourse?.chapters?.map((chapter) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                isCompleted={completedChapters.has(`${selectedCourse.id}-${chapter.id}`)}
                isBookmarked={bookmarkedChapters.has(`${selectedCourse.id}-${chapter.id}`)}
                onView={() => handleViewChapter(chapter.id)}
                onBookmark={() => handleBookmark(selectedCourse.id, chapter.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChapterView = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => setCurrentView('details')}
          className={`flex items-center ${styles.textPrimary} hover:${styles.accent} mb-8 transition-colors group`}
          aria-label="Back to course details"
        >
          <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Course
        </button>

        {/* Chapter content */}
        <div className={`${styles.card.background} rounded-3xl p-8 ${styles.cardBorder}`}>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${styles.textPrimary} mb-2`}>{selectedChapter?.title}</h1>
              <p className={`${styles.textSecondary} text-lg`}>{selectedChapter?.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBookmark(selectedCourse!.id, selectedChapter!.id)}
                className={`${styles.button.secondary} p-3 rounded-xl transition-colors`}
                aria-label={bookmarkedChapters.has(`${selectedCourse!.id}-${selectedChapter!.id}`) ? 'Remove bookmark' : 'Add bookmark'}
              >
                <FiBookmark className={`w-5 h-5 ${styles.icon.secondary}`} />
              </button>
              <button
                onClick={handleCompleteChapter}
                className={`${styles.button.secondary} p-3 rounded-xl transition-colors`}
                aria-label="Mark chapter as complete"
              >
                <FiCheckCircle className={`w-5 h-5 ${styles.icon.secondary}`} />
              </button>
            </div>
          </div>

          {/* Video player */}
          <div className="aspect-video rounded-2xl overflow-hidden mb-8">
            <VideoPlayer
              url={selectedChapter?.videoUrl}
              onProgress={handleVideoProgress}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          {/* Chapter notes */}
          {selectedChapter?.notes && (
            <div className={`${styles.card.background} rounded-2xl p-6 ${styles.cardBorder}`}>
              <h2 className={`text-xl font-bold ${styles.textPrimary} mb-4`}>Chapter Notes</h2>
              <p className={`${styles.textSecondary} whitespace-pre-wrap`}>{selectedChapter.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen ${styles.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  switch (currentView) {
    case 'courses':
      return renderCoursesList();
    case 'details':
      return renderCourseDetails();
    case 'chapter':
      return renderChapterView();
    default:
      return renderCoursesList();
  }
};

export default DiplomaCoursesSection;