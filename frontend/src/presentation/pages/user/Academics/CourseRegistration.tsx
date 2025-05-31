import { useState } from 'react';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import { useCourseRegistration } from '../../../../application/hooks/useAcademic';
import CourseDetailsModal from './CourseDetailsModal';

export default function CourseRegistration({ studentInfo, courses, enrolledCredits, waitlistedCredits }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { registerForCourse, isRegistering } = useCourseRegistration();

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleConfirmEnrollment = async (enrollmentData) => {
    if (selectedCourse) {
      try {
        await registerForCourse({
          courseId: selectedCourse._id,
          reason: enrollmentData.reason,
        });
        setIsModalOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        console.error('Failed to enroll in course:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r from-orange-600 to-amber-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30"></div>
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                  <FaSearch size={20} className="text-white relative z-10" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Course Registration Portal
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
              </div>
            </div>
            <span className="text-white font-medium bg-amber-500/80 px-3 py-1 rounded-full border border-amber-200/50">Fall 2025</span>
          </div>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/70 backdrop-blur-md p-6 shadow-xl rounded-b-2xl mb-6 border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Registration Status</h3>
            <div className="text-gray-600 text-sm">
              <p className="mb-1">Time Ticket: May 15, 9:00 AM</p>
              <p>Credits Eligible: 20</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Registration Actions</h3>
            <button className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
              <span className="flex items-center justify-center space-x-2">
                <span>Register for Classes</span>
                <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
              </span>
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Registration</h3>
            <div className="text-gray-600 text-sm">
              <p className="mb-1">Enrolled: {20 - Number(studentInfo.credits)} credits</p>
              <p>Waitlisted: {studentInfo.pendingCredits} credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Table */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
        <div className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <label htmlFor="search" className="text-gray-800 font-medium mb-2 md:mb-0">Search Courses:</label>
            <div className="flex w-full md:w-2/3 lg:w-1/2">
              <div className="relative flex-grow">
                <FaSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                <input
                  type="text"
                  id="search"
                  className="w-full pl-10 pr-4 py-2 rounded-l-full bg-white/70 backdrop-blur-md border border-amber-100/50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  placeholder="Enter course name or code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 rounded-r-full flex items-center transition-all duration-300 shadow-sm hover:shadow-md">
                <FaSearch size={18} />
                <span className="ml-2 hidden sm:inline">Search</span>
              </button>
            </div>
            <a
              href="#"
              className="group/link relative text-orange-600 hover:text-orange-700 mt-2 md:mt-0 md:ml-4 text-sm transition-all duration-300"
            >
              Advanced Search
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-400 to-amber-500 group-hover/link:w-full transition-all duration-300 rounded-full"></div>
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b border-amber-200/50">Course</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b border-amber-200/50">Title</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b border-amber-200/50">Credits</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b border-amber-200/50">Instructor</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b border-amber-200/50">Schedule</th>
                  <th className="py-3 px-4 text-center text-gray-800 font-semibold border-b border-amber-200/50">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="group/item border-b border-amber-100/50 hover:bg-amber-50/50 transition-all duration-300"
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium">{course.specialization || course.code}</td>
                    <td className="py-3 px-4 text-gray-600">{course.title}</td>
                    <td className="py-3 px-4 text-gray-600">{course.credits}</td>
                    <td className="py-3 px-4 text-gray-600">{course.instructor || course.faculty}</td>
                    <td className="py-3 px-4 text-gray-600">{course.schedule}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleEnrollClick(course)}
                        className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-1 px-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        <span className="flex items-center space-x-2">
                          <span>Add</span>
                          <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
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
