import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiCheck, 
  FiAlertCircle, 
  FiTrash2, 
  FiSend, 
  FiCalendar, 
  FiBookOpen, 
  FiDollarSign, 
  FiMessageSquare 
} from 'react-icons/fi';

const ApprovalModal = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDelete,
  applicantName,
}) => {
  const [action, setAction] = useState('approve');
  const [formData, setFormData] = useState({
    programDetails: '',
    startDate: '',
    scholarshipInfo: '',
    additionalNotes: '',
  });
  const [rejectReason, setRejectReason] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after modal is displayed
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'approve') {
      onApprove(formData);
    } else if (action === 'reject') {
      onReject(rejectReason);
    } else if (action === 'delete') {
      onDelete();
    }
  };

  const ActionIcon = () => {
    if (action === 'approve') return <FiCheck className="text-green-400" size={24} />;
    if (action === 'reject') return <FiX className="text-red-400" size={24} />;
    return <FiTrash2 className="text-red-400" size={24} />;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
      {/* Background overlay with particles */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm">
        {/* Ghost particles */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-500/20 blur-sm"
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
        className={`bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 
                   rounded-xl border border-purple-500/30 shadow-2xl w-full max-w-md 
                   relative overflow-hidden transition-all duration-500 transform
                   ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-purple-500/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center 
                             border border-purple-500/30 shadow-lg shadow-purple-500/10">
                <ActionIcon />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-lg">
                {action === 'approve' ? 'Approve Application' : 
                 action === 'reject' ? 'Reject Application' : 
                 'Delete Application'}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-purple-300 hover:text-white transition-colors duration-300 
                        w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-500/20"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="mt-2">
            <p className="text-purple-200">
              {action === 'approve' ? `You are about to approve ${applicantName}'s application.` :
               action === 'reject' ? `You are about to reject ${applicantName}'s application.` :
               `You are about to delete ${applicantName}'s application.`}
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex px-6 pt-4 space-x-2">
          <ActionButton 
            selected={action === 'approve'} 
            onClick={() => setAction('approve')}
            icon={<FiCheck size={18} />}
            label="Approve"
            color="blue"
          />
          <ActionButton 
            selected={action === 'reject'} 
            onClick={() => setAction('reject')}
            icon={<FiX size={18} />}
            label="Reject"
            color="red"
          />
          <ActionButton 
            selected={action === 'delete'} 
            onClick={() => setAction('delete')}
            icon={<FiTrash2 size={18} />}
            label="Delete"
            color="red"
          />
        </div>

        {/* Form content */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="mt-4">
            {action === 'approve' && (
              <div className="space-y-4">
                <FormField
                  label="Program Details"
                  icon={<FiBookOpen className="text-purple-300" />}
                  required
                >
                  <input
                    type="text"
                    value={formData.programDetails}
                    onChange={(e) => setFormData({ ...formData, programDetails: e.target.value })}
                    className="w-full bg-gray-800/80 border border-purple-500/30 rounded-lg p-3 pl-10
                              text-white placeholder-purple-300/70 focus:outline-none focus:ring-2 
                              focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="Enter program/course details"
                    required
                  />
                </FormField>

                <FormField
                  label="Start Date"
                  icon={<FiCalendar className="text-purple-300" />}
                  required
                >
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-gray-800/80 border border-purple-500/30 rounded-lg p-3 pl-10
                              text-white focus:outline-none focus:ring-2 
                              focus:ring-purple-500/50 transition-all duration-300"
                    required
                  />
                </FormField>

                <FormField
                  label="Scholarship Information"
                  icon={<FiDollarSign className="text-purple-300" />}
                >
                  <input
                    type="text"
                    value={formData.scholarshipInfo}
                    onChange={(e) => setFormData({ ...formData, scholarshipInfo: e.target.value })}
                    className="w-full bg-gray-800/80 border border-purple-500/30 rounded-lg p-3 pl-10
                              text-white placeholder-purple-300/70 focus:outline-none focus:ring-2 
                              focus:ring-purple-500/50 transition-all duration-300"
                    placeholder="Any scholarship details if applicable"
                  />
                </FormField>

                <FormField
                  label="Additional Notes"
                  icon={<FiMessageSquare className="text-purple-300" />}
                >
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    className="w-full bg-gray-800/80 border border-purple-500/30 rounded-lg p-3 pl-10
                              text-white placeholder-purple-300/70 focus:outline-none focus:ring-2 
                              focus:ring-purple-500/50 transition-all duration-300 resize-none"
                    rows={3}
                    placeholder="Any additional information"
                  />
                </FormField>
              </div>
            )}

            {action === 'reject' && (
              <FormField
                label="Reason for Rejection"
                icon={<FiMessageSquare className="text-purple-300" />}
                required
              >
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-gray-800/80 border border-purple-500/30 rounded-lg p-3 pl-10
                            text-white placeholder-purple-300/70 focus:outline-none focus:ring-2 
                            focus:ring-purple-500/50 transition-all duration-300 resize-none"
                  rows={3}
                  placeholder="Please provide a reason for rejection"
                  required
                />
              </FormField>
            )}

            {action === 'delete' && (
              <div className="p-4 mt-2 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiAlertCircle className="text-red-400" size={20} />
                  <p className="text-red-300 font-medium">
                    Warning: This action cannot be undone
                  </p>
                </div>
                <p className="text-red-200/80 mt-2 pl-8">
                  Are you sure you want to delete this application? All data associated with this application will be permanently removed.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-purple-500/30 rounded-lg text-purple-200 
                          hover:bg-purple-500/10 transition-all duration-300 focus:outline-none 
                          focus:ring-2 focus:ring-purple-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-lg text-white flex items-center space-x-2
                           transition-all duration-300 focus:outline-none focus:ring-2 
                           shadow-lg ${getButtonStyles()}`}
              >
                <span>{action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Delete'}</span>
                <FiSend size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS for animations and effects */}
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3);
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
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
          }
        }
      `}</style>
    </div>
  );
  
  function getButtonStyles() {
    if (action === 'approve') {
      return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:ring-blue-500/50 border border-blue-500/50';
    } else if (action === 'reject') {
      return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:ring-red-500/50 border border-red-500/50';
    } else {
      return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:ring-red-500/50 border border-red-500/50';
    }
  }
};

// Action button component (approve, reject, delete)
const ActionButton = ({ selected, onClick, icon, label, color }) => {
  let bgColor = 'bg-gray-800/60';
  let textColor = 'text-purple-300';
  let borderColor = 'border-transparent';
  let hoverBg = 'hover:bg-gray-700/60';
  
  if (selected) {
    if (color === 'blue') {
      bgColor = 'bg-blue-600/30';
      textColor = 'text-blue-100';
      borderColor = 'border-blue-500/50';
    } else if (color === 'red') {
      bgColor = 'bg-red-600/30';
      textColor = 'text-red-100';
      borderColor = 'border-red-500/50';
    }
  }
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg flex-1 flex items-center justify-center space-x-2
                ${bgColor} ${textColor} border ${borderColor} backdrop-blur-sm
                ${!selected && hoverBg} transition-all duration-300`}
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

// Form field wrapper component with icons
const FormField = ({ label, icon, children, required }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-purple-200 mb-1.5 flex items-center">
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