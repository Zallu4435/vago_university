import React, { useState, useMemo } from 'react';
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
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState<any>(null);

  const {
    courses,
    isLoading,
    selectedCourse,
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

  // Map videos to chapters for display
  const chapters = useMemo(() => {
    if (!selectedCourse) return [];
    if (selectedCourse.chapters && selectedCourse.chapters.length > 0) {
      return selectedCourse.chapters;
    }
    // If videos exist but chapters do not, map videos to chapters
    if ((selectedCourse as any).videos && (selectedCourse as any).videos.length > 0) {
      return (selectedCourse as any).videos.map((video: any) => ({
        id: video._id,
        title: video.title,
        duration: video.duration,
        videoUrl: video.videoUrl,
        notes: video.description,
        type: 'video',
      }));
    }
    return [];
  }, [selectedCourse]);

  // Map backend course to UI course type for DiplomaCard
  const mapBackendCourseToUICourse = (course: any) => ({
    id: course._id,
    title: course.title,
    description: course.description,
    duration: course.duration || '',
    locked: false,
    difficulty: '',
    rating: 0,
    students: 0,
    icon: '',
    color: '',
    bgColor: '',
    completionRate: 0,
    chapters: course.chapters && course.chapters.length > 0 ? course.chapters : ((course.videos || []).map((video: any) => ({
      id: video._id,
      title: video.title,
      duration: video.duration,
      videoUrl: video.videoUrl,
      notes: video.description,
      type: 'video',
    }))),
    videoCount: course.videoCount,
    completedVideoCount: course.completedVideoCount,
    status: course.status,
  });

  console.log(bookmarkedChapters, 'bookmarkedChapters')
  const handleStartCourse = (courseId: string) => {
    console.log('[handleStartCourse] courseId:', courseId);
    handleViewCourse(courseId);
    setCurrentView('details');
  };

  const handleViewDetails = (course: any) => {
    const courseId = course._id || course.id;
    console.log('[handleViewDetails] courseId:', courseId);
    handleViewCourse(courseId);
    setCurrentView('details');
  };

  const handleCompleteChapter = () => {
    // Remove selectedChapter usage, as it's not defined in this scope
    // This function can be implemented if chapter selection is added
  };

  const handleBookmark = (courseId: string, chapterId: string) => {
    toggleBookmark({ courseId, chapterId });
  };

  const handleVideoProgress = (progress: number) => {
    // Remove selectedChapter usage, as it's not defined in this scope
    // This function can be implemented if chapter selection is added
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
              key={course._id}
              course={mapBackendCourseToUICourse(course)}
              index={index}
              styles={styles}
              userAdmitted={userAdmitted}
              completedChapters={completedChapters}
              onViewDetails={handleViewDetails}
              onStartCourse={handleStartCourse}
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
              <div className={`w-20 h-20 rounded-2xl ${styles.accent} flex items-center justify-center ${styles.textPrimary} ${styles.cardShadow}`}>
                {/* Optionally display an icon if you add one to the backend type */}
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${styles.textPrimary} mb-2`}>{selectedCourse?.title}</h1>
                <p className={`${styles.textSecondary} text-lg mb-4`}>{selectedCourse?.description}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    {/* Optionally display duration if you add it to the backend type */}
                  </div>
                  <div className="flex items-center">
                    <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    {/* Optionally display students if you add it to the backend type */}
                  </div>
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    {/* Optionally display rating if you add it to the backend type */}
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
              {completedChapters.size} of {chapters.length} completed
            </div>
          </div>
          <div className="space-y-4">
            {selectedCourse && chapters.map((chapter: any, idx: number) => {
              const isFirst = idx === 0;
              const prevId = chapters[idx - 1]?.id;
              const prevCompleted = isFirst
                ? true
                : completedChapters.has(String(prevId));
              // Debug logs
              console.log('Chapter:', chapter.id, 'typeof chapter.id:', typeof chapter.id, 'isFirst:', isFirst, 'prevId:', prevId, 'typeof prevId:', typeof prevId, 'prevCompleted:', prevCompleted, 'completed:', completedChapters.has(String(chapter.id)), 'bookmarked:', bookmarkedChapters.has(String(chapter.id)));
              console.log('completedChapters:', Array.from(completedChapters));
              console.log('bookmarkedChapters:', Array.from(bookmarkedChapters));
              return (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  courseId={selectedCourse._id}
                  styles={styles}
                  isFirst={isFirst}
                  isPrevCompleted={prevCompleted}
                  isCompleted={completedChapters.has(String(chapter.id))}
                  isBookmarked={bookmarkedChapters.has(String(chapter.id))}
                  onViewChapter={() => {
                    setModalVideo(chapter);
                    setVideoModalOpen(true);
                  }}
                  onBookmark={handleBookmark}
                />
              );
            })}
          </div>
        </div>

        {/* Video Modal */}
        {videoModalOpen && modalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setVideoModalOpen(false)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">{modalVideo.title}</h2>
              <video
                src={modalVideo.videoUrl}
                controls
                className="w-full rounded mb-4"
                style={{ minHeight: 300 }}
              />
              <div className="text-gray-600">{modalVideo.notes || modalVideo.description}</div>
              <div className="mt-4 flex justify-between items-center">
                {/* Bookmark button */}
                <button
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors mr-2 ${bookmarkedChapters.has(String(modalVideo.id)) ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleBookmark(selectedCourse._id, modalVideo.id)}
                >
                  {bookmarkedChapters.has(String(modalVideo.id)) ? 'Bookmarked' : 'Bookmark'}
                </button>
                {/* Completed/Mark as Completed button */}
                {completedChapters.has(String(modalVideo.id)) ? (
                  <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">Completed</span>
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    onClick={() => {
                      if (selectedCourse && modalVideo) {
                        markChapterComplete({ courseId: selectedCourse._id, chapterId: modalVideo.id });
                        setVideoModalOpen(false);
                        setCurrentView('details');
                      }
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
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
    default:
      return renderCoursesList();
  }
};

export default DiplomaCoursesSection;
