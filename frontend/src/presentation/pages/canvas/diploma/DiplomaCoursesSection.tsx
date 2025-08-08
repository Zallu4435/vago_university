import { useState, useMemo } from 'react';
import { 
  FiArrowLeft, FiBookOpen, FiAward, FiHeart, FiShare2,
  FiClock, FiUsers, FiStar
} from 'react-icons/fi';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { DiplomaCard } from './components/DiplomaCard';
import { ChapterItem } from './components/ChapterItem';
import { useDiplomaManagement } from '../../../../application/hooks/useDiplomaManagement';
import { ViewMode } from '../../../../domain/types/canvas/diploma';

const DiplomaCoursesSection = () => {
  const { styles } = usePreferences();
  const [currentView, setCurrentView] = useState<ViewMode>('courses');
  const [userAdmitted] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState<any>(null);

  const {
    courses,
    isLoading,
    selectedCourse,
    completedChapters,
    bookmarkedChapters,
    markChapterComplete,
    handleViewCourse,
  } = useDiplomaManagement();

  // Map videos to chapters for display
  const chapters = useMemo(() => {
    if (!selectedCourse) return [];
    if (selectedCourse.chapters && selectedCourse.chapters.length > 0) {
      // Map backend chapters to frontend format
      return selectedCourse.chapters.map((chapter: any) => ({
        id: chapter._id || chapter.id, // Handle both _id and id
        title: chapter.title,
        description: chapter.description || '',
        duration: chapter.duration || '0',
        videoUrl: chapter.videoUrl || '',
        notes: chapter.description || '',
        type: 'video',
      }));
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
    chapters: course.chapters && course.chapters.length > 0 ? course.chapters.map((chapter: any) => ({
      id: chapter._id || chapter.id, // Handle both _id and id
      title: chapter.title,
      description: chapter.description || '',
      duration: chapter.duration || '0',
      videoUrl: chapter.videoUrl || '',
      notes: chapter.description || '',
      type: 'video',
    })) : ((course.videos || []).map((video: any) => ({
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

  const renderCoursesList = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${styles.accent} rounded-2xl mb-4 sm:mb-6`}>
            <FiAward className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.textPrimary}`} />
          </div>
          <h1 className={`text-3xl sm:text-5xl font-bold ${styles.textPrimary} mb-2 sm:mb-4`}>Diploma Courses</h1>
          <p className={`text-base sm:text-xl ${styles.textSecondary} max-w-2xl mx-auto`}>
            Advance your career with our comprehensive diploma programs designed by industry experts
          </p>
        </div>
        {/* Courses grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

  const renderCourseDetails = () => {
    // Debug log before rendering chapters
    console.log('[renderCourseDetails] About to render chapters:', chapters);
    console.log('[renderCourseDetails] selectedCourse:', selectedCourse);
    return (
      <div className={`min-h-screen ${styles.background}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Back button */}
          <button
            onClick={() => setCurrentView('courses')}
            className={`flex items-center ${styles.textPrimary} hover:${styles.accent} mb-6 sm:mb-8 transition-colors group`}
            aria-label="Back to courses"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </button>

          {/* Course header */}
          <div className={`${styles.card.background} rounded-2xl sm:rounded-3xl p-4 sm:p-8 border ${styles.border} mb-6 sm:mb-8`}>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl ${styles.accent} flex items-center justify-center ${styles.textPrimary} shadow-lg`}></div>
                <div>
                  <h1 className={`text-2xl sm:text-4xl font-bold ${styles.textPrimary} mb-1 sm:mb-2`}>{selectedCourse?.title}</h1>
                  <p className={`${styles.textSecondary} text-base sm:text-lg mb-2 sm:mb-4`}>{selectedCourse?.description}</p>
                  <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    </div>
                    <div className="flex items-center">
                      <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    </div>
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 mt-4 sm:mt-0">
                <button className={`${styles.button.secondary} p-2 sm:p-3 rounded-xl transition-colors`} aria-label="Like course">
                  <FiHeart className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.icon.secondary}`} />
                </button>
                <button className={`${styles.button.secondary} p-2 sm:p-3 rounded-xl transition-colors`} aria-label="Share course">
                  <FiShare2 className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.icon.secondary}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Chapters section */}
          <div className={`${styles.card.background} rounded-2xl sm:rounded-3xl p-4 sm:p-8 border ${styles.border}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-0">
              <h2 className={`text-xl sm:text-2xl font-bold ${styles.textPrimary} flex items-center`}>
                <FiBookOpen className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${styles.accent}`} />
                Course Chapters
              </h2>
              <div className={`${styles.textSecondary} text-xs sm:text-sm mt-2 sm:mt-0`}>
                {completedChapters.size} of {chapters.length} completed
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {selectedCourse && chapters.map((chapter: any, idx: number) => {
                const isFirst = idx === 0;
                const prevId = chapters[idx - 1]?.id;
                const prevCompleted = isFirst
                  ? true
                  : completedChapters.has(String(prevId));
                const chapterId = chapter._id || chapter.id;
                // Debug logs
                console.log('Chapter:', chapterId, 'typeof chapterId:', typeof chapterId, 'isFirst:', isFirst, 'prevId:', prevId, 'typeof prevId:', typeof prevId, 'prevCompleted:', prevCompleted, 'completed:', completedChapters.has(String(chapterId)), 'bookmarked:', bookmarkedChapters.has(String(chapterId)));
                console.log('completedChapters:', Array.from(completedChapters));
                console.log('bookmarkedChapters:', Array.from(bookmarkedChapters));
                return (
                  <ChapterItem
                    key={chapterId}
                    chapter={chapter}
                    courseId={selectedCourse._id}
                    styles={styles}
                    isFirst={isFirst}
                    isPrevCompleted={prevCompleted}
                    isCompleted={completedChapters.has(String(chapterId))}
                    isBookmarked={bookmarkedChapters.has(String(chapterId))}
                    onViewChapter={() => {
                      setModalVideo(chapter);
                      setVideoModalOpen(true);
                    }}
                    onBookmark={() => {}}
                  />
                );
              })}
            </div>
          </div>

          {/* Video Modal */}
          {videoModalOpen && modalVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-2 sm:px-0">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-2xl p-4 sm:p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                  onClick={() => setVideoModalOpen(false)}
                >
                  ×
                </button>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{modalVideo.title}</h2>
                <video
                  src={modalVideo.videoUrl}
                  controls
                  className="w-full rounded mb-3 sm:mb-4"
                  style={{ minHeight: 180, maxHeight: 400 }}
                />
                <div className="text-gray-600">{modalVideo.notes || modalVideo.description}</div>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  {/* Bookmark button */}
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors mr-0 sm:mr-2 ${bookmarkedChapters.has(String(modalVideo._id || modalVideo.id)) ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => {}}
                  >
                    {bookmarkedChapters.has(String(modalVideo._id || modalVideo.id)) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  {/* Completed/Mark as Completed button */}
                  {completedChapters.has(String(modalVideo._id || modalVideo.id)) ? (
                    <span className="px-3 sm:px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">Completed</span>
                  ) : (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors"
                      onClick={() => {
                        if (selectedCourse && modalVideo) {
                          markChapterComplete({ courseId: selectedCourse._id, chapterId: modalVideo._id || modalVideo.id });
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
  };

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
