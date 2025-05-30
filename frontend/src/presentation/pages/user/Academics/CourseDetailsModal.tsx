import { Fragment, useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaArrowRight } from 'react-icons/fa';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (enrollmentData: { reason: string }) => void;
  course: {
    title: string;
    specialization: string;
    faculty: string;
    credits: number;
    schedule: string;
    maxEnrollment: number;
    currentEnrollment: number;
    description?: string;
    prerequisites?: string[];
  };
  isEnrolling: boolean;
}

export default function CourseDetailsModal({ isOpen, onClose, onConfirm, course, isEnrolling }: CourseDetailsModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({ reason: '' });

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowConfirmation(false);
      setEnrollmentData({ reason: '' });
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable background scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setShowConfirmation(false);
    }, 300);
  };

  const handleEnrollClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmEnrollment = () => {
    onConfirm(enrollmentData);
  };

  const handleBackToDetails = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnrollmentData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const availableSpots = course.maxEnrollment - course.currentEnrollment;
  const isFullyBooked = availableSpots <= 0;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-lg transform transition-all duration-300 ${
            isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Main Modal */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
            {/* Background glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-3xl blur transition-all duration-300"></div>
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                        <span className="text-white text-2xl relative z-10">📚</span>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
                        {course.title}
                      </h2>
                      <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-amber-100 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full font-medium">{course.credits} Credits</span>
                    <span className={isFullyBooked ? 'text-red-200' : 'text-amber-100'}>
                      {availableSpots > 0 ? `${availableSpots} spots left` : 'Fully booked'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8">
              {!showConfirmation ? (
                // Course Details View
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</p>
                      <p className="text-lg font-semibold text-gray-900">{course.specialization}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</p>
                      <p className="text-lg font-semibold text-gray-900">{course.faculty}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</p>
                    <p className="text-lg font-semibold text-gray-900">{course.schedule}</p>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 border border-amber-200/50 hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 group/item">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isFullyBooked
                              ? 'bg-red-100 text-red-800'
                              : availableSpots <= 5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isFullyBooked ? 'Full' : availableSpots <= 5 ? 'Almost Full' : 'Available'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 bg-amber-200/50 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                            style={{ width: `${(course.currentEnrollment / course.maxEnrollment) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {course.currentEnrollment} / {course.maxEnrollment}
                        </span>
                      </div>
                    </div>
                  </div>

                  {course.description && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{course.description}</p>
                    </div>
                  )}

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Prerequisites</p>
                      <div className="space-y-2">
                        {course.prerequisites.map((prereq, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700 text-sm">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-amber-100/50">
                    <button
                      onClick={handleClose}
                      className="group/btn flex-1 px-6 py-3 text-gray-700 bg-white/70 backdrop-blur-md border border-amber-200/50 hover:bg-amber-100/50 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Cancel</span>
                        <FaTimes size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                    <button
                      onClick={handleEnrollClick}
                      disabled={isFullyBooked || isEnrolling}
                      className={`group/btn flex-1 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                        isFullyBooked
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{isFullyBooked ? 'Course Full' : 'Enroll Now'}</span>
                        <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                // Confirmation View
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <FaCheck size={24} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent mt-4 mb-2">
                      Confirm Enrollment
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Please review and confirm your enrollment details for <strong>{course.title}</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Enrollment
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={enrollmentData.reason}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Please provide a brief reason for enrolling in this course..."
                        className="w-full px-4 py-2 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6 border-t border-amber-100/50">
                    <button
                      onClick={handleBackToDetails}
                      className="group/btn flex-1 px-6 py-3 text-gray-700 bg-white/70 backdrop-blur-md border border-amber-200/50 hover:bg-amber-100/50 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Back</span>
                        <FaTimes size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                    <button
                      onClick={handleConfirmEnrollment}
                      disabled={isEnrolling || !enrollmentData.reason.trim()}
                      className="group/btn flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        {isEnrolling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Enrolling...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Enrollment</span>
                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform duration-300" size={12} />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
