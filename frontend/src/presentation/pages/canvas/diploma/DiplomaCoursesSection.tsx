import React, { useState, useEffect } from 'react';
import { 
  FiLock, 
  FiUnlock, 
  FiPlay, 
  FiDownload, 
  FiBookmark, 
  FiCheckCircle, 
  FiClock, 
  FiArrowLeft,
  FiPlayCircle,
  FiBookOpen,
  FiAward,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiTarget,
  FiGlobe,
  FiCode,
  FiPause,
  FiSkipForward,
  FiVolume2,
  FiMaximize2,
  FiSettings,
  FiEye,
  FiHeart,
  FiShare2,
  FiBarChart
} from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';

const DiplomaCoursesSection = () => {
  const { styles } = usePreferences();
  const [currentView, setCurrentView] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [userAdmitted, setUserAdmitted] = useState(true);
  const [completedChapters, setCompletedChapters] = useState(new Set(['1-1', '1-2']));
  const [bookmarkedChapters, setBookmarkedChapters] = useState(new Set(['1-3']));
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced course data with more details
  const diplomaCourses = [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      description: "Master the essentials of digital marketing including SEO, social media, and analytics. Learn from industry experts and get hands-on experience.",
      duration: "12 weeks",
      locked: false,
      difficulty: "Beginner",
      rating: 4.8,
      students: 15420,
      icon: FiTrendingUp,
      color: styles.accent,
      bgColor: styles.backgroundSecondary,
      completionRate: 89,
      chapters: [
        { id: 1, title: "Introduction to Digital Marketing", duration: "45 min", videoUrl: "#", notes: "Basic concepts and digital marketing landscape overview", type: "video" },
        { id: 2, title: "Search Engine Optimization", duration: "60 min", videoUrl: "#", notes: "SEO strategies, keyword research, and on-page optimization", type: "video" },
        { id: 3, title: "Social Media Marketing", duration: "50 min", videoUrl: "#", notes: "Platform-specific strategies for Facebook, Instagram, LinkedIn", type: "video" },
        { id: 4, title: "Content Marketing", duration: "55 min", videoUrl: "#", notes: "Creating engaging content that converts", type: "interactive" },
        { id: 5, title: "Analytics and Measurement", duration: "40 min", videoUrl: "#", notes: "Google Analytics, tracking, and performance metrics", type: "quiz" }
      ]
    },
    {
      id: 2,
      title: "Full-Stack Web Development",
      description: "Learn complete web development from frontend to backend with modern frameworks and best practices used by top companies.",
      duration: "16 weeks",
      locked: false,
      difficulty: "Intermediate",
      rating: 4.9,
      students: 12850,
      icon: FiCode,
      color: styles.accentSecondary,
      bgColor: styles.backgroundSecondary,
      completionRate: 94,
      chapters: [
        { id: 1, title: "HTML & CSS Mastery", duration: "90 min", videoUrl: "#", notes: "Modern HTML5 and CSS3 with Flexbox and Grid", type: "video" },
        { id: 2, title: "JavaScript ES6+", duration: "120 min", videoUrl: "#", notes: "Modern JavaScript features and best practices", type: "video" },
        { id: 3, title: "React Development", duration: "100 min", videoUrl: "#", notes: "Component-based architecture and hooks", type: "interactive" },
        { id: 4, title: "Node.js & Express", duration: "110 min", videoUrl: "#", notes: "Backend development and API creation", type: "video" },
        { id: 5, title: "Database Integration", duration: "80 min", videoUrl: "#", notes: "MongoDB and PostgreSQL integration", type: "project" }
      ]
    },
    {
      id: 3,
      title: "Data Science & Analytics",
      description: "Comprehensive introduction to data science, machine learning, and advanced analytics for business intelligence.",
      duration: "14 weeks",
      locked: true,
      difficulty: "Advanced",
      rating: 4.7,
      students: 8960,
      icon: FiBarChart,
      color: styles.status.success,
      bgColor: styles.backgroundSecondary,
      completionRate: 87,
      chapters: [
        { id: 1, title: "Python for Data Science", duration: "75 min", videoUrl: "#", notes: "NumPy, Pandas, and data manipulation", type: "video" },
        { id: 2, title: "Data Analysis & Cleaning", duration: "85 min", videoUrl: "#", notes: "Data preprocessing and exploratory analysis", type: "interactive" },
        { id: 3, title: "Machine Learning Basics", duration: "95 min", videoUrl: "#", notes: "Supervised and unsupervised learning", type: "video" },
        { id: 4, title: "Data Visualization", duration: "70 min", videoUrl: "#", notes: "Creating impactful charts and dashboards", type: "project" }
      ]
    }
  ];

  const getChapterTypeIcon = (type) => {
    switch (type) {
      case 'video': return FiPlay;
      case 'interactive': return FiTarget;
      case 'quiz': return FiCheckCircle;
      case 'project': return FiCode;
      default: return FiPlay;
    }
  };

  const getChapterTypeColor = (type) => {
    switch (type) {
      case 'video': return styles.status.info;
      case 'interactive': return styles.status.success;
      case 'quiz': return styles.status.warning;
      case 'project': return styles.accentSecondary;
      default: return styles.status.info;
    }
  };

  const DiplomaCard = ({ course, index }) => {
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
        onClick={() => isAccessible && handleViewDetails(course)}
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

  const ChapterItem = ({ chapter, courseId, isFirst, isPrevCompleted }) => {
    const isCompleted = completedChapters.has(`${courseId}-${chapter.id}`);
    const isAccessible = isFirst || isPrevCompleted;
    const isBookmarked = bookmarkedChapters.has(`${courseId}-${chapter.id}`);
    const TypeIcon = getChapterTypeIcon(chapter.type);

    return (
      <div
        className={`group relative ${styles.card.background} rounded-2xl ${styles.cardBorder} transition-all duration-300 ${styles.cardHover} ${
          isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        onClick={() => isAccessible && handleViewChapter(chapter)}
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
                  <TypeIcon className={`w-6 h-6 ${getChapterTypeColor(chapter.type)}`} />
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChapterTypeColor(chapter.type)} ${styles.badgeBackground}`}>
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
                    handleBookmark(courseId, chapter.id);
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

  const VideoPlayer = () => {
    useEffect(() => {
      if (isPlaying) {
        const interval = setInterval(() => {
          setVideoProgress(prev => prev < 100 ? prev + 0.5 : 100);
        }, 100);
        return () => clearInterval(interval);
      }
    }, [isPlaying]);

    return (
      <div className={`relative ${styles.backgroundSecondary} rounded-2xl overflow-hidden aspect-video mb-6 group`}>
        {/* Video placeholder */}
        <div className={`absolute inset-0 ${styles.background} flex items-center justify-center`}>
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full border-4 ${styles.borderSecondary} flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
              isPlaying ? styles.backgroundSecondary : `${styles.button.secondary} hover:${styles.backgroundSecondary} cursor-pointer`
            }`} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <FiPause className={`w-8 h-8 ${styles.textPrimary}`} />
              ) : (
                <FiPlay className={`w-8 h-8 ${styles.textPrimary} ml-1`} />
              )}
            </div>
            <p className={`${styles.textSecondary} text-sm`}>
              {isPlaying ? 'Playing...' : 'Click to play video'}
            </p>
          </div>
        </div>

        {/* Video controls */}
        <div className={`absolute bottom-0 left-0 right-0 ${styles.backgroundSecondary} p-4 transition-opacity duration-300 ${
          isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {/* Progress bar */}
          <div className={`w-full ${styles.progress.background} rounded-full h-1 mb-3`}>
            <div
              className={`h-1 rounded-full ${styles.progress.fill} transition-all duration-300`}
              style={{ width: `${videoProgress}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsPlaying(!isPlaying)} className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
                {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
              </button>
              <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
                <FiSkipForward className="w-5 h-5" />
              </button>
              <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
                <FiVolume2 className="w-5 h-5" />
              </button>
              <span className={`${styles.textSecondary} text-sm`}>
                {Math.floor(videoProgress * 0.45)}/45:00
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
                <FiSettings className="w-5 h-5" />
              </button>
              <button className={`${styles.textPrimary} hover:${styles.textSecondary}`}>
                <FiMaximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setCurrentView('details');
  };

  const handleViewChapter = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('chapter');
    setVideoProgress(0);
    setIsPlaying(false);
  };

  const handleCompleteChapter = () => {
    if (selectedCourse && selectedChapter) {
      const chapterKey = `${selectedCourse.id}-${selectedChapter.id}`;
      setCompletedChapters(prev => new Set([...prev, chapterKey]));
    }
  };

  const handleBookmark = (courseId, chapterId) => {
    const chapterKey = `${courseId}-${chapterId}`;
    setBookmarkedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterKey)) {
        newSet.delete(chapterKey);
      } else {
        newSet.add(chapterKey);
      }
      return newSet;
    });
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

        {/* Access Control Toggle */}
        <div className={`${styles.card.background} rounded-2xl p-6 ${styles.cardBorder} mb-8 max-w-md mx-auto`}>
          <label className="flex items-center justify-between">
            <span className={`font-medium ${styles.textPrimary}`}>Demo: User Access Control</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={userAdmitted}
                onChange={(e) => setUserAdmitted(e.target.checked)}
                className="sr-only"
                aria-label="Toggle user access"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  userAdmitted ? styles.button.primary : styles.button.secondary
                }`}
                onClick={() => setUserAdmitted(!userAdmitted)}
              >
                <div
                  className={`w-5 h-5 ${styles.card.background} rounded-full ${styles.cardShadow} transform transition-transform ${
                    userAdmitted ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </div>
          </label>
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diplomaCourses.map((course, index) => (
            <DiplomaCard key={course.id} course={course} index={index} />
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
              <div className={`w-20 h-20 rounded-2xl ${selectedCourse.color} flex items-center justify-center ${styles.textPrimary} ${styles.cardShadow}`}>
                <selectedCourse.icon className="w-10 h-10" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold ${styles.textPrimary} mb-2`}>{selectedCourse.title}</h1>
                <p className={`${styles.textSecondary} text-lg mb-4`}>{selectedCourse.description}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    <span className={`${styles.textSecondary}`}>{selectedCourse.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    <span className={`${styles.textSecondary}`}>{selectedCourse.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className={`${styles.textPrimary} font-medium`}>{selectedCourse.rating}</span>
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
              {selectedCourse.chapters.filter(chapter => 
                completedChapters.has(`${selectedCourse.id}-${chapter.id}`)
              ).length} of {selectedCourse.chapters.length} completed
            </div>
          </div>

          <div className="space-y-4">
            {selectedCourse.chapters.map((chapter, index) => {
              const isFirst = index === 0;
              const prevChapterCompleted = index === 0 || completedChapters.has(`${selectedCourse.id}-${selectedCourse.chapters[index - 1].id}`);
              return (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  courseId={selectedCourse.id}
                  isFirst={isFirst}
                  isPrevCompleted={prevChapterCompleted}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChapterView = () => {
    const isCompleted = completedChapters.has(`${selectedCourse.id}-${selectedChapter.id}`);
    const isBookmarked = bookmarkedChapters.has(`${selectedCourse.id}-${selectedChapter.id}`);

    return (
      <div className={`min-h-screen ${styles.background}`}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Back button */}
          <button
            onClick={() => setCurrentView('details')}
            className={`flex items-center ${styles.textPrimary} hover:${styles.accent} mb-8 transition-colors group`}
            aria-label="Back to course"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Course
          </button>

          {/* Chapter content */}
          <div className={`${styles.card.background} rounded-3xl p-8 ${styles.cardBorder}`}>
            {/* Chapter header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className={`text-3xl font-bold ${styles.textPrimary} mb-2`}>{selectedChapter.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FiClock className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    <span className={`${styles.textSecondary}`}>{selectedChapter.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FiEye className={`w-4 h-4 mr-1 ${styles.icon.secondary}`} />
                    <span className={`${styles.textSecondary}`}>1,234 views</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleBookmark(selectedCourse.id, selectedChapter.id)}
                  className={`p-3 rounded-xl transition-colors ${
                    isBookmarked 
                      ? `${styles.status.error} ${styles.badgeBackground}`
                      : `${styles.button.secondary} hover:${styles.status.error}`
                  }`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button className={`${styles.button.secondary} p-3 rounded-xl transition-colors`} aria-label="Download chapter">
                  <FiDownload className={`w-5 h-5 ${styles.icon.secondary}`} />
                </button>
              </div>
            </div>

            {/* Video player */}
            <VideoPlayer />

            {/* Chapter notes */}
            <div className={`${styles.backgroundSecondary} rounded-2xl p-6 mb-8`}>
              <h3 className={`font-semibold ${styles.textPrimary} mb-3 flex items-center`}>
                <FiBookOpen className={`w-5 h-5 mr-2 ${styles.accent}`} />
                Chapter Notes
              </h3>
              <p className={`${styles.textSecondary} leading-relaxed`}>{selectedChapter.notes}</p>
            </div>

            {/* Complete chapter button */}
            {!isCompleted ? (
              <button
                onClick={handleCompleteChapter}
                className={`w-full ${selectedCourse.color} ${styles.button.primary} py-4 px-6 rounded-2xl font-semibold ${styles.cardHover}`}
                aria-label="Mark chapter as complete"
              >
                Mark as Complete
              </button>
            ) : (
              <div className={`w-full ${styles.status.success} ${styles.textPrimary} py-4 px-6 rounded-2xl font-semibold text-center flex items-center justify-center`}>
                <FiCheckCircle className="w-6 h-6 mr-2" />
                Chapter Completed!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {currentView === 'courses' && renderCoursesList()}
      {currentView === 'details' && renderCourseDetails()}
      {currentView === 'chapter' && renderChapterView()}
    </div>
  );
};

export default DiplomaCoursesSection;