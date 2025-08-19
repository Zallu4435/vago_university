import { useState, useMemo } from 'react';
import { 
  FiArrowLeft, FiBookOpen, FiAward,
  FiUsers, FiStar
} from 'react-icons/fi';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { DiplomaCard } from './components/DiplomaCard';
import { ChapterItem } from './components/ChapterItem';
import { useDiplomaManagement } from '../../../../application/hooks/useDiplomaManagement';
import { BackendChapter, BackendCourse, ViewMode } from '../../../../domain/types/canvas/diploma';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';
import { Chapter, DiplomaCourse } from '../../../../domain/types/canvas/diploma';

export const DiplomaCoursesSection = () => {
  const { styles } = usePreferences();
  const [currentView, setCurrentView] = useState<ViewMode>('courses');
  const [userAdmitted] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState<Chapter | null>(null);

  usePreventBodyScroll(videoModalOpen);

  const {
    courses,
    isLoading,
    selectedCourse,
    completedChapters,
    bookmarkedChapters,
    markChapterComplete,
    toggleBookmark,
    handleViewCourse,
  } = useDiplomaManagement();

  const chapters = useMemo<Chapter[]>(() => {
    if (!selectedCourse) return [];
    if ((selectedCourse as BackendCourse).chapters?.length) {
      return ((selectedCourse as BackendCourse).chapters ?? []).map((chapter: BackendChapter): Chapter => ({
        id: chapter._id || chapter.id || '',
        _id: chapter._id,
        title: chapter.title,
        description: chapter.description || '',
        type: chapter.type || 'video',
        duration: chapter.duration || '0',
        videoUrl: chapter.videoUrl || '',
        notes: chapter.notes || chapter.description || '',
        order: chapter.order,
        isCompleted: chapter.isCompleted,
        isBookmarked: chapter.isBookmarked,
      }));
    }
    if ((selectedCourse as BackendCourse).videos?.length) {
      return ((selectedCourse as BackendCourse).videos ?? []).map((video: BackendChapter): Chapter => ({
        id: video._id || video.id || '',
        _id: video._id,
        title: video.title,
        description: video.description || '',
        type: 'video',
        duration: video.duration || '0',
        videoUrl: video.videoUrl || '',
        notes: video.description || '',
      }));
    }
    return [];
  }, [selectedCourse]);

  const mapBackendCourseToUICourse = (course: BackendCourse): DiplomaCourse => ({
    id: course._id || course.id || '',
    title: course.title,
    description: course.description,
    category: course.category || course.department || 'General',
    department: course.department || course.category || 'General',
    instructor: course.instructor || 'Unknown',
    status: course.status || 'published',
    videoCount: course.videoCount || (course.chapters ? course.chapters.length : 0) || (course.videos ? course.videos.length : 0),
    completedVideoCount: course.completedVideoCount || 0,
    totalVideos: course.videoCount || (course.chapters ? course.chapters.length : 0) || (course.videos ? course.videos.length : 0),
    chapters: course.chapters && course.chapters.length > 0 ? course.chapters.map((chapter: BackendChapter): Chapter => ({
      id: chapter._id || chapter.id || '',
      _id: chapter._id,
      title: chapter.title,
      description: chapter.description || '',
      type: chapter.type || 'video',
      duration: chapter.duration || '0',
      videoUrl: chapter.videoUrl || '',
      notes: chapter.notes || chapter.description || '',
      order: chapter.order,
      isCompleted: chapter.isCompleted,
      isBookmarked: chapter.isBookmarked,
    })) : ((course.videos || []).map((video: BackendChapter): Chapter => ({
      id: video._id || video.id || '',
      _id: video._id,
      title: video.title,
      description: video.description || '',
      type: 'video',
      duration: video.duration || '0',
      videoUrl: video.videoUrl || '',
      notes: video.description || '',
    }))),
    duration: course.duration || '',
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    isEnrolled: course.isEnrolled,
  });

  const handleStartCourse = (courseId: string) => {
    handleViewCourse(courseId);
    setCurrentView('details');
  };

  const handleViewDetails = (course: DiplomaCourse) => {
    const courseId = (course as { _id?: string; id?: string })._id || course.id;
    handleViewCourse(courseId);
    setCurrentView('details');
  };

  const renderCoursesList = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${styles.accent} rounded-2xl mb-4 sm:mb-6`}>
            <FiAward className={`w-6 h-6 sm:w-8 sm:h-8 ${styles.textPrimary}`} />
          </div>
          <h1 className={`text-3xl sm:text-5xl font-bold ${styles.textPrimary} mb-2 sm:mb-4`}>Diploma Courses</h1>
          <p className={`text-base sm:text-xl ${styles.textSecondary} max-w-2xl mx-auto`}>
            Advance your career with our comprehensive diploma programs designed by industry experts
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course, index) => {
            const mappedCourse = mapBackendCourseToUICourse(course);
            return (
              <DiplomaCard
                key={course._id}
                course={mappedCourse}
                index={index}
                styles={styles}
                userAdmitted={userAdmitted}
                completedChapters={completedChapters}
                onViewDetails={handleViewDetails}
                onStartCourse={handleStartCourse}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCourseDetails = () => {
    return (
      <div className={`min-h-screen ${styles.background}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <button
            onClick={() => setCurrentView('courses')}
            className={`flex items-center ${styles.textPrimary} hover:${styles.accent} mb-6 sm:mb-8 transition-colors group`}
            aria-label="Back to courses"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </button>

          <div className={`${styles.card.background} rounded-2xl sm:rounded-3xl p-4 sm:p-8 border ${styles.border} mb-6 sm:mb-8`}>
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl ${styles.accent} flex items-center justify-center ${styles.textPrimary} shadow-lg`}></div>
                <div>
                  <h1 className={`text-2xl sm:text-4xl font-bold ${styles.textPrimary} mb-1 sm:mb-2`}>{selectedCourse?.title}</h1>
                  <p className={`${styles.textSecondary} text-base sm:text-lg mb-2 sm:mb-4`}>{selectedCourse?.description}</p>
              <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    </div>
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 mt-4 sm:mt-0"></div>
            </div>
          </div>

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
              {selectedCourse && chapters.map((chapter: Chapter, idx: number) => {
                const isFirst = idx === 0;
                const prevId = chapters[idx - 1]?.id;
                const prevCompleted = isFirst
                  ? true
                  : completedChapters.has(String(prevId));
                const chapterId = chapter._id || chapter.id;
                return (
                  <ChapterItem
                    key={chapterId}
                    chapter={chapter}
                    courseId={selectedCourse._id || selectedCourse.id}
                    styles={styles}
                    isFirst={isFirst}
                    isPrevCompleted={prevCompleted}
                    isCompleted={completedChapters.has(String(chapterId))}
                    isBookmarked={bookmarkedChapters.has(String(chapterId))}
                    onViewChapter={() => {
                      setModalVideo(chapter);
                      setVideoModalOpen(true);
                    }}
                    onBookmark={() => {
                      if (selectedCourse) {
                        toggleBookmark({ courseId: selectedCourse._id || selectedCourse.id, chapterId: String(chapterId) });
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          {videoModalOpen && modalVideo && (
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-2 sm:px-0`}>
              <div className={`${styles.card.background} ${styles.border} rounded-2xl shadow-2xl w-full max-w-md sm:max-w-2xl p-4 sm:p-6 relative`}>
                <button
                  className={`absolute top-2 right-2 ${styles.textSecondary} hover:${styles.textPrimary} text-2xl`}
                  onClick={() => setVideoModalOpen(false)}
                >
                  ×
                </button>
                <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${styles.textPrimary}`}>{modalVideo.title}</h2>
                <video
                  src={typeof modalVideo?.videoUrl === 'string' ? modalVideo.videoUrl : ''}
                  controls
                  className={`w-full rounded mb-3 sm:mb-4`}
                  style={{ minHeight: 180, maxHeight: 400 }}
                />
                <div className={`${styles.textSecondary}`}>{String(modalVideo?.notes || modalVideo?.description || '')}</div>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors mr-0 sm:mr-2 ${bookmarkedChapters.has(String(modalVideo._id || modalVideo.id)) ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => {
                      if (selectedCourse && modalVideo) {
                        toggleBookmark({ courseId: selectedCourse._id || selectedCourse.id, chapterId: String(modalVideo._id || modalVideo.id) });
                      }
                    }}
                  >
                    {bookmarkedChapters.has(String(modalVideo._id || modalVideo.id)) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  {completedChapters.has(String(modalVideo._id || modalVideo.id)) ? (
                    <span className="px-3 sm:px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">Completed</span>
                  ) : (
                    <button
                      className={`bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors`}
                      onClick={() => {
                        if (selectedCourse && modalVideo) {
                          markChapterComplete({ courseId: selectedCourse._id || selectedCourse.id, chapterId: modalVideo._id || modalVideo.id });
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
