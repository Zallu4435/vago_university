import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiCheck, 
  FiSend, 
  FiCalendar, 
  FiBookOpen, 
  FiDollarSign, 
  FiMessageSquare 
} from 'react-icons/fi';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: any) => void;
  applicantName: string;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  applicantName,
}) => {
  const [formData, setFormData] = useState({
    programDetails: '',
    startDate: '',
    scholarshipInfo: '',
    additionalNotes: '',
  });
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after modal is displayed
      setTimeout(() => setAnimateIn(true), 50);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setAnimateIn(false);
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'auto';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ApprovalModal handleSubmit called!');
    console.log('Form data:', formData);
    console.log('Program details:', formData.programDetails);
    console.log('Start date:', formData.startDate);
    console.log('Calling onApprove with data:', formData);
    onApprove(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Background overlay with particles */}
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm">
        {/* Ghost particles */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/20 blur-sm"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${Math.random() * 10 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Modal container */}
      <div 
        className={`bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 
                   rounded-xl border border-blue-500/30 shadow-2xl w-full max-w-md 
                   relative overflow-y-auto max-h-[90vh] transition-all duration-500 transform
                   ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-600/5 pointer-events-none" />
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-blue-500/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center 
                             border border-blue-500/30 shadow-lg shadow-blue-500/10">
                <FiCheck className="text-blue-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-lg">
                Approve Application
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-blue-300 hover:text-white transition-colors duration-300 
                        w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500/20"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="mt-2">
            <p className="text-blue-200">
              You are about to approve {applicantName}'s application.
            </p>
          </div>
        </div>

        {/* Form content */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <FormField
                label="Program Details"
                icon={<FiBookOpen className="text-blue-300" />}
                required
              >
                <input
                  type="text"
                  value={formData.programDetails}
                  onChange={(e) => setFormData({ ...formData, programDetails: e.target.value })}
                  className="w-full bg-gray-800/80 border border-blue-500/30 rounded-lg p-3 pl-10
                            text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 
                            focus:ring-blue-500/50 transition-all duration-300"
                  placeholder="Enter program/course details"
                  required
                />
              </FormField>

              <FormField
                label="Start Date"
                icon={<FiCalendar className="text-blue-300" />}
                required
              >
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-gray-800/80 border border-blue-500/30 rounded-lg p-3 pl-10
                            text-white focus:outline-none focus:ring-2 
                            focus:ring-blue-500/50 transition-all duration-300"
                  required
                />
              </FormField>

              <FormField
                label="Scholarship Information"
                icon={<FiDollarSign className="text-blue-300" />}
              >
                <input
                  type="text"
                  value={formData.scholarshipInfo}
                  onChange={(e) => setFormData({ ...formData, scholarshipInfo: e.target.value })}
                  className="w-full bg-gray-800/80 border border-blue-500/30 rounded-lg p-3 pl-10
                            text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 
                            focus:ring-blue-500/50 transition-all duration-300"
                  placeholder="Any scholarship details if applicable"
                />
              </FormField>

              <FormField
                label="Additional Notes"
                icon={<FiMessageSquare className="text-blue-300" />}
              >
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full bg-gray-800/80 border border-blue-500/30 rounded-lg p-3 pl-10
                            text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 
                            focus:ring-blue-500/50 transition-all duration-300 resize-none"
                  rows={3}
                  placeholder="Any additional information"
                />
              </FormField>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-blue-500/30 rounded-lg text-blue-200 
                          hover:bg-blue-500/10 transition-all duration-300 focus:outline-none 
                          focus:ring-2 focus:ring-blue-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => {
                  console.log('Approve button clicked!');
                  console.log('Current form data:', formData);
                }}
                className="px-5 py-2.5 rounded-lg text-white flex items-center space-x-2
                           bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
                           border border-blue-500/50 transition-all duration-300 focus:outline-none 
                           focus:ring-2 focus:ring-blue-500/50 shadow-lg"
              >
                <span>Approve Application</span>
                <FiSend size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS for animations and effects */}
      <style>{`
        .text-shadow-lg {
          text-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
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
      `}</style>
    </div>
  );
};

// Form field wrapper component with icons
const FormField = ({ label, icon, children, required = false }: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-blue-200 mb-1.5 flex items-center">
      {label} {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default ApprovalModal;