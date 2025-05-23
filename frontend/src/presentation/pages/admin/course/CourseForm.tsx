import React from 'react';
import { FiXCircle } from 'react-icons/fi';

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
  const [formData, setFormData] = React.useState({
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      {/* Floating ghost particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/10 blur-md"
          style={{
            width: `${Math.random() * 12 + 4}px`,
            height: `${Math.random() * 12 + 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Main purple glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-2xl mx-4 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/20 overflow-hidden">
        <div className="p-6 border-b border-purple-500/20 sticky top-0 bg-gray-800/70 backdrop-blur-md z-20 flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-300">{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-purple-900/30 transition-all duration-300 text-purple-300 hover:text-white"
          >
            <FiXCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Credits</label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">Faculty</label>
              <select
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">Term</label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Schedule</label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="e.g., MWF 10:00-11:45"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Max Enrollment</label>
                <input
                  type="number"
                  value={formData.maxEnrollment}
                  onChange={(e) => setFormData({ ...formData, maxEnrollment: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-purple-300 bg-gray-900/50 border border-purple-500/20 rounded-lg hover:bg-gray-900/70"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700"
              disabled={!formData.title || !formData.specialization || !formData.faculty || !formData.term}
            >
              {isEditing ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
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