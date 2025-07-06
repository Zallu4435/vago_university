import { useState, useMemo } from 'react';
import { FaSearch, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useCourseRegistration, useCourseSearch } from '../../../../application/hooks/useAcademic';
import CourseDetailsModal from './CourseDetailsModal';
import { usePreferences } from '../../../context/PreferencesContext';

// Import the Course type from the service instead of defining it locally
import { Course } from '../../../../application/services/academicService';

interface StudentInfo {
  credits: number;
  pendingCredits: number;
}

interface CourseRegistrationProps {
  studentInfo: StudentInfo;
  courses: Course[];
  enrolledCredits: number;
  waitlistedCredits: number;
}

export default function CourseRegistration({ studentInfo, courses, enrolledCredits, waitlistedCredits }: CourseRegistrationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { registerForCourse, isRegistering } = useCourseRegistration();
  const { styles, theme } = usePreferences();

  // Use debounced search hook that handles both search and default courses
  const { data: searchResults, isLoading: isSearching, error: searchError } = useCourseSearch(searchQuery, 500);

  // Determine which courses to display
  const displayCourses = useMemo(() => {
    if (searchQuery.trim()) {
      return searchResults || [];
    }
    return courses;
  }, [searchQuery, searchResults, courses]);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleConfirmEnrollment = async (enrollmentData: { reason: string }) => {
    if (selectedCourse) {
      try {
        await registerForCourse({
          courseId: selectedCourse.id,
          term: 'Fall 2025', // Default term
          section: '001', // Default section
          reason: enrollmentData.reason,
        });
        setIsModalOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        console.error('Failed to enroll in course:', error);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full sm:px-4 md:px-4 mt-4 sm:mt-6">
      {/* Header Section */}
      <div className={`relative overflow-hidden rounded-t-xl sm:rounded-t-2xl shadow-xl bg-gradient-to-r ${styles.accent} group`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-2xl sm:blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-xl sm:blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaSearch size={16} className="sm:w-5 sm:h-5 text-white relative z-10" />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <div>
                <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                  Course Registration Portal
                </h2>
                <div className={`h-0.5 sm:h-1 w-12 sm:w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-16 sm:group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
            <span className={`text-white font-medium ${styles.button.secondary} px-2 sm:px-3 py-1 rounded-full border ${styles.border} text-xs sm:text-sm`}>Fall 2025</span>
          </div>
        </div>
      </div>

      {/* Status and Actions */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 ${styles.card.background} p-4 sm:p-5 md:p-6 shadow-xl rounded-b-xl sm:rounded-b-2xl mb-4 sm:mb-6 border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-3 sm:p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-xl sm:rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Registration Status</h3>
            <div className={`text-xs sm:text-sm ${styles.textSecondary}`}>
              <p className="mb-1">Time Ticket: May 15, 9:00 AM</p>
              <p>Credits Eligible: 20</p>
            </div>
          </div>
        </div>
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-3 sm:p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-xl sm:rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Registration Actions</h3>
            <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 text-xs sm:text-sm`}>
              <span className="flex items-center justify-center space-x-1 sm:space-x-2">
                <span>Register for Courses</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={10} />
              </span>
            </button>
          </div>
        </div>
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.accentSecondary} p-3 sm:p-4 border ${styles.border} hover:${styles.card.hover} transition-all duration-300 group/item sm:col-span-2 lg:col-span-1`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-xl sm:rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Current Registration</h3>
            <div className={`text-xs sm:text-sm ${styles.textSecondary}`}>
              <p className="mb-1">Enrolled: {enrolledCredits} credits</p>
              <p>Waitlisted: {waitlistedCredits} credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-xl sm:rounded-2xl blur transition-all duration-300`}></div>
        <div className="relative z-10 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col space-y-3 mb-4 sm:mb-6">
            {/* Search Label */}
            <div className="flex justify-center">
              <label htmlFor="search" className={`text-gray-800 font-medium text-sm sm:text-base`}>Search Courses:</label>
            </div>
            
            {/* Centered Search Input with Results Count */}
            <div className="flex justify-center items-center space-x-3">
              <div className="flex w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div className="relative flex-grow">
                <FaSearch size={14} className={`absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 ${styles.icon.primary} ${isSearching ? 'animate-pulse' : ''}`} />
                <input
                  type="text"
                  id="search"
                  className={`w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-l-full ${styles.input.background} border ${styles.input.border} focus:${styles.input.focus} transition-all duration-300 text-xs sm:text-sm`}
                  placeholder={isSearching ? "Searching..." : "Enter course name or code"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
                {searchQuery && !isSearching && (
                  <button
                    onClick={handleClearSearch}
                    className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 ${styles.textSecondary} hover:${styles.textPrimary}`}
                    type="button"
                    aria-label="Clear search"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <button 
                className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white px-3 sm:px-4 rounded-r-full flex items-center transition-all duration-300 shadow-sm hover:shadow-md ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSearching}
              >
                <FaSearch size={14} />
                <span className="ml-1 sm:ml-2 hidden sm:inline text-xs sm:text-sm">Search</span>
              </button>
            </div>
            
            {/* Results Count */}
            {searchQuery.trim() && !isSearching && (
              <span className={`text-xs sm:text-sm ${styles.textSecondary} whitespace-nowrap`}>
                {displayCourses.length} result{displayCourses.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`bg-gradient-to-r ${styles.accentSecondary}`}>
                  <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-800 font-semibold border-b ${styles.border} text-xs sm:text-sm`}>Course</th>
                  <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-800 font-semibold border-b ${styles.border} text-xs sm:text-sm hidden sm:table-cell`}>Title</th>
                  <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-800 font-semibold border-b ${styles.border} text-xs sm:text-sm`}>Credits</th>
                  <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-800 font-semibold border-b ${styles.border} text-xs sm:text-sm hidden md:table-cell`}>Instructor</th>
                  <th className={`py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-800 font-semibold border-b ${styles.border} text-xs sm:text-sm hidden lg:table-cell`}>Schedule</th>
                  <th className={`py-2 sm:py-3 px-2 sm:px-4 text-center text-gray-800 font-semibold border-b ${styles.border} text-xs sm:text-sm`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {searchError && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-red-600 text-sm">
                      Error loading search results. Please try again.
                    </td>
                  </tr>
                )}
                {isSearching && searchQuery.trim() && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600 text-sm">Searching courses...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!searchError && !isSearching && displayCourses.length === 0 && searchQuery.trim() && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500 text-sm">
                      No courses found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
                {!searchError && !isSearching && displayCourses.length === 0 && !searchQuery.trim() && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500 text-sm">
                      No courses available
                    </td>
                  </tr>
                )}
                {displayCourses.map((course) => (
                  <tr
                    key={course.id}
                    className={`group/item border-b ${styles.border} hover:bg-amber-50/50 transition-all duration-300`}
                  >
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 ${styles.textPrimary} font-medium text-xs sm:text-sm`}>
                      <div>
                        <div>{course.specialization}</div>
                        <div className={`${styles.textSecondary} text-xs sm:hidden`}>{course.title}</div>
                      </div>
                    </td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 ${styles.textSecondary} text-xs sm:text-sm hidden sm:table-cell`}>{course.title}</td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 ${styles.textSecondary} text-xs sm:text-sm`}>{course.credits}</td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 ${styles.textSecondary} text-xs sm:text-sm hidden md:table-cell`}>{course.faculty}</td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 ${styles.textSecondary} text-xs sm:text-sm hidden lg:table-cell`}>{course.schedule}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                      <button
                        onClick={() => handleEnrollClick(course)}
                        className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-1 px-2 sm:px-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 text-xs`}
                      >
                        <span className="flex items-center space-x-1 sm:space-x-2">
                          <span>Add</span>
                          <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={10} />
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <CourseDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
          onConfirm={handleConfirmEnrollment}
          course={selectedCourse}
          isEnrolling={isRegistering}
        />
      )}
    </div>
  );
}