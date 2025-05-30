import React, { useEffect, useState } from 'react';
import { FiXCircle, FiPlus, FiX, FiBook } from 'react-icons/fi';

interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
  specializations: string[];
  faculties: string[];
  terms: string[];
}

const CourseForm: React.FC<CourseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  specializations,
  faculties,
  terms,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    specialization: '',
    credits: 0,
    faculty: '',
    schedule: '',
    maxEnrollment: 0,
    prerequisites: [] as string[],
    term: '',
    ...initialData,
  });

  const [newPrerequisite, setNewPrerequisite] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, newPrerequisite.trim()],
      });
      setNewPrerequisite('');
    }
  };

  const handleRemovePrerequisite = (prerequisite: string) => {
    setFormData({
      ...formData,
      prerequisites: formData.prerequisites.filter((p) => p !== prerequisite),
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title || !formData.specialization || !formData.faculty || !formData.term) {
      return;
    }

    // Convert numeric fields to numbers
    const submitData = {
      ...formData,
      credits: Number(formData.credits),
      maxEnrollment: Number(formData.maxEnrollment),
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Modal Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-600/30"
                style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
              >
                <FiBook size={24} className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">
                  {isEditing ? 'Edit Course' : 'Add New Course'}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiXCircle size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="space-y-4">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-purple-300 mb-2">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations
                    .filter((spec) => spec !== 'All Specializations')
                    .map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-purple-300 mb-2">Credits</label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Faculty</label>
              <select
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              >
                <option value="">Select Faculty</option>
                {faculties
                  .filter((faculty) => faculty !== 'All Faculties')
                  .map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
              </select>
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Term</label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              >
                <option value="">Select Term</option>
                {terms
                  .filter((term) => term !== 'All Terms')
                  .map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-purple-300 mb-2">Schedule</label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="e.g., MWF 10:00-11:45"
                  className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-purple-300 mb-2">Max Enrollment</label>
                <input
                  type="number"
                  value={formData.maxEnrollment}
                  onChange={(e) => setFormData({ ...formData, maxEnrollment: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Prerequisites</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Enter prerequisite course"
                    className="flex-1 px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button
                    onClick={handleAddPrerequisite}
                    className="px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-colors"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map((prerequisite, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-900/60 border border-purple-600/30 rounded-lg text-purple-300"
                    >
                      <span>{prerequisite}</span>
                      <button
                        onClick={() => handleRemovePrerequisite(prerequisite)}
                        className="text-purple-300 hover:text-white"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.title || !formData.specialization || !formData.faculty || !formData.term}
              >
                {isEditing ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CourseForm;