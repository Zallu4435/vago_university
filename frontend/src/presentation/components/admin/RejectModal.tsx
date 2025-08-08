import React, { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle, FiSend } from 'react-icons/fi';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  applicantName: string;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onReject,
  applicantName,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setAnimateIn(false);
      setRejectReason('');
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = rejectReason.trim() || 'Application rejected';
    onReject(finalReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-red-500/20 blur-sm"
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

      <div 
        className={`bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 
                   rounded-xl border border-red-500/30 shadow-2xl w-full max-w-md 
                   relative overflow-hidden transition-all duration-500 transform mx-4
                   ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-600/5 pointer-events-none" />
        
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-tr-full" />
        
        <div className="relative px-6 pt-6 pb-4 border-b border-red-500/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center 
                             border border-red-500/30 shadow-lg shadow-red-500/10">
                <FiAlertTriangle className="text-red-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-lg">
                Reject Application
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-red-300 hover:text-white transition-colors duration-300 
                        w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="mt-2">
            <p className="text-red-200">
              You are about to reject {applicantName}'s application.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-red-200 mb-1.5">
                  Reason for Rejection
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <FiAlertTriangle className="text-red-300" size={16} />
                  </div>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-gray-800/80 border border-red-500/30 rounded-lg p-3 pl-10
                              text-white placeholder-red-300/50 focus:outline-none focus:ring-2 
                              focus:ring-red-500/50 transition-all duration-300 resize-none"
                    rows={4}
                    placeholder="Please provide a reason for rejection (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-gray-500/30 rounded-lg text-gray-200 
                          hover:bg-gray-500/10 transition-all duration-300 focus:outline-none 
                          focus:ring-2 focus:ring-gray-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-white flex items-center space-x-2
                           bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600
                           border border-red-500/50 transition-all duration-300 focus:outline-none 
                           focus:ring-2 focus:ring-red-500/50 shadow-lg"
              >
                <span>Reject Application</span>
                <FiSend size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .text-shadow-lg {
          text-shadow: 0 0 15px rgba(239, 68, 68, 0.5), 0 0 10px rgba(239, 68, 68, 0.3);
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

export default RejectModal; 